
/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Sys_Table_Extend",Enums.ActionPermissionOptions.Search)]
 */
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using iMES.Entity.DomainModels;
using iMES.Custom.IServices;

namespace iMES.Custom.Controllers
{
    [Route("api/Base_Process_Extend")]
    public class Base_Process_ExtendController : Sys_Table_ExtendController
    {
        private readonly ISys_Table_ExtendService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;

        [ActivatorUtilitiesConstructor]
        public Base_Process_ExtendController(
            ISys_Table_ExtendService service,
            IHttpContextAccessor httpContextAccessor
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }

        public override ActionResult GetPageData([FromBody] PageDataOptions loadData)
        {
            loadData.Value = 3;
            return base.GetPageData(loadData);
        }
        public override ActionResult Export([FromBody] PageDataOptions loadData)
        {
            loadData.Value = 3;
            return base.Export(loadData);
        }
    }
}
