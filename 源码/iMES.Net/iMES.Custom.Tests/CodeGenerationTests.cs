using System;
using System.Linq;
using System.Text.RegularExpressions;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Custom.Tests
{
    public class CodeGenerationTests
    {
        [Fact]
        public void ProductCode_FirstDailyNumber_UsesConfiguredPrefixDateAndSerial()
        {
            var rule = Rule("Product", "P");
            var service = ServiceFactory.Product(rules: new[] { rule });

            var code = service.GetProductCode();

            Assert.Equal("P" + DateTime.Now.ToString("yyyyMMdd") + "001", code);
        }

        [Fact]
        public void ProductCode_ExistingDailyNumber_IncrementsSerial()
        {
            var date = DateTime.Now.ToString("yyyyMMdd");
            var service = ServiceFactory.Product(
                new[] { new Base_Product { ProductCode = "P" + date + "007", CreateDate = DateTime.Now } },
                new[] { Rule("Product", "P") });

            Assert.Equal("P" + date + "008", service.GetProductCode());
        }

        [Fact]
        public void ProductCode_NoRule_UsesEighteenDigitTimestamp()
        {
            var service = ServiceFactory.Product();

            Assert.Matches(new Regex("^[0-9]{18}$"), service.GetProductCode());
        }

        [Theory]
        [InlineData("Process", "PR")]
        [InlineData("DefectItem", "DF")]
        [InlineData("ProcessLine", "PL")]
        public void OtherCodes_FirstDailyNumber_UseTheirOwnRule(string formCode, string prefix)
        {
            var rule = Rule(formCode, prefix);
            string actual;
            if (formCode == "Process") actual = ServiceFactory.Process(rules: new[] { rule }).GetProcessCode();
            else if (formCode == "DefectItem") actual = ServiceFactory.Defect(rules: new[] { rule }).GetDefectItemCode();
            else actual = ServiceFactory.ProcessLine(rules: new[] { rule }).GetProcessLineCode();

            Assert.Equal(prefix + DateTime.Now.ToString("yyyyMMdd") + "001", actual);
        }

        private static Base_NumberRule Rule(string formCode, string prefix)
        {
            return new Base_NumberRule
            {
                FormCode = formCode,
                Prefix = prefix,
                SubmitTime = "yyyyMMdd",
                SerialNumber = 3,
                GenerativeRule = "prefix-date-serial",
                CreateDate = DateTime.Now,
            };
        }
    }
}
