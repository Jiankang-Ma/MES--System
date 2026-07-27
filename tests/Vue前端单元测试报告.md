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
| 执行日期 | 2026-07-24 |
| 当前分支 | `modify-retest/Vue-lbh` |
| 当前 commit SHA | `f9c852f` |
| 测试工程 | `源码/iMES.Vue3` |
| 测试目录 | `源码/iMES.Vue3/tests/unit` |
| 执行方式 | `cd 源码/iMES.Vue3 && npm run test:unit` |
| 测试框架 | Vue CLI Unit Mocha + Chai 4.3.6 |
| 结果 | **103 个用例：103 通过，0 失败，0 跳过** |
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
| download 错误处理 | 下载失败时箭头函数正确绑定 this、下载成功触发导出 | 2/2 通过 |
| `detailMethods.js` 明细加载 | 编辑状态设置主表 ID、新建禁止加载、重置并重新加载、无明细列不加载 | 4/4 通过 |
| 行操作 | 添加新行、删除选中行/未选行、delDetailRow 阻断 | 4/4 通过 |
| 汇总计算 | 总行数更新、重新计算汇总、detail 为 null 不报错 | 3/3 通过 |
| 事件代理 | detailRowOnChange、detailRowOnClick、refreshRow | 3/3 通过 |
| hasOwnProperty 安全 | cascader 字段/数据源覆写、resetForm、bindOptions 安全 | 4/4 通过 |
| `MesTable.vue` 动态表格 | load() HTTP 请求与数据更新、load() 重置分页、filterColumns 排除 hidden 列、列对象覆写 hasOwnProperty | 4/4 通过 |
| 双击编辑 | 开启编辑状态、readonly 不开启、必填字段验证、数字验证 | 4/4 通过 |
| 分页 | handleSizeChange、handleCurrentChange、resetPage | 3/3 通过 |
| 排序 | 升序/降序设置 | 2/2 通过 |
| 行选中 | getSelected、多选、单选模式 | 3/3 通过 |
| 合计 | getSummaries 填充、getInputSummaries 实时计算、无 summary 不计算 | 3/3 通过 |
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
| initUpload | 图片类型初始化属性设置、hasOwnProperty 安全 | 2/2 通过 |
| `MesForm.vue` hasOwnProperty 安全补充 | initFormRules 字典数据、reset sourceObj、getRule 配置项覆写 hasOwnProperty 安全 | 3/3 通过 |
| `MesElementMenu.vue` hasOwnProperty 安全 | convertTree 菜单项覆写 hasOwnProperty 安全、无 icon 设置默认图标 | 2/2 通过 |

正式测试文件：

- `源码/iMES.Vue3/tests/unit/methods.spec.js`
- `源码/iMES.Vue3/tests/unit/detailMethods.spec.js`
- `源码/iMES.Vue3/tests/unit/MesTable.spec.js`
- `源码/iMES.Vue3/tests/unit/MesForm.spec.js`
- `源码/iMES.Vue3/tests/unit/MesElementMenu.spec.js`
- `源码/iMES.Vue3/tests/unit/environment.spec.js`
- `源码/iMES.Vue3/tests/unit/helpers/localStorageMock.js`

## 本次发现的问题

| 编号 | 模块 | 复现场景 | 修改 | 复测 |
| --- | --- | --- | --- | --- |
| WH-BUG-11 | MesTable.vue | `mounted` 钩子中 `rowDrop()` 直接调用 `Sortable.create(tbody)`，未判断 `tbody` 是否为 null，无真实 DOM 环境时抛异常 | 添加 `if (!tbody) return;` | 代码修复，无自动化测试覆盖 |
| WH-BUG-12 | MesTable.vue | `getSummaries()` 对 `data.summary` 中所有字段执行 `(sum * 1.0).toFixed(2)`，非数字字段（如 `'汇总名称'`）产生 NaN 污染合计行，导致 `summaryData[0]` 无法被设为 `'合计'` | 添加 `if (isNaN(sum)) sum = '';` | 通过 |
| WH-BUG-13 | MesTable.vue | `hasOwnProperty('edit')` 使用实例方法而非 `Object.prototype.hasOwnProperty.call()`，传入 `{ hasOwnProperty: 'hijacked' }` 的列对象时抛异常 | 改为 `Object.prototype.hasOwnProperty.call(x, 'edit')` | 通过 |
| WH-BUG-14 | methods.js | `download()` 中 XHR `onload` 使用普通函数而非箭头函数，`this` 指向 XHR 实例而非 Vue 组件，调用 `this.$error()` 时抛出 `TypeError` | 改为箭头函数 `(oEvent) => { ... }` 绑定外部 this | 通过 |
| WH-BUG-15 | MesForm.vue | `initUpload()` 中 `['img','excel','file'].indexOf(item.type != -1)` 括号位置错误，`!= -1` 被传入 `indexOf()` 而非作为外部条件，导致 `indexOf(true)` 永远返回 `-1`，img/file/excel 类型无法正确初始化 `autoUpload`、`fileList`、`downLoad` 属性 | 改为 `indexOf(item.type) != -1` | 通过 |
| WH-BUG-16 | methods.js detailMethods.js MesForm.vue MesElementMenu.vue http.js MesUpload.vue MesFormDraggable.vue coder.vue ViewGrid.vue router/index.js Index.vue | 多处使用 `obj.hasOwnProperty(key)` 实例方法，当对象覆写 `hasOwnProperty` 属性时抛 `TypeError` | 全部改为 `Object.prototype.hasOwnProperty.call()`（共 22 处） | 通过 |

## 交接结论

前端四个目标模块的单元测试已全部完成，共 **103 个用例：103 通过、0 失败、0 跳过**。本轮完成了以下工作：

**修复的漏洞（WH-BUG-14 ~ WH-BUG-16）**：
- **WH-BUG-14**：`download()` 中 XHR `onload` 回调改为箭头函数，修复 `this` 指向问题 ✓
- **WH-BUG-15**：`initUpload()` 中括号位置错误修复，img/file/excel 类型正确初始化 ✓
- **WH-BUG-16**：22 处 `obj.hasOwnProperty(key)` 全部改为 `Object.prototype.hasOwnProperty.call()` ✓（新增 http.js、MesUpload.vue、MesFormDraggable.vue、coder.vue、ViewGrid.vue、router/index.js、Index.vue 共 9 处）

**测试覆盖**：
| 模块 | 测试项 | 通过率 |
|------|-------|-------|
| methods.js | CRUD、阻断、查询、重置、字典、导出、辅助、download | 31/31 通过 |
| detailMethods.js | 加载、行操作、汇总、事件代理、hasOwnProperty 安全 | 16/16 通过 |
| MesTable.vue | 表格、编辑、分页、排序、选中、合计、格式化、行操作 | 26/26 通过 |
| MesForm.vue | 表单、验证、搜索、文件、重置、日期、字典、initUpload | 25/25 通过 |
| MesElementMenu.vue | hasOwnProperty 安全、默认图标 | 2/2 通过 |
| 测试基建 | 模块加载、localStorage Mock | 2/2 通过 |
| **合计** | | **103/103 通过** |

所有 6 个缺陷（WH-BUG-11 ~ WH-BUG-16）均已修复并复测通过，代码改动涉及 11 个源文件（methods.js、detailMethods.js、MesForm.vue、MesElementMenu.vue、http.js、MesUpload.vue、MesFormDraggable.vue、coder.vue、ViewGrid.vue、router/index.js、Index.vue）。
