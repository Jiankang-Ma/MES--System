import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import MesForm from '@/components/basic/MesForm.vue'
import { installLocalStorageMock } from './helpers/localStorageMock'

/**
 * MesForm.vue 测试
 *
 * 使用 shallowMount 避免 Element Plus 子组件渲染问题。
 * http 通过 Vue 全局属性注入。
 */

function createFormRules() {
  return [
    [
      { field: 'Name', title: '名称', type: 'text', required: true },
      { field: 'Code', title: '编码', type: 'text' }
    ],
    [
      { field: 'Status', title: '状态', type: 'select', dataKey: 'Status', required: true },
      { field: 'Qty', title: '数量', type: 'number', required: true, min: 0 }
    ]
  ]
}

function createFormFields() {
  return { Name: '', Code: '', Status: '', Qty: '' }
}

function mountOptions(httpMock) {
  const http = httpMock || {
    post: () => Promise.resolve([])
  }
  return {
    global: {
      plugins: [{
        install(app) {
          app.config.globalProperties.http = http
        }
      }],
      stubs: {
        'el-form': {
          template: '<form><slot/></form>',
          methods: { resetFields() {} }
        },
        'el-form-item': true,
        'el-input': true,
        'el-input-number': true,
        'el-select': true,
        'el-option': true,
        'el-switch': true,
        'el-checkbox': true,
        'el-checkbox-group': true,
        'el-radio': true,
        'el-radio-group': true,
        'el-date-picker': true,
        'el-time-picker': true,
        'el-cascader': true,
        'el-upload': true,
        'el-button': true,
        'el-tag': true,
        'el-popover': true
      }
    }
  }
}

// ----------------------------------------------------------------
// 1. 动态表单
// ----------------------------------------------------------------
describe('MesForm.vue — 动态表单', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-01 表单初始化应正确处理formRules', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    expect(wrapper.exists()).to.be.true
    const rules = wrapper.vm.rules
    expect(rules.Name).to.exist
    expect(rules.Status).to.exist
    expect(rules.Qty).to.exist
  })

  it('MFRM-02 getColWidth() 应根据colSize计算百分比', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Name', title: '名称', type: 'text', colSize: 6 }
    const width = wrapper.vm.getColWidth(item)
    expect(parseFloat(width)).to.be.above(0)
    expect(parseFloat(width)).to.be.at.most(100)
  })
})

// ----------------------------------------------------------------
// 2. 表单验证
// ----------------------------------------------------------------
describe('MesForm.vue — 表单验证', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-07 getRule() 必填文本字段应生成 required 规则', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Name', title: '名称', type: 'text', required: true }
    const rule = wrapper.vm.getRule(item, createFormFields())

    expect(rule.required).to.be.true
    expect(rule.trigger).to.equal('blur')
  })

  it('MFRM-08 getRule() 数字范围验证', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Qty', title: '数量', type: 'number', required: true, min: 0, max: 100 }
    const rule = wrapper.vm.getRule(item, createFormFields())

    expect(rule.required).to.be.true
    expect(rule.min).to.equal(0)
    expect(rule.max).to.equal(100)
    expect(rule.validator).to.be.a('function')
  })

  it('MFRM-09 getRule() 手机号验证应使用 validatorPhone', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Phone', title: '手机号', type: 'phone', required: true }
    const rule = wrapper.vm.getRule(item, createFormFields())

    expect(rule.validator).to.equal(wrapper.vm.validatorPhone)
    expect(rule.required).to.be.true
  })

  it('MFRM-10 getRule() 邮箱验证', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Email', title: '邮箱', type: 'mail', required: true }
    const rule = wrapper.vm.getRule(item, createFormFields())

    expect(rule.required).to.be.true
  })

  it('getRule() switch类型应跳过验证', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'IsActive', title: '是否启用', type: 'switch' }
    const rule = wrapper.vm.getRule(item, createFormFields())

    expect(rule.required).to.be.false
  })
})

