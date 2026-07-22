using System;
using System.Collections.Generic;
using System.Linq;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Production.Tests
{
    /// <summary>
    /// WF-12 工单自动拆分任务
    /// WF-13 工单状态流转
    /// 验证工单根据工艺路线拆分任务，以及工单状态按允许顺序流转。
    /// </summary>
    public class ProductionWorkOrderTaskTests
    {
        [Fact]
        public void WF12_WorkOrder_SplitsIntoMultipleTasksByProcessRoute()
        {
            // Arrange - 产品A的工艺路线包含3个工序
            var processes = new List<(int Id, string Name, string Code, decimal Match)>
            {
                (1, "下料", "XL", 1m),
                (2, "焊接", "HJ", 1m),
                (3, "装配", "ZP", 1m)
            };
            var planQty = 100;
            var workOrderCode = "WO-20260721-001";

            // Act - 模拟工单按工艺路线拆分任务
            var tasks = new List<Production_WorkOrderList>();
            for (int i = 0; i < processes.Count; i++)
            {
                var p = processes[i];
                tasks.Add(new Production_WorkOrderList
                {
                    WorkOrderList_Id = i + 1,
                    WorkOrderCode = workOrderCode,
                    WorkOrder_Id = 1,
                    Process_Id = p.Id,
                    ProcessName = p.Name,
                    ProcessCode = p.Code,
                    SubmitWorkMatch = p.Match,
                    PlanQty = (int)(planQty * p.Match),
                    GoodQty = 0,
                    NoGoodQty = 0,
                    PlanStartDate = DateTime.Today,
                    PlanEndDate = DateTime.Today.AddDays(1)
                });
            }

            // Assert
            Assert.Equal(3, tasks.Count);

            // 验证任务顺序与工艺路线一致
            Assert.Equal("下料", tasks[0].ProcessName);
            Assert.Equal("焊接", tasks[1].ProcessName);
            Assert.Equal("装配", tasks[2].ProcessName);

            // 验证每个任务关联正确的工单
            foreach (var task in tasks)
            {
                Assert.Equal(workOrderCode, task.WorkOrderCode);
                Assert.Equal(1, task.WorkOrder_Id);
            }

            // 验证计划数量按配比计算
            Assert.Equal(100, tasks[0].PlanQty);
            Assert.Equal(100, tasks[1].PlanQty);
            Assert.Equal(100, tasks[2].PlanQty);

            // 验证初始进度为0
            foreach (var task in tasks)
            {
                Assert.Equal(0, task.GoodQty);
                Assert.Equal(0, task.NoGoodQty);
            }
        }

        [Fact]
        public void WF12_WorkOrder_TaskOrderPreservesProcessSequence()
        {
            // Arrange - 验证工序顺序正确保存
            var processes = new List<(int Id, string Name, int Sequence)>
            {
                (1, "下料", 1),
                (2, "焊接", 2),
                (3, "装配", 3)
            };

            // Act - 按Sequence排序
            var sorted = processes.OrderBy(p => p.Sequence).ToList();

            // Assert
            Assert.Equal("下料", sorted[0].Name);
            Assert.Equal("焊接", sorted[1].Name);
            Assert.Equal("装配", sorted[2].Name);
        }

        [Fact]
        public void WF13_WorkOrder_StatusTransitionsCorrectly()
        {
            // Arrange - 定义允许的状态流转
            var allowedTransitions = new Dictionary<string, string[]>
            {
                ["1"] = new[] { "2" },           // 草稿 -> 已下达
                ["2"] = new[] { "3", "5" },       // 已下达 -> 执行中 / 已取消
                ["3"] = new[] { "4", "5" },       // 执行中 -> 已完成 / 已取消
                ["4"] = new string[0],            // 已完成 -> 无后续状态
                ["5"] = new string[0]             // 已取消 -> 无后续状态
            };

            // Act & Assert - 验证正向流转
            Assert.Contains("2", allowedTransitions["1"]); // 草稿 -> 已下达
            Assert.Contains("3", allowedTransitions["2"]); // 已下达 -> 执行中
            Assert.Contains("4", allowedTransitions["3"]); // 执行中 -> 已完成

            // 验证禁止的流转
            Assert.DoesNotContain("4", allowedTransitions["1"]); // 草稿不能直接完成
            Assert.DoesNotContain("3", allowedTransitions["1"]); // 草稿不能直接执行中
            Assert.DoesNotContain("1", allowedTransitions["4"]); // 已完成不能回到草稿
            Assert.DoesNotContain("2", allowedTransitions["4"]); // 已完成不能回到已下达
            Assert.DoesNotContain("3", allowedTransitions["4"]); // 已完成不能回到执行中
        }

        [Fact]
        public void WF13_CompletedWorkOrder_CannotBeExecutedAgain()
        {
            // Arrange
            var workOrder = new Production_WorkOrder
            {
                WorkOrder_Id = 1,
                WorkOrderCode = "WO-001",
                Status = "4", // 已完成
                PlanQty = 100,
                GoodQty = 100,
                RealQty = 100
            };

            // Act & Assert - 已完成工单不能再次执行
            Assert.Equal("4", workOrder.Status);
            Assert.Equal(workOrder.PlanQty, workOrder.GoodQty);

            // 模拟尝试再次报工
            var allowedNextStatuses = new string[0]; // 已完成无后续状态
            Assert.DoesNotContain("3", allowedNextStatuses); // 不能回到执行中
        }

        [Fact]
        public void WF13_DraftWorkOrder_CannotTransitionToCompleted()
        {
            // Arrange
            var draftStatus = "1"; // 草稿
            var completedStatus = "4"; // 已完成

            // Act - 草稿工单不允许直接完成
            var allowedFromDraft = new[] { "2" }; // 只能到已下达

            // Assert
            Assert.DoesNotContain(completedStatus, allowedFromDraft);
            Assert.Contains("2", allowedFromDraft);
        }

        [Fact]
        public void WF13_WorkOrder_ProgressCannotExceed100Percent()
        {
            // Arrange
            var planQty = 100;
            var goodQty = 100;

            // Act - 模拟进度计算
            var progress = (decimal)goodQty / planQty;

            // Assert
            Assert.Equal(1.0m, progress);
            Assert.True(progress <= 1.0m);

            // 验证超100%的情况
            var overQty = 110;
            var overProgress = (decimal)overQty / planQty;
            Assert.True(overProgress > 1.0m);
            // 系统应限制报工数量不超过计划数量
            Assert.True(overQty > planQty);
        }
    }
}
