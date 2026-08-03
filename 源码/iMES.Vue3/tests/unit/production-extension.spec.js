import { expect } from 'chai'
import AssembleWorkOrder from '@/extension/production/production/Production_AssembleWorkOrder'
import ProductPlan from '@/extension/production/production/Production_ProductPlan'
import ReportWorkOrder from '@/extension/production/production/Production_ReportWorkOrder'
import SalesOrder from '@/extension/production/production/Production_SalesOrder'
import WorkOrder from '@/extension/production/production/Production_WorkOrder'
import { installLocalStorageMock } from './helpers/localStorageMock'

function invoke(extension, method, context, ...args) {
  return extension.methods[method].apply(context, args)
}

function createProductionContext(overrides = {}) {
  const messages = []
  return {
    $route: { query: {} },
    $refs: {
      table: {
        rowData: [],
        getSelected: () => [],
        $refs: { table: { toggleRowSelection: () => {} } }
      },
      detail: { rowData: [] },
      gridFooter: { rowClick: () => {} },
      modelHeader: { open: () => {} },
      modelBody: { openDemo: () => {} },
      modelFooter: { open: () => {} }
    },
    http: {
      get: () => Promise.resolve([]),
      post: () => Promise.resolve({ rows: [] }),
      ajax: () => {},
      ipAddress: 'http://localhost:9991/'
    },
    $nextTick: (callback) => callback(),
    $Message: {
      error: (message) => messages.push({ type: 'error', message }),
      success: (message) => messages.push({ type: 'success', message })
    },
    $error(message) { messages.push({ type: 'error', message }) },
    $tabs: { open: () => {} },
    messages,
    buttons: [],
    columns: [],
    detailOptions: { buttons: [], columns: [], clickEdit: false },
    editFormFields: {},
    editFormOptions: [],
    boxOptions: {},
    getFormOption(field) {
      for (const row of this.editFormOptions) {
        const option = row.find(item => item.field === field)
        if (option) return option
      }
      return undefined
    },
    setFiexdSearchForm: () => {},
    search: () => {},
    currentAction: 'Add',
    ...overrides
  }
}

describe('extension/production — 销售订单与生产计划', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })
  it('PROD-SO-01 销售订单编码进入页面时，按编码查询并替换表格数据', async () => {
    let request
    const ctx = createProductionContext({
      $route: { query: { SalesOrderCode: 'SO-20260724' } },
      http: {
        post: (url, params, loading) => {
          request = { url, params, loading }
          return Promise.resolve({ rows: [{ SalesOrderCode: 'SO-20260724' }] })
        }
      }
    })

    invoke(SalesOrder, 'onActivated', ctx)
    await Promise.resolve()

    expect(request.url).to.equal('/api/Production_SalesOrder/getPageData')
    expect(request.loading).to.equal(true)
    expect(JSON.parse(request.params.wheres)).to.deep.equal([
      { name: 'SalesOrderCode', value: 'SO-20260724', displayType: 'like' }
    ])
    expect(ctx.$refs.table.rowData).to.deep.equal([{ SalesOrderCode: 'SO-20260724' }])
  })

  it('PROD-SO-02 没有销售订单编码时不应发起筛选请求', () => {
    let postCount = 0
    const ctx = createProductionContext({ http: { post: () => { postCount++ } } })

    invoke(SalesOrder, 'onActivated', ctx)

    expect(postCount).to.equal(0)
  })

  it('PROD-SO-03 点击列表行时应选中行并刷新销售订单明细', () => {
    const selected = []
    const footerCalls = []
    const row = { SalesOrder_Id: 10 }
    const ctx = createProductionContext({
      $refs: {
        table: {
          $refs: { table: { toggleRowSelection: (value) => selected.push(value) } }
        },
        gridFooter: { rowClick: (...args) => footerCalls.push(args) }
      }
    })

    invoke(SalesOrder, 'rowClick', ctx, { row })

    expect(selected).to.deep.equal([row])
    expect(footerCalls).to.deep.equal([[row, '销售订单']])
  })

  it('PROD-PP-01 生产计划编码进入页面时按 ProductPlanCode 精确构造筛选参数', async () => {
    let request
    const ctx = createProductionContext({
      $route: { query: { ProductPlanCode: 'PP-001' } },
      http: {
        post: (url, params) => {
          request = { url, params }
          return Promise.resolve({ rows: [{ ProductPlanCode: 'PP-001' }] })
        }
      }
    })

    invoke(ProductPlan, 'onActivated', ctx)
    await Promise.resolve()

    expect(request.url).to.equal('/api/Production_ProductPlan/getPageData')
    expect(JSON.parse(request.params.wheres)[0]).to.deep.equal({
      name: 'ProductPlanCode', value: 'PP-001', displayType: 'like'
    })
    expect(ctx.$refs.table.rowData).to.deep.equal([{ ProductPlanCode: 'PP-001' }])
  })

  it('PROD-PP-02 打开生产计划表单时只给编号字段设置自动生成提示', () => {
    const code = { field: 'ProductPlanCode' }
    const name = { field: 'ProductName' }
    const ctx = createProductionContext({ editFormOptions: [[code, name]] })

    invoke(ProductPlan, 'modelOpenAfter', ctx, {})

    expect(code.placeholder).to.equal('请输入，忽略将自动生成')
    expect(name.placeholder).to.equal(undefined)
  })
})

describe('extension/production — 工单和装配工单', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })
  it('PROD-WO-01 getRow() 将产品选择结果回填到工单表单', () => {
    const ctx = createProductionContext({ editFormFields: {} })
    const product = {
      Product_Id: 7, ProductCode: 'P-007', ProductName: '齿轮',
      ProductStandard: 'A型', Unit_Id: 3
    }

    invoke(WorkOrder, 'getRow', ctx, [product], 'WorkOrderProduct_Id')

    expect(ctx.editFormFields).to.deep.equal(product)
  })

  it('PROD-WO-02 getProcessRow() 继承工单计划信息并初始化报工数量', () => {
    const ctx = createProductionContext({
      editFormFields: {
        PlanStartDate: '2026-07-24 00:00:00',
        PlanEndDate: '2026-07-24 23:59:59',
        PlanQty: 50
      },
      $refs: { detail: { rowData: [{ ProcessCode: 'old' }] } }
    })
    const process = {
      Process_Id: 4, ProcessCode: 'GX-04', ProcessName: '装配',
      SubmitWorkLimit: 'u1,u2', SubmitWorkMatch: 1, DefectItem: 'd1',
      SubmitWorkLimitLabel: '张三，李四', DefectItemLabel: '划伤'
    }

    invoke(WorkOrder, 'getProcessRow', ctx, [process])

    expect(ctx.$refs.detail.rowData[0]).to.include({
      Process_Id: 4, ProcessCode: 'GX-04', PlanQty: 50,
      GoodQty: 0, NoGoodQty: 0, SubmitWorkLimitLabel: '张三，李四'
    })
    expect(ctx.$refs.detail.rowData).to.have.length(2)
  })

  it('PROD-WO-03 getProcessListById() 将权限和不良品编码翻译为显示名称', async () => {
    let requestUrl
    const ctx = createProductionContext({
      editFormFields: { PlanStartDate: '2026-07-24', PlanEndDate: '2026-07-25', PlanQty: 10 },
      detailOptions: {
        columns: [
          { field: 'SubmitWorkLimit', bind: { data: [{ key: 'u1', value: '张三' }, { key: 'u2', value: '李四' }] } },
          { field: 'DefectItem', bind: { data: [{ key: 'd1', value: '划伤' }] } }
        ]
      },
      $refs: { detail: { rowData: [{ stale: true }] } },
      http: {
        get: (url) => {
          requestUrl = url
          return Promise.resolve([{
            Process_Id: 1, ProcessCode: 'GX-01', ProcessName: '冲压',
            SubmitWorkLimit: 'u1,u2', SubmitWorkMatch: 1, DefectItem: 'd1'
          }])
        }
      }
    })

    invoke(WorkOrder, 'getProcessListById', ctx, 99)
    await Promise.resolve()

    expect(requestUrl).to.equal('api/Base_Process/getProcessListByLineID?ProcessLine_Id=99')
    expect(ctx.$refs.detail.rowData).to.have.length(1)
    expect(ctx.$refs.detail.rowData[0]).to.include({
      PlanQty: 10, GoodQty: 0, NoGoodQty: 0,
      SubmitWorkLimitLabel: '张三，李四', DefectItemLabel: '划伤'
    })
  })

  it('PROD-WO-04 searchDetailAfter() 编辑工单时补齐权限和不良品显示值', () => {
    const rows = [{ SubmitWorkLimit: 'u1', DefectItem: 'd1' }]
    const ctx = createProductionContext({
      currentAction: 'update',
      detailOptions: {
        columns: [
          { field: 'SubmitWorkLimit', bind: { data: [{ key: 'u1', value: '张三' }] } },
          { field: 'DefectItem', bind: { data: [{ key: 'd1', value: '划伤' }] } }
        ]
      }
    })

    expect(invoke(WorkOrder, 'searchDetailAfter', ctx, rows)).to.equal(true)
    expect(rows[0]).to.include({ SubmitWorkLimitLabel: '张三', DefectItemLabel: '划伤' })
  })

  it('PROD-WO-05 开始按钮拒绝已开始工单，避免重复变更状态', () => {
    const errors = []
    const ctx = createProductionContext({
      buttons: [{}, {}, {}],
      editFormOptions: [[{ field: 'PlanQty' }]],
      $refs: { table: { getSelected: () => [{ WorkOrder_Id: 9, Status: 2 }] }, detail: { rowData: [] }, modelBody: { openDemo: () => {} } },
      $error: (message) => errors.push(message)
    })
    invoke(WorkOrder, 'onInit', ctx)
    const startButton = ctx.buttons.find(button => button.name === '开始')
    let updateCalled = false
    ctx.updatestatus = () => { updateCalled = true }

    startButton.onClick.call(ctx)

    expect(errors).to.deep.equal(['已经开始的工单不允许重复开始!'])
    expect(updateCalled).to.equal(false)
  })

  it('PROD-WO-06 新建或编辑时计划数为零应阻止保存', () => {
    const ctx = createProductionContext()
    const formData = { mainData: { PlanQty: 0 }, detailData: [] }

    expect(invoke(WorkOrder, 'addBefore', ctx, formData)).to.equal(false)
    expect(invoke(WorkOrder, 'updateBefore', ctx, formData)).to.equal(false)
    expect(ctx.messages).to.deep.equal([
      { type: 'error', message: '计划数必须大于 0' },
      { type: 'error', message: '计划数必须大于 0' }
    ])
  })

  it('PROD-AWO-01 装配工单编码进入页面时使用专属查询接口', async () => {
    let request
    const ctx = createProductionContext({
      $route: { query: { AssembleWorkOrderCode: 'AWO-8' } },
      http: {
        post: (url, params) => {
          request = { url, params }
          return Promise.resolve({ rows: [{ AssembleWorkOrderCode: 'AWO-8' }] })
        }
      }
    })

    invoke(AssembleWorkOrder, 'onActivated', ctx)
    await Promise.resolve()

    expect(request.url).to.equal('/api/Production_AssembleWorkOrder/getPageData')
    expect(JSON.parse(request.params.wheres)[0].name).to.equal('AssembleWorkOrderCode')
    expect(ctx.$refs.table.rowData).to.deep.equal([{ AssembleWorkOrderCode: 'AWO-8' }])
  })

  it('PROD-AWO-02 装配工单进度列定位首个未完成步骤', () => {
    const progressColumn = { field: 'ProductionSchedule' }
    const ctx = createProductionContext({
      detailOptions: { buttons: [{}], columns: [progressColumn, { field: 'Qty' }] },
      $refs: { modelHeader: { open: () => {} }, modelFooter: { open: () => {} } }
    })
    invoke(AssembleWorkOrder, 'onInited', ctx)
    const row = {
      ProductionSchedule: JSON.stringify([
        { Sequence: 2, ProcessName: '装配', PercentNum: '0.00%' },
        { Sequence: 1, ProcessName: '冲压', PercentNum: '100.00%' }
      ])
    }
    const steps = progressColumn.render((component, props) => ({ component, props }), { row })

    expect(steps[0].props.active).to.equal(2)
  })

  it('PROD-AWO-03 新建或编辑时明细数量为零应阻止保存', () => {
    const ctx = createProductionContext()
    const formData = { mainData: {}, detailData: [{ Qty: 0 }] }

    expect(invoke(AssembleWorkOrder, 'addBefore', ctx, formData)).to.equal(false)
    expect(invoke(AssembleWorkOrder, 'updateBefore', ctx, formData)).to.equal(false)
    expect(ctx.messages).to.deep.equal([
      { type: 'error', message: '装配工单明细数量必须为大于 0 的整数' },
      { type: 'error', message: '装配工单明细数量必须为大于 0 的整数' }
    ])
  })
})

