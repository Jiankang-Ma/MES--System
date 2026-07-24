# Vue前端单元测试报告

## 前端公共工具与用户列缓存测试： 丁伯源

## 本次范围

测试范围限定为 `源码/iMES.Vue3` 下的三个文件，重点覆盖树、日期、格式校验、URL 和用户列缓存恢复：

| 模块 | 源码路径 | 测试重点 |
| --- | --- | --- |
| 公共工具 | `src/uitils/common.js` | 树转换、父子节点查询、日期辅助、手机号/数字/邮箱校验、URL 判断和拼接、下载回调 |
| 日期工具 | `src/uitils/dateFormatUtil.js` | 日期格式化、时间戳、周/月/季度边界、日期减法 |
| 用户列配置 | `src/components/basic/ViewGrid/ViewGridCustomColumn.js` | 缓存键、列顺序和显示状态恢复、异常缓存、新旧字段兼容、重置和保存 |

单元测试不连接 SQL Server、Redis 或真实 HTTP API，不使用真实浏览器缓存。本轮只完成前期测试，不修改业务源码，不进行修改后复测。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-22 |
| 当前分支 | `test/system-permission` |
| 当前 commit SHA | `dfab3d1` |
| 测试工程 | `源码/iMES.Vue3` |
| 测试目录 | `tests/前端自动化测试用例` |
| 执行方式 | `tests/前端自动化测试用例/run-tests.ps1` |
| 测试框架 | Vue CLI Unit Mocha 4.5.18 + Mocha 6.2.3 + Chai 4.3.6 |
| 结果 | **63 个用例：45 通过，18 失败，0 跳过** |
| 运行时 | Node.js 24.14.0；使用 `NODE_OPTIONS=--openssl-legacy-provider` 兼容旧版 Webpack |

测试编译成功。Browserslist 数据过期和旧版 Vue CLI 弃用提示不影响本轮执行结果。

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 测试基建 | 三个目标模块加载；`localStorage` Mock 写入、读取和清理 | 2/2 通过 |
| 树结构 | 多层树、多个根节点、隐藏节点、孤立节点、两节点循环、父链、子链、异常输入 | 9/10 通过 |
| `common.js` 日期辅助 | 跨月、闰日、跨年、时间部分保留、当前日期/时间格式 | 4/4 通过 |
| 格式校验 | 常见合法手机号、整数、小数、邮箱，以及大部分非法边界 | 4/8 通过 |
| URL | HTTP/HTTPS/FTP/localhost、相对路径、普通图片地址拼接 | 3/8 通过 |
| 日期格式化 | 默认格式、自定义格式、空值、当前日期时间 | 4/6 通过 |
| 日期范围 | 当前年份各月天数、季度月份、本周、本月、上月、本季度、日期减法 | 7/9 通过 |
| 用户列缓存键 | 不同表格缓存隔离 | 1/2 通过 |
| 用户列缓存恢复 | 默认初始化、正常恢复、新增字段、删除字段、非法缓存 | 6/8 通过 |
| 用户列重置与保存 | 正常重置、关闭撤销、至少显示一列、保存后恢复、写入异常降级 | 5/6 通过 |

正式测试文件：

- `tests/前端自动化测试用例/common.spec.js`
- `tests/前端自动化测试用例/dateFormatUtil.spec.js`
- `tests/前端自动化测试用例/ViewGridCustomColumn.spec.js`
- `tests/前端自动化测试用例/environment.spec.js`
- `tests/前端自动化测试用例/helpers/localStorageMock.js`
- `tests/前端自动化测试用例/run-tests.ps1`

## 本次发现的问题

