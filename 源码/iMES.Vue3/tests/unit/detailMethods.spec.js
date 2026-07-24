import { expect } from 'chai'
import detailMethods from '@/components/basic/ViewGrid/detailMethods'

/**
 * 创建 detailMethods.js 所需的模拟 Vue 实例上下文
 */
function createMockContext(overrides = {}) {
  const ctx = {
    // ---- 表格 ----
    table: { key: 'Id', url: '/test', cnName: '测试表' },

    // ---- 明细选项 ----
    detailOptions: {
      columns: [{ field: 'Name', title: '名称' }],
      delKeys: [],
      key: 'DetailId',
      pagination: { total: 0 }
    },

    // ---- 当前行 ----
    currentRow: { Id: 1, Name: '主表' },

    // ---- 当前动作 ----
    currentAction: 'Edit',

    // ---- 引用 ----
    $refs: {
      detail: {
        reset: () => {},
        load: () => {},
        addRow: () => {},
        getSelected: () => [],
        delRow: () => [],
        rowData: [],
        paginations: { total: 0 },
        columns: [],
        summary: false,
        getInputSummaries: () => {}
      }
    },

    // ---- 消息 ----
    $message: { error: () => {} },
    $confirm: () => Promise.resolve(),
    $nextTick: (cb) => { if (typeof cb === 'function') cb() },

    // ---- 回调钩子 ----
    loadDetailTableBefore: (param, callBack) => { callBack(true) },
    searchDetailBefore: (param) => true,
    searchDetailAfter: (data) => true,
    delDetailRow: (rows) => true,

    ...overrides
  }
  return ctx
}

// ----------------------------------------------------------------
// 1. 明细数据加载
// ----------------------------------------------------------------
describe('detailMethods.js — 明细数据加载', () => {
  it('DTML-01 loadInternalDetailTableBefore() 编辑状态应设置主表ID', () => {
    let callBackResult = null
    const ctx = createMockContext({
      currentAction: 'Edit',
      currentRow: { Id: 5 },
      table: { key: 'Id' },
      loadDetailTableBefore: (param, callBack) => {
        callBackResult = param
        callBack(true)
      }
    })
    const bound = detailMethods.loadInternalDetailTableBefore.bind(ctx)
    const param = { value: '' }

    bound(param, () => {})

    expect(param.value).to.equal(5)
    expect(callBackResult).to.equal(param)
  })

  it('DTML-02 loadInternalDetailTableBefore() 新建状态应禁止加载', () => {
    let callBackValue = true
    const ctx = createMockContext({
      currentAction: 'Add',
      table: { key: 'Id' },
      currentRow: { Id: 1 },
      detailOptions: { delKeys: [1, 2], key: 'DetailId' },
      loadDetailTableBefore: (param, callBack) => {
        callBack(false)
      }
    })
    const bound = detailMethods.loadInternalDetailTableBefore.bind(ctx)

    bound({ value: '' }, (result) => { callBackValue = result })

    expect(callBackValue).to.be.false
    // 新建时不应重置 delKeys
    expect(ctx.detailOptions.delKeys).to.deep.equal([])
  })

  it('DTML-03 resetDetailTable() 应重置明细表并重新加载', () => {
    let resetCalled = false
    let loadCalled = false
    const ctx = createMockContext({
      currentRow: { Id: 3 },
      table: { key: 'Id' },
      detailOptions: {
        columns: [{ field: 'Name', title: '名称' }],
        delKeys: [],
        key: 'DetailId',
        pagination: { total: 0 }
      },
      $refs: {
        detail: {
          reset: () => { resetCalled = true },
          load: (query) => {
            loadCalled = true
            expect(query.value).to.equal(3)
          },
          getSelected: () => [],
          delRow: () => [],
          rowData: [],
          paginations: { total: 0 },
          columns: [],
          summary: false,
          getInputSummaries: () => {}
        }
      }
    })
    const bound = detailMethods.resetDetailTable.bind(ctx)

    bound()

    expect(resetCalled).to.be.true
    expect(loadCalled).to.be.true
  })

  it('DTML-03b resetDetailTable() 无明细列时不应加载', () => {
    let loadCalled = false
    const ctx = createMockContext({
      detailOptions: {
        columns: [],
        delKeys: [],
        key: 'DetailId',
        pagination: { total: 0 }
      },
      $refs: {
        detail: { load: () => { loadCalled = true } }
      }
    })
    const bound = detailMethods.resetDetailTable.bind(ctx)

    bound()

    expect(loadCalled).to.be.false
  })
})

// ----------------------------------------------------------------
// 2. 行操作
// ----------------------------------------------------------------
describe('detailMethods.js — 行操作', () => {
  it('DTML-04 addRow() 应添加新行并更新汇总', () => {
    let addRowCalled = false
    let updateTotalCalled = false
    const ctx = createMockContext({
      $refs: {
        detail: {
          addRow: (row) => { addRowCalled = true; expect(row).to.deep.equal({}) },
          getSelected: () => [],
          delRow: () => [],
          rowData: [],
          paginations: { total: 0 },
          columns: [],
          summary: false,
          getInputSummaries: () => {}
        }
      },
      updateDetailTableSummaryTotal: () => { updateTotalCalled = true }
    })
    const bound = detailMethods.addRow.bind(ctx)

    bound()

    expect(addRowCalled).to.be.true
    expect(updateTotalCalled).to.be.true
  })

  it('DTML-05 delRow() 已选择行应弹出确认框并删除', (done) => {
    let confirmCalled = false
    let delRowCalled = false
    let delKeysResult = null
    const ctx = createMockContext({
      detailOptions: {
        columns: [],
        delKeys: [],
        key: 'DetailId',
        pagination: { total: 0 }
      },
      $refs: {
        detail: {
          getSelected: () => [{ DetailId: 10, Name: '明细1' }, { DetailId: 20, Name: '明细2' }],
          delRow: () => {
            delRowCalled = true
            return [{ DetailId: 10, Name: '明细1' }, { DetailId: 20, Name: '明细2' }]
          },
          rowData: [],
          paginations: { total: 0 },
          columns: [],
          summary: false,
          getInputSummaries: () => {}
        }
      },
      $confirm: () => {
        confirmCalled = true
        return Promise.resolve()
      },
      updateDetailTableSummaryTotal: () => {}
    })
    const bound = detailMethods.delRow.bind(ctx)

    bound()

    setTimeout(() => {
      expect(confirmCalled).to.be.true
      expect(delRowCalled).to.be.true
      expect(ctx.detailOptions.delKeys).to.deep.equal([10, 20])
      done()
    })
  })

  it('DTML-06 delRow() 未选择行应返回错误', () => {
    let errorMsg = ''
    const ctx = createMockContext({
      $refs: {
        detail: {
          getSelected: () => [],
          delRow: () => [],
          rowData: [],
          paginations: { total: 0 },
          columns: [],
          summary: false,
          getInputSummaries: () => {}
        }
      },
      $message: { error: (msg) => { errorMsg = msg } }
    })
    const bound = detailMethods.delRow.bind(ctx)

    bound()

    expect(errorMsg).to.include('请选择要删除的行')
  })

  it('DTML-07 delDetailRow() 返回false应阻止删除', () => {
    let confirmCalled = false
    const ctx = createMockContext({
      $refs: {
        detail: {
          getSelected: () => [{ DetailId: 1 }],
          delRow: () => [],
          rowData: [],
          paginations: { total: 0 },
          columns: [],
          summary: false,
          getInputSummaries: () => {}
        }
      },
      delDetailRow: () => false
    })
    const bound = detailMethods.delRow.bind(ctx)

    bound()

    expect(confirmCalled).to.be.false
  })
})

// ----------------------------------------------------------------
// 3. 汇总计算
// ----------------------------------------------------------------
describe('detailMethods.js — 汇总计算', () => {
  it('DTML-08 updateDetailTableSummaryTotal() 应更新总行数', () => {
    const ctx = createMockContext({
      $refs: {
        detail: {
          rowData: [{ Name: 'a' }, { Name: 'b' }, { Name: 'c' }],
          paginations: { total: 0 },
          columns: [{ field: 'Name', title: '名称' }],
          summary: false,
          getInputSummaries: () => {}
        }
      }
    })
    const bound = detailMethods.updateDetailTableSummaryTotal.bind(ctx)

    bound()

    expect(ctx.$refs.detail.paginations.total).to.equal(3)
  })

  it('DTML-09 updateDetailTableSummaryTotal() 应重新计算汇总', () => {
    let getSummariesCalled = false
    const ctx = createMockContext({
      $refs: {
        detail: {
          rowData: [{ Qty: 10 }, { Qty: 20 }],
          paginations: { total: 0 },
          columns: [{ field: 'Qty', title: '数量', summary: true }],
          summary: true,
          getInputSummaries: (a, b, c, column) => {
            getSummariesCalled = true
            expect(column.field).to.equal('Qty')
          }
        }
      }
    })
    const bound = detailMethods.updateDetailTableSummaryTotal.bind(ctx)

    bound()

    expect(getSummariesCalled).to.be.true
  })

  it('DTML-08b detail为null时不报错', () => {
    const ctx = createMockContext({
      $refs: { detail: null }
    })
    const bound = detailMethods.updateDetailTableSummaryTotal.bind(ctx)

    // 不应抛出异常
    expect(() => bound()).to.not.throw()
  })
})

// ----------------------------------------------------------------
// 4. 事件代理
// ----------------------------------------------------------------
describe('detailMethods.js — 事件代理', () => {
  it('detailRowOnChange 应代理到 detailRowChange', () => {
    let changeCalled = false
    const ctx = createMockContext({
      detailRowChange: (row) => {
        changeCalled = true
        expect(row.Name).to.equal('test')
      }
    })
    detailMethods.detailRowOnChange.call(ctx, { Name: 'test' })
    expect(changeCalled).to.be.true
  })

  it('detailRowOnClick 应代理到 detailRowClick', () => {
    let clickCalled = false
    const ctx = createMockContext({
      detailRowClick: ({ row }) => {
        clickCalled = true
        expect(row.Name).to.equal('test')
      }
    })
    detailMethods.detailRowOnClick.call(ctx, { row: { Name: 'test' }, column: {}, event: {} })
    expect(clickCalled).to.be.true
  })

  it('refreshRow() 应触发 resetDetailTable', () => {
    let resetCalled = false
    const ctx = createMockContext({
      resetDetailTable: () => { resetCalled = true }
    })
    const bound = detailMethods.refreshRow.bind(ctx)

    bound()

    expect(resetCalled).to.be.true
  })
})
