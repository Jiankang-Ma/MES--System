/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Sys_User_ExtendData",Enums.ActionPermissionOptions.Search)]
 */
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using iMES.Entity.DomainModels;
using iMES.Custom.IServices;
using iMES.Core.Filters;
using iMES.Core.Enums;

namespace iMES.Custom.Controllers
{
    public partial class Sys_User_ExtendDataController
    {
        private readonly ISys_User_ExtendDataService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;

        [ActivatorUtilitiesConstructor]
        public Sys_User_ExtendDataController(
            ISys_User_ExtendDataService service,
            IHttpContextAccessor httpContextAccessor
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet, HttpPost, Route("getExtendDataByUserID")]
        [ApiActionPermission("Sys_User_ExtendData", ActionPermissionOptions.Search)]
        public IActionResult GetExtendDataByUserID(int userId)
        {
            return JsonNormal( _service.GetExtendDataByUserID(userId));
        }
    }
}
