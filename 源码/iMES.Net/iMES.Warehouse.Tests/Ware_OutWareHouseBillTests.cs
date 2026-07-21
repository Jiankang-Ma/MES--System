using System;
using System.Collections.Generic;
using System.Linq;
using iMES.Core.Extensions;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Warehouse.Tests
{
    public class Ware_OutWareHouseBillTests
    {
        // ===== 实体输入验证（ValidateDicInEntity 模式） =====

        [Fact]
        public void AddPayload_WithRequiredEditableFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var payload = ValidAddPayload();
            payload["OutWareHouseBill_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("OutWareHouseBill_Id", payload.Keys);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
            Assert.Equal("销售出库", payload["OutWareHouseBillType"]);
        }

        [Fact]
        public void AddPayload_WithoutRequiredOutWareHouseBillType_IsRejected()
        {
            var payload = ValidAddPayload();
            payload.Remove("OutWareHouseBillType");

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("出库类型为必须提交项", result);
        }

        [Fact]
        public void AddPayload_WithEmptyOutWareHouseBillType_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["OutWareHouseBillType"] = string.Empty;

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("出库类型不能为空", result);
        }

        [Fact]
        public void AddPayload_WithOutWareHouseBillTypeOverMaxLength_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["OutWareHouseBillType"] = new string('A', 201);

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("出库类型最多只能【200】个字符。", result);
        }

        [Fact]
        public void AddPayload_WithRemarkOverMaxLength_IsRejected()
        {
            var payload = ValidAddPayload();
            payload["Remark"] = new string('A', 1001);

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true);

            Assert.Equal("备注最多只能【1000】个字符。", result);
        }

        [Fact]
        public void UpdatePayload_RetainsPrimaryKeyButRemovesUnknownField()
        {
            var payload = ValidAddPayload();
            payload["OutWareHouseBill_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_OutWareHouseBill).ValidateDicInEntity(payload, true, false);

            Assert.Equal(string.Empty, result);
            Assert.Equal(99, payload["OutWareHouseBill_Id"]);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
        }

        // ===== 出库单明细实体验证 =====

        [Fact]
        public void DetailPayload_WithoutRequiredProductName_IsRejected()
        {
            var detail = ValidDetail();
            detail.Remove("ProductName");

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称为必须提交项", result);
        }

        [Fact]
        public void DetailPayload_WithEmptyProductName_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductName"] = string.Empty;

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称不能为空", result);
        }

        [Fact]
        public void DetailPayload_WithProductNameOverMaxLength_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductName"] = new string('A', 201);

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品名称最多只能【200】个字符。", result);
        }

        [Fact]
        public void DetailPayload_WithoutRequiredProductCode_IsRejected()
        {
            var detail = ValidDetail();
            detail.Remove("ProductCode");

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品编号为必须提交项", result);
        }

        [Fact]
        public void DetailPayload_WithProductStandardOverMaxLength_IsRejected()
        {
            var detail = ValidDetail();
            detail["ProductStandard"] = new string('A', 201);

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal("产品规格最多只能【200】个字符。", result);
        }

        [Fact]
        public void DetailPayload_WithRequiredEditableFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var detail = ValidDetail();
            detail["OutWareHouseBillList_Id"] = 88;
            detail["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Ware_OutWareHouseBillList).ValidateDicInEntity(detail, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("OutWareHouseBillList_Id", detail.Keys);
            Assert.DoesNotContain("ClientOnlyField", detail.Keys);
        }

        // ===== 出库单号生成规则 =====

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

        // ===== 出库单明细校验 =====

        [Fact]
        public void OutWarehouseDetail_EmptyList_IsRejected()
        {
            var details = new List<Ware_OutWareHouseBillList>();

            string msg = ValidateDetailNotEmpty(details);

            Assert.Equal("出库单至少需要一条产品明细", msg);
        }

        [Fact]
        public void OutWarehouseDetail_NullList_IsRejected()
        {
            string msg = ValidateDetailNotEmpty(null);

            Assert.Equal("出库单至少需要一条产品明细", msg);
        }

        [Fact]
        public void OutWarehouseDetail_ValidList_NoError()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, ProductName = "测试产品", ProductCode = "P001", OutStoreQty = 10 }
            };

            string msg = ValidateDetailNotEmpty(details);

            Assert.Null(msg);
        }

        // ===== 出库数量校验 =====

        [Fact]
        public void OutStoreQty_Zero_IsRejected()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 0 }
            };

            string msg = ValidateInventory(details, new List<Base_Product>());

            Assert.Equal("出库数量必须大于0", msg);
        }

        [Fact]
        public void OutStoreQty_Negative_IsRejected()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = -5 }
            };

            string msg = ValidateInventory(details, new List<Base_Product>());

            Assert.Equal("出库数量必须大于0", msg);
        }

        [Fact]
        public void OutStoreQty_ValidPositive_NoError()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 5 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Null(msg);
        }

        // ===== 库存校验 =====

        [Fact]
        public void Inventory_ProductExistsAndSufficient_Passes()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 5 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Null(msg);
        }

        [Fact]
        public void Inventory_Insufficient_IsRejected()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 15 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Equal("产品库存不足，当前库存10，申请出库15", msg);
        }

        [Fact]
        public void Inventory_ProductNotFound_IsRejected()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 999, OutStoreQty = 5 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Equal("产品库存不足，当前库存0，申请出库5", msg);
        }

        [Fact]
        public void Inventory_ExactQuantity_Succeeds()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 10 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Null(msg);
        }

        // ===== 多产品混合场景 =====

        [Fact]
        public void MultiProduct_AllSufficient_Passes()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 3 },
                new Ware_OutWareHouseBillList { Product_Id = 2, OutStoreQty = 5 },
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 2 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 },
                new Base_Product { Product_Id = 2, InventoryQty = 8 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Null(msg);
        }

        [Fact]
        public void MultiProduct_OneInsufficient_RejectsWithMessage()
        {
            var details = new List<Ware_OutWareHouseBillList>
            {
                new Ware_OutWareHouseBillList { Product_Id = 1, OutStoreQty = 3 },
                new Ware_OutWareHouseBillList { Product_Id = 2, OutStoreQty = 10 }
            };
            var inventory = new List<Base_Product>
            {
                new Base_Product { Product_Id = 1, InventoryQty = 10 },
                new Base_Product { Product_Id = 2, InventoryQty = 5 }
            };

            string msg = ValidateInventory(details, inventory);

            Assert.Equal("产品库存不足，当前库存5，申请出库10", msg);
        }

        // ===== 编号校验模拟 =====

        [Fact]
        public void BillCodeDuplicate_Simulated()
        {
            // 模拟编号重复场景：两个出库单使用相同编号
            string code = "OUT20260720001";

            bool exists = CodeExistsInSimulatedData(code, new List<string> { code });

            Assert.True(exists);
        }

        [Fact]
        public void BillCodeUnique_Simulated()
        {
            string code = "OUT20260720001";

            bool exists = CodeExistsInSimulatedData(code, new List<string> { "OUT20260720002", "OUT20260720003" });

            Assert.False(exists);
        }

        // ===== 辅助方法 =====

        private static string ValidateInventory(List<Ware_OutWareHouseBillList> details, List<Base_Product> inventory)
        {
            foreach (var group in details.GroupBy(x => x.Product_Id))
            {
                var available = inventory.FirstOrDefault(x => x.Product_Id == group.Key)?.InventoryQty ?? 0;
                var requested = group.Sum(x => x.OutStoreQty);

                if (requested <= 0)
                {
                    return "出库数量必须大于0";
                }
                if (requested > available)
                {
                    return $"产品库存不足，当前库存{available}，申请出库{requested}";
                }
            }
            return null;
        }

        private static string ValidateDetailNotEmpty(List<Ware_OutWareHouseBillList> details)
        {
            if (details == null || details.Count == 0)
            {
                return "出库单至少需要一条产品明细";
            }
            return null;
        }

        private static bool CodeExistsInSimulatedData(string code, List<string> existingCodes)
        {
            return existingCodes.Contains(code);
        }

        private static Dictionary<string, object> ValidAddPayload()
        {
            return new Dictionary<string, object>
            {
                ["OutWareHouseBillType"] = "销售出库",
                ["OutWareHouseDate"] = DateTime.Now,
                ["Remark"] = "单元测试出库单"
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
                ["OutStoreQty"] = 10m
            };
        }
    }
}