| 编号 | 复现场景 | 修改 | 复测 |
| --- | --- | --- | --- |
| FE-TREE-01 | `convertTree()` 处理一个根节点和一个子节点时，callback 实际收到 `[1, 2, 2]`，子节点被调用两次 |  |  |
| FE-FMT-01 | `isPhone('1,123456789')` 返回 `true`，手机号第二位字符组错误接受逗号 |  |  |
| FE-FMT-02 | `isDecimal('12a50')` 返回 `true`，未转义的 `.` 把任意字符当作小数点 |  |  |
| FE-FMT-03 | `isDecimal('-')` 返回 `true` |  |  |
| FE-FMT-04 | `isNumber('-')` 返回 `true` |  |  |
| FE-URL-01 | `checkUrl('http://999.999.999.999/file')` 返回 `true`，IPv4 分段未限制在 0～255 |  |  |
| FE-URL-02 | `checkUrl('https://example.technology/path')` 返回 `false`，顶级域名被限制为 1～6 位，是否支持现代长顶级域名待确认 |  |  |
| FE-URL-03 | `matchUrlIp()` 把 `api.example.com.evil.test` 误判为匹配 `api.example.com` |  |  |
| FE-URL-04 | `getImgSrc('/Upload/a.png', 'http://localhost:9991/')` 返回含 `//Upload` 的地址 |  |  |
| FE-URL-05 | `downloadImg()` 请求成功后抛出 `ReferenceError: callback is not defined` |  |  |
| FE-DATE-01 | `formatTimeStamp(0)` 返回 `-`，零时间戳是否应作为有效时间待确认 |  |  |
| FE-DATE-02 | `formatTimeStamp('not-a-date')` 返回 `NaN-aN-aN aN:aN:aN` |  |  |
| FE-DATE-03 | 2026-07-22 执行 `getLastWeekStartDate()` 返回 2026-07-13，预期 2026-07-12 |  |  |
| FE-DATE-04 | 2026-07-22 执行 `getLastWeekEndDate()` 返回 2026-07-19，预期 2026-07-18 |  |  |
| FE-COLUMN-01 | 同一表格的不同用户得到相同缓存键 `custom:columnTable_A`，是否要求用户隔离待确认 |  |  |
| FE-COLUMN-02 | 缓存包含重复字段时，恢复结果出现重复列 `['name', 'name', 'code', 'qty']` |  |  |
| FE-COLUMN-03 | 重复初始化后，被缓存隐藏的 `name` 列从可选列列表消失，无法重新勾选 |  |  |
| FE-COLUMN-04 | 原字段被删除后调用 `resetViewColumns()`，结果数组包含 `undefined` |  |  |

## 交接结论

前端三个目标模块的前期单元测试已经完成，共 63 个用例，45 个通过、18 个失败、0 个跳过。树的基础转换、常规日期范围、正常格式校验和常规用户列缓存恢复已建立测试基线；18 个失败项已记录在“本次发现的问题”中。本轮未修改业务源码，“修改”和“复测”两列留空，供后续修复阶段继续填写。



## ViewGrid方法、明细、动态表格与动态表单测试：楼博涵

## 本次范围

测试范围限定为 `源码/iMES.Vue3` 下的四个模块，重点覆盖通用 CRUD、提交前阻断、明细数据操作、动态表格加载与编辑、动态表单验证与重置：

| 模块 | 源码路径 | 测试重点 |
| --- | --- | --- |
| ViewGrid 方法 | `src/components/basic/ViewGrid/methods.js` | 通用 CRUD、提交前阻断、查询参数构建、表单重置、字典绑定、导出、辅助方法 |
| 明细方法 | `src/components/basic/ViewGrid/detailMethods.js` | 明细数据加载、行操作、汇总计算、事件代理 |
| 动态表格 | `src/components/basic/MesTable.vue` | 动态表格加载、双击编辑、分页、排序、行选中、合计、格式化、行操作、属性 |
| 动态表单 | `src/components/basic/MesForm.vue` | 表单初始化、验证规则、远程搜索、文件处理、重置、日期选项、字典加载、文本格式化 |

单元测试不连接 SQL Server、Redis 或真实 HTTP API，不使用真实浏览器缓存。本轮只完成前期测试，不修改业务源码，不进行修改后复测。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-23 |
| 当前分支 | `dev` |
| 当前 commit SHA | `29389e3` |
| 测试工程 | `源码/iMES.Vue3` |
| 测试目录 | `tests/前端自动化测试用例` |
| 执行方式 | `tests/前端自动化测试用例/run-tests.ps1` |
| 测试框架 | Vue CLI Unit Mocha + Chai 4.3.6 |
| 结果 | **88 个用例：86 通过，2 失败，0 跳过** |
| 运行时 | Node.js 24.14.0；使用 `NODE_OPTIONS=--openssl-legacy-provider` 兼容旧版 Webpack |

