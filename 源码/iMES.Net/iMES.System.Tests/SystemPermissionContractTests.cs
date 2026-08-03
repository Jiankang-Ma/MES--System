using System.Linq;
using iMES.Core.Enums;
using iMES.Core.Filters;
using iMES.Core.ManageUser;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.System.Tests
{
    public class SystemPermissionContractTests
    {
        [Fact]
        public void SuperAdmin_IsOnlyRoleOne()
        {
            Assert.True(UserContext.IsRoleIdSuperAdmin(1));
            Assert.False(UserContext.IsRoleIdSuperAdmin(0));
            Assert.False(UserContext.IsRoleIdSuperAdmin(2));
        }

        [Fact]
        public void ActionPermissionOptions_KeepButtonValuesStable()
        {
            Assert.Equal(0, (int)ActionPermissionOptions.Add);
            Assert.Equal(1, (int)ActionPermissionOptions.Delete);
            Assert.Equal(2, (int)ActionPermissionOptions.Update);
            Assert.Equal(3, (int)ActionPermissionOptions.Search);
            Assert.Equal(4, (int)ActionPermissionOptions.Export);
        }

        [Fact]
        public void LoggerType_KeepCrudAndExportAuditNames()
        {
            Assert.Equal("Add", LoggerType.Add.ToString());
            Assert.Equal("Edit", LoggerType.Edit.ToString());
            Assert.Equal("Del", LoggerType.Del.ToString());
            Assert.Equal("Export", LoggerType.Export.ToString());
        }

        [Fact]
        public void PermissionDeniedResponses_UseDedicatedCodes()
        {
            var noPermission = WebResponseContent.Instance.Error(ResponseType.NoPermissions);
            var noRolePermission = WebResponseContent.Instance.Error(ResponseType.NoRolePermissions);

            Assert.False(noPermission.Status);
            Assert.False(noRolePermission.Status);
            Assert.Equal(((int)ResponseType.NoPermissions).ToString(), noPermission.Code);
            Assert.Equal(((int)ResponseType.NoRolePermissions).ToString(), noRolePermission.Code);
        }

        [Fact]
        public void ApiActionPermission_WithExplicitTable_BuildsSearchRequirement()
        {
            var attribute = new ApiActionPermissionAttribute("Base_Notice", ActionPermissionOptions.Search);
            var requirement = Assert.Single(attribute.Arguments.Cast<ActionPermissionRequirement>());

            Assert.True(requirement.IsApi);
            Assert.False(requirement.SysController);
            Assert.Equal("Base_Notice", requirement.TableName);
            Assert.Equal("Search", requirement.TableAction);
            Assert.Null(requirement.RoleIds);
        }

        [Fact]
        public void ApiActionPermission_WithGeneratedControllerAction_BuildsSysControllerRequirement()
        {
            var attribute = new ApiActionPermissionAttribute(ActionPermissionOptions.Add);
            var requirement = Assert.Single(attribute.Arguments.Cast<ActionPermissionRequirement>());

            Assert.True(requirement.IsApi);
            Assert.True(requirement.SysController);
            Assert.Equal(string.Empty, requirement.TableName);
            Assert.Equal("Add", requirement.TableAction);
        }

        [Fact]
        public void ApiActionPermission_WithRoleRestriction_BuildsRoleRequirement()
        {
            var attribute = new ApiActionPermissionAttribute(ActionRolePermission.SuperAdmin);
            var requirement = Assert.Single(attribute.Arguments.Cast<ActionPermissionRequirement>());

            Assert.True(requirement.IsApi);
            Assert.Equal(new[] { 1 }, requirement.RoleIds);
            Assert.Equal(string.Empty, requirement.TableName);
            Assert.Equal(string.Empty, requirement.TableAction);
        }

        [Fact]
        public void RolePermissionPayload_SearchDoesNotImplyWriteActions()
        {
            var permission = new Permissions
            {
                Menu_Id = 10,
                ParentId = 1,
                TableName = "base_notice",
                UserAuth = "Search",
                UserAuthArr = new[] { "Search" },
                MenuType = 0,
            };

            Assert.Contains("Search", permission.UserAuthArr);
            Assert.DoesNotContain("Add", permission.UserAuthArr);
            Assert.DoesNotContain("Delete", permission.UserAuthArr);
        }

        [Fact]
        public void RoleAuthorPayload_KeepsMenuAndActionShape()
        {
            var roleAuthor = new RoleAuthor
            {
                menuId = 10,
                actions = "Search,Export",
            };

            Assert.Equal(10, roleAuthor.menuId);
            Assert.Equal("Search,Export", roleAuthor.actions);
        }
    }
}
