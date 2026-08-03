using System;
using System.Collections.Generic;
using System.Linq;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Custom.Tests
{
    public class ExtensionFieldTests
    {
        [Fact]
        public void ProductAdd_ExtensionValue_IsMappedToProductRecord()
        {
            var field = Field("Base_Product", 7, "Color", "颜色");
            var service = ServiceFactory.Product(out var extendData, fields: new[] { field });
            var model = new SaveModel { Extra = "{\"Color\":\"Blue\"}" };
            service.Add(model);
            var callback = TestProxy.Callback<Func<Base_Product, object, WebResponseContent>>(service, "AddOnExecuted");

            var result = callback(new Base_Product { Product_Id = 11, CreateID = 2, Creator = "tester" }, null);

            Assert.True(result.Status);
            var saved = Assert.IsType<Base_Product_ExtendData>(Assert.Single(extendData.Added));
            Assert.Equal(11, saved.Product_Id);
            Assert.Equal(7, saved.TableEx_Id);
            Assert.Equal("Color", saved.FieldCode);
            Assert.Equal("Blue", saved.FieldValue);
        }

        [Fact]
        public void ProcessAdd_ExtensionValue_IsMappedToProcessRecord()
        {
            var field = Field("Base_Process", 8, "Temperature", "温度");
            var service = ServiceFactory.Process(out var extendData, fields: new[] { field });
            var model = new SaveModel { Extra = "{\"Temperature\":\"25\"}" };
            service.Add(model);
            var callback = TestProxy.Callback<Func<Base_Process, object, WebResponseContent>>(service, "AddOnExecuted");

            var result = callback(new Base_Process { Process_Id = 12 }, null);

            Assert.True(result.Status);
            var saved = Assert.IsType<Base_Process_ExtendData>(Assert.Single(extendData.Added));
            Assert.Equal(12, saved.Process_Id);
            Assert.Equal("25", saved.FieldValue);
        }

        [Fact]
        public void DefectAdd_ExtensionValue_IsMappedToDefectRecord()
        {
            var field = Field("Base_DefectItem", 9, "Severity", "严重程度");
            var service = ServiceFactory.Defect(out var extendData, fields: new[] { field });
            var model = new SaveModel { Extra = "{\"Severity\":\"High\"}" };
            service.Add(model);
            var callback = TestProxy.Callback<Func<Base_DefectItem, object, WebResponseContent>>(service, "AddOnExecuted");

            var result = callback(new Base_DefectItem { DefectItem_Id = 13 }, null);

            Assert.True(result.Status);
            var saved = Assert.IsType<Base_DefectItem_ExtendData>(Assert.Single(extendData.Added));
            Assert.Equal(13, saved.DefectItem_Id);
            Assert.Equal("High", saved.FieldValue);
        }

        [Fact]
        public void ProductAdd_NoConfiguredExtensionFields_AddsNoExtensionRows()
        {
            var service = ServiceFactory.Product(out var extendData);
            var model = new SaveModel { Extra = "{}" };
            service.Add(model);
            var callback = TestProxy.Callback<Func<Base_Product, object, WebResponseContent>>(service, "AddOnExecuted");

            var result = callback(new Base_Product { Product_Id = 11 }, null);

            Assert.True(result.Status);
            Assert.Empty(extendData.Added);
        }

        private static Sys_Table_Extend Field(string table, int id, string code, string name)
        {
            return new Sys_Table_Extend
            {
                TableName = table,
                TableEx_Id = id,
                FieldCode = code,
                FieldName = name,
                FieldType = "string",
            };
        }
    }
}
