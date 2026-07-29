/*
 * Func_GetProcessLineAndProgressByID 除零回归验证（WH-BUG-20）
 *
 * 测试目的：
 *   当工单计划数（PlanQty）为 0 时，验证函数不抛出除零错误，
 *   且 PercentNum 字段返回 '0%' 而非崩溃。
 *
 * 测试方法：
 *   1. 创建一个临时工单（PlanQty = 0）
 *   2. 调用 Func_GetProcessLineAndProgressByID
 *   3. 验证 PercentNum = '0%'
 *   4. 清理临时数据
 *
 * 前置条件：
 *   - SQL Server 实例运行中
 *   - iMES 数据库已初始化
 *   - 存在至少一条 Base_ProcessLineList 记录（ProcessLineType = 'process'）
 *
 * 执行方式：
 *   /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P '<password>' -C -d iMES -i 本文件
 */

-- ============================================
-- 步骤 1：获取一个有效的 ProcessLine_Id
-- ============================================
DECLARE @ProcessLine_Id INT
SELECT TOP 1 @ProcessLine_Id = ProcessLine_Id 
FROM Base_ProcessLineList 
WHERE ProcessLineType = 'process'

IF @ProcessLine_Id IS NULL
BEGIN
    PRINT '❌ 无 ProcessLine 数据，无法测试'
    RETURN
END

PRINT '✅ 使用 ProcessLine_Id = ' + CAST(@ProcessLine_Id AS VARCHAR)

-- ============================================
-- 步骤 2：插入临时工单（PlanQty = 0）
-- ============================================
DECLARE @WorkOrderCode VARCHAR(100) = 'TEST_WHBUG20_' + CONVERT(VARCHAR, GETDATE(), 112)
DECLARE @WorkOrder_Id INT

-- 检查是否已存在
IF NOT EXISTS (SELECT 1 FROM Production_WorkOrder WHERE WorkOrderCode = @WorkOrderCode)
BEGIN
    INSERT INTO Production_WorkOrder (WorkOrderCode, PlanQty, CreateDate)
    VALUES (@WorkOrderCode, 0, GETDATE())
    SET @WorkOrder_Id = SCOPE_IDENTITY()
    PRINT '✅ 已创建测试工单: ' + @WorkOrderCode + ' (PlanQty = 0)'
END
ELSE
BEGIN
    SELECT @WorkOrder_Id = WorkOrder_Id FROM Production_WorkOrder WHERE WorkOrderCode = @WorkOrderCode
    PRINT '✅ 测试工单已存在: ' + @WorkOrderCode
END

-- ============================================
-- 步骤 3：调用函数并验证返回结果
-- ============================================
DECLARE @PercentNum VARCHAR(100)

SELECT @PercentNum = PercentNum
FROM dbo.Func_GetProcessLineAndProgressByID(@WorkOrderCode, @ProcessLine_Id)

PRINT '✅ 函数调用成功，PercentNum = ' + ISNULL(@PercentNum, 'NULL')

IF @PercentNum = '0%'
    PRINT '✅ PASS: PlanQty=0 时正确返回 0%'
ELSE
    PRINT '❌ FAIL: 期望 0%，实际得到 ' + ISNULL(@PercentNum, 'NULL')

-- ============================================
-- 步骤 4：也测试 PlanQty 非零的情况
-- ============================================
UPDATE Production_WorkOrder SET PlanQty = 100 WHERE WorkOrderCode = @WorkOrderCode

SELECT @PercentNum = PercentNum
FROM dbo.Func_GetProcessLineAndProgressByID(@WorkOrderCode, @ProcessLine_Id)

PRINT '✅ PlanQty=100 时 PercentNum = ' + ISNULL(@PercentNum, 'NULL')

-- ============================================
-- 步骤 5：清理临时数据
-- ============================================
-- 取消注释以清理：
-- DELETE FROM Production_WorkOrder WHERE WorkOrderCode = @WorkOrderCode
-- PRINT '✅ 临时工单已清理'

PRINT '=== 测试完成 ==='
