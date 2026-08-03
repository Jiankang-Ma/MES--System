using System;
using System.Linq;
using System.Reflection;
using iMES.Core.EFDbContext;
using iMES.Core.Utilities;
using iMES.Custom.IRepositories;
using iMES.Entity.DomainModels;
using iMES.Production.IRepositories;
using iMES.Production.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace iMES.Production.Tests;

/// <summary>WF-15/16/18/21/22 的报工生效、库存和产出规则。</summary>
public class ProductionReportInventoryRulesTests : IDisposable
{
    private readonly ReportTestDbContext _context;
    private readonly Mock<IProduction_ReportWorkOrderRepository> _reportRepository = new();
    private readonly Mock<IBase_MaterialDetailRepository> _materialRepository = new();

    public ProductionReportInventoryRulesTests()
    {
        _context = new ReportTestDbContext(new DbContextOptionsBuilder<BaseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        _reportRepository.SetupGet(x => x.DbContext).Returns(_context);
    }

    [Fact]
    public void ConfirmedReport_RejectsWhenBomInventoryIsInsufficient()
    {
        _materialRepository.Setup(x => x.FindAsIQueryable(It.IsAny<global::System.Linq.Expressions.Expression<Func<Base_MaterialDetail, bool>>>(), null))
            .Returns(new[] { new Base_MaterialDetail { ChildProduct_Id = 9, QuantityPer = 2 } }.AsQueryable());
        var result = Invoke<WebResponseContent>(CreateService(), "ValidateMaterialConsumption",
            new Production_ReportWorkOrder { ApproveStatus = 2, Product_Id = 1, Process_Id = 2, ReportQty = 3 });

        Assert.False(result.Status); // WF-15/18/21：确认报工不得在库存不足时生效
        Assert.Contains("库存不足", result.Message);
    }

    [Fact]
    public void FinalProcessConfirmedReport_CreatesGoodQuantityOutputOnce()
    {
        _context.Set<Base_Product>().Add(new Base_Product { Product_Id = 1, ProductCode = "P1", ProductName = "成品", ProductAttribute = "成品", Process_Id = 20 });
        _context.Set<Base_ProcessLineList>().AddRange(
            new Base_ProcessLineList { ProcessLine_Id = 20, ProcessLineType = "process", Process_Id = 2, Sequence = 1 },
            new Base_ProcessLineList { ProcessLine_Id = 20, ProcessLineType = "process", Process_Id = 3, Sequence = 2 });
        _context.SaveChanges();
        var report = new Production_ReportWorkOrder { ReportWorkOrder_Id = 7, ApproveStatus = 2, Product_Id = 1, Process_Id = 3, ReportQty = 10, GoodQty = 8, NoGoodQty = 2 };

        var first = Invoke<WebResponseContent>(CreateService(), "CreateProductionOutput", report);
        var second = Invoke<WebResponseContent>(CreateService(), "CreateProductionOutput", report);

        Assert.True(first.Status);
        Assert.Single(_context.Set<Ware_WareHouseBillList>());
        Assert.Equal(8, _context.Set<Ware_WareHouseBillList>().Single().InStoreQty);
        Assert.False(second.Status); // WF-16/18/22：重复生效不得重复产出
    }

    private Production_ReportWorkOrderService CreateService() =>
        new(_reportRepository.Object, null, null, null, null, _materialRepository.Object);

    private static T Invoke<T>(object target, string name, params object[] args) =>
        (T)target.GetType().GetMethod(name, BindingFlags.Instance | BindingFlags.NonPublic)!.Invoke(target, args)!;

    public void Dispose() => _context.Dispose();

    private sealed class ReportTestDbContext : BaseDbContext
    {
        public ReportTestDbContext(DbContextOptions<BaseDbContext> options) : base(options) { }
        protected override string ConnectionString => "Data Source=:memory:";
        protected override void OnConfiguring(DbContextOptionsBuilder builder) => builder.UseInMemoryDatabase(Guid.NewGuid().ToString());
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Base_Product>();
            builder.Entity<Base_ProcessLineList>();
            builder.Entity<Ware_WareHouseBill>();
            builder.Entity<Ware_WareHouseBillList>();
            builder.Entity<Ware_OutWareHouseBill>();
            builder.Entity<Ware_OutWareHouseBillList>();
            base.OnModelCreating(builder);
        }
    }
}
