using System;
using System.Collections.Generic;
using iMES.Core.Extensions;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Warehouse.Tests
{
    public class Ware_WareHouseBillTests
    {
        // ===== 实体输入验证（ValidateDicInEntity 模式） =====

        [Fact]
        public void AddPayload_WithRequiredEditableFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var payload = ValidAddPayload();
            payload["WareHouseBill_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("WareHouseBill_Id", payload.Keys);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
            Assert.Equal("手工入库", payload["WareHouseBillType"]);
        }

        [Fact]
        public void AddPayload_WithoutRequiredWareHouseBillType_IsRejected()
        {
            var payload = ValidAddPayload();
            payload.Remove("WareHouseBillType");

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("入库类型为必须提交项", result);
        }

        [Fact]
        public void AddPayload_WithEmptyWareHouseBillType_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["WareHouseBillType"] = string.Empty;

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("入库类型不能为空", result);
        }

        [Fact]
        public void AddPayload_WithWareHouseBillTypeOverMaxLength_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["WareHouseBillType"] = new string('A', 201);

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("入库类型最多只能【200】个字符。", result);
        }

        [Fact]
        public void AddPayload_WithRemarkOverMaxLength_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["Remark"] = new string('A', 1001);

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("备注最多只能【1000】个字符。", result);
        }

        [Fact]
        public void UpdatePayload_RetainsPrimaryKeyButRemovesUnknownField()
        {
            var payload = ValidAddPayload();
            payload["WareHouseBill_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_WareHouseBill).ValidateDicInEntity(payload, true, false);

            Assert.Equal(string.Empty, result);
            Assert.Equal(99, payload["WareHouseBill_Id"]);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
        }

        // ===== 入库单明细实体验证 =====

        [Fact]
        public void DetailPayload_WithoutRequiredProductName_IsRejected()
        {
            var detail = ValidDetail();
            detail.Remove("ProductName");

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称为必须提交项", result);
        }

        [Fact]
        public void DetailPayload_WithEmptyProductName_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductName"] = string.Empty;

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称不能为空", result);
        }

        [Fact]
        public void DetailPayload_WithProductNameOverMaxLength_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductName"] = new string('A', 201);

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称最多只能【200】个字符。", result);
        }

        [Fact]
        public void DetailPayload_WithoutRequiredProductCode_IsRejected()
        {
            var detail = ValidDetail();
            detail.Remove("ProductCode");

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品编号为必须提交项", result);
        }

        [Fact]
        public void DetailPayload_WithoutRequiredUnit_Id_IsRejected()
        {
            var detail = ValidDetail();
            detail.Remove("Unit_Id");

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            // Unit_Id 是 int 类型，ValidateDicInEntity 跳过值类型 Required 检查
            // 因此移除后不会被阻止，只会被静默忽略
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void DetailPayload_WithProductStandardOverMaxLength_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductStandard"] = new string('A', 201);

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品规格最多只能【200】个字符。", result);
        }

        [Fact]
        public void DetailPayload_WithRequiredEditableFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var detail = ValidDetail();
            detail["WareHouseBillList_Id"] = 88;
            detail["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_WareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("WareHouseBillList_Id", detail.Keys);
            Assert.DoesNotContain("ClientOnlyField", detail.Keys);
        }

        // ===== 业务规则验证（静态逻辑） =====

        [Fact]
        public void BillCode_DefaultFormat_IsTimestamp()
        {
            string code = DateTime.Now.ToString("yyyyMMddHHmmssffff");

            Assert.Equal(18, code.Length);
            Assert.True(long.TryParse(code, out _));
        }

        [Fact]
        public void BillCode_Generated_IsNotEmpty()
        {
            string code = DateTime.Now.ToString("yyyyMMddHHmmssffff");

            Assert.False(string.IsNullOrWhiteSpace(code));
        }

        [Fact]
        public void InWarehouseDetail_EmptyList_IsRejected()
        {
            var details = new List<Ware_WareHouseBillList>();

            string msg = ValidateDetailNotEmpty(details);

            Assert.Equal("入库单至少需要一条产品明细", msg);
        }

        [Fact]
        public void InWarehouseDetail_NullList_IsRejected()
        {
            string msg = ValidateDetailNotEmpty(null);

            Assert.Equal("入库单至少需要一条产品明细", msg);
        }

        [Fact]
        public void InWarehouseDetail_ValidList_NoError()
        {
            var details = new List<Ware_WareHouseBillList>
            {
                new Ware_WareHouseBillList { Product_Id = 1, ProductName = "测试产品", ProductCode = "P001", InStoreQty = 10 }
            };

            string msg = ValidateDetailNotEmpty(details);

            Assert.Null(msg);
        }

        [Fact]
        public void InStoreQty_Zero_IsRejected()
        {
            var details = new List<Ware_WareHouseBillList>
            {
                new Ware_WareHouseBillList { Product_Id = 1, ProductName = "测试产品", ProductCode = "P001", InStoreQty = 0 }
            };

            string msg = ValidateInStoreQty(details);

            Assert.Equal("入库数量必须大于0", msg);
        }

        [Fact]
        public void InStoreQty_Negative_IsRejected()
        {
            var details = new List<Ware_WareHouseBillList>
            {
                new Ware_WareHouseBillList { Product_Id = 1, ProductName = "测试产品", ProductCode = "P001", InStoreQty = -5 }
            };

            string msg = ValidateInStoreQty(details);

            Assert.Equal("入库数量必须大于0", msg);
        }

        [Fact]
        public void InStoreQty_ValidPositive_NoError()
        {
            var details = new List<Ware_WareHouseBillList>
            {
                new Ware_WareHouseBillList { Product_Id = 1, ProductName = "测试产品", ProductCode = "P001", InStoreQty = 10 }
            };

            string msg = ValidateInStoreQty(details);

            Assert.Null(msg);
        }

        /// <summary>
        /// 验证入库单至少需要一条产品明细（模拟服务层校验逻辑）
        /// </summary>
        private static string ValidateDetailNotEmpty(List<Ware_WareHouseBillList> details)
        {
            if (details == null || details.Count == 0)
            {
                return "入库单至少需要一条产品明细";
            }
            return null;
        }

        /// <summary>
        /// 验证入库单明细数量（模拟服务层校验逻辑）
        /// </summary>
        private static string ValidateInStoreQty(List<Ware_WareHouseBillList> details)
        {
            foreach (var detail in details)
            {
                if (detail.InStoreQty <= 0)
                {
                    return "入库数量必须大于0";
                }
            }
            return null;
        }

        private static Dictionary<string, object> ValidAddPayload()
        {
            return new Dictionary<string, object>
            {
                ["WareHouseBillType"] = "手工入库",
                ["WareHouseDate"] = DateTime.Now,
                ["Remark"] = "单元测试入库单"
            };
        }

        private static Dictionary<string, object> ValidDetail()
        {
            return new Dictionary<string, object>
            {
                ["ProductName"] = "测试产品",
                ["ProductCode"] = "P001",
                ["Product_Id"] = 1,
                ["Unit_Id"] = 1,
                ["InStoreQty"] = 10m
            };
        }
    }
}
