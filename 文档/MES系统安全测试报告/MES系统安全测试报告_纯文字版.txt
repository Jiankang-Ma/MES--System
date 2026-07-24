# MES 系统安全测试报告（文字表单版）

报告日期：2026-07-20  
测试对象：MES--System / iMES  
测试范围：`源码/iMES.Net`、`源码/iMES.Vue3`、`docker-compose.yml`、`tests`、`文档`、DB 脚本、本地前后端运行环境  
交付形式：纯文本 Markdown 表单，无图片、无截图、无 DOCX 渲染依赖

## 0. 报告摘要

本次测试覆盖 MES 后端 ASP.NET Core、Vue 前端、Docker 部署配置、第三方依赖、既有自动化测试资料和本地可达端口。系统具备较完整的生产、工单、仓储、报表与基础数据功能，但当前版本在生产安全基线上存在需要优先处置的高风险问题。

综合评级：High。  
结论口径：本报告将每个问题标记为“确认、部分确认或潜在”。源码危险点、EOL 生命周期问题和 SCA 漏洞公告不直接等同于已成功利用漏洞；只有具备动态证据或明确业务可达路径的问题才按“确认”处理。  
上线建议：不建议在未完成整改前直接暴露到公网或生产网络。上线前应优先完成匿名打印模板接口收敛、上传与静态资源安全控制、动态 SQL 与存储型 XSS 复测、密钥轮换、依赖升级、.NET 运行时升级、SQL 最小权限、CORS 与 Swagger 生产策略治理。

| 风险域 | 结论 | 确认状态 | 优先级 |
|---|---|---|---|
| 账号与密钥 | `appsettings.json`、`docker-compose.yml`、登录页存在默认口令、数据库口令、JWT 密钥等敏感信息；本轮未对生产凭据做外部利用 | 确认：源码暴露；潜在：外部利用 | P0 |
| 访问控制 | 打印模板多个接口为 `AllowAnonymous`，动态验证确认匿名可读取业务字段元数据；匿名写模板与单据读取链仍需授权环境复测 | 部分确认 | P0 |
| 文件与静态资源 | 上传目录公开映射，`ServeUnknownFileTypes=true`，上传服务端校验不足；本轮匿名/普通用户上传 HTML 被权限拦截 | 潜在 | P1 |
| 依赖供应链 | `.NET Core 3.1` 已 EOL；NuGet 与 npm 存在漏洞公告。EOL、SCA 公告和实际可利用漏洞分开管理 | 确认：EOL/SCA；潜在：业务可利用 | P1/P2 |
| 前端安全 | token 存储在 `localStorage`，存在 `v-html` 与富文本 HTML 注入面；本轮未确认反射 XSS | 潜在 | P1 |
| 运行暴露面 | CORS 任意来源、Swagger 可访问、匿名固定日志接口均作为攻击链放大条件处理，不单独定为高危系统漏洞 | 部分确认 | P2 |
| 运行稳定性 | API 9991 探测曾出现间歇 `connection refused`；Quartz 连接 SQL Server 报 pre-login handshake 错误 | 确认 | P2 |
| 已整改待复测项 | 历史工单报工详情 SQL 注入点已改为 Dapper 参数绑定；因 Closed 仅用于整改完成且动态复测通过，本项标记为 Remediated | Remediated | P2 |

## 交付清单

| 序号 | 交付物 | 本报告位置 | 状态 |
|---:|---|---|---|
| 1 | 《MES 系统安全测试方案》 | 第 1 章 | 已编制 |
| 2 | 《测试授权书及交战规则》 | 第 2 章 | 模板待签署 |
| 3 | 《MES 系统资产清单》 | 第 3 章 | 已编制 |
| 4 | 《安全测试用例表》 | 第 4 章 | 已编制 |
| 5 | 《源代码安全审计结果》 | 第 5 章 | 已编制 |
| 6 | 《第三方组件与 SBOM 清单》 | 第 6 章 | 已编制 |
| 7 | 《漏洞扫描原始结果》 | 第 7 章 | 已归档摘要 |
| 8 | 《MES 系统安全测试与漏洞评估报告》 | 第 8 章 | 已编制 |
| 9 | 《漏洞整改跟踪表》 | 第 9 章 | 已编制 |
| 10 | 《测试证据与操作日志归档》 | 第 10 章 | 已编制索引 |

---

## 1.《MES 系统安全测试方案》

### 1.1 测试目标

- 验证 MES 系统认证、授权、会话、接口访问控制、文件上传、静态资源、日志与运维接口的安全边界。
- 识别源代码中的注入、匿名访问、敏感信息泄露、XSS、上传绕过、动态 SQL 与部署配置缺陷。
- 梳理第三方组件与运行时版本，形成可用于整改、复测和持续集成的 SBOM 与漏洞基线。
- 结合既有自动化测试资料，确认业务主流程安全测试覆盖度与尚未执行的测试缺口。

### 1.2 测试范围

| 范围项 | 内容 | 说明 |
|---|---|---|
| 后端源码 | `源码/iMES.Net` 下 9 个 C# 项目，约 828 个 `.cs` 文件 | 包含 WebApi、Core、System、Production、Warehouse、Report、Custom、Builder、Entity |
| 前端源码 | `源码/iMES.Vue3/src` 下约 225 个 Vue/JS 文件 | 包含登录、路由、状态管理、基础组件、生产/仓储/报表页面 |
| 部署配置 | `docker-compose.yml`、`appsettings.json`、运行容器 | 覆盖 API、SQL Server、Redis、Nginx/Node 构建链路 |
| 依赖清单 | `.csproj`、`package.json`、`package-lock.json`、`yarn.lock` | NuGet、npm 依赖漏洞和版本生命周期 |
| 测试资料 | `tests/*.md`、自动化脚本 | 用于确认已覆盖业务流与测试缺口 |
| 本地运行界面 | `127.0.0.1:9990` 前端、`127.0.0.1:9991` API/Swagger | 仅做低侵入 HTTP 探测 |

### 1.3 方法与工具

| 类别 | 方法/命令 | 产出 |
|---|---|---|
| 源码审计 | `rg`、`find`、`sed`、`nl` 读取关键控制器、服务、配置与前端组件 | 访问控制、注入、XSS、上传、敏感配置证据 |
| 依赖扫描 | `dotnet list ... package --vulnerable --include-transitive` | NuGet 漏洞列表、EOL 运行时风险 |
| 前端 SCA | `npm --registry=https://registry.npmjs.org audit --json` 和 `npm audit --omit=dev --json` | npm 总漏洞与生产依赖漏洞摘要 |
| 运行探测 | `curl`、`docker ps`、`docker logs`、`screen -ls`、`ps aux` | 端口、Swagger、容器、运行错误与前端可达性证据 |
| 证据复核 | `tests/*.md` 与历史报告 | 工作流测试结果、修复记录、未覆盖功能列表 |

### 1.4 风险分级

| 等级 | 判定标准 | 处置要求 |
|---|---|---|
| Critical | 已通过动态验证或明确可达路径证明可导致系统接管、批量数据泄露、默认密钥/口令直接利用或重大业务破坏 | 0-3 天内封堵或下线暴露面，完成密钥轮换和复测 |
| High | 可导致越权、任意写入、敏感数据访问、持久化 XSS、上传滥用或重要业务篡改 | 1-2 周内修复并补充自动化回归 |
| Medium | 需特定条件触发，可能造成信息泄露、可用性下降或安全基线缺失 | 纳入迭代计划并设置补偿控制 |
| Low | 安全加固建议、审计可观测性或规范性问题 | 跟随版本治理 |

### 1.5 确认状态与整改状态定义

| 状态 | 定义 | 使用边界 |
|---|---|---|
| 确认 | 已有动态请求、源码证据或配置证据证明问题真实存在 | 可作为整改项进入跟踪表 |
| 部分确认 | 已确认入口或危险配置存在，但未完成完整攻击链、数据篡改或跨角色利用闭环 | 不夸大为已成功利用漏洞，需安排专项复测 |
| 潜在 | 源码模式、依赖公告或配置基线提示风险，但当前环境未验证可达或可利用 | 作为治理和复测候选项 |
| Remediated | 已完成代码或配置修改，但尚未完成独立动态复测 | 不计为 Closed |
| Closed | 整改完成、部署到目标环境，并通过动态复测和证据归档 | 仅复测通过后使用 |

---

## 2.《测试授权书及交战规则》

本章为测试授权书与交战规则模板。正式测试前，应由系统所有方、测试方、运维负责人、数据负责人共同签署，并明确生产环境、测试环境、时间窗口、停止条件和联系人。

### 2.1 授权书表单

| 授权字段 | 建议填写内容 |
|---|---|
| 授权主体 | MES 系统所有方 / 项目负责人 / 安全负责人 |
| 测试方 | 安全测试执行团队及联系人 |
| 授权资产 | 本地源码、测试环境 `127.0.0.1:9990`、`127.0.0.1:9991`、测试数据库、测试 Redis、测试容器 |
| 授权期限 | 建议按测试窗口明确起止日期和每日测试时段 |
| 禁止事项 | 禁止破坏性攻击、真实业务中断、批量数据导出、密码喷洒、未授权第三方目标探测 |
| 数据要求 | 仅使用测试账号和测试数据；敏感日志和样本脱敏归档 |
| 停止条件 | 出现服务不可用、数据异常增长、误触生产资产、发现 Critical 风险可立即暂停测试 |
| 交付要求 | 提交报告、证据索引、整改跟踪表；Critical/High 风险整改完成并动态复测通过后才能标记为 Closed |

### 2.2 交战规则

- 所有写入式测试均使用 `AUTOTEST` 或明确标识的数据前缀，测试完成后由系统所有方确认清理策略。
- 认证绕过、越权、文件上传、SQL 注入等测试优先使用静态审计和低风险验证。
- 不对真实生产数据执行破坏性载荷，不进行批量导出，不扩大测试战果。
- 发现可直接利用的 Critical 漏洞时，先保留最小证据，再通知授权联系人。
- 测试账号权限矩阵应由甲方提供；未提供时，本报告仅能给出静态访问控制风险与有限动态验证结论。
- 生产网络测试需另行审批，不得将本地授权扩大解释为生产授权。

### 2.3 签署表

| 角色 | 姓名/部门 | 意见 | 签字/日期 |
|---|---|---|---|
| 系统所有方 |  |  |  |
| 研发负责人 |  |  |  |
| 运维负责人 |  |  |  |
| 安全测试负责人 |  |  |  |

---

## 3.《MES 系统资产清单》

### 3.1 应用与基础设施资产

| 资产 | 技术/路径 | 安全关注点 |
|---|---|---|
| 后端 API | ASP.NET Core 3.1；`源码/iMES.Net/iMES.WebApi`；本地 9991 | 鉴权、Swagger、CORS、上传、静态文件、JWT、数据库连接 |
| 前端应用 | Vue 3；`源码/iMES.Vue3`；本地 9990 | `localStorage` token、`v-html`、富文本、依赖漏洞、请求封装 |
| 数据库 | SQL Server；DB 脚本；运行容器 `sql_server_container` | `sa` 账号、默认口令、最小权限、动态 SQL、备份和审计 |
| 缓存 | Redis；`docker-compose.yml` 中 `redis:7-alpine` | 默认密码、网络暴露、持久化和访问控制 |
| 文件目录 | `Upload`、`Download`、`quartz`、`templates` | 公开访问、任意类型、恶意文件、路径与文件名控制 |
| 报表/打印 | `Custom/Base_PrintTemplateController`，前端打印设计器 | 匿名读写、模板篡改、业务单据泄露 |
| 自动化测试 | `tests/*.mjs`、`tests/*.md` | 回归覆盖、历史修复证据、缺口追踪 |

### 3.2 后端项目清单

| 项目 | 目标框架 | 主要职责 |
|---|---|---|
| `iMES.WebApi` | `netcoreapp3.1` | HTTP API、认证、Swagger、静态文件、中间件、控制器入口 |
| `iMES.Core` | `netcoreapp3.1` | 基础服务、数据访问、上传、缓存、工具类、权限过滤 |
| `iMES.System` | `netcoreapp3.1` | 用户、角色、菜单、字典、日志、系统配置 |
| `iMES.Production` | `netcoreapp3.1` | 生产工单、报工、装配工单、工艺流程、进度 |
| `iMES.Warehouse` | `netcoreapp3.1` | 入库、出库、库存、仓储单据 |
| `iMES.Report` | `netcoreapp3.1` | 报表服务 |
| `iMES.Custom` | `netcoreapp3.1` | 自定义业务与打印模板等扩展 |
| `iMES.Builder` | `netcoreapp3.1` | 代码生成/构建辅助 |
| `iMES.Entity` | `netcoreapp3.1` | 实体模型 |

### 3.3 已识别业务模块

| 业务域 | 代表模块 | 已知测试状态 |
|---|---|---|
| 登录与权限 | 验证码、用户登录、菜单、角色 | WF-01 通过；角色矩阵仍需补齐 |
| 基础数据 | 字典、工序、工艺路线、产品、缺陷项目 | WF-03、WF-04、WF-05、WF-06 通过 |
| 销售到生产 | 销售订单、生产工单、计划、任务 | WF-08、WF-09、WF-10、WF-12 通过 |
| 生产报工 | 报工、进度、装配工单 | WF-13、WF-15、WF-16 通过；BOM 消耗/自动产出未覆盖 |
| 仓储 | 入库、出库、库存余额 | WF-23、WF-24、WF-25 通过；超库存出库问题已修复 |
| 报表与扩展 | 报表、扩展字段 | WF-34、WF-36 通过 |
| 并发 | 销售订单空单号并发生成 | WF-37 通过，20 并发验证单号唯一 |

---

## 4.《安全测试用例表》

| 编号 | 类别 | 测试点 | 步骤摘要 | 预期结果 | 状态 |
|---|---|---|---|---|---|
| ST-001 | 认证 | 验证码错误/过期/复用 | 执行 WF-01 登录验证码分支 | 非法验证码不能登录，正常验证码可登录 | 通过 |
| ST-002 | 认证 | 未认证访问菜单/API | 直接访问需登录 API | 返回 401 或拒绝访问 | 历史通过；本轮 API 不稳定未复现 |
| ST-003 | 授权 | 角色菜单隔离 | 使用不同角色账号访问菜单和按钮 | 仅返回授权资源 | 待补充角色矩阵 |
| ST-004 | 注入 | 报工详情 SQL 注入点 | 审计 `getReportDetailInfo` SQL 拼接与动态扰动 | 使用参数绑定，payload 不扩大查询、不报 SQL 错 | Remediated，待完整复测通过后可标记 Closed |
| ST-005 | 注入 | 字典动态 SQL | 审计 `Sys_DictionaryService` DbSql 组合与过滤 | 禁止用户可控 SQL 进入执行层 | 潜在，需业务可达性复测 |
| ST-006 | CORS | 生产跨域策略 | 审计 `Startup` CORS 配置与恶意 Origin 预检 | 仅允许白名单域名 | 部分确认，攻击链放大条件 |
| ST-007 | 暴露面 | Swagger 生产可访问 | `curl` 访问 `/swagger/index.html` | 生产环境关闭或鉴权 | 部分确认，攻击链放大条件 |
| ST-008 | 上传 | 服务端文件类型校验 | 审计 `ServiceBase` 上传逻辑；匿名/普通用户上传 HTML 动态验证 | 限制扩展、MIME、大小并重命名 | 潜在，权限用户链待复测 |
| ST-009 | 静态文件 | Upload 公开与未知类型 | 审计 `StaticFileOptions` | 禁止未知类型公开访问 | 潜在，需结合成功上传复测 |
| ST-010 | 访问控制 | 打印模板匿名读写 | 审计 `Base_PrintTemplateController AllowAnonymous`；匿名读取字段元数据返回 200 | 写接口需鉴权授权 | 部分确认，P0 专项复测 |
| ST-011 | 访问控制 | `Sys_Log/test` 匿名写入 | 审计与动态 `GET /api/Sys_Log/test` 返回 200 | 测试接口禁用或仅内网鉴权 | 确认，作为组合链条件 |
| ST-012 | 密钥 | 硬编码数据库/JWT/Redis 密钥 | 审计 `appsettings` 和 compose | 使用 Secret Manager/环境变量/密钥系统 | 确认：源码/配置暴露 |
| ST-013 | 前端 | token `localStorage` | 审计 Vuex store | 降低 XSS 后 token 可窃取风险 | 潜在：XSS 放大面 |
| ST-014 | XSS | `v-html`/富文本渲染 | 审计 `UploadExcel`、`MesTable`、`WangEditor`；DefectItemName 反射探测 | 输出统一净化或可信模板约束 | 潜在，存储型数据流待复测 |
| ST-015 | 供应链 | NuGet/npm 漏洞 | 执行 `dotnet list` 和 `npm audit` | EOL/SCA 公告与可达性分析分开处置 | 确认 SCA，实际利用待分析 |
| ST-016 | 平台 | `.NET Core 3.1` 生命周期 | 检查 `.csproj TargetFramework` | 使用受支持 LTS | 确认：EOL |
| ST-017 | 数据库 | `sa` 高权限账号 | 审计连接串和 compose | 应用使用最小权限账号 | 确认：配置风险 |
| ST-018 | 可用性 | API/Quartz 健康状态 | `curl` + `docker logs` | API 持续可达，无启动错误 | 确认：运行异常 |
| ST-019 | 传输 | HTTPS 与安全响应头 | 审计本地 Kestrel/Startup | 生产强制 HTTPS、HSTS、CSP 等 | 未验证/需加固 |
| ST-020 | 业务回归 | 销售-生产-仓储主流程 | 复核 `tests` 历史报告 | 主流程稳定通过 | 通过 |

---

## 5.《源代码安全审计结果》

