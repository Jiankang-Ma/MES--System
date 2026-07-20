using System.Collections.Generic;
using iMES.Core.Enums;
using iMES.Core.Extensions;
using iMES.Core.ManageUser;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Core.Tests
{
    public class CoreContractTests
    {
        [Theory]
        [InlineData("42", 42)]
        [InlineData(" 42 ", 42)]
        [InlineData("not-a-number", 0)]
        public void GetInt_ParsesValidInputAndFailsClosed(string value, int expected)
        {
            Assert.Equal(expected, value.GetInt());
        }

        [Fact]
        public void GetInt_NullValue_ReturnsZero()
        {
            object value = null;

            Assert.Equal(0, value.GetInt());
        }

        [Fact]
        public void SuperAdmin_IsOnlyRoleOne()
        {
            Assert.True(UserContext.IsRoleIdSuperAdmin(1));
            Assert.False(UserContext.IsRoleIdSuperAdmin(0));
            Assert.False(UserContext.IsRoleIdSuperAdmin(2));
        }

        [Fact]
        public void WebResponseContent_OkAndError_KeepExpectedStatusAndPayload()
        {
            var ok = WebResponseContent.Instance.OK("saved", 7);
            var error = WebResponseContent.Instance.Error("denied");

            Assert.True(ok.Status);
            Assert.Equal("saved", ok.Message);
            Assert.Equal(7, ok.Data);
            Assert.False(error.Status);
            Assert.Equal("denied", error.Message);
        }

        [Fact]
        public void WebResponseContent_SetResponseType_UsesStableCode()
        {
            var result = WebResponseContent.Instance.Error(ResponseType.NoPermissions);

            Assert.False(result.Status);
            Assert.Equal(((int)ResponseType.NoPermissions).ToString(), result.Code);
            Assert.False(string.IsNullOrWhiteSpace(result.Message));
        }

        [Fact]
        public void ActionAndAuditEnums_KeepExportContract()
        {
            Assert.Equal(4, (int)ActionPermissionOptions.Export);
            Assert.Equal("Export", LoggerType.Export.ToString());
        }

        [Fact]
        public void HasDetailChanges_NullOrEmptyCollections_AreNotDetailOperations()
        {
            Assert.False(((SaveModel)null).HasDetailChanges());
            Assert.False(new SaveModel
            {
                DetailData = new List<Dictionary<string, object>>(),
                DelKeys = new List<object>(),
            }.HasDetailChanges());
            Assert.False(new SaveModel
            {
                DetailData = new List<Dictionary<string, object>> { new Dictionary<string, object>() },
            }.HasDetailChanges());
        }

        [Fact]
        public void HasDetailChanges_NonEmptyDetailOrDeleteKey_IsDetailOperation()
        {
            Assert.True(new SaveModel
            {
                DetailData = new List<Dictionary<string, object>>
                {
                    new Dictionary<string, object> { ["Detail_Id"] = 1 },
                },
            }.HasDetailChanges());
            Assert.True(new SaveModel { DelKeys = new List<object> { 1 } }.HasDetailChanges());
        }
    }
}
