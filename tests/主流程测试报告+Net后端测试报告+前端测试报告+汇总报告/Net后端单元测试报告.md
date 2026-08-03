# 单元测试报告

## iMES.Core 单元测试：成员 1 （沈远卓）

## 本次范围

测试基建与 Core 公共规则首批测试。测试工程不连接 SQL Server、Redis 或 HTTP API；数据库事务、接口授权和完整业务链路仍由既有 `.mjs` 集成回归覆盖。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-20 |
| 测试工程 | `源码/iMES.Net/iMES.Core.Tests` |
| 执行方式 | `docker build -t imes-core-tests:local -f 源码/iMES.Net/iMES.Core.Tests/Dockerfile 源码/iMES.Net` |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + Coverlet collector |
| 结果 | **15 通过，0 失败** |
| 运行时 | Docker `.NET Core 3.1 SDK`；不依赖宿主机 `dotnet` |

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| `EntityProperties` | 通知新增输入移除主键/未知字段；更新保留主键；必填标题/内容校验；标题 500 字符边界 | 通过 |
| `WebResponseContent` | 成功、失败、响应码和消息契约 | 通过 |
| `StringExtension` | 整数解析、非法值和空值失败关闭 | 通过 |
| `UserContext` | 仅角色 ID 为 1 时识别为超级管理员 | 通过 |
| 权限与日志枚举 | `Export` 按钮权限值和导出日志类型契约 | 通过 |
| `SaveModel` / `ServiceBase` | 空明细数组不视为明细操作；存在明细或删除键时才进入主从处理 | 通过 |

## 本次发现并修复的问题

| 编号 | 复现场景 | 修复 | 复测 |
| --- | --- | --- | --- |
| UT-CORE-01 | 单表更新提交 `detailData: []`、`delKeys: []` 时，`ServiceBase.Update` 错误进入主从表校验，可能因不存在明细实体触发空引用 | 新增 `SaveModelExtensions.HasDetailChanges`；仅当存在实际明细或删除键时进入明细分支 | 对空数组、空明细字典、实际明细和删除键的单元测试均通过 |

## 交接结论

测试基建、Docker 执行方式、首批样例和 Core 空明细修复已可复用。系统权限、生产、仓储、基础数据成员按《单元测试基建说明》的任务分配创建各自测试工程和结果文档。

## iMES.System 单元测试：成员 2 （丁伯源）

### 本次范围

用户、角色、菜单、字典和审计相关公共规则首批测试。单元测试不连接 SQL Server、Redis 或 HTTP API；`tests/测试文件/run-authorization-regression.mjs` 继续作为 AUTH-01 真实接口回归参考，不计入本单元测试通过数。本阶段未修改业务规则。

### 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-21 |
| 基线 commit SHA | `dc05ce8c81bfdba0984b26bd22c55cef7d52d5d2` |
| 测试工程 | `源码/iMES.Net/iMES.System.Tests` |
| 执行方式 | `docker build -t imes-system-tests:local -f 源码/iMES.Net/iMES.System.Tests/Dockerfile 源码/iMES.Net` |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + Coverlet collector |
| 结果 | **16 通过，0 失败** |
| 运行时 | Docker `.NET Core 3.1 SDK`；不依赖宿主机 `dotnet` |

### 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| `Sys_User` / `UserContext` | 新增输入移除主键和未知字段、用户名必填、真实姓名长度边界、角色 ID 为 1 的超级管理员判定 | 通过 |
| `Sys_Role` / `Sys_Menu` | 角色授权载体、`Add/Delete/Update/Search/Export` 按钮权限值、`ApiActionPermissionAttribute` 的菜单和角色授权要求装配 | 通过 |
| `Sys_Dictionary` / `Sys_DictionaryList` | 字典新增输入、编号必填、明细值长度边界和主从表声明契约 | 通过 |
| `Sys_Log` / `ResponseType` | `Add/Edit/Del/Export` 审计日志类型，以及越权和角色越权的独立失败码 | 通过 |
| 权限最小化 | 仅有 `Search` 权限时不隐含 `Add/Delete` | 通过 |

### 本次发现的问题

本轮系统与权限单元测试 **16 通过，0 失败**，未发现需要修复的问题。

### 交接结论

