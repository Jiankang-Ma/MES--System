using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using iMES.Core.EFDbContext;
using iMES.Entity.DomainModels;
using iMES.Entity.SystemModels;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace iMES.Custom.Tests
{
    public class EntityValidationTests
    {
        [Fact]
        public void Product_RequiredFieldsPresent_PassesValidation()
        {
            var product = ValidProduct();

            Assert.Empty(Validate(product));
        }

        [Fact]
        public void Product_MissingNameAndAttribute_FailsValidation()
        {
            var product = ValidProduct();
            product.ProductName = null;
            product.ProductAttribute = null;

            var members = Validate(product).SelectMany(x => x.MemberNames).ToList();

            Assert.Contains(nameof(Base_Product.ProductName), members);
            Assert.Contains(nameof(Base_Product.ProductAttribute), members);
        }

        [Theory]
        [InlineData(200, true)]
        [InlineData(201, false)]
        public void ProductName_LengthBoundary_IsEnforced(int length, bool expectedValid)
        {
            var product = ValidProduct();
            product.ProductName = new string('P', length);

            Assert.Equal(expectedValid, !Validate(product).Any());
        }

        [Fact]
        public void Process_MissingBusinessFields_FailsValidation()
        {
            var process = new Base_Process
            {
                ProcessCode = "PROC-001",
                ProcessName = null,
                SubmitWorkLimit = null,
                DefectItem = null,
                SubmitWorkMatch = 1m,
            };

            var members = Validate(process).SelectMany(x => x.MemberNames).ToList();

            Assert.Contains(nameof(Base_Process.ProcessName), members);
            Assert.Contains(nameof(Base_Process.SubmitWorkLimit), members);
            Assert.Contains(nameof(Base_Process.DefectItem), members);
        }

        [Theory]
        [InlineData(200, true)]
        [InlineData(201, false)]
        public void DefectItemName_LengthBoundary_IsEnforced(int length, bool expectedValid)
        {
            var defect = new Base_DefectItem
            {
                DefectItemCode = "DEF-001",
                DefectItemName = new string('D', length),
            };

            Assert.Equal(expectedValid, !Validate(defect).Any());
        }

        [Fact]
        public void ProcessLine_MissingName_FailsValidation()
        {
            var processLine = new Base_ProcessLine { ProcessLineCode = "LINE-001" };

            var members = Validate(processLine).SelectMany(x => x.MemberNames).ToList();

            Assert.Contains(nameof(Base_ProcessLine.ProcessLineName), members);
        }

        [Fact]
        public void MaterialDetailView_HistoricalMissingProcess_IsAllowedToLoad()
        {
            var bom = new View_Base_MaterialDetail
            {
                MaterialDetail_Id = 1,
                ParentProduct_Id = 1,
                ChildProduct_Id = 2,
                QuantityPer = 1m,
                Process_Id = null,
            };

            var members = Validate(bom).SelectMany(x => x.MemberNames).ToList();

            Assert.DoesNotContain(nameof(View_Base_MaterialDetail.Process_Id), members);
        }

        [Fact]
        public void MaterialDetailView_ProcessId_IsNullableInEfModel()
        {
            var options = new DbContextOptionsBuilder<BaseDbContext>()
                .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=iMES_Test;Trusted_Connection=True;")
                .Options;

            using var context = new TestSysDbContext(options);
            var property = context.Model.FindEntityType(typeof(View_Base_MaterialDetail))
                .FindProperty(nameof(View_Base_MaterialDetail.Process_Id));

            Assert.True(property.IsNullable);
        }

        private sealed class TestSysDbContext : SysDbContext
        {
            public TestSysDbContext(DbContextOptions<BaseDbContext> options) : base(options)
            {
            }

            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
            }
        }

        private static Base_Product ValidProduct()
        {
            return new Base_Product
            {
                ProductCode = "PROD-001",
                ProductName = "Product",
                Unit_Id = 1,
                ProductAttribute = "Finished",
            };
        }

        private static List<ValidationResult> Validate(object model)
        {
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(model, new ValidationContext(model), results, true);
            return results;
        }
    }
}
