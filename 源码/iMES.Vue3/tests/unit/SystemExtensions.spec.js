import { expect } from 'chai';
import Dictionary from '@/extension/system/Sys_Dictionary.js';
import Role from '@/extension/system/Sys_Role.js';
import FormCollectionObject from '@/extension/system/form/FormCollectionObject.js';
import { createSpy } from './helpers';

describe('system extension unit tests', () => {
  it('configures dictionary detail editing, minimum parent and order summary', () => {
    const parent = { field: 'ParentId' };
    const dbSql = { field: 'DbSql' };
    const order = { field: 'OrderNo' };
    const ctx = {
      detailOptions: { clickEdit: false, columns: [order] },
      editFormOptions: [[parent, dbSql]],
      boxOptions: {}
    };
    Dictionary.methods.onInit.call(ctx);
    expect(ctx.detailOptions.clickEdit).to.equal(true);
    expect(parent.min).to.equal(0);
    expect(dbSql.placeholder).to.contain('select orderType as key');
    expect(order.summary).to.equal(true);
    expect(ctx.boxOptions.saveClose).to.equal(false);
  });

  it('accepts an empty custom dictionary SQL statement', () => {
    const ctx = { editFormFields: { DbSql: '' }, $message: { error: createSpy() } };
    expect(Dictionary.methods.saveBefore.call(ctx, {})).to.equal(true);
    expect(ctx.$message.error.calls).to.have.length(0);
  });

  it('accepts custom dictionary SQL containing key and value fields', () => {
    const ctx = {
      editFormFields: { DbSql: 'select Code as key, Name as value from Products' },
      $message: { error: createSpy() }
    };
    expect(Dictionary.methods.saveBefore.call(ctx, {})).to.equal(true);
  });

  ['select Code as key from Products', 'select Name as value from Products'].forEach((sql) => {
    it(`rejects incomplete dictionary SQL: ${sql}`, () => {
      const ctx = { editFormFields: { DbSql: sql }, $message: { error: createSpy() } };
      expect(Dictionary.methods.saveBefore.call(ctx, {})).to.equal(false);
      expect(ctx.$message.error.calls[0][0]).to.contain('必须包括key/value字段');
    });
  });

  it('uses the same dictionary SQL guard for add and update', () => {
    const ctx = {
      editFormFields: { DbSql: 'select Code as key' },
      $message: { error: createSpy() },
      saveBefore: Dictionary.methods.saveBefore
    };
    expect(Dictionary.methods.addBefore.call(ctx, {})).to.equal(false);
    expect(Dictionary.methods.updateBefore.call(ctx, {})).to.equal(false);
  });

  it('renames ParentId to 上级角色 in grid and form and permits parent selection', () => {
    const column = { field: 'ParentId', title: 'ParentId' };
    const form = { field: 'ParentId', title: 'ParentId' };
    const ctx = { columns: [column], editFormOptions: [[form]] };
    Role.methods.onInit.call(ctx);
    expect(column.title).to.equal('上级角色');
    expect(form.title).to.equal('上级角色');
    expect(form.changeOnSelect).to.equal(true);
  });

  ['addAfter', 'updateAfter', 'delAfter'].forEach((method) => {
    it(`${method} refreshes role dictionary cache`, () => {
      const ctx = { initDicKeys: createSpy() };
      expect(Role.methods[method].call(ctx, {})).to.equal(true);
      expect(ctx.initDicKeys.calls[0]).to.deep.equal([true]);
    });
  });

  it('builds collection columns from saved form options and searches the selected form', () => {
    const ctx = { columns: [{ field: 'old' }], search: createSpy() };
    const item = {
      formId: 7,
      formOptions: JSON.stringify({ formOptions: [[{ title: '产品', field: 'ProductName', type: 'text' }]] })
    };
    FormCollectionObject.methods.loadById.call(ctx, item);
    expect(ctx.formId).to.equal(7);
    expect(ctx.columns.map((x) => x.field)).to.deep.equal(['Creator', 'CreateDate', 'ProductName']);
    expect(ctx.search.calls).to.have.length(1);
  });

  it('adds the selected form ID to export and search conditions', () => {
    const exportData = {};
    const searchData = { wheres: [] };
    const ctx = { formId: 9 };
    expect(FormCollectionObject.methods.exportBefore.call(ctx, exportData)).to.equal(true);
    expect(exportData.Value).to.equal(9);
    expect(FormCollectionObject.methods.searchBefore.call(ctx, searchData)).to.equal(true);
    expect(searchData.wheres).to.deep.equal([{ name: 'FormId', value: 9 }]);
  });

  it('flattens saved collection arrays while removing null values', () => {
    const rows = [{
      FormData: JSON.stringify({ Tags: ['A', null, undefined, 'B'], Qty: 3 })
    }];
    expect(FormCollectionObject.methods.searchAfter.call({}, rows)).to.equal(true);
    expect(rows[0].Tags).to.equal('A,B');
    expect(rows[0].Qty).to.equal(3);
  });
});
