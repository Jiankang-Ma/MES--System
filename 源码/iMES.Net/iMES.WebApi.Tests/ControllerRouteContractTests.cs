using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using iMES.Core.Filters;
using iMES.Entity.AttributeManager;
using Microsoft.AspNetCore.Mvc.Routing;
using Xunit;

namespace iMES.WebApi.Tests
{
    public class ControllerRouteContractTests
    {
        public static IEnumerable<object[]> CrudControllerCases()
        {
            return ControllerTestCatalog.CrudControllers.Select(type => new object[] { type.FullName });
        }

        public static IEnumerable<object[]> RoutedActionCases()
        {
            return ControllerTestCatalog.RoutedActions.Select(method => new object[]
            {
                method.DeclaringType.FullName,
                method.Name
            });
        }

        [Theory]
        [MemberData(nameof(CrudControllerCases))]
        public void CrudControllers_HaveApiRouteAndTheirDeclaredService(string controllerName)
        {
            var controller = ControllerTestCatalog.WebApiAssembly.GetType(controllerName);
            var routes = controller.GetCustomAttributes(inherit: true)
                .OfType<IRouteTemplateProvider>()
                .Where(attribute => !string.IsNullOrWhiteSpace(attribute.Template))
                .GroupBy(attribute => attribute.Template, StringComparer.OrdinalIgnoreCase)
                .Select(group => group.First())
                .ToList();
            var crudBase = ControllerTestCatalog.FindCrudBase(controller);
            var serviceType = crudBase.GetGenericArguments()[0];

            Assert.NotEmpty(routes);
            Assert.All(routes, route => Assert.StartsWith("api/", route.Template, StringComparison.OrdinalIgnoreCase));
            Assert.Contains(controller.GetConstructors(), ctor => ctor.GetParameters().Any(parameter => parameter.ParameterType == serviceType));
        }

        [Theory]
        [MemberData(nameof(RoutedActionCases))]
        public void RoutedActions_HaveExplicitHttpVerbAndAUsableTemplate(string controllerName, string actionName)
        {
            var controller = ControllerTestCatalog.WebApiAssembly.GetType(controllerName);
            var action = controller.GetMethod(actionName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            var route = Assert.Single(action.GetCustomAttributes(inherit: true)
                .OfType<IRouteTemplateProvider>()
                .Where(attribute => !string.IsNullOrWhiteSpace(attribute.Template))
                .GroupBy(attribute => attribute.Template, StringComparer.OrdinalIgnoreCase)
                .Select(group => group.First()));

            Assert.False(string.IsNullOrWhiteSpace(route.Template));
            Assert.NotEmpty(action.GetCustomAttributes(inherit: true).OfType<IActionHttpMethodProvider>());
        }

        [Theory]
        [MemberData(nameof(RoutedActionCases))]
        public void RoutedActions_AreJwtProtectedUnlessTheyExplicitlyAllowAnonymous(string controllerName, string actionName)
        {
            var controller = ControllerTestCatalog.WebApiAssembly.GetType(controllerName);
            var action = controller.GetMethod(actionName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);

            Assert.True(ControllerTestCatalog.IsAnonymous(action)
                || ControllerTestCatalog.HasJwtAuthorization(controller, action),
                $"{controllerName}.{actionName} 既未声明 AllowAnonymous，也没有 JWT 鉴权。");
        }

        [Fact]
        public void GenericCrudControllers_PermissionTableMatchesTheirDeclaredService()
        {
            var mismatches = ControllerTestCatalog.CrudControllers
                .Select(controller => new
                {
                    Controller = controller,
                    Permission = controller.GetCustomAttributes(inherit: true).OfType<PermissionTableAttribute>().SingleOrDefault(),
                    Service = ControllerTestCatalog.FindCrudBase(controller).GetGenericArguments()[0]
                })
                .Where(item => item.Permission != null)
                .Where(item => !string.Equals(
                    item.Service.Name.TrimStart('I').Replace("Service", string.Empty),
                    item.Permission.Name,
                    StringComparison.OrdinalIgnoreCase))
                .ToList();

            Assert.Empty(mismatches);
        }

        [Fact]
        public void SysLogTestEndpoint_IsNotAnonymousAndIsRestrictedToSuperAdmin()
        {
            var controller = ControllerTestCatalog.WebApiAssembly.GetType("iMES.System.Controllers.Sys_LogController");
            var action = controller.GetMethod("Test");

            Assert.False(ControllerTestCatalog.IsAnonymous(action));
            var permission = Assert.Single(action.GetCustomAttributes(inherit: true).OfType<ApiActionPermissionAttribute>());
            var requirement = Assert.Single(permission.Arguments.Cast<ActionPermissionRequirement>());
            Assert.Equal(new[] { 1 }, requirement.RoleIds);
        }

        [Fact]
        public void QualityEndpoints_RequireJwtAuthentication()
        {
            var controller = ControllerTestCatalog.WebApiAssembly.GetType("iMES.WebApi.Controllers.Quality.QualityController");

            Assert.All(controller.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
                .Where(method => method.GetCustomAttributes(inherit: true).OfType<IRouteTemplateProvider>().Any()),
                action => Assert.True(ControllerTestCatalog.HasJwtAuthorization(controller, action)));
        }
    }
}