| ID | 风险项 | 级别 | 确认状态 | 证据 | 影响 | 整改建议 | 状态 |
|---|---|---|---|---|---|---|---|
| F-001 | 硬编码密钥、默认口令与连接串 | High | 确认：源码/配置暴露；潜在：生产外部利用 | `iMES.WebApi/appsettings.json:19,26,31-40,96`；`docker-compose.yml:4,22,25-27,59`；`Login.vue:23` | 源码、镜像或构建产物泄露后，可能导致数据库、Redis、JWT、Quartz 密钥被滥用 | 移出源码；使用环境变量/密钥管理；轮换所有已提交密钥；禁止前端展示真实默认账号 | Open |
| F-002 | 打印模板匿名接口暴露 | High | 部分确认：`saveOrUpdateData` 匿名写模板已代码整改；匿名读取字段元数据已验证；单据读取链待复测 | `Base_PrintTemplateController.cs:70-72,101,189,220,241,302`；动态证据 `unauthenticated-users.txt`；修复记录 `Summary/06_静态扫描候选项低影响修复记录.txt` | 未登录攻击者可能枚举单据字段、读取模板；历史上在特定 ID 条件下存在篡改非内置打印模板风险 | 写接口已移除 `AllowAnonymous` 并增加 Update 权限；读取类接口需按打印链路确认后分接口授权 | Partially Remediated |
| F-003 | `Upload` 目录公开且允许未知文件类型 | Medium | 潜在：源码危险配置确认；本轮匿名/普通用户上传 HTML 被拦截 | `Startup.cs:198-221`；`ServiceBase.cs:361-397,424-466`；动态证据 `upload-test.txt` | 在具备上传权限或存在其他写入入口时，可能形成恶意文件托管、存储型 XSS 或钓鱼下载 | 关闭 `ServeUnknownFileTypes`；上传白名单、MIME/魔数校验、随机文件名、隔离域名、下载鉴权 | Open |
| F-004 | CORS 默认 `AllowAnyOrigin` | Medium | 部分确认：恶意 Origin 预检返回 `Access-Control-Allow-Origin: *` | `Startup.cs:107-119`；动态证据 `cors-test.txt` | 单独不构成账号接管；结合 XSS、前端 token 暴露或 Cookie 误配时扩大跨站调用面 | 生产环境仅允许配置白名单；区分开发/生产策略；补充跨域集成测试 | Open |
| F-005 | 字典动态 SQL 依赖黑名单过滤 | High | 潜在：源码模式确认；业务可达路径待验证 | `Sys_DictionaryService.cs:46-54,76-83,121-135,216-243` | 若可由低权限用户配置或影响 `DbSql`，黑名单难以覆盖绕过形式，可能导致越权查询或注入 | 改为受控查询模板、参数化、白名单字段/表名映射；禁止界面写入任意 SQL | Open |
| F-006 | `.NET Core 3.1` EOL | Medium | 确认：生命周期风险 | 各 `.csproj TargetFramework=netcoreapp3.1` | 安全补丁停止，后续漏洞无法通过官方运行时更新修复 | 迁移到受支持 LTS；建立运行时升级计划 | Open |
| F-007 | NuGet/npm SCA 漏洞公告 | Medium/High | 确认：公告存在；潜在：业务可利用 | `dotnet list vulnerable`、`npm audit --omit=dev` 输出 | 组件漏洞是否能被利用取决于入口、调用路径、版本和部署环境，不合并为单个系统级已利用漏洞 | 建立依赖可达性分析；优先处理生产依赖、可达入口和无补偿控制的 High/Critical 公告 | Open |
| F-008 | 匿名测试日志接口 | Medium | Remediated：匿名属性已移除，接口限制为 SuperAdmin 并从 Swagger 隐藏，待动态复测 | `Sys_LogController.cs:21-24`；动态证据 `unauthenticated-users.txt`；修复记录 `Summary/06_静态扫描候选项低影响修复记录.txt` | 修复前可造成审计污染、存储增长或攻击链噪声；修复后需验证匿名和普通用户被拒绝 | 保留复测命令；生产环境建议进一步删除或仅开发环境启用 | Remediated |
| F-009 | Swagger UI 在生产运行时可访问 | Low/Medium | 部分确认：本地运行环境可访问 | `Startup.cs:124-160`；`curl /swagger/index.html` 返回 200 | 暴露接口结构和模型，降低攻击成本；单独不判定为高危漏洞 | 生产关闭 Swagger 或置于 VPN/鉴权后；按环境变量控制 | Open |
| F-010 | 前端 XSS 放大面 | High | 潜在：危险渲染点确认；本轮反射探测未命中 | `store/index.js:5-8,28,56-60`；`UploadExcel.vue:53`；`MesTable.vue:104-110,279-282`；`MesWangEditor.vue:55,81` | 一旦出现存储型 HTML 注入，`localStorage` token 可被读取，影响账号会话 | 统一 HTML Sanitizer；减少 `v-html`；富文本白名单净化；优化 token 存储策略 | Open |
| F-011 | 报工详情 SQL 注入历史风险已代码整改 | Medium | Remediated：代码改为参数绑定，待动态复测闭环 | `Production_ReportWorkOrderController.cs:85-93` 使用 `@workOrderId` 参数绑定；动态扰动未见 SQL 错误 | 历史拼接点已不再直接暴露注入风险，但 Closed 需等复测用例通过后再标记 | 保留回归用例；验证特殊字符不扩大查询、不报错、不改变 SQL 语义 | Remediated |
| F-012 | API 运行时不稳定与 Quartz SQL 错误 | Medium | 确认 | `docker logs` 显示 Quartz pre-login handshake；`curl 9991` 曾出现 connection refused | 定时任务不可用、API 健康状态不稳定会影响测试和生产可用性 | 修复 SQL Server TLS/驱动/连接串；加入健康检查和启动失败告警 | Open |
| F-013 | 装配工单明细生产进度动态 SQL 拼接 | High | Remediated：实际拼接点位于 `GetDetailPage`，已改为 Dapper 参数绑定，待动态复测 | `Production_AssembleWorkOrderService.cs:398-404`；修复记录 `Summary/06_静态扫描候选项低影响修复记录.txt` | 修复前业务工单编号进入可执行 SQL 字符串；修复后仅作为参数值传递，响应 JSON 字符串格式保持不变 | 复测正常装配工单明细；验证特殊字符不扩大查询、不触发 SQL 异常 | Remediated |

---

## 6.《第三方组件与 SBOM 清单》

### 6.1 后端 NuGet 主要组件

| 组件 | 版本 | 使用位置/说明 | 安全备注 |
|---|---|---|---|
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 3.1.0 | `iMES.WebApi` | 已发现中危公告；随 .NET LTS 升级 |
| `Swashbuckle.AspNetCore` | 5.0.0-rc5 | `iMES.WebApi` | 预发布旧版本，SwaggerUI 存在漏洞公告 |
| `Autofac / Extensions.DependencyInjection` | 4.9.4 / 5.0.1 | Core/WebApi | 需随框架升级兼容 |
| `Dapper` | 1.50.5 | Core 数据访问 | 版本较旧；继续坚持参数绑定 |
| `EntityFrameworkCore` | 3.1.0 | Core/System/Entity/Builder | 随 .NET 3.1 EOL 进入高风险维护状态 |
| `Microsoft.Data.SqlClient` | 1.0.19269.1 | 传递依赖 | 存在高危/中危公告 |
| `Newtonsoft.Json` | 11.0.2 / 12.0.3 | Entity/传递依赖 | 存在高危公告，需统一升级 |
| `Npgsql` | 4.1.3.1 | PostgreSQL 支持 | 存在高危公告 |
| `SkiaSharp` | 2.88.0 | 图形/报表相关 | 存在高危公告 |
| `System.Drawing.Common` | 4.7.0 | 传递依赖 | 存在严重漏洞公告 |
| `Quartz` | 3.4.0 | 定时任务 | 运行日志显示连接异常，需健康检查 |
| `EPPlus.Core` | 1.5.4 | Excel 导入导出 | 需检查许可证和文件解析漏洞面 |

### 6.2 前端 npm 主要组件

| 组件 | 版本 | 用途 | 安全备注 |
|---|---|---|---|
| `vue` | ^3.2.37 | 前端框架 | 继续跟随 Vue 3 安全版本 |
| `vue-router / vuex` | ^4.0.0-0 | 路由与状态 | token 当前存储在 `localStorage` |
| `element-plus` | ^2.2.15 | UI 组件 | 生产依赖审计存在中危公告 |
| `axios` | ^0.21.1 | HTTP 客户端 | 生产依赖审计高危，建议升级到 1.x 并回归请求封装 |
| `wangeditor` | ^4.7.6 | 富文本编辑器 | 存在 XSS 公告且无直接修复版本，建议迁移或严格净化 |
| `echarts` | ^5.0.2 | 图表 | 生产依赖审计中危，建议升级 |
| `sortable.js / sortablejs` | 0.3.0 / ^1.15.0 | 拖拽排序 | 存在高危传递依赖风险；清理重复依赖 |
| 二维码相关包 | 多个 | 二维码展示 | 建议减少重复包并锁定安全版本 |
| `@vue/cli-service` | ~4.5.0 | 构建工具 | 开发链路存在 Critical/High 漏洞；建议迁移 Vite 或 Vue CLI 5+ |

