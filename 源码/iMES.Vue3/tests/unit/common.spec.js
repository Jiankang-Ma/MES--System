import { expect } from 'chai'
import common from '@/uitils/common'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

describe('uitils/common.js', () => {
  describe('XSS防护 - escapeHtml', () => {
    it('应转义HTML特殊字符', () => {
      const input = '<script>alert("XSS")</script>'
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      expect(common.escapeHtml(input)).to.equal(expected)
    })

    it('应转义单引号', () => {
      expect(common.escapeHtml("It's a test")).to.equal("It&#039;s a test")
    })

    it('应处理空值和undefined', () => {
      expect(common.escapeHtml(null)).to.equal(null)
      expect(common.escapeHtml(undefined)).to.equal(undefined)
      expect(common.escapeHtml('')).to.equal('')
    })

    it('应保留普通文本不变', () => {
      expect(common.escapeHtml('Hello World')).to.equal('Hello World')
    })

    it('应安全处理数字等非字符串值', () => {
      expect(common.escapeHtml(0)).to.equal('0')
      expect(common.escapeHtml(12.5)).to.equal('12.5')
    })
  })

  describe('URL安全 - isValidUrl', () => {
    it('应允许安全协议(http, https, ftp, mailto, tel)', () => {
      expect(common.isValidUrl('http://example.com')).to.equal(true)
      expect(common.isValidUrl('https://example.com')).to.equal(true)
      expect(common.isValidUrl('ftp://example.com/file.txt')).to.equal(true)
      expect(common.isValidUrl('mailto:user@example.com')).to.equal(true)
      expect(common.isValidUrl('tel:123456789')).to.equal(true)
    })

    it('应拒绝javascript协议', () => {
      expect(common.isValidUrl('javascript:alert(1)')).to.equal(false)
      expect(common.isValidUrl('javascript://example.com')).to.equal(false)
    })

    it('应拒绝data协议', () => {
      expect(common.isValidUrl('data:text/html,<script>alert(1)</script>')).to.equal(false)
    })

    it('应拒绝空值和无效URL', () => {
      expect(common.isValidUrl(null)).to.equal(false)
      expect(common.isValidUrl(undefined)).to.equal(false)
      expect(common.isValidUrl('')).to.equal(false)
      expect(common.isValidUrl('not-a-url')).to.equal(false)
    })
  })

  describe('JSON安全解析 - safeJsonParse', () => {
    it('应正确解析有效JSON', () => {
      const json = '{"name":"test","value":123}'
      expect(common.safeJsonParse(json)).to.deep.equal({ name: 'test', value: 123 })
    })

    it('解析失败时应返回默认值', () => {
      expect(common.safeJsonParse('invalid json')).to.equal(null)
      expect(common.safeJsonParse('invalid json', {})).to.deep.equal({})
      expect(common.safeJsonParse('invalid json', [])).to.deep.equal([])
    })

    it('应处理空值', () => {
      expect(common.safeJsonParse(null)).to.equal(null)
      expect(common.safeJsonParse(undefined)).to.equal(null)
      expect(common.safeJsonParse('')).to.equal(null)
    })
  })

  describe('文件下载安全 - dowloadFile', () => {
    it('不应打开javascript协议的链接', () => {
      const previousWindowOpen = global.window.open
      let openedUrl = null
      global.window.open = (url) => { openedUrl = url }

      try {
        common.dowloadFile('javascript:alert(1)', 'test')
        expect(openedUrl).to.equal(null)
      } finally {
        global.window.open = previousWindowOpen
      }
    })

    it('应打开安全协议的链接', () => {
      const previousWindowOpen = global.window.open
      let openedUrl = null
      global.window.open = (url) => { openedUrl = url }

      try {
        common.dowloadFile('https://example.com/file.pdf', 'test')
        expect(openedUrl).to.equal('https://example.com/file.pdf')
      } finally {
        global.window.open = previousWindowOpen
      }
    })
  })

  describe('树结构', () => {
    it('将平铺数据转换为多层树，并保留多个根节点', () => {
      const data = clone([
        { id: 1, parentId: 0, name: '根节点 A' },
        { id: 2, parentId: 1, name: '子节点 A-1' },
        { id: 3, parentId: 2, name: '孙节点 A-1-1' },
        { id: 4, parentId: 0, name: '根节点 B' }
      ])

      const tree = common.convertTree(data)

      expect(tree.map(node => node.id)).to.deep.equal([1, 4])
      expect(tree[0].children.map(node => node.id)).to.deep.equal([2])
      expect(tree[0].children[0].children.map(node => node.id)).to.deep.equal([3])
      expect(tree.every(node => node.isRoot)).to.equal(true)
    })

    it('过滤隐藏节点，并保留仍可显示的后代节点', () => {
      const data = clone([
        { id: 1, parentId: 0 },
        { id: 2, parentId: 1, hidden: true },
        { id: 3, parentId: 2 }
      ])

      const tree = common.convertTree(data)

      expect(tree.map(node => node.id)).to.deep.equal([1, 3])
      expect(tree[0].children).to.equal(undefined)
    })

    it('把找不到父节点的孤立节点作为根节点', () => {
      const tree = common.convertTree([{ id: 10, parentId: 999 }])

      expect(tree).to.have.length(1)
      expect(tree[0]).to.include({ id: 10, parentId: 999, isRoot: true })
    })

    it('遇到两节点循环依赖时能够安全返回', () => {
      const data = [{ id: 1, parentId: 2 }, { id: 2, parentId: 1 }]

      const tree = common.convertTree(data)

      expect(tree.map(node => node.id)).to.have.members([1, 2])
    })

    it('每个生成的树节点只触发一次 callback', () => {
      const calls = []
      const data = [{ id: 1, parentId: 0 }, { id: 2, parentId: 1 }]

      common.convertTree(data, node => calls.push(node.id))

      expect(calls).to.deep.equal([1, 2])
    })

    it('按根节点到目标节点的顺序返回全部父级', () => {
      const data = [
        { id: 1, parentId: 0 },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 }
      ]

      expect(common.getTreeAllParent(3, data).map(node => node.id)).to.deep.equal([1, 2, 3])
    })

    it('父级查询在节点不存在或输入不是数组时返回空数组', () => {
      expect(common.getTreeAllParent(999, [])).to.deep.equal([])
      expect(common.getTreeAllParent(1, null)).to.deep.equal([])
    })

    it('父级查询能够处理自引用节点', () => {
      const data = [{ id: 1, parentId: 1 }]

      const nodes = common.getTreeAllParent(1, data)

      expect(nodes.map(node => node.id)).to.deep.equal([1])
    })

    it('返回目标节点及其所有层级子节点', () => {
      const data = [
        { id: 1, parentId: 0 },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 1 },
        { id: 4, parentId: 2 }
      ]

      const ids = common.getTreeAllChildren(1, data).map(node => node.id)

      expect(ids).to.have.members([1, 2, 3, 4])
      expect(common.getTreeAllChildrenId(1, data)).to.have.members([1, 2, 3, 4])
    })

    it('子级查询在节点不存在或输入不是数组时返回空数组', () => {
      expect(common.getTreeAllChildren(999, [])).to.deep.equal([])
      expect(common.getTreeAllChildren(1, undefined)).to.deep.equal([])
    })
  })

  describe('日期辅助', () => {
    it('加天数时支持跨月并保留时间部分', () => {
      expect(common.addDays('2024-01-31 08:09:10', 1)).to.equal('2024-02-01 08:09:10')
    })

    it('加天数时支持闰日和跨年', () => {
      expect(common.addDays('2024-02-28', 1)).to.equal('2024-02-29')
      expect(common.addDays('2024-12-31', 1)).to.equal('2025-01-01')
    })

    it('天数为零时原样返回输入', () => {
      expect(common.addDays('2024-05-06 01:02:03', 0)).to.equal('2024-05-06 01:02:03')
    })

    it('getDate 根据参数返回日期或日期时间', () => {
      expect(common.getDate(false)).to.match(/^\d{4}-\d{2}-\d{2}$/)
      expect(common.getDate(true)).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('格式校验', () => {
    it('识别合法手机号并拒绝明显非法手机号', () => {
      expect(common.isPhone('13812345678')).to.equal(true)
      expect(common.isPhone('12812345678')).to.equal(false)
      expect(common.isPhone('1381234567')).to.equal(false)
    })

    it('手机号第二位不接受逗号字符', () => {
      expect(common.isPhone('1,123456789')).to.equal(false)
    })

    it('识别合法整数和小数', () => {
      for (const value of ['0', '12', '-12', '12.50', '-0.25']) {
        expect(common.isDecimal(value), value).to.equal(true)
      }
      for (const value of ['0', '12', '-12']) {
        expect(common.isNumber(value), value).to.equal(true)
      }
    })

    it('小数校验拒绝非小数点分隔符', () => {
      expect(common.isDecimal('12a50')).to.equal(false)
    })

    it('小数校验拒绝只有负号的输入', () => {
      expect(common.isDecimal('-')).to.equal(false)
    })

    it('整数校验拒绝只有负号的输入', () => {
      expect(common.isNumber('-')).to.equal(false)
    })

    it('整数校验拒绝小数和字母', () => {
      expect(common.isNumber('12.5')).to.equal(false)
      expect(common.isNumber('12a')).to.equal(false)
    })

    it('识别常见邮箱并拒绝非法邮箱', () => {
      expect(common.isMail('user.name@example.com')).to.equal(true)
      expect(common.isMail('user@')).to.equal(false)
      expect(common.isMail('@example.com')).to.equal(false)
    })
  })

  describe('URL', () => {
    it('识别 HTTP、HTTPS、FTP 和 localhost 地址', () => {
      const urls = [
        'http://example.com/path?a=1',
        'https://example.com:8080/path',
        'ftp://example.com/file.txt',
        'http://localhost:9991/api/test'
      ]

      for (const url of urls) {
        expect(common.isUrl(url), url).to.equal(true)
      }
    })

    it('拒绝相对路径', () => {
      expect(common.isUrl('/Upload/file.png')).to.equal(false)
    })

    it('拒绝超过范围的 IPv4 地址', () => {
      expect(common.isUrl('http://999.999.999.999/file')).to.equal(false)
    })

    it('支持长度超过六位的现代顶级域名', () => {
      expect(common.isUrl('https://example.technology/path')).to.equal(true)
    })

    it('matchUrlIp 匹配真实主机而不是相似字符串', () => {
      expect(common.matchUrlIp('https://api.example.com/files/a.png', 'https://api.example.com')).to.equal(true)
      expect(common.matchUrlIp('https://api.example.com.evil.test/files/a.png', 'https://api.example.com')).to.equal(false)
    })

    it('图片绝对地址保持不变，相对地址与后台地址拼接', () => {
      expect(common.getImgSrc('https://cdn.example.com/a.png', 'http://localhost:9991')).to.equal('https://cdn.example.com/a.png')
      expect(common.getImgSrc('/Upload/a.png', 'http://localhost:9991')).to.equal('http://localhost:9991/Upload/a.png')
    })

    it('图片地址拼接时不会产生重复斜杠', () => {
      expect(common.getImgSrc('/Upload/a.png', 'http://localhost:9991/')).to.equal('http://localhost:9991/Upload/a.png')
    })

    it('downloadImg 在请求成功后调用传入的 callback', () => {
      const previousWindow = global.window
      const previousRequest = global.XMLHttpRequest
      const callbackValues = []

      class FakeXMLHttpRequest {
        open(method, url, async) {
          this.method = method
          this.url = url
          this.async = async
        }

        setRequestHeader() {}

        send() {
          this.status = 200
          this.response = { file: true }
          this.onload()
        }
      }

      global.window = { URL: { createObjectURL: () => 'blob:test-file' } }
      global.XMLHttpRequest = FakeXMLHttpRequest

      try {
        common.downloadImg({
          url: '/Upload/a.png',
          backGroundUrl: 'http://localhost:9991',
          callback: value => callbackValues.push(value)
        })
        expect(callbackValues).to.deep.equal(['blob:test-file'])
      } finally {
        global.window = previousWindow
        global.XMLHttpRequest = previousRequest
      }
    })
  })
})
