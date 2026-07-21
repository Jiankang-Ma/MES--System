using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using iMES.Entity.SystemModels;

namespace iMES.Custom.Tests
{
    public class RepositoryProxy<TEntity> : DispatchProxy where TEntity : BaseEntity
    {
        public List<TEntity> Data { get; set; } = new List<TEntity>();
        public List<object> Added { get; } = new List<object>();
        public List<object> Updated { get; } = new List<object>();
        public List<object> DeletedKeys { get; } = new List<object>();

        protected override object Invoke(MethodInfo targetMethod, object[] args)
        {
            if (targetMethod.Name == "FindAsIQueryable" && !targetMethod.IsGenericMethod)
            {
                var query = Data.AsQueryable();
                if (args != null && args.Length > 0 && args[0] is Expression<Func<TEntity, bool>> predicate)
                    query = query.Where(predicate);
                return query;
            }

            if (targetMethod.Name == "Exists" && !targetMethod.IsGenericMethod)
            {
                var predicate = (Expression<Func<TEntity, bool>>)args[0];
                return Data.AsQueryable().Any(predicate);
            }

            if (targetMethod.Name == "Find" && targetMethod.IsGenericMethod && args?.Length == 2)
            {
                var predicate = (LambdaExpression)args[0];
                var selector = (LambdaExpression)args[1];
                var resultType = targetMethod.GetGenericArguments()[0];
                var list = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(resultType));
                foreach (var entity in Data)
                {
                    if ((bool)predicate.Compile().DynamicInvoke(entity))
                        list.Add(selector.Compile().DynamicInvoke(entity));
                }
                return list;
            }

            if (targetMethod.Name == "DbContextBeginTransaction")
                return ((Delegate)args[0]).DynamicInvoke();

            if (targetMethod.Name == "Add" || targetMethod.Name == "Update")
            {
                if (args?.Length > 0) AddedOrUpdated(targetMethod.Name, args[0]);
                return DefaultValue(targetMethod.ReturnType);
            }

            if (targetMethod.Name == "AddRange" || targetMethod.Name == "UpdateRange")
            {
                if (args?.Length > 0 && args[0] is IEnumerable items)
                    foreach (var item in items) AddedOrUpdated(targetMethod.Name, item);
                return DefaultValue(targetMethod.ReturnType);
            }

            if (targetMethod.Name == "DeleteWithKeys")
            {
                var keys = args?[0] as object[];
                if (keys != null) DeletedKeys.AddRange(keys);
                return keys?.Length ?? 0;
            }

            return DefaultValue(targetMethod.ReturnType);
        }

        private void AddedOrUpdated(string method, object item)
        {
            if (method.StartsWith("Add", StringComparison.Ordinal)) Added.Add(item);
            else Updated.Add(item);
        }

        private static object DefaultValue(Type type)
        {
            if (type == typeof(void)) return null;
            if (type.IsValueType) return Activator.CreateInstance(type);
            return null;
        }
    }

    internal static class TestProxy
    {
        public static TRepository Repository<TEntity, TRepository>(
            IEnumerable<TEntity> data,
            out RepositoryProxy<TEntity> proxy)
            where TEntity : BaseEntity
            where TRepository : class
        {
            var repository = DispatchProxy.Create<TRepository, RepositoryProxy<TEntity>>();
            proxy = (RepositoryProxy<TEntity>)(object)repository;
            proxy.Data = data?.ToList() ?? new List<TEntity>();
            return repository;
        }

        public static TRepository Repository<TEntity, TRepository>(params TEntity[] data)
            where TEntity : BaseEntity
            where TRepository : class
        {
            return Repository<TEntity, TRepository>(data, out _);
        }

        public static TDelegate Callback<TDelegate>(object service, string fieldName)
            where TDelegate : class
        {
            for (var type = service.GetType(); type != null; type = type.BaseType)
            {
                var field = type.GetField(fieldName, BindingFlags.Instance | BindingFlags.NonPublic);
                if (field != null) return field.GetValue(service) as TDelegate;
            }
            throw new InvalidOperationException($"Callback {fieldName} was not found.");
        }

        public static TInterface Empty<TInterface>() where TInterface : class
        {
            return DispatchProxy.Create<TInterface, EmptyDispatchProxy>();
        }
    }

    public class EmptyDispatchProxy : DispatchProxy
    {
        protected override object Invoke(MethodInfo targetMethod, object[] args)
        {
            if (targetMethod.ReturnType == typeof(void)) return null;
            if (targetMethod.ReturnType.IsValueType)
                return Activator.CreateInstance(targetMethod.ReturnType);
            return null;
        }
    }
}
