import { expect } from 'chai'
import methods from '@/components/basic/ViewGrid/methods'

// 在测试环境中模拟 URL.createObjectURL 和 URL.revokeObjectURL
if (typeof global.URL === 'undefined' || !global.URL.createObjectURL) {
  global.URL = global.URL || {}
  global.URL.createObjectURL = () => 'blob:mock'
  global.URL.revokeObjectURL = () => {}
}

/**
 * 创建 methods.js 所需的模拟 Vue 实例上下文
 * methods 作为 mixin 使用，内部大量引用 this.*
 */
function createMockContext(overrides = {}) {
  const ctx = {
    // ---- 常量 ----
    const: { ADD: 'Add', EDIT: 'Edit', DEL: 'Delete', PAGE: 'Page', EXPORT: 'Export', IMPORT: 'Import', DOWNLOADTEMPLATE: 'DownloadTemplate', AUDIT: 'Audit' },

    // ---- 按钮 ----
    buttons: [],
    boxButtons: [],
    maxBtnLength: 5,

    // ---- 表单 ----
    editFormFields: {},
    searchFormFields: {},
    editFormOptions: [],
    searchFormOptions: [],

    // ---- 表格 ----
    table: { key: 'Id', url: '/Ware_HouseBill', cnName: '测试表' },
    columns: [],
    height: 0,
    tableHeight: 0,

    // ---- 明细 ----
    detail: { columns: [], key: 'Id', table: 'Ware_HouseBill', cnName: '明细表', url: '' },
    detailOptions: { columns: [], buttons: [], delKeys: [], key: 'Id', edit: false, pagination: { sortName: '' }, height: null },
    hasDetail: false,

    // ---- 分页 ----
    pagination: { sort: '', order: 'desc', total: 0, size: 30, sortName: '' },

    // ---- 当前状态 ----
    currentAction: 'Add',
    currentRow: {},
    currentReadonly: false,

    // ---- 字典 ----
    dicKeys: [],
    hasKeyField: [],
    remoteKeys: [],
    numberFields: [],
    keyValueType: { _dinit: false },
    uploadfiled: [],

    // ---- 远程 ----
    remoteColumns: [],

    // ---- 格式 ----
    formatConfig: {},
    colors: ['', 'warning', 'success', 'green', 'info'],

    // ---- HTTP ----
    http: {
      post: () => Promise.resolve({ status: true, message: '操作成功', data: '' }),
      ipAddress: 'http://localhost:9991/'
    },

    // ---- 路由/Store ----
    $store: { getters: { getToken: () => 'test-token' } },
    $route: { path: '/test/Ware_HouseBill', query: {} },

    // ---- UI 组件 ----
    $message: { error: () => {}, success: () => {} },
    $confirm: () => Promise.resolve(),
    $error(msg) { this.$message.error(msg) },
    $success(msg) { this.$message.success(msg) },
    $nextTick: (cb) => { if (typeof cb === 'function') cb() },
    $refs: {
      table: { load: () => {}, getSelected: () => [], remoteColumns: [] },
      form: { validate: (cb) => { if (cb) cb(true) }, reset: () => {} },
      detail: null
    },

    // ---- 权限 ----
    permission: { getButtons: () => null },

    // ---- 扩展 ----
    extend: { buttons: {}, tableAction: [] },

    // ---- 基础工具 ----
    base: {
      convertTree: () => [],
      isUrl: () => false,
      getTreeAllParent: () => [],
      previewImg: () => {},
      dowloadFile: () => {}
    },

    // ---- 查询 ----
    searchBoxShow: false,
    fiexdSearchForm: false,
    singleSearch: { field: '', dataKey: '', title: '', type: '', data: [] },

    // ---- 上传 ----
    upload: { url: '', template: { fileName: '', url: '' }, excel: false },

    // ---- 编辑器 ----
    editor: { uploadImgUrl: '' },

    // ---- 弹出框 ----
    boxOptions: { saveClose: false, height: 0, width: 0 },
    boxModel: false,
    boxInit: false,

    // ---- 审核 ----
    auditParam: { rows: 0, model: false, status: -1, value: -1, reason: '' },

    // ---- 连续添加 ----
    continueAdd: false,
    continueAddName: '继续新建',

    // ---- 工作流 ----
    viewFlow: false,

    // ---- 生命周期钩子 ----
    searchBefore: () => true,
    searchAfter: () => true,
    searchDetailBefore: () => true,
    searchDetailAfter: () => true,
    addBefore: () => true,
    addBeforeAsync: () => Promise.resolve(true),
    addAfter: () => true,
    updateBefore: () => true,
    updateBeforeAsync: () => Promise.resolve(true),
    updateAfter: () => true,
    delBefore: () => true,
    delAfter: () => true,
    resetSearchForm: () => {},
    resetUpdateFormBefore: () => true,
    resetAddFormBefore: () => true,
    resetUpdateFormAfter: () => true,
    resetAddFormAfter: () => true,
    modelOpenBefore: () => true,
    modelOpenBeforeAsync: () => Promise.resolve(true),
    modelOpenAfter: () => {},
    modelOpenProcess: () => {},
    dicInited: () => {},
    exportBefore: () => true,
    auditBefore: () => true,
    auditAfter: () => true,
    importAfter: () => {},
    importDetailAfter: () => {},
    beginEdit: () => true,
    endEditBefore: () => true,
    endEditAfter: () => true,
    rowChange: () => {},
    rowClick: () => {},
    rowDbClick: () => {},
    detailRowChange: () => {},
    detailRowClick: () => {},
    loadTreeChildren: () => {},
    destroyed: () => {},

    // ---- methods.js 自带方法(需要在 ctx 上可用) ----
    resetEditForm: (sourceObj) => {},
    resetDetailTable: (row) => {},
    resetAdd: () => {},
    setContinueAdd: () => {},
    emptyValue: (value) => {
      if (typeof value === 'string' && value.trim() === '') return true
      if (Array.isArray(value) && !value.length) return true
      return value === null || value === undefined || value === ''
    },
    getUrl: (action, ingorPrefix) => {
      return (!ingorPrefix ? '/' : '') + 'api' + (ctx.table ? ctx.table.url : '/test') + action
    },
    loadDetailTableBefore: (param, callBack) => { callBack(true) },
    getRemoteFormDefaultKeyValue: (key) => {},
    refresh: () => {},
    getSearchItem(field) {
      // 模拟原始 getSearchItem：根据 field 在 searchFormOptions 中查找类型
      if (!this.searchFormOptions) return 'text'
      for (let i = 0; i < this.searchFormOptions.length; i++) {
        const item = this.searchFormOptions[i].find(x => x.field === field)
        if (item) return item.type
      }
      return 'text'
    },

    ...overrides
  }
  return ctx
}

