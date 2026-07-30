-- 修复 Func_GetProcessLineAndProgressByID 除零错误（来自楼博涵）
USE iMES;
GO

ALTER FUNCTION [dbo].[Func_GetProcessLineAndProgressByID]
(
@WorkOrderCode varchar(100),
@ProcessLine_Id int
)
RETURNS TABLE
AS
RETURN
(
SELECT A.*,B.ProcessName, 
    CASE WHEN wo.PlanQty = 0 THEN '0%' 
    ELSE CONVERT(varchar(100),convert(decimal(18,2),(convert(decimal(18,2),ISNULL(rwo.ReportQty,0))/convert(decimal(18,2),wo.PlanQty))*100)) + '%' 
    END PercentNum
FROM (
	SELECT Sequence,Process_Id from Base_ProcessLineList where ProcessLine_Id = @ProcessLine_Id and processLineType = 'process'
	UNION ALL
	SELECT p.Sequence,b.Process_Id FROM  [dbo].[Base_ProcessLineList] p
		LEFT JOIN Base_ProcessLine a on p.ProcessLineDown_Id = a.ProcessLine_Id
		LEFT JOIN [Base_ProcessLineList] B ON A.ProcessLine_Id = B.ProcessLine_Id
	WHERE p.ProcessLineType = 'processLine' and b.ProcessLineType ='process' and p.ProcessLine_id = @ProcessLine_Id
) A
LEFT JOIN Base_Process B ON A.Process_Id = B.Process_Id
LEFT JOIN ( SELECT Process_Id,WorkOrder_Id,SUM(ReportQty) ReportQty FROM Production_ReportWorkOrder WHERE WorkOrder_Id in (
	select WorkOrder_Id from  Production_WorkOrder where WorkOrderCode = @WorkOrderCode) GROUP BY Process_Id,WorkOrder_Id ) rwo on rwo.Process_Id = B.Process_Id
LEFT JOIN Production_WorkOrder wo on rwo.WorkOrder_Id = wo.WorkOrder_Id or wo.WorkOrderCode = @WorkOrderCode
)
GO