### 6.3 基础镜像/运行组件

| 组件 | 版本/镜像 | 来源 | 风险 |
|---|---|---|---|
| ASP.NET Runtime | `mcr.microsoft.com/dotnet/aspnet:3.1` / 本地 `imes-aspnet31-fontconfig:local` | Docker 运行环境 | .NET 3.1 EOL，需迁移 |
| SQL Server | 运行容器 `mcr.microsoft.com/mssql/server:2025-latest`；compose 可选 2019-latest | Docker | 应用使用 `sa` 默认高权限连接，需最小权限账号 |
| Redis | `redis:7-alpine` | `docker-compose.yml` | 默认密码需改为密钥系统注入 |
| Node | `node:14-bullseye` | 构建阶段 | Node 14 已 EOL，构建链需升级 |
| Nginx | `nginx:1.25-alpine` | 前端部署 | 需补充安全响应头与静态资源策略 |

### 6.4 依赖可达性初步分析

| 组件/类别 | SCA 严重级别 | 运行可达性 | 本报告处理口径 | 建议 |
|---|---|---|---|---|
| `.NET Core 3.1` 运行时 | EOL，不适用 CVSS 合并评级 | 运行时必然可达 | 确认的生命周期风险，不等同于单个可利用漏洞 | 作为架构升级项纳入 P1，迁移到受支持 LTS |
| `System.Text.Encodings.Web`、`System.Drawing.Common` 等传递包 | Critical 公告 | 需结合调用点确认；图形/报表/编码链路可能间接可达 | SCA 确认，利用待分析 | 对生产调用链做 reachability 复核，优先升级无兼容风险包 |
| `Microsoft.Data.SqlClient` / `System.Data.SqlClient` | Moderate/High 公告 | 数据库访问链路可达 | SCA 确认，需结合连接串、TLS、驱动版本判断 | 随 .NET 升级同步升级 SQL Client 并复测 Quartz 连接 |
| `Swashbuckle.AspNetCore.SwaggerUI` | Moderate 公告 | 仅 Swagger 暴露时可达 | 作为暴露面治理，不单独高危 | 生产关闭或加鉴权 |
| `axios` | High 公告 | 前端 HTTP 调用必然可达 | 生产依赖可达，需优先升级并回归请求封装 | 升级到 1.x，验证 token、下载、文件上传逻辑 |
| `wangeditor` | High XSS 公告 | 富文本编辑器页面可达时可触发 | 与本系统 XSS 数据流合并评估 | 引入净化库或替换编辑器，存储/展示两端净化 |
| `@vue/cli-service`、webpack 链路 | Critical/High 开发依赖公告 | 主要在构建/开发环境可达 | 不合并为生产 Critical 业务漏洞 | 升级构建链或迁移 Vite，隔离 CI 权限 |

---

## 7.《漏洞扫描原始结果》

### 7.1 NuGet 漏洞扫描

命令：`dotnet list iMES.WebApi/iMES.WebApi.csproj package --vulnerable --include-transitive`

说明：下表为 SCA 公告结果，不直接等同于系统已被成功利用。实际风险需结合“生产是否加载该组件、存在可控输入入口、漏洞前置条件是否满足、是否有补偿控制”判断。

| 包 | 版本 | 严重级别 | 公告 |
|---|---|---|---|
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 3.1.0 | Moderate | GHSA-q7cg-43mg-qp69 |
| `AutoMapper` | 6.2.2 | High | GHSA-rvv3-g6hj-g44x |
| `Microsoft.Data.SqlClient` | 1.0.19269.1 | Moderate / High | GHSA-8g2p-5pqh-5jmc；GHSA-98g6-xh36-x2p7 |
| `Microsoft.IdentityModel.JsonWebTokens` | 5.6.0 | Moderate | GHSA-59j7-ghrg-fj52 |
| `Newtonsoft.Json` | 12.0.3 | High | GHSA-5crp-9r3c-p9vr |
| `Npgsql` | 4.1.3.1 | High | GHSA-x9vc-6hfv-hg8c |
| `SkiaSharp` | 2.88.0 | High | GHSA-j7hp-h8jx-5ppr |
| `Swashbuckle.AspNetCore.SwaggerUI` | 5.0.0-rc5 | Moderate | GHSA-qrmm-w75w-3wpx |
| `System.Data.SqlClient` | 4.5.0 | Moderate / High | GHSA-8g2p-5pqh-5jmc；GHSA-98g6-xh36-x2p7 |
| `System.Drawing.Common` | 4.7.0 | Critical | GHSA-rxg9-xrhp-64gj |
| `System.IdentityModel.Tokens.Jwt` | 5.6.0 | Moderate | GHSA-59j7-ghrg-fj52 |
| `System.Net.Http` | 4.3.0 | High | GHSA-7jgj-8wvc-jh57 |
| `System.Net.Security` | 4.0.0 | Moderate / High | GHSA-ch6p-4jcm-h8vh；GHSA-6xh7-4v2w-36q6；GHSA-qhqf-ghgh-x2m4；GHSA-j8f4-2w4p-mhjc |
| `System.Text.Encodings.Web` | 4.5.0 | Critical | GHSA-ghhp-997w-qr28 |
| `System.Text.RegularExpressions` | 4.3.0 | High | GHSA-cmhx-cq75-c4mj |

### 7.2 npm 漏洞扫描

命令一：`npm --registry=https://registry.npmjs.org audit --json`  
命令二：`npm --registry=https://registry.npmjs.org audit --omit=dev --json`

| 范围 | 漏洞总数 | Low | Moderate | High | Critical | 依赖统计 |
|---|---:|---:|---:|---:|---:|---|
| 全部依赖 | 148 | 10 | 70 | 54 | 14 | prod 111、dev 1526、optional 33、total 1636 |
| 生产依赖 `--omit=dev` | 15 | 0 | 8 | 7 | 0 | 主要涉及 `axios`、`wangeditor`、`echarts`、`element-plus`、`sortable.js` |

| 组件 | 级别 | 类型 | 备注 |
|---|---|---|---|
| `axios` | High | 直接依赖 | 多项 CSRF/SSRF/DoS/请求处理相关公告，修复需升级到 1.x |
| `wangeditor` | High | 直接依赖 | XSS 公告 GHSA-g7mw-5cq6-fv82，扫描显示无直接修复版本 |
| `echarts` | Moderate | 直接依赖 | 修复指向 6.x major |
| `element-plus` | Moderate | 直接依赖 | 存在可修复公告，需结合 Vue 版本回归 |
| `sortable.js` | High | 直接依赖 | 经 `mout` 传递高危风险，扫描显示无直接修复 |
| `@vue/cli-service` | Critical | 开发依赖 | 构建链路经 `webpack-dev-server`、`webpack` 等传递多个高危/严重公告 |
| `@babel/traverse` | Critical | 开发/传递依赖 | GHSA-67hx-6x53-jw92 |

