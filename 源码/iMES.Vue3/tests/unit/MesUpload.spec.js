import { expect } from 'chai';
import MesUpload from '@/components/basic/MesUpload.vue';
import { bindMethods, createSpy, flushPromises, FormDataMock } from './helpers';

function file(name, size = 1, extra = {}) {
  return Object.assign({ name, size }, extra);
}

function makeContext(overrides = {}) {
  const error = createSpy();
  const success = createSpy();
  const context = {
    files: [],
    fileInfo: [],
    multiple: false,
    maxFile: 5,
    maxSize: 50,
    autoUpload: false,
    img: false,
    excel: false,
    fileTypes: [],
    url: '/api/upload',
    changed: false,
    loadingStatus: false,
    loadText: '上传文件',
    downLoad: true,
    $message: { error, success },
    $refs: { input: { value: 'selected' } },
    $store: { getters: { getToken: () => 'token-1' } },
    base: {
      isUrl: (value) => /^https?:\/\//.test(value),
      dowloadFile: createSpy(),
      previewImg: createSpy()
    },
    http: {
      ipAddress: 'http://localhost:9991/',
      post: createSpy(() => Promise.resolve({ status: true, message: 'ok', data: '/Upload/' }))
    },
    uploadBefore: () => true,
    uploadAfter: () => true,
    onChange: () => true,
    fileClick: () => true,
    removeBefore: () => true
  };
  Object.assign(context, overrides);
  return bindMethods(MesUpload, context);
}

