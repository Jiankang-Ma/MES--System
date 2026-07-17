/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_WorkOrder",Enums.ActionPermissionOptions.Search)]
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
using iMES.Core.DBManager;

namespace iMES.Production.Controllers
{
    public partial class Production_WorkOrderController
    {
        private readonly IProduction_WorkOrderService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_WorkOrderRepository _workOrderRepository;

        [ActivatorUtilitiesConstructor]
        public Production_WorkOrderController(
            IProduction_WorkOrderService service,
            IHttpContextAccessor httpContextAccessor,
            IProduction_WorkOrderRepository workOrderRepository
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _workOrderRepository = workOrderRepository;
        }
        /// <summary>
        /// 获取工单下面的产品信息
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet, Route("getList")]
        public async Task<IActionResult> GetList(int workOrderId)
        {
            return Json(await _workOrderRepository.FindAsIQueryable(x => x.WorkOrder_Id == workOrderId)
                  .Select(s => new
                  {
                      Product_Id = s.Product_Id,
                      ProductCode = s.ProductCode,
                      ProductName = s.ProductName,
                      ProductStandard = s.ProductStandard
                  }).ToListAsync());
        }
        /// <summary>
        /// 工单状态变更
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet, Route("changeUpdate")]
        public string ChangeUpdate(int workOrderId,string status)
        {
            Production_WorkOrder workOrder = new Production_WorkOrder()
            {
                WorkOrder_Id = workOrderId,
                Status = status,
                ActualStartDate = DateTime.Now,
                ActualEndDate = DateTime.Now
            };
            if (status == "2")
            {
                _workOrderRepository.Update(workOrder, x => new { x.Status,x.ActualStartDate }, true);
            }
            else if (status == "3")
            {
                string sql = "select * from View_OutputStatistics where WorkOrder_Id=@workOrderId ";
                //与原生dapper使用方式基本一致，更多使用方法参照dapper文档
                List<Report_OutputReturnData> list = DBServerProvider.SqlDapper.QueryList<Report_OutputReturnData>(sql, new { workOrderId });
                if (list.Count > 0)
                {
                    workOrder.GoodQty = list[0].GoodQty;
                    workOrder.NoGoodQty = list[0].NoGoodQty;
                    workOrder.RealQty = list[0].GoodQty + list[0].NoGoodQty;
                }
                _workOrderRepository.Update(workOrder, x => new { x.Status, x.ActualEndDate, x.GoodQty,x.NoGoodQty,x.RealQty }, true);
             }
            else
            {
                _workOrderRepository.Update(workOrder, x => new { x.Status }, true);
            }
            return "变更成功！";
        }
        /// <summary>
        /// 获取首页上方数量统计
        /// </summary>
        /// <returns></returns>
        [Route("getHomeStatisticsNumber"), HttpGet]
        public JsonResult GetHomeStatisticsNumber()
        {
            string woSql = " select * from HomeView_StatisticsNumber ";
            List<HomeNumberOutput> list =  DBServerProvider.SqlDapper.QueryList<HomeNumberOutput>(woSql, new { });
            return JsonNormal(list);
        }
        /// <summary>
        /// 获取首页工序数量明细信息
        /// </summary>
        /// <returns></returns>
        [Route("getHomeProcessNumber"), HttpGet]
        public JsonResult GetHomeProcessNumber()
        {
            string woSql = " select * from HomeView_GetProcessNumber ";
            List<HomeProcessNumberOutput> list = DBServerProvider.SqlDapper.QueryList<HomeProcessNumberOutput>(woSql, new { });
            return JsonNormal(list);
        }
    }
}
