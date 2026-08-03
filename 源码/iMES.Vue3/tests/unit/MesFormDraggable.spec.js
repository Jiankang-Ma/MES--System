import { expect } from 'chai';
import MesFormDraggable from '@/components/basic/MesFormDraggable/MesFormDraggable.vue';
import { bindMethods, createSpy } from './helpers';

function makeContext(overrides = {}) {
  const context = {
    currentComponents: [],
    currentItem: {},
    currentIndex: -1,
    colWidth: 100,
    currnetTableData: [],
    currentTableOption: [],
    dicList: [],
    tableModel: false,
    previewModel: false,
    viewFormData: { fields: {}, formOptions: [], tables: [], tabs: [] },
    options: {},
    http: { post: createSpy(() => Promise.resolve([])) },
    $emit: createSpy(),
    $Message: { success: createSpy() },
    $confirm: createSpy(() => Promise.resolve()),
    $refs: { table: { delRow: createSpy() } }
  };
  Object.assign(context, overrides);
  return bindMethods(MesFormDraggable, context);
}

function component(type, width = 100, extra = {}) {
  return Object.assign({
    field: `${type}Field`,
    name: `${type}名称`,
    type,
    width,
    required: false,
    readonly: false
  }, extra);
}

describe('MesFormDraggable.vue unit tests', () => {
  it('maps a full-width field to the 12-column form grid', () => {
    const option = makeContext().getFormOptions(component('text', 100));
    expect(option.colSize).to.equal(12);
  });

  it('maps a half-width field to 6 columns', () => {
    const option = makeContext().getFormOptions(component('text', 50));
    expect(option.colSize).to.equal(6);
  });

  it('copies upload constraints into generated form options', () => {
    const item = component('file', 100, {
      maxSize: 10,
      fileInfo: [{ name: 'a.pdf' }],
      multiple: true,
      autoUpload: false,
      maxFile: 3,
      url: '/api/upload'
    });
    const option = makeContext().getFormOptions(item);
    expect(option).to.include({ maxSize: 10, multiple: true, autoUpload: false, maxFile: 3, url: '/api/upload' });
    expect(option.fileInfo).to.equal(item.fileInfo);
  });

  it('copies editor height and URL into generated options', () => {
    const option = makeContext().getFormOptions(component('editor', 100, { height: 300, url: '/api/image' }));
    expect(option.height).to.equal(300);
    expect(option.url).to.equal('/api/image');
  });

  it('copies dictionary data and key into generated options', () => {
    const data = [{ key: '1', value: '启用' }];
    const option = makeContext().getFormOptions(component('select', 100, { data, key: 'Enable' }));
    expect(option.data).to.equal(data);
    expect(option.dataKey).to.equal('Enable');
  });

  it('excludes table widgets from ordinary form components', () => {
    const ctx = makeContext({ currentComponents: [component('text'), component('table')] });
    expect(ctx.filterCurrentComponents().map((x) => x.type)).to.deep.equal(['text']);
  });

  it('groups adjacent 50-percent fields into one form row', () => {
    const ctx = makeContext({ currentComponents: [component('text', 50), component('date', 50)] });
    const line = ctx.getLineFormOptions(0);
    expect(line.options.map((x) => x.field)).to.deep.equal(['textField', 'dateField']);
    expect(line.endIndex).to.equal(1);
  });

  it('never lets an interleaved table leak into ordinary form rows', () => {
    const ctx = makeContext({
      currentComponents: [component('text', 50), component('table', 100), component('date', 50)]
    });
    const line = ctx.getLineFormOptions(0);
    expect(line.options.map((x) => x.type)).to.deep.equal(['text', 'date']);
  });

  it('deep-copies a component and gives the copy a distinct field', () => {
    const source = component('select', 100, { data: [{ key: 1 }] });
    const ctx = makeContext({ currentComponents: [source] });
    ctx.copyItem(source);
    expect(ctx.currentComponents).to.have.length(2);
    expect(ctx.currentComponents[1]).not.to.equal(source);
    expect(ctx.currentComponents[1].data).not.to.equal(source.data);
    expect(ctx.currentComponents[1].field).not.to.equal(source.field);
  });

  it('removes a component and resets the current selection', () => {
    const ctx = makeContext({
      currentComponents: [component('text'), component('date')],
      currentIndex: 1,
      currentItem: { field: 'dateField' },
      colWidth: 50
    });
    ctx.removeItem(0);
    expect(ctx.currentComponents.map((x) => x.type)).to.deep.equal(['date']);
    expect(ctx.currentIndex).to.equal(-1);
    expect(ctx.currentItem).to.deep.equal({});
    expect(ctx.colWidth).to.equal(100);
  });

  it('clears all components and resets the current selection', () => {
    const ctx = makeContext({ currentComponents: [component('text')], currentIndex: 0, colWidth: 50 });
    ctx.clearItems();
    expect(ctx.currentComponents).to.deep.equal([]);
    expect(ctx.currentIndex).to.equal(-1);
    expect(ctx.colWidth).to.equal(100);
  });

  it('sorts table columns by order number', () => {
    const ctx = makeContext({ currnetTableData: [{ orderNo: 3 }, { orderNo: 1 }, { orderNo: 2 }] });
    ctx.sortRow();
    expect(ctx.currnetTableData.map((x) => x.orderNo)).to.deep.equal([1, 2, 3]);
    expect(ctx.$Message.success.calls).to.have.length(1);
  });

  it('saves table configuration as a deep copy and closes the model', () => {
    const currentItem = { columns: [] };
    const ctx = makeContext({ currentItem, currnetTableData: [{ field: 'Qty' }], tableModel: true });
    ctx.saveConfigOptions();
    expect(currentItem.columns).to.deep.equal([{ field: 'Qty' }]);
    expect(currentItem.columns).not.to.equal(ctx.currnetTableData);
    expect(ctx.tableModel).to.equal(false);
  });

  it('emits the designed components and generated form options on save', () => {
    const currentComponents = [component('text')];
    const ctx = makeContext({ currentComponents });
    ctx.preview = createSpy();
    ctx.save();
    expect(ctx.preview.calls[0]).to.deep.equal([false]);
    expect(ctx.$emit.calls[0][0]).to.equal('save');
    expect(ctx.$emit.calls[0][1].daraggeOptions).to.equal(currentComponents);
    expect(ctx.$emit.calls[0][1].formOptions).to.equal(ctx.viewFormData);
  });
});
