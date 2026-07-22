#!/usr/bin/env node
/**
 * WF-22：确认生效的末工序报工按良品数自动产出入库；普通工序、未确认和纯不良不产出。
 * 所有夹具以 AUTOTEST_WF22_ 开头，并在 finally 中清理。
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(scriptDir, '..', '..');
const apiRoot = join(root, '源码', 'iMES.Net', 'iMES.WebApi');
const resultsDir = join(scriptDir, '..', 'results');
const marker = `AUTOTEST_WF22_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const fixture = {
  process1: `${marker}_P1`, process2: `${marker}_P2`, route: `${marker}_ROUTE`,
  product: `${marker}_PRODUCT`, salesOrder: `${marker}_SO`,
};
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
  return run('docker', ['compose', 'exec', '-T', 'sqlserver-x64', '/bin/sh', '-lc',
    `/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d iMES -C -b -h -1 -W -s "|" -Q ${JSON.stringify(query)}`]);
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
  const fields = sqlLines(`SELECT FieldCode FROM Sys_Table_Extend WHERE TableName=${sqlText(tableName)} ORDER BY TableEx_Id`).map((line) => line.split('|')[0]);
  return Object.fromEntries(fields.map((field) => [field, `${marker}_EXT`]));
}
function cleanup() {
  const cleanupSql = `
SET XACT_ABORT ON;
BEGIN TRANSACTION;
DELETE d FROM Ware_WareHouseBillList d INNER JOIN Ware_WareHouseBill h ON h.WareHouseBill_Id=d.WareHouseBill_Id INNER JOIN Production_ReportWorkOrder r ON h.WareHouseBillCode=CONCAT('OUTPUT-RWO-', r.ReportWorkOrder_Id) WHERE r.ProductCode=${sqlText(fixture.product)};
DELETE h FROM Ware_WareHouseBill h INNER JOIN Production_ReportWorkOrder r ON h.WareHouseBillCode=CONCAT('OUTPUT-RWO-', r.ReportWorkOrder_Id) WHERE r.ProductCode=${sqlText(fixture.product)};
DELETE FROM Production_ReportWorkOrder WHERE ProductCode=${sqlText(fixture.product)};
DELETE wol FROM Production_WorkOrderList wol INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id=wol.WorkOrder_Id WHERE wo.AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_SalesOrderList WHERE SalesOrder_Id IN (SELECT SalesOrder_Id FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)});
DELETE FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)};
DELETE FROM Base_Product_ExtendData WHERE Product_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode=${sqlText(fixture.product)});
DELETE FROM Base_Product WHERE ProductCode=${sqlText(fixture.product)};
DELETE FROM Base_ProcessLineList WHERE ProcessLine_Id IN (SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)});
DELETE FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)};
DELETE FROM Base_Process_ExtendData WHERE Process_Id IN (SELECT Process_Id FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)}));
DELETE FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)});
COMMIT TRANSACTION;`;
  sql(cleanupSql);
  const residue = Number(sqlScalar(`SELECT
    (SELECT COUNT(1) FROM Base_Product WHERE ProductCode=${sqlText(fixture.product)}) +
    (SELECT COUNT(1) FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)})) +
    (SELECT COUNT(1) FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)}) +
    (SELECT COUNT(1) FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)}) +
    (SELECT COUNT(1) FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)}) +
    (SELECT COUNT(1) FROM Production_ReportWorkOrder WHERE ProductCode=${sqlText(fixture.product)})`));
  assert(residue === 0, `WF-22 清理后仍有 ${residue} 条主数据残留。`);
}

async function execute() {
  assert(sqlPassword, '未找到 .env 中的 MSSQL_SA_PASSWORD。');
  assert(run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim(), 'SQL Server 未启动。');
  assert(run('docker', ['compose', 'ps', '-q', 'api']).trim(), 'API 未启动。');
  cleanup();
  const auth = createToken(); token = auth.token;
  const unitId = Number(sqlScalar('SELECT TOP (1) Unit_Id FROM Sys_Unit ORDER BY Unit_Id'));
  const processExtra = extensionValues('Base_Process');
  const productExtra = extensionValues('Base_Product');
  for (const [code, name] of [[fixture.process1, '普通工序'], [fixture.process2, '末工序']]) {
    const added = await api('/api/Base_Process/Add', save({ ProcessCode: code, ProcessName: `${marker}_${name}`, SubmitWorkLimit: '0', SubmitWorkMatch: 1, DefectItem: '0' }, [], processExtra));
    assert(ok(added) === true, `工序新增失败：${added?.message || added?.Message}`);
  }
  const processRows = sqlLines(`SELECT Process_Id,ProcessCode FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)}) ORDER BY ProcessCode`);
  const processIds = Object.fromEntries(processRows.map((line) => { const [id, code] = line.split('|'); return [code, Number(id)]; }));
  const route = await api('/api/Base_ProcessLine/Add', save({ ProcessLineCode: fixture.route, ProcessLineName: `${marker}_两道工序路线` }, [
    { ProcessLineType: 'process', Process_Id: processIds[fixture.process1], Sequence: 1, SubmitWorkMatch: 1 },
    { ProcessLineType: 'process', Process_Id: processIds[fixture.process2], Sequence: 2, SubmitWorkMatch: 1 },
  ]));
  assert(ok(route) === true, `工艺路线新增失败：${route?.message || route?.Message}`);
  const routeId = Number(sqlScalar(`SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)}`));
  const product = await api('/api/Base_Product/Add', save({ ProductCode: fixture.product, ProductName: `${marker}_成品`, Unit_Id: unitId, ProductStandard: 'WF22', ProductAttribute: 'selfControl', Process_Id: routeId, MaxInventory: 100, MinInventory: 0, SafeInventory: 0, InventoryQty: 0 }, [], productExtra));
  assert(ok(product) === true, `产品新增失败：${product?.message || product?.Message}`);
  const productId = Number(sqlScalar(`SELECT Product_Id FROM Base_Product WHERE ProductCode=${sqlText(fixture.product)}`));
  const sales = await api('/api/Production_SalesOrder/Add', save({ SalesOrderCode: fixture.salesOrder, Remark: marker }, [{ Product_Id: productId, ProductCode: fixture.product, ProductName: `${marker}_成品`, ProductStandard: 'WF22', Qty: 40, FinishQty: 0 }]));
  assert(ok(sales) === true, `销售订单新增失败：${sales?.message || sales?.Message}`);
  const workOrderId = Number(sqlScalar(`SELECT WorkOrder_Id FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)}`));
  const defectItemId = Number(sqlScalar('SELECT TOP (1) DefectItem_Id FROM Base_DefectItem ORDER BY DefectItem_Id'));
  step('前置数据：两道工序、工艺路线、产品和工单', { processIds, routeId, productId, workOrderId, defectItemId });

  const now = new Date().toISOString();
  async function addReport(processId, reportQty, goodQty, noGoodQty, approveStatus = 2) {
    return api('/api/Production_ReportWorkOrder/Add', save({
      WorkOrder_Id: String(workOrderId), Process_Id: processId, Product_Id: productId,
      ProductCode: fixture.product, ProductName: `${marker}_成品`, ProductStandard: 'WF22', ProcessStatus: '2',
      ProductUser: String(auth.userId), ReportQty: reportQty, Unit_Id: unitId, GoodQty: goodQty, NoGoodQty: noGoodQty,
      StartDate: now, EndDate: now, ReportTime: now, PriceType: 1, ApproveStatus: approveStatus,
    }, noGoodQty > 0 ? [{ DefectItem: defectItemId, Qty: noGoodQty }] : []));
  }

  const ordinary = await addReport(processIds[fixture.process1], 10, 10, 0, 2);
  assert(ok(ordinary) === true, `普通工序报工失败：${ordinary?.message || ordinary?.Message}`);
  const ordinaryOutputCount = Number(sqlScalar(`SELECT COUNT(1) FROM Ware_WareHouseBill WHERE WareHouseBillType='production-output' AND WareHouseBillCode LIKE 'OUTPUT-RWO-%'`));
  assert(ordinaryOutputCount === 0, `普通工序错误产出成品，入库单数：${ordinaryOutputCount}`);
  step('异常分支：普通工序确认报工', { outputBillCount: ordinaryOutputCount, finishedProductNotProduced: true });

  const finalReport = await addReport(processIds[fixture.process2], 10, 8, 2, 2);
  assert(ok(finalReport) === true, `末工序报工失败：${finalReport?.message || finalReport?.Message}`);
  const outputRows = sqlLines(`SELECT h.WareHouseBillCode,h.WareHouseBillType,CONVERT(varchar(30),d.InStoreQty),h.Remark FROM Ware_WareHouseBill h INNER JOIN Ware_WareHouseBillList d ON d.WareHouseBill_Id=h.WareHouseBill_Id WHERE h.WareHouseBillType='production-output' AND d.Product_Id=${productId}`);
  assert(outputRows.length === 1 && outputRows[0].includes('|production-output|8.0000|') && outputRows[0].includes(`工单${workOrderId}`) && outputRows[0].includes(`工序${processIds[fixture.process2]}`), `自动产出入库单或关联信息不正确：${outputRows.join(',')}`);
  const inventory = sqlScalar(`SELECT CONVERT(varchar(30),InventoryQty) FROM View_GetProductStoreNumber WHERE Product_Id=${productId}`);
  assert(inventory === '8.0000', `末工序良品自动入库后库存应为8，实际为${inventory}`);
  step('末工序确认报工自动产出', { reportQty: 10, goodQty: 8, noGoodQty: 2, outputRows, inventory, reportAndWorkOrderTraceable: true });

  const unconfirmed = await addReport(processIds[fixture.process2], 5, 5, 0, 1);
  assert(ok(unconfirmed) === true, `未确认报工创建失败：${unconfirmed?.message || unconfirmed?.Message}`);
  const pureBad = await addReport(processIds[fixture.process2], 5, 0, 5, 2);
  assert(ok(pureBad) === true, `纯不良报工创建失败：${pureBad?.message || pureBad?.Message}`);
  const finalOutputCount = Number(sqlScalar(`SELECT COUNT(1) FROM Ware_WareHouseBill WHERE WareHouseBillType='production-output' AND WareHouseBillCode LIKE 'OUTPUT-RWO-%'`));
  const finalInventory = sqlScalar(`SELECT CONVERT(varchar(30),InventoryQty) FROM View_GetProductStoreNumber WHERE Product_Id=${productId}`);
  assert(finalOutputCount === 1 && finalInventory === '8.0000', `未确认或纯不良报工不应入正常库存：入库单${finalOutputCount}，库存${finalInventory}`);
  const source = readFileSync(join(root, '源码', 'iMES.Net', 'iMES.Production', 'Services', 'Production', 'Partial', 'Production_ReportWorkOrderService.cs'), 'utf8');
  assert(source.includes('OUTPUT-RWO-{reportWorkOrder.ReportWorkOrder_Id}') && source.includes('该报工已生成自动产出入库单，不能重复产出'), '自动产出未使用报工主键作为幂等单号。');
  step('异常分支：未确认、纯不良和重复产出保护', { outputBillCount: finalOutputCount, inventory: finalInventory, unconfirmedNoOutput: true, pureBadNoOutput: true, idempotentBillCode: true });
}

let error;
try { await execute(); report.status = 'passed'; }
catch (caught) { error = caught; report.status = 'failed'; report.error = caught.stack || caught.message; }
finally {
  try { cleanup(); report.cleanup = 'passed'; } catch (caught) { report.cleanup = `failed: ${caught.message}`; if (!error) error = caught; }
  report.finishedAt = new Date().toISOString();
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `wf-22-auto-output-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: report.status, cleanup: report.cleanup, resultPath }, null, 2)}\n`);
}
if (error) throw error;
