using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using iMES.Core.Extensions;
using iMES.Entity;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.System.Tests
{
    public class SystemEntityValidationTests
    {
        [Fact]
        public void UserAddPayload_WithRequiredFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var payload = ValidUserPayload();
            payload["User_Id"] = 99;
            payload["ClientOnlyField"] = "ignore";

            string result = typeof(Sys_User).ValidateDicInEntity(payload, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("User_Id", payload.Keys);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
            Assert.Equal("系统测试员", payload["UserTrueName"]);
        }

        [Fact]
        public void UserAddPayload_WithoutUserName_IsRejected()
        {
            var payload = ValidUserPayload();
            payload.Remove("UserName");

            string result = typeof(Sys_User).ValidateDicInEntity(payload, true);

            Assert.Equal("用户名为必须提交项", result);
        }

        [Fact]
        public void UserAddPayload_WithUserTrueNameOverMaxLength_IsRejected()
        {
            var payload = ValidUserPayload();
            payload["UserTrueName"] = new string('A', 41);

            string result = typeof(Sys_User).ValidateDicInEntity(payload, true);

            Assert.Equal("用户真实姓名最多只能【40】个字符。", result);
        }

        [Fact]
        public void DictionaryAddPayload_WithRequiredFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var payload = ValidDictionaryPayload();
            payload["Dic_ID"] = 77;
            payload["ClientOnlyField"] = "ignore";

            string result = typeof(Sys_Dictionary).ValidateDicInEntity(payload, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("Dic_ID", payload.Keys);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
            Assert.Equal("SYS_AUTH_UNIT", payload["DicNo"]);
        }

        [Fact]
        public void DictionaryAddPayload_WithoutDicNo_IsRejected()
        {
            var payload = ValidDictionaryPayload();
            payload.Remove("DicNo");

            string result = typeof(Sys_Dictionary).ValidateDicInEntity(payload, true);

            Assert.Equal("字典编号为必须提交项", result);
        }

        [Fact]
        public void DictionaryListPayload_WithValueOverMaxLength_IsRejected()
        {
            var payload = new Dictionary<string, object>
            {
                ["Dic_ID"] = 1,
                ["DicValue"] = new string('A', 101),
                ["DicName"] = "系统权限",
                ["Enable"] = 1,
            };

            string result = typeof(Sys_DictionaryList).ValidateDicInEntity(payload, true);

            Assert.Equal("数据源Value最多只能【100】个字符。", result);
        }

        [Fact]
        public void DictionaryEntity_DeclaresDictionaryListAsDetailTable()
        {
            var attribute = typeof(Sys_Dictionary).GetCustomAttribute<EntityAttribute>();

            Assert.NotNull(attribute);
            Assert.Equal("字典数据", attribute.TableCnName);
            Assert.Equal("字典明细", attribute.DetailTableCnName);
            Assert.Contains(typeof(Sys_DictionaryList), attribute.DetailTable.ToList());
        }

        private static Dictionary<string, object> ValidUserPayload()
        {
            return new Dictionary<string, object>
            {
                ["UserName"] = "system_unit_user",
                ["Role_Id"] = 2,
                ["RoleName"] = "系统权限测试角色",
                ["UserTrueName"] = "系统测试员",
                ["IsRegregisterPhone"] = 0,
                ["Enable"] = 1,
            };
        }

        private static Dictionary<string, object> ValidDictionaryPayload()
        {
            return new Dictionary<string, object>
            {
                ["DicNo"] = "SYS_AUTH_UNIT",
                ["DicName"] = "系统权限单元测试字典",
                ["ParentId"] = 0,
                ["Enable"] = 1,
            };
        }
    }
}
