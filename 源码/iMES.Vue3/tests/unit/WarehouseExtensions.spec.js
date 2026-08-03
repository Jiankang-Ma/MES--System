import { expect } from 'chai';
import WareHouseBill from '@/extension/warehouse/warehouse/Ware_WareHouseBill.js';
import OutWareHouseBill from '@/extension/warehouse/warehouse/Ware_OutWareHouseBill.js';
import StockBalance from '@/extension/warehouse/warehouse/View_StockBalance.js';
import WareInOutDetail from '@/extension/warehouse/warehouse/View_WareInOutDetail.js';
import { createSpy } from './helpers';

function initBill(extension, selected = []) {
  const error = createSpy();
  const open = createSpy();
  const ctx = {
    single: false,
    columnIndex: false,
    buttons: [{}, {}, {}, {}],
    detailOptions: { clickEdit: false, buttons: [{ name: '新增' }] },
    http: { ipAddress: 'http://localhost:9991/' },
    $error: error,
    $refs: {
      table: {
        getSelected: () => selected,
        $refs: { table: { toggleRowSelection: createSpy() } }
      },
      modelHeader: { open: createSpy() },
      gridFooter: { rowClick: createSpy() }
    }
  };
  extension.methods.onInit.call(ctx);
  const printButton = ctx.buttons.find((x) => x.name === '打印');
  return { ctx, printButton, error, open };
}

describe('warehouse extension unit tests', () => {
  let originalOpen;

  beforeEach(() => {
    originalOpen = window.open;
    window.open = createSpy();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('configures inbound warehouse bills for single selection and cell editing', () => {
    const { ctx } = initBill(WareHouseBill);
    expect(ctx.single).to.equal(true);
    expect(ctx.columnIndex).to.equal(true);
    expect(ctx.detailOptions.clickEdit).to.equal(true);
  });

  it('blocks inbound printing when no row is selected', () => {
    const { ctx, printButton, error } = initBill(WareHouseBill, []);
    printButton.onClick.call(ctx);
    expect(error.calls[0][0]).to.equal('请选择要编辑的行!');
    expect(window.open.calls).to.have.length(0);
  });

  it('blocks inbound printing when multiple rows are selected', () => {
    const { ctx, printButton, error } = initBill(WareHouseBill, [{}, {}]);
    printButton.onClick.call(ctx);
    expect(error.calls[0][0]).to.equal('只能选择一行数据进行编辑!');
  });

  it('opens the inbound print designer for exactly one bill', () => {
    const { ctx, printButton } = initBill(WareHouseBill, [{ WareHouseBill_Id: 17 }]);
    printButton.onClick.call(ctx);
    expect(window.open.calls[0]).to.deep.equal([
      'http://localhost:9991/Print-Designer/print.html?cat=Ware_WareHouseBill&id=17',
      '_blank'
    ]);
  });

  it('opens the outbound print designer with the outbound primary key', () => {
    const { ctx, printButton } = initBill(OutWareHouseBill, [{ OutWareHouseBill_Id: 23 }]);
    printButton.onClick.call(ctx);
    expect(window.open.calls[0][0]).to.contain('cat=Ware_OutWareHouseBill&id=23');
  });

  it('replaces the default detail add button with a product selector', () => {
    const { ctx } = initBill(WareHouseBill);
    WareHouseBill.methods.onInited.call(ctx);
    expect(ctx.detailOptions.buttons[0].name).to.equal('选择产品');
    ctx.detailOptions.buttons[0].onClick.call(ctx);
    expect(ctx.$refs.modelHeader.open.calls).to.have.length(1);
  });

  it('forwards the first search row to the warehouse footer', () => {
    const { ctx } = initBill(WareHouseBill);
    ctx.$nextTick = (callback) => callback();
    const first = { WareHouseBill_Id: 1 };
    expect(WareHouseBill.methods.searchAfter.call(ctx, [first])).to.equal(true);
    expect(ctx.$refs.gridFooter.rowClick.calls[0]).to.deep.equal([first, 'wareHouse']);
  });

  it('selects and forwards a clicked inbound bill row', () => {
    const { ctx } = initBill(WareHouseBill);
    const row = { WareHouseBill_Id: 1 };
    WareHouseBill.methods.rowClick.call(ctx, { row });
    expect(ctx.$refs.table.$refs.table.toggleRowSelection.calls[0][0]).to.equal(row);
    expect(ctx.$refs.gridFooter.rowClick.calls[0][0]).to.equal(row);
  });

  it('adds an automatic-number placeholder to the inbound bill code', () => {
    const code = { field: 'WareHouseBillCode' };
    const ctx = { editFormOptions: [[code, { field: 'Remark' }]] };
    WareHouseBill.methods.modelOpenAfter.call(ctx, {});
    expect(code.placeholder).to.equal('请输入，忽略将自动生成');
  });

  it('freezes product identity columns in stock balance', () => {
    const columns = [{ field: 'ProductCode' }, { field: 'ProductName' }, { field: 'Qty' }];
    const ctx = { columns, columnIndex: false };
    StockBalance.methods.onInit.call(ctx);
    expect(ctx.columnIndex).to.equal(true);
    expect(columns.map((x) => x.fixed)).to.deep.equal([true, true, undefined]);
  });

  it('uses a wider search label and freezes product columns in movement details', () => {
    const columns = [{ field: 'ProductCode' }, { field: 'ProductName' }, { field: 'Qty' }];
    const ctx = { columns, columnIndex: false, labelWidth: 0 };
    WareInOutDetail.methods.onInit.call(ctx);
    expect(ctx.columnIndex).to.equal(true);
    expect(ctx.labelWidth).to.equal(120);
    expect(columns[0].fixed).to.equal(true);
    expect(columns[1].fixed).to.equal(true);
  });
});
