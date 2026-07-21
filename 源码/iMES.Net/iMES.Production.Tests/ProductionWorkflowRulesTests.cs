using System;
using System.Collections.Generic;
using System.Reflection;
using Xunit;
using iMES.Entity.DomainModels;
using iMES.Production.Services;

namespace iMES.Production.Tests
{
    public class ProductionWorkflowRulesTests
    {
        [Fact]
        public void ReportWorkOrder_ShouldNormalizeUnixMillisecondsToDateTime()
        {
            var service = new Production_ReportWorkOrderService(null, null, null, null, null, null);
            var saveModel = new SaveModel
            {
                MainData = new Dictionary<string, object>
                {
                    ["ReportTime"] = 1710000000000L
                }
            };

            InvokePrivateMethod(service, "NormalizeMobileReportTime", saveModel);

            Assert.True(saveModel.MainData["ReportTime"] is DateTime);
        }

        [Fact]
        public void ReportWorkOrder_ShouldRejectZeroOrNegativeQty()
        {
            var service = new Production_ReportWorkOrderService(null, null, null, null, null, null);
            var report = new Production_ReportWorkOrder { ApproveStatus = 2, ReportQty = 0 };

            var result = InvokePrivateMethod<object>(service, "ValidateMaterialConsumption", report);

            Assert.NotNull(result);
            var statusProperty = result.GetType().GetProperty("Status");
            var messageProperty = result.GetType().GetProperty("Message");
            Assert.NotNull(statusProperty);
            Assert.NotNull(messageProperty);
            Assert.False((bool)statusProperty.GetValue(result));
            Assert.Contains("报工数必须大于0", (string)messageProperty.GetValue(result));
        }

        [Fact]
        public void ReportWorkOrder_ShouldAllowUnconfirmedStatusWithoutQtyCheck()
        {
            var service = new Production_ReportWorkOrderService(null, null, null, null, null, null);
            var report = new Production_ReportWorkOrder { ApproveStatus = 1, ReportQty = 0 };

            var result = InvokePrivateMethod<object>(service, "ValidateMaterialConsumption", report);

            var statusProperty = result.GetType().GetProperty("Status");
            Assert.NotNull(statusProperty);
            Assert.True((bool)statusProperty.GetValue(result));
        }

        private static void InvokePrivateMethod(object instance, string methodName, params object[] parameters)
        {
            var method = instance.GetType().GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic);
            Assert.NotNull(method);
            method.Invoke(instance, parameters);
        }

        private static T InvokePrivateMethod<T>(object instance, string methodName, params object[] parameters)
        {
            var method = instance.GetType().GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic);
            Assert.NotNull(method);
            return (T)method.Invoke(instance, parameters);
        }
    }
}
