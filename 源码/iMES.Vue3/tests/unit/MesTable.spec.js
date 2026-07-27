import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import MesTable from '@/components/basic/MesTable.vue'
import { installLocalStorageMock } from './helpers/localStorageMock'

// 禁用 rowDrop（Sortable 拖拽），因为 jsdom 环境下无真实 DOM 元素
MesTable.methods.rowDrop = function () {}

/**
 * MesTable.vue 测试
 *
 * 使用 shallowMount 并 Stub 所有 Element Plus 组件，
 * 通过插件注入 http 等全局属性。
 */

// 所有 MesTable 模板中用到的 Element Plus 组件
const elementPlusStubs = {
  'el-table': {
    template: '<div><slot/></div>',
    methods: {
      toggleRowSelection() {},
      doLayout() {}
    }
  },
  'el-table-column': true,
  'el-pagination': true,
  'el-date-picker': true,
  'el-switch': true,
  'el-select': true,
  'el-option': true,
  'el-input': true,
  'el-tag': true,
  'el-button': true,
  'el-popover': true,
  'el-checkbox': true,
  'el-radio': true
}

function createColumns() {
  return [
    { field: 'Name', title: '名称', width: 150 },
    { field: 'Code', title: '编码', width: 120 },
    { field: 'Status', title: '状态', width: 100, bind: { key: 'Status', data: [] } },
    { field: 'Qty', title: '数量', width: 100, edit: { type: 'int' } }
  ]
}

function createPagination() {
  return { total: 100, size: 30, sortName: 'Name' }
}

function createMountOptions(httpMock) {
  const http = httpMock || {
    post: (url) => {
      if (url === '/api/Sys_Dictionary/GetVueDictionary') {
        return Promise.resolve([])
      }
      return Promise.resolve({ rows: [], total: 0, summary: null })
    }
  }
  return {
    global: {
      plugins: [{
        install(app) {
          app.config.globalProperties.http = http
          app.config.globalProperties.$message = { error: () => {}, success: () => {} }
          app.config.globalProperties.base = { convertTree: () => [], isUrl: () => false }
        }
      }],
      stubs: elementPlusStubs
    }
  }
}

// ----------------------------------------------------------------
// 1. 动态表格
// ----------------------------------------------------------------
describe('MesTable.vue — 动态表格', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-01 load() 应发起HTTP请求并更新rowData', (done) => {
    let callCount = 0
    const httpMock = {
      post: (url) => {
        callCount++
        if (callCount === 1) {
          // created 钩子中字典数据源加载
          return Promise.resolve([])
        }
        expect(url).to.equal('/api/test/page')
        return Promise.resolve({
          rows: [{ Name: '测试1', Code: '001' }, { Name: '测试2', Code: '002' }],
          total: 2,
          summary: null
        })
      }
    }
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions(httpMock)
    })

    wrapper.vm.load()

    setTimeout(() => {
      expect(wrapper.vm.rowData).to.have.length(2)
      expect(wrapper.vm.paginations.total).to.equal(2)
      done()
    }, 50)
  })

  it('MTBL-02 load(query, true) 应重置分页', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    wrapper.vm.paginations.page = 5
    wrapper.vm.load({ wheres: [] }, true)

    expect(wrapper.vm.paginations.page).to.equal(1)
  })

  it('MTBL-03 filterColumns 应排除hidden列', () => {
    const columns = [
      { field: 'Name', title: '名称' },
      { field: 'Code', title: '编码', hidden: true },
      { field: 'Status', title: '状态' }
    ]
    const wrapper = shallowMount(MesTable, {
      props: { columns, url: '/api/test', pagination: createPagination(), defaultLoadPage: false },
      ...createMountOptions()
    })

    expect(wrapper.vm.filterColumns).to.have.length(2)
    expect(wrapper.vm.filterColumns[0].field).to.equal('Name')
    expect(wrapper.vm.filterColumns[1].field).to.equal('Status')
  })

  it('WH-BUG-13 列对象覆写hasOwnProperty时仍能正确识别可编辑列', () => {
    const columns = [
      { field: 'Name', title: '名称' },
      { field: 'Code', title: '编码', edit: { type: 'text' }, hasOwnProperty: 'hijacked' }
    ]
    const wrapper = shallowMount(MesTable, {
      props: { columns, url: '/api/test', pagination: createPagination(), defaultLoadPage: false },
      ...createMountOptions()
    })
    expect(wrapper.vm.enableEdit).to.be.true
  })
})

