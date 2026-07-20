using System;
using System.Collections.Generic;
using iMES.Core.Extensions;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Core.Tests
{
    public class BaseNoticeInputValidationTests
    {
        [Fact]
        public void AddPayload_WithRequiredEditableFields_RemovesPrimaryKeyAndUnknownFields()
        {
            var payload = ValidPayload();
            payload["Notice_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Base_Notice).ValidateDicInEntity(payload, true);

            Assert.Equal(string.Empty, result);
            Assert.DoesNotContain("Notice_Id", payload.Keys);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
            Assert.Equal("通知", payload["NoticeType"]);
        }

        [Fact]
        public void AddPayload_WithoutRequiredTitle_IsRejected()
        {
            var payload = ValidPayload();
            payload.Remove("NoticeTitle");

            string result = typeof(Base_Notice).ValidateDicInEntity(payload, true);

            Assert.Equal("标题为必须提交项", result);
        }

        [Fact]
        public void AddPayload_WithEmptyRequiredContent_IsRejected()
        {
            var payload = ValidPayload();
            payload["NoticeContent"] = string.Empty;

            string result = typeof(Base_Notice).ValidateDicInEntity(payload, true);

            Assert.Equal("内容不能为空", result);
        }

        [Fact]
        public void AddPayload_WithTitleOverMaxLength_IsRejected()
        {
            var payload = ValidPayload();
            payload["NoticeTitle"] = new string('A', 501);

            string result = typeof(Base_Notice).ValidateDicInEntity(payload, true);

            Assert.Equal("标题最多只能【500】个字符。", result);
        }

        [Fact]
        public void UpdatePayload_RetainsPrimaryKeyButRemovesUnknownField()
        {
            var payload = ValidPayload();
            payload["Notice_Id"] = 99;
            payload["ClientOnlyField"] = "should-not-persist";

            string result = typeof(Base_Notice).ValidateDicInEntity(payload, true, false);

            Assert.Equal(string.Empty, result);
            Assert.Equal(99, payload["Notice_Id"]);
            Assert.DoesNotContain("ClientOnlyField", payload.Keys);
        }

        private static Dictionary<string, object> ValidPayload()
        {
            return new Dictionary<string, object>
            {
                ["NoticeType"] = "通知",
                ["NoticeTitle"] = "单元测试通知",
                ["NoticeContent"] = "仅验证输入契约，不访问数据库",
            };
        }
    }
}
