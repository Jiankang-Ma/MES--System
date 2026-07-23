import { expect } from 'chai'
import common from '@/uitils/common'
import * as dateFormatUtil from '@/uitils/dateFormatUtil'
import ViewGridCustomColumn from '@/components/basic/ViewGrid/ViewGridCustomColumn'
import { installLocalStorageMock } from './helpers/localStorageMock'

describe('前端单元测试基建', () => {
  beforeEach(() => {
    installLocalStorageMock()
  })

  it('能够加载本阶段三个目标模块', () => {
    expect(common).to.be.an('object')
    expect(dateFormatUtil.formatTimeStamp).to.be.a('function')
    expect(ViewGridCustomColumn).to.be.an('object')
  })

  it('提供用户列缓存测试所需的 localStorage 环境', () => {
    const key = 'imes:test:local-storage'

    localStorage.setItem(key, 'ready')

    expect(localStorage.getItem(key)).to.equal('ready')
    localStorage.removeItem(key)
  })
})
