using System.Collections.Generic;
using iMES.Core.BaseProvider;
using iMES.Core.Dapper;
using iMES.Custom.IRepositories;
using iMES.Entity.DomainModels;
using iMES.Production.IRepositories;
using iMES.Production.Services;
using Moq;

namespace iMES.Production.Tests;

/// <summary>WF-34：工单明细报表返回计划、合格与不良汇总数据。</summary>
public class ProductionWorkOrderReportTests
{
    [Fact]
    public void GetDetailPage_ReturnsReportRowsAndUsesGoodAndDefectAggregation()
    {
        var dapper = new Mock<ISqlDapper>();
        dapper.Setup(x => x.ExecuteScalar(It.IsAny<string>(), It.IsAny<object>(), null, false)).Returns(1);
        dapper.Setup(x => x.QueryList<Production_WorkOrderList>(
                It.Is<string>(sql => sql.Contains("sum(rwo.GoodQty)") && sql.Contains("sum(rwo.NoGoodQty)")),
                It.IsAny<object>(), null, false))
            .Returns(new List<Production_WorkOrderList>
            {
                new() { WorkOrder_Id = 5, PlanQty = 100, GoodQty = 90, NoGoodQty = 10 }
            });
        var repository = new Mock<IProduction_WorkOrderRepository>();
        repository.SetupGet(x => x.DapperContext).Returns(dapper.Object);
        var service = new Production_WorkOrderService(repository.Object, null, null, Mock.Of<IBase_ProductRepository>());

        var result = (PageGridData<Production_WorkOrderList>)service.GetDetailPage(new PageDataOptions { Page = 1, Rows = 20, Value = 5 });

        Assert.Equal(1, result.total);
        var row = Assert.Single(result.rows);
        Assert.Equal(100, row.PlanQty);
        Assert.Equal(90, row.GoodQty);
        Assert.Equal(10, row.NoGoodQty);
    }
}
