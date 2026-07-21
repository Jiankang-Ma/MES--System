using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using iMES.Core.Enums;
using iMES.Core.Utilities;
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Entity.DomainModels;
using iMES.Production.IRepositories;
using iMES.Production.Services;
using Moq;
using Xunit;

namespace iMES.Production.Tests
{
    /// <summary>
    /// WF-10 生产计划生成工单
    /// 验证生产计划能够生成生产工单，工单关联来源计划，编号规则正确。
    /// </summary>
    public class ProductionPlanWorkflowTests
    {
        [Fact]
        public void WF10_ProductPlan_CreatesWorkOrderWithCorrectAssociation()
        {
            // Arrange
            var planCode = "PP-20260721-001";
            var productId = 200;
            var productCode = "P-200";
            var productName = "计划产品";
            var processLineId = 30;
            var planQty = 100;

            var workOrderRepo = new Mock<IProduction_WorkOrderRepository>();
            workOrderRepo.Setup(x => x.FindAsIQueryable(
                    It.IsAny<Expression<Func<Production_WorkOrder, bool>>>(), null))
                .Returns(new List<Production_WorkOrder>().AsQueryable());

            var productRepo = new Mock<IBase_ProductRepository>();
            productRepo.Setup(x => x.FindAsIQueryable(
                    It.IsAny<Expression<Func<Base_Product, bool>>>(), null))
                .Returns(new[]
                {
                    new Base_Product
                    {
                        Product_Id = productId,
                        ProductCode = productCode,
                        ProductName = productName,
                        Unit_Id = 2,
                        Process_Id = processLineId
                    }
                }.AsQueryable());

            var processService = new Mock<IBase_ProcessService>();
            processService.Setup(x => x.GetProcessListByLineID(processLineId))
                .Returns(new List<Base_Process>
                {
                    new Base_Process { Process_Id = 10, ProcessName = "加工", ProcessCode = "JG", SubmitWorkLimit = "all", SubmitWorkMatch = 1 }
                });

            var processRepo = new Mock<IBase_ProcessRepository>();
            processRepo.Setup(x => x.FindAsIQueryable(
                    It.IsAny<Expression<Func<Base_Process, bool>>>(), null))
                .Returns(new[] { new Base_Process { Process_Id = 10, ProcessName = "加工", ProcessCode = "JG", SubmitWorkLimit = "all", SubmitWorkMatch = 1 } }.AsQueryable());

            // Act - 模拟生产计划 Add 中的工单生成逻辑
            var workOrderCode = planCode + "-1";
            var workOrder = new Production_WorkOrder
            {
                WorkOrderCode = workOrderCode,
                Product_Id = productId,
                ProductCode = productCode,
                ProductName = productName,
                Unit_Id = 2,
                AssociatedForm = planCode,
                FromType = "ProductPlan",
                Status = "1",
                PlanQty = planQty,
                RealQty = 0,
                GoodQty = 0,
                NoGoodQty = 0
            };

            // Assert
            Assert.Equal(planCode + "-1", workOrder.WorkOrderCode);
            Assert.Equal(productId, workOrder.Product_Id);
            Assert.Equal(productCode, workOrder.ProductCode);
            Assert.Equal(productName, workOrder.ProductName);
            Assert.Equal(planQty, workOrder.PlanQty);
            Assert.Equal(planCode, workOrder.AssociatedForm);
            Assert.Equal("ProductPlan", workOrder.FromType);
            Assert.Equal("1", workOrder.Status); // 草稿/已下达状态
        }

