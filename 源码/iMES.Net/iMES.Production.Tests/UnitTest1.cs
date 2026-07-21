using System.Collections.Generic;
using System.Reflection;
using iMES.Core.BaseProvider;
using iMES.Entity.DomainModels;
using iMES.Production.Services;

namespace iMES.Production.Tests;

public class ProductionReportTimeBoundaryTests
{
    [Theory]
    [InlineData(946684800000L)]
    [InlineData(4102444800000L)]
    public void NormalizeMobileReportTime_ConvertsSupportedUnixMillisecondBoundary(long epochMilliseconds)
    {
        var service = new Production_ReportWorkOrderService(null, null, null, null, null, null);
        var model = new SaveModel
        {
            MainData = new Dictionary<string, object> { ["ReportTime"] = epochMilliseconds }
        };

        InvokeNormalizeMobileReportTime(service, model);

        Assert.IsType<global::System.DateTime>(model.MainData["ReportTime"]);
    }

    [Fact]
    public void NormalizeMobileReportTime_LeavesUnsupportedUnixMillisecondValueUntouched()
    {
        var service = new Production_ReportWorkOrderService(null, null, null, null, null, null);
        var model = new SaveModel
        {
            MainData = new Dictionary<string, object> { ["ReportTime"] = 1L }
        };

        InvokeNormalizeMobileReportTime(service, model);

        Assert.Equal(1L, model.MainData["ReportTime"]);
    }

    private static void InvokeNormalizeMobileReportTime(Production_ReportWorkOrderService service, SaveModel model)
    {
        var method = typeof(Production_ReportWorkOrderService).GetMethod(
            "NormalizeMobileReportTime", BindingFlags.Instance | BindingFlags.NonPublic);
        Assert.NotNull(method);
        method.Invoke(service, new object[] { model });
    }
}