测试编译成功。Browserslist 数据过期和旧版 Vue CLI 弃用提示不影响本轮执行结果。

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 测试基建 | 四个目标模块加载；`localStorage` Mock 写入、读取和清理 | 2/2 通过 |
| `methods.js` 通用 CRUD | 新建、编辑（单行/多选/未选）、删除、保存、连续添加 | 8/8 通过 |
| 提交前阻断 | addBefore/updateBefore 同步/异步返回 false 阻止保存 | 4/4 通过 |
| 查询参数 | 普通查询、级联查询、区间查询、空值过滤、空字符串 trim | 5/5 通过 |
| 表单重置 | 编辑重置保留主键、查询重置清空、number 类型转换 | 3/3 通过 |
| 字典绑定 | img/file 字段识别、字典数据源绑定、级联树形转换 | 3/3 通过 |
| 导出 | 主表导出参数构建、新建禁止导出、exportBefore 阻断 | 3/3 通过 |
| 辅助方法 | 空值识别、路径拼接 | 2/2 通过 |
| `detailMethods.js` 明细加载 | 编辑状态设置主表 ID、新建禁止加载、重置并重新加载、无明细列不加载 | 4/4 通过 |
| 行操作 | 添加新行、删除选中行/未选行、delDetailRow 阻断 | 4/4 通过 |
| 汇总计算 | 总行数更新、重新计算汇总、detail 为 null 不报错 | 3/3 通过 |
| 事件代理 | detailRowOnChange、detailRowOnClick、refreshRow | 3/3 通过 |
| `MesTable.vue` 动态表格 | load() HTTP 请求与数据更新、load() 重置分页、filterColumns 排除 hidden 列、列对象覆写 hasOwnProperty | 3/4 通过 |
| 双击编辑 | 开启编辑状态、readonly 不开启、必填字段验证、数字验证 | 4/4 通过 |
| 分页 | handleSizeChange、handleCurrentChange、resetPage | 3/3 通过 |
| 排序 | 升序/降序设置 | 2/2 通过 |
| 行选中 | getSelected、多选、单选模式 | 3/3 通过 |
| 合计 | getSummaries 填充、getInputSummaries 实时计算、无 summary 不计算 | 2/3 通过 |
| 格式化 | 下拉框转换、switch 类型、formatterDate | 3/3 通过 |
| 行操作 | addRow 添加空行、delRow 删除选中行 | 2/2 通过 |
| 属性 | url 默认值、defaultLoadPage 不自动加载 | 2/2 通过 |
| `MesForm.vue` 表单初始化 | formRules 正确处理、getColWidth 百分比计算 | 2/2 通过 |
| 验证规则 | 必填文本、数字范围、手机号、邮箱、switch 跳过 | 5/5 通过 |
| 远程搜索 | HTTP 请求、空值不请求 | 2/2 通过 |
| 文件处理 | isFile 识别类型、convertFileToArray 字符串/空值转换 | 3/3 通过 |
| 重置 | resetFields、范围字段、指定字段恢复 | 3/3 通过 |
| 日期选项 | 限制日期范围 | 1/1 通过 |
| 字典加载 | 远程请求、文本格式化（空值、switch、dataKey） | 4/4 通过 |

正式测试文件：

- `tests/前端自动化测试用例/methods.spec.js`
- `tests/前端自动化测试用例/detailMethods.spec.js`
- `tests/前端自动化测试用例/MesTable.spec.js`
- `tests/前端自动化测试用例/MesForm.spec.js`
- `tests/前端自动化测试用例/environment.spec.js`
- `tests/前端自动化测试用例/helpers/localStorageMock.js`
- `tests/前端自动化测试用例/run-tests.ps1`

## 本次发现的问题

| 编号 | 模块 | 复现场景 | 修改 | 复测 |
| --- | --- | --- | --- | --- |
| WH-BUG-11 | MesTable.vue | `mounted` 钩子中 `rowDrop()` 直接调用 `Sortable.create(tbody)`，未判断 `tbody` 是否为 null，无真实 DOM 环境时抛异常 | | |
| WH-BUG-12 | MesTable.vue | `getSummaries()` 对 `data.summary` 中所有字段执行 `(sum * 1.0).toFixed(2)`，非数字字段（如 `'汇总名称'`）产生 NaN 污染合计行，导致 `summaryData[0]` 无法被设为 `'合计'` | | |
| WH-BUG-13 | MesTable.vue | `hasOwnProperty('edit')` 使用实例方法而非 `Object.prototype.hasOwnProperty.call()`，传入 `{ hasOwnProperty: 'hijacked' }` 的列对象时抛异常 | | |

## 交接结论

前端四个目标模块的前期单元测试已经完成，共 88 个用例，86 个通过、2 个失败、0 个跳过。ViewGrid 通用 CRUD 方法、明细数据操作、动态表格基础功能、动态表单验证与重置已建立测试基线；3 个失败项已记录在"本次发现的问题"中。本轮未修改业务源码，"修改"和"复测"两列留空，供后续修复阶段继续填写。



## 流程图与生产领域测试： Fitzgerald

## 本次范围

