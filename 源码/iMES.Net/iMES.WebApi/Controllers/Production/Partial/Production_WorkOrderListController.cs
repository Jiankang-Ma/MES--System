/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_WorkOrderList",Enums.ActionPermissionOptions.Search)]
 */
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using iMES.Entity.DomainModels;
using iMES.Production.IServices;
using iMES.Production.IRepositories;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace iMES.Production.Controllers
{
    public partial class Production_WorkOrderListController
    {
        private readonly IProduction_WorkOrderListService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_WorkOrderListRepository _workOrderListRepository;
        private readonly IProduction_WorkOrderRepository _workOrderRepository;


        [ActivatorUtilitiesConstructor]
        public Production_WorkOrderListController(
            IProduction_WorkOrderListService service,
            IHttpContextAccessor httpContextAccessor,
            IProduction_WorkOrderListRepository workOrderListRepository,
            IProduction_WorkOrderRepository workOrderRepository
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _workOrderListRepository = workOrderListRepository;
            _workOrderRepository = workOrderRepository;
        }
        /// <summary>
         /// 获取工单下面的工序列表
         /// </summary>
         /// <param name="code"></param>
         /// <returns></returns>
        [HttpGet, Route("getList")]
        public async Task<IActionResult> GetList(int workOrderId)
        {
            var wo = _workOrderRepository.FindAsIQueryable(x => x.WorkOrder_Id == workOrderId)
                  .OrderByDescending(x => x.CreateDate)
                  .Select(s => new
                  {
                      WorkOrderCode = s.WorkOrderCode,
                      Product_Id = s.Product_Id,
                      PlanQty = s.PlanQty
                  })
                  .FirstOrDefault();

            return Json(await _workOrderListRepository.FindAsIQueryable(x => x.WorkOrder_Id == workOrderId)
                  .Select(s => new
                  {
                      key = s.Process_Id,
                      value = s.ProcessName,
                      productId = wo.Product_Id,
                      workOrderCode = wo.WorkOrderCode,
                      workOrderId = workOrderId,
                      planQty = wo.PlanQty
                  }).ToListAsync());
        }
    }
}
