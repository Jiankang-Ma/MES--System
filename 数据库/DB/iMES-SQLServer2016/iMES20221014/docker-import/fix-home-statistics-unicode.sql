USE [iMES]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW [dbo].[HomeView_StatisticsNumber]
AS
/* System home page summary counts. N prefixes preserve Chinese text on Linux SQL Server. */
SELECT CASE FromType
    WHEN 'SalesOrder' THEN N'销售订单'
    WHEN 'ProductPlan' THEN N'生产计划'
    WHEN 'AssembleWorkOrder' THEN N'装配工单'
END AS ItemName,
CASE FromType
    WHEN 'SalesOrder' THEN 'rgb(25, 190, 107)'
    WHEN 'ProductPlan' THEN 'rgb(45, 183, 245)'
    WHEN 'AssembleWorkOrder' THEN '#f2b458'
END AS Background,
FromType AS ItemCode,
CAST(SUM([PlanQty]) AS VARCHAR(100)) AS Qty
FROM [Production_WorkOrder] AS wo
WHERE FromType IS NOT NULL
GROUP BY FromType

UNION ALL

SELECT N'不良品总数', 'rgb(237, 64, 20)', 'DefectItem', CAST(SUM(rwol.Qty) AS VARCHAR(100))
FROM Production_ReportWorkOrderList AS rwol
LEFT JOIN Base_DefectItem AS di ON di.DefectItem_Id = rwol.DefectItem

UNION ALL

SELECT N'良品率', 'rgb(84, 110, 122)', 'YieldRate',
       CAST(CAST(CAST(ISNULL(SUM(GoodQty), 0) AS DECIMAL(20, 2)) /
                 CAST(ISNULL(SUM(ReportQty), 0) AS DECIMAL(20, 2)) * 100 AS DECIMAL(20, 0)) AS VARCHAR(100)) + '%'
FROM [Production_ReportWorkOrder]

UNION ALL

SELECT N'销售订单占比', 'rgb(45, 183, 245)', 'SalesRate',
       CAST(CAST(CAST(ISNULL(COUNT(WO2.WorkOrder_Id), 0) AS DECIMAL(20, 2)) /
                 CAST(ISNULL(COUNT(WO.WorkOrder_Id), 0) AS DECIMAL(20, 2)) * 100 AS DECIMAL(20, 0)) AS VARCHAR(100)) + '%'
FROM [iMES].[dbo].[Production_WorkOrder] AS WO
LEFT JOIN Production_WorkOrder AS WO2
    ON WO.WorkOrder_Id = WO2.WorkOrder_Id
   AND WO2.FromType = 'SalesOrder'
GO

ALTER PROCEDURE [dbo].[SerializeJSON]
    @ParameterSQL AS NVARCHAR(MAX)
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX)
    DECLARE @XMLString NVARCHAR(MAX)
    DECLARE @XML XML
    DECLARE @Paramlist NVARCHAR(1000)
    DECLARE @JSON NVARCHAR(MAX)
    DECLARE @Row NVARCHAR(MAX)
    DECLARE @RowStart INT
    DECLARE @RowEnd INT
    DECLARE @FieldStart INT
    DECLARE @FieldEnd INT
    DECLARE @KEY NVARCHAR(MAX)
    DECLARE @Value NVARCHAR(MAX)
    DECLARE @StartRoot NVARCHAR(100) = N'<row>'
    DECLARE @EndRoot NVARCHAR(100) = N'</row>'
    DECLARE @StartField NVARCHAR(100) = N'<'
    DECLARE @EndField NVARCHAR(100) = N'>'

    SET @Paramlist = N'@XML XML OUTPUT'
    SET @SQL = N'WITH PrepareTable (XMLString) AS (' + @ParameterSQL +
               N' FOR XML RAW, TYPE, ELEMENTS) SELECT @XML = [XMLString] FROM [PrepareTable]'
    EXEC sp_executesql @SQL, @Paramlist, @XML = @XML OUTPUT
    SET @XMLString = CAST(@XML AS NVARCHAR(MAX))
    SET @RowStart = CHARINDEX(@StartRoot, @XMLString, 0)
    SET @JSON = N''

    WHILE @RowStart > 0
    BEGIN
        SET @RowStart = @RowStart + LEN(@StartRoot)
        SET @RowEnd = CHARINDEX(@EndRoot, @XMLString, @RowStart)
        SET @Row = SUBSTRING(@XMLString, @RowStart, @RowEnd - @RowStart)
        SET @JSON = @JSON + N'{'
        SET @FieldStart = CHARINDEX(@StartField, @Row, 0)

        WHILE @FieldStart > 0
        BEGIN
            SET @FieldStart = @FieldStart + LEN(@StartField)
            SET @FieldEnd = CHARINDEX(@EndField, @Row, @FieldStart)
            SET @KEY = SUBSTRING(@Row, @FieldStart, @FieldEnd - @FieldStart)
            SET @JSON = @JSON + N'"' + @KEY + N'":'
            SET @FieldStart = @FieldEnd + 1
            SET @FieldEnd = CHARINDEX(N'</', @Row, @FieldStart)
            SET @Value = SUBSTRING(@Row, @FieldStart, @FieldEnd - @FieldStart)
            SET @JSON = @JSON + N'"' + @Value + N'",'
            SET @FieldStart = @FieldStart + LEN(@StartField)
            SET @FieldEnd = CHARINDEX(@EndField, @Row, @FieldStart)
            SET @FieldStart = CHARINDEX(@StartField, @Row, @FieldEnd)
        END

        IF LEN(@JSON) > 0 SET @JSON = SUBSTRING(@JSON, 0, LEN(@JSON))
        SET @JSON = @JSON + N'},'
        SET @RowStart = CHARINDEX(@StartRoot, @XMLString, @RowEnd)
    END

    IF LEN(@JSON) > 0 SET @JSON = SUBSTRING(@JSON, 0, LEN(@JSON))
    SET @JSON = N'[' + @JSON + N']'
    SELECT @JSON
END
GO