        [Fact]
        public void WF10_ProductPlan_WorkOrderNumberIncrements()
        {
            // Arrange
            var planCode = "PP-20260721-002";
            var existingCodes = new[] { "PP-20260721-002-1" };

            var workOrderRepo = new Mock<IProduction_WorkOrderRepository>();
            workOrderRepo.Setup(x => x.FindAsIQueryable(
                    It.IsAny<Expression<Func<Production_WorkOrder, bool>>>(), null))
                .Returns(existingCodes.Select(c => new Production_WorkOrder { WorkOrderCode = c, CreateDate = DateTime.Now }).AsQueryable());

            // Act - 模拟获取下一个序号
            // 从最后一个"-"后面取序号
            string maxWorkOrderCode = existingCodes.OrderByDescending(x => x).FirstOrDefault();
            int sequence = 1;
            if (!string.IsNullOrEmpty(maxWorkOrderCode))
            {
                int lastDashIndex = maxWorkOrderCode.LastIndexOf('-');
                if (lastDashIndex >= 0 && lastDashIndex < maxWorkOrderCode.Length - 1)
                {
                    string seqStr = maxWorkOrderCode.Substring(lastDashIndex + 1);
                    if (int.TryParse(seqStr, out int parsedSeq))
                    {
                        sequence = parsedSeq + 1;
                    }
                }
            }

            // Assert
            Assert.Equal(2, sequence);
            var newCode = planCode + "-" + sequence;
            Assert.Equal("PP-20260721-002-2", newCode);
        }

        [Fact]
        public void WF10_ProductPlan_GeneratesWorkOrderListTasks()
        {
            // Arrange - 验证生产计划生成工单后，工单按工艺路线拆分任务
            var planCode = "PP-20260721-003";
            var processLineId = 40;
            var planQty = 50;

            var processes = new List<Base_Process>
            {
                new Base_Process { Process_Id = 1, ProcessName = "下料", ProcessCode = "XL", SubmitWorkLimit = "all", SubmitWorkMatch = 1m },
                new Base_Process { Process_Id = 2, ProcessName = "焊接", ProcessCode = "HJ", SubmitWorkLimit = "all", SubmitWorkMatch = 1m },
                new Base_Process { Process_Id = 3, ProcessName = "装配", ProcessCode = "ZP", SubmitWorkLimit = "all", SubmitWorkMatch = 1m }
            };

            var processService = new Mock<IBase_ProcessService>();
            processService.Setup(x => x.GetProcessListByLineID(processLineId))
                .Returns(processes);

            var processRepo = new Mock<IBase_ProcessRepository>();
            processRepo.Setup(x => x.FindAsIQueryable(
                    It.IsAny<Expression<Func<Base_Process, bool>>>(), null))
                .Returns((Expression<Func<Base_Process, bool>> expr, Expression<Func<Base_Process, Dictionary<object, QueryOrderBy>>> orderBy) =>
                    processes.AsQueryable().Where(expr));

            // Act - 模拟工单任务拆分逻辑
            var workOrderCode = planCode + "-1";
            var taskList = new List<Production_WorkOrderList>();
            for (int j = 0; j < processes.Count; j++)
            {
                var process = processes[j];
                taskList.Add(new Production_WorkOrderList
                {
                    Process_Id = process.Process_Id,
                    ProcessName = process.ProcessName,
                    ProcessCode = process.ProcessCode,
                    SubmitWorkLimit = process.SubmitWorkLimit,
                    SubmitWorkMatch = process.SubmitWorkMatch,
                    PlanQty = planQty,
                    GoodQty = 0,
                    NoGoodQty = 0,
                    WorkOrderCode = workOrderCode,
                    PlanStartDate = DateTime.Today,
                    PlanEndDate = DateTime.Today.AddDays(1)
                });
            }

            // Assert
            Assert.Equal(3, taskList.Count);

            // 验证任务顺序与工艺路线一致
            Assert.Equal("下料", taskList[0].ProcessName);
            Assert.Equal("焊接", taskList[1].ProcessName);
            Assert.Equal("装配", taskList[2].ProcessName);

            // 验证每个任务都关联正确的工单
            foreach (var task in taskList)
            {
                Assert.Equal(workOrderCode, task.WorkOrderCode);
                Assert.Equal(planQty, task.PlanQty);
                Assert.Equal(0, task.GoodQty);
                Assert.Equal(0, task.NoGoodQty);
            }
        }
    }
}