### 7.3 EOL、SCA 与可利用漏洞拆分

| 类型 | 本轮结论 | 是否作为已利用漏洞 | 后续动作 |
|---|---|---|---|
| EOL 生命周期 | `.NET Core 3.1`、Node 14 构建链均已停止支持 | 否 | 作为平台升级风险治理 |
| SCA 公告 | NuGet/npm 存在 Critical/High 公告 | 否 | 按生产依赖、入口可达性和修复成本排序 |
| 源码危险点 | `AllowAnonymous`、动态 SQL、`v-html`、上传无类型校验等模式存在 | 否，除非有动态证据支撑 | 补专项用例，逐个确认 |
| 动态确认漏洞/缺陷 | 匿名打印模板字段元数据、匿名日志测试接口；CORS 任意来源预检作为配置缺陷 | 是/部分确认，按实际影响定级 | 纳入整改与复测跟踪 |

### 7.4 Critical 低影响修复后审计结果

修复日期：2026-07-22。  
修复范围：仅前端 `package-lock.json` 中 semver 兼容的开发依赖补丁；未执行 `npm audit fix --force`，未升级 Vue CLI/webpack 大版本，未修改业务源码。

| 范围 | 修复前总数 | 修复前 Critical | 修复后总数 | 修复后 Critical | 结论 |
|---|---:|---:|---:|---:|---|
| 全部 npm 依赖 | 148 | 14 | 119 | 8 | 已低影响降低开发链 Critical |
| 生产依赖 `--omit=dev` | 15 | 0 | 6 | 0 | 生产依赖仍无 Critical |

修复后构建验证：`npm ci` 退出码 0；`NODE_OPTIONS=--openssl-legacy-provider npm run build` 退出码 0，生成 `dist` 目录。  
剩余 Critical 主要属于 Vue CLI 4 / webpack 4 开发构建链，继续清零需要破坏性升级，已转入构建链专项治理。

---

## 8.《MES 系统安全测试与漏洞评估报告》

### 8.1 总体评级

总体风险等级评定为 High。报告不再把 EOL 或 SCA Critical 公告直接合并为系统级已利用漏洞，而是按“动态确认、部分确认、潜在”分层处置。当前最需要专项复测和优先整改的是匿名打印模板接口、上传执行链、动态 SQL 和存储型 XSS；CORS、Swagger、匿名固定日志接口作为组合攻击链中的放大条件描述。

| 攻击链 | 可能路径 | 业务影响 | 建议优先级 |
|---|---|---|---|
| 密钥泄露链 | 源码/配置泄露 -> 获取 DB/JWT/Redis 密钥 -> 伪造访问或直接访问数据 | 生产工单、仓储、报表数据泄露或篡改 | P0，潜在外部利用 |
| 匿名模板链 | 未登录读取字段元数据 -> 获取模板/单据 ID -> 调用匿名模板读写接口 -> 篡改单据模板或读取业务单据 | 出入库、生产、销售单据可信度受损 | P0，部分确认 |
| 上传与静态链 | 具备上传权限或其他写入入口 -> 上传 HTML/脚本类文件 -> `/Upload` 公开访问 -> 存储型 XSS/恶意文件分发 | 用户会话与终端安全受影响 | P1，潜在 |
| 动态 SQL 链 | 可影响 `DbSql` 或查询条件 -> 绕过黑名单/拼接查询 -> 越权读取或修改数据 | 基础数据和业务数据完整性受影响 | P1，潜在 |
| XSS 与 token 链 | 富文本/表格 formatter/上传结果 HTML 注入 -> `v-html` 渲染 -> 读取 `localStorage` token -> 调用业务 API | 账号权限被冒用，业务数据被修改 | P1，潜在 |
| 暴露面放大链 | Swagger 枚举接口 + CORS 任意来源 + 匿名日志噪声 -> 降低攻击成本和审计清晰度 | 攻击效率提升，审计污染 | P2，部分确认 |
| 供应链链 | 生产可达组件漏洞被匹配利用 -> 服务崩溃/远程代码执行/信息泄露 | 系统可用性与数据安全受影响 | P1/P2，按可达性排序 |

### 8.2 认证后权限矩阵补充

| 接口/能力 | 匿名用户 | 普通用户 `User_Id=4378` | 管理员 `User_Id=1` | 本轮结论 |
|---|---|---|---|---|
| `POST /api/User/getCurrentUserInfo` | 401 | 200，返回自身信息 | 未单独复测 | 基础认证有效 |
| `POST /api/User/modifyUserPwd` | 未测，按控制器应需认证 | 401，角色无权限 | 200，进入“用户不存在”业务校验 | 超级管理员权限约束有效 |
| `POST /api/Sys_User/GetPageData` 查询 `User_Id=1` | 未测，按基类应需认证 | 401，无权限 | 200，返回管理员用户记录 | 水平越权初测未成功 |
| `POST /api/Sys_Menu/getMenu` | 404/拒绝 | 待补充 | 待补充 | 路由/权限需用真实菜单账号复测 |
| 基类 `Upload` | 401 | 401，无权限 | 待补充 | 上传链需使用具备 Upload 权限账号专项验证 |
| 打印模板 `getResourceByCatId` | 200，返回字段元数据 | 待补充 | 待补充 | 匿名访问已确认 |

### 8.3 匿名接口动态验证补充

| 接口 | 动态结果 | 影响判断 | 确认状态 |
|---|---|---|---|
| `/api/User/getVierificationCode` | 200，返回验证码图片与 uuid | 登录前必要接口，属于预期匿名 | 确认正常 |
| `/api/User/getCurrentUserInfo` | 401，返回“授权未通过” | 未泄露当前用户信息 | 确认防护有效 |
| `/api/Base_PrintTemplate/getResourceByCatId` | 200，返回销售订单头/明细字段元数据 | 可帮助未登录者理解业务数据结构，是模板链前置条件 | 部分确认，高优先级复测 |
| `/api/Sys_Log/test` | 200，响应 `11`，源码显示循环写入 10 条日志 | 审计污染/存储增长风险，作为组合链条件 | 确认，中风险 |
| `/swagger/index.html` | 200，Swagger UI 可访问 | 暴露路由和模型，降低攻击成本 | 部分确认，低/中风险 |

### 8.4 上传利用链补充

| 环节 | 当前证据 | 结论 |
|---|---|---|
| 上传入口权限 | `ApiBaseController.Upload` 需要 `ApiActionPermission(Upload)`；匿名上传 HTML 返回 401，普通用户返回 401 | 未确认普通低权用户可上传 |
| 服务端文件处理 | `ServiceBase.Upload` 直接使用原始文件名写入，未见扩展名、MIME、魔数、大小校验启用 | 潜在风险确认 |
| 静态访问 | `Startup` 将 `/Upload` 公开映射，且根静态文件启用 `ServeUnknownFileTypes=true` | 若上传成功，公开访问链路可能成立 |
| 待复测动作 | 使用具备 Upload 权限的测试账号上传 `.html`、伪装图片、超大文件、双扩展名，随后访问 `/Upload/...` 验证 Content-Type、nosniff、鉴权 | 完整利用链尚未闭环 |

