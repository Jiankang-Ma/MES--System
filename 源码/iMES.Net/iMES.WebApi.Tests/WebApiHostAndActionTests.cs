using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using iMES.Core.Filters;
using iMES.Core.ObjectActionValidator;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using iMES.WebApi.Controllers;
using iMES.WebApi.Controllers.Quality;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Xunit;

namespace iMES.WebApi.Tests
{
    public class WebApiHostAndActionTests
    {
        [Fact]
        public void Startup_RegistersValidationHttpContextCacheCorsSwaggerAndQuartz()
        {
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string> { ["CorsUrls"] = "http://localhost:9990" })
                .Build();
            var services = new ServiceCollection();

            new Startup(configuration).ConfigureServices(services);

            Assert.Contains(services, descriptor => descriptor.ServiceType == typeof(IObjectModelValidator)
                && descriptor.ImplementationInstance is NullObjectModelValidator);
            Assert.Contains(services, descriptor => descriptor.ServiceType == typeof(IHttpContextAccessor));
            Assert.Contains(services, descriptor => descriptor.ServiceType == typeof(IHttpClientFactory));
            Assert.Contains(services, descriptor => descriptor.ServiceType == typeof(ISchedulerFactory));
            Assert.Contains(services, descriptor => descriptor.ServiceType.FullName == "Microsoft.Extensions.Caching.Memory.IMemoryCache");
            Assert.Contains(services, descriptor => descriptor.ServiceType.FullName.StartsWith("Microsoft.Extensions.Options.IConfigureOptions`1"));
        }

        [Fact]
        public void Program_ExposesAHostBuilder()
        {
            Assert.NotNull(Program.CreateHostBuilder(Array.Empty<string>()));
        }

        [Fact]
        public void ApiHome_RedirectsToSwagger()
        {
            var result = Assert.IsType<RedirectResult>(new ApiHomeController().Index());

            Assert.Equal("/swagger/", result.Url);
        }

        [Theory]
        [InlineData("Test1")]
        [InlineData("Test2")]
        [InlineData("Test3")]
        [InlineData("Test4")]
        [InlineData("Test5")]
        [InlineData("Test6")]
        public void ValidatorExampleActions_ReturnSuccessPayloadWhenCalledAfterFilterValidation(string methodName)
        {
            var controller = new ObjectActionValidatorExampleController();
            IActionResult result;
            if (methodName == "Test1") result = controller.Test1("u", "13800138000");
            else if (methodName == "Test2") result = controller.Test2("u", "13800138000");
            else if (methodName == "Test3") result = controller.Test3("A", "1");
            else if (methodName == "Test4") result = controller.Test4(new LoginInfo { UserName = "u", Password = "123456" });
            else if (methodName == "Test5") result = controller.Test5(new LoginInfo { Password = "123456" });
            else result = controller.Test6(new LoginInfo { UserName = "u", Password = "123456" }, "13800138000");

            Assert.Equal("参数验证通过", Assert.IsType<JsonResult>(result).Value);
        }

        [Theory]
        [InlineData("AddInspectionItem", "检测项名称不能为空")]
        [InlineData("AddInspectionTemplate", "产品和检验类型不能为空")]
        [InlineData("CreateInspectionOrder", "检验类型、产品和来源单号不能为空")]
        [InlineData("SubmitInspectionOrder", "检验单和检测结果不能为空")]
        public void QualityEndpoints_RejectMissingRequiredInputBeforeDatabaseAccess(string action, string message)
        {
            var controller = new QualityController(null);
            WebResponseContent result;
            if (action == "AddInspectionItem") result = controller.AddInspectionItem(null);
            else if (action == "AddInspectionTemplate") result = controller.AddInspectionTemplate(null);
            else if (action == "CreateInspectionOrder") result = controller.CreateInspectionOrder(null);
            else result = controller.SubmitInspectionOrder(null);

            Assert.False(result.Status);
            Assert.Equal(message, result.Message);
        }

        [Fact]
        public void QualityEndpoints_RejectInvalidRangesUnsupportedTypesAndInvalidProcessInput()
        {
            var controller = new QualityController(null);

            Assert.False(controller.AddInspectionItem(new QualityInspectionItemInput
            {
                InspectionItemName = "尺寸", DefaultLowerLimit = 2, DefaultUpperLimit = 1
            }).Status);
            Assert.False(controller.AddInspectionTemplate(new QualityInspectionTemplateInput
            {
                Product_Id = 1, InspectionType = "unknown", Items = new List<QualityInspectionTemplateItemInput>()
            }).Status);
            Assert.False(controller.CreateInspectionOrder(new QualityInspectionOrderInput
            {
                Product_Id = 1, InspectionType = "process", SourceNo = "P-1", InspectionQty = 1
            }).Status);
        }

        [Fact]
        public void QualityEndpoints_RejectInspectionDateEarlierThanSourceDateBeforeDatabaseAccess()
        {
            var result = new QualityController(null).CreateInspectionOrder(new QualityInspectionOrderInput
            {
                Product_Id = 1,
                InspectionType = "incoming",
                SourceNo = "IN-1",
                InspectionQty = 1,
                SourceDate = new DateTime(2026, 7, 22, 10, 0, 0),
                InspectionDate = new DateTime(2026, 7, 22, 9, 0, 0)
            });

            Assert.False(result.Status);
            Assert.Equal("检验日期不得早于来源日期", result.Message);
        }
    }
}