// ----------------------------------------------------------------
// 1. 通用 CRUD
// ----------------------------------------------------------------
describe('methods.js — 通用 CRUD', () => {
  it('METH-01 add() 新建操作应初始化弹出框并重置表单', async () => {
    const ctx = createMockContext({
      initBox: methods.initBox,
      resetAdd: methods.resetAdd,
      setContinueAdd: methods.setContinueAdd,
      modelOpenProcess: methods.modelOpenProcess,
      editFormOptions: [
        [{ field: 'IsActive', type: 'switch' }]
      ],
      $refs: {
        detail: null,
        table: { load: () => {}, getSelected: () => [], remoteColumns: [] }
      },
      continueAdd: true
    })
    // bind methods
    const boundAdd = methods.add.bind(ctx)
    ctx.$nextTick = (cb) => { if (typeof cb === 'function') cb() }

    await boundAdd()

    expect(ctx.currentAction).to.equal('Add')
    expect(ctx.currentRow).to.deep.equal({})
    expect(ctx.boxModel).to.be.true
  })

  it('METH-02 edit(rows) 编辑操作应选中行并填充表单', async () => {
    const initBoxCalled = []
    const setEditFormCalled = []
    const ctx = createMockContext({
      initBox: async function () {
        initBoxCalled.push(true)
        this.currentRow = rows[0]
        this.boxModel = true
        return true
      },
      setEditForm: function (row) {
        setEditFormCalled.push(row)
        this.editFormFields[this.table.key] = row[this.table.key]
      },
      setContinueAdd: methods.setContinueAdd,
      modelOpenProcess: () => {},
      $refs: { detail: { reset: () => {} }, table: { load: () => {}, getSelected: () => [], remoteColumns: [] } },
      continueAdd: true
    })
    const boundEdit = methods.edit.bind(ctx)
    const rows = [{ Id: 1, Name: '测试' }]

    await boundEdit(rows)

    expect(ctx.currentAction).to.equal('Edit')
    expect(initBoxCalled.length).to.equal(1)
    expect(setEditFormCalled[0]).to.deep.equal(rows[0])
  })

  it('METH-03 edit(rows) 多选时应返回错误提示', async () => {
    let errorMsg = ''
    const ctx = createMockContext({
      $message: { error: (msg) => { errorMsg = msg } }
    })
    const boundEdit = methods.edit.bind(ctx)
    const rows = [{ Id: 1 }, { Id: 2 }]

    await boundEdit(rows)

    expect(errorMsg).to.include('只能选择一行数据进行编辑')
  })

  it('METH-04 edit(rows) 未选择行时应返回错误提示', async () => {
    let errorMsg = ''
    const ctx = createMockContext({
      $refs: { table: { load: () => {}, getSelected: () => [], remoteColumns: [] } },
      $message: { error: (msg) => { errorMsg = msg } }
    })
    const boundEdit = methods.edit.bind(ctx)

    await boundEdit()

    expect(errorMsg).to.include('请选择要编辑的行')
  })

  it('METH-05 del(rows) 删除操作应弹出确认框并调用删除接口', (done) => {
    let postCalled = false
    let confirmCalled = false
    const ctx = createMockContext({
      $confirm: () => {
        confirmCalled = true
        return Promise.resolve()
      },
      getUrl: (action) => '/api/test/' + action,
      http: {
        post: (url, data) => {
          postCalled = true
          expect(url).to.include('Delete')
          expect(data).to.deep.equal([1, 2])
          return Promise.resolve({ status: true, message: '删除成功' })
        }
      },
      $refs: { table: { load: () => {}, getSelected: () => [] } },
      delAfter: () => true
    })
    const boundDel = methods.del.bind(ctx)
    const rows = [{ Id: 1 }, { Id: 2 }]

    boundDel(rows)

    setTimeout(() => {
      expect(confirmCalled).to.be.true
      expect(postCalled).to.be.true
      done()
    }, 50)
  })

  it('METH-06 del(rows) 未选择行时应返回错误提示', () => {
    let errorMsg = ''
    const ctx = createMockContext({
      $refs: { table: { load: () => {}, getSelected: () => [], remoteColumns: [] } },
      $error: (msg) => { errorMsg = msg }
    })
    const boundDel = methods.del.bind(ctx)

    boundDel()

    expect(errorMsg).to.include('请选择要删除的行')
  })

  it('METH-07 save() 应触发表单验证并调用保存', (done) => {
    let validateCalled = false
    let saveExecuteCalled = false
    const ctx = createMockContext({
      $refs: {
        form: {
          validate: (cb) => {
            validateCalled = true
            cb(true)
          }
        }
      },
      saveExecute: () => {
        saveExecuteCalled = true
        return Promise.resolve()
      }
    })
    const boundSave = methods.save.bind(ctx)

    boundSave()

    setTimeout(() => {
      expect(validateCalled).to.be.true
      expect(saveExecuteCalled).to.be.true
      done()
    })
  })

  it('METH-08 saveExecute() 连续添加应重置表单并保持新增状态', (done) => {
    let refreshCalled = false
    let resetAddCalled = false
    const ctx = createMockContext({
      currentAction: 'Add',
      continueAdd: true,
      editFormFields: { Name: '测试', Code: '001' },
      hasDetail: false,
      detailOptions: { delKeys: [] },
      $refs: {
        form: { validate: () => {} },
        detail: null,
        table: { load: () => { refreshCalled = true } }
      },
      http: {
        post: () => Promise.resolve({ status: true, message: '保存成功', data: '' })
      },
      addAfter: () => true,
      updateAfter: () => true,
      getUrl: (action) => '/api/test/' + action,
      addBefore: () => true,
      addBeforeAsync: () => Promise.resolve(true),
      refresh: () => { refreshCalled = true },
      resetAdd: () => { resetAddCalled = true }
    })
    const boundExecute = methods.saveExecute.bind(ctx)

    boundExecute().then(() => {
      expect(ctx.currentAction).to.equal('Add')
      expect(refreshCalled).to.be.true
      done()
    })
  })
})

