/*
*所有关于Base_Process_ExtendData类的业务代码接口应在此处编写
*/
using iMES.Core.BaseProvider;
using iMES.Entity.DomainModels;
using iMES.Core.Utilities;
using System.Linq.Expressions;
namespace iMES.Custom.IServices
{
    public partial interface IBase_Process_ExtendDataService
    {
        object GetExtendDataByProcessID(int processId);
    }
 }
