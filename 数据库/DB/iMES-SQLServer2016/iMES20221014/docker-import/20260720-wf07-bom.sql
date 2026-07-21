/*
  WF-07 BOM 与报工自动扣料升级脚本。
  已部署数据库执行一次；可重复执行。执行前请备份生产数据库。
*/
USE [iMES]
GO

IF COL_LENGTH('dbo.Base_MaterialDetail', 'Process_Id') IS NULL
BEGIN
    ALTER TABLE dbo.Base_MaterialDetail ADD Process_Id int NULL;
END
GO

ALTER TABLE dbo.Base_MaterialDetail ALTER COLUMN QuantityPer decimal(18,4) NOT NULL;
ALTER TABLE dbo.Base_Product ALTER COLUMN InventoryQty decimal(18,4) NULL;
ALTER TABLE dbo.Ware_WareHouseBillList ALTER COLUMN InStoreQty decimal(18,4) NOT NULL;
ALTER TABLE dbo.Ware_WareHouseBillList ALTER COLUMN InventoryQty decimal(18,4) NULL;
ALTER TABLE dbo.Ware_OutWareHouseBillList ALTER COLUMN OutStoreQty decimal(18,4) NOT NULL;
ALTER TABLE dbo.Ware_OutWareHouseBillList ALTER COLUMN InventoryQty decimal(18,4) NULL;
GO

CREATE OR ALTER VIEW dbo.View_Base_MaterialDetail
AS
SELECT
    a.*,
    b.ProductCode AS PProductCode,
    b.ProductName AS PProductName,
    b.ProductStandard AS PProductStandard,
    b.Unit_Id AS PUnit_Id,
    c.ProductCode AS CProductCode,
    c.ProductName AS CProductName,
    c.ProductStandard AS CProductStandard,
    c.Unit_Id AS CUnit_Id
FROM dbo.Base_MaterialDetail AS a
LEFT JOIN dbo.Base_Product AS b ON a.ParentProduct_Id = b.Product_Id
LEFT JOIN dbo.Base_Product AS c ON a.ChildProduct_Id = c.Product_Id;
GO
