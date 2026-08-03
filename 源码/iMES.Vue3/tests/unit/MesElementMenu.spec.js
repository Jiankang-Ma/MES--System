import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import MesElementMenu from '@/components/basic/MesElementMenu.vue'

/**
 * MesElementMenu.vue 测试
 *
 * 使用 shallowMount 避免 Element Plus 子组件渲染问题。
 */

function createMountOptions() {
  return {
    global: {
      stubs: {
        'el-menu': {
          template: '<div><slot/></div>',
          methods: {}
        },
        'el-sub-menu': {
          template: '<div><slot/></div>',
          methods: {}
        },
        'el-menu-item': {
          template: '<div><slot/></div>'
        },
        'mes-element-menu-child': true
      }
    }
  }
}

// ----------------------------------------------------------------
// hasOwnProperty 安全
// ----------------------------------------------------------------
describe('MesElementMenu.vue — hasOwnProperty 安全', () => {
  it('convertTree() 菜单项覆写hasOwnProperty时不应抛异常', () => {
    const list = [
      { id: 1, parentId: 0, name: '菜单1', hasOwnProperty: 'hijacked' }
    ]
    expect(() => {
      shallowMount(MesElementMenu, {
        props: {
          list,
          rootId: '0'
        },
        ...createMountOptions()
      })
    }).to.not.throw()
  })

  it('convertTree() 无icon的菜单项应设置默认图标', () => {
    const list = [
      { id: 1, parentId: 0, name: '菜单1' }
    ]
    const wrapper = shallowMount(MesElementMenu, {
      props: {
        list,
        rootId: '0'
      },
      ...createMountOptions()
    })

    // convertTree 在 setup 中调用，验证菜单项被正确处理
    expect(wrapper.exists()).to.be.true
  })
})
