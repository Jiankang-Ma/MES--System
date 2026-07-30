-- ============================================================
-- 清理因数量为0导致产生的脏数据
-- 执行顺序：从子表到主表，避免外键冲突
-- ============================================================
USE iMES;
GO

BEGIN TRANSACTION;
BEGIN TRY

    -- 1. 先找出所有 Qty <= 0 的明细关联的 WorkOrderCode
    --    用于后续清理工单及相关工序

    -- 1.1 销售订单明细 -> 工单 -> 工单明细
    DELETE wol
    FROM Production_WorkOrderList wol
    INNER JOIN Production_WorkOrder wo ON wol.WorkOrderCode = wo.WorkOrderCode
    INNER JOIN Production_SalesOrderList sol ON sol.WorkOrderCode = wo.WorkOrderCode
    WHERE sol.Qty <= 0;

    -- 1.2 生产计划明细 -> 工单 -> 工单明细
    DELETE wol
    FROM Production_WorkOrderList wol
    INNER JOIN Production_WorkOrder wo ON wol.WorkOrderCode = wo.WorkOrderCode
    INNER JOIN Production_ProductPlanList ppl ON ppl.WorkOrderCode = wo.WorkOrderCode
    WHERE ppl.Qty <= 0;

    -- 1.3 装配工单明细 -> 工单 -> 工单明细
    DELETE wol
    FROM Production_WorkOrderList wol
    INNER JOIN Production_WorkOrder wo ON wol.WorkOrderCode = wo.WorkOrderCode
    INNER JOIN Production_AssembleWorkOrderList aol ON aol.WorkOrderCode = wo.WorkOrderCode
    WHERE aol.Qty <= 0;

    -- 2. 删除 Qty <= 0 关联的工单
    DELETE wo
    FROM Production_WorkOrder wo
    INNER JOIN Production_SalesOrderList sol ON sol.WorkOrderCode = wo.WorkOrderCode
    WHERE sol.Qty <= 0;

    DELETE wo
    FROM Production_WorkOrder wo
    INNER JOIN Production_ProductPlanList ppl ON ppl.WorkOrderCode = wo.WorkOrderCode
    WHERE ppl.Qty <= 0;

    DELETE wo
    FROM Production_WorkOrder wo
    INNER JOIN Production_AssembleWorkOrderList aol ON aol.WorkOrderCode = wo.WorkOrderCode
    WHERE aol.Qty <= 0;

    -- 3. 删除 Qty <= 0 的明细行
    DELETE FROM Production_SalesOrderList WHERE Qty <= 0;
    DELETE FROM Production_ProductPlanList WHERE Qty <= 0;
    DELETE FROM Production_AssembleWorkOrderList WHERE Qty <= 0;

    -- 4. 删除明细为空的主表记录
    DELETE FROM Production_SalesOrder 
    WHERE SalesOrder_Id NOT IN (SELECT DISTINCT SalesOrder_Id FROM Production_SalesOrderList);

    DELETE FROM Production_ProductPlan 
    WHERE ProductPlan_Id NOT IN (SELECT DISTINCT ProductPlan_Id FROM Production_ProductPlanList);

    DELETE FROM Production_AssembleWorkOrder 
    WHERE AssembleWorkOrder_Id NOT IN (SELECT DISTINCT AssembleWorkOrder_Id FROM Production_AssembleWorkOrderList);

    COMMIT TRANSACTION;
    PRINT '脏数据清理成功';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT '清理失败: ' + ERROR_MESSAGE();
END CATCH;
GO