describe('extension/production — 报工', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })
  it('PROD-RPT-01 differenceDateTime() 计算跨天工时和实际效率', () => {
    const ctx = createProductionContext({ editFormFields: { GoodQty: 15 } })

    invoke(ReportWorkOrder, 'differenceDateTime', ctx, '2026-07-24 08:30:00', '2026-07-25 10:00:00')

    expect(ctx.editFormFields.ReoportDurationHour).to.equal(25)
    expect(ctx.editFormFields.ReoportDurationMinute).to.equal(30)
    expect(ctx.editFormFields.ActualProgress).to.equal('0.59/1:00:00')
  })

  it('PROD-RPT-02 相同开始结束时间不计算无穷大实际效率', () => {
    const ctx = createProductionContext({ editFormFields: { GoodQty: 15 } })

    invoke(ReportWorkOrder, 'differenceDateTime', ctx, '2026-07-24 08:00:00', '2026-07-24 08:00:00')

    expect(ctx.editFormFields).to.include({ ReoportDurationHour: 0, ReoportDurationMinute: 0 })
    expect(ctx.editFormFields.ActualProgress).to.equal(undefined)
  })

  it('PROD-RPT-03 新增报工默认填写状态、时间和当前审批人', () => {
    const originalGetter = ReportWorkOrder.methods.showTime
    const ctx = createProductionContext({
      currentAction: 'Add',
      editFormFields: {},
      showTime: () => '2026-07-24 09'
    })

    invoke(ReportWorkOrder, 'modelOpenAfter', ctx, {})

    expect(ctx.editFormFields).to.include({
      StartDate: '2026-07-24 09:00:00',
      EndDate: '2026-07-24 09:00:00',
      ProcessStatus: '2',
      ApproveStatus: '2'
    })
    expect(ctx.editFormFields.ReportTime).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    expect(originalGetter).to.be.a('function')
  })
})
