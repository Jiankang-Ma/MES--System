#!/usr/bin/env node
/**
 * 目录、菜单、按钮权限与审计集成测试。
 *
 * 不测试数据权限/数据隔离：项目说明书只承诺组织、部门、岗位、角色及目录/菜单/按钮访问权限。
 * 所有角色、用户、角色授权、通知和日志夹具使用 AUTOTEST_AUTH_ 标记并在 finally 中清理。
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testsDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(testsDir, '..');
const apiSettings = join(root, '源码', 'iMES.Net', 'iMES.WebApi', 'appsettings.json');
const resultsDir = join(testsDir, 'results');
const marker = `AUTOTEST_AUTH_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const report = { startedAt: new Date().toISOString(), marker, tests: [], cleanup: null };

function assert(value, message) {
  if (!value) throw new Error(message);
}

function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, 'utf8').split(/\r?\n/)
    .map((line) => line.trim()).filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]));
}

const env = parseDotEnv(join(root, '.env'));
const sqlPassword = process.env.MSSQL_SA_PASSWORD || env.MSSQL_SA_PASSWORD;
const sqlDatabase = process.env.MES_DATABASE || 'iMES';

function run(command, args) {
  try {
    return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    const text = `${error.stdout || ''}\n${error.stderr || ''}`.replaceAll(sqlPassword || '', '***').trim();
    throw new Error(`${command} ${args.slice(0, 4).join(' ')} failed: ${text}`);
  }
}

function sql(query) {
  // -b 让 SQL 语句错误返回非零退出码，避免夹具插入失败却继续执行。
  return run('docker', ['compose', 'exec', '-T', 'sqlserver-x64', '/opt/mssql-tools18/bin/sqlcmd', '-b', '-S', 'localhost', '-U', 'sa', '-P', sqlPassword, '-d', sqlDatabase, '-C', '-h', '-1', '-W', '-s', '|', '-Q', query]);
}

function sqlScalar(query) {
  const line = sql(query).split(/\r?\n/).map((value) => value.trim()).find((value) => value && !/^\(\d+ rows? affected\)$/i.test(value));
  assert(line, `SQL 未返回结果：${query.slice(0, 120)}`);
  return line.split('|')[0].trim();
}

function sqlText(value) {
  return `N'${String(value).replaceAll("'", "''")}'`;
}

function jwtSecret() {
  const match = readFileSync(apiSettings, 'utf8').match(/"JWT"\s*:\s*"([^"]+)"/);
  assert(match, '无法读取 JWT 配置。');
  return match[1];
}

function tokenFor(userId) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  // 与 JwtHelper.IssueJwt 的 jti 保持一致，同时显式提供 NameIdentifier，兼容 ASP.NET JWT 入站 claim 映射。
  const payload = Buffer.from(JSON.stringify({
    jti: String(userId),
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': String(userId),
    iat: now, nbf: now, exp: now + 3600, iss: 'iMES.core.owner', aud: 'iMES.core',
  })).toString('base64url');
  const signature = createHmac('sha256', jwtSecret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

async function request(path, { method = 'POST', token, body, headers = {} } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  return { httpStatus: response.status, data, text };
}

function successful(result) {
  return result?.data?.status ?? result?.data?.Status;
}

function apiSucceeded(result) {
  const value = successful(result);
  // 通用保存接口使用 true；分页接口 PageGridData 使用 0 表示成功。
  return value === true || value === 0 || value === '0';
}

function permissionDenied(result) {
  return [200, 401, 403].includes(result.httpStatus) && successful(result) === false;
}

function rows(result) {
  const data = result?.data?.data ?? result?.data?.Data ?? result?.data;
  return Array.isArray(data) ? data : (data?.rows || []);
}

function addTest(name, details) {
  report.tests.push({ name, status: 'passed', details });
}

function pageRequest() {
  return { page: 1, rows: 10, sort: 'CreateDate', order: 'desc', wheres: '[]' };
}

const fixture = { roleId: null, userId: null, noticeId: null, menuId: null, menuParentId: null, menuName: null, menuType: 0, menuAuth: null };

function clean() {
  if (!sqlPassword) return;
  const predicate = `${sqlText(`${marker}%`)}`;
  const userLogPredicate = fixture.userId ? `User_Id=${fixture.userId} OR ` : '';
  sql(`DELETE FROM Sys_Log WHERE ${userLogPredicate}UserName LIKE ${predicate} OR RequestParameter LIKE ${predicate}; DELETE FROM Base_Notice WHERE NoticeTitle LIKE ${predicate};`);
  if (fixture.userId) sql(`DELETE FROM Sys_User_ExtendData WHERE User_Id=${fixture.userId}; DELETE FROM Sys_User WHERE User_Id=${fixture.userId};`);
  if (fixture.roleId) sql(`DELETE FROM Sys_RoleAuth WHERE Role_Id=${fixture.roleId}; DELETE FROM Sys_Role WHERE Role_Id=${fixture.roleId};`);
}

async function waitForLog(logType, userId) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const count = Number(sqlScalar(`SELECT COUNT(1) FROM Sys_Log WHERE User_Id=${userId} AND LogType=${sqlText(logType)}`));
    if (count > 0) return count;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  return 0;
}

let failure;
try {
  assert(sqlPassword, '未找到 MSSQL_SA_PASSWORD；请在项目根目录 .env 中配置。');
  assert(run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim(), 'SQL Server 未启动。');
  assert(run('docker', ['compose', 'ps', '-q', 'api']).trim(), 'API 未启动。');

  const menu = sql(`SELECT TOP (1) CONCAT(Menu_Id,'|',ParentId,'|',MenuName,'|',ISNULL(MenuType,0),'|',ISNULL(Auth,'')) FROM Sys_Menu WHERE TableName='Base_Notice' AND Enable IN (1,2) ORDER BY Menu_Id`);
  const menuLine = menu.split(/\r?\n/).map((line) => line.trim()).find((line) => line.includes('|'));
  assert(menuLine, '未找到 Base_Notice 菜单，无法建立菜单/按钮权限夹具。');
  [fixture.menuId, fixture.menuParentId, fixture.menuName, fixture.menuType, fixture.menuAuth] = menuLine.split('|');
  fixture.menuId = Number(fixture.menuId); fixture.menuParentId = Number(fixture.menuParentId); fixture.menuType = Number(fixture.menuType);
  const permissionHeaders = fixture.menuType === 1 ? { uapp: '1' } : {};

  fixture.roleId = Number(sqlScalar(`INSERT INTO Sys_Role (ParentId,RoleName,DeptName,OrderNo,Creator,CreateDate,Enable) OUTPUT INSERTED.Role_Id VALUES (1,${sqlText(marker)},'',9999,${sqlText(marker)},GETDATE(),1)`));
  // User_Id 是 SQL Server IDENTITY：由数据库分配，既满足表约束，也避免复用被缓存的旧用户 ID。
  fixture.userId = Number(sqlScalar(`INSERT INTO Sys_User (UserName,Role_Id,RoleName,UserTrueName,UserPwd,CreateDate,IsRegregisterPhone,Enable,Creator) OUTPUT INSERTED.User_Id VALUES (${sqlText(marker)},${fixture.roleId},${sqlText(marker)},${sqlText(`AUTH_${process.pid}`)},'AUTOTEST',GETDATE(),0,1,${sqlText(marker)})`));
  assert(Number.isInteger(fixture.userId) && fixture.userId > 0, `无法分配有效测试用户 ID：${fixture.userId}`);
  const restrictedToken = tokenFor(fixture.userId);
  const adminId = Number(sqlScalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName='admin' ORDER BY User_Id"));
  const adminToken = tokenFor(adminId);

  const permissionPayload = (actions) => [{ Id: fixture.menuId, Pid: fixture.menuParentId, Text: fixture.menuName, IsApp: fixture.menuType === 1, Actions: actions.map((Value) => ({ Value })) }];
  const initialGrant = await request(`/api/Sys_Role/savePermission?roleId=${fixture.roleId}`, { token: adminToken, body: permissionPayload(['Search']) });
  assert(initialGrant.httpStatus === 200 && successful(initialGrant), `管理员授予 Search 权限失败：${initialGrant.text.slice(0, 300)}`);
  report.fixture = {
    ...fixture,
    savedAuthValue: sqlScalar(`SELECT AuthValue FROM Sys_RoleAuth WHERE Role_Id=${fixture.roleId} AND Menu_Id=${fixture.menuId}`),
    userRow: sqlScalar(`SELECT CONCAT(User_Id,'|',Role_Id,'|',UserName,'|',Enable) FROM Sys_User WHERE User_Id=${fixture.userId}`),
  };

  const anonymousMenu = await request('/api/menu/getTreeMenu', { method: 'GET' });
  assert(anonymousMenu.httpStatus === 401, `未登录菜单请求应返回 401，实际 HTTP ${anonymousMenu.httpStatus}`);
  addTest('未登录菜单请求被 JWT 拒绝', { httpStatus: anonymousMenu.httpStatus });

  const currentAdmin = await request('/api/User/getCurrentUserInfo', { token: adminToken });
  report.fixture.currentAdmin = currentAdmin.data;
  assert(currentAdmin.httpStatus === 200 && successful(currentAdmin), `管理员令牌查询当前用户失败：${currentAdmin.text.slice(0, 300)}`);
  const currentUser = await request('/api/User/getCurrentUserInfo', { token: restrictedToken });
  report.fixture.currentUser = currentUser.data;
  assert(currentUser.httpStatus === 200 && successful(currentUser)
    && (currentUser.data?.data?.roleName || currentUser.data?.Data?.RoleName) === marker,
  `测试令牌未映射到临时受限用户：${currentUser.text.slice(0, 300)}`);
  addTest('临时用户令牌映射到对应角色', { roleName: currentUser.data?.data?.roleName || currentUser.data?.Data?.RoleName });

  const menuBefore = await request('/api/menu/getTreeMenu', { method: 'GET', token: restrictedToken, headers: permissionHeaders });
  // getTreeMenu 按接口约定直接返回菜单数组，不封装 WebResponseContent。
  assert(menuBefore.httpStatus === 200 && Array.isArray(menuBefore.data), `受限用户菜单查询失败：${menuBefore.text.slice(0, 300)}`);
  const noticeMenuBefore = rows(menuBefore).find((item) => Number(item.id) === fixture.menuId);
  assert(noticeMenuBefore, '受限用户未取得已授权的通知菜单。');
  const beforeActions = noticeMenuBefore.permission || [];
  assert(beforeActions.includes('Search') && !beforeActions.includes('Add'), `受限用户初始菜单按钮权限错误：${JSON.stringify(beforeActions)}`);
  addTest('目录/菜单/按钮权限只返回 Search', { menuId: fixture.menuId, permissions: beforeActions });

  const page = await request('/api/Base_Notice/GetPageData', { token: restrictedToken, headers: permissionHeaders, body: pageRequest() });
  assert(page.httpStatus === 200 && apiSucceeded(page), `已授权 Search 应可查询通知：${page.text.slice(0, 300)}`);
  addTest('受限用户可执行已授权 Search', { httpStatus: page.httpStatus });

  const deniedAdd = await request('/api/Base_Notice/Add', { token: restrictedToken, headers: permissionHeaders, body: { mainData: { NoticeType: 'AUTOTEST', NoticeTitle: marker, NoticeContent: marker }, detailData: [] } });
  assert(permissionDenied(deniedAdd), `未授权 Add 未被拒绝：${deniedAdd.text.slice(0, 300)}`);
  const deniedDelete = await request('/api/Base_Notice/Del', { token: restrictedToken, headers: permissionHeaders, body: [999999999] });
  assert(permissionDenied(deniedDelete), `未授权 Delete 未被拒绝：${deniedDelete.text.slice(0, 300)}`);
  addTest('直接调用未授权 Add/Delete 被拒绝', { addMessage: deniedAdd.data?.message || deniedAdd.data?.Message, deleteMessage: deniedDelete.data?.message || deniedDelete.data?.Message });

  const deniedPermissionChange = await request(`/api/Sys_Role/savePermission?roleId=${fixture.roleId}`, { token: restrictedToken, body: [] });
  assert(permissionDenied(deniedPermissionChange), `受限用户权限提升请求未被拒绝：${deniedPermissionChange.text.slice(0, 300)}`);
  const deniedMenuSave = await request('/api/menu/save', { token: restrictedToken, body: {} });
  assert(permissionDenied(deniedMenuSave), `受限用户菜单管理请求未被拒绝：${deniedMenuSave.text.slice(0, 300)}`);
  addTest('受限用户不能修改角色权限或菜单', { rolePermissionMessage: deniedPermissionChange.data?.message || deniedPermissionChange.data?.Message, menuMessage: deniedMenuSave.data?.message || deniedMenuSave.data?.Message });

  const grantAdd = await request(`/api/Sys_Role/savePermission?roleId=${fixture.roleId}`, {
    token: adminToken,
    body: permissionPayload(['Search', 'Add']),
  });
  assert(grantAdd.httpStatus === 200 && successful(grantAdd), `管理员授予 Add 权限失败：${grantAdd.text.slice(0, 300)}`);
  const menuAfter = await request('/api/menu/getTreeMenu', { method: 'GET', token: restrictedToken, headers: permissionHeaders });
  assert(menuAfter.httpStatus === 200 && Array.isArray(menuAfter.data), `变更授权后菜单查询失败：${menuAfter.text.slice(0, 300)}`);
  const noticeMenuAfter = rows(menuAfter).find((item) => Number(item.id) === fixture.menuId);
  const afterActions = noticeMenuAfter?.permission || [];
  assert(afterActions.includes('Search') && afterActions.includes('Add'), `权限缓存未刷新或 Add 未生效：${JSON.stringify(afterActions)}`);
  addTest('管理员变更角色按钮权限后缓存刷新', { permissions: afterActions });

  const allowedAdd = await request('/api/Base_Notice/Add', { token: restrictedToken, headers: permissionHeaders, body: { mainData: { NoticeType: 'AUTOTEST', NoticeTitle: marker, NoticeContent: marker }, detailData: [] } });
  assert(allowedAdd.httpStatus === 200 && successful(allowedAdd), `已授权 Add 仍失败：${allowedAdd.text.slice(0, 300)}`);
  fixture.noticeId = Number(sqlScalar(`SELECT TOP (1) Notice_Id FROM Base_Notice WHERE NoticeTitle=${sqlText(marker)} ORDER BY Notice_Id DESC`));
  assert(fixture.noticeId > 0, '已授权 Add 未创建通知记录。');
  const addLogs = await waitForLog('Add', fixture.userId);
  assert(addLogs > 0, '新增通知后未找到对应的 Add 审计日志。');
  addTest('已授权 Add 创建数据并记录审计日志', { noticeId: fixture.noticeId, addLogs });

  const deniedDeleteAfterAdd = await request('/api/Base_Notice/Del', { token: restrictedToken, headers: permissionHeaders, body: [fixture.noticeId] });
  assert(permissionDenied(deniedDeleteAfterAdd), `仅有 Add 权限时 Delete 未被拒绝：${deniedDeleteAfterAdd.text.slice(0, 300)}`);
  addTest('新增权限不隐含 Delete 权限', { deleteMessage: deniedDeleteAfterAdd.data?.message || deniedDeleteAfterAdd.data?.Message });

  const grantAuditActions = await request(`/api/Sys_Role/savePermission?roleId=${fixture.roleId}`, {
    token: adminToken,
    body: permissionPayload(['Search', 'Add', 'Update', 'Delete', 'Export']),
  });
  assert(grantAuditActions.httpStatus === 200 && successful(grantAuditActions), `管理员授予 Update/Delete/Export 权限失败：${grantAuditActions.text.slice(0, 300)}`);

  const updatedTitle = `${marker}_UPDATED`;
  const updated = await request('/api/Base_Notice/Update', {
    token: restrictedToken,
    headers: permissionHeaders,
    // 无明细表时必须传 null；空数组会触发框架对不存在明细实体的校验。
    body: { mainData: { Notice_Id: fixture.noticeId, NoticeType: 'AUTOTEST', NoticeTitle: updatedTitle, NoticeContent: marker }, detailData: null, delKeys: null },
  });
  assert(updated.httpStatus === 200 && successful(updated), `已授权 Update 仍失败：${updated.text.slice(0, 300)}`);
  const editLogs = await waitForLog('Edit', fixture.userId);
  assert(editLogs > 0, '修改通知后未找到对应的 Edit 审计日志。');
  addTest('已授权 Update 修改数据并记录审计日志', { noticeId: fixture.noticeId, editLogs });

  const exported = await request('/api/Base_Notice/Export', {
    token: restrictedToken,
    headers: permissionHeaders,
    body: { ...pageRequest(), wheres: JSON.stringify([{ name: 'NoticeTitle', value: marker, displayType: 'like' }]) },
  });
  assert(exported.httpStatus === 200 && /attachment/i.test(exported.text) === false, `已授权 Export 失败：${exported.text.slice(0, 300)}`);
  const exportLogs = await waitForLog('Export', fixture.userId);
  assert(exportLogs > 0, '导出通知后未找到对应的 Export 审计日志。');
  addTest('已授权 Export 导出数据并记录审计日志', { httpStatus: exported.httpStatus, exportLogs });

  const allowedDelete = await request('/api/Base_Notice/Del', { token: restrictedToken, headers: permissionHeaders, body: [fixture.noticeId] });
  assert(allowedDelete.httpStatus === 200 && successful(allowedDelete), `已授权 Delete 仍失败：${allowedDelete.text.slice(0, 300)}`);
  const deleteLogs = await waitForLog('Del', fixture.userId);
  assert(deleteLogs > 0, '删除通知后未找到对应的 Del 审计日志。');
  assert(Number(sqlScalar(`SELECT COUNT(1) FROM Base_Notice WHERE Notice_Id=${fixture.noticeId}`)) === 0, '已授权 Delete 后通知记录仍存在。');
  fixture.noticeId = null;
  addTest('已授权 Delete 删除数据并记录审计日志', { deleteLogs });

  report.status = 'passed';
} catch (error) {
  failure = error;
  report.status = 'failed';
  report.error = String(error.stack || error.message).replaceAll(sqlPassword || '', '***');
} finally {
  try { clean(); report.cleanup = 'passed'; } catch (error) { report.cleanup = `failed: ${String(error.message).replaceAll(sqlPassword || '', '***')}`; failure ||= error; }
  report.finishedAt = new Date().toISOString();
  report.summary = { passed: report.tests.filter((item) => item.status === 'passed').length, failed: report.status === 'failed' ? 1 : 0 };
  mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `authorization-regression-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ ...report.summary, cleanup: report.cleanup, resultPath }, null, 2)}\n`);
}

if (failure) process.exitCode = 1;
