/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Production_SalesOrderListController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Production.IServices;
namespace iMES.Production.Controllers
{
    [Route("api/Production_SalesOrderList")]
    [PermissionTable(Name = "Production_SalesOrderList")]
    public partial class Production_SalesOrderListController : ApiBaseController<IProduction_SalesOrderListService>
    {
        public Production_SalesOrderListController(IProduction_SalesOrderListService service)
        : base(service)
        {
        }
    }
}

