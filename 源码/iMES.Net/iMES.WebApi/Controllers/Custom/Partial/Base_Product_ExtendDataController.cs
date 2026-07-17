/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Base_Product_ExtendData",Enums.ActionPermissionOptions.Search)]
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
    public partial class Base_Product_ExtendDataController
    {
        private readonly IBase_Product_ExtendDataService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;

        [ActivatorUtilitiesConstructor]
        public Base_Product_ExtendDataController(
            IBase_Product_ExtendDataService service,
            IHttpContextAccessor httpContextAccessor
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet, HttpPost, Route("getExtendDataByProductID")]
        [ApiActionPermission("Base_Product_ExtendData", ActionPermissionOptions.Search)]
        public IActionResult GetExtendDataByProductID(int productId)
        {
            return JsonNormal(_service.GetExtendDataByProductID(productId));
        }
    }
}
