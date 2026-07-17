/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Sys_User_ExtendDataController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Custom.IServices;
namespace iMES.Custom.Controllers
{
    [Route("api/Sys_User_ExtendData")]
    [PermissionTable(Name = "Sys_User_ExtendData")]
    public partial class Sys_User_ExtendDataController : ApiBaseController<ISys_User_ExtendDataService>
    {
        public Sys_User_ExtendDataController(ISys_User_ExtendDataService service)
        : base(service)
        {
        }
    }
}