### 8.5 XSS 数据流补充

| 数据源/入口 | 传输/存储 | 渲染点 | 风险判断 |
|---|---|---|---|
| `MesWangEditor` 富文本输入 | `update:modelValue` 把 HTML 交给业务表单保存 | 后续如通过 `v-html`、打印模板或富文本展示回显 | 存储型 XSS 潜在 |
| 表格列 `formatter` | 业务列表数据和列配置共同决定 HTML | `MesTable.vue:104-110,279-282` 使用 `v-html` | 若 formatter 拼接用户可控字段，可触发 |
| Excel 上传结果 `message` | 后端导入结果或前端错误消息 | `UploadExcel.vue:53` 使用 `v-html` | 若后端返回未经净化的文件内容/错误消息，可触发 |
| token 存储 | Vuex 从 `localStorage` 读写用户信息与 token | XSS 成功后可读取 `localStorage.user` | XSS 会话放大面确认 |
| 本轮动态探测 | `DefectItemName=<script>alert(1)</script>` 查询返回 200 但未反射 payload | 未确认反射 XSS | 存储型链需专项验证 |

### 8.6 动态 SQL 专项复测补充

| 位置 | 当前证据 | 风险判断 | 后续验证 |
|---|---|---|---|
| `Production_ReportWorkOrder/getReportDetailInfo` | 代码已使用 `@workOrderId` 参数；扰动 payload 未见 SQL 错误 | Remediated，待复测通过后可标记 Closed | 对正常 ID、特殊字符、延时 payload、扩大查询 payload 做对照 |
| `Production_WorkOrder/GetPageData` | WorkOrderCode like 扰动返回 0 行，无 SQL 错 | 初测未确认注入 | 复核服务层 SerializeJSON/存储过程是否参数化 |
| `Sys_DictionaryService DbSql` | 源码存在动态 SQL 配置执行路径 | 潜在高风险 | 验证哪些角色能编辑字典 SQL；禁止低权用户影响 SQL 文本 |

### 8.7 容器配置测试补充

| 测试点 | 当前证据 | 风险判断 | 建议 |
|---|---|---|---|
| API 容器端口 | `imes-webapi-dev` 映射 `0.0.0.0:9991->9991/tcp` | 本地/宿主网络可访问 API | 生产使用反向代理和访问控制，避免直接暴露 Kestrel |
| SQL Server 容器 | 运行容器映射 1433，应用连接串使用 `sa` | 高权限账号和端口暴露风险 | 建立最小权限应用账号，限制网络访问 |
| DataProtection | 日志提示 key 未持久化 | 容器重启后加密材料丢失，影响会话/加密数据一致性 | 持久化 key ring 或接入密钥系统 |
| Quartz 连接 | 日志出现 SQL pre-login handshake 错误 | 定时任务不可用或健康状态不稳定 | 修复 TLS/驱动/连接串，加入健康检查 |
| 静态文件 | `/Upload` 公开映射，无下载鉴权 | 与上传链组合后风险升高 | 私有文件走授权下载，公开文件隔离域名和 MIME 白名单 |

### 8.8 整改路线

| 时限 | 整改动作 | 验收标准 |
|---|---|---|
| 0-3 天 | 鉴权打印模板匿名写/读单接口；删除 `Sys_Log/test` 或开发环境限定；轮换所有已提交密钥；关闭未知静态文件类型 | 匿名模板链不可达；测试日志接口匿名访问 401/404；生产配置不含默认口令 |
| 1-2 周 | 上传服务端白名单与内容检测；HTML 输出净化；降低 `localStorage` token 风险；应用 DB 账号最小权限；收紧 CORS；生产关闭 Swagger | 上传/XSS/权限矩阵用例通过；非白名单 Origin 失败；Swagger 生产 404/401 |
| 1 个月 | 迁移 .NET 3.1 到受支持 LTS；升级生产可达 NuGet/npm 高危组件；构建 CI SCA/SBOM；补齐角色矩阵与 DAST | EOL 消除；生产可达 Critical/High 公告清零或有风险接受单；复测报告关闭问题 |

### 8.9 测试缺口

- 当前仓库 `tests/results` 仅见 `.gitignore`，历史 JSON 原始结果未随仓库保留；本报告依据 `tests/*.md` 记录复核。
- 未发现可用的浏览器自动化工具，未完成端到端 UI 截图证据采集。
- API 9991 曾在低侵入探测中出现间歇连接拒绝，部分接口仍需稳定环境复测。
- 尚需补齐车间、BOM、移动端报工、报工审核/直接确认、质量管理、设备点检保养、排产、绩效工资、Excel 模板导出的测试。
- 认证后角色越权矩阵已完成第一轮样例验证，但仍需补齐全部角色、全部菜单与按钮权限。
- 匿名打印模板写入、上传执行链、存储型 XSS、动态 SQL 可达性和真实数据库权限隔离仍需专项验证。

---

## 9.《漏洞整改跟踪表》