`iMES.System.Tests` 和对应 Dockerfile 已合入解决方案，测试工程已写入 `源码/iMES.Net/iMES.sln`。本轮只提交测试工程与测试源文件；成员的独立结果文档未单独保留，其结论已汇总至本节。

## iMES.Production 单元测试：成员 3（池一锴）

### 本次范围

生产计划、销售订单转工单、生产计划转工单、工艺路线拆分任务、工单状态流转、报工时间与数量规则、分批报工和生产报表聚合等规则测试。测试工程使用 EF InMemory、反射和 Mock，不连接 SQL Server、Redis 或 HTTP API。

### 复测执行信息

| 项目 | 结果 |
| --- | --- |
| 复测日期 | 2026-07-22 |
| 复测基线 commit SHA | `b608912610133fcb71e9675475ec3dd57b3650df` |
| 复测分支 | `modify-retest/Production-regression` |
| 测试工程 | `源码/iMES.Net/iMES.Production.Tests` |
| 复测命令 | `dotnet test 源码/iMES.Net/iMES.Production.Tests/iMES.Production.Tests.csproj --no-restore` |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + EF Core InMemory + Moq |
| 复测结果 | **31 通过，0 失败** |
| 运行时 | Windows + .NET SDK 6.0.410；测试项目目标框架为 `net6.0` |

### 复测覆盖测试点

| 模块 | 测试点 | 复测结果 |
| --- | --- | --- |
| `Production_ProductPlanRepository` | 生产计划新增后写入并读取 InMemory 数据库 | 通过 |
| `Production_ReportWorkOrderService` | 移动端 Unix 毫秒报工时间标准化、支持范围边界、确认生效报工数量校验、未确认状态分支 | 通过 |
| 工单编号 | 已配置规则时沿用前缀并按最新流水号递增 | 通过 |
| WF-08 / WF-09 | 单产品、多产品销售订单生成并关联对应工单，编号规则正确 | 通过 |
| WF-10 / WF-12 | 生产计划生成工单；按工艺路线拆分任务，顺序和计划数正确 | 通过 |
| WF-13 | 草稿→已下达→执行中→已完成状态流转；完成后和逆向流转拒绝 | 通过 |
| WF-15 / WF-16 | 正常报工进度、良品率、多工序汇总、分批累计和超计划限制 | 通过 |
| WF-34 | 良品/不良/实际数量一致性，多工单汇总，零产量及全不良边界 | 通过 |

### 本次修复

| 编号 | 问题 | 修改内容 | 复测 |
| --- | --- | --- | --- |
| UT-PROD-FIX-01 | `Production_ProductPlanRepositoryTests` 的 `TestDbContext : BaseDbContext` 无法传入构造参数为 `SysDbContext` 的仓储，导致测试无法编译 | 测试夹具改为 `TestSysDbContext : SysDbContext`；传入已配置的 `DbContextOptions<BaseDbContext>`，并在已配置 InMemory options 时跳过父类 `OnConfiguring` | 通过 |

| 改动文件 | 改动内容 |
| --- | --- |
| `源码/iMES.Net/iMES.Production.Tests/Production_ProductPlanRepositoryTests.cs` | 调整测试上下文及字段类型以匹配仓储的 `SysDbContext` 依赖；未修改生产代码。 |

### 复测结论

`Production_ProductPlanRepository.cs` 保持原有 `SysDbContext` 依赖不变。本次仅修复测试夹具，31 条生产领域单元测试全部通过，无需修改生产业务代码。

### 补充：装配工单统计查询口径修复（AWO-FIX-01）

本项为连接真实 API 和 SQL Server 的接口复测，不计入上表 31 条隔离单元测试。

