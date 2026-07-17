/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Production_ProductPlanListController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Production.IServices;
namespace iMES.Production.Controllers
{
    [Route("api/Production_ProductPlanList")]
    [PermissionTable(Name = "Production_ProductPlanList")]
    public partial class Production_ProductPlanListController : ApiBaseController<IProduction_ProductPlanListService>
    {
        public Production_ProductPlanListController(IProduction_ProductPlanListService service)
        : base(service)
        {
        }
    }
}

