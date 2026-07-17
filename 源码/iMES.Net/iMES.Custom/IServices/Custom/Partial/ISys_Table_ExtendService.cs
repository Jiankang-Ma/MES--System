/*
*所有关于Sys_Table_Extend类的业务代码接口应在此处编写
*/
using iMES.Core.BaseProvider;
using iMES.Entity.DomainModels;
using iMES.Core.Utilities;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace iMES.Custom.IServices
{
    public partial interface ISys_Table_ExtendService
    {
        Task<object> GetTableExtendFieldList(string tableName);
    }
 }