测试范围限定为 `源码/iMES.Vue3` 的流程图自研逻辑和生产领域 extension，重点覆盖流程节点/连线规则，以及销售订单、生产计划、生产工单、装配工单和报工的数据加工与前端状态控制。`components/workflow/jsplumb.js` 为第三方连线库，本轮不为其编写测试用例。

| 模块 | 源码路径 | 测试重点 |
| --- | --- | --- |
| 流程图基础 | `src/components/workflow/utils.js`、`data_default.js`、`force-directed.js` | 有向/反向连线判断、连接器查询、节点 ID、默认流程结构、自动布局坐标 |
| 流程图组件 | `src/components/workflow/node.vue`、`node_form.vue`、`workflow.vue` | 节点选中与移动、审批类型字段切换、节点保存、连线标签、画布新增节点与重名处理 |
| 销售订单与生产计划 | `src/extension/production/production/Production_SalesOrder.js`、`Production_ProductPlan.js` | 编码筛选、行选中与明细刷新、表单编号提示 |
| 生产工单 | `src/extension/production/production/Production_WorkOrder.js` | 产品回填、工序明细生成、字典标签转换、已开始工单阻断 |
| 装配工单 | `src/extension/production/production/Production_AssembleWorkOrder.js` | 编码筛选、工序进度步骤定位 |
| 报工 | `src/extension/production/production/Production_ReportWorkOrder.js` | 工时/效率计算、相同时间保护、新增默认状态与时间 |

单元测试不连接 SQL Server、Redis 或真实 HTTP API；extension 方法通过 mock `this` 上下文、`$refs`、HTTP 和消息组件执行。流程图仅 mock jsPlumb 对象以验证项目自身的调用和数据变化，不验证第三方连线库内部实现。本轮只完成前期测试，不修改业务源码，不进行修改后复测。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-24 |
| 当前分支 | `dev` |
| 当前 commit SHA | `68748a1` |
| 测试工程 | `源码/iMES.Vue3` |
| 测试目录 | `源码/iMES.Vue3/tests/unit` |
| 执行方式 | 在 `源码/iMES.Vue3` 执行 `npm run test:unit -- --grep 'components/workflow|extension/production'` |
| 测试框架 | Vue CLI Unit Mocha + Chai 4.3.6 + Vue Test Utils |
| 结果 | **32 个用例：32 通过，0 失败，0 跳过** |
| 运行时 | Node.js 25.1.0；测试入口自动添加 `NODE_OPTIONS=--openssl-legacy-provider` 兼容旧版 Webpack |

测试编译和断言均成功。Browserslist 数据过期提示、Vue 的 `resolveComponent` 警告及 Node 弃用提示不影响本轮测试执行结果。

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 流程图基础规则 | 正向/反向连线判断、连接器 source/target 查询、节点 ID、默认流程、自动布局 | 6/6 通过 |
| 流程图节点 | 节点选中样式、坐标、点击/删除/移动事件、只读节点禁止连线 | 4/4 通过 |
| 节点配置表单 | 审批用户/角色/部门字段切换、编辑副本隔离、保存节点、保存连线标签 | 4/4 通过 |
| 流程编辑器 | 节点移动、连线标签同步、拖入画布时重名规避和 jsPlumb 端点初始化 | 3/3 通过 |
| 销售订单 | 编码进入页面筛选、无编码不请求、列表行选中和明细刷新 | 3/3 通过 |
| 生产计划 | 编码进入页面筛选、表单编号自动生成提示 | 2/2 通过 |
| 生产工单 | 产品选择回填、工序明细初始化、权限/不良品标签、编辑明细标签、重复开始阻断 | 5/5 通过 |
| 装配工单 | 编码筛选、首个未完成工序步骤定位 | 2/2 通过 |
| 报工 | 跨天工时/效率、相同时间保护、新增报工默认字段 | 3/3 通过 |

正式测试文件：

- `源码/iMES.Vue3/tests/unit/workflow.spec.js`
- `源码/iMES.Vue3/tests/unit/production-extension.spec.js`

## 本次发现的问题

本范围 32 个用例全部通过，未新增失败项或需要进入修复阶段的前端缺陷。

## 交接结论

Fitzgerald 已完成流程图与生产领域前期单元测试，共 32 个用例，32 个通过、0 个失败、0 个跳过。流程节点和连线的关键数据规则，以及销售订单、生产计划、工单、装配工单、报工的前端数据加工与状态控制已建立测试基线。本轮未修改业务源码；后续若修改上述规则，应先运行本章节记录的定向命令，再运行完整 `npm run test:unit` 回归。
