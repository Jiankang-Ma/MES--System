import { expect } from 'chai';
import UploadExcel from '@/components/basic/UploadExcel.vue';
import { bindMethods, createSpy, flushPromises, FormDataMock } from './helpers';

function makeContext(overrides = {}) {
  const context = {
    url: '/api/import',
    template: { url: '/api/template', fileName: '导入模板' },
    file: null,
    loadingStatus: false,
    message: '',
    resultClass: '',
    importExcelBefore: () => true,
    $Message: { error: createSpy(), info: createSpy() },
    $emit: createSpy(),
    $store: { getters: { getToken: () => 'token-2' } },
    $refs: { template: { click: createSpy() } },
    http: { post: createSpy(() => Promise.resolve({ status: true, message: '导入成功' })) }
  };
  Object.assign(context, overrides);
  return bindMethods(UploadExcel, context);
}

describe('UploadExcel.vue unit tests', () => {
  let originalFormData;
  let originalXHR;
  let originalCreateObjectURL;

  beforeEach(() => {
    originalFormData = global.FormData;
    originalXHR = global.XMLHttpRequest;
    originalCreateObjectURL = global.URL.createObjectURL;
    global.FormData = FormDataMock;
    global.URL.createObjectURL = createSpy(() => 'blob:test');
  });

  afterEach(() => {
    global.FormData = originalFormData;
    global.XMLHttpRequest = originalXHR;
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it('clears only the previous result message when selecting again', () => {
    const ctx = makeContext({ message: 'old', file: { name: 'old.xlsx' } });
    ctx.clearMsg();
    expect(ctx.message).to.equal('');
    expect(ctx.file.name).to.equal('old.xlsx');
  });

  it('resets file, message and result class', () => {
    const ctx = makeContext({ file: { name: 'a.xlsx' }, message: 'old', resultClass: 'v-r-error' });
    ctx.reset();
    expect(ctx.file).to.equal(null);
    expect(ctx.message).to.equal('');
    expect(ctx.resultClass).to.equal('');
  });

  ['numbers', 'csv', 'xls', 'xlsx'].forEach((extension) => {
    it(`accepts .${extension} as an Excel import file`, () => {
      const ctx = makeContext({ file: { name: `sheet.${extension.toUpperCase()}` } });
      expect(ctx.getFileType()).to.equal(true);
    });
  });

  it('rejects a non-Excel import file with a clear message', () => {
    const ctx = makeContext({ file: { name: 'manual.pdf' } });
    expect(ctx.getFileType()).to.equal(false);
    expect(ctx.$Message.error.calls[0][0]).to.equal('只能选择excel文件');
  });

  it('stores the selected file while preventing component auto-upload', () => {
    const selected = { name: 'sheet.xlsx' };
    const ctx = makeContext();
    expect(ctx.beforeUpload(selected)).to.equal(false);
    expect(ctx.file).to.equal(selected);
  });

  it('rejects upload without URL or selected file', () => {
    const noUrl = makeContext({ url: '', file: { name: 'a.xlsx' } });
    noUrl.upload();
    expect(noUrl.$Message.error.calls[0][0]).to.equal('没有配置好Url');

    const noFile = makeContext({ file: null });
    noFile.upload();
    expect(noFile.$Message.error.calls[0][0]).to.equal('请选择文件');
  });

  it('allows importExcelBefore to inspect FormData and veto the request', () => {
    const hook = createSpy(() => false);
    const ctx = makeContext({ file: { name: 'a.xlsx' }, importExcelBefore: hook });
    ctx.upload();
    expect(hook.calls).to.have.length(1);
    expect(hook.calls[0][0].entries[0][0]).to.equal('fileInput');
    expect(ctx.http.post.calls).to.have.length(0);
  });

  it('emits importExcelAfter and success styling for a successful import', async () => {
    const result = { status: true, message: '导入 10 行' };
    const ctx = makeContext({
      file: { name: 'a.xlsx' },
      http: { post: createSpy(() => Promise.resolve(result)) }
    });
    ctx.upload();
    expect(ctx.loadingStatus).to.equal(true);
    await flushPromises();
    expect(ctx.file).to.equal(null);
    expect(ctx.$emit.calls[0]).to.deep.equal(['importExcelAfter', result]);
    expect(ctx.message).to.equal('导入 10 行');
    expect(ctx.resultClass).to.equal('v-r-success');
  });

  it('shows business failure text without emitting a success event', async () => {
    const ctx = makeContext({
      file: { name: 'a.xlsx' },
      http: { post: createSpy(() => Promise.resolve({ status: false, message: '第 2 行错误' })) }
    });
    ctx.upload();
    await flushPromises();
    expect(ctx.$emit.calls).to.have.length(0);
    expect(ctx.message).to.equal('第 2 行错误');
    expect(ctx.resultClass).to.equal('v-r-error');
  });

  it('clears loading state when the import request rejects', async () => {
    const ctx = makeContext({
      file: { name: 'a.xlsx' },
      http: { post: createSpy(() => Promise.reject(new Error('network'))) }
    });
    ctx.upload();
    await flushPromises();
    expect(ctx.loadingStatus).to.equal(false);
  });

  it('downloads a binary template with auth header and configured file name', () => {
    let xhr;
    global.XMLHttpRequest = class {
      constructor() {
        xhr = this;
        this.headers = {};
      }
      open(...args) { this.openArgs = args; }
      setRequestHeader(key, value) { this.headers[key] = value; }
      send() {}
    };
    const link = { click: createSpy() };
    const ctx = makeContext({ $refs: { template: link } });
    ctx.dowloadTemplate();
    xhr.response = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    xhr.onload();
    expect(xhr.openArgs).to.deep.equal(['GET', '/api/template', true]);
    expect(xhr.headers.Authorization).to.equal('token-2');
    expect(link.download).to.equal('导入模板.xlsx');
    expect(link.href).to.equal('blob:test');
    expect(link.click.calls).to.have.length(1);
    expect(ctx.loadingStatus).to.equal(false);
  });

  it('reports a JSON template response instead of throwing a TypeError', () => {
    let xhr;
    global.XMLHttpRequest = class {
      constructor() { xhr = this; this.headers = {}; }
      open() {}
      setRequestHeader() {}
      send() {}
    };
    const ctx = makeContext();
    ctx.dowloadTemplate();
    xhr.response = { type: 'application/json' };
    expect(() => xhr.onload()).not.to.throw();
    expect(ctx.$Message.error.calls[0][0]).to.equal('未找到下载文件');
  });
});
