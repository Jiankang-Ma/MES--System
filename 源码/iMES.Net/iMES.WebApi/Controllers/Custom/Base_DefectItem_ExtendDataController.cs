/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Base_DefectItem_ExtendDataController编写
 */
using Microsoft.AspNetCore.Mvc;
using iMES.Core.Controllers.Basic;
using iMES.Entity.AttributeManager;
using iMES.Custom.IServices;
namespace iMES.Custom.Controllers
{
    [Route("api/Base_DefectItem_ExtendData")]
    [PermissionTable(Name = "Base_DefectItem_ExtendData")]
    public partial class Base_DefectItem_ExtendDataController : ApiBaseController<IBase_DefectItem_ExtendDataService>
    {
        public Base_DefectItem_ExtendDataController(IBase_DefectItem_ExtendDataService service)
        : base(service)
        {
        }
    }
}