describe('MesUpload.vue unit tests', () => {
  let originalFormData;

  beforeEach(() => {
    originalFormData = global.FormData;
    global.FormData = FormDataMock;
  });

  afterEach(() => {
    global.FormData = originalFormData;
  });

  it('extracts a file name from a server path', () => {
    expect(makeContext().getFileName('/Upload/a.xlsx')).to.equal('a.xlsx');
  });

  it('returns a readable fallback for a missing path', () => {
    expect(makeContext().getFileName()).to.equal('未定义文件名');
  });

  it('clones server files without sharing the original objects', () => {
    const source = [{ path: '/Upload/a.pdf' }];
    const ctx = makeContext();
    ctx.cloneFile(source);
    expect(ctx.files).to.deep.equal([{ name: 'a.pdf', path: '/Upload/a.pdf' }]);
    expect(ctx.files[0]).not.to.equal(source[0]);
  });

  it('selects the automatic and manual selector styles', () => {
    expect(makeContext({ autoUpload: true }).getSelector()).to.equal('auto-selector');
    expect(makeContext({ autoUpload: false }).getSelector()).to.equal('submit-selector');
  });

  it('returns image and Excel upload descriptions', () => {
    expect(makeContext({ img: true }).getText()).to.equal('只能上传图片,');
    expect(makeContext({ excel: true }).getText()).to.equal('只能上传excel文件,');
  });

  it('recognises common image and Excel formats case-insensitively', () => {
    const ctx = makeContext();
    expect(ctx.format(file('PHOTO.JPG'), 'img')).to.equal(true);
    expect(ctx.format(file('sheet.XLSX'), 'excel')).to.equal(true);
    expect(ctx.format(file('readme.txt'), 'img')).to.equal(false);
  });

  it('enforces a custom extension allow-list', () => {
    const ctx = makeContext({ fileTypes: ['pdf', 'zip'] });
    expect(ctx.format(file('manual.PDF'), ctx.fileTypes)).to.equal(true);
    expect(ctx.format(file('manual.docx'), ctx.fileTypes)).to.equal(false);
  });

  it('rejects selecting more than the configured number of files', () => {
    const ctx = makeContext({ multiple: true, maxFile: 2, files: [file('old.txt')] });
    expect(ctx.checkFile([file('a.txt'), file('b.txt')])).to.equal(false);
    expect(ctx.$message.error.calls[0][0]).to.contain('最多只能选【2】个文件');
  });

  it('rejects a non-image when image mode is enabled', () => {
    const ctx = makeContext({ img: true });
    expect(ctx.checkFile([file('script.exe')])).to.equal(false);
    expect(ctx.$message.error.calls[0][0]).to.contain('只能是图片格式');
  });

  it('rejects a non-Excel file when Excel mode is enabled', () => {
    const ctx = makeContext({ excel: true });
    expect(ctx.checkFile([file('manual.pdf')])).to.equal(false);
    expect(ctx.$message.error.calls[0][0]).to.contain('只能是excel文件');
  });

  it('rejects files outside a custom extension allow-list', () => {
    const ctx = makeContext({ fileTypes: ['pdf'] });
    expect(ctx.checkFile([file('manual.docx')])).to.equal(false);
    expect(ctx.$message.error.calls[0][0]).to.contain('只能是【pdf】格式');
  });

  it('rejects files larger than the configured MB limit', () => {
    const ctx = makeContext({ maxSize: 1 });
    expect(ctx.checkFile([file('large.pdf', 1024 * 1024 + 1)])).to.equal(false);
    expect(ctx.$message.error.calls[0][0]).to.contain('不能超过:1M');
  });

  it('renames duplicate file names within the same selection', () => {
    const input = [file('same.pdf'), file('same.pdf')];
    const ctx = makeContext();
    expect(ctx.checkFile(input)).to.equal(true);
    expect(input[1].name).to.equal('(1)same.pdf');
  });

  it('replaces the previous selection in single-file mode', () => {
    const ctx = makeContext({ files: [file('old.pdf')] });
    const selected = file('new.pdf');
    ctx.handleChange({ target: { files: [selected] } });
    expect(ctx.files).to.have.length(1);
    expect(ctx.files[0].name).to.equal('new.pdf');
    expect(ctx.files[0].input).to.equal(true);
    expect(ctx.$refs.input.value).to.equal(null);
  });

  it('does not change the selection when onChange vetoes it', () => {
    const ctx = makeContext({ files: [file('old.pdf')], onChange: () => false });
    ctx.handleChange({ target: { files: [file('new.pdf')] } });
    expect(ctx.files.map((x) => x.name)).to.deep.equal(['old.pdf']);
  });

  it('starts upload after a valid selection in automatic mode', () => {
    const upload = createSpy();
    const ctx = makeContext({ autoUpload: true });
    ctx.upload = upload;
    ctx.handleChange({ target: { files: [file('new.pdf')] } });
    expect(upload.calls).to.have.length(1);
    expect(upload.calls[0][0]).to.equal(false);
  });

  it('honours the click hook and disabled-download mode', () => {
    const blocked = makeContext({ fileClick: () => false });
    blocked.fileOnClick(0, { name: 'a.pdf', path: '/a.pdf' });
    expect(blocked.base.dowloadFile.calls).to.have.length(0);

    const disabled = makeContext({ downLoad: false });
    disabled.fileOnClick(0, { name: 'a.pdf', path: '/a.pdf' });
    expect(disabled.base.dowloadFile.calls).to.have.length(0);
  });

  it('reports an attempt to download a file that has not been uploaded', () => {
    const ctx = makeContext();
    ctx.fileOnClick(0, { name: 'local.pdf' });
    expect(ctx.$message.error.calls[0][0]).to.equal('请先上传文件');
  });

  it('downloads uploaded files with token and API base address', () => {
    const ctx = makeContext();
    ctx.fileOnClick(2, { name: 'a.pdf', path: '/Upload/a.pdf' });
    expect(ctx.base.dowloadFile.calls[0]).to.deep.equal([
      '/Upload/a.pdf',
      'a.pdf',
      { Authorization: 'token-1' },
      'http://localhost:9991/'
    ]);
  });

  it('rejects upload without a URL or without files', () => {
    const noUrl = makeContext({ url: '', files: [file('a.pdf', 1, { input: true })] });
    noUrl.upload();
    expect(noUrl.$message.error.calls[0][0]).to.equal('没有配置好Url');

    const noFiles = makeContext({ files: [] });
    noFiles.upload();
    expect(noFiles.$message.error.calls[0][0]).to.equal('请选择文件');
  });

  it('does not call HTTP when uploadBefore vetoes upload', () => {
    const ctx = makeContext({
      files: [file('a.pdf', 1, { input: true })],
      uploadBefore: () => false
    });
    ctx.upload();
    expect(ctx.http.post.calls).to.have.length(0);
  });

  it('uploads local files and replaces them with returned server paths', async () => {
    const local = file('a.pdf', 1, { input: true });
    const fileInfo = [{ name: 'old.pdf', path: '/old.pdf' }];
    const ctx = makeContext({ files: [local], fileInfo });
    ctx.upload();
    await flushPromises();
    expect(ctx.http.post.calls).to.have.length(1);
    expect(ctx.http.post.calls[0][1].entries[0][0]).to.equal('fileInput');
    expect(ctx.fileInfo).to.deep.equal([{ name: 'a.pdf', path: '/Upload/a.pdf' }]);
    expect(ctx.files).to.deep.equal(ctx.fileInfo);
    expect(ctx.changed).to.equal(true);
    expect(ctx.loadingStatus).to.equal(false);
  });

  it('keeps selected files and exposes a failed business response', async () => {
    const local = file('a.pdf', 1, { input: true });
    const ctx = makeContext({
      files: [local],
      http: { ipAddress: '', post: createSpy(() => Promise.resolve({ status: false, message: '上传失败' })) }
    });
    ctx.upload();
    await flushPromises();
    expect(ctx.files[0]).to.equal(local);
    expect(ctx.changed).to.equal(false);
    expect(ctx.$message.success.calls[0][0]).to.equal('上传失败');
  });

  it('clears loading state when the HTTP promise rejects', async () => {
    const ctx = makeContext({
      files: [file('a.pdf', 1, { input: true })],
      http: { ipAddress: '', post: createSpy(() => Promise.reject(new Error('network'))) }
    });
    ctx.upload();
    await flushPromises();
    expect(ctx.loadingStatus).to.equal(false);
    expect(ctx.loadText).to.equal('上传文件');
  });

  it('does not remove a local file when removeBefore vetoes removal', () => {
    const selected = file('a.pdf', 1, { input: true });
    const ctx = makeContext({ files: [selected], removeBefore: () => false });
    ctx.removeFile(0);
    expect(ctx.files).to.deep.equal([selected]);
  });

  it('does not mutate an uploaded file while composing its image URL', () => {
    const uploaded = { name: 'a.png', path: '/Upload/a.png' };
    const ctx = makeContext();
    expect(ctx.getImgSrc(uploaded)).to.equal('http://localhost:9991/Upload/a.png');
    expect(uploaded.path).to.equal('/Upload/a.png');
  });
});