| 项目 | 结果 |
| --- | --- |
| 复测日期 | 2026-07-29 |
| 涉及接口 | `POST /api/Production_AssembleWorkOrder/GetPageData` |
| 初测证据 | `Production_AssembleWorkOrder` 主表的 `WorkOrderQty`、`FinishedQty` 均为 `NULL`；`GetAssembleProcess` 视图对同一装配工单实时统计为 `2/0`、`4/1` 等值 |
| 根因 | 原服务先由通用 `GetPageData` 按主表字段筛选/分页，完成后才读取视图并仅覆盖响应对象；因此页面显示视图统计值，数字搜索却筛选主表 `NULL` 字段 |
| 后端修复 | `GetPageData` 的查询源改为主表 `LEFT JOIN GetAssembleProcess`；在通用 `WHERE`、排序、分页前即提供实时 `WorkOrderQty`、`FinishedQty`、`FormProcess`，移除查询后 Dapper 覆盖 |
| 前端修复 | 搜索结果为空时清空下方产品明细；明细组件对空行防御，避免读取 `undefined.AssembleWorkOrder_Id` |
| 编译与单测 | `docker compose build api` 通过；Vue 全量 `npm run test:unit`：**318 通过，0 失败** |

| 复测条件 | 实际返回 | 结果 |
| --- | --- | --- |
| 单据编号 `ZPGD202208231600100002` | 1 条；实时工单数 `2`、已结束工单 `0` | 通过 |
| 工单数 `2` | 2 条：`ZPGD202208231600100002`、`ZPGD202208142200180001` | 通过 |
| 已结束工单 `1` | 2 条：`ZPGD202208231535220001`、`ZPGD202208142200180001` | 通过 |
| 工单数 `999` | 0 条；下方明细清空，不再产生浏览器异常 | 通过 |

### 补充：装配工单打印实时数据修复（AWO-PRINT-01）

本项为连接真实 API 和 SQL Server 的接口复测，不计入既有 WebApi 单元测试条数；既有 WebApi 全量单元测试作为修复后的回归执行。

| 项目 | 结果 |
| --- | --- |
| 复测日期 | 2026-07-29 |
| 涉及接口 | `GET /api/Base_PrintTemplate/getDetailData?id=6&cat=Production_AssembleWorkOrder` |
| 初测证据 | 装配明细表原始 `FinishQty`、`BadQty`、`Status`、`ProductionSchedule` 是创建时快照。例如明细中的状态/完成数为 `1/0`，实际工单已为状态 `3`、良品 `12`；另一条实际状态为 `2`。旧打印接口直接序列化明细表，因而会输出旧值。 |
| 根因 | `Base_PrintTemplateController.getDetailData` 的装配工单分支只查询并序列化 `Production_AssembleWorkOrderList`，未合并 `Production_WorkOrder` 的实际执行状态，亦未计算实时工序进度。 |
| 后端修复 | 打印接口在返回前仅在内存响应对象上补充实际工单的 `GoodQty`、`NoGoodQty`、`Status`，并通过 `Func_GetProcessLineAndProgressByID` 生成 `ProductionSchedule`；不写回历史明细，打印没有数据库副作用。 |
| 历史数据边界 | 发现的一条 `Qty` 与工单 `PlanQty` 不一致记录，经基线操作日志确认是 2022 年直接修改工单产生的历史数据；按本轮范围不修复、不新增数据迁移，也不改变该记录。 |
| 编译与单测 | `docker compose build api` 通过；`iMES.WebApi.Tests`：**298 通过，0 失败**。 |

| 复测条件 | 实际返回 | 结果 |
| --- | --- | --- |
| 装配工单 `6` 的明细 `ZPGD202208142200180001-1` | `Status=3`、`FinishQty=12`、`BadQty=0`；两道实时工序进度均为 `100.00%` | 通过 |
| 装配工单 `6` 的明细 `ZPGD202208142200180001-2` | `Status=2`、`FinishQty=0`、`BadQty=0`；实时工序进度为 `50.00%/0.00%` | 通过 |
| 通用 MES 回归 | `tests/测试文件/run-mes-regression.mjs`：实体/结构、通知 CRUD、字典主从 CRUD、50 并发 × 4 读压测均通过；**4/4 通过，200/200 成功**，结果 `tests/results/mes-regression-2026-07-29T13-16-08-097Z.json` | 通过 |

## iMES.Warehouse 单元测试：成员 4（楼博涵）

### 本次范围

仓储领域入库单（`Ware_WareHouseBill`）和出库单（`Ware_OutWareHouseBill`）的实体输入校验、编号与数量规则、库存不足分支、编号生成器抽取，以及实体模型和数据库字段类型一致性修复。单元测试不连接 SQL Server、Redis 或 API。

