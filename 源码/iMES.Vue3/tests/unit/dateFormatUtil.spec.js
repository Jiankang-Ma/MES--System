import { expect } from 'chai'
import {
  formatTimeStamp,
  getNowDate,
  getMonthDays,
  getQuarterStartMonth,
  getWeekStartDate,
  getWeekEndDate,
  getLastWeekStartDate,
  getLastWeekEndDate,
  getMonthStartDate,
  getMonthEndDate,
  getLastMonthStartDate,
  getLastMonthEndDate,
  getQuarterStartDate,
  getQuarterEndDate,
  getNowDateSubtraction
} from '@/uitils/dateFormatUtil'

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatLocal(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

describe('uitils/dateFormatUtil.js', () => {
  describe('formatTimeStamp', () => {
    it('使用默认格式输出本地日期时间', () => {
      const date = new Date(2024, 1, 29, 8, 9, 10)

      expect(formatTimeStamp(date)).to.equal('2024-02-29 08:09:10')
    })

    it('支持自定义年月日和时分秒格式', () => {
      const date = new Date(2024, 10, 6, 7, 8, 9)

      expect(formatTimeStamp(date, 'yyyy/M/d h:m:s')).to.equal('2024/11/6 7:8:9')
      expect(formatTimeStamp(date, 'yy-MM-dd')).to.equal('24-11-06')
    })

    it('空值返回占位符', () => {
      expect(formatTimeStamp(null)).to.equal('-')
      expect(formatTimeStamp(undefined)).to.equal('-')
      expect(formatTimeStamp('')).to.equal('-')
    })

    it('数字零作为合法 Unix 时间戳格式化', () => {
      expect(formatTimeStamp(0)).to.equal(formatLocal(new Date(0)))
    })

    it('非法日期返回占位符而不是 NaN 日期', () => {
      expect(formatTimeStamp('not-a-date')).to.equal('-')
    })
  })

  describe('当前日期范围', () => {
    it('getNowDate 返回当前日期时间格式', () => {
      const before = new Date()
      const actual = getNowDate()
      const after = new Date()
      const candidates = [formatLocal(before), formatLocal(after)]

      expect(actual).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      expect(candidates).to.include(actual)
    })

    it('返回当前年份每个月的正确天数', () => {
      const year = new Date().getFullYear()

      for (let month = 0; month < 12; month++) {
        const expected = new Date(year, month + 1, 0).getDate()
        expect(getMonthDays(month), `month=${month}`).to.equal(expected)
      }
    })

    it('返回当前季度的起始月份', () => {
      const expected = Math.floor(new Date().getMonth() / 3) * 3

      expect(getQuarterStartMonth()).to.equal(expected)
    })

    it('本周范围为星期日至星期六', () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const end = addDays(start, 6)

      expect(getWeekStartDate()).to.equal(formatLocal(start))
      expect(getWeekEndDate()).to.equal(formatLocal(end))
    })

    it('上周开始日期为本周开始日期前七天', () => {
      const now = new Date()
      const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())

      expect(getLastWeekStartDate()).to.equal(formatLocal(addDays(thisWeekStart, -7)))
    })

    it('上周结束日期为本周开始日期前一天', () => {
      const now = new Date()
      const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())

      expect(getLastWeekEndDate()).to.equal(formatLocal(addDays(thisWeekStart, -1)))
    })

    it('本月范围覆盖当月第一天到最后一天', () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      expect(getMonthStartDate()).to.equal(formatLocal(start))
      expect(getMonthEndDate()).to.equal(formatLocal(end))
    })

    it('上月范围覆盖上月第一天到最后一天', () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)

      expect(getLastMonthStartDate()).to.equal(formatLocal(start))
      expect(getLastMonthEndDate()).to.equal(formatLocal(end))
    })

    it('本季度范围覆盖季度第一天到最后一天', () => {
      const now = new Date()
      const startMonth = Math.floor(now.getMonth() / 3) * 3
      const start = new Date(now.getFullYear(), startMonth, 1)
      const end = new Date(now.getFullYear(), startMonth + 3, 0)

      expect(getQuarterStartDate()).to.equal(formatLocal(start))
      expect(getQuarterEndDate()).to.equal(formatLocal(end))
    })

    it('按指定天数返回当前时间之前的日期', () => {
      const now = new Date()
      const expected = addDays(now, -7)

      expect(getNowDateSubtraction(7)).to.equal(formatLocal(expected))
    })
  })
})