// ----------------------------------------------------------------
// 2. 双击编辑
// ----------------------------------------------------------------
describe('MesTable.vue — 双击编辑', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-04 rowBeginEdit() 应开启编辑状态', () => {
    const columns = createColumns()
    columns[0].edit = { type: 'text' }
    const wrapper = shallowMount(MesTable, {
      props: {
        columns,
        url: '/api/test',
        index: true,
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    const row = { Name: 'test', elementIndex: 0 }
    const column = { field: 'Name', edit: { type: 'text' }, property: 'Name' }

    wrapper.vm.rowBeginEdit(row, column)

    expect(wrapper.vm.edit.rowIndex).to.equal(0)
  })

  it('MTBL-05 rowBeginEdit() readonly字段不开启编辑', () => {
    const columns = createColumns()
    columns[0].edit = { type: 'text' }
    columns[0].readonly = true
    const wrapper = shallowMount(MesTable, {
      props: {
        columns,
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    const row = { Name: 'test', elementIndex: 0 }
    const column = { field: 'Name', edit: { type: 'text' }, property: 'Name' }

    wrapper.vm.rowBeginEdit(row, column)

    expect(wrapper.vm.edit.rowIndex).to.equal(-1)
  })

  it('MTBL-07 必填字段为空时验证失败', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    wrapper.vm.rule = {
      phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      decimal: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
      number: /(^[\-0-9][0-9]*([0-9]+)?)$/
    }

    const option = { field: 'Name', title: '名称', require: true }
    const row = { Name: '' }
    expect(wrapper.vm.validateColum(option, row)).to.be.false
  })

  it('MTBL-08 数字验证', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    wrapper.vm.rule = {
      phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      decimal: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
      number: /(^[\-0-9][0-9]*([0-9]+)?)$/
    }

    const decimalOption = { field: 'Qty', title: '数量', edit: { type: 'decimal' } }
    expect(wrapper.vm.validateColum(decimalOption, { Qty: '12.5' })).to.be.true
    expect(wrapper.vm.validateColum(decimalOption, { Qty: 'abc' })).to.be.false
  })
})

// ----------------------------------------------------------------
// 3. 分页
// ----------------------------------------------------------------
describe('MesTable.vue — 分页', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-09 handleSizeChange() 应更新每页条数', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    wrapper.vm.handleSizeChange(60)
    expect(wrapper.vm.paginations.size).to.equal(60)
    expect(wrapper.vm.paginations.rows).to.equal(60)
  })

  it('MTBL-10 handleCurrentChange() 应更新页码', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    wrapper.vm.handleCurrentChange(3)
    expect(wrapper.vm.paginations.page).to.equal(3)
  })

  it('MTBL-11 resetPage() 应重置page为1', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    wrapper.vm.paginations.page = 5
    wrapper.vm.resetPage()
    expect(wrapper.vm.paginations.page).to.equal(1)
  })
})

// ----------------------------------------------------------------
// 4. 排序
// ----------------------------------------------------------------
describe('MesTable.vue — 排序', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-12 sortChange() 升序应设置asc', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    wrapper.vm.sortChange({ prop: 'Name', order: 'ascending' })
    expect(wrapper.vm.paginations.sort).to.equal('Name')
    expect(wrapper.vm.paginations.order).to.equal('asc')
  })

  it('MTBL-13 sortChange() 降序应设置desc', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test/page',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    wrapper.vm.sortChange({ prop: 'Code', order: 'descending' })
    expect(wrapper.vm.paginations.sort).to.equal('Code')
    expect(wrapper.vm.paginations.order).to.equal('desc')
  })
})

// ----------------------------------------------------------------
// 5. 行选中
// ----------------------------------------------------------------
describe('MesTable.vue — 行选中', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-14 getSelected() 应返回选中行', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    const rows = [{ Name: 'A' }, { Name: 'B' }]
    wrapper.vm.selectRows = rows
    expect(wrapper.vm.getSelected()).to.deep.equal(rows)
  })

  it('MTBL-15 selectionChange() 多选应更新selectRows', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false,
        single: false
      },
      ...createMountOptions()
    })

    wrapper.vm.selectionChange([{ Name: 'A' }, { Name: 'B' }])
    expect(wrapper.vm.selectRows).to.have.length(2)
  })

  it('MTBL-16 selectionChange() 单选模式应只保留最后一行', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false,
        single: true
      },
      ...createMountOptions()
    })

    wrapper.vm.selectionChange([{ Name: 'A' }, { Name: 'B' }])
    expect(wrapper.vm.selectRows).to.have.length(1)
    expect(wrapper.vm.selectRows[0].Name).to.equal('B')
  })
})

// ----------------------------------------------------------------
// 6. 合计
// ----------------------------------------------------------------
describe('MesTable.vue — 合计', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-17 getSummaries() 应正确填充合计数据', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false,
        columnIndex: false,
        ck: false
      },
      ...createMountOptions()
    })
    wrapper.vm.summary = true
    wrapper.vm.getSummaries({ summary: { Name: '汇总名称', Qty: 150 } })
    expect(wrapper.vm.summaryData[0]).to.equal('合计')
    expect(wrapper.vm.summaryData[3]).to.equal(150)
  })

  it('MTBL-18 getInputSummaries() 应实时计算求和', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    wrapper.vm.rowData = [{ Qty: 10 }, { Qty: 20 }, { Qty: 30 }]
    wrapper.vm.summaryIndex = { Qty: 2 }

    wrapper.vm.getInputSummaries(null, null, null, { field: 'Qty', summary: true })
    expect(wrapper.vm.summaryData[2]).to.equal(60)
  })

  it('MTBL-19 无summary属性不计算', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    wrapper.vm.rowData = [{ Qty: 10 }]
    wrapper.vm.summaryData = []
    wrapper.vm.getInputSummaries(null, null, null, { field: 'Qty' })
    expect(wrapper.vm.summaryData).to.be.empty
  })
})