// ----------------------------------------------------------------
// 2. 提交前阻断
// ----------------------------------------------------------------
describe('methods.js — 提交前阻断', () => {
  it('METH-09 addBefore() 返回false阻止保存', (done) => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Add',
      hasDetail: false,
      detailOptions: { delKeys: [] },
      editFormFields: { Name: 'test' },
      addBefore: () => false,
      addBeforeAsync: () => Promise.resolve(true),
      $refs: {
        form: { validate: () => {} },
        detail: null
      },
      http: { post: () => { postCalled = true; return Promise.resolve({}) } },
      getUrl: (action) => '/api/test/' + action
    })
    const boundExecute = methods.saveExecute.bind(ctx)

    boundExecute().then(() => {
      expect(postCalled).to.be.false
      done()
    })
  })

  it('METH-10 addBeforeAsync() 返回false阻止保存', (done) => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Add',
      hasDetail: false,
      detailOptions: { delKeys: [] },
      editFormFields: { Name: 'test' },
      addBefore: () => true,
      addBeforeAsync: () => Promise.resolve(false),
      $refs: {
        form: { validate: () => {} },
        detail: null
      },
      http: { post: () => { postCalled = true; return Promise.resolve({}) } },
      getUrl: (action) => '/api/test/' + action
    })
    const boundExecute = methods.saveExecute.bind(ctx)

    boundExecute().then(() => {
      expect(postCalled).to.be.false
      done()
    })
  })

  it('METH-11 updateBefore() 返回false阻止保存', (done) => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Edit',
      hasDetail: false,
      detailOptions: { delKeys: [] },
      editFormFields: { Id: 1, Name: 'test' },
      updateBefore: () => false,
      updateBeforeAsync: () => Promise.resolve(true),
      $refs: {
        form: { validate: () => {} },
        detail: null
      },
      http: { post: () => { postCalled = true; return Promise.resolve({}) } },
      getUrl: (action) => '/api/test/' + action
    })
    const boundExecute = methods.saveExecute.bind(ctx)

    boundExecute().then(() => {
      expect(postCalled).to.be.false
      done()
    })
  })

  it('METH-12 updateBeforeAsync() 返回false阻止保存', (done) => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Edit',
      hasDetail: false,
      detailOptions: { delKeys: [] },
      editFormFields: { Id: 1, Name: 'test' },
      updateBefore: () => true,
      updateBeforeAsync: () => Promise.resolve(false),
      $refs: {
        form: { validate: () => {} },
        detail: null
      },
      http: { post: () => { postCalled = true; return Promise.resolve({}) } },
      getUrl: (action) => '/api/test/' + action
    })
    const boundExecute = methods.saveExecute.bind(ctx)

    boundExecute().then(() => {
      expect(postCalled).to.be.false
      done()
    })
  })
})

