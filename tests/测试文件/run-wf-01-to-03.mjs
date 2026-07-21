#!/usr/bin/env node
/**
 * WF-01~WF-03 独立集成测试。
 * WF-01 实测验证码签发、错误验证码拒绝及验证码一次性失效；正确验证码成功登录须由 UI/人工读取动态图片。
 * WF-02 核对当前代码与数据库是否存在车间业务模块。
 * WF-03 创建、查询、重复校验并删除不良品项；所有夹具使用 AUTOTEST_WF_ 前缀。
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..');
const apiRoot = join(root, '源码', 'iMES.Net', 'iMES.WebApi');
const resultsDir = join(scriptDir, 'results');
const marker = `AUTOTEST_WF_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const report = { startedAt: new Date().toISOString(), marker, tests: [], cleanup: null };

function fail(message) { throw new Error(message); }
function assert(condition, message) { if (!condition) fail(message); }
function parseEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, 'utf8').split(/\r?\n/).map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]));
}
const localEnv = parseEnv(join(root, '.env'));
const sqlPassword = process.env.MSSQL_SA_PASSWORD || localEnv.MSSQL_SA_PASSWORD;
const sqlDatabase = process.env.MES_DATABASE || 'iMES';
function run(command, args) {
  try { return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (error) { fail(`${command} failed: ${String(error.stderr || error.stdout || error.message).replaceAll(sqlPassword || '', '***')}`); }
}
function commandOutputOrEmpty(command, args) {
  try { return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (error) { if (error.status === 1) return ''; throw error; }
}
function sql(query) { return run('docker', ['compose', 'exec', '-T', 'sqlserver-x64', '/opt/mssql-tools18/bin/sqlcmd', '-S', 'localhost', '-U', 'sa', '-P', sqlPassword, '-d', sqlDatabase, '-C', '-h', '-1', '-W', '-s', '|', '-Q', query]); }
function lines(query) { return sql(query).split(/\r?\n/).map((x) => x.trim()).filter(Boolean).filter((x) => !/^\(\d+ rows? affected\)$/i.test(x)); }
function scalar(query) { const value = lines(query)[0]; assert(value !== undefined, `SQL 无结果：${query.slice(0, 120)}`); return value.split('|')[0].trim(); }
function sqlText(value) { return `N'${String(value).replaceAll("'", "''")}'`; }
function status(data) { return data?.status ?? data?.Status; }
function base64Url(value) { return Buffer.from(value).toString('base64url'); }
function adminToken() {
  const userId = Number(scalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName = 'admin' ORDER BY User_Id"));
  const jwt = readFileSync(join(apiRoot, 'appsettings.json'), 'utf8').match(/"JWT"\s*:\s*"([^"]+)"/)?.[1];
  assert(userId > 0 && jwt, '未找到 admin 或 JWT 配置。');
  const now = Math.floor(Date.now() / 1000);
  const head = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Url(JSON.stringify({ jti: String(userId), iat: now, nbf: now, exp: now + 3600, iss: 'iMES.core.owner', aud: 'iMES.core' }));
  return `${head}.${body}.${createHmac('sha256', jwt).update(`${head}.${body}`).digest('base64url')}`;
}
async function request(path, { method = 'POST', body, token } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const text = await response.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { fail(`${path} 非 JSON：${text.slice(0, 240)}`); }
  assert(response.ok, `${path} HTTP ${response.status}: ${data?.message || data?.Message || text}`);
  return data;
}
function addResult(name, result) { report.tests.push({ name, ...result }); }
function clean() {
  const prefix = sqlText(`${marker}%`);
  sql(`DELETE FROM Base_DefectItem_ExtendData WHERE DefectItem_Id IN (SELECT DefectItem_Id FROM Base_DefectItem WHERE DefectItemCode LIKE ${prefix}); DELETE FROM Base_DefectItem WHERE DefectItemCode LIKE ${prefix};`);
  assert(Number(scalar(`SELECT COUNT(1) FROM Base_DefectItem WHERE DefectItemCode LIKE ${prefix}`)) === 0, '不良品项测试数据清理失败。');
}
async function wf01() {
  const captcha = await request('/api/Sys_User/getVierificationCode', { method: 'GET' });
  assert(captcha?.uuid && captcha?.img, '验证码接口未返回 uuid 或图片。');
  const wrong = await request('/api/Sys_User/login', { body: { UserName: 'admin', Password: '123456', VerificationCode: 'WRONG', UUID: captcha.uuid } });
  assert(status(wrong) === false && String(wrong.message || wrong.Message).includes('验证码不正确'), `错误验证码未被拒绝：${JSON.stringify(wrong)}`);
  const reused = await request('/api/Sys_User/login', { body: { UserName: 'admin', Password: '123456', VerificationCode: 'WRONG', UUID: captcha.uuid } });
  assert(status(reused) === false && String(reused.message || reused.Message).includes('验证码已失效'), `已使用验证码未失效：${JSON.stringify(reused)}`);
  addResult('WF-01 验证码签发、错误拒绝和一次性失效', { status: 'passed', details: { captchaIssued: true, wrongCaptchaRejected: true, reusedCaptchaExpired: true } });
}
async function wf02() {
  const sourceHasWorkshop = commandOutputOrEmpty('rg', ['-l', '-i', 'Base_WorkShop|Workshop|WorkShop|车间设置', '源码/iMES.Net/iMES.Entity', '源码/iMES.Net/iMES.Custom', '源码/iMES.Net/iMES.WebApi']);
  const tables = lines("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%WorkShop%' OR TABLE_NAME LIKE '%Workshop%'");
  assert(!sourceHasWorkshop && tables.length === 0, `发现车间模块，需补充 WF-02 实例测试：${sourceHasWorkshop || tables.join(', ')}`);
  addResult('WF-02 车间模块存在性检查', { status: 'blocked', details: { sourceHasWorkshop: false, databaseTables: 0, reason: '当前代码与数据库均无车间维护模块，不能创建业务实例。' } });
}
async function wf03(token) {
  const code = `${marker}_DEFECT`;
  const name = `${marker}_不良品`;
  const fields = lines(`SELECT FieldCode FROM Sys_Table_Extend WHERE TableName = N'Base_DefectItem'`).map((line) => line.split('|')[0]);
  const extra = Object.fromEntries(fields.map((field) => [field, `${marker}_EXT`]));
  const save = { mainData: { DefectItemCode: code, DefectItemName: name }, detailData: [], delKeys: [], extra: JSON.stringify(extra) };
  const added = await request('/api/Base_DefectItem/Add', { body: save, token });
  assert(status(added) === true, `不良品项新增失败：${added?.message || added?.Message}`);
  const id = Number(scalar(`SELECT DefectItem_Id FROM Base_DefectItem WHERE DefectItemCode = ${sqlText(code)}`));
  assert(id > 0, '新增后未找到不良品项。');
  const page = await request('/api/Base_DefectItem/GetPageData', { body: { page: 1, rows: 20, sort: 'CreateDate', order: 'desc', wheres: JSON.stringify([{ name: 'DefectItemCode', value: code, displayType: 'like' }]) }, token });
  assert(Array.isArray(page.rows) && page.rows.some((row) => Number(row.defectItem_Id ?? row.DefectItem_Id) === id), '分页查询未返回新增不良品项。');
  const duplicate = await request('/api/Base_DefectItem/Add', { body: { ...save, mainData: { DefectItemCode: `${code}_OTHER`, DefectItemName: name } }, token });
  assert(status(duplicate) === false, '重复不良品项名称未被拒绝。');
  const deleted = await request('/api/Base_DefectItem/Del', { body: [id], token });
  assert(status(deleted) === true, `不良品项删除失败：${deleted?.message || deleted?.Message}`);
  assert(Number(scalar(`SELECT COUNT(1) FROM Base_DefectItem WHERE DefectItem_Id = ${id}`)) === 0, '删除后不良品项仍存在。');
  addResult('WF-03 不良品项创建、查询、重复校验和删除', { status: 'passed', details: { id, extensionFieldCount: fields.length } });
}
let failure;
try {
  assert(sqlPassword, '缺少 MSSQL_SA_PASSWORD。');
  assert(run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim(), 'SQL Server 未启动。');
  assert(run('docker', ['compose', 'ps', '-q', 'api']).trim(), 'API 未启动。');
  clean();
  await wf01();
  await wf02();
  await wf03(adminToken());
} catch (error) { failure = error; report.error = String(error.stack || error.message).replaceAll(sqlPassword || '', '***'); }
finally {
  try { clean(); report.cleanup = 'passed'; } catch (error) { report.cleanup = `failed: ${error.message}`; failure ||= error; }
  report.finishedAt = new Date().toISOString();
  report.summary = { passed: report.tests.filter((x) => x.status === 'passed').length, blocked: report.tests.filter((x) => x.status === 'blocked').length, failed: failure ? 1 : 0 };
  mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `wf-01-to-03-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ ...report.summary, cleanup: report.cleanup, resultPath }, null, 2));
}
if (failure) throw failure;
