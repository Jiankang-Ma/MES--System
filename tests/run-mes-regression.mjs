#!/usr/bin/env node
/**
 * 基础自动化回归测试（不是生产计划/检验业务链实例测试）。
 *
 * 实际覆盖：实体映射与 SQL Server 表结构；Base_Notice 的新增、查询、修改、删除与字段边界；
 * Sys_Dictionary / Sys_DictionaryList 主从新增、查询、修改、删除及重复校验；
 * 代码声明的主从孤儿数据检查；Base_Notice 列表只读并发探测。
 *
 * Test records always begin with AUTOTEST_. Cleanup runs before and after tests.
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..');
const sourceRoot = join(root, '源码', 'iMES.Net');
const apiRoot = join(sourceRoot, 'iMES.WebApi');
const resultsDir = join(scriptDir, 'results');
const marker = `AUTOTEST_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const report = {
  startedAt: new Date().toISOString(),
  apiBaseUrl,
  marker,
  tests: [],
  metrics: {},
};

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function redact(value) {
  const password = sqlPassword || '';
  return String(value).replaceAll(password, '***');
}

function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
      }),
  );
}

const localEnv = parseDotEnv(join(root, '.env'));
const sqlPassword = process.env.MSSQL_SA_PASSWORD || localEnv.MSSQL_SA_PASSWORD;
const sqlDatabase = process.env.MES_DATABASE || 'iMES';

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    });
  } catch (error) {
    const stdout = error.stdout ? String(error.stdout) : '';
    const stderr = error.stderr ? String(error.stderr) : '';
    fail(`${command} ${args.slice(0, 3).join(' ')} failed: ${redact(`${stdout}\n${stderr}`.trim())}`);
  }
}

function ensureLocalDependencies() {
  assert(sqlPassword, '未找到 MSSQL_SA_PASSWORD。请在项目根目录 .env 中配置后再运行。');
  const sqlContainer = run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim();
  const apiContainer = run('docker', ['compose', 'ps', '-q', 'api']).trim();
  assert(sqlContainer, 'SQL Server 未启动。先执行: docker compose --profile x64-sqlserver up -d sqlserver-x64 redis api');
  assert(apiContainer, 'API 未启动。先执行: docker compose up -d --build api');
}

function sql(query) {
  return run('docker', [
    'compose',
    'exec',
    '-T',
    'sqlserver-x64',
    '/opt/mssql-tools18/bin/sqlcmd',
    '-S',
    'localhost',
    '-U',
    'sa',
    '-P',
    sqlPassword,
    '-d',
    sqlDatabase,
    '-C',
    '-h',
    '-1',
    '-W',
    '-s',
    '|',
    '-Q',
    query,
  ]);
}

function sqlLines(query) {
  return sql(query)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\(\d+ rows? affected\)$/i.test(line));
}

function sqlScalar(query) {
  const lines = sqlLines(query);
  assert(lines.length > 0, `SQL 未返回结果: ${query.slice(0, 120)}`);
  return lines[0].split('|')[0].trim();
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function jwtSecret() {
  const settings = readFileSync(join(apiRoot, 'appsettings.json'), 'utf8');
  const match = settings.match(/"JWT"\s*:\s*"([^"]+)"/);
  assert(match, '无法从 appsettings.json 读取 JWT 配置。');
  return match[1];
}

function createAdminToken() {
  const userId = Number(sqlScalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName = 'admin' ORDER BY User_Id"));
  assert(Number.isInteger(userId) && userId > 0, '未在 Sys_User 中找到 admin 用户，无法执行 API 集成测试。');
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    jti: String(userId),
    iat: now,
    nbf: now,
    exp: now + 60 * 60,
    iss: 'iMES.core.owner',
    aud: 'iMES.core',
  }));
  const signature = createHmac('sha256', jwtSecret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

let token;

function responseStatus(data) {
  return data?.status ?? data?.Status;
}

async function api(path, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    fail(`${path} 返回非 JSON（HTTP ${response.status}）: ${text.slice(0, 300)}`);
  }
  if (!response.ok) {
    fail(`${path} 返回 HTTP ${response.status}: ${data?.message || data?.Message || text.slice(0, 300)}`);
  }
  return data;
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function waitForApiCache() {
  const deadline = Date.now() + 120_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const data = await api('/api/Base_Notice/GetPageData', pageRequest());
      if (Array.isArray(data?.rows)) return;
    } catch (error) {
      lastError = error;
    }
    await delay(5_000);
  }
  fail(`API 未在 120 秒内恢复 Redis 缓存访问: ${lastError?.message || 'unknown error'}`);
}

function pageRequest(wheres = []) {
  return {
    page: 1,
    rows: 20,
    sort: 'CreateDate',
    order: 'desc',
    wheres: JSON.stringify(wheres),
  };
}

function listCsFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...listCsFiles(path));
    if (entry.isFile() && entry.name.endsWith('.cs') && !path.includes('/partial/')) result.push(path);
  }
  return result;
}

function parseEntities() {
  const roots = ['iMES.Entity/DomainModels/Custom', 'iMES.Entity/DomainModels/System', 'iMES.Entity/DomainModels/Production', 'iMES.Entity/DomainModels/Warehouse']
    .map((path) => join(sourceRoot, path));
  const entities = [];
  for (const directory of roots) {
    for (const path of listCsFiles(directory)) {
      const source = readFileSync(path, 'utf8');
      const classMatch = source.match(/public\s+(?:partial\s+)?class\s+(\w+)/);
      const tableMatch = source.match(/\[Table\("([^"]+)"\)\]/) || source.match(/\[Entity\([\s\S]*?TableName\s*=\s*"([^"]+)"[\s\S]*?\)\]/);
      if (!classMatch || !tableMatch) continue;
      const className = classMatch[1];
      const columns = [...source.matchAll(/\[Column\([^\]]*\)\][\s\S]{0,240}?public\s+[\w<>?]+\s+(\w+)\s*\{/g)].map((match) => match[1]);
      const keyMatch = source.match(/\[Key\][\s\S]{0,240}?public\s+[\w<>?]+\s+(\w+)\s*\{/);
      const foreignKeyMatch = source.match(/\[ForeignKey\("(\w+)"\)\][\s\S]{0,240}?public\s+List<(\w+)>\s+(\w+)/);
      entities.push({
        path,
        className,
        tableName: tableMatch[1],
        columns,
        key: keyMatch?.[1],
        relation: foreignKeyMatch ? { foreignKey: foreignKeyMatch[1], detailClass: foreignKeyMatch[2] } : null,
      });
    }
  }
  return entities;
}

function runStaticSchemaChecks() {
  const entities = parseEntities();
  assert(entities.length > 0, '未从实体模型解析到数据库表。');
  const dbObjects = new Map(sqlLines("SELECT CONCAT(TABLE_NAME, '|', TABLE_TYPE) FROM INFORMATION_SCHEMA.TABLES").map((line) => {
    const [name, type] = line.split('|');
    return [name.toLowerCase(), type];
  }));
  const missingTables = entities.filter((entity) => !dbObjects.has(entity.tableName.toLowerCase())).map((entity) => entity.tableName);
  assert(missingTables.length === 0, `实体映射的表或视图在数据库不存在: ${[...new Set(missingTables)].join(', ')}`);

  const mismatchedColumns = [];
  const missingKeys = [];
  for (const entity of entities) {
    const dbColumns = new Set(sqlLines(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${entity.tableName.replaceAll("'", "''")}'`).map((line) => line.toLowerCase()));
    const missing = entity.columns.filter((column) => !dbColumns.has(column.toLowerCase()));
    if (missing.length) mismatchedColumns.push(`${entity.tableName}: ${missing.join(', ')}`);
    if (entity.key && dbObjects.get(entity.tableName.toLowerCase()) === 'BASE TABLE') {
      const keyColumns = sqlLines(`SELECT kcu.COLUMN_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME AND tc.TABLE_NAME = kcu.TABLE_NAME WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY' AND tc.TABLE_NAME = '${entity.tableName.replaceAll("'", "''")}'`);
      if (!keyColumns.some((column) => column.toLowerCase() === entity.key.toLowerCase())) {
        missingKeys.push(`${entity.tableName}.${entity.key}`);
      }
    }
  }
  assert(mismatchedColumns.length === 0, `实体列与数据库不一致: ${mismatchedColumns.join('; ')}`);
  assert(missingKeys.length === 0, `实体主键与数据库主键不一致: ${missingKeys.join(', ')}`);

  const byClass = new Map(entities.map((entity) => [entity.className, entity]));
  const orphanRows = [];
  const relationshipChecks = [];
  for (const master of entities.filter((entity) => entity.relation)) {
    const detail = byClass.get(master.relation.detailClass);
    if (!detail || !master.key) continue;
    const query = `SELECT COUNT_BIG(1) FROM [${detail.tableName}] d LEFT JOIN [${master.tableName}] m ON d.[${master.relation.foreignKey}] = m.[${master.key}] WHERE d.[${master.relation.foreignKey}] IS NOT NULL AND m.[${master.key}] IS NULL`;
    const count = Number(sqlScalar(query));
    relationshipChecks.push({ master: master.tableName, detail: detail.tableName, foreignKey: master.relation.foreignKey, orphanCount: count });
    if (count > 0) orphanRows.push(`${detail.tableName}.${master.relation.foreignKey}=${count}`);
  }
  report.metrics.entityTables = entities.length;
  report.metrics.relationshipChecks = relationshipChecks;
  assert(orphanRows.length === 0, `检测到主从关联孤儿数据: ${orphanRows.join(', ')}`);
}

function cleanTestRows() {
  const escaped = marker.replaceAll("'", "''");
  sql(`DELETE FROM [Sys_DictionaryList] WHERE [Dic_ID] IN (SELECT [Dic_ID] FROM [Sys_Dictionary] WHERE [DicNo] LIKE '${escaped}%'); DELETE FROM [Sys_Dictionary] WHERE [DicNo] LIKE '${escaped}%'; DELETE FROM [Base_Notice] WHERE [NoticeTitle] LIKE '${escaped}%';`);
}

async function runTest(name, fn) {
  const started = performance.now();
  try {
    await fn();
    report.tests.push({ name, status: 'passed', durationMs: Math.round(performance.now() - started) });
  } catch (error) {
    report.tests.push({ name, status: 'failed', durationMs: Math.round(performance.now() - started), error: redact(error.message) });
  }
}

async function testNoticeCrudAndBoundaries() {
  const noticeTitle = `${marker}_NOTICE`;
  const add = await api('/api/Base_Notice/Add', {
    mainData: { NoticeType: 'AUTOTEST', NoticeTitle: noticeTitle, NoticeContent: 'initial content' },
    detailData: [],
    delKeys: [],
  });
  assert(responseStatus(add) === true, `通知新增失败: ${add?.message || add?.Message}`);
  const noticeId = Number(sqlScalar(`SELECT TOP (1) Notice_Id FROM Base_Notice WHERE NoticeTitle = '${noticeTitle}' ORDER BY Notice_Id DESC`));
  assert(noticeId > 0, '通知新增后未查到数据库记录。');

  const page = await api('/api/Base_Notice/GetPageData', pageRequest([{ name: 'NoticeTitle', value: noticeTitle, displayType: 'like' }]));
  assert(Array.isArray(page?.rows) && page.rows.some((row) => Number(row.notice_Id ?? row.Notice_Id) === noticeId), '通知分页查询未返回新增记录。');

  const updatedTitle = `${noticeTitle}_UPDATED`;
  const update = await api('/api/Base_Notice/Update', {
    mainData: { Notice_Id: noticeId, NoticeType: 'AUTOTEST', NoticeTitle: updatedTitle, NoticeContent: 'updated content' },
    detailData: null,
    delKeys: null,
  });
  assert(responseStatus(update) === true, `通知修改失败: ${update?.message || update?.Message}`);
  assert(sqlScalar(`SELECT NoticeContent FROM Base_Notice WHERE Notice_Id = ${noticeId}`) === 'updated content', '通知修改未写入数据库。');

  const del = await api('/api/Base_Notice/Del', [noticeId]);
  assert(responseStatus(del) === true, `通知删除失败: ${del?.message || del?.Message}`);
  assert(Number(sqlScalar(`SELECT COUNT(1) FROM Base_Notice WHERE Notice_Id = ${noticeId}`)) === 0, '通知删除后记录仍存在。');

  const exactMaxTitle = `${marker}_MAX_${'X'.repeat(Math.max(0, 500 - marker.length - 5))}`;
  assert(exactMaxTitle.length === 500, '测试脚本未构造出 500 字符标题。');
  const maxResult = await api('/api/Base_Notice/Add', {
    mainData: { NoticeType: 'AUTOTEST', NoticeTitle: exactMaxTitle, NoticeContent: 'max title accepted' }, detailData: [], delKeys: [],
  });
  assert(responseStatus(maxResult) === true, `500 字符标题应可保存: ${maxResult?.message || maxResult?.Message}`);

  const overflow = await api('/api/Base_Notice/Add', {
    mainData: { NoticeType: 'AUTOTEST', NoticeTitle: `${exactMaxTitle}X`, NoticeContent: 'overflow should fail' }, detailData: [], delKeys: [],
  });
  assert(responseStatus(overflow) === false, '501 字符通知标题未被拒绝。');

  const required = await api('/api/Base_Notice/Add', {
    mainData: { NoticeType: 'AUTOTEST', NoticeContent: 'missing title should fail' }, detailData: [], delKeys: [],
  });
  assert(responseStatus(required) === false, '缺少必填 NoticeTitle 未被拒绝。');
}

async function testDictionaryMasterDetailCrud() {
  const dicNo = `${marker}_DIC`;
  const add = await api('/api/Sys_Dictionary/Add', {
    mainData: { DicNo: dicNo, DicName: 'AUTOTEST dictionary', ParentId: 0, OrderNo: 1, Enable: 1, Remark: 'test fixture' },
    detailData: [
      { DicValue: 'A', DicName: 'Alpha', OrderNo: 1, Remark: 'first', Enable: 1 },
      { DicValue: 'B', DicName: 'Beta', OrderNo: 2, Remark: 'second', Enable: 1 },
    ],
    delKeys: [],
  });
  assert(responseStatus(add) === true, `主从表新增失败: ${add?.message || add?.Message}`);
  const dicId = Number(sqlScalar(`SELECT TOP (1) Dic_ID FROM Sys_Dictionary WHERE DicNo = '${dicNo}' ORDER BY Dic_ID DESC`));
  assert(dicId > 0, '字典主表新增后未查到记录。');
  const children = sqlLines(`SELECT CONCAT(DicList_ID, '|', DicValue) FROM Sys_DictionaryList WHERE Dic_ID = ${dicId} ORDER BY DicValue`);
  assert(children.length === 2, `字典新增后明细数量应为 2，实际为 ${children.length}。`);
  const childA = Number(children.find((line) => line.endsWith('|A'))?.split('|')[0]);
  const childB = Number(children.find((line) => line.endsWith('|B'))?.split('|')[0]);
  assert(childA > 0 && childB > 0, '未能识别新增的字典明细主键。');

  const page = await api('/api/Sys_Dictionary/GetPageData', pageRequest([{ name: 'DicNo', value: dicNo, displayType: 'like' }]));
  assert(Array.isArray(page?.rows) && page.rows.some((row) => Number(row.dic_ID ?? row.Dic_ID) === dicId), '字典分页查询未返回新增主表记录。');

  const detailPage = await api('/api/Sys_DictionaryList/GetPageData', { ...pageRequest(), value: dicNo });
  assert(Array.isArray(detailPage?.rows) && detailPage.rows.length === 2, '字典明细分页查询未返回两条记录。');

  const update = await api('/api/Sys_Dictionary/Update', {
    mainData: { Dic_ID: dicId, DicNo: dicNo, DicName: 'AUTOTEST dictionary updated', ParentId: 0, OrderNo: 2, Enable: 1, Remark: 'updated' },
    detailData: [
      { DicList_ID: childA, Dic_ID: dicId, DicValue: 'A', DicName: 'Alpha updated', OrderNo: 1, Remark: 'updated', Enable: 1 },
      { DicValue: 'C', DicName: 'Gamma', OrderNo: 3, Remark: 'new item', Enable: 1 },
    ],
    delKeys: [childB],
  });
  assert(responseStatus(update) === true, `主从表修改失败: ${update?.message || update?.Message}`);
  const afterUpdate = sqlLines(`SELECT CONCAT(DicValue, '|', DicName) FROM Sys_DictionaryList WHERE Dic_ID = ${dicId} ORDER BY DicValue`);
  assert(afterUpdate.length === 2 && afterUpdate.includes('A|Alpha updated') && afterUpdate.includes('C|Gamma'), `字典明细更新结果不正确: ${afterUpdate.join(', ')}`);

  const duplicateDic = await api('/api/Sys_Dictionary/Add', {
    mainData: { DicNo: dicNo, DicName: 'duplicate code', ParentId: 0, Enable: 1 }, detailData: [], delKeys: [],
  });
  assert(responseStatus(duplicateDic) === false, '重复字典编号未被拒绝。');

  const duplicateDetail = await api('/api/Sys_Dictionary/Add', {
    mainData: { DicNo: `${marker}_DUP`, DicName: 'duplicate detail', ParentId: 0, Enable: 1 },
    detailData: [
      { DicValue: 'DUP', DicName: 'same', Enable: 1 },
      { DicValue: 'DUP', DicName: 'same', Enable: 1 },
    ],
    delKeys: [],
  });
  assert(responseStatus(duplicateDetail) === false, '重复字典明细 Key/名称未被拒绝。');

  const del = await api('/api/Sys_Dictionary/Del', [dicId]);
  assert(responseStatus(del) === true, `主从表删除失败: ${del?.message || del?.Message}`);
  assert(Number(sqlScalar(`SELECT COUNT(1) FROM Sys_Dictionary WHERE Dic_ID = ${dicId}`)) === 0, '字典主表删除后记录仍存在。');
  assert(Number(sqlScalar(`SELECT COUNT(1) FROM Sys_DictionaryList WHERE Dic_ID = ${dicId}`)) === 0, '字典主表删除后明细仍存在。');
}

async function testReadLoad() {
  const concurrency = 50;
  const requestsPerWorker = 4;
  const timings = [];
  let successes = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    for (let index = 0; index < requestsPerWorker; index += 1) {
      const started = performance.now();
      const data = await api('/api/Base_Notice/GetPageData', pageRequest());
      assert(Array.isArray(data?.rows), '压测分页接口未返回 rows。');
      timings.push(performance.now() - started);
      successes += 1;
    }
  });
  await Promise.all(workers);
  timings.sort((a, b) => a - b);
  const percentile = (ratio) => Math.round(timings[Math.min(timings.length - 1, Math.ceil(timings.length * ratio) - 1)]);
  report.metrics.readLoad = {
    concurrency,
    totalRequests: concurrency * requestsPerWorker,
    successes,
    p50Ms: percentile(0.5),
    p95Ms: percentile(0.95),
    maxMs: Math.round(timings.at(-1)),
  };
  assert(successes === concurrency * requestsPerWorker, '压测请求未全部成功。');
}

function saveReport() {
  mkdirSync(resultsDir, { recursive: true });
  report.finishedAt = new Date().toISOString();
  report.summary = {
    passed: report.tests.filter((test) => test.status === 'passed').length,
    failed: report.tests.filter((test) => test.status === 'failed').length,
  };
  const path = join(resultsDir, `mes-regression-${report.startedAt.replace(/[:.]/g, '-')}.json`);
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  return path;
}

async function main() {
  ensureLocalDependencies();
  cleanTestRows();
  token = createAdminToken();
  await waitForApiCache();
  await runTest('全量实体表、列、主键与主从孤儿数据校验', async () => runStaticSchemaChecks());
  await runTest('Base_Notice 单表 CRUD 与边界值', testNoticeCrudAndBoundaries);
  await runTest('Sys_Dictionary 主从 CRUD、重复值与删除清理', testDictionaryMasterDetailCrud);
  await runTest('Base_Notice 分页查询读压测（50 并发 x 4）', testReadLoad);
  cleanTestRows();
  const reportPath = saveReport();
  const failed = report.tests.filter((test) => test.status === 'failed');
  console.log(`测试完成：${report.summary.passed} 通过，${report.summary.failed} 失败。`);
  console.log(`报告：${reportPath}`);
  if (report.metrics.readLoad) console.log(`读压测：${JSON.stringify(report.metrics.readLoad)}`);
  if (failed.length) {
    for (const test of failed) console.error(`失败 - ${test.name}: ${test.error}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  try {
    cleanTestRows();
  } catch {
    // Keep the original setup error, but avoid leaving AUTOTEST rows when possible.
  }
  report.tests.push({ name: '测试初始化', status: 'failed', error: redact(error.message) });
  const reportPath = saveReport();
  console.error(`测试未能初始化：${redact(error.message)}`);
  console.error(`报告：${reportPath}`);
  process.exitCode = 1;
});
