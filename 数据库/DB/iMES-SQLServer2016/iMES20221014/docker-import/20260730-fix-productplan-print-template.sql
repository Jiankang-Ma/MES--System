/*
  为生产计划创建打印模板（复用销售订单模板布局）。
  适用范围：已存在 iMES 数据库；可重复执行。

  根因：Base_PrintCatalog 中有 Production_ProductPlan 分类，
  但 Base_PrintTemplate 中没有任何生产计划的打印模板。
*/
USE iMES;
GO
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @SalesCatalogId uniqueidentifier;
DECLARE @PlanCatalogId uniqueidentifier;
DECLARE @SalesTemplateContent varchar(max);

SELECT @SalesCatalogId = CatalogId
FROM dbo.Base_PrintCatalog
WHERE CatalogCode = N'Production_SalesOrder';

SELECT @PlanCatalogId = CatalogId
FROM dbo.Base_PrintCatalog
WHERE CatalogCode = N'Production_ProductPlan';

IF @SalesCatalogId IS NULL
    THROW 50001, N'缺少销售订单的打印分类，无法复制模板。', 1;

IF @PlanCatalogId IS NULL
    THROW 50002, N'缺少生产计划的打印分类，无法初始化模板。', 1;

/* 获取销售订单的模板内容作为模板源 */
SELECT TOP (1) @SalesTemplateContent = TemplateContent
FROM dbo.Base_PrintTemplate
WHERE CatalogId = @SalesCatalogId
  AND TemplateName = N'销售订单打印'
  AND TemplateContent IS NOT NULL
ORDER BY CreateDate DESC;

IF @SalesTemplateContent IS NULL
    THROW 50003, N'销售订单打印模板内容为空，无法生成生产计划模板。', 1;

/* 生产计划没有明细表，不需要表格；改用销售订单模板但去除明细表格部分。
   仅保留单据头字段：单据编号、创建日期，并将标题替换为"生产计划"。*/
IF NOT EXISTS (
    SELECT 1 FROM dbo.Base_PrintTemplate
    WHERE CatalogId = @PlanCatalogId AND TemplateName = N'生产计划打印'
)
BEGIN
    INSERT dbo.Base_PrintTemplate
        (PrintTemplateId, CatalogId, TemplateName, isDefault, StatusFlag, TemplateContent,
         Remark, CreateID, Creator, CreateDate)
    VALUES
        (NEWID(), @PlanCatalogId, N'生产计划打印', 1, 1,
         REPLACE(REPLACE(@SalesTemplateContent, 'SalesOrderCode', 'ProductPlanCode'),
                 N'销售订单', N'生产计划'),
         N'系统内置模板（由生产计划打印修复脚本初始化）', 1, N'超级管理员', GETDATE());
END;

/* 确保已有同名模板为启用默认状态 */
UPDATE dbo.Base_PrintTemplate
SET StatusFlag = 1,
    isDefault = 1,
    ModifyDate = GETDATE(),
    Modifier = N'系统修复'
WHERE CatalogId = @PlanCatalogId
  AND TemplateName = N'生产计划打印'
  AND TemplateContent IS NOT NULL;

COMMIT TRANSACTION;