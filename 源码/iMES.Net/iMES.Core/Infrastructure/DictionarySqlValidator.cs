using iMES.Core.DBManager;
using iMES.Core.Enums;
using Microsoft.SqlServer.TransactSql.ScriptDom;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;

namespace iMES.Core.Infrastructure
{
    public static class DictionarySqlValidator
    {
        public static bool TryValidateReadOnlySelect(string sql, out string error)
        {
            error = null;

            if (string.IsNullOrWhiteSpace(sql))
            {
                return true;
            }

            var parser = new TSql150Parser(false);

            IList<ParseError> parseErrors;
            TSqlFragment fragment;

            using (var reader = new StringReader(sql))
            {
                fragment = parser.Parse(reader, out parseErrors);
            }

            if (parseErrors != null && parseErrors.Count > 0)
            {
                error = "字典SQL语法无效。";
                return false;
            }

            var script = fragment as TSqlScript;

            if (script == null ||
                script.Batches.Count != 1 ||
                script.Batches[0].Statements.Count != 1)
            {
                error = "字典SQL只允许一条查询语句。";
                return false;
            }

            var selectStatement =
                script.Batches[0].Statements[0] as SelectStatement;

            if (selectStatement == null)
            {
                error = "字典SQL只允许SELECT查询。";
                return false;
            }

            if (selectStatement.Into != null)
            {
                error = "字典SQL禁止使用SELECT INTO。";
                return false;
            }

            return true;
        }

        public static string EnsureReadOnlySelect(string sql)
        {
            string error;

            if (!TryValidateReadOnlySelect(sql, out error))
            {
                throw new InvalidOperationException(error);
            }

            return sql;
        }

        public static string EnsureReadOnlySelectForCurrentDatabase(string sql)
        {
            using (var connection =
                DBServerProvider.GetDbConnection(null, DbCurrentType.Default))
            {
                if (connection is SqlConnection)
                {
                    return EnsureReadOnlySelect(sql);
                }
            }

            return sql;
        }
    }
}