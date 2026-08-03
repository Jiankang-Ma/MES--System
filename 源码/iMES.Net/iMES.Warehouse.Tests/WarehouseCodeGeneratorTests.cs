using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using iMES.Core.Enums;
using iMES.Custom.IRepositories;
using iMES.Entity.DomainModels;
using iMES.Warehouse.Services;
using Moq;
using Xunit;

namespace iMES.Warehouse.Tests
{
    public class WarehouseCodeGeneratorTests
    {
        // ===== 路径1：无编码规则时，返回时间戳 =====

        [Fact]
        public void GenerateBillCode_NoNumberRule_ReturnsTimestamp()
        {
            var mockRepo = new Mock<IBase_NumberRuleRepository>();
            mockRepo.Setup(r => r.FindAsIQueryable(
                    It.IsAny<Expression<Func<Base_NumberRule, bool>>>(),
                    It.IsAny<Expression<Func<Base_NumberRule, Dictionary<object, QueryOrderBy>>>>()
                ))
                .Returns(Enumerable.Empty<Base_NumberRule>().AsQueryable());

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => null,
                mockRepo.Object,
                "InStoreForm");

            // 时间戳格式：yyyyMMddHHmmssffff = 18位数字
            Assert.Equal(18, code.Length);
            Assert.True(long.TryParse(code, out _));
        }

        // ===== 路径2：编码规则存在，无历史编号 → 从1开始 =====

        [Fact]
        public void GenerateBillCode_WithRuleButNoLastCode_StartsFromOne()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "TestForm",
                Prefix = "PO",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 4
            };
            var rules = new List<Base_NumberRule> { rule };

            var mockRepo = CreateMockRepo(rules);

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => null,
                mockRepo.Object,
                "TestForm");

            // 前缀 PO + 今天日期 yyyyMMdd + 序列号 0001
            string today = DateTime.Now.ToString("yyyyMMdd");
            string expected = $"PO{today}0001";
            Assert.Equal(expected, code);
        }

        // ===== 路径3：编码规则存在，有历史编号 → 序列号递增 =====

        [Fact]
        public void GenerateBillCode_WithRuleAndLastCode_IncrementsSerial()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "TestForm",
                Prefix = "PO",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 4
            };
            var rules = new List<Base_NumberRule> { rule };
            var mockRepo = CreateMockRepo(rules);

            string today = DateTime.Now.ToString("yyyyMMdd");
            string lastCode = $"PO{today}0005";

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => lastCode,
                mockRepo.Object,
                "TestForm");

            // 从 0005 递增到 0006
            string expected = $"PO{today}0006";
            Assert.Equal(expected, code);
        }

        // ===== 路径3-边界：序列号进位（如 0009 → 0010） =====

        [Fact]
        public void GenerateBillCode_SerialNumberCarryOver_WorksCorrectly()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "TestForm",
                Prefix = "PO",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 4
            };
            var rules = new List<Base_NumberRule> { rule };
            var mockRepo = CreateMockRepo(rules);

            string today = DateTime.Now.ToString("yyyyMMdd");
            string lastCode = $"PO{today}0009";

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => lastCode,
                mockRepo.Object,
                "TestForm");

            string expected = $"PO{today}0010";
            Assert.Equal(expected, code);
        }

        // ===== 不同序列号位数 =====

        [Fact]
        public void GenerateBillCode_DifferentSerialLength_WorksCorrectly()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "TestForm",
                Prefix = "CG",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 6
            };
            var rules = new List<Base_NumberRule> { rule };
            var mockRepo = CreateMockRepo(rules);

            string today = DateTime.Now.ToString("yyyyMMdd");
            string lastCode = $"CG{today}000123";

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => lastCode,
                mockRepo.Object,
                "TestForm");

            string expected = $"CG{today}000124";
            Assert.Equal(expected, code);
        }

        // ===== 入库单号生成路径验证 =====

        [Fact]
        public void GetWareHouseBillCode_UsesInStoreFormCode()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "InStoreForm",
                Prefix = "RK",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 4
            };
            var rules = new List<Base_NumberRule> { rule };
            var mockRepo = CreateMockRepo(rules);

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => null,
                mockRepo.Object,
                "InStoreForm");

            string today = DateTime.Now.ToString("yyyyMMdd");
            string expected = $"RK{today}0001";
            Assert.Equal(expected, code);
        }

        // ===== 出库单号生成路径验证 =====

        [Fact]
        public void GetOutWareHouseBillCode_UsesOutStoreFormCode()
        {
            var rule = new Base_NumberRule
            {
                FormCode = "OutStoreForm",
                Prefix = "CK",
                SubmitTime = "yyyyMMdd",
                SerialNumber = 4
            };
            var rules = new List<Base_NumberRule> { rule };
            var mockRepo = CreateMockRepo(rules);

            string code = WarehouseCodeGenerator.GenerateBillCode(
                () => null,
                mockRepo.Object,
                "OutStoreForm");

            string today = DateTime.Now.ToString("yyyyMMdd");
            string expected = $"CK{today}0001";
            Assert.Equal(expected, code);
        }

        /// <summary>创建 Mock 仓库，直接返回内存数据</summary>
        private static Mock<IBase_NumberRuleRepository> CreateMockRepo(List<Base_NumberRule> rules)
        {
            var mockRepo = new Mock<IBase_NumberRuleRepository>();
            mockRepo.Setup(r => r.FindAsIQueryable(
                    It.IsAny<Expression<Func<Base_NumberRule, bool>>>(),
                    It.IsAny<Expression<Func<Base_NumberRule, Dictionary<object, QueryOrderBy>>>>()
                ))
                .Returns(rules.AsQueryable());
            return mockRepo;
        }
    }
}