// ----------------------------------------------------------------
// 3. 查询参数
// ----------------------------------------------------------------
describe('methods.js — 查询参数', () => {
  it('METH-13 getSearchParameters() 普通查询应构建wheres数组', () => {
    const ctx = createMockContext({
      searchFormFields: { Name: '测试', Code: '001' },
      searchFormOptions: [
        [{ field: 'Name', type: 'text' }],
        [{ field: 'Code', type: 'text' }]
      ],
      searchBoxShow: true,
      fiexdSearchForm: true
    })
    const bound = methods.getSearchParameters.bind(ctx)
    const result = bound()

    expect(result.wheres).to.be.an('array').with.length(2)
    expect(result.wheres[0]).to.deep.include({ name: 'Name', value: '测试' })
    expect(result.wheres[1]).to.deep.include({ name: 'Code', value: '001' })
  })

  it('METH-14 getSearchParameters() 级联查询应取最后一个值', () => {
    const ctx = createMockContext({
      searchFormFields: { CategoryId: [1, 2, 5] },
      searchFormOptions: [
        [{ field: 'CategoryId', type: 'cascader' }]
      ],
      getSearchItem: function (field) {
        return field === 'CategoryId' ? 'cascader' : 'text'
      },
      searchBoxShow: true,
      fiexdSearchForm: true
    })
    const bound = methods.getSearchParameters.bind(ctx)
    const result = bound()

    expect(result.wheres[0].value).to.equal('5')
  })

  it('METH-15 getSearchParameters() 区间查询应生成thanorequal/lessorequal', () => {
    const ctx = createMockContext({
      searchFormFields: { CreateDate: ['2026-01-01', '2026-12-31'] },
      searchFormOptions: [
        [{ field: 'CreateDate', type: 'date' }]
      ],
      getSearchItem: function (field) {
        return field === 'CreateDate' ? 'date' : 'text'
      },
      searchBoxShow: true,
      fiexdSearchForm: true
    })
    const bound = methods.getSearchParameters.bind(ctx)
    const result = bound()

    expect(result.wheres).to.have.length(2)
    expect(result.wheres[0].displayType).to.equal('thanorequal')
    expect(result.wheres[1].displayType).to.equal('lessorequal')
  })

  it('METH-16 getSearchParameters() 空值应被过滤', () => {
    const ctx = createMockContext({
      searchFormFields: { Name: '有效', Code: '', Status: null, Count: undefined, Arr: [] },
      searchFormOptions: [
        [{ field: 'Name', type: 'text' }],
        [{ field: 'Code', type: 'text' }],
        [{ field: 'Status', type: 'text' }],
        [{ field: 'Count', type: 'text' }],
        [{ field: 'Arr', type: 'text' }]
      ],
      searchBoxShow: true,
      fiexdSearchForm: true
    })
    const bound = methods.getSearchParameters.bind(ctx)
    const result = bound()

    expect(result.wheres).to.have.length(1)
    expect(result.wheres[0].name).to.equal('Name')
  })

  it('METH-16b getSearchParameters() 空字符串trim过滤', () => {
    const ctx = createMockContext({
      searchFormFields: { Name: '   ' },
      searchFormOptions: [
        [{ field: 'Name', type: 'text' }]
      ],
      searchBoxShow: true,
      fiexdSearchForm: true
    })
    const bound = methods.getSearchParameters.bind(ctx)
    const result = bound()

    expect(result.wheres).to.have.length(0)
  })
})

