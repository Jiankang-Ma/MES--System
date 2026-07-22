using System;
using System.Linq;
using iMES.Custom.IRepositories;
using iMES.Entity.DomainModels;
using iMES.Production.IRepositories;
using iMES.Production.Services;
using Moq;

namespace iMES.Production.Tests;

/// <summary>WF-08/09/10：由订单或计划生成工单时共用的工单编号规则。</summary>
public class ProductionWorkOrderNumberRulesTests
{
    [Fact]
    public void GetWorkOrderCode_IncrementsLatestCodeUsingConfiguredRule()
    {
        var workOrders = new Mock<IProduction_WorkOrderRepository>();
        workOrders.Setup(x => x.FindAsIQueryable(It.IsAny<global::System.Linq.Expressions.Expression<Func<Production_WorkOrder, bool>>>(), null))
            .Returns(new[] { new Production_WorkOrder { WorkOrderCode = "WO-007", CreateDate = DateTime.Now } }.AsQueryable());
        var rules = new Mock<IBase_NumberRuleRepository>();
        rules.Setup(x => x.FindAsIQueryable(It.IsAny<global::System.Linq.Expressions.Expression<Func<Base_NumberRule, bool>>>(), null))
            .Returns(new[] { new Base_NumberRule { Prefix = "WO-", SubmitTime = "yyyyMMdd", SerialNumber = 3 } }.AsQueryable());

        var service = new Production_WorkOrderService(workOrders.Object, rules.Object, null, null);

        var code = service.GetWorkOrderCode();
        Assert.StartsWith("WO-", code);
        Assert.EndsWith("008", code);
    }
}
