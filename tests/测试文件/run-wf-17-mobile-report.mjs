#!/usr/bin/env node
/**
 * WF-17：核验随交付包提供的 uni-app，并按其报工页的真实请求载荷完成
 * 工单 -> 工序任务 -> 移动端报工 -> PC 查询/进度同步。
 * 工作站绑定在当前交付物中不存在，作为覆盖缺口记录，不伪造为已通过的功能。
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..', '..');
const testsDir = resolve(scriptDir, '..');
const apiRoot = join(root, '源码', 'iMES.Net', 'iMES.WebApi');
const archive = join(root, '源码', 'iMES.uniapp.rar');
const resultsDir = join(testsDir, 'results');
const marker = `AUTOTEST_WF17_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const fixture = { process: `${marker}_P`, route: `${marker}_ROUTE`, product: `${marker}_PRODUCT`, salesOrder: `${marker}_SO` };
const report = { startedAt: new Date().toISOString(), marker, status: 'running', steps: [] };

function fail(message) { throw new Error(message); }
function assert(condition, message) { if (!condition) fail(message); }
function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, 'utf8').split(/\r?\n/).map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]));
}
const localEnv = parseDotEnv(join(root, '.env'));
const sqlPassword = process.env.MSSQL_SA_PASSWORD || localEnv.MSSQL_SA_PASSWORD;
function run(command, args) {
  try { return execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (error) { fail(`${command} failed: ${String(error.stderr || error.stdout || error.message).replaceAll(sqlPassword || '', '***')}`); }
}
function sql(query) {
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();
  return run('docker', ['compose', 'exec', '-T', 'sqlserver-x64', '/bin/sh', '-lc',
    `/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d iMES -C -b -h -1 -W -s "|" -Q ${JSON.stringify(normalizedQuery)}`]);
}
function sqlLines(query) {
  return sql(query).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .filter((line) => !/^\(\d+ rows? affected\)$/i.test(line));
}
function sqlScalar(query) { const line = sqlLines(query)[0]; assert(line !== undefined, `SQL 未返回结果：${query}`); return line.split('|')[0]; }
function sqlText(value) { return `N'${String(value).replaceAll("'", "''")}'`; }
function jwtSecret() { return readFileSync(join(apiRoot, 'appsettings.json'), 'utf8').match(/"JWT"\s*:\s*"([^"]+)"/)[1]; }
function createToken() {
  const userId = Number(sqlScalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName = 'admin' ORDER BY User_Id"));
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({ jti: String(userId), iat: now, nbf: now, exp: now + 3600, iss: 'iMES.core.owner', aud: 'iMES.core' });
  return { token: `${header}.${payload}.${createHmac('sha256', jwtSecret()).update(`${header}.${payload}`).digest('base64url')}`, userId };
}
let token;
async function api(path, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await response.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { fail(`${path} 返回非 JSON：${text}`); }
  if (!response.ok) fail(`${path} HTTP ${response.status}：${text}`);
  return data;
}
function ok(data) { return data?.status ?? data?.Status; }
function save(mainData, detailData = [], extra = null) { return { mainData, detailData, delKeys: [], ...(extra === null ? {} : { extra: JSON.stringify(extra) }) }; }
function step(name, details) { report.steps.push({ name, ...details }); }
function extensionValues(tableName) {
  const fields = sqlLines(`SELECT FieldCode FROM Sys_Table_Extend WHERE TableName = ${sqlText(tableName)} ORDER BY TableEx_Id`).map((line) => line.split('|')[0]);
  return Object.fromEntries(fields.map((field) => [field, `${marker}_EXT`]));
}
function archiveEntries() { return run('bsdtar', ['-tf', archive]).split(/\r?\n/).filter(Boolean); }
function archiveFile(path) { return run('bsdtar', ['-xOf', archive, path]); }
function cleanup() {
  const productCode = sqlText(fixture.product);
  sql(`
SET XACT_ABORT ON;
BEGIN TRANSACTION;
DELETE d FROM Ware_WareHouseBillList d INNER JOIN Ware_WareHouseBill h ON h.WareHouseBill_Id=d.WareHouseBill_Id INNER JOIN Production_ReportWorkOrder r ON h.WareHouseBillCode=CONCAT('OUTPUT-RWO-',r.ReportWorkOrder_Id) WHERE r.ProductCode=${productCode};
DELETE h FROM Ware_WareHouseBill h INNER JOIN Production_ReportWorkOrder r ON h.WareHouseBillCode=CONCAT('OUTPUT-RWO-',r.ReportWorkOrder_Id) WHERE r.ProductCode=${productCode};
DELETE FROM Production_ReportWorkOrderList WHERE ReportWorkOrder_Id IN (SELECT ReportWorkOrder_Id FROM Production_ReportWorkOrder WHERE ProductCode=${productCode});
DELETE FROM Production_ReportWorkOrder WHERE ProductCode=${productCode};
DELETE wol FROM Production_WorkOrderList wol INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id=wol.WorkOrder_Id WHERE wo.AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_SalesOrderList WHERE SalesOrder_Id IN (SELECT SalesOrder_Id FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)});
DELETE FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)};
DELETE FROM Base_Product_ExtendData WHERE Product_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode=${productCode});
DELETE FROM Base_Product WHERE ProductCode=${productCode};
DELETE FROM Base_ProcessLineList WHERE ProcessLine_Id IN (SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)});
DELETE FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)};
DELETE FROM Base_Process_ExtendData WHERE Process_Id IN (SELECT Process_Id FROM Base_Process WHERE ProcessCode=${sqlText(fixture.process)});
DELETE FROM Base_Process WHERE ProcessCode=${sqlText(fixture.process)};
COMMIT TRANSACTION;`);
  const residue = Number(sqlScalar(`SELECT
    (SELECT COUNT(1) FROM Base_Product WHERE ProductCode=${productCode}) +
    (SELECT COUNT(1) FROM Base_Process WHERE ProcessCode=${sqlText(fixture.process)}) +
    (SELECT COUNT(1) FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)}) +
    (SELECT COUNT(1) FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)}) +
    (SELECT COUNT(1) FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)}) +
    (SELECT COUNT(1) FROM Production_ReportWorkOrder WHERE ProductCode=${productCode})`));
  assert(residue === 0, `WF-17 清理后仍有 ${residue} 条主数据残留。`);
}

async function execute() {
  assert(sqlPassword, '未找到 .env 中的 MSSQL_SA_PASSWORD。');
  assert(existsSync(archive), '未找到 iMES.uniapp.rar。');
  assert(run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim(), 'SQL Server 未启动。');
  assert(run('docker', ['compose', 'ps', '-q', 'api']).trim(), 'API 未启动。');
  cleanup();
  token = createToken().token;
  const entries = archiveEntries();
  const requiredPages = ['iMES.uniapp/manifest.json', 'iMES.uniapp/pages.json', 'iMES.uniapp/pages/imes/reportworkorder/reportworkorder.vue', 'iMES.uniapp/pages/imes/reportworkorder/reportwoDetail.vue'];
  assert(requiredPages.every((path) => entries.includes(path)), 'uni-app 压缩包缺少移动端报工必需页面。');
  const mobileReportPage = archiveFile('iMES.uniapp/pages/imes/reportworkorder/reportwoDetail.vue');
  assert(mobileReportPage.includes('api/Production_ReportWorkOrder/Add') && mobileReportPage.includes('ApproveStatus: "2"') && mobileReportPage.includes('ProductUser: that.ProductUserId'), '移动端报工页未包含实际报工提交、确认状态或人员选择。');
  const pages = archiveFile('iMES.uniapp/pages.json');
  assert(pages.includes('pages/imes/reportworkorder/reportworkorder') && pages.includes('pages/imes/reportworkorder/reportwoDetail'), '移动端路由未注册报工列表或明细页。');
  const workstationTableCount = Number(sqlScalar("SELECT COUNT(1) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%Station%' OR TABLE_NAME LIKE '%WorkStation%' OR TABLE_NAME LIKE '%WorkShop%'"));
  const workstationColumnCount = Number(sqlScalar("SELECT COUNT(1) FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '%Station%' OR COLUMN_NAME LIKE '%WorkStation%' OR COLUMN_NAME LIKE '%WorkShop%'"));
  assert(workstationTableCount === 0 && workstationColumnCount === 0, '发现工作站相关表或字段，必须补充按站任务实例测试。');
  step('交付物和移动端入口', { archive: '源码/iMES.uniapp.rar', mobileReportPages: 2, reportApi: 'Production_ReportWorkOrder/Add', workstationBindingDelivered: false, workstationTableCount, workstationColumnCount });

  const unitId = Number(sqlScalar('SELECT TOP (1) Unit_Id FROM Sys_Unit ORDER BY Unit_Id'));
  const processExtra = extensionValues('Base_Process');
  const productExtra = extensionValues('Base_Product');
  assert(ok(await api('/api/Base_Process/Add', save({ ProcessCode: fixture.process, ProcessName: `${marker}_移动报工工序`, SubmitWorkLimit: '0', SubmitWorkMatch: 1, DefectItem: '0' }, [], processExtra))) === true, '工序创建失败。');
  const processId = Number(sqlScalar(`SELECT Process_Id FROM Base_Process WHERE ProcessCode=${sqlText(fixture.process)}`));
  assert(ok(await api('/api/Base_ProcessLine/Add', save({ ProcessLineCode: fixture.route, ProcessLineName: `${marker}_移动报工路线` }, [{ ProcessLineType: 'process', Process_Id: processId, Sequence: 1, SubmitWorkMatch: 1 }]))) === true, '工艺路线创建失败。');
  const routeId = Number(sqlScalar(`SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)}`));
  assert(ok(await api('/api/Base_Product/Add', save({ ProductCode: fixture.product, ProductName: `${marker}_移动报工产品`, ProductStandard: 'WF17', Unit_Id: unitId, ProductAttribute: 'selfControl', Process_Id: routeId, MaxInventory: 100, MinInventory: 0, SafeInventory: 0, InventoryQty: 0 }, [], productExtra))) === true, '产品创建失败。');
  const productId = Number(sqlScalar(`SELECT Product_Id FROM Base_Product WHERE ProductCode=${sqlText(fixture.product)}`));
  assert(ok(await api('/api/Production_SalesOrder/Add', save({ SalesOrderCode: fixture.salesOrder, Remark: marker }, [{ Product_Id: productId, ProductCode: fixture.product, ProductName: `${marker}_移动报工产品`, ProductStandard: 'WF17', Qty: 3, FinishQty: 0 }]))) === true, '销售订单创建失败，无法生成移动端报工工单。');
  const workOrderId = Number(sqlScalar(`SELECT WorkOrder_Id FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)}`));
  const taskPage = await api('/api/Production_WorkOrder/getDetailPage', { page: 1, rows: 20, sort: 'CreateDate', order: 'desc', value: String(workOrderId), wheres: '[]' });
  assert(Array.isArray(taskPage?.rows) && taskPage.rows.some((row) => Number(row.process_Id ?? row.Process_Id) === processId), '移动端查询的工单工序接口未返回当前任务。');
  step('工单和移动端可选工序', { workOrderId, processId, productId, taskCount: taskPage.rows.length });

  const mobilePayload = {
    delKeys: null,
    detailData: [{ DefectItem: Number(sqlScalar('SELECT TOP (1) DefectItem_Id FROM Base_DefectItem ORDER BY DefectItem_Id')), Qty: 1, elementIndex: 0 }],
    mainData: {
      ActualProgress: '', ApproveStatus: '2', ApproveUser: '超级管理员', EndDate: new Date().toISOString(), GoodQty: 2,
      GuessPrice: '', NoGoodQty: 1, PriceType: '', ProcessProgress: '', ProcessStatus: '2', Process_Id: processId,
      ProductCode: fixture.product, ProductName: `${marker}_移动报工产品`, ProductStandard: 'WF17', ProductUser: String(createToken().userId),
      Product_Id: productId, RateStandard: '', ReoportDurationHour: 0, ReoportDurationMinute: 0, ReportQty: 3,
      ReportTime: Date.now(), StandardProgress: '', StartDate: new Date().toISOString(), UnitPrice: '', Unit_Id: unitId, WorkOrder_Id: String(workOrderId),
    },
  };
  const submitted = await api('/api/Production_ReportWorkOrder/Add', mobilePayload);
  assert(ok(submitted) === true, `移动端报工载荷提交失败：${submitted?.message || submitted?.Message}`);
  const reportId = Number(sqlScalar(`SELECT ReportWorkOrder_Id FROM Production_ReportWorkOrder WHERE ProductCode=${sqlText(fixture.product)}`));
  const pcPage = await api('/api/Production_ReportWorkOrder/getPageData', { page: 1, rows: 20, sort: 'CreateDate', order: 'desc', wheres: JSON.stringify([{ name: 'ProductCode', value: fixture.product, displayType: 'like' }]) });
  const pcRecord = pcPage?.rows?.find((row) => Number(row.reportWorkOrder_Id ?? row.ReportWorkOrder_Id) === reportId);
  assert(pcRecord && Number(pcRecord.approveStatus ?? pcRecord.ApproveStatus) === 2 && Number(pcRecord.goodQty ?? pcRecord.GoodQty) === 2 && Number(pcRecord.noGoodQty ?? pcRecord.NoGoodQty) === 1, 'PC端未看到移动端产生的状态一致报工单。');
  const progressRows = sqlLines(`SELECT CONVERT(varchar(20),SUM(GoodQty)),CONVERT(varchar(20),SUM(NoGoodQty)) FROM Production_ReportWorkOrder WHERE WorkOrder_Id=${sqlText(workOrderId)} AND Process_Id=${processId}`);
  assert(progressRows[0] === '2|1', `工序进度汇总与移动端报工不一致：${progressRows.join(',')}`);
  step('移动端报工提交与PC同步', { reportId, approveStatus: 2, goodQty: 2, noGoodQty: 1, progress: progressRows[0], reportTimeEpochMsAccepted: true });
}

let error;
try { await execute(); report.status = 'passed'; }
catch (caught) { error = caught; report.status = 'failed'; report.error = caught.stack || caught.message; }
finally {
  try { cleanup(); report.cleanup = 'passed'; } catch (caught) { report.cleanup = `failed: ${caught.message}`; if (!error) error = caught; }
  report.finishedAt = new Date().toISOString();
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `wf-17-mobile-report-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: report.status, cleanup: report.cleanup, resultPath }, null, 2)}\n`);
}
if (error) throw error;
