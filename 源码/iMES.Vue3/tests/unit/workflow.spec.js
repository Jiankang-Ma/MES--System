import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { ForceDirected } from '@/components/workflow/force-directed'
import { getDataDefault } from '@/components/workflow/data_default'
import { getConnector, hasLine, hashOppositeLine, uuid } from '@/components/workflow/utils'
import FlowNode from '@/components/workflow/node.vue'
import FlowNodeForm from '@/components/workflow/node_form.vue'
import Workflow from '@/components/workflow/workflow.vue'

describe('components/workflow — 流程图基础规则', () => {
  it('WFLOW-01 hasLine() 只识别同方向且存在的连线', () => {
    const data = { lineList: [{ from: 'start', to: 'review' }] }

    expect(hasLine(data, 'start', 'review')).to.equal(true)
    expect(hasLine(data, 'review', 'start')).to.equal(false)
    expect(hasLine(data, 'start', 'finish')).to.equal(false)
  })

  it('WFLOW-02 hashOppositeLine() 用于阻止两节点间反向回环', () => {
    const data = { lineList: [{ from: 'start', to: 'review' }] }

    expect(hashOppositeLine(data, 'review', 'start')).to.equal(true)
    expect(hashOppositeLine(data, 'start', 'review')).to.equal(false)
  })

  it('WFLOW-03 getConnector() 应按 source 和 target 查询首条连线', () => {
    let query
    const connection = { id: 'start-review' }
    const jsp = {
      getConnections(value) {
        query = value
        return [connection]
      }
    }

    expect(getConnector(jsp, 'start', 'review')).to.equal(connection)
    expect(query).to.deep.equal({ source: 'start', target: 'review' })
  })

  it('WFLOW-04 uuid() 返回可作为节点 ID 的非空字母数字串', () => {
    const id = uuid()

    expect(id).to.match(/^[a-z0-9]+$/)
    expect(id.length).to.be.at.least(1)
    expect(id.length).to.be.at.most(10)
  })

  it('WFLOW-05 ForceDirected() 保留节点/连线并产出 px 坐标', () => {
    const oldRandom = Math.random
    Math.random = () => 0.5
    const data = {
      nodeList: [{ id: 'A' }, { id: 'B' }],
      lineList: [{ from: 'A', to: 'B' }]
    }

    try {
      const result = ForceDirected(data)

      expect(result).to.equal(data)
      expect(result.nodeList).to.have.length(2)
      expect(result.lineList).to.deep.equal([{ from: 'A', to: 'B' }])
      result.nodeList.forEach((node) => {
        expect(node.left).to.match(/px$/)
        expect(node.top).to.match(/px$/)
        expect(node.x).to.equal(undefined)
        expect(node.y).to.equal(undefined)
      })
    } finally {
      Math.random = oldRandom
    }
  })

  it('WFLOW-06 默认流程包含两个节点和一条有向连线', () => {
    const data = getDataDefault()

    expect(data.nodeList).to.have.length(2)
    expect(data.lineList).to.have.length(1)
    expect(data.lineList[0]).to.deep.equal({
      from: data.nodeList[0].id,
      to: data.nodeList[1].id
    })
  })
})

describe('components/workflow/node.vue — 节点交互', () => {
  function mountNode(overrides = {}) {
    return shallowMount(FlowNode, {
      props: {
        node: {
          id: 'node-1',
          name: '审核',
          left: '20px',
          top: '40px',
          ...overrides.node
        },
        activeElement: overrides.activeElement || { type: undefined }
      }
    })
  }

  it('WFLOW-07 选中节点时应用 active class，并保留节点坐标', () => {
    const wrapper = mountNode({ activeElement: { type: 'node', nodeId: 'node-1' } })

    expect(wrapper.vm.nodeContainerClass['ef-node-active']).to.equal(true)
    expect(wrapper.vm.nodeContainerStyle).to.deep.equal({ left: '20px', top: '40px' })
  })

  it('WFLOW-08 点击、删除与拖动结束应发出正确事件', () => {
    const wrapper = mountNode()
    wrapper.vm.clickNode()
    wrapper.vm.delNode()
    wrapper.vm.$refs.node.style.left = '60px'
    wrapper.vm.$refs.node.style.top = '80px'
    wrapper.vm.changeNodeSite()

    expect(wrapper.emitted('clickNode')[0]).to.deep.equal(['node-1'])
    expect(wrapper.emitted('delNode')).to.have.length(1)
    expect(wrapper.emitted('changeNodeSite')[0][0]).to.deep.equal({
      nodeId: 'node-1', left: '60px', top: '80px'
    })
  })

  it('WFLOW-09 未移动节点时不应发出 changeNodeSite', () => {
    const wrapper = mountNode()
    wrapper.vm.$refs.node.style.left = '20px'
    wrapper.vm.$refs.node.style.top = '40px'
    wrapper.vm.changeNodeSite()

    expect(wrapper.emitted('changeNodeSite')).to.equal(undefined)
  })

  it('WFLOW-10 只读节点不允许从图标拖出连线', () => {
    const wrapper = mountNode({ node: { viewOnly: true } })

    expect(wrapper.vm.nodeIcoClass['flow-node-drag']).to.equal(false)
  })
})