// ----------------------------------------------------------------
// 3. 远程搜索
// ----------------------------------------------------------------
describe('MesForm.vue — 远程搜索', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-11 remoteSearch() 应发起HTTP请求获取下拉数据', (done) => {
    let postCalled = false
    const httpMock = {
      post: (url) => {
        postCalled = true
        expect(url).to.include('Dept')
        return Promise.resolve([{ key: '1', value: '部门A' }])
      }
    }
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'Dept', title: '部门', type: 'select', dataKey: 'Dept', remote: true, point: { x: 0, y: 0 } }]
        ],
        formFields: { Dept: '' },
        loadKey: false
      },
      ...mountOptions(httpMock)
    })

    const item = wrapper.vm.formRules[0][0]
    wrapper.vm.remoteSearch(item, { Dept: '' }, '部门')

    setTimeout(() => {
      expect(postCalled).to.be.true
      expect(item.data).to.deep.equal([{ key: '1', value: '部门A' }])
      done()
    }, 50)
  })

  it('MFRM-12 remoteSearch() 空值不发起请求', () => {
    let postCalled = false
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'Dept', title: '部门', type: 'select', dataKey: 'Dept', remote: true, point: { x: 0, y: 0 } }]
        ],
        formFields: { Dept: '' },
        loadKey: false
      },
      ...mountOptions({ post: () => { postCalled = true; return Promise.resolve([]) } })
    })

    const item = wrapper.vm.formRules[0][0]
    wrapper.vm.remoteSearch(item, { Dept: '' }, '')

    expect(postCalled).to.be.false
  })
})

// ----------------------------------------------------------------
// 4. 文件处理
// ----------------------------------------------------------------
describe('MesForm.vue — 文件处理', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-14 isFile() 应识别img/file/excel类型', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const formFields = { Photo: '' }
    expect(wrapper.vm.isFile({ field: 'Photo', type: 'img' }, formFields)).to.be.true
    expect(wrapper.vm.isFile({ field: 'Doc', type: 'file' }, formFields)).to.be.true
    expect(wrapper.vm.isFile({ field: 'Excel', type: 'excel' }, formFields)).to.be.true
    expect(wrapper.vm.isFile({ field: 'Name', type: 'text' }, formFields)).to.be.false
  })

  it('MFRM-15 convertFileToArray() 字符串路径应转换为数组', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Photo', type: 'img', maxFile: 5 }
    const formFields = { Photo: '/Upload/a.jpg,/Upload/b.jpg' }

    wrapper.vm.convertFileToArray(item, formFields)

    expect(formFields.Photo).to.be.an('array').with.length(2)
  })

  it('MFRM-16 convertFileToArray() null/undefined应转为空数组', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Photo', type: 'img' }

    const formFields1 = { Photo: null }
    wrapper.vm.convertFileToArray(item, formFields1)
    expect(formFields1.Photo).to.deep.equal([])

    const formFields2 = { Photo: '' }
    wrapper.vm.convertFileToArray(item, formFields2)
    expect(formFields2.Photo).to.deep.equal([])
  })
})

// ----------------------------------------------------------------
// 5. 表单重置
// ----------------------------------------------------------------
describe('MesForm.vue — 表单重置', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-17 reset() 应调用$refs.resetFields', () => {
    let resetFieldsCalled = false
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      global: {
        ...mountOptions().global,
        stubs: {
          ...(mountOptions().global.stubs || {}),
          'el-form': {
            template: '<form><slot/></form>',
            methods: { resetFields() { resetFieldsCalled = true } }
          }
        }
      }
    })

    wrapper.vm.reset()

    expect(resetFieldsCalled).to.be.true
  })

  it('MFRM-18 reset() 范围字段应重置为[null, null]', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'DateRange', title: '日期范围', type: 'date', range: true }]
        ],
        formFields: { DateRange: ['2026-01-01', '2026-12-31'] },
        loadKey: false
      },
      ...mountOptions()
    })

    wrapper.vm.reset()

    expect(wrapper.vm.formFields.DateRange).to.deep.equal([null, null])
  })

  it('MFRM-19 reset(sourceObj) 应恢复指定字段', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: { Name: '', Code: '', Status: '', Qty: '' },
        loadKey: false
      },
      ...mountOptions()
    })

    wrapper.vm.reset({ Name: '测试名称', Code: '001' })

    expect(wrapper.vm.formFields.Name).to.equal('测试名称')
    expect(wrapper.vm.formFields.Code).to.equal('001')
  })
})