// ----------------------------------------------------------------
// 4. 表单重置
// ----------------------------------------------------------------
describe('methods.js — 表单重置', () => {
  it('METH-17 resetEdit() 编辑重置应保留主键', () => {
    let resetFormCalled = false
    const ctx = createMockContext({
      currentAction: 'Edit',
      editFormFields: { Id: 5, Name: '测试', Code: '001' },
      table: { key: 'Id', url: '/test', cnName: '测试表' },
      hasDetail: false,
      $refs: { detail: null },
      resetUpdateFormBefore: () => true,
      resetUpdateFormAfter: () => true,
      resetEditForm: function (obj) {
        resetFormCalled = true
        expect(obj.Id).to.equal(5)
      }
    })
    const bound = methods.resetEdit.bind(ctx)

    bound()

    expect(resetFormCalled).to.be.true
  })

  it('METH-18 resetSearch() 查询重置应清空所有字段', () => {
    let resetCalled = false
    const ctx = createMockContext({
      resetSearchForm: () => { resetCalled = true },
      resetSearchFormAfter: () => {}
    })
    const bound = methods.resetSearch.bind(ctx)

    bound()

    expect(resetCalled).to.be.true
  })

  it('METH-19 resetForm() number类型字段应转换', () => {
    const ctx = createMockContext({
      numberFields: ['Qty'],
      keyValueType: { _dinit: true },
      editFormFields: { Qty: '', Name: 'test' }
    })
    const bound = methods.resetForm.bind(ctx)
    const sourceObj = { Qty: '5', Name: 'test' }

    bound('form', sourceObj)

    expect(ctx.editFormFields.Qty).to.equal(5)
    expect(ctx.editFormFields.Name).to.equal('test')
  })
})

