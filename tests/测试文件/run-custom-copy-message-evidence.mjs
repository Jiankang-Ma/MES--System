#!/usr/bin/env node
import { createHash, createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const baselineRoot = process.env.MES_BASELINE_ROOT || resolve(scriptDir, '..', '..');
const runtimeRoot = process.env.MES_RUNTIME_ROOT || baselineRoot;
const apiBaseUrl = process.env.MES_API_URL || 'http://localhost:9991';
const composeFile = join(runtimeRoot, 'docker-compose.yml');
const runtimeServiceFile = join(runtimeRoot, '源码', 'iMES.Net', 'iMES.Custom', 'Services', 'Custom', 'Partial', 'Base_ProcessService.cs');
const baselineServiceFile = join(baselineRoot, '源码', 'iMES.Net', 'iMES.Custom', 'Services', 'Custom', 'Partial', 'Base_ProcessService.cs');
const appSettings = join(runtimeRoot, '源码', 'iMES.Net', 'iMES.WebApi', 'appsettings.json');
const marker = `UT_CUSTOM_EVIDENCE_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${process.pid}`;
const first = { code: `${marker}_A`, name: `${marker}_NAME_A` };
const second = { code: `${marker}_B`, name: `${marker}_NAME_B` };
const report = {
  executedAt: new Date().toISOString(),
  baselineCommit: 'db33de66a4eab928ae9cf5635ad66f54a9cf6566',
  marker,
  endpoint: '/api/Base_Process/Update',
  responses: {},
  cleanup: null,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }));
}

const localEnv = parseDotEnv(join(runtimeRoot, '.env'));
const sqlPassword = process.env.MSSQL_SA_PASSWORD || localEnv.MSSQL_SA_PASSWORD;

function run(command, args) {
  return execFileSync(command, args, { cwd: runtimeRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function sql(query) {
  assert(sqlPassword, '未找到 MSSQL_SA_PASSWORD。');
  return run('docker', [
    'compose', '-f', composeFile, '--profile', 'x64-sqlserver',
    'exec', '-T', 'sqlserver-x64', '/opt/mssql-tools18/bin/sqlcmd',
    '-S', 'localhost', '-U', 'sa', '-P', sqlPassword, '-d', 'iMES',
    '-C', '-h', '-1', '-W', '-s', '|', '-Q', query,
  ]);
}

function sqlLines(query) {
  return sql(query).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .filter((line) => !/^\(\d+ rows? affected\)$/i.test(line));
}

function sqlScalar(query) {
  const line = sqlLines(query)[0];
  assert(line !== undefined, `SQL 未返回结果: ${query}`);
  return line.split('|')[0].trim();
}

function sqlText(value) {
  return `N'${String(value).replaceAll("'", "''")}'`;
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function createAdminToken() {
  const userId = Number(sqlScalar("SELECT TOP (1) User_Id FROM Sys_User WHERE UserName='admin' ORDER BY User_Id"));
  assert(userId > 0, '未找到 admin 用户。');
  const settings = readFileSync(appSettings, 'utf8');
  const secret = settings.match(/"JWT"\s*:\s*"([^"]+)"/)?.[1];
  assert(secret, '无法读取 JWT 配置。');
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    jti: String(userId), iat: now, nbf: now, exp: now + 3600,
    iss: 'iMES.core.owner', aud: 'iMES.core',
  }));
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

async function apiPost(path, token, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { httpStatus: response.status, body: json };
}

function responseStatus(response) {
  return response?.body?.status ?? response?.body?.Status;
}

function responseMessage(response) {
  return response?.body?.message ?? response?.body?.Message;
}

function extensionValues() {
  return Object.fromEntries(sqlLines("SELECT FieldCode FROM Sys_Table_Extend WHERE TableName='Base_Process' ORDER BY TableEx_Id")
    .map((line) => [line.split('|')[0], `${marker}_EXT`]));
}

function save(mainData, extra) {
  return { mainData, detailData: [], delKeys: [], extra: JSON.stringify(extra) };
}

function cleanup() {
  sql(`
DELETE FROM Base_Process_ExtendData WHERE Process_Id IN
  (SELECT Process_Id FROM Base_Process WHERE ProcessCode IN (${sqlText(first.code)},${sqlText(second.code)}));
DELETE FROM Base_Process WHERE ProcessCode IN (${sqlText(first.code)},${sqlText(second.code)});`);
  const remaining = Number(sqlScalar(`SELECT COUNT(1) FROM Base_Process WHERE ProcessCode IN (${sqlText(first.code)},${sqlText(second.code)})`));
  assert(remaining === 0, '测试数据未清理完整。');
  report.cleanup = { success: true, remaining };
}

async function main() {
  const runtimeHash = sha256(runtimeServiceFile);
  const baselineHash = sha256(baselineServiceFile);
  report.sourceEvidence = { runtimeHash, baselineHash, identical: runtimeHash === baselineHash };
  assert(runtimeHash === baselineHash, '运行中的 Base_ProcessService 与测试基线不一致。');

  cleanup();
  const token = createAdminToken();
  const extra = extensionValues();
  const common = { SubmitWorkLimit: '0', SubmitWorkMatch: 1, DefectItem: '0' };

  for (const item of [first, second]) {
    const created = await apiPost('/api/Base_Process/Add', token, save({
      ProcessCode: item.code,
      ProcessName: item.name,
      ...common,
    }, extra));
    assert(created.httpStatus === 200 && responseStatus(created) === true,
      `创建测试工序失败: ${JSON.stringify(created.body)}`);
  }

  const secondId = Number(sqlScalar(`SELECT Process_Id FROM Base_Process WHERE ProcessCode=${sqlText(second.code)}`));
  assert(secondId > 0, '未找到第二条测试工序。');

  const duplicateName = await apiPost('/api/Base_Process/Update', token, save({
    Process_Id: secondId,
    ProcessCode: second.code,
    ProcessName: first.name,
    ...common,
  }, extra));
  report.responses.duplicateName = duplicateName;
  assert(duplicateName.httpStatus === 200 && responseStatus(duplicateName) === false,
    `重复名称未被拒绝: ${JSON.stringify(duplicateName.body)}`);
  assert(responseMessage(duplicateName) === '工序名称已存在',
    `重复名称实际返回: ${responseMessage(duplicateName)}`);

  const duplicateCode = await apiPost('/api/Base_Process/Update', token, save({
    Process_Id: secondId,
    ProcessCode: first.code,
    ProcessName: second.name,
    ...common,
  }, extra));
  report.responses.duplicateCode = duplicateCode;
  assert(duplicateCode.httpStatus === 200 && responseStatus(duplicateCode) === false,
    `重复编号未被拒绝: ${JSON.stringify(duplicateCode.body)}`);
  assert(responseMessage(duplicateCode) === '工序编号已存在',
    `重复编号实际返回: ${responseMessage(duplicateCode)}`);
}

let failure;
try {
  await main();
} catch (error) {
  failure = error;
  report.error = error.message;
} finally {
  try { cleanup(); } catch (cleanupError) {
    report.cleanup = { success: false, error: cleanupError.message };
    failure ||= cleanupError;
  }
  const resultsDir = join(baselineRoot, 'tests', 'results');
  mkdirSync(resultsDir, { recursive: true });
  const outputPath = join(resultsDir, 'custom-process-copy-message-regression.json');
  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nEvidence written to: ${outputPath}`);
}

if (failure) {
  console.error(`\nFAILED: ${failure.message}`);
  process.exitCode = 1;
} else {
  console.log('\nPASS: 已验证两条修复后的真实 API 返回，且测试数据已清理。');
}