### 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-22 |
| 基线 commit SHA | `db33de66a4eab928ae9cf5635ad66f54a9cf6566` |
| 测试工程 | `源码/iMES.Net/iMES.Warehouse.Tests` |
| 执行方式 | `docker build -t imes-warehouse-tests:local -f 源码/iMES.Net/iMES.Warehouse.Tests/Dockerfile 源码/iMES.Net` |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + Moq 4.14.5 + Coverlet collector |
| 结果 | **60 通过，0 失败** |
| 运行时 | Docker `.NET Core 3.1 SDK`；不连接 SQL Server、Redis 或 API |

### 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| `Ware_WareHouseBill` / 明细 | 新增和更新移除主键/未知字段；单据类型、产品名称、产品编码、产品规格、备注的必填与长度边界 | 通过 |
| 入库业务规则 | 默认单号非空且为 18 位时间戳；空/Null 明细拒绝；有效明细通过；零和负入库数量拒绝 | 通过 |
| `Ware_OutWareHouseBill` / 明细 | 新增和更新输入契约；单据类型、产品名称、产品编码、产品规格、备注的必填与长度边界 | 通过 |
| 出库业务规则 | 默认单号；空/Null 明细、零/负数量拒绝；库存充足/恰好足够通过，库存不足/产品不存在/多产品单项不足拒绝 | 通过 |
| 编号与模型契约 | 重复编号模拟检测；`InStoreQty`/`OutStoreQty`/`InventoryQty` 的 C# `decimal` 类型与数据库 `decimal(18,4)` 一致 | 通过 |
| `WarehouseCodeGenerator` | 无规则回退时间戳、无历史从1开始、历史递增、进位（0009→0010）、不同位数（4位/6位）、出入库业务编码映射 | 通过 |

### 本次发现并修复的问题

共修复 **6 项缺陷**，所有修复已通过单元测试或网页端验证。

| 编号 | 复现场景 | 修复 | 复测 |
| --- | --- | --- | --- |
| WH-BUG-01 | `Ware_WareHouseBillService.Add()` 缺少明细校验，允许创建空明细的入库单 | `AddOnExecuting` 增加空/Null 明细校验 | 通过 |
| WH-BUG-02 | `Ware_WareHouseBillService.Add()` 缺少数量校验，允许入库数量为零或负数 | 遍历明细校验 `InStoreQty <= 0` | 通过 |
| WH-BUG-03 | 入库后库存更新逻辑被注释掉（`AddOnExecuted`），入库单创建后产品库存不会增加 | 恢复循环更新 `product.InventoryQty += InStoreQty` | 通过 |
| WH-BUG-04 | `GetWareHouseBillCode()` 和 `GetOutWareHouseBillCode()` 代码重复，仅查询条件不同 | 抽取 `WarehouseCodeGenerator.GenerateBillCode()` 公共方法，测试覆盖所有路径 | 通过 |
| WH-BUG-05 | 建表 SQL 中 `Ware_WareHouseBillList.InStoreQty`/`Ware_OutWareHouseBillList.OutStoreQty` 定义为 `[int]`，C# 实体模型为 `decimal`。打开出入库单明细页面时触发类型转换异常 | `ALTER TABLE Ware_WareHouseBillList ALTER COLUMN InStoreQty decimal(18,4)`；`ALTER TABLE Ware_OutWareHouseBillList ALTER COLUMN OutStoreQty decimal(18,4)` | 通过 |
| WH-BUG-06 | `Base_Product.InventoryQty`、`Ware_WareHouseBillList.InventoryQty`、`Ware_OutWareHouseBillList.InventoryQty` 定义为 `[int]`，C# 实体模型为 `decimal`。出入库单页面加载产品信息时触发类型转换异常 | `ALTER TABLE Base_Product ALTER COLUMN InventoryQty decimal(18,4)`；`ALTER TABLE Ware_WareHouseBillList ALTER COLUMN InventoryQty decimal(18,4)`；`ALTER TABLE Ware_OutWareHouseBillList ALTER COLUMN InventoryQty decimal(18,4)` | 通过 |

### 交接结论

`iMES.Warehouse.Tests` 与 Dockerfile 已合入。6 项缺陷（WH-BUG-01~06）已在源代码和数据库中修复，60 个测试全部通过。数据库字段迁移脚本已在线执行，出入库单明细页面可正常打开。
## iMES.Custom单元测试：成员 5（陈俊烨）

