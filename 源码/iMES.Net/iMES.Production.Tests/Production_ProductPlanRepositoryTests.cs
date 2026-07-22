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
        private readonly BaseDbContext _context;

        public Production_ProductPlanRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<BaseDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new TestDbContext(options);
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
            _context.Dispose();
        }

        private class TestDbContext : BaseDbContext
        {
            public TestDbContext(DbContextOptions<BaseDbContext> options) : base(options)
            {
            }

            protected override string ConnectionString => "Data Source=:memory:";

            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                optionsBuilder.UseInMemoryDatabase(Guid.NewGuid().ToString());
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Production_ProductPlan>();
                base.OnModelCreating(modelBuilder);
            }
        }
    }
}
