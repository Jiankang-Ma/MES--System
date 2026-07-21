#!/usr/bin/env node
/**
 * WF-07：父/子项 BOM、下拉/高级选择数据源、按工序报工自动扣料。
 * 所有夹具以 AUTOTEST_WF07_ 开头，并在 finally 中清理。
 */
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testsDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(testsDir, '..', '..');
const apiRoot = join(root, '源码', 'iMES.Net', 'iMES.WebApi');
const resultsDir = join(testsDir, '..', 'results');
const marker = `AUTOTEST_WF07_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const fixture = {
  process1: `${marker}_P1`, process2: `${marker}_P2`, route: `${marker}_ROUTE`,
  parent: `${marker}_PARENT`, child1: `${marker}_M1`, child2: `${marker}_M2`,
  salesOrder: `${marker}_SO`, inbound: `${marker}_IN`,
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
    `/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d iMES -C -h -1 -W -s "|" -Q ${JSON.stringify(query)}`]);
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
function cleanup() {
  const productCodes = [fixture.parent, fixture.child1, fixture.child2].map(sqlText).join(',');
  const cleanupSql = `
DELETE l FROM Ware_OutWareHouseBillList l INNER JOIN Ware_OutWareHouseBill h ON h.OutWareHouseBill_Id=l.OutWareHouseBill_Id INNER JOIN Production_ReportWorkOrder r ON h.OutWareHouseBillCode=CONCAT('BOM-RWO-',r.ReportWorkOrder_Id) WHERE r.ProductCode=${sqlText(fixture.parent)};
DELETE h FROM Ware_OutWareHouseBill h INNER JOIN Production_ReportWorkOrder r ON h.OutWareHouseBillCode=CONCAT('BOM-RWO-',r.ReportWorkOrder_Id) WHERE r.ProductCode=${sqlText(fixture.parent)};
DELETE FROM Production_ReportWorkOrder WHERE ProductCode=${sqlText(fixture.parent)};
DELETE wol FROM Production_WorkOrderList wol INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id=wol.WorkOrder_Id WHERE wo.AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)};
DELETE FROM Production_SalesOrderList WHERE SalesOrder_Id IN (SELECT SalesOrder_Id FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)});
DELETE FROM Production_SalesOrder WHERE SalesOrderCode=${sqlText(fixture.salesOrder)};
DELETE wbl FROM Ware_WareHouseBillList wbl INNER JOIN Ware_WareHouseBill wb ON wb.WareHouseBill_Id=wbl.WareHouseBill_Id WHERE wb.WareHouseBillCode=${sqlText(fixture.inbound)};
DELETE FROM Ware_WareHouseBill WHERE WareHouseBillCode=${sqlText(fixture.inbound)};
DELETE FROM Base_MaterialDetail WHERE ParentProduct_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode IN (${productCodes})) OR ChildProduct_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode IN (${productCodes}));
DELETE FROM Base_Product_ExtendData WHERE Product_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode IN (${productCodes}));
DELETE FROM Base_Product WHERE ProductCode IN (${productCodes});
DELETE FROM Base_ProcessLineList WHERE ProcessLine_Id IN (SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)});
DELETE FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)};
DELETE FROM Base_Process_ExtendData WHERE Process_Id IN (SELECT Process_Id FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)}));
DELETE FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)});`;
  sql(cleanupSql);
}

async function execute() {
  assert(sqlPassword, '未找到 .env 中的 MSSQL_SA_PASSWORD。');
  assert(run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim(), 'SQL Server 未启动。');
  assert(run('docker', ['compose', 'ps', '-q', 'api']).trim(), 'API 未启动。');
  cleanup();
  const auth = createToken(); token = auth.token;
  const unitId = Number(sqlScalar('SELECT TOP (1) Unit_Id FROM Sys_Unit ORDER BY Unit_Id'));
  const processExtra = extensionValues('Base_Process'); const productExtra = extensionValues('Base_Product');
  for (const [code, name] of [[fixture.process1, '工序一'], [fixture.process2, '工序二']]) {
    const added = await api('/api/Base_Process/Add', save({ ProcessCode: code, ProcessName: `${marker}_${name}`, SubmitWorkLimit: '0', SubmitWorkMatch: 1, DefectItem: '0' }, [], processExtra));
    assert(ok(added) === true, `工序新增失败：${added?.message || added?.Message}`);
  }
  const processRows = sqlLines(`SELECT Process_Id,ProcessCode FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.process1)},${sqlText(fixture.process2)}) ORDER BY ProcessCode`);
  const processIds = Object.fromEntries(processRows.map((line) => { const [id, code] = line.split('|'); return [code, Number(id)]; }));
  const routeAdded = await api('/api/Base_ProcessLine/Add', save({ ProcessLineCode: fixture.route, ProcessLineName: `${marker}_路线` }, [
    { ProcessLineType: 'process', Process_Id: processIds[fixture.process1], Sequence: 1, SubmitWorkMatch: 1 },
    { ProcessLineType: 'process', Process_Id: processIds[fixture.process2], Sequence: 2, SubmitWorkMatch: 1 },
  ]));
  assert(ok(routeAdded) === true, '工艺路线新增失败。');
  const routeId = Number(sqlScalar(`SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode=${sqlText(fixture.route)}`));
  const products = [[fixture.parent, '父项成品', routeId], [fixture.child1, '子项M1', null], [fixture.child2, '子项M2', null]];
  for (const [code, name, processId] of products) {
    const added = await api('/api/Base_Product/Add', save({ ProductCode: code, ProductName: `${marker}_${name}`, Unit_Id: unitId, ProductStandard: 'WF07', ProductAttribute: 'selfControl', Process_Id: processId, MaxInventory: 100, MinInventory: 0, SafeInventory: 0, InventoryQty: 0 }, [], productExtra));
    assert(ok(added) === true, `产品 ${code} 新增失败：${added?.message || added?.Message}`);
  }
  const productRows = sqlLines(`SELECT Product_Id,ProductCode FROM Base_Product WHERE ProductCode IN (${products.map(([code]) => sqlText(code)).join(',')})`);
  const productIds = Object.fromEntries(productRows.map((line) => { const [id, code] = line.split('|'); return [code, Number(id)]; }));
  step('基础数据：父项、两个子项与两道工序', { processIds, productIds });

  const selector = await api('/api/Base_Product/getSelectorDemo', { page: 1, rows: 20, sort: 'CreateDate', order: 'desc', wheres: JSON.stringify([{ name: 'ProductCode', value: marker, displayType: 'like' }]) });
  assert(Array.isArray(selector?.rows) && selector.rows.length === 3, '高级选择使用的产品选择接口未返回三条测试产品。');
  const extensionSource = readFileSync(join(root, '源码', 'iMES.Vue3', 'src', 'extension', 'custom', 'custom', 'View_Base_MaterialDetail.js'), 'utf8');
  assert(extensionSource.includes('openDemo("ParentProduct_Id")') && extensionSource.includes('openDemo("ChildProduct_Id")'), '前端未同时配置父项和子项的高级选择入口。');
  step('下拉/高级选择数据源', { selectorRows: selector.rows.length, parentAndChildAdvancedSelect: true });

  const bomInputs = [
    [productIds[fixture.child1], processIds[fixture.process1], 2],
    [productIds[fixture.child2], processIds[fixture.process2], 0.5],
  ];
  for (const [childId, processId, quantityPer] of bomInputs) {
    const added = await api('/api/View_Base_MaterialDetail/Add', save({ ParentProduct_Id: productIds[fixture.parent], ChildProduct_Id: childId, Process_Id: processId, QuantityPer: quantityPer, Remark: marker }));
    assert(ok(added) === true, `BOM新增失败：${added?.message || added?.Message}`);
  }
  const bomRows = sqlLines(`SELECT ChildProduct_Id,Process_Id,CONVERT(varchar(30),QuantityPer) FROM Base_MaterialDetail WHERE ParentProduct_Id=${productIds[fixture.parent]} ORDER BY Process_Id`);
  assert(bomRows.length === 2 && bomRows.some((line) => line.endsWith('|2.0000')) && bomRows.some((line) => line.endsWith('|0.5000')), `BOM父子用量未正确保存：${bomRows.join(',')}`);
  const duplicate = await api('/api/View_Base_MaterialDetail/Add', save({ ParentProduct_Id: productIds[fixture.parent], ChildProduct_Id: productIds[fixture.child1], Process_Id: processIds[fixture.process1], QuantityPer: 2 }));
  const zero = await api('/api/View_Base_MaterialDetail/Add', save({ ParentProduct_Id: productIds[fixture.parent], ChildProduct_Id: productIds[fixture.child1], Process_Id: processIds[fixture.process2], QuantityPer: 0 }));
  const self = await api('/api/View_Base_MaterialDetail/Add', save({ ParentProduct_Id: productIds[fixture.parent], ChildProduct_Id: productIds[fixture.parent], Process_Id: processIds[fixture.process1], QuantityPer: 1 }));
  assert(ok(duplicate) === false && ok(zero) === false && ok(self) === false, '重复、零用量或父子相同BOM未全部被拒绝。');
  step('BOM维护与异常校验', { bomRows, decimalQuantitySupported: true, duplicateRejected: true, zeroRejected: true, selfRejected: true });

  const now = new Date().toISOString();
  const inbound = await api('/api/Ware_WareHouseBill/Add', save({ WareHouseBillCode: fixture.inbound, WareHouseBillType: 'common', WareHouseDate: now, Remark: marker }, [
    { Product_Id: productIds[fixture.child1], ProductCode: fixture.child1, ProductName: `${marker}_子项M1`, ProductStandard: 'WF07', Unit_Id: unitId, InStoreQty: 10 },
    { Product_Id: productIds[fixture.child2], ProductCode: fixture.child2, ProductName: `${marker}_子项M2`, ProductStandard: 'WF07', Unit_Id: unitId, InStoreQty: 5 },
  ]));
  assert(ok(inbound) === true, `子项入库失败：${inbound?.message || inbound?.Message}`);
  const sales = await api('/api/Production_SalesOrder/Add', save({ SalesOrderCode: fixture.salesOrder, Remark: marker }, [{ Product_Id: productIds[fixture.parent], ProductCode: fixture.parent, ProductName: `${marker}_父项成品`, ProductStandard: 'WF07', Qty: 3, FinishQty: 0 }]));
  assert(ok(sales) === true, '销售订单新增失败，无法生成报工测试工单。');
  const workOrderId = Number(sqlScalar(`SELECT WorkOrder_Id FROM Production_WorkOrder WHERE AssociatedForm=${sqlText(fixture.salesOrder)}`));
  const report = async (processId, qty) => api('/api/Production_ReportWorkOrder/Add', save({ WorkOrder_Id: String(workOrderId), Process_Id: processId, Product_Id: productIds[fixture.parent], ProductCode: fixture.parent, ProductName: `${marker}_父项成品`, ProductStandard: 'WF07', ProcessStatus: '2', ProductUser: String(auth.userId), ReportQty: qty, Unit_Id: unitId, GoodQty: qty, NoGoodQty: 0, StartDate: now, EndDate: now, ReportTime: now, PriceType: 1, ApproveStatus: 2 }));
  assert(ok(await report(processIds[fixture.process1], 3)) === true, '第一道工序报工失败。');
  assert(ok(await report(processIds[fixture.process2], 3)) === true, '第二道工序报工失败。');
  const inventories = sqlLines(`SELECT p.ProductCode,CONVERT(varchar(30),v.InventoryQty) FROM View_GetProductStoreNumber v INNER JOIN Base_Product p ON p.Product_Id=v.Product_Id WHERE p.ProductCode IN (${sqlText(fixture.child1)},${sqlText(fixture.child2)}) ORDER BY p.ProductCode`);
  assert(inventories.includes(`${fixture.child1}|4.0000`) && inventories.includes(`${fixture.child2}|3.5000`), `报工扣料库存不正确：${inventories.join(',')}`);
  const consumeBills = Number(sqlScalar(`SELECT COUNT(1) FROM Ware_OutWareHouseBill WHERE OutWareHouseBillCode LIKE 'BOM-RWO-%' AND Remark LIKE N'报工%自动扣料'`));
  const insufficient = await report(processIds[fixture.process1], 3);
  assert(ok(insufficient) === false, '库存不足时的报工未被拒绝。');
  const reportCount = Number(sqlScalar(`SELECT COUNT(1) FROM Production_ReportWorkOrder WHERE ProductCode=${sqlText(fixture.parent)}`));
  assert(reportCount === 2, `库存不足报工不应落库，实际报工数 ${reportCount}`);
  step('报工生效：按工序BOM自动扣料', { workOrderId, inventories, consumeBills, insufficientInventoryRejected: true, reportCount });
}

let error;
try { await execute(); report.status = 'passed'; }
catch (caught) { error = caught; report.status = 'failed'; report.error = caught.stack || caught.message; }
finally {
  try { cleanup(); report.cleanup = 'passed'; } catch (caught) { report.cleanup = `failed: ${caught.message}`; if (!error) error = caught; }
  report.finishedAt = new Date().toISOString();
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `wf-07-bom-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: report.status, cleanup: report.cleanup, resultPath }, null, 2)}\n`);
}
if (error) throw error;
