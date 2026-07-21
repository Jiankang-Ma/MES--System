using System;
using System.Collections.Generic;
using System.Reflection;
using iMES.Core.Utilities;
using iMES.Custom.Services;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Custom.Tests
{
    public class DuplicateValidationTests
    {
        [Fact]
        public void ProductAdd_DuplicateName_IsRejected()
        {
            var service = ServiceFactory.Product(new[]
            {
                new Base_Product { ProductName = "Existing", ProductCode = "P-001" },
            });
            var callback = PrepareAdd<Base_Product>(service);

            var result = callback(new Base_Product { ProductName = "Existing", ProductCode = "P-002" }, null);

            Assert.False(result.Status);
            Assert.Equal("产品名称已存在", result.Message);
        }

        [Fact]
        public void ProductAdd_DuplicateCode_IsRejected()
        {
            var service = ServiceFactory.Product(new[]
            {
                new Base_Product { ProductName = "Existing", ProductCode = "P-001" },
            });
            var callback = PrepareAdd<Base_Product>(service);

            var result = callback(new Base_Product { ProductName = "New", ProductCode = "P-001" }, null);

            Assert.False(result.Status);
            Assert.Equal("产品编号已存在", result.Message);
        }

        [Fact]
        public void ProductAdd_UniqueNameAndCode_IsAccepted()
        {
            var service = ServiceFactory.Product();
            var callback = PrepareAdd<Base_Product>(service);

            var result = callback(new Base_Product { ProductName = "New", ProductCode = "P-001" }, null);

            Assert.True(result.Status);
        }

        [Fact]
        public void DefectAdd_DuplicateName_IsRejected()
        {
            var service = ServiceFactory.Defect(new[]
            {
                new Base_DefectItem { DefectItemName = "Scratch", DefectItemCode = "D-001" },
            });
            var callback = PrepareAdd<Base_DefectItem>(service);

            var result = callback(new Base_DefectItem { DefectItemName = "Scratch", DefectItemCode = "D-002" }, null);

            Assert.False(result.Status);
            Assert.Equal("不良品项名称已存在", result.Message);
        }

        [Fact]
        public void DefectAdd_DuplicateCode_IsRejected()
        {
            var service = ServiceFactory.Defect(new[]
            {
                new Base_DefectItem { DefectItemName = "Scratch", DefectItemCode = "D-001" },
            });
            var callback = PrepareAdd<Base_DefectItem>(service);

            var result = callback(new Base_DefectItem { DefectItemName = "Dent", DefectItemCode = "D-001" }, null);

            Assert.False(result.Status);
            Assert.Equal("不良品项编号已存在", result.Message);
        }

        [Fact]
        public void ProcessAdd_UniqueNameAndCode_IsAccepted()
        {
            var service = ServiceFactory.Process();
            var callback = PrepareAdd<Base_Process>(service);

            var result = callback(new Base_Process { ProcessName = "Assembly", ProcessCode = "PR-001" }, null);

            Assert.True(result.Status);
        }

        [Fact]
        public void ProcessUpdate_DuplicateName_ReturnsProcessSpecificMessage()
        {
            var service = ServiceFactory.Process(new[]
            {
                new Base_Process { Process_Id = 1, ProcessName = "Assembly", ProcessCode = "PR-001" },
            });
            var callback = PrepareUpdate<Base_Process>(service);

            var result = callback(
                new Base_Process { Process_Id = 2, ProcessName = "Assembly", ProcessCode = "PR-002" },
                null, null, new List<object>());

            Assert.False(result.Status);
            Assert.Equal("工序名称已存在", result.Message);
        }

        [Fact]
        public void ProcessUpdate_DuplicateCode_ReturnsProcessSpecificMessage()
        {
            var service = ServiceFactory.Process(new[]
            {
                new Base_Process { Process_Id = 1, ProcessName = "Assembly", ProcessCode = "PR-001" },
            });
            var callback = PrepareUpdate<Base_Process>(service);

            var result = callback(
                new Base_Process { Process_Id = 2, ProcessName = "Packaging", ProcessCode = "PR-001" },
                null, null, new List<object>());

            Assert.False(result.Status);
            Assert.Equal("工序编号已存在", result.Message);
        }

        private static Func<T, object, WebResponseContent> PrepareAdd<T>(object service)
        {
            service.GetType().GetMethod("Add", new[] { typeof(SaveModel) })
                .Invoke(service, new object[] { null });
            return TestProxy.Callback<Func<T, object, WebResponseContent>>(service, "AddOnExecuting");
        }

        private static Func<T, object, object, List<object>, WebResponseContent> PrepareUpdate<T>(object service)
        {
            service.GetType().GetMethod("Update", new[] { typeof(SaveModel) })
                .Invoke(service, new object[] { null });
            return TestProxy.Callback<Func<T, object, object, List<object>, WebResponseContent>>(service, "UpdateOnExecuting");
        }
    }
}