### 本次范围

产品、工序、工艺路线、不良品项和扩展字段首批测试。单元测试不连接 SQL Server、Redis 或 HTTP API；另用可清理夹具调用真实接口，保留已确认问题的返回证据。本阶段未修改任何业务代码。

### 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-21 |
| 基线 commit SHA | `dc05ce8c81bfdba0984b26bd22c55cef7d52d5d2` |
| 测试分支 | `test/custom-regression` |
| 测试工程 | `源码/iMES.Net/iMES.Custom.Tests` |
| 执行方式 | `docker build --progress=plain -t imes-custom-tests:local -f "源码/iMES.Net/iMES.Custom.Tests/Dockerfile" "源码/iMES.Net"` |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + Coverlet collector |
| 结果 | **30 个用例：28 通过，2 失败** |
| 运行时 | Docker `.NET Core 3.1 SDK`；不依赖宿主机 `dotnet` |

### 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 实体契约 | 产品和工序必填字段；产品、不良品项名称 200/201 字符边界；工艺路线名称必填 | 8/8 通过 |
| 编号生成 | 产品首号、递增、无规则备用编号；工序、不良品项、工艺路线使用各自规则 | 6/6 通过 |
| 重复校验 | 产品名称/编号重复；不良品项名称/编号重复；唯一值成功路径 | 6/6 通过 |
| 工艺路线明细 | 未选工序、未选子路线、自我引用和有效明细 | 4/4 通过 |
| 扩展字段 | 产品、工序、不良品项扩展值映射；无扩字段边界 | 4/4 通过 |

### 本次发现的问题

| 编号 | 复现场景 | 当前处理 | 复测 |
| --- | --- | --- | --- |
| UT-CUSTOM-01 | 更新工序时提交已被其他工序使用的名称；预期“工序名称已存在”，实际“不良品项名称已存在” | 组长已确认为复制文案错误；阶段一仅记录，未修改业务代码 | 单元测试与真实接口均稳定复现 |
| UT-CUSTOM-02 | 更新工序时提交已被其他工序使用的编号；预期“工序编号已存在”，实际“不良品项编号已存在” | 组长已确认为复制文案错误；阶段一仅记录，未修改业务代码 | 单元测试与真实接口均稳定复现 |

接口证据保存在 `tests/results/custom-process-copy-message-evidence.json`，可通过 `tests/测试文件/run-custom-copy-message-evidence.mjs` 复现。两次请求均返回 HTTP `200`、`status: false`，且运行业务文件与基线文件 SHA-256 一致。取证脚本已删除临时工序及扩展数据，剩余夹具数量为 `0`。

### 交接结论

`iMES.Custom.Tests` 可通过 Docker 重复执行。30 个用例中 28 个通过，2 个已确认文案缺陷以真实失败保留，没有跳过或将错误行为改写为“测试通过”。本阶段未修改业务代码，真实接口返回与单元测试结果一致，取证数据已清理。

### 第二阶段最小修复（2026-07-22）

| 项目 | 内容 |
| --- | --- |
| 最新复测基线 | `dev`，commit `db33de66a4eab928ae9cf5635ad66f54a9cf6566`（已包含本次最小修复） |
| 修复分支 | `modify-retest/custom-regression` |
| 业务改动文件 | `源码/iMES.Net/iMES.Custom/Services/Custom/Partial/Base_ProcessService.cs` |
| UT-CUSTOM-01 修复 | `Base_ProcessService.Update` 的重复名称提示由“`不良品项名称已存在`”改为“`工序名称已存在`” |
| UT-CUSTOM-02 修复 | `Base_ProcessService.Update` 的重复编号提示由“`不良品项编号已存在`”改为“`工序编号已存在`” |
| 改动边界 | 仅替换两条返回文案；名称/编号重复判断、排除当前记录 ID 的条件、数据库访问和其他业务逻辑均未改变 |

回归脚本 `tests/测试文件/run-custom-copy-message-evidence.mjs` 同步将预期文案改为修复后的工序提示，并将修复后证据写入新的结果文件，保留第一阶段修复前证据不被覆盖。

### 第二阶段复测与回归

