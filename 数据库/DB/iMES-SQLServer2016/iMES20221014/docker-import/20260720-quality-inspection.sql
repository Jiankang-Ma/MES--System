SET XACT_ABORT ON;
BEGIN TRANSACTION;

CREATE TABLE dbo.Quality_InspectionItem (
  InspectionItem_Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  InspectionItemCode nvarchar(100) NOT NULL,
  InspectionItemName nvarchar(200) NOT NULL,
  DataType nvarchar(50) NULL,
  DefaultStandard nvarchar(500) NULL,
  DefaultLowerLimit decimal(18,4) NULL,
  DefaultUpperLimit decimal(18,4) NULL,
  Unit nvarchar(50) NULL,
  CreateDate datetime NULL,
  CreateID int NULL,
  Creator nvarchar(200) NULL,
  CONSTRAINT UQ_Quality_InspectionItem_Code UNIQUE (InspectionItemCode),
  CONSTRAINT UQ_Quality_InspectionItem_Name UNIQUE (InspectionItemName)
);

CREATE TABLE dbo.Quality_InspectionTemplate (
  InspectionTemplate_Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  InspectionTemplateCode nvarchar(100) NOT NULL,
  InspectionTemplateName nvarchar(200) NOT NULL,
  Product_Id int NOT NULL,
  InspectionType nvarchar(30) NOT NULL,
  CreateDate datetime NULL,
  CreateID int NULL,
  Creator nvarchar(200) NULL,
  CONSTRAINT UQ_Quality_InspectionTemplate_Code UNIQUE (InspectionTemplateCode),
  CONSTRAINT UQ_Quality_InspectionTemplate_Product_Type UNIQUE (Product_Id, InspectionType)
);

CREATE TABLE dbo.Quality_InspectionTemplateItem (
  InspectionTemplateItem_Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  InspectionTemplate_Id int NOT NULL,
  InspectionItem_Id int NOT NULL,
  InspectionItemName nvarchar(200) NOT NULL,
  StandardValue nvarchar(500) NULL,
  LowerLimit decimal(18,4) NULL,
  UpperLimit decimal(18,4) NULL,
  Sequence int NOT NULL,
  CONSTRAINT FK_Quality_TemplateItem_Template FOREIGN KEY (InspectionTemplate_Id) REFERENCES dbo.Quality_InspectionTemplate(InspectionTemplate_Id),
  CONSTRAINT FK_Quality_TemplateItem_Item FOREIGN KEY (InspectionItem_Id) REFERENCES dbo.Quality_InspectionItem(InspectionItem_Id)
);

CREATE TABLE dbo.Quality_InspectionOrder (
  InspectionOrder_Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  InspectionOrderCode nvarchar(100) NOT NULL,
  InspectionType nvarchar(30) NOT NULL,
  Product_Id int NOT NULL,
  SourceNo nvarchar(200) NOT NULL,
  WorkOrder_Id int NULL,
  Process_Id int NULL,
  SourceDate datetime NOT NULL,
  InspectionDate datetime NOT NULL,
  InspectionQty decimal(18,4) NOT NULL,
  QualifiedQty decimal(18,4) NULL,
  UnqualifiedQty decimal(18,4) NULL,
  FinalResult nvarchar(30) NULL,
  InspectionTemplate_Id int NOT NULL,
  CreateDate datetime NULL,
  CreateID int NULL,
  Creator nvarchar(200) NULL,
  CONSTRAINT UQ_Quality_InspectionOrder_Code UNIQUE (InspectionOrderCode),
  CONSTRAINT UQ_Quality_InspectionOrder_Source UNIQUE (InspectionType, Product_Id, SourceNo),
  CONSTRAINT FK_Quality_Order_Template FOREIGN KEY (InspectionTemplate_Id) REFERENCES dbo.Quality_InspectionTemplate(InspectionTemplate_Id)
);

CREATE TABLE dbo.Quality_InspectionOrderItem (
  InspectionOrderItem_Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  InspectionOrder_Id int NOT NULL,
  InspectionItem_Id int NOT NULL,
  InspectionItemName nvarchar(200) NOT NULL,
  StandardValue nvarchar(500) NULL,
  LowerLimit decimal(18,4) NULL,
  UpperLimit decimal(18,4) NULL,
  ActualValue decimal(18,4) NULL,
  Result nvarchar(30) NULL,
  CONSTRAINT FK_Quality_OrderItem_Order FOREIGN KEY (InspectionOrder_Id) REFERENCES dbo.Quality_InspectionOrder(InspectionOrder_Id),
  CONSTRAINT FK_Quality_OrderItem_Item FOREIGN KEY (InspectionItem_Id) REFERENCES dbo.Quality_InspectionItem(InspectionItem_Id)
);

COMMIT TRANSACTION;
