/*
  防止历史零计划数量在装配工单进度查询中触发 SQL Server 除以零异常。
  新增/编辑接口已禁止零或负数量；本补丁只为已存在的历史数据提供读取兜底。
*/
CREATE OR ALTER FUNCTION [dbo].[Func_GetProcessLineAndProgressByID]
(
    @WorkOrderCode varchar(100),
    @ProcessLine_Id int
)
RETURNS TABLE
AS
RETURN
(
    SELECT A.*, B.ProcessName,
        CASE WHEN ISNULL(wo.PlanQty, 0) <= 0 THEN '0%'
             ELSE CONVERT(varchar(100), CONVERT(decimal(18,2),
                    (CONVERT(decimal(18,2), ISNULL(rwo.ReportQty, 0)) /
                     CONVERT(decimal(18,2), wo.PlanQty)) * 100)) + '%'
        END AS PercentNum
    FROM (
        SELECT Sequence, Process_Id
        FROM Base_ProcessLineList
        WHERE ProcessLine_Id = @ProcessLine_Id AND processLineType = 'process'
        UNION ALL
        SELECT p.Sequence, b.Process_Id
        FROM [dbo].[Base_ProcessLineList] p
        LEFT JOIN Base_ProcessLine a ON p.ProcessLineDown_Id = a.ProcessLine_Id
        LEFT JOIN [Base_ProcessLineList] b ON a.ProcessLine_Id = b.ProcessLine_Id
        WHERE p.ProcessLineType = 'processLine'
          AND b.ProcessLineType = 'process'
          AND p.ProcessLine_id = @ProcessLine_Id
    ) A
    LEFT JOIN Base_Process B ON A.Process_Id = B.Process_Id
    LEFT JOIN (
        SELECT Process_Id, WorkOrder_Id, SUM(ReportQty) ReportQty
        FROM Production_ReportWorkOrder
        WHERE WorkOrder_Id IN (
            SELECT WorkOrder_Id FROM Production_WorkOrder WHERE WorkOrderCode = @WorkOrderCode
        )
        GROUP BY Process_Id, WorkOrder_Id
    ) rwo ON rwo.Process_Id = B.Process_Id
    LEFT JOIN Production_WorkOrder wo ON rwo.WorkOrder_Id = wo.WorkOrder_Id OR wo.WorkOrderCode = @WorkOrderCode
);
GO