// ----------------------------------------------------------------
// 5. 字典绑定与初始化
// ----------------------------------------------------------------
describe('methods.js — 字典绑定', () => {
  it('METH-20 initFormOptions() 应识别img/file字段并设置upload url', () => {
    const ctx = createMockContext({
      editFormFields: {},
      searchFormFields: {},
      numberFields: [],
      uploadfiled: [],
      remoteKeys: [],
      dicKeys: [],
      hasKeyField: [],
      table: { url: '/Base_Product', key: 'Id', cnName: '产品' }
    })

    const formOptions = [
      [{ field: 'Image', type: 'img', dataKey: 'imgDic' }],
      [{ field: 'Name', type: 'text' }]
    ]
    const keys = []

    methods.initFormOptions.call(ctx, formOptions, keys, ctx.editFormFields, true)

    expect(ctx.uploadfiled).to.include('Image')
    expect(formOptions[0][0].url).to.include('Upload')
  })

  it('METH-21 bindOptions() 应正确绑定字典数据源', () => {
    const ctx = createMockContext({
      dicKeys: [
        { dicNo: 'Status', data: [], type: 'string' }
      ],
      singleSearch: null,
      columns: []
    })

    const dic = [{ dicNo: 'Status', data: [{ key: '1', value: '启用' }, { key: '0', value: '禁用' }] }]

    methods.bindOptions.call(ctx, dic)

    expect(ctx.dicKeys[0].data).to.have.length(2)
    expect(ctx.dicKeys[0].data[0].value).to.equal('启用')
  })

  it('METH-22 bindOptions() 级联数据源应正确转换树形', () => {
    const ctx = createMockContext({
      dicKeys: [
        { dicNo: 'Category', data: [], type: 'cascader', orginData: [] }
      ],
      searchFormOptions: [],
      editFormOptions: [],
      columns: [],
      singleSearch: null,
      base: {
        convertTree: (data, callback) => {
          data.forEach(item => {
            item.label = item.value
            item.value = item.key
          })
          return data
        },
        isUrl: () => false
      }
    })

    const dic = [{ dicNo: 'Category', data: [{ key: '1', value: '分类1' }, { key: '2', value: '分类2' }] }]

    methods.bindOptions.call(ctx, dic)

    expect(ctx.dicKeys[0].data).to.have.length(2)
    expect(ctx.dicKeys[0].orginData).to.have.length(2)
  })
})

