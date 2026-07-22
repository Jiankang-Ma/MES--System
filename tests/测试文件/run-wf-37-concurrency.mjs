#!/usr/bin/env node
/** WF-37：20 个并发空编号销售订单的编号唯一性集成测试。 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(dir, '..', '..');
const apiRoot = join(root, '源码', 'iMES.Net', 'iMES.WebApi');
const marker = `AUTOTEST_WF37_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const resultsDir = join(root, 'tests', 'results');
function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, 'utf8').split(/\r?\n/).map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]));
}
const password = process.env.MSSQL_SA_PASSWORD || parseDotEnv(join(root, '.env')).MSSQL_SA_PASSWORD;
const database = process.env.MES_DATABASE || 'iMES';
const report = { startedAt: new Date().toISOString(), marker, requested: 20, results: [], cleanup: null };
function assert(value, message) { if (!value) throw new Error(message); }
function run(command, args) { try { return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (error) { throw new Error(`${command} failed: ${String(error.stderr || error.message).replaceAll(password, '***')}`); } }
function sql(query) { return run('docker', ['compose', 'exec', '-T', 'sqlserver-x64', '/opt/mssql-tools18/bin/sqlcmd', '-S', 'localhost', '-U', 'sa', '-P', password, '-d', database, '-C', '-h', '-1', '-W', '-s', '|', '-Q', query]); }
function lines(query) { return sql(query).split(/\r?\n/).map((x) => x.trim()).filter(Boolean).filter((x) => !/^\(\d+ rows? affected\)$/i.test(x)); }
function scalar(query) { const value = lines(query)[0]; assert(value !== undefined, `SQL 无结果：${query}`); return value.split('|')[0]; }
function sqlText(value) { return `N'${String(value).replaceAll("'", "''")}'`; }
function token() {
  const userId = Number(scalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName='admin'"));
  const secret = readFileSync(join(apiRoot, 'appsettings.json'), 'utf8').match(/"JWT"\s*:\s*"([^"]+)"/)?.[1];
  assert(userId > 0 && secret, '无法读取 admin/JWT。');
  const now = Math.floor(Date.now() / 1000), b64 = (x) => Buffer.from(x).toString('base64url');
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ jti: String(userId), iat: now, nbf: now, exp: now + 3600, iss: 'iMES.core.owner', aud: 'iMES.core' }));
  return `${header}.${payload}.${createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')}`;
}
async function post(path, body, auth) {
  const response = await fetch(`http://localhost:9991${path}`, { method: 'POST', headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await response.text(); let data; try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }
  return { httpStatus: response.status, status: data?.status ?? data?.Status, message: data?.message ?? data?.Message, data };
}
function clean() {
  const prefix = sqlText(`${marker}%`);
  sql(`DELETE wol FROM Production_WorkOrderList wol INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id=wol.WorkOrder_Id WHERE wo.AssociatedForm IN (SELECT SalesOrderCode FROM Production_SalesOrder WHERE Remark LIKE ${prefix}); DELETE FROM Production_WorkOrder WHERE AssociatedForm IN (SELECT SalesOrderCode FROM Production_SalesOrder WHERE Remark LIKE ${prefix}); DELETE FROM Production_SalesOrderList WHERE SalesOrder_Id IN (SELECT SalesOrder_Id FROM Production_SalesOrder WHERE Remark LIKE ${prefix}); DELETE FROM Production_SalesOrder WHERE Remark LIKE ${prefix};`);
  assert(Number(scalar(`SELECT COUNT(1) FROM Production_SalesOrder WHERE Remark LIKE ${prefix}`)) === 0, '并发订单清理失败。');
}
let error;
try {
  assert(password, '缺少 MSSQL_SA_PASSWORD。'); clean();
  const [productId, productCode, productName, productStandard] = lines("SELECT TOP (1) CONCAT(Product_Id,'|',ProductCode,'|',ProductName,'|',ISNULL(ProductStandard,'')) FROM Base_Product WHERE Process_Id IS NOT NULL ORDER BY Product_Id")[0].split('|');
  const auth = token();
  const requests = Array.from({ length: 20 }, (_, index) => post('/api/Production_SalesOrder/Add', { mainData: { Remark: `${marker}_${index}` }, detailData: [{ Product_Id: Number(productId), ProductCode: productCode, ProductName: productName, ProductStandard: productStandard, Qty: 1, FinishQty: 0 }], delKeys: [] }, auth));
  report.results = await Promise.all(requests);
  const failed = report.results.filter((x) => x.httpStatus !== 200 || x.status !== true);
  assert(failed.length === 0, `并发新增失败 ${failed.length} 条：${JSON.stringify(failed.slice(0, 3))}`);
  const codes = lines(`SELECT SalesOrderCode FROM Production_SalesOrder WHERE Remark LIKE ${sqlText(`${marker}%`)} ORDER BY SalesOrderCode`);
  assert(codes.length === 20, `应保存 20 张订单，实际 ${codes.length}。`);
  assert(new Set(codes).size === 20, `检测到重复订单号：${codes.join(', ')}`);
  report.codes = codes; report.status = 'passed';
} catch (caught) { error = caught; report.status = 'failed'; report.error = String(caught.stack || caught.message).replaceAll(password, '***'); }
finally {
  try { clean(); report.cleanup = 'passed'; } catch (caught) { report.cleanup = `failed: ${caught.message}`; error ||= caught; }
  report.finishedAt = new Date().toISOString(); mkdirSync(resultsDir, { recursive: true });
  const path = join(resultsDir, `wf-37-concurrency-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify({ status: report.status, cleanup: report.cleanup, resultPath: path }, null, 2));
}
if (error) throw error;