// ----------------------------------------------------------------
// 7. 格式化
// ----------------------------------------------------------------
describe('MesTable.vue — 格式化', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MTBL-20 formatter() 下拉框应转换key为value', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })

    const result = wrapper.vm.formatter(
      { Status: '1' },
      { field: 'Status', bind: { data: [{ key: '1', value: '启用' }, { key: '0', value: '禁用' }] } },
      true
    )
    expect(result).to.equal('启用')
  })

  it('formatter() switch类型应返回是/否', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    expect(wrapper.vm.formatter({ IsActive: 1 }, { field: 'IsActive', edit: { type: 'switch' } }, true)).to.equal('是')
    expect(wrapper.vm.formatter({ IsActive: 0 }, { field: 'IsActive', edit: { type: 'switch' } }, true)).to.equal('否')
  })

  it('formatterDate() 应截取前10位', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })

    expect(wrapper.vm.formatterDate({ CreateDate: '2026-07-23 14:30:00' }, { field: 'CreateDate' })).to.equal('2026-07-23')
  })
})

// ----------------------------------------------------------------
// 8. 行操作
// ----------------------------------------------------------------
describe('MesTable.vue — 行操作', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('addRow() 应添加空行', () => {
    const columns = createColumns()
    columns[0].edit = { type: 'switch' }
    columns[0].type = 'int'
    const wrapper = shallowMount(MesTable, {
      props: {
        columns,
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })

    wrapper.vm.addRow({})
    expect(wrapper.vm.rowData).to.have.length(1)
  })

  it('delRow() 应删除选中行', () => {
    const columns = createColumns()
    columns[0].isKey = true
    const wrapper = shallowMount(MesTable, {
      props: {
        columns,
        pagination: createPagination(),
        defaultLoadPage: false,
        index: true,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    wrapper.vm.rowData = [
      { Name: 'A', elementIndex: 0 },
      { Name: 'B', elementIndex: 1 },
      { Name: 'C', elementIndex: 2 }
    ]
    wrapper.vm.selectRows = [wrapper.vm.rowData[0], wrapper.vm.rowData[2]]

    wrapper.vm.delRow()

    expect(wrapper.vm.rowData).to.have.length(1)
    expect(wrapper.vm.rowData[0].Name).to.equal('B')
  })
})

// ----------------------------------------------------------------
// 9. 属性
// ----------------------------------------------------------------
describe('MesTable.vue — 属性', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('未传入url时默认为空字符串', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    expect(wrapper.props('url')).to.equal('')
  })

  it('defaultLoadPage为false时不自动加载', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        url: '/api/test',
        pagination: createPagination(),
        defaultLoadPage: false
      },
      ...createMountOptions()
    })
    expect(wrapper.vm.rowData).to.have.length(0)
  })
})

// ----------------------------------------------------------------
// 10. hasOwnProperty 安全
// ----------------------------------------------------------------
describe('MesTable.vue — hasOwnProperty 安全', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('rowBeginEdit() row覆写hasOwnProperty时不应抛异常', () => {
    const columns = createColumns()
    columns[0].edit = { type: 'text' }
    const wrapper = shallowMount(MesTable, {
      props: {
        columns,
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    const row = { Name: '测试', elementIndex: 0, hasOwnProperty: 'hijacked' }
    expect(() => {
      wrapper.vm.rowBeginEdit(row, { field: 'Name', edit: { type: 'text' }, property: 'Name' })
    }).to.not.throw()
  })

  it('addRow() row覆写hasOwnProperty时不应抛异常', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    const row = { hasOwnProperty: 'hijacked' }
    expect(() => {
      wrapper.vm.addRow(row)
    }).to.not.throw()
  })

  it('getInputSummaries() rowData元素覆写hasOwnProperty时不应抛异常', () => {
    const wrapper = shallowMount(MesTable, {
      props: {
        columns: createColumns(),
        pagination: createPagination(),
        defaultLoadPage: false,
        url: '/api/test'
      },
      ...createMountOptions()
    })
    wrapper.vm.rowData = [
      { Qty: 10, hasOwnProperty: 'x' },
      { Qty: 20, hasOwnProperty: 'y' }
    ]
    wrapper.vm.summaryIndex = { Qty: 2 }
    expect(() => {
      wrapper.vm.getInputSummaries(null, null, null, { field: 'Qty', summary: true })
    }).to.not.throw()
  })
})