// ----------------------------------------------------------------
// 6. 导出功能
// ----------------------------------------------------------------
describe('methods.js — 导出', () => {
  it('METH-23 export() 主表导出应构建正确参数', () => {
    let postUrl = ''
    let postParam = null
    const ctx = createMockContext({
      currentAction: 'Edit',
      pagination: { order: 'desc', sort: '' },
      getUrl: (action) => '/api/test/' + action,
      getSearchParameters: () => ({ wheres: [{ name: 'Name', value: 'test' }] }),
      getFileName: () => '测试表.xlsx',
      http: {
        post: (url, param) => {
          postUrl = url
          postParam = param
          return Promise.resolve(new Blob())
        }
      },
      exportBefore: () => true
    })
    const bound = methods.export.bind(ctx)

    bound(false)

    expect(postUrl).to.include('Export')
    expect(postParam.wheres).to.be.a('string')
  })

  it('METH-24 detailExport() 新建状态应禁止导出', () => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Add',
      getUrl: (action) => '/api/test/' + action,
      getSearchParameters: () => ({ wheres: [] }),
      http: { post: () => { postCalled = true; return Promise.resolve(new Blob()) } }
    })
    const bound = methods.export.bind(ctx)

    bound(true)

    expect(postCalled).to.be.false
  })

  it('METH-25 exportBefore() 返回false阻止导出', () => {
    let postCalled = false
    const ctx = createMockContext({
      currentAction: 'Edit',
      pagination: { order: 'desc' },
      getUrl: (action) => '/api/test/' + action,
      getSearchParameters: () => ({ wheres: [] }),
      getFileName: () => 'test.xlsx',
      http: { post: () => { postCalled = true; return Promise.resolve(new Blob()) } },
      exportBefore: () => false
    })
    const bound = methods.export.bind(ctx)

    bound(false)

    expect(postCalled).to.be.false
  })
})

// ----------------------------------------------------------------
// 7. 辅助方法
// ----------------------------------------------------------------
describe('methods.js — 辅助方法', () => {
  it('emptyValue() 应正确识别空值', () => {
    expect(methods.emptyValue('')).to.be.true
    expect(methods.emptyValue('   ')).to.be.true
    expect(methods.emptyValue(null)).to.be.true
    expect(methods.emptyValue(undefined)).to.be.true
    expect(methods.emptyValue([])).to.be.true
    expect(methods.emptyValue(0)).to.be.false
    expect(methods.emptyValue('test')).to.be.false
    expect(methods.emptyValue([1])).to.be.false
  })

  it('getUrl() 应拼接正确路径', () => {
    const ctx = createMockContext({ table: { url: '/Ware_HouseBill', key: 'Id', cnName: 'test' } })
    const bound = methods.getUrl.bind(ctx)
    expect(bound('Page')).to.equal('/api/Ware_HouseBillPage')
    expect(bound('Add', true)).to.equal('api/Ware_HouseBillAdd')
  })
})

// ----------------------------------------------------------------
// 8. WH-BUG-14 download this 绑定
// ----------------------------------------------------------------
describe('methods.js — download this 绑定', () => {
  it('WH-BUG-14 download() onload回调中this指向XHR实例而非Vue组件,$error调用失败', () => {
    const originalXHR = global.XMLHttpRequest

    // 模拟 XHR，捕获 onload 回调
    let capturedOnload = null
    function MockXHR() {
      this.open = () => {}
      this.setRequestHeader = () => {}
      this.send = () => {}
      this.responseType = ''
      this.response = new Blob()
      this.status = 500  // 模拟下载失败状态码
    }
    Object.defineProperty(MockXHR.prototype, 'onload', {
      set(fn) { capturedOnload = fn },
      get() { return capturedOnload },
      configurable: true
    })
    global.XMLHttpRequest = MockXHR

    const ctx = createMockContext({
      $refs: { export: { click: () => {}, href: '' } }
      // ctx 上有 $error 方法（在 createMockContext 中定义）
    })
    const bound = methods.download.bind(ctx)
    bound('http://test.com/download', 'test.xlsx')

    // 当 onload 被浏览器调用时，this 指向 XHR 实例
    // XHR 实例没有 $error 方法，抛出 TypeError（正确行为应调用 ctx.$error）
    expect(() => {
      capturedOnload()
    }).to.throw(TypeError)

    global.XMLHttpRequest = originalXHR
  })
})