| 项目 | 执行方式与结果 |
| --- | --- |
| 成员 5 单元测试 | `docker build --progress=plain -t imes-custom-tests:local -f "源码/iMES.Net/iMES.Custom.Tests/Dockerfile" "源码/iMES.Net"`；**30 通过，0 失败** |
| 针对性真实 API 回归 | `tests/测试文件/run-custom-copy-message-evidence.mjs`；重复名称返回“`工序名称已存在`”，重复编号返回“`工序编号已存在`”，两次均为 HTTP `200`、`status: false` |
| 运行代码一致性 | 运行业务文件与修复分支文件 SHA-256 均为 `252774612927bdbc97dc05b889b60d459644820d4dcfae1e6d2d01a3acb7470a`，`identical: true` |
| 针对性测试数据清理 | `success: true`，剩余临时工序数量 `0`；结果见 `tests/results/custom-process-copy-message-regression.json` |
| 通用 MES 回归 | `tests/测试文件/run-mes-regression.mjs`；数据库升级后 **4 通过，0 失败**。全量实体/数据库结构、通知 CRUD、字典主从 CRUD、分页读取压测均通过，200/200 次读取成功；结果见 `tests/results/mes-regression-2026-07-22T07-05-39-425Z.json` |
| 数据库升级与复测 | 按最新 `dev` 提供的 `数据库/DB/iMES-SQLServer2016/iMES20221014/docker-import/20260720-wf07-bom.sql` 升级本地测试数据库，补齐 `Base_MaterialDetail`、`View_Base_MaterialDetail` 的 `Process_Id` 后重新执行通用回归，原结构校验失败已通过 |

### 第二阶段结论

UT-CUSTOM-01、UT-CUSTOM-02 已按最小范围修复。原有两条失败单元测试转为通过，成员 5 全部 30 条单元测试通过，真实 API 返回与预期一致且测试数据已清理。按照最新 `dev` 提供的数据库升级脚本更新本地测试库后，通用 MES 回归 4/4 全部通过，读压测 200/200 次成功。本次业务代码仍仅修改两条提示文案，没有扩大修改范围。

### 第三阶段：历史 BOM 的空消耗工序加载修复（2026-07-30）

| 项目 | 内容 |
| --- | --- |
| 现象 | `POST /api/View_Base_MaterialDetail/getPageData` 返回 HTTP 500，前端显示“服务器没有正确处理请求”。 |
| 根因 | BOM 升级脚本为兼容历史数据，将 `Base_MaterialDetail.Process_Id` 新增为 `int NULL`；本地 7 条历史 BOM 均为 `NULL`。视图模型属性本身是 `int?`，但同时标记了 `[Required]`，EF 将其按必填整数物化，读到 `NULL` 时抛出 `SqlNullValueException` / `SqlBuffer.get_Int32()`。 |
| 最小修复 | 仅移除 `View_Base_MaterialDetail.Process_Id` 上与 `int?` 矛盾的 `[Required]`。不回填或伪造历史 BOM 的工序，不修改 BOM 用量、库存或自动扣料逻辑。新增、编辑仍由 `ValidateBom()` 强制要求有效工序，空值或 `<=0` 仍返回“请选择消耗工序”。 |
| 数据库证据 | 当前视图共 7 条记录，`MaterialDetail_Id`、父项、子项、用量均非空；`Process_Id` 为 `NULL` 的记录为 7 条。数据库视图也明确将该列描述为可空。 |
| 自动复测 | 新增 `MaterialDetailView_HistoricalMissingProcess_IsAllowedToLoad` 与 `MaterialDetailView_ProcessId_IsNullableInEfModel`，分别覆盖数据注解与 EF 模型可空映射。`iMES.Custom.Tests` Docker 复测 **32 通过，0 失败**。 |
| 运行验证 | API Docker 镜像重新发布并强制重建容器，容器镜像 ID 与最新本地镜像一致。匿名只读请求按预期返回 401（接口受 JWT 保护，未进入业务查询），不再将认证拦截误判为页面错误。登录网页后刷新“物料清单”即可完成界面验收；历史记录会显示空消耗工序，选择正确工序后才能保存。 |

## iMES.WebApi 单元测试：成员 1（沈远卓）

## 本次范围