// ----------------------------------------------------------------
// 6. 日期处理
// ----------------------------------------------------------------
describe('MesForm.vue — 日期处理', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('MFRM-20 getDateOptions() 应限制日期范围', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { min: '2026-01-01', max: '2026-12-31' }
    const date = new Date('2026-06-15')

    expect(wrapper.vm.getDateOptions(date, item)).to.be.false

    const beforeDate = new Date('2025-12-31')
    expect(wrapper.vm.getDateOptions(beforeDate, item)).to.be.true
  })
})

// ----------------------------------------------------------------
// 7. 字典初始化
// ----------------------------------------------------------------
describe('MesForm.vue — 字典初始化', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('initSource() 应向后台请求字典数据', (done) => {
    let postCalled = false
    const httpMock = {
      post: (url, keys) => {
        postCalled = true
        expect(keys).to.include('Status')
        return Promise.resolve([
          { dicNo: 'Status', data: [{ key: '1', value: '启用' }, { key: '0', value: '禁用' }] }
        ])
      }
    }
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'Status', title: '状态', type: 'select', dataKey: 'Status', data: [] }]
        ],
        formFields: { Status: '' },
        loadKey: true
      },
      ...mountOptions(httpMock)
    })

    setTimeout(() => {
      expect(postCalled).to.be.true
      const statusOption = wrapper.vm.formRules[0].find(x => x.field === 'Status')
      expect(statusOption.data).to.have.length(2)
      done()
    }, 100)
  })
})

// ----------------------------------------------------------------
// 8. getText 标签只读显示
// ----------------------------------------------------------------
describe('MesForm.vue — getText 只读显示', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('getText() 应返回空值占位符', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Name', title: '名称', type: 'text' }
    expect(wrapper.vm.getText({ Name: '' }, item)).to.equal('--')
    expect(wrapper.vm.getText({ Name: null }, item)).to.equal('--')
  })

  it('getText() switch类型应返回是/否', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'IsActive', title: '是否启用', type: 'switch' }
    expect(wrapper.vm.getText({ IsActive: 1 }, item)).to.equal('是')
    expect(wrapper.vm.getText({ IsActive: 0 }, item)).to.equal('否')
  })

  it('getText() 有dataKey时应转换字典值', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: createFormRules(),
        formFields: createFormFields(),
        loadKey: false
      },
      ...mountOptions()
    })

    const item = { field: 'Status', title: '状态', type: 'select', data: [{ key: '1', value: '启用' }, { key: '0', value: '禁用' }] }
    expect(wrapper.vm.getText({ Status: '1' }, item)).to.equal('启用')
    expect(wrapper.vm.getText({ Status: '0' }, item)).to.equal('禁用')
  })
})

// ----------------------------------------------------------------
// 9. WH-BUG-15 initUpload 括号错误 + hasOwnProperty
// ----------------------------------------------------------------
describe('MesForm.vue — initUpload', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('WH-BUG-15 initUpload() 当item.type为img时应设置autoUpload/fileList/downLoad属性', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'Photo', title: '照片', type: 'img' }]
        ],
        formFields: { Photo: '' },
        loadKey: true
      },
      ...mountOptions()
    })

    // initFormRules(true) 中调用 initUpload(item, true)
    // 正确行为：item.type 为 'img' 时，应设置 autoUpload=true, fileList=true, downLoad=true
    // 缺陷代码：indexOf(item.type != -1) 括号位置错误，条件永远为 false，不会进入 if 块
    const photoItem = wrapper.vm.formRules[0].find(x => x.field === 'Photo')
    expect(photoItem.autoUpload).to.be.true
    expect(photoItem.fileList).to.be.true
    expect(photoItem.downLoad).to.be.true
  })

  it('WH-BUG-15b initUpload() item覆写hasOwnProperty时不应抛异常', () => {
    const wrapper = shallowMount(MesForm, {
      props: {
        formRules: [
          [{ field: 'Photo', title: '照片', type: 'img', columnType: 'img', hasOwnProperty: 'hijacked' }]
        ],
        formFields: { Photo: '' },
        loadKey: true
      },
      ...mountOptions()
    })

    // initUpload 中使用 item.hasOwnProperty('autoUpload') 等
    // 当 item 对象覆写 hasOwnProperty 时，应使用 Object.prototype.hasOwnProperty.call 避免异常
    // 只要能成功挂载不抛异常即表示通过
    expect(wrapper.exists()).to.be.true
  })
})
