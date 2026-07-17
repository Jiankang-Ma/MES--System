/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Base_Process_ExtendData",Enums.ActionPermissionOptions.Search)]
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
    public partial class Base_Process_ExtendDataController
    {
        private readonly IBase_Process_ExtendDataService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;

        [ActivatorUtilitiesConstructor]
        public Base_Process_ExtendDataController(
            IBase_Process_ExtendDataService service,
            IHttpContextAccessor httpContextAccessor
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet, HttpPost, Route("getExtendDataByProcessID")]
        [ApiActionPermission("Base_Process_ExtendData", ActionPermissionOptions.Search)]
        public IActionResult GetExtendDataByProductID(int processId)
        {
            return JsonNormal(_service.GetExtendDataByProcessID(processId));
        }
    }
}