为 WebApi 补齐与 `Core`、`System`、`Custom` 对齐的单元测试工程。覆盖 WebApi 中全部 63 个控制器的路由、HTTP 动词、服务注入与鉴权契约；覆盖泛型 `ApiBaseController<T>` 的分页、详情、上传、模板下载、导入、导出、删除、审核、新增、更新及旧下载入口；并覆盖 `Startup`/`Program` 主机装配、API 首页、示例校验接口和质量检验参数校验。

单元测试不连接 SQL Server、Redis 或真实 HTTP 服务；涉及鉴权、质量接口和通用业务链路的实际接口验证单列为复测/回归执行。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-22 |
| 基线 commit SHA | `dc05ce8c81bfdba0984b26bd22c55cef7d52d5d2` |
| 测试工程 | `源码/iMES.Net/iMES.WebApi.Tests`（已加入 `iMES.sln`） |
| 常规执行方式 | `docker build -t imes-webapi-tests:local -f 源码/iMES.Net/iMES.WebApi.Tests/Dockerfile 源码/iMES.Net` |
| 本机离线执行方式 | 先 `docker compose build api`，再以已发布的 API 程序集运行 `Dockerfile.published`；用于规避本机 Docker 对 NuGet 的 TLS 网络失败，不改变测试程序集或测试范围 |
| 测试框架 | xUnit + Microsoft.NET.Test.Sdk + Coverlet collector |
| 结果 | **298 通过，0 失败** |
| 运行时 | Docker `.NET Core 3.1 SDK`；单元测试不依赖宿主机 `dotnet` |

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 控制器契约 | 63 个控制器的 `api/` 路由（含历史别名）、泛型 CRUD 服务构造注入、全部显式路由动作的 HTTP 动词与路径 | 通过 |
| 鉴权契约 | 显式路由动作除 `AllowAnonymous` 外均需 JWT；质量检验接口需 JWT；`Sys_Log/test` 不可匿名且仅超级管理员可调用 | 通过 |
| `ApiBaseController<T>` | 分页、详情、上传、模板下载、导入、导出、删除、审核、新增、更新和已废弃文件下载入口的成功/失败响应转发 | 通过 |
| 应用主机 | `Startup` 的 CORS、缓存、HTTP Client、调度器、控制器和 JSON 配置；`Program` 主机构建；API 首页重定向 | 通过 |
| 参数校验与质量 | 6 个校验示例接口；质量检验空值、时间范围、检验类型、工序和产品参数的前置校验分支 | 通过 |

## 本次发现并修复的问题

| 编号 | 复现场景 | 修复 | 复测 |
| --- | --- | --- | --- |
| UT-WEBAPI-01 | `QualityController` 未声明 `JWTAuthorize`。全局 `ApiAuthorizeFilter` 只写响应过期头，不会替代 JWT 强制认证，质量检验接口可被匿名访问 | 在 `QualityController` 添加 `[JWTAuthorize, ApiController]` | 控制器鉴权单测通过；质量检验工作流回归通过 |
| UT-WEBAPI-02 | `GET /api/Sys_Log/test` 标记 `AllowAnonymous`，实际会批量写入 10 条 `Sys_Log` 记录 | 移除 `AllowAnonymous`，增加 `ApiActionPermission(ActionRolePermission.SuperAdmin)` | 端点权限单测通过；鉴权回归 12/12 通过 |
| UT-WEBAPI-03 | `tests/测试文件/run-authorization-regression.mjs` 迁入子目录后仍按旧层级取项目根目录，导致无法读取 `appsettings.json`，回归尚未进入断言即失败 | 根目录改为向上两层，结果目录统一为 `tests/results` | 语法检查通过；修复后鉴权回归 12/12 通过且夹具已清理 |

## 交接结论

`iMES.WebApi.Tests` 已可随解决方案和 Docker 重复执行；298 个 WebApi 单元测试全部通过。两项真实安全缺陷已修复并完成单测与回归复测。回归结果：质量检验工作流通过（`tests/results/wf-26-to-29a-quality-20260722023722.json`，清理通过）、鉴权回归 **12/12**（`tests/results/authorization-regression-20260722023930.json`，清理通过）、通用 MES 回归 **4/4**（`tests/results/mes-regression-2026-07-22T02-39-56-040Z.json`；读压测 200/200 成功）。
