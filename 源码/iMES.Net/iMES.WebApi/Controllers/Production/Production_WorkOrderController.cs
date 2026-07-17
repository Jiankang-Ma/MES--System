/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Production_WorkOrderController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Production.IServices;
namespace iMES.Production.Controllers
{
    [Route("api/Production_WorkOrder")]
    [PermissionTable(Name = "Production_WorkOrder")]
    public partial class Production_WorkOrderController : ApiBaseController<IProduction_WorkOrderService>
    {
        public Production_WorkOrderController(IProduction_WorkOrderService service)
        : base(service)
        {
        }
    }
}

