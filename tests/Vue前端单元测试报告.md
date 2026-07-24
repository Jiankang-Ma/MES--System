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

---

## 上传、表单设计器及业务扩展测试：Pizzicato（cjy）

## 本次范围

测试范围限定为 `源码/iMES.Vue3` 中组长指定的上传、表单设计器与业务扩展逻辑。测试均为 **unit tests**，通过 Mock 隔离 HTTP、Store、浏览器下载、窗口打开和组件引用，不连接 SQL Server、Redis 或真实 HTTP API，也不依赖已部署的前后端服务。

| 模块 | 源码路径 | 测试重点 |
| --- | --- | --- |
| 通用上传 | `src/components/basic/MesUpload.vue` | 文件名、格式/数量/大小校验、单选/多选、自动上传、上传钩子、服务端路径、下载、移除钩子 |
| Excel 导入 | `src/components/basic/UploadExcel.vue` | Excel 类型校验、导入前钩子、成功/失败/异常状态、模板下载、鉴权请求、JSON 错误响应 |
| 表单设计器 | `src/components/basic/MesFormDraggable/MesFormDraggable.vue` | 栅格宽度、行分组、上传/字典/编辑器配置转换、表格配置、复制/删除/清空、保存事件 |
| 仓储扩展 | `src/extension/warehouse` | 入库/出库单打印选择规则、产品选择、行联动、自动编号提示、库存与收发明细固定列 |
| 基础资料扩展 | `src/extension/custom` | 用户/产品/工序/绩效/不良品扩展表映射、编辑只读规则、编号规则预览 |
| 系统扩展 | `src/extension/system` | 字典 SQL 的 key/value 契约、角色父级配置和缓存刷新、表单收集列与查询条件、数组值展开 |
| 报表扩展 | `src/extension/report` | 日期格式、固定查询布局、序号、表格高度以及不良品、产量、工资字段合计 |

本轮只建立测试基线并记录失败现象，不修改上述业务源码。失败用例保持真实失败，没有改成跳过或反向断言。

## 执行信息

| 项目 | 结果 |
| --- | --- |
| 执行日期 | 2026-07-24 |
| 当前分支 | `tests/Vue-cjy` |
| 基线 commit SHA | `29389e3df1d6c58dba9433609352ff8306667796` |
| 测试工程 | `源码/iMES.Vue3` |
| 测试目录 | `源码/iMES.Vue3/tests/unit` |
| 构建命令 | `docker build --progress=plain -t imes-vue-cjy-tests:local -f "源码/iMES.Vue3/tests/unit/Dockerfile" "源码/iMES.Vue3"` |
| 执行命令 | `docker run --rm imes-vue-cjy-tests:local` |
| 测试框架 | Vue CLI Unit Mocha 4.5.18 + Mocha 6.2.3 + Chai 4.3.6 |
| 运行时 | Docker `node:14-bullseye` |
| 结果 | **99 个用例：94 通过，5 失败，0 跳过** |

Webpack 编译成功。Browserslist 数据过期提示不影响本次测试结果。仓库原有 `tests/unit/example.spec.js` 引用了不存在的 `@/components/HelloWorld.vue`，会阻断所有正式用例编译，已删除该无效 Vue CLI 示例文件。

## 已通过的测试点

| 模块 | 测试点 | 结果 |
| --- | --- | --- |
| 基础资料扩展 | 五类扩展表路由映射、表名只读、编辑标识锁定、编号片段重置与预览 | 9/9 通过 |
| 表单设计器 | 全宽栅格、上传/编辑器/字典配置转换、普通组件过滤、常规同行分组、深拷贝、删除/清空、排序、表格配置和保存事件 | 12/14 通过 |
| 通用上传 | 文件名、描述、格式/数量/大小校验、重名处理、单选替换、变更/上传钩子、自动上传、下载、成功/业务失败/异常状态 | 24/26 通过 |
| 报表扩展 | 不良品、产量、工资、员工绩效和生产报表布局、日期及合计配置、查询/保存透传契约 | 11/11 通过 |
| 系统扩展 | 字典配置及 SQL 校验、角色父级和缓存、表单收集列、导出/查询条件与动态数据展开 | 13/13 通过 |
| Excel 导入 | 四种扩展名、选择拦截、配置校验、导入前钩子、成功/失败/异常状态、二进制模板下载 | 14/15 通过 |
| 仓储扩展 | 入库/出库打印规则、产品选择、查询/点击联动、编号提示、库存和收发明细固定列 | 11/11 通过 |

正式测试文件：

- `源码/iMES.Vue3/tests/unit/MesUpload.spec.js`
- `源码/iMES.Vue3/tests/unit/UploadExcel.spec.js`
- `源码/iMES.Vue3/tests/unit/MesFormDraggable.spec.js`
- `源码/iMES.Vue3/tests/unit/WarehouseExtensions.spec.js`
- `源码/iMES.Vue3/tests/unit/CustomExtensions.spec.js`
- `源码/iMES.Vue3/tests/unit/SystemExtensions.spec.js`
- `源码/iMES.Vue3/tests/unit/ReportExtensions.spec.js`
- `源码/iMES.Vue3/tests/unit/helpers.js`
- `源码/iMES.Vue3/tests/unit/Dockerfile`

## 本次发现的问题

| 编号 | 复现场景 | 修改 | 复测 |
| --- | --- | --- | --- |
| FE-FORM-01 | `MesFormDraggable.getFormOptions()` 处理 `width: 50` 的组件时，使用未赋值的 `_option.width` 计算 `colSize`，实际得到 `NaN`，预期为 6 列 |  |  |
| FE-FORM-02 | `currentComponents` 为“50% 文本框 → table → 50% 日期”时，`filterCurrentComponents()` 的长度与 `getLineFormOptions()` 读取的原数组下标不一致，日期字段未进入生成的表单行 |  |  |
| FE-UPLOAD-01 | `MesUpload.removeBefore()` 返回 `false` 时，本地文件已在调用钩子前执行 `splice`，钩子无法阻止删除 |  |  |
| FE-UPLOAD-02 | `MesUpload.getImgSrc()` 处理以 `/` 开头的服务端路径时，直接把传入对象的 `file.path` 从 `/Upload/a.png` 改为 `Upload/a.png`；渲染图片地址产生了额外数据副作用 |  |  |
| FE-EXCEL-01 | `UploadExcel.dowloadTemplate()` 收到 `application/json` 错误响应时调用 `$_vue.message.error()`；`message` 实际为字符串，抛出 `TypeError`，无法向用户展示“未找到下载文件” |  |  |

## 交接结论

组长指定的上传导入、表单设计器、仓储、基础资料、系统和报表业务规则单元测试已经完成，共 99 个用例，94 个通过、5 个失败、0 个跳过。五条失败均可由现有源码稳定复现，已保留失败测试并记录最小复现场景。本轮只新增测试基建和报告、删除无效的默认示例测试，未修改任何业务源码；“修改”和“复测”两列留空，等待组长确认后再进入修复阶段。
