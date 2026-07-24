import { expect } from 'chai';
import TableExtend from '@/extension/custom/custom/Sys_Table_Extend.js';
import NumberRule from '@/extension/custom/custom/Base_NumberRule.js';
import { createSpy } from './helpers';

function tableExtendContext(path, action = 'Add') {
  return {
    $route: { path },
    table: {},
    editFormOptions: [[
      { field: 'TableName', readonly: false },
      { field: 'FieldName' },
      { field: 'FieldType' }
    ]],
    editFormFields: {},
    boxOptions: {},
    columnIndex: false,
    currentAction: action,
    const: { EDIT: 'Update' }
  };
}

describe('custom/base-data extension unit tests', () => {
  [
    ['/Sys_User_Extend', '用户字段扩展', '/Sys_User_Extend/', 'Sys_User'],
    ['/Base_Product_Extend', '产品定义字段扩展', '/Base_Product_Extend/', 'Base_Product'],
    ['/Base_Process_Extend', '工序字段扩展', '/Base_Process_Extend/', 'Base_Process'],
    ['/Base_MeritPay_Extend', '绩效工资配比字段扩展', '/Base_MeritPay_Extend/', 'Base_MeritPay'],
    ['/Base_DefectItem_Extend', '不良品项字段扩展', '/Base_DefectItem_Extend/', 'Base_DefectItem']
  ].forEach(([path, name, url, tableName]) => {
    it(`maps ${path} to its correct extended table`, () => {
      const ctx = tableExtendContext(path);
      TableExtend.methods.onInit.call(ctx);
      expect(ctx.table.cnName).to.equal(name);
      expect(ctx.table.url).to.equal(url);
      expect(ctx.editFormFields.TableName).to.equal(tableName);
      expect(ctx.editFormOptions[0][0].readonly).to.equal(true);
      expect(ctx.columnIndex).to.equal(true);
    });
  });

  it('locks table, field and type identifiers when editing an extension definition', () => {
    const ctx = tableExtendContext('/Base_Product_Extend', 'Update');
    TableExtend.methods.modelOpenAfter.call(ctx, {});
    expect(ctx.editFormOptions[0].map((x) => x.disabled)).to.deep.equal([true, true, true]);
    expect(ctx.editFormFields.TableName).to.equal('Base_Product');
  });

  it('keeps extension identifiers editable while adding a definition', () => {
    const ctx = tableExtendContext('/Base_Process_Extend', 'Add');
    TableExtend.methods.modelOpenAfter.call(ctx, {});
    expect(ctx.editFormOptions[0].map((x) => x.disabled)).to.deep.equal([false, false, false]);
  });

  it('clears all number-preview fragments before opening the model', () => {
    const ctx = {
      prefixVal: 'P',
      submitTimeVal: '2026',
      submitTimeText: '年',
      serialNumberVal: '001',
      serialNumberNine: '999'
    };
    NumberRule.methods.modelOpenBefore.call(ctx, {});
    expect(ctx).to.include({
      prefixVal: '', submitTimeVal: '', submitTimeText: '', serialNumberVal: '', serialNumberNine: ''
    });
  });

  it('rebuilds an existing number preview from prefix, date and serial width', () => {
    const submitTime = { field: 'SubmitTime', data: [{ key: 'yyyy', value: '年' }] };
    const serialNumber = { field: 'SerialNumber' };
    const ctx = {
      currentAction: 'update',
      editFormFields: {},
      getFormOption: (field) => field === 'SubmitTime' ? submitTime : serialNumber
    };
    NumberRule.methods.modelOpenAfter.call(ctx, { Prefix: 'P', SubmitTime: 'yyyy', SerialNumber: 3 });
    expect(ctx.editFormFields.NumberPreview).to.match(/^P\d{4}001$/);
    expect(serialNumber.extra.text).to.equal('例：999');
  });
});