describe('components/workflow/node_form.vue — 节点配置规则', () => {
  function mountNodeForm() {
    return shallowMount(FlowNodeForm, {
      global: {
        plugins: [{
          install(app) {
            app.config.globalProperties.http = { get: () => Promise.resolve({}) }
            app.config.globalProperties.$message = { success: () => {} }
          }
        }],
        stubs: { MesForm: true, 'el-form': true, 'el-button': true }
      }
    })
  }

  it('WFLOW-11 审批类型切换时只显示对应的人员、角色或部门字段', () => {
    const wrapper = mountNodeForm()

    wrapper.vm.nodeTypeChange(2)
    const fields = Object.fromEntries(
      wrapper.vm.formRules.flat().filter(item => ['userId', 'roleId', 'deptId'].includes(item.field))
        .map(item => [item.field, item.hidden])
    )

    expect(fields).to.deep.equal({ userId: true, roleId: false, deptId: true })
  })

  it('WFLOW-12 nodeInit() 克隆节点配置，避免编辑未保存时污染流程数据', () => {
    const wrapper = mountNodeForm()
    const source = {
      id: 'n1', name: '审核', nodeType: '2', roleId: 'r1',
      left: '10px', top: '20px', ico: 'el-icon-user', state: 'success'
    }
    const data = { nodeList: [source] }

    wrapper.vm.nodeInit(data, 'n1')
    wrapper.vm.node.name = '尚未保存的新名称'

    expect(wrapper.vm.type).to.equal('node')
    expect(wrapper.vm.node.nodeType).to.equal(2)
    expect(source.name).to.equal('审核')
  })

  it('WFLOW-13 保存节点时只更新命中的节点并要求父级重绘', () => {
    const wrapper = mountNodeForm()
    wrapper.vm.data = { nodeList: [{ id: 'n1', name: '旧名称', left: '1px', top: '2px' }, { id: 'n2', name: '其他节点' }] }
    Object.assign(wrapper.vm.node, {
      id: 'n1', name: '新名称', left: '30px', top: '40px', ico: 'el-icon-user', state: 'success', stepValue: 'approve'
    })

    wrapper.vm.save()

    expect(wrapper.vm.data.nodeList[0]).to.include({ name: '新名称', left: '30px', top: '40px', stepValue: 'approve' })
    expect(wrapper.vm.data.nodeList[1].name).to.equal('其他节点')
    expect(wrapper.emitted('repaintEverything')[0][0]).to.equal(wrapper.vm.node)
  })

  it('WFLOW-14 保存连线名称时传递完整起止节点与标签', () => {
    const wrapper = mountNodeForm()
    wrapper.vm.line = { from: 'n1', to: 'n2', label: '审核通过' }

    wrapper.vm.saveLine()

    expect(wrapper.emitted('setLineLabel')[0]).to.deep.equal(['n1', 'n2', '审核通过'])
  })
})

describe('components/workflow/workflow.vue — 流程编辑规则', () => {
  it('WFLOW-15 changeNodeSite() 只更新被拖动节点的位置', () => {
    const ctx = {
      data: { nodeList: [{ id: 'n1', left: '1px', top: '2px' }, { id: 'n2', left: '3px', top: '4px' }] }
    }

    Workflow.methods.changeNodeSite.call(ctx, { nodeId: 'n2', left: '30px', top: '40px' })

    expect(ctx.data.nodeList).to.deep.equal([
      { id: 'n1', left: '1px', top: '2px' },
      { id: 'n2', left: '30px', top: '40px' }
    ])
  })

  it('WFLOW-16 setLineLabel() 同步画布连线样式与流程数据', () => {
    const calls = []
    const connection = {
      removeClass: value => calls.push(['removeClass', value]),
      addClass: value => calls.push(['addClass', value]),
      setLabel: value => calls.push(['setLabel', value])
    }
    const ctx = {
      jsPlumb: { getConnections: () => [connection] },
      data: { lineList: [{ from: 'n1', to: 'n2', label: '' }] }
    }

    Workflow.methods.setLineLabel.call(ctx, 'n1', 'n2', '审核通过')

    expect(calls).to.deep.equal([
      ['addClass', 'flowLabel'], ['setLabel', { label: '审核通过' }]
    ])
    expect(ctx.data.lineList[0].label).to.equal('审核通过')
  })

  it('WFLOW-17 addNode() 拖入画布后避开重名并初始化连线端点', () => {
    const madeSources = []
    const madeTargets = []
    const draggable = []
    const ctx = {
      data: { nodeList: [{ id: 'existing', name: '审批' }] },
      $refs: {
        efContainer: {
          scrollLeft: 5,
          scrollTop: 7,
          getBoundingClientRect: () => ({ x: 10, y: 20, width: 500, height: 400 })
        }
      },
      $nextTick(callback) { callback.call(this) },
      $message: { error: () => {} },
      getUUID: () => 'new-node',
      jsplumbSourceOptions: { marker: 'source' },
      jsplumbTargetOptions: { marker: 'target' },
      jsPlumb: {
        makeSource: (...args) => madeSources.push(args),
        makeTarget: (...args) => madeTargets.push(args),
        draggable: (...args) => draggable.push(args)
      }
    }

    Workflow.methods.addNode.call(ctx, { originalEvent: { clientX: 110, clientY: 120 } },
      { name: '审批', type: 'task', ico: 'el-icon-user' }, {})

    expect(ctx.data.nodeList[1]).to.include({ id: 'new-node', name: '审批1', type: 'task', left: '20px', top: '91px' })
    expect(madeSources[0][0]).to.equal('new-node')
    expect(madeTargets[0][0]).to.equal('new-node')
    expect(draggable[0][0]).to.equal('new-node')
  })
})