// ----------------------------------------------------------------
// 9. hasOwnProperty 安全
// ----------------------------------------------------------------
describe('methods.js — hasOwnProperty 安全', () => {
  it('initFormOptions() cascader字段覆写hasOwnProperty时不应抛异常', () => {
    const ctx = createMockContext({
      editFormFields: {},
      searchFormFields: {},
      numberFields: [],
      uploadfiled: [],
      remoteKeys: [],
      dicKeys: [],
      hasKeyField: [],
      table: { url: '/Base_Product', key: 'Id', cnName: '产品' }
    })

    // 创建一个覆写了 hasOwnProperty 的字段对象
    const formOptions = [
      [{ field: 'Status', type: 'cascader', dataKey: 'StatusDic', hasOwnProperty: 'hijacked' }]
    ]
    const keys = []

    // 不应抛出异常
    expect(() => {
      methods.initFormOptions.call(ctx, formOptions, keys, ctx.editFormFields, true)
    }).to.not.throw()
  })

  it('initFormOptions() cascader数据源元素覆写hasOwnProperty时不应抛异常', () => {
    const ctx = createMockContext({
      editFormFields: {},
      searchFormFields: {},
      numberFields: [],
      uploadfiled: [],
      remoteKeys: [],
      dicKeys: [],
      hasKeyField: [],
      table: { url: '/Base_Product', key: 'Id', cnName: '产品' }
    })

    // 模拟后台返回的字典数据，其中 data 数组元素覆写了 hasOwnProperty
    const keys = ['StatusDic']
    ctx.dicKeys = [
      { dicNo: 'StatusDic', data: [], type: 'cascader' }
    ]

    // 构造包含覆写 hasOwnProperty 的数据源的 formOptions
    const formOptions = [
      [{ field: 'Status', type: 'cascader', dataKey: 'StatusDic', data: [
        { key: '1', value: '启用', hasOwnProperty: 'x' },
        { key: '0', value: '禁用', hasOwnProperty: 'y' }
      ]}]
    ]

    // initFormOptions 中可能会对 data 数组元素调用 hasOwnProperty
    // 使用 Object.prototype.hasOwnProperty.call 则不会抛异常
    expect(() => {
      methods.initFormOptions.call(ctx, formOptions, keys, ctx.editFormFields, true)
    }).to.not.throw()
  })

  it('resetForm() sourceObj覆写hasOwnProperty时不应抛异常', () => {
    const ctx = createMockContext({
      numberFields: [],
      keyValueType: { _dinit: true },
      editFormFields: { Name: 'old' }
    })

    // sourceObj.hasOwnProperty(key) 在 hasOwnProperty 被覆写时抛异常
    const sourceObj = { Name: 'new', hasOwnProperty: 'hijacked' }

    expect(() => {
      methods.resetForm.call(ctx, 'form', sourceObj)
    }).to.not.throw()
  })

  it('bindOptions() 字典数据元素覆写hasOwnProperty时不应抛异常', () => {
    const ctx = createMockContext({
      dicKeys: [
        { dicNo: 'Status', data: [], type: 'string' }
      ],
      singleSearch: null,
      columns: []
    })

    // 字典返回数据中 data 元素覆写 hasOwnProperty
    const dic = [{
      dicNo: 'Status',
      data: [
        { key: '1', value: '启用', hasOwnProperty: 'x' },
        { key: '0', value: '禁用', hasOwnProperty: 'y' }
      ]
    }]

    // bindOptions 中 d.data[0].hasOwnProperty('key') 在覆写时抛异常
    expect(() => {
      methods.bindOptions.call(ctx, dic)
    }).to.not.throw()
  })
})
