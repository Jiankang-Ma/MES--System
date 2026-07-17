/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Production_SalesOrderController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Production.IServices;
namespace iMES.Production.Controllers
{
    [Route("api/Production_SalesOrder")]
    [PermissionTable(Name = "Production_SalesOrder")]
    public partial class Production_SalesOrderController : ApiBaseController<IProduction_SalesOrderService>
    {
        public Production_SalesOrderController(IProduction_SalesOrderService service)
        : base(service)
        {
        }
    }
}

