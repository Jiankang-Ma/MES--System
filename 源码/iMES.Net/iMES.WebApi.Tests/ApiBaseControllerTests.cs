using System;
using System.Collections.Generic;
using System.IO;
using iMES.Core.Controllers.Basic;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace iMES.WebApi.Tests
{
    public class ApiBaseControllerTests
    {
        [Fact]
        public void CrudActions_DelegatePageDetailUploadAndImportToService()
        {
            var service = new FakeCrudService();
            var controller = new ApiBaseController<FakeCrudService>(service);

            var page = Assert.IsType<JsonResult>(controller.GetPageData(new PageDataOptions()));
            Assert.Equal("GetPageData", service.LastMethod);
            Assert.Equal("page", Assert.IsType<Dictionary<string, string>>(page.Value)["source"]);

            var detail = Assert.IsType<ContentResult>(controller.GetDetailPage(new PageDataOptions()));
            Assert.Equal("GetDetailPage", service.LastMethod);
            Assert.Contains("detail", detail.Content);

            var upload = Assert.IsType<JsonResult>(controller.Upload(Array.Empty<IFormFile>()));
            Assert.Equal("Upload", service.LastMethod);
            Assert.True(Assert.IsType<WebResponseContent>(upload.Value).Status);

            var import = Assert.IsType<JsonResult>(controller.Import(new List<IFormFile>()));
            Assert.Equal("Import", service.LastMethod);
            Assert.True(Assert.IsType<WebResponseContent>(import.Value).Status);
        }

        [Fact]
        public void DownloadTemplate_ReturnsTheFileProvidedByService()
        {
            var path = Path.GetTempFileName();
            File.WriteAllBytes(path, new byte[] { 1, 2, 3 });
            try
            {
                var service = new FakeCrudService { TemplatePath = path };
                var controller = new ApiBaseController<FakeCrudService>(service);

                var result = Assert.IsType<FileContentResult>(controller.DownLoadTemplate());

                Assert.Equal("DownLoadTemplate", service.LastMethod);
                Assert.Equal(new byte[] { 1, 2, 3 }, result.FileContents);
                Assert.Equal(Path.GetFileName(path), result.FileDownloadName);
            }
            finally
            {
                File.Delete(path);
            }
        }

        [Fact]
        public void MutationActions_DelegateAddUpdateDeleteAndAuditToService()
        {
            var service = new FakeCrudService();
            var controller = new ApiBaseController<FakeCrudService>(service);

            Assert.True(Assert.IsType<JsonResult>(controller.Add(new SaveModel())).Value is WebResponseContent);
            Assert.Equal("Add", service.LastMethod);
            Assert.True(Assert.IsType<JsonResult>(controller.Update(new SaveModel())).Value is WebResponseContent);
            Assert.Equal("Update", service.LastMethod);
            Assert.True(Assert.IsType<JsonResult>(controller.Del(new object[] { 7 })).Value is WebResponseContent);
            Assert.Equal("Del", service.LastMethod);
            Assert.True(Assert.IsType<JsonResult>(controller.Audit(new object[] { 7 }, 2, "ok")).Value is WebResponseContent);
            Assert.Equal("Audit", service.LastMethod);
        }

        [Fact]
        public void LegacyDownloadEndpoint_IsExplicitlyDisabled()
        {
            var controller = new ApiBaseController<FakeCrudService>(new FakeCrudService());

            var exception = Assert.Throws<Exception>(() => controller.DownLoadFile());

            Assert.Contains("已停用", exception.Message);
        }

        public class FakeCrudService
        {
            public string LastMethod { get; private set; }
            public string TemplatePath { get; set; }

            public object GetPageData(PageDataOptions options) { LastMethod = "GetPageData"; return new Dictionary<string, string> { ["source"] = "page" }; }
            public object GetDetailPage(PageDataOptions options) { LastMethod = "GetDetailPage"; return new Dictionary<string, string> { ["source"] = "detail" }; }
            public WebResponseContent Upload(IEnumerable<IFormFile> files) { LastMethod = "Upload"; return new WebResponseContent().OK(); }
            public WebResponseContent Import(List<IFormFile> files) { LastMethod = "Import"; return new WebResponseContent().OK(); }
            public WebResponseContent DownLoadTemplate() { LastMethod = "DownLoadTemplate"; return new WebResponseContent().OK(null, TemplatePath); }
            public WebResponseContent Add(SaveModel model) { LastMethod = "Add"; return new WebResponseContent().OK(null, new { saved = true }); }
            public WebResponseContent Update(SaveModel model) { LastMethod = "Update"; return new WebResponseContent().OK(null, new { updated = true }); }
            public WebResponseContent Del(object[] keys, bool delList) { LastMethod = "Del"; return new WebResponseContent().OK(); }
            public WebResponseContent Audit(object[] keys, int? status, string reason) { LastMethod = "Audit"; return new WebResponseContent().OK(); }
        }
    }
}
