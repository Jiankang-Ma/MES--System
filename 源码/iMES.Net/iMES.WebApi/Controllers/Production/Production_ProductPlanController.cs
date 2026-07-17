/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Production_ProductPlanController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Production.IServices;
namespace iMES.Production.Controllers
{
    [Route("api/Production_ProductPlan")]
    [PermissionTable(Name = "Production_ProductPlan")]
    public partial class Production_ProductPlanController : ApiBaseController<IProduction_ProductPlanService>
    {
        public Production_ProductPlanController(IProduction_ProductPlanService service)
        : base(service)
        {
        }
    }
}

