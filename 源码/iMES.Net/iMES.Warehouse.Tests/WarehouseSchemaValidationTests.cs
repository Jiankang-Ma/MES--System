using System;
using System.IO;
using System.Linq;
using System.Reflection;
using iMES.Entity.DomainModels;
using Xunit;

namespace iMES.Warehouse.Tests
{
    /// <summary>
    /// 仓储领域 Schema 一致性验证。
    /// 检查 C# 实体模型属性类型与 SQL 建表脚本定义类型是否匹配。
    /// 说明：此类测试不连接数据库，通过反射读取实体、通过正则解析 SQL 脚本。
    /// </summary>
    public class WarehouseSchemaValidationTests
    {
        private const string SqlFileRelativePath =
            "../../../数据库/DB/iMES-SQLServer2016/iMES20221014/docker-import/iMES20221014.docker.sql";

        [Fact]
        public void Ware_WareHouseBillList_InStoreQty_EntityPropertyIsDecimal()
        {
            var prop = typeof(Ware_WareHouseBillList).GetProperty("InStoreQty");
            Assert.NotNull(prop);
            Assert.Equal(typeof(decimal), prop.PropertyType);
        }

        [Fact]
        public void Ware_OutWareHouseBillList_OutStoreQty_EntityPropertyIsDecimal()
        {
            var prop = typeof(Ware_OutWareHouseBillList).GetProperty("OutStoreQty");
            Assert.NotNull(prop);
            Assert.Equal(typeof(decimal), prop.PropertyType);
        }

        /// <summary>
        /// SQL 建表脚本中 InStoreQty / OutStoreQty 的字段类型应与 C# 实体匹配。
        /// 若数据库字段为 int 而实体为 decimal，EF Core 查询时抛出
        /// "Unable to cast object of type 'System.Int32' to type 'System.Decimal'"。
        /// 此测试尝试读取 SQL 文件进行静态验证；若文件不可用（如 Docker 构建环境），
        /// 则跳过运行时检查，仅保留实体属性类型验证。
        /// </summary>
        [Fact]
        public void SqlSchema_WareHouseBillList_QtyColumns_ShouldBeDecimal()
        {
            string sqlContent = ReadSqlFile();
            if (sqlContent == null)
            {
                // Docker 构建环境中 SQL 文件不在构建上下文中，跳过
                // 实体属性类型验证由单独的 Fact 覆盖
                return;
            }

            // 定位 Ware_WareHouseBillList 建表语句块中的 InStoreQty 定义
            string inboundBlock = ExtractCreateTableBlock(sqlContent, "Ware_WareHouseBillList");
            Assert.Contains("[InStoreQty]", inboundBlock);

            // 检查 InStoreQty 是否为 decimal 类型（int 会导致 ORM 转换失败）
            bool inboundIsDecimal = inboundBlock
                .Split('\n')
                .Any(line => line.Contains("[InStoreQty]") &&
                             line.Contains("decimal", StringComparison.OrdinalIgnoreCase));

            Assert.True(inboundIsDecimal,
                "Ware_WareHouseBillList.InStoreQty 在 SQL 中不是 decimal 类型。" +
                "当前定义为 int，但 C# 实体 Ware_WareHouseBillList.InStoreQty 为 decimal，EF Core 无法自动转换。");

            // 定位 Ware_OutWareHouseBillList 建表语句块中的 OutStoreQty 定义
            string outboundBlock = ExtractCreateTableBlock(sqlContent, "Ware_OutWareHouseBillList");
            Assert.Contains("[OutStoreQty]", outboundBlock);

            bool outboundIsDecimal = outboundBlock
                .Split('\n')
                .Any(line => line.Contains("[OutStoreQty]") &&
                             line.Contains("decimal", StringComparison.OrdinalIgnoreCase));

            Assert.True(outboundIsDecimal,
                "Ware_OutWareHouseBillList.OutStoreQty 在 SQL 中不是 decimal 类型。" +
                "当前定义为 int，但 C# 实体 Ware_OutWareHouseBillList.OutStoreQty 为 decimal，EF Core 无法自动转换。");
        }

        [Fact]
        public void SqlSchema_View_StockBalance_SelectQtyShouldBeAggregated()
        {
            // 检查库存余额视图使用了聚合函数，而非直接引用 int 字段导致精度丢失
            string sqlContent = ReadSqlFile();
            if (sqlContent == null)
            {
                // Docker 构建环境中跳过
                return;
            }

            // 尝试找 View_StockBalance 或 Ware_StockBalance 的创建语句
            string viewSql = ExtractViewSql(sqlContent, "View_StockBalance");

            Assert.NotNull(viewSql);
            Assert.Contains("SUM(", viewSql);
        }

        // ===== 辅助方法 =====

        private static string ReadSqlFile()
        {
            // 从测试输出目录向上查找 SQL 文件
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string fullPath = Path.GetFullPath(Path.Combine(baseDir, SqlFileRelativePath));

            if (File.Exists(fullPath))
                return File.ReadAllText(fullPath);

            // Docker 容器内回退路径：/src/数据库/...
            string dockerPath = SqlFileRelativePath.Replace("../../../", "/src/");
            if (File.Exists(dockerPath))
                return File.ReadAllText(dockerPath);

            return null;
        }

        private static string ExtractCreateTableBlock(string sql, string tableName)
        {
            int idx = sql.IndexOf($"CREATE TABLE [dbo].[{tableName}]",
                StringComparison.OrdinalIgnoreCase);
            if (idx < 0) return string.Empty;

            // 查找对应的结束括号（简单计数）
            int start = sql.IndexOf('(', idx);
            if (start < 0) return string.Empty;

            int depth = 0;
            int end = -1;
            for (int i = start; i < sql.Length; i++)
            {
                if (sql[i] == '(') depth++;
                else if (sql[i] == ')')
                {
                    depth--;
                    if (depth == 0) { end = i; break; }
                }
            }
            if (end < 0) return string.Empty;

            return sql.Substring(start, end - start + 1);
        }

        private static string ExtractViewSql(string sql, string viewName)
        {
            // 多种可能的视图创建语法
            string[] patterns = {
                $"CREATE VIEW [dbo].[{viewName}]",
                $"CREATE VIEW [{viewName}]",
                $"CREATE VIEW dbo.{viewName}",
            };

            foreach (var pattern in patterns)
            {
                int idx = sql.IndexOf(pattern, StringComparison.OrdinalIgnoreCase);
                if (idx >= 0)
                {
                    // 找到下一个 GO 或文件末尾
                    int goIdx = sql.IndexOf("\nGO", idx, StringComparison.OrdinalIgnoreCase);
                    if (goIdx < 0) goIdx = sql.Length;
                    return sql.Substring(idx, goIdx - idx);
                }
            }
            return null;
        }
    }
}
