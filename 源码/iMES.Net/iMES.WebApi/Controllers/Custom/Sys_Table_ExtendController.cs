/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Sys_Table_ExtendController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Custom.IServices;
namespace iMES.Custom.Controllers
{
    [Route("api/Sys_Table_Extend")]
    [PermissionTable(Name = "Sys_Table_Extend")]
    public partial class Sys_Table_ExtendController : ApiBaseController<ISys_Table_ExtendService>
    {
        public Sys_Table_ExtendController(ISys_Table_ExtendService service)
        : base(service)
        {
        }
    }
}

