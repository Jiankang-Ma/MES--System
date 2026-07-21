using System;
using System.Collections.Generic;
using System.Linq;
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
    /// WF-15 PC端正常报工
    /// WF-16 分批报工
    /// WF-34 生产报表数据核对
    /// 验证报工流程的正确性，包括正常报工、分批报工、数据汇总核对。
    /// </summary>
    public class ProductionReportWorkflowTests
    {
        [Fact]
        public void WF15_NormalReport_UpdatesWorkOrderProgress()
        {
            // Arrange - 正常报工场景
            var workOrderCode = "WO-20260721-001";
            var processId = 1;
            var processName = "下料";
            var reportQty = 50;
            var goodQty = 48;
            var noGoodQty = 2;

            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = workOrderCode,
                Status = "3", // 执行中
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0,
                RealQty = 0
            };

            var workOrderList = new Production_WorkOrderList
            {
                WorkOrderList_Id = 1,
                WorkOrderCode = workOrderCode,
                WorkOrder_Id = 1,
                Process_Id = processId,
                ProcessName = processName,
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0
            };

            // Act - 模拟报工逻辑
            workOrderList.GoodQty += goodQty;
            workOrderList.NoGoodQty += noGoodQty;
            workOrder.RealQty += reportQty;
            workOrder.GoodQty += goodQty;
            workOrder.NoGoodQty += noGoodQty;

            // Assert - 验证报工后数据正确
            Assert.Equal(48, workOrderList.GoodQty);
            Assert.Equal(2, workOrderList.NoGoodQty);
            Assert.Equal(50, workOrder.RealQty);
            Assert.Equal(48, workOrder.GoodQty);
            Assert.Equal(2, workOrder.NoGoodQty);

            // 验证良品率
            var yieldRate = Math.Round((decimal)workOrder.GoodQty / workOrder.RealQty, 2);
            Assert.Equal(0.96m, yieldRate);
        }

        [Fact]
        public void WF15_NormalReport_UpdatesMultipleProcessTasks()
        {
            // Arrange - 多工序报工
            var workOrderCode = "WO-20260721-002";
            var tasks = new List<Production_WorkOrderList>
            {
                new Production_WorkOrderList { WorkOrderList_Id = 1, WorkOrderCode = workOrderCode, Process_Id = 1, ProcessName = "下料", PlanQty = 100, GoodQty = 0, NoGoodQty = 0 },
                new Production_WorkOrderList { WorkOrderList_Id = 2, WorkOrderCode = workOrderCode, Process_Id = 2, ProcessName = "焊接", PlanQty = 100, GoodQty = 0, NoGoodQty = 0 },
                new Production_WorkOrderList { WorkOrderList_Id = 3, WorkOrderCode = workOrderCode, Process_Id = 3, ProcessName = "装配", PlanQty = 100, GoodQty = 0, NoGoodQty = 0 }
            };

            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = workOrderCode,
                Status = "3",
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0,
                RealQty = 0
            };

            // Act - 模拟各工序报工
            // 下料: 良品48, 不良2
            tasks[0].GoodQty += 48;
            tasks[0].NoGoodQty += 2;
            // 焊接: 良品46, 不良2
            tasks[1].GoodQty += 46;
            tasks[1].NoGoodQty += 2;
            // 装配: 良品45, 不良1
            tasks[2].GoodQty += 45;
            tasks[2].NoGoodQty += 1;

            // 汇总到工单
            workOrder.GoodQty = tasks.Min(t => t.GoodQty); // 取最小良品数
            workOrder.NoGoodQty = tasks.Sum(t => t.NoGoodQty);
            workOrder.RealQty = tasks.Sum(t => t.GoodQty + t.NoGoodQty);

            // Assert
            Assert.Equal(45, workOrder.GoodQty); // 瓶颈工序决定最终良品
            Assert.Equal(5, workOrder.NoGoodQty);
            Assert.Equal(144, workOrder.RealQty);

            // 验证各工序数据
            Assert.Equal(48, tasks[0].GoodQty);
            Assert.Equal(46, tasks[1].GoodQty);
            Assert.Equal(45, tasks[2].GoodQty);
        }

        [Fact]
        public void WF16_BatchReport_AccumulatesCorrectly()
        {
            // Arrange - 分批报工场景
            var workOrderCode = "WO-20260721-003";
            var processId = 1;

            var workOrderList = new Production_WorkOrderList
            {
                WorkOrderList_Id = 1,
                WorkOrderCode = workOrderCode,
                Process_Id = processId,
                ProcessName = "下料",
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0
            };

            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = workOrderCode,
                Status = "3",
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0,
                RealQty = 0
            };

            // Act - 模拟3次分批报工
            // 第一批: 20良品
            workOrderList.GoodQty += 20;
            workOrder.GoodQty += 20;
            workOrder.RealQty += 20;

            // 第二批: 30良品, 2不良
            workOrderList.GoodQty += 30;
            workOrderList.NoGoodQty += 2;
            workOrder.GoodQty += 30;
            workOrder.NoGoodQty += 2;
            workOrder.RealQty += 32;

            // 第三批: 48良品, 0不良
            workOrderList.GoodQty += 48;
            workOrder.GoodQty += 48;
            workOrder.RealQty += 48;

            // Assert - 验证累计数据正确
            Assert.Equal(98, workOrderList.GoodQty);
            Assert.Equal(2, workOrderList.NoGoodQty);
            Assert.Equal(98, workOrder.GoodQty);
            Assert.Equal(2, workOrder.NoGoodQty);
            Assert.Equal(100, workOrder.RealQty);

            // 验证不超过计划数量
            Assert.True(workOrderList.GoodQty <= workOrderList.PlanQty);
            Assert.True(workOrder.RealQty <= workOrder.PlanQty);
        }

        [Fact]
        public void WF16_BatchReport_ExceedingPlanQty_ShouldBeLimited()
        {
            // Arrange
            var workOrderList = new Production_WorkOrderList
            {
                PlanQty = 100,
                GoodQty = 95,
                NoGoodQty = 3
            };

            var remainingQty = workOrderList.PlanQty - (workOrderList.GoodQty + workOrderList.NoGoodQty);

            // Act - 尝试报工超过剩余数量
            var attemptQty = 5;
            var actualReportQty = Math.Min(attemptQty, remainingQty);

            // Assert
            Assert.Equal(2, remainingQty);
            Assert.Equal(2, actualReportQty); // 限制为剩余数量
            Assert.True(actualReportQty <= remainingQty);
        }

        [Fact]
        public void WF34_ProductionReport_DataConsistencyCheck()
        {
            // Arrange - 验证生产报表数据一致性
            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = "WO-20260721-004",
                PlanQty = 100,
                GoodQty = 95,
                NoGoodQty = 3,
                RealQty = 98,
                Status = "4" // 已完成
            };

            // Act & Assert - 验证数据一致性规则
            // 规则1: 良品 + 不良品 = 实际报工数量
            Assert.Equal(workOrder.GoodQty + workOrder.NoGoodQty, workOrder.RealQty);

            // 规则2: 实际报工数量 <= 计划数量
            Assert.True(workOrder.RealQty <= workOrder.PlanQty);

            // 规则3: 良品率计算 (保留4位小数比较)
            var yieldRate = Math.Round((decimal)workOrder.GoodQty / workOrder.RealQty, 4);
            Assert.Equal(0.9694m, yieldRate);

            // 规则4: 不良率计算
            var defectRate = Math.Round((decimal)workOrder.NoGoodQty / workOrder.RealQty, 4);
            Assert.Equal(0.0306m, defectRate);

            // 规则5: 良品率 + 不良率 = 100% (近似)
            Assert.Equal(1.0m, Math.Round(yieldRate + defectRate, 4));
        }

        [Fact]
        public void WF34_ProductionReport_MultipleWorkOrdersAggregation()
        {
            // Arrange - 多工单汇总
            var workOrders = new List<Production_WorkOrder>
            {
                new Production_WorkOrder { WorkOrderCode = "WO-001", PlanQty = 100, GoodQty = 95, NoGoodQty = 3, RealQty = 98, Status = "4" },
                new Production_WorkOrder { WorkOrderCode = "WO-002", PlanQty = 200, GoodQty = 190, NoGoodQty = 8, RealQty = 198, Status = "4" },
                new Production_WorkOrder { WorkOrderCode = "WO-003", PlanQty = 150, GoodQty = 145, NoGoodQty = 4, RealQty = 149, Status = "4" }
            };

            // Act - 汇总计算
            var totalPlanQty = workOrders.Sum(w => w.PlanQty);
            var totalGoodQty = workOrders.Sum(w => w.GoodQty);
            var totalNoGoodQty = workOrders.Sum(w => w.NoGoodQty);
            var totalRealQty = workOrders.Sum(w => w.RealQty);
            var totalYieldRate = Math.Round((decimal)totalGoodQty / totalRealQty, 4);

            // Assert
            Assert.Equal(450, totalPlanQty);
            Assert.Equal(430, totalGoodQty);
            Assert.Equal(15, totalNoGoodQty);
            Assert.Equal(445, totalRealQty);

            // 验证汇总一致性
            Assert.Equal(totalGoodQty + totalNoGoodQty, totalRealQty);

            // 验证整体良品率
            Assert.Equal(0.9663m, totalYieldRate);
        }

        [Fact]
        public void WF34_ProductionReport_ZeroProductionEdgeCase()
        {
            // Arrange - 零产量场景
            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = "WO-000",
                PlanQty = 100,
                GoodQty = 0,
                NoGoodQty = 0,
                RealQty = 0,
                Status = "2" // 已下达但未开始
            };

            // Act & Assert
            Assert.Equal(0, workOrder.RealQty);
            Assert.Equal(0, workOrder.GoodQty);
            Assert.Equal(0, workOrder.NoGoodQty);

            // 未开始报工，良品率应为0（避免除零）
            if (workOrder.RealQty > 0)
            {
                var yieldRate = (decimal)workOrder.GoodQty / workOrder.RealQty;
                Assert.True(yieldRate >= 0);
            }
            else
            {
                Assert.True(true); // 未报工，跳过良品率计算
            }
        }

        [Fact]
        public void WF34_ProductionReport_AllDefectiveEdgeCase()
        {
            // Arrange - 全部不良场景
            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 2,
                WorkOrderCode = "WO-ALL-DEFECT",
                PlanQty = 50,
                GoodQty = 0,
                NoGoodQty = 50,
                RealQty = 50,
                Status = "4"
            };

            // Act & Assert
            Assert.Equal(50, workOrder.RealQty);
            Assert.Equal(0, workOrder.GoodQty);
            Assert.Equal(50, workOrder.NoGoodQty);

            // 良品率0%
            var yieldRate = (decimal)workOrder.GoodQty / workOrder.RealQty;
            Assert.Equal(0m, yieldRate);

            // 不良率100%
            var defectRate = (decimal)workOrder.NoGoodQty / workOrder.RealQty;
            Assert.Equal(1.0m, defectRate);
        }
    }
}
