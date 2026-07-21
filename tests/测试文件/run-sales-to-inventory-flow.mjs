#!/usr/bin/env node
/**
 * 实例业务链测试：多产品销售订单/生产计划 -> 生产工单 -> 多工序任务 -> 分批报工 -> 完工 -> 入库 -> 销售出库。
 *
 * 实际覆盖：创建两道工序、路线和两产品；多产品销售订单和生产计划自动生成工单及任务；
 * 开工、首工序分批报工、末工序报工、完工汇总、成品入库、销售出库及库存收发明细。
 * 所有夹具以 AUTOTEST_FLOW_ 开头，并在 finally 中按依赖反向删除。
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
const marker = `AUTOTEST_FLOW_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const quantity = 7;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const report = { startedAt: new Date().toISOString(), marker, quantity, steps: [], cleanup: null };
const fixture = {
  firstProcessCode: `${marker}_P1`,
  secondProcessCode: `${marker}_P2`,
  processLineCode: `${marker}_ROUTE`,
  productCode: `${marker}_PRODUCT`,
  secondProductCode: `${marker}_PRODUCT_B`,
  salesOrderCode: `${marker}_SO`,
  productPlanCode: `${marker}_PLAN`,
};

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
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

function redact(value) {
  return String(value).replaceAll(sqlPassword || '', '***');
}

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
    fail(`${command} ${args.slice(0, 4).join(' ')} failed: ${redact(`${stdout}\n${stderr}`.trim())}`);
  }
}

function sql(query) {
  return run('docker', [
    'compose', 'exec', '-T', 'sqlserver-x64', '/opt/mssql-tools18/bin/sqlcmd',
    '-S', 'localhost', '-U', 'sa', '-P', sqlPassword, '-d', sqlDatabase,
    '-C', '-h', '-1', '-W', '-s', '|', '-Q', query,
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
  const line = sqlLines(query)[0];
  assert(line !== undefined, `SQL 未返回结果: ${query.slice(0, 160)}`);
  return line.split('|')[0].trim();
}

function sqlText(value) {
  return `N'${String(value).replaceAll("'", "''")}'`;
}

function jwtSecret() {
  const settings = readFileSync(join(apiRoot, 'appsettings.json'), 'utf8');
  const match = settings.match(/"JWT"\s*:\s*"([^"]+)"/);
  assert(match, '无法从 appsettings.json 读取 JWT 配置。');
  return match[1];
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function createAdminToken() {
  const userId = Number(sqlScalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName = 'admin' ORDER BY User_Id"));
  assert(Number.isInteger(userId) && userId > 0, '未找到 admin 用户，无法执行 API 集成测试。');
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    jti: String(userId), iat: now, nbf: now, exp: now + 3600,
    iss: 'iMES.core.owner', aud: 'iMES.core',
  }));
  const signature = createHmac('sha256', jwtSecret()).update(`${header}.${payload}`).digest('base64url');
  return { token: `${header}.${payload}.${signature}`, userId };
}

let token;

async function apiPost(path, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    fail(`${path} 返回非 JSON（HTTP ${response.status}）：${text.slice(0, 300)}`);
  }
  if (!response.ok) fail(`${path} 返回 HTTP ${response.status}：${data?.message || data?.Message || text.slice(0, 300)}`);
  return data;
}

async function apiGet(path) {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const text = await response.text();
  if (!response.ok) fail(`${path} 返回 HTTP ${response.status}：${text.slice(0, 300)}`);
  return text;
}

function responseStatus(data) {
  return data?.status ?? data?.Status;
}

function save(mainData, detailData = [], extra = null) {
  return { mainData, detailData, delKeys: [], ...(extra === null ? {} : { extra: JSON.stringify(extra) }) };
}

function step(name, details) {
  report.steps.push({ name, ...details });
}

function getExtensionValues(tableName) {
  const fields = sqlLines(`SELECT FieldCode FROM Sys_Table_Extend WHERE TableName = ${sqlText(tableName)} ORDER BY TableEx_Id`)
    .map((line) => line.split('|')[0]);
  return Object.fromEntries(fields.map((field) => [field, `${marker}_EXT` ]));
}

function cleanup() {
  const productCode = sqlText(fixture.productCode);
  const secondProductCode = sqlText(fixture.secondProductCode);
  const salesOrderCode = sqlText(fixture.salesOrderCode);
  const productPlanCode = sqlText(fixture.productPlanCode);
  const routeCode = sqlText(fixture.processLineCode);
  const firstProcessCode = sqlText(fixture.firstProcessCode);
  const secondProcessCode = sqlText(fixture.secondProcessCode);
  const cleanupSql = `
DELETE rwol FROM Production_ReportWorkOrderList rwol
INNER JOIN Production_ReportWorkOrder rwo ON rwo.ReportWorkOrder_Id = rwol.ReportWorkOrder_Id
WHERE rwo.ProductCode = ${productCode};
DELETE FROM Production_ReportWorkOrder WHERE ProductCode = ${productCode};
DELETE owbl FROM Ware_OutWareHouseBillList owbl
INNER JOIN Ware_OutWareHouseBill owb ON owb.OutWareHouseBill_Id = owbl.OutWareHouseBill_Id
WHERE owb.OutWareHouseBillCode = ${sqlText(`${marker}_OUT`)};
DELETE FROM Ware_OutWareHouseBill WHERE OutWareHouseBillCode = ${sqlText(`${marker}_OUT`)};
DELETE owbl FROM Ware_OutWareHouseBillList owbl
INNER JOIN Ware_OutWareHouseBill owb ON owb.OutWareHouseBill_Id = owbl.OutWareHouseBill_Id
WHERE owb.OutWareHouseBillCode = ${sqlText(`${marker}_OUT_EXCESS`)};
DELETE FROM Ware_OutWareHouseBill WHERE OutWareHouseBillCode = ${sqlText(`${marker}_OUT_EXCESS`)};
DELETE wbl FROM Ware_WareHouseBillList wbl
INNER JOIN Ware_WareHouseBill wb ON wb.WareHouseBill_Id = wbl.WareHouseBill_Id
WHERE wb.WareHouseBillCode = ${sqlText(`${marker}_IN`)};
DELETE FROM Ware_WareHouseBill WHERE WareHouseBillCode = ${sqlText(`${marker}_IN`)};
DELETE wol FROM Production_WorkOrderList wol
INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id = wol.WorkOrder_Id
WHERE wo.AssociatedForm = ${productPlanCode};
DELETE FROM Production_WorkOrder WHERE AssociatedForm = ${productPlanCode};
DELETE FROM Production_ProductPlanList WHERE ProductPlan_Id IN (SELECT ProductPlan_Id FROM Production_ProductPlan WHERE ProductPlanCode = ${productPlanCode});
DELETE FROM Production_ProductPlan WHERE ProductPlanCode = ${productPlanCode};
DELETE wol FROM Production_WorkOrderList wol
INNER JOIN Production_WorkOrder wo ON wo.WorkOrder_Id = wol.WorkOrder_Id
WHERE wo.AssociatedForm = ${salesOrderCode};
DELETE FROM Production_WorkOrder WHERE AssociatedForm = ${salesOrderCode};
DELETE FROM Production_SalesOrderList WHERE SalesOrder_Id IN (SELECT SalesOrder_Id FROM Production_SalesOrder WHERE SalesOrderCode = ${salesOrderCode});
DELETE FROM Production_SalesOrder WHERE SalesOrderCode = ${salesOrderCode};
DELETE FROM Base_Product_ExtendData WHERE Product_Id IN (SELECT Product_Id FROM Base_Product WHERE ProductCode IN (${productCode}, ${secondProductCode}));
DELETE FROM Base_Product WHERE ProductCode IN (${productCode}, ${secondProductCode});
DELETE FROM Base_ProcessLineList WHERE ProcessLine_Id IN (SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode = ${routeCode});
DELETE FROM Base_ProcessLine WHERE ProcessLineCode = ${routeCode};
DELETE FROM Base_Process_ExtendData WHERE Process_Id IN (SELECT Process_Id FROM Base_Process WHERE ProcessCode IN (${firstProcessCode}, ${secondProcessCode}));
DELETE FROM Base_Process WHERE ProcessCode IN (${firstProcessCode}, ${secondProcessCode});`;
  sql(cleanupSql);
  const remaining = Number(sqlScalar(`SELECT COUNT(1) FROM Base_Product WHERE ProductCode = ${productCode}`));
  assert(remaining === 0, '测试清理后产品记录仍存在。');
}

function ensureDependencies() {
  assert(sqlPassword, '未找到 MSSQL_SA_PASSWORD。请配置项目根目录 .env。');
  const sqlContainer = run('docker', ['compose', '--profile', 'x64-sqlserver', 'ps', '-q', 'sqlserver-x64']).trim();
  const apiContainer = run('docker', ['compose', 'ps', '-q', 'api']).trim();
  assert(sqlContainer, 'SQL Server 未启动。');
  assert(apiContainer, 'API 未启动。');
}

async function executeFlow() {
  ensureDependencies();
  cleanup();
  const auth = createAdminToken();
  token = auth.token;
  const unitId = Number(sqlScalar('SELECT TOP (1) Unit_Id FROM Sys_Unit ORDER BY Unit_Id'));
  assert(unitId > 0, '未找到可用于测试的库存单位。');
  const processExtra = getExtensionValues('Base_Process');
  const productExtra = getExtensionValues('Base_Product');

  const processInputs = [
    { ProcessCode: fixture.firstProcessCode, ProcessName: `${marker}_工序一` },
    { ProcessCode: fixture.secondProcessCode, ProcessName: `${marker}_工序二` },
  ];
  for (const process of processInputs) {
    const added = await apiPost('/api/Base_Process/Add', save({
      ...process, SubmitWorkLimit: '0', SubmitWorkMatch: 1, DefectItem: '0',
    }, [], processExtra));
    assert(responseStatus(added) === true, `工序新增失败：${added?.message || added?.Message}`);
  }
  const processRows = sqlLines(`SELECT Process_Id,ProcessCode FROM Base_Process WHERE ProcessCode IN (${sqlText(fixture.firstProcessCode)}, ${sqlText(fixture.secondProcessCode)}) ORDER BY ProcessCode`);
  assert(processRows.length === 2, `应创建两道工序，实际 ${processRows.length} 条。`);
  const processIds = Object.fromEntries(processRows.map((line) => {
    const [id, code] = line.split('|');
    return [code, Number(id)];
  }));
  step('基础数据：工序', { processIds });

  const routeAdded = await apiPost('/api/Base_ProcessLine/Add', save({
    ProcessLineCode: fixture.processLineCode,
    ProcessLineName: `${marker}_工艺路线`,
  }, [
    { ProcessLineType: 'process', Process_Id: processIds[fixture.firstProcessCode], Sequence: 1, SubmitWorkMatch: 1 },
    { ProcessLineType: 'process', Process_Id: processIds[fixture.secondProcessCode], Sequence: 2, SubmitWorkMatch: 1 },
  ]));
  assert(responseStatus(routeAdded) === true, `工艺路线新增失败：${routeAdded?.message || routeAdded?.Message}`);
  const routeId = Number(sqlScalar(`SELECT ProcessLine_Id FROM Base_ProcessLine WHERE ProcessLineCode = ${sqlText(fixture.processLineCode)}`));
  const routeTaskCount = Number(sqlScalar(`SELECT COUNT(1) FROM Base_ProcessLineList WHERE ProcessLine_Id = ${routeId} AND ProcessLineType = 'process'`));
  assert(routeTaskCount === 2, `工艺路线应有两道工序，实际 ${routeTaskCount} 条。`);
  step('工艺路线', { routeId, routeTaskCount });

  const productAdded = await apiPost('/api/Base_Product/Add', save({
    ProductCode: fixture.productCode,
    ProductName: `${marker}_产品`,
    Unit_Id: unitId,
    ProductStandard: 'AUTOTEST',
    ProductAttribute: 'selfControl',
    Process_Id: routeId,
    MaxInventory: 100,
    MinInventory: 0,
    SafeInventory: 0,
    InventoryQty: 0,
  }, [], productExtra));
  assert(responseStatus(productAdded) === true, `产品新增失败：${productAdded?.message || productAdded?.Message}`);
  const productId = Number(sqlScalar(`SELECT Product_Id FROM Base_Product WHERE ProductCode = ${sqlText(fixture.productCode)}`));
  assert(productId > 0, '产品新增后未查到记录。');
  step('产品定义', { productId, unitId });

  const secondProductAdded = await apiPost('/api/Base_Product/Add', save({
    ProductCode: fixture.secondProductCode,
    ProductName: `${marker}_产品B`,
    Unit_Id: unitId,
    ProductStandard: 'AUTOTEST',
    ProductAttribute: 'selfControl',
    Process_Id: routeId,
    MaxInventory: 100,
    MinInventory: 0,
    SafeInventory: 0,
    InventoryQty: 0,
  }, [], productExtra));
  assert(responseStatus(secondProductAdded) === true, `第二产品新增失败：${secondProductAdded?.message || secondProductAdded?.Message}`);
  const secondProductId = Number(sqlScalar(`SELECT Product_Id FROM Base_Product WHERE ProductCode = ${sqlText(fixture.secondProductCode)}`));
  assert(secondProductId > 0, '第二产品新增后未查到记录。');

  const salesAdded = await apiPost('/api/Production_SalesOrder/Add', save({
    SalesOrderCode: fixture.salesOrderCode,
    Remark: 'AUTOTEST sales-to-inventory flow',
  }, [{
    Product_Id: productId,
    ProductCode: fixture.productCode,
    ProductName: `${marker}_产品`,
    ProductStandard: 'AUTOTEST',
    Qty: quantity,
    FinishQty: 0,
  }, {
    Product_Id: secondProductId,
    ProductCode: fixture.secondProductCode,
    ProductName: `${marker}_产品B`,
    ProductStandard: 'AUTOTEST',
    Qty: quantity + 2,
    FinishQty: 0,
  }]));
  assert(responseStatus(salesAdded) === true, `销售订单新增失败：${salesAdded?.message || salesAdded?.Message}`);
  const salesOrderId = Number(sqlScalar(`SELECT SalesOrder_Id FROM Production_SalesOrder WHERE SalesOrderCode = ${sqlText(fixture.salesOrderCode)}`));
  const allSalesWorkOrders = sqlLines(`SELECT Product_Id,PlanQty FROM Production_WorkOrder WHERE AssociatedForm = ${sqlText(fixture.salesOrderCode)} ORDER BY Product_Id`);
  assert(allSalesWorkOrders.length === 2 && allSalesWorkOrders.some((row) => row === `${productId}|${quantity}`) && allSalesWorkOrders.some((row) => row === `${secondProductId}|${quantity + 2}`),
    `多产品销售订单工单生成不正确：${allSalesWorkOrders.join(', ')}`);
  const workOrderRow = sqlLines(`SELECT WorkOrder_Id,WorkOrderCode,Status,PlanQty,FromType,AssociatedForm FROM Production_WorkOrder WHERE AssociatedForm = ${sqlText(fixture.salesOrderCode)} AND Product_Id = ${productId}`)[0];
  assert(workOrderRow, '销售订单新增后没有自动生成生产工单。');
  const [workOrderIdText, workOrderCode, workOrderStatus, workOrderQty, fromType, associatedForm] = workOrderRow.split('|');
  const workOrderId = Number(workOrderIdText);
  assert(workOrderStatus === '1' && Number(workOrderQty) === quantity && fromType === 'SalesOrder' && associatedForm === fixture.salesOrderCode,
    `自动工单字段不正确：${workOrderRow}`);
  const generatedTasks = sqlLines(`SELECT Process_Id,ProcessCode,PlanQty FROM Production_WorkOrderList WHERE WorkOrder_Id = ${workOrderId} ORDER BY Process_Id`);
  assert(generatedTasks.length === 2 && generatedTasks.every((line) => Number(line.split('|')[2]) === quantity),
    `自动拆分任务不正确：${generatedTasks.join(', ')}`);
  step('销售订单 -> 自动工单 -> 自动拆分任务', { salesOrderId, workOrderId, workOrderCode, generatedTasks, multiProductWorkOrders: allSalesWorkOrders });

  const workOrderPage = await apiPost('/api/Production_WorkOrder/GetPageData', {
    page: 1, rows: 20, sort: 'CreateDate', order: 'desc',
    wheres: JSON.stringify([{ name: 'WorkOrderCode', value: workOrderCode, displayType: 'like' }]),
  });
  assert(Array.isArray(workOrderPage?.rows) && workOrderPage.rows.some((row) => String(row.workOrderCode ?? row.WorkOrderCode) === workOrderCode),
    '工单分页接口未返回自动生成的工单。');

  await apiGet(`/api/Production_WorkOrder/changeUpdate?workOrderId=${workOrderId}&status=2`);
  assert(sqlScalar(`SELECT Status FROM Production_WorkOrder WHERE WorkOrder_Id = ${workOrderId}`) === '2', '工单开工状态未更新为 2。');
  step('生产开工', { workOrderId, status: '2' });

  const productName = `${marker}_产品`;
  const now = new Date().toISOString();
  const reportInputs = [
    { processCode: fixture.firstProcessCode, reportQty: 3 },
    { processCode: fixture.firstProcessCode, reportQty: quantity - 3 },
    { processCode: fixture.secondProcessCode, reportQty: quantity },
  ];
  for (const { processCode, reportQty } of reportInputs) {
    const reportAdded = await apiPost('/api/Production_ReportWorkOrder/Add', save({
      WorkOrder_Id: String(workOrderId),
      Process_Id: processIds[processCode],
      Product_Id: productId,
      ProductCode: fixture.productCode,
      ProductName: productName,
      ProductStandard: 'AUTOTEST',
      ProcessStatus: '2',
      ProductUser: String(auth.userId),
      ReportQty: reportQty,
      Unit_Id: unitId,
      GoodQty: reportQty,
      NoGoodQty: 0,
      StartDate: now,
      EndDate: now,
      ReportTime: now,
      PriceType: 1,
      ApproveStatus: 1,
    }));
    assert(responseStatus(reportAdded) === true, `工序 ${processCode} 报工失败：${reportAdded?.message || reportAdded?.Message}`);
  }
  const reportCount = Number(sqlScalar(`SELECT COUNT(1) FROM Production_ReportWorkOrder WHERE WorkOrder_Id = ${sqlText(workOrderId)}`));
  assert(reportCount === 3, `应生成三条报工记录（首工序分两批、末工序一批），实际 ${reportCount} 条。`);
  const firstProcessTotal = Number(sqlScalar(`SELECT SUM(GoodQty) FROM Production_ReportWorkOrder WHERE WorkOrder_Id = ${workOrderId} AND Process_Id = ${processIds[fixture.firstProcessCode]}`));
  assert(firstProcessTotal === quantity, `首工序分批报工累计应为 ${quantity}，实际 ${firstProcessTotal}。`);
  step('PC 端正常报工与分批累计', { reportCount, firstProcessBatches: [3, quantity - 3], firstProcessTotal, finalProcessId: processIds[fixture.secondProcessCode] });

  await apiGet(`/api/Production_WorkOrder/changeUpdate?workOrderId=${workOrderId}&status=3`);
  const completed = sqlLines(`SELECT Status,GoodQty,NoGoodQty,RealQty FROM Production_WorkOrder WHERE WorkOrder_Id = ${workOrderId}`)[0].split('|');
  assert(completed[0] === '3' && Number(completed[1]) === quantity && Number(completed[2]) === 0 && Number(completed[3]) === quantity,
    `工单完工汇总不正确：${completed.join('|')}`);
  step('工单完工汇总', { status: completed[0], goodQty: Number(completed[1]), realQty: Number(completed[3]) });

  const productionReportRows = Number(sqlScalar(`SELECT COUNT(1) FROM View_ProductionReport WHERE WorkOrderCode = ${sqlText(workOrderCode)}`));
  assert(productionReportRows === 2, `生产报表应返回两条工序记录，实际 ${productionReportRows} 条。`);
  step('生产报表与工单任务核对', { workOrderCode, productionReportRows });

  const inboundCode = `${marker}_IN`;
  const inboundAdded = await apiPost('/api/Ware_WareHouseBill/Add', save({
    WareHouseBillCode: inboundCode,
    WareHouseBillType: 'common',
    WareHouseDate: now,
    Remark: 'AUTOTEST completed-product inbound',
  }, [{
    Product_Id: productId,
    ProductCode: fixture.productCode,
    ProductName: productName,
    ProductStandard: 'AUTOTEST',
    Unit_Id: unitId,
    MaxInventory: 100,
    MinInventory: 0,
    SafeInventory: 0,
    InStoreQty: quantity,
  }]));
  assert(responseStatus(inboundAdded) === true, `入库单新增失败：${inboundAdded?.message || inboundAdded?.Message}`);
  const inboundDetailCount = Number(sqlScalar(`SELECT COUNT(1) FROM Ware_WareHouseBillList wbl INNER JOIN Ware_WareHouseBill wb ON wb.WareHouseBill_Id = wbl.WareHouseBill_Id WHERE wb.WareHouseBillCode = ${sqlText(inboundCode)} AND wbl.Product_Id = ${productId} AND wbl.InStoreQty = ${quantity}`));
  assert(inboundDetailCount === 1, '入库明细未正确关联产品和数量。');
  const inventory = Number(sqlScalar(`SELECT ISNULL(InventoryQty, 0) FROM View_GetProductStoreNumber WHERE Product_Id = ${productId}`));
  assert(inventory === quantity, `库存统计应为 ${quantity}，实际 ${inventory}。`);
  step('成品入库与库存统计', { inboundCode, inventory });

  const excessOutbound = await apiPost('/api/Ware_OutWareHouseBill/Add', save({
    OutWareHouseBillCode: `${marker}_OUT_EXCESS`,
    OutWareHouseBillType: 'sale',
    OutWareHouseDate: now,
    Remark: 'AUTOTEST supplementary-negative-stock-protection',
  }, [{
    Product_Id: productId,
    ProductCode: fixture.productCode,
    ProductName: productName,
    ProductStandard: 'AUTOTEST',
    Unit_Id: unitId,
    OutStoreQty: quantity + 1,
  }]));
  assert(responseStatus(excessOutbound) === false, '补充负库存保护：超可用库存的销售出库未被拒绝。');
  assert(Number(sqlScalar(`SELECT COUNT(1) FROM Ware_OutWareHouseBill WHERE OutWareHouseBillCode = ${sqlText(`${marker}_OUT_EXCESS`)}`)) === 0,
    '补充负库存保护：超可用库存的销售出库不应保存单据。');
  step('补充：销售出库负库存保护', { requestedQty: quantity + 1, availableQty: quantity });

  const outboundCode = `${marker}_OUT`;
  const outboundAdded = await apiPost('/api/Ware_OutWareHouseBill/Add', save({
    OutWareHouseBillCode: outboundCode,
    OutWareHouseBillType: 'sale',
    OutWareHouseDate: now,
    Remark: 'AUTOTEST completed-product sales outbound',
  }, [{
    Product_Id: productId,
    ProductCode: fixture.productCode,
    ProductName: productName,
    ProductStandard: 'AUTOTEST',
    Unit_Id: unitId,
    MaxInventory: 100,
    MinInventory: 0,
    SafeInventory: 0,
    InventoryQty: quantity,
    OutStoreQty: quantity,
  }]));
  assert(responseStatus(outboundAdded) === true, `销售出库单新增失败：${outboundAdded?.message || outboundAdded?.Message}`);
  const outboundDetailCount = Number(sqlScalar(`SELECT COUNT(1) FROM Ware_OutWareHouseBillList owbl INNER JOIN Ware_OutWareHouseBill owb ON owb.OutWareHouseBill_Id = owbl.OutWareHouseBill_Id WHERE owb.OutWareHouseBillCode = ${sqlText(outboundCode)} AND owbl.Product_Id = ${productId} AND owbl.OutStoreQty = ${quantity}`));
  assert(outboundDetailCount === 1, '销售出库明细未正确关联产品和数量。');
  const remainingInventory = Number(sqlScalar(`SELECT ISNULL(InventoryQty, 0) FROM View_GetProductStoreNumber WHERE Product_Id = ${productId}`));
  assert(remainingInventory === 0, `销售出库后库存应为 0，实际 ${remainingInventory}。`);
  const inOutDetailCount = Number(sqlScalar(`SELECT COUNT(1) FROM View_WareInOutDetail WHERE ProductCode = ${sqlText(fixture.productCode)}`));
  assert(inOutDetailCount === 2, `库存收发明细应有入库和出库各一条，实际 ${inOutDetailCount} 条。`);
  step('销售出库、库存余额与收发明细', { outboundCode, remainingInventory, inOutDetailCount });

  const planAdded = await apiPost('/api/Production_ProductPlan/Add', save({
    ProductPlanCode: fixture.productPlanCode,
    Remark: 'AUTOTEST product-plan to work-order',
  }, [{
    Product_Id: productId,
    ProductCode: fixture.productCode,
    ProductName: productName,
    ProductStandard: 'AUTOTEST',
    Qty: quantity,
    FinishQty: 0,
  }]));
  assert(responseStatus(planAdded) === true, `生产计划新增失败：${planAdded?.message || planAdded?.Message}`);
  const planWorkOrder = sqlLines(`SELECT WorkOrder_Id,FromType,PlanQty FROM Production_WorkOrder WHERE AssociatedForm = ${sqlText(fixture.productPlanCode)}`)[0];
  assert(planWorkOrder, '生产计划新增后未生成生产工单。');
  const [planWorkOrderId, planFromType, planQty] = planWorkOrder.split('|');
  assert(planFromType === 'ProductPlan' && Number(planQty) === quantity, `生产计划工单来源或数量错误：${planWorkOrder}`);
  const planTaskCount = Number(sqlScalar(`SELECT COUNT(1) FROM Production_WorkOrderList WHERE WorkOrder_Id = ${Number(planWorkOrderId)}`));
  assert(planTaskCount === 2, `生产计划工单应拆分两条任务，实际 ${planTaskCount} 条。`);
  step('生产计划 -> 工单 -> 任务拆分', { productPlanCode: fixture.productPlanCode, workOrderId: Number(planWorkOrderId), planTaskCount });
}

let runError;
try {
  await executeFlow();
  report.status = 'passed';
} catch (error) {
  runError = error;
  report.status = 'failed';
  report.error = redact(error.stack || error.message);
} finally {
  try {
    cleanup();
    report.cleanup = 'passed';
  } catch (cleanupError) {
    report.cleanup = `failed: ${redact(cleanupError.message)}`;
    if (!runError) runError = cleanupError;
  }
  report.finishedAt = new Date().toISOString();
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });
  const resultPath = join(resultsDir, `sales-to-inventory-flow-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}.json`);
  writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: report.status, cleanup: report.cleanup, resultPath }, null, 2)}\n`);
}

if (runError) throw runError;
