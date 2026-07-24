import { expect } from 'chai'
import ViewGridCustomColumn from '@/components/basic/ViewGrid/ViewGridCustomColumn'
import { installLocalStorageMock } from './helpers/localStorageMock'

function createContext(options = {}) {
  const messages = []
  const columns = options.columns || [
    { field: 'code', title: '编码' },
    { field: 'name', title: '名称' },
    { field: 'qty', title: '数量' }
  ]

  return {
    ...ViewGridCustomColumn,
    columns: columns.map(column => ({ ...column })),
    table: { name: options.tableName || 'Production_Order' },
    userId: options.userId,
    viewColumns: [],
    viewColumnsClone: [],
    viewModel: false,
    orginColumnFields: null,
    messages,
    $message: {
      error(message) {
        messages.push(message)
        return message
      }
    }
  }
}

function cacheColumns(context, columns) {
  localStorage.setItem(context.getViewCacheKey(), JSON.stringify(columns))
}

describe('ViewGridCustomColumn.js', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  describe('缓存键', () => {
    it('不同表格使用不同缓存键', () => {
      const first = createContext({ tableName: 'Table_A' })
      const second = createContext({ tableName: 'Table_B' })

      expect(first.getViewCacheKey()).not.to.equal(second.getViewCacheKey())
    })

    it('同一表格的不同用户使用不同缓存键', () => {
      const first = createContext({ tableName: 'Table_A', userId: 1 })
      const second = createContext({ tableName: 'Table_A', userId: 2 })

      expect(first.getViewCacheKey()).not.to.equal(second.getViewCacheKey())
    })
  })

  describe('初始化和缓存恢复', () => {
    it('无缓存时按默认顺序初始化可配置列', () => {
      const context = createContext({
        columns: [
          { field: 'code', title: '编码' },
          { field: 'hidden', title: '默认隐藏', hidden: true },
          { field: 'render', title: '渲染列', render: () => null },
          { field: 'name', title: '名称' }
        ]
      })

      context.initViewColumns()

      expect(context.orginColumnFields).to.deep.equal(['code', 'hidden', 'render', 'name'])
      expect(context.viewColumns).to.deep.equal([
        { field: 'code', title: '编码', show: true },
        { field: 'name', title: '名称', show: true }
      ])
    })

    it('恢复缓存中的列顺序和显示状态', () => {
      const context = createContext()
      cacheColumns(context, [
        { field: 'name', title: '名称', show: false },
        { field: 'code', title: '编码', show: true }
      ])

      context.initViewColumns()

      expect(context.viewColumns.map(column => column.field)).to.deep.equal(['name', 'code', 'qty'])
      expect(context.columns.map(column => column.field)).to.deep.equal(['name', 'code', 'qty'])
      expect(context.columns.find(column => column.field === 'name').hidden).to.equal(true)
      expect(context.columns.find(column => column.field === 'code').hidden).to.equal(false)
    })

    it('新增字段追加在旧缓存字段之后', () => {
      const context = createContext()
      cacheColumns(context, [{ field: 'name', title: '名称', show: true }])

      context.initViewColumns()

      expect(context.viewColumns.map(column => column.field)).to.deep.equal(['name', 'code', 'qty'])
    })

    it('缓存中的已删除字段被忽略', () => {
      const context = createContext()
      cacheColumns(context, [
        { field: 'removed', title: '已删除', show: false },
        { field: 'qty', title: '数量', show: true }
      ])

      context.initViewColumns()

      expect(context.viewColumns.map(column => column.field)).to.deep.equal(['qty', 'code', 'name'])
      expect(context.columns.map(column => column.field)).to.deep.equal(['qty', 'code', 'name'])
    })

    it('非法 JSON 缓存不会中断初始化', () => {
      const context = createContext()
      const originalLog = console.log
      console.log = () => {}
      localStorage.setItem(context.getViewCacheKey(), '{invalid-json')

      try {
        expect(() => context.initViewColumns()).not.to.throw()
        expect(context.viewColumns.map(column => column.field)).to.deep.equal(['code', 'name', 'qty'])
      } finally {
        console.log = originalLog
      }
    })

    it('非数组 JSON 缓存不会中断初始化', () => {
      const context = createContext()
      const originalLog = console.log
      console.log = () => {}
      localStorage.setItem(context.getViewCacheKey(), JSON.stringify({ field: 'code' }))

      try {
        expect(() => context.initViewColumns()).not.to.throw()
        expect(context.viewColumns.map(column => column.field)).to.deep.equal(['code', 'name', 'qty'])
      } finally {
        console.log = originalLog
      }
    })

    it('重复缓存字段不会造成列对象重复', () => {
      const context = createContext()
      cacheColumns(context, [
        { field: 'name', title: '名称', show: true },
        { field: 'name', title: '名称', show: false },
        { field: 'code', title: '编码', show: true }
      ])

      context.initViewColumns()

      expect(context.viewColumns.map(column => column.field)).to.deep.equal(['name', 'code', 'qty'])
      expect(context.columns.map(column => column.field)).to.deep.equal(['name', 'code', 'qty'])
    })

    it('重复初始化后仍保留缓存中被隐藏的列供用户重新勾选', () => {
      const context = createContext()
      cacheColumns(context, [
        { field: 'name', title: '名称', show: false },
        { field: 'code', title: '编码', show: true }
      ])

      context.initViewColumns()
      context.initViewColumns()

      expect(context.viewColumns.map(column => column.field)).to.include('name')
      expect(context.viewColumns.find(column => column.field === 'name').show).to.equal(false)
    })
  })

  describe('重置和保存', () => {
    it('重置时恢复首次记录的字段顺序', () => {
      const context = createContext()
      context.initViewColumns()
      context.columns.splice(0, context.columns.length, context.columns[2], context.columns[0], context.columns[1])

      context.initViewColumns(true)

      expect(context.columns.map(column => column.field)).to.deep.equal(['code', 'name', 'qty'])
    })

    it('原字段已删除时重置结果不包含 undefined', () => {
      const context = createContext()
      context.initViewColumns()
      context.columns.splice(0, context.columns.length,
        { field: 'name', title: '名称' },
        { field: 'newField', title: '新字段' }
      )

      context.resetViewColumns()

      expect(context.columns.every(Boolean)).to.equal(true)
      expect(context.columns.map(column => column.field)).to.deep.equal(['name', 'newField'])
    })

    it('关闭弹窗时撤销未保存的列配置', () => {
      const context = createContext()
      context.viewModel = true
      context.viewColumnsClone = [{ field: 'code', title: '编码', show: true }]
      context.viewColumns = [{ field: 'code', title: '编码', show: false }]

      context.closeCustomModel()

      expect(context.viewModel).to.equal(false)
      expect(context.viewColumns).to.deep.equal(context.viewColumnsClone)
    })

    it('不允许保存全部隐藏的列配置', () => {
      const context = createContext()
      context.viewColumns = [
        { field: 'code', title: '编码', show: false },
        { field: 'name', title: '名称', show: false }
      ]

      const result = context.saveColumnConfig()

      expect(result).to.equal('至少选择一列显示')
      expect(context.messages).to.deep.equal(['至少选择一列显示'])
      expect(localStorage.getItem(context.getViewCacheKey())).to.equal(null)
    })

    it('保存列顺序和显示状态后能够从缓存再次恢复', () => {
      const context = createContext()
      context.initViewColumns()
      context.viewColumnsClone = JSON.parse(JSON.stringify(context.viewColumns))
      context.viewColumns = [
        { field: 'qty', title: '数量', show: true },
        { field: 'code', title: '编码', show: false },
        { field: 'name', title: '名称', show: true }
      ]

      context.saveColumnConfig()

      expect(context.columns.map(column => column.field)).to.deep.equal(['qty', 'code', 'name'])
      expect(context.columns.find(column => column.field === 'code').hidden).to.equal(true)

      const restored = createContext()
      restored.initViewColumns()
      expect(restored.viewColumns).to.deep.equal(context.viewColumns)
    })

    it('localStorage 写入异常时不会导致页面操作抛错', () => {
      const context = createContext()
      context.initViewColumns()
      const originalLog = console.log
      console.log = () => {}
      localStorage.setItem = () => {
        throw new Error('quota exceeded')
      }

      try {
        expect(() => context.saveColumnConfig()).not.to.throw()
      } finally {
        console.log = originalLog
      }
    })
  })
})
