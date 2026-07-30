import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import WorkShopBoard from '@/views/dashboard/WorkShopBoard.vue'
import WorkOrderSchedule from '@/views/dashboard/WorkOrderSchedule.vue'

function expectDashboardLink(Component, expectedUrl, expectedText) {
  const wrapper = shallowMount(Component)
  const link = wrapper.get('a')

  expect(wrapper.text()).to.include(expectedText)
  expect(link.attributes('href')).to.equal(expectedUrl)
  expect(link.attributes('target')).to.equal('_blank')
  expect(link.attributes('rel')).to.equal('noopener noreferrer')
}

describe('dashboard external link pages', () => {
  it('WH-BOARD-01 车间生产管控仅提供安全的手动跳转链接', () => {
    expectDashboardLink(
      WorkShopBoard,
      'http://board.625sc.com:9095/index.html#/aj/bP3fTAG8',
      '车间生产管控'
    )
  })

  it('WH-BOARD-02 工单执行进度仅提供安全的手动跳转链接', () => {
    expectDashboardLink(
      WorkOrderSchedule,
      'http://board.625sc.com:9095/index.html#/aj/2kEYF9UY',
      '工单执行进度'
    )
  })
})
