/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Base_MeritPay_ExtendData",Enums.ActionPermissionOptions.Search)]
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
    public partial class Base_MeritPay_ExtendDataController
    {
        private readonly IBase_MeritPay_ExtendDataService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;

        [ActivatorUtilitiesConstructor]
        public Base_MeritPay_ExtendDataController(
            IBase_MeritPay_ExtendDataService service,
            IHttpContextAccessor httpContextAccessor
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet, HttpPost, Route("getExtendDataByMeritPayID")]
        [ApiActionPermission("Base_MeritPay_ExtendData", ActionPermissionOptions.Search)]
        public IActionResult GetExtendDataByMeritPayID(int meritPayId)
        {
            return JsonNormal(_service.GetExtendDataByMeritPayID(meritPayId));
        }
    }
}
