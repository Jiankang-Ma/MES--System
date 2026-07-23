# Vue前端单元测试报告

## iMES.Vue3 单元测试：前端公共工具与用户列缓存

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
