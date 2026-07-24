import { expect } from 'chai';
import DefectDistribution from '@/extension/report/report/View_DefectItemDistribute.js';
import DefectSummary from '@/extension/report/report/View_DefectItemSummary.js';
import EmployeePerformance from '@/extension/report/report/View_EmployeePerformance.js';
import OutputStatistics from '@/extension/report/report/View_OutputStatistics.js';
import ProductionReport from '@/extension/report/report/View_ProductionReport.js';
import SalaryReport from '@/extension/report/report/View_SalaryReport.js';
import { createSpy } from './helpers';

function reportContext(columns = []) {
  return {
    columns,
    columnIndex: false,
    summary: false,
    labelWidth: 0,
    tableMaxHeight: 0,
    setFiexdSearchForm: createSpy()
  };
}

describe('report extension unit tests', () => {
  before(() => {
    Object.defineProperty(document.body, 'clientHeight', { configurable: true, value: 1000 });
  });

  it('configures defect distribution layout, date formatting and quantity summary', () => {
    const createDate = { field: 'CreateDate' };
    const qty = { field: 'Qty' };
    const ctx = reportContext([createDate, qty]);
    DefectDistribution.methods.onInit.call(ctx);
    DefectDistribution.methods.onInited.call(ctx);
    expect(ctx.columnIndex).to.equal(true);
    expect(ctx.summary).to.equal(true);
    expect(ctx.labelWidth).to.equal(120);
    expect(ctx.setFiexdSearchForm.calls[0]).to.deep.equal([true]);
    expect(createDate.formatter({ CreateDate: '2026-07-24' })).to.equal('2026-07-24');
    expect(qty.summary).to.equal(true);
    expect(ctx.tableMaxHeight).to.equal(740);
  });

  it('configures output statistics date, table summary and two quantity totals', () => {
    const createDate = { field: 'CreateDate' };
    const good = { field: 'GoodQty' };
    const plan = { field: 'PlanQty' };
    const other = { field: 'ProductName' };
    const ctx = reportContext([createDate, good, plan, other]);
    OutputStatistics.methods.onInit.call(ctx);
    OutputStatistics.methods.onInited.call(ctx);
    expect(ctx.summary).to.equal(true);
    expect(good.summary).to.equal(true);
    expect(plan.summary).to.equal(true);
    expect(other.summary).to.equal(undefined);
    expect(createDate.formatter({ CreateDate: '2026-07-24' })).to.equal('2026-07-24');
  });

  it('configures salary report date and all monetary/count summaries', () => {
    const reportDate = { field: 'ReportDate' };
    const all = { field: 'ReportAll' };
    const salary = { field: 'Salary' };
    const applied = { field: 'AlreadyAppNumber' };
    const ctx = reportContext([reportDate, all, salary, applied]);
    SalaryReport.methods.onInit.call(ctx);
    SalaryReport.methods.onInited.call(ctx);
    expect(ctx.summary).to.equal(true);
    expect(reportDate.formatter({ ReportDate: '2026-07-24' })).to.equal('2026-07-24');
    expect([all.summary, salary.summary, applied.summary]).to.deep.equal([true, true, true]);
  });

  it('enables fixed search layout for employee performance', () => {
    const ctx = reportContext();
    EmployeePerformance.methods.onInit.call(ctx);
    expect(ctx.columnIndex).to.equal(true);
    expect(ctx.setFiexdSearchForm.calls[0]).to.deep.equal([true]);
    expect(ctx.tableMaxHeight).to.equal(740);
  });

  it('sets report-specific basic layout for defect and production summaries', () => {
    const defect = reportContext();
    DefectSummary.methods.onInit.call(defect);
    expect(defect.columnIndex).to.equal(true);
    expect(defect.labelWidth).to.equal(120);

    const production = reportContext();
    ProductionReport.methods.onInit.call(production);
    expect(production.columnIndex).to.equal(true);
  });

  [
    DefectDistribution,
    DefectSummary,
    EmployeePerformance,
    OutputStatistics,
    ProductionReport,
    SalaryReport
  ].forEach((extension, index) => {
    it(`keeps report ${index + 1} search/add/update pass-through contracts`, () => {
      expect(extension.methods.searchBefore.call({}, {})).to.equal(true);
      expect(extension.methods.searchAfter.call({}, [])).to.equal(true);
      expect(extension.methods.addBefore.call({}, {})).to.equal(true);
      expect(extension.methods.updateBefore.call({}, {})).to.equal(true);
    });
  });
});
