using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using iMES.Core.Controllers.Basic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Routing;

namespace iMES.WebApi.Tests
{
    internal static class ControllerTestCatalog
    {
        internal static readonly Assembly WebApiAssembly = typeof(Startup).Assembly;

        internal static IEnumerable<Type> Controllers => WebApiAssembly
            .GetTypes()
            .Where(type => type.IsClass && !type.IsAbstract && type.Namespace != null
                && type.Namespace.StartsWith("iMES.") && type.Namespace.Contains("Controllers"))
            .OrderBy(type => type.FullName);

        internal static IEnumerable<Type> CrudControllers => Controllers
            .Where(type => FindCrudBase(type) != null);

        internal static IEnumerable<MethodInfo> RoutedActions => Controllers
            .SelectMany(type => type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            .Where(method => !method.IsSpecialName
                && method.GetCustomAttributes(inherit: true).OfType<IRouteTemplateProvider>().Any());

        internal static Type FindCrudBase(Type type)
        {
            for (var current = type; current != null; current = current.BaseType)
            {
                if (current.IsGenericType && current.GetGenericTypeDefinition() == typeof(ApiBaseController<>))
                {
                    return current;
                }
            }
            return null;
        }

        internal static bool HasJwtAuthorization(Type controller, MethodInfo action)
        {
            return action.GetCustomAttributes(inherit: true).OfType<AuthorizeAttribute>().Any()
                || controller.GetCustomAttributes(inherit: true).OfType<AuthorizeAttribute>().Any();
        }

        internal static bool IsAnonymous(MethodInfo action)
        {
            return action.GetCustomAttributes(inherit: true).OfType<IAllowAnonymous>().Any();
        }
    }
}
