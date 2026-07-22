using System;
using Microsoft.EntityFrameworkCore;
using Xunit;
using iMES.Entity.DomainModels;
using iMES.Core.EFDbContext;
using iMES.Production.Repositories;

namespace iMES.Production.Tests
{
    public class Production_ProductPlanRepositoryTests : IDisposable
    {
        // 保持为 SysDbContext，以满足 Production_ProductPlanRepository 的构造参数要求
        private readonly SysDbContext _context;

        public Production_ProductPlanRepositoryTests()
        {
            // 【关键修复】：因为 SysDbContext 的 base 构造函数需要 DbContextOptions<BaseDbContext>，
            // 所以这里必须使用 BaseDbContext 作为泛型参数来构建 Options。
            var options = new DbContextOptionsBuilder<BaseDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new TestSysDbContext(options);
        }

        [Fact]
        public void AddProductPlan_SavesToDatabase()
        {
            var repo = new Production_ProductPlanRepository(_context);
            var entity = new Production_ProductPlan { ProductPlan_Id = 1, ProductPlanCode = "test-code" };
            
            repo.Add(entity);
            _context.SaveChanges();

            var saved = _context.Set<Production_ProductPlan>().Find(1);
            Assert.NotNull(saved);
            Assert.Equal("test-code", saved.ProductPlanCode);
        }

        public void Dispose()
        {
            _context?.Dispose();
        }

        private class TestSysDbContext : SysDbContext
        {
            // 【关键修复】：接收 DbContextOptions<BaseDbContext> 并传给 base
            public TestSysDbContext(DbContextOptions<BaseDbContext> options) : base(options)
            {
            }

            protected override string ConnectionString => "Data Source=:memory:";

            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                // 如果外部已经配置了 Options（如 InMemory），则跳过父类可能存在的真实数据库配置
                if (!optionsBuilder.IsConfigured)
                {
                    base.OnConfiguring(optionsBuilder);
                }
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Production_ProductPlan>();
                base.OnModelCreating(modelBuilder);
            }
        }
    }
}