| 编号 | 漏洞/问题 | 优先级 | 责任建议 | 整改建议 | 复测方法 | 状态 |
|---|---|---|---|---|---|---|
| R-001 | 硬编码密钥、默认 DB/Redis/JWT 口令 | P0 | 后端/运维 | 密钥系统化、轮换、移出源码、禁止默认口令 | 源码扫描无明文；旧密钥失效；服务使用新密钥启动 | Open |
| R-002 | 打印模板匿名读写接口 | P0 | 后端/业务 | 写接口已移除 `AllowAnonymous` 并补充 Update 权限；读取类接口需按打印链路分接口授权 | 匿名写模板返回 401/403；授权用户按权限保存；读取接口完成业务确认和动态复测 | Partially Remediated |
| R-003 | `.NET 3.1` EOL | P1 | 架构/后端 | 迁移受支持 LTS | 运行时版本受支持，服务稳定启动，回归通过 | Open |
| R-004 | npm 生产依赖高危漏洞 | P1 | 前端 | 升级 `axios`、`element-plus`、`echarts`；替换/隔离 `wangeditor`、`sortable.js` 风险 | `npm audit --omit=dev` 无 High | Open |
| R-005 | Upload 公开与未知类型 | P1 | 后端/运维 | 白名单、重命名、下载鉴权、关闭 `ServeUnknownFileTypes` | 上传脚本验证非法扩展失败；公开访问受控 | Open |
| R-006 | CORS `AllowAnyOrigin` | P2 | 后端 | 按环境加载白名单，生产禁用任意来源 | 非白名单 Origin 预检失败 | Open |
| R-007 | 动态字典 SQL 黑名单过滤 | P1 | 后端 | 改为白名单模板与参数化，不执行任意 SQL | 注入 payload 不进入 SQL 语义；代码无 `QueryList(dbSql, null)` 任意路径 | Open |
| R-008 | `Sys_Log/test` 匿名接口 | P2 | 后端 | 已移除匿名访问，限制 SuperAdmin，并从 Swagger 隐藏 | 匿名和普通用户访问 401/403；超级管理员按需访问 | Remediated |
| R-009 | Swagger 生产暴露 | P2 | 后端/运维 | 生产关闭或置于 VPN/鉴权后 | 生产 `/swagger` 返回 404/401 | Open |
| R-010 | 前端 `v-html` 与 token `localStorage` | P1 | 前端/架构 | HTML 净化、减少 `v-html`、优化会话存储策略 | XSS 用例无法读取 token；危险 HTML 被过滤 | Open |
| R-011 | Quartz SQL pre-login 与 API 不稳定 | P2 | 后端/运维 | 修复连接串/TLS/驱动，加入健康检查 | `docker logs` 无错误；健康检查连续通过 | Open |
| R-012 | 历史报工详情 SQL 注入 | P2 | 后端 | 已改为 `@workOrderId` 参数绑定 | 特殊字符、扩大查询、延时 payload 均不能改变 SQL 语义且无异常泄露 | Remediated |
| R-013 | 前端开发依赖 Critical 低影响修复 | P2 | 前端/构建 | 已通过 lockfile v1 兼容补丁降低 Critical；剩余项转构建链升级专项 | `npm audit` Critical 14 -> 8；`npm run build` 通过 | Remediated |
| R-014 | 装配工单明细生产进度 SQL 拼接 | P1 | 后端 | 已改为 Dapper 参数绑定，保留前端 JSON 字符串格式 | 正常明细返回不变；特殊字符不改变 SQL 语义；动态复测通过后关闭 | Remediated |

状态说明：`Open` 表示尚未完成整改；`Remediated` 表示代码或配置已修改但尚未完成独立动态复测；`Closed` 仅用于整改完成、部署到目标环境且动态复测通过的项目。

---

## 10.《测试证据与操作日志归档》

### 10.1 操作日志

| 阶段 | 操作 | 关键结果 | 归档位置 |
|---|---|---|---|
| 源码盘点 | `find`/`rg` 统计项目、C# 文件、Vue/JS 文件、csproj、package.json | 9 个后端项目，828 个 C# 文件，225 个前端源文件 | 本报告第 3 章；`evidence/03_源码审计证据索引.txt` |
| 运行探测 | `screen -ls`、`ps aux`、`curl 9990/9991`、`docker ps`、`docker logs` | 前端 9990 可访问；Swagger 曾返回 200；API 后续不稳定；Quartz SQL 报错 | `evidence/01_运行时观察记录.txt` |
| NuGet 扫描 | `dotnet list ... --vulnerable --include-transitive` | 发现 .NET EOL 与多个 Critical/High/Moderate 漏洞包 | 本报告第 7.1；`evidence/02_依赖扫描摘要.txt` |
| npm 扫描 | `npm audit --json`；`npm audit --omit=dev --json` | 全部依赖 148 个漏洞；生产依赖 15 个漏洞 | 本报告第 7.2；`evidence/02_依赖扫描摘要.txt` |
| 第一轮动态验证 | 匿名访问、普通用户访问管理员接口、IDOR、SQL/XSS 扰动、上传、CORS、错误信息泄露 | 匿名打印模板字段元数据确认；普通用户管理员接口/IDOR 被拦截；CORS 任意来源确认；上传未闭环 | `security-evidence/05-dynamic 动态安全验证/`；本报告第 8.2-8.7 |
| 补充分析 | 认证后权限矩阵、匿名接口动态验证、上传利用链、XSS 数据流、依赖可达性、容器配置 | 明确确认/部分确认/潜在边界，避免源码危险点被写成已成功利用漏洞 | `Summary/04_补充验证矩阵与可达性分析.txt` |
| Critical 低影响修复 | 使用 npm 6 保持 lockfile v1，修复 package-lock 中兼容范围内的开发依赖 Critical | 全部依赖 Critical 14 -> 8；生产依赖 Critical 保持 0；前端 build 通过 | `Summary/05_Critical漏洞低影响修复过程报告.txt` |
| 历史测试复核 | 读取 `tests/测试执行总结.md`、主流程与 WF 测试汇总报告、自动化测试+修复报告 | 主流程多项通过；若干 MES 功能仍未覆盖 | 本报告第 3.3、第 8.3 |
| 报告生成 | 生成 Markdown 与纯文本报告 | 不依赖 Word、图片、截图或渲染工具 | `MES系统安全测试报告_文字表单版.md`；`MES系统安全测试报告_纯文字版.txt` |

### 10.2 证据文件索引

| 文件 | 内容 |
|---|---|
| `evidence/01_运行时观察记录.txt` | 前端/API/容器/日志低侵入探测结果与动态验证边界 |
| `evidence/02_依赖扫描摘要.txt` | NuGet 与 npm 漏洞扫描命令及关键摘要 |
| `evidence/03_源码审计证据索引.txt` | 关键风险源码路径与行号索引 |
| `Summary/04_补充验证矩阵与可达性分析.txt` | 认证后权限矩阵、匿名接口、上传链、XSS 数据流、依赖可达性和容器配置测试补充 |
| `Summary/05_Critical漏洞低影响修复过程报告.txt` | Critical 漏洞低影响修复判断、执行命令、版本变化和验证结果 |
| `Summary/06_静态扫描候选项低影响修复记录.txt` | 静态扫描候选项的确认状态、低影响修复过程、暂缓原因和可截图验证命令 |
| `security-evidence/05-dynamic 动态安全验证/*.txt` | 第一轮动态验证原始文本结果 |
| `MES系统安全测试报告_纯文字版.txt` | 从报告内容转换出的纯文本兜底版，任何文本编辑器可打开 |
| `MES系统安全测试报告_文字表单版.md` | 本文件，保留标题、表格和整改跟踪结构 |

### 10.3 结论签署表

| 角色 | 姓名/部门 | 意见 | 签字/日期 |
|---|---|---|---|
| 系统所有方 |  |  |  |
| 研发负责人 |  |  |  |
| 运维负责人 |  |  |  |
| 安全测试负责人 |  |  |  |

---

## 附录 A：当前限制说明

- 未执行破坏性 DAST、暴力破解、真实生产数据导出或生产网络扫描。
- 当前环境缺少可用浏览器自动化工具，未采集 UI 截图。
- 当前环境缺少 `pdf2image` / LibreOffice / Poppler，因此未进行 DOCX 图片渲染 QA。
- 因用户反馈 DOCX 仍无法打开，本次重试以 Markdown 与纯文本形式交付，不再依赖 Word 客户端兼容性。
