/*
  修复生产单据打印模板初始化缺失。
  适用范围：已存在 iMES 数据库；可重复执行。

  根因：Print-Designer 按 CatalogCode 查 StatusFlag=1 的模板内容。
  原始初始化数据中，销售订单的内置模板被设为 StatusFlag=0，
  装配工单只有打印分类、没有模板；因此前端虽已传递 id，仍取不到模板内容。
*/
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @SalesCatalogId uniqueidentifier;
DECLARE @AssemblyCatalogId uniqueidentifier;
DECLARE @SalesTemplateContent varchar(max);

SELECT @SalesCatalogId = CatalogId
FROM dbo.Base_PrintCatalog
WHERE CatalogCode = N'Production_SalesOrder';

SELECT @AssemblyCatalogId = CatalogId
FROM dbo.Base_PrintCatalog
WHERE CatalogCode = N'Production_AssembleWorkOrder';

IF @SalesCatalogId IS NULL OR @AssemblyCatalogId IS NULL
    THROW 50001, N'缺少销售订单或装配工单的打印分类，无法初始化模板。', 1;

/* 销售订单已有内置模板，只是被错误地初始化为未启用。 */
UPDATE dbo.Base_PrintTemplate
SET StatusFlag = 1,
    ModifyDate = GETDATE(),
    Modifier = N'系统修复'
WHERE CatalogId = @SalesCatalogId
  AND TemplateName = N'销售订单打印'
  AND TemplateContent IS NOT NULL;

IF @@ROWCOUNT = 0
    THROW 50002, N'未找到销售订单的内置打印模板，无法启用。', 1;

/*
  装配工单的明细字段与销售订单模板相同（ProductCode、ProductName、
  ProductStandard、Qty），因此复用已验证的表格布局，仅替换单据号字段和标题。
*/
SELECT TOP (1) @SalesTemplateContent = TemplateContent
FROM dbo.Base_PrintTemplate
WHERE CatalogId = @SalesCatalogId
  AND TemplateName = N'销售订单打印'
  AND TemplateContent IS NOT NULL
ORDER BY CreateDate DESC;

IF @SalesTemplateContent IS NULL
    THROW 50003, N'销售订单打印模板内容为空，无法生成装配工单模板。', 1;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.Base_PrintTemplate
    WHERE CatalogId = @AssemblyCatalogId
      AND TemplateName = N'装配工单打印'
)
BEGIN
    INSERT dbo.Base_PrintTemplate
        (PrintTemplateId, CatalogId, TemplateName, isDefault, StatusFlag, TemplateContent,
         Remark, CreateID, Creator, CreateDate)
    VALUES
        ('C519A94B-18DB-4D0B-A21A-5C8C3EB087EA', @AssemblyCatalogId, N'装配工单打印', 1, 1,
         REPLACE(REPLACE(@SalesTemplateContent, 'SalesOrderCode', 'AssembleWorkOrderCode'),
                 N'销售订单', N'装配工单'),
         N'系统内置模板（由生产单据打印修复脚本初始化）', 1, N'超级管理员', GETDATE());
END;

/* 已有同名模板时也确保其为可用默认模板。 */
UPDATE dbo.Base_PrintTemplate
SET StatusFlag = 1,
    isDefault = 1,
    ModifyDate = GETDATE(),
    Modifier = N'系统修复'
WHERE CatalogId = @AssemblyCatalogId
  AND TemplateName = N'装配工单打印'
  AND TemplateContent IS NOT NULL;

COMMIT TRANSACTION;
