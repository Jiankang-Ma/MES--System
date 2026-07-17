/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_ReportWorkOrder",Enums.ActionPermissionOptions.Search)]
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
using iMES.Core.Extensions;
using iMES.Custom.IRepositories;
using iMES.Core.DBManager;

namespace iMES.Production.Controllers
{
    public partial class Production_ReportWorkOrderController
    {
        private readonly IProduction_ReportWorkOrderService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_ReportWorkOrderRepository _reportWorkOrderRepository;
        private readonly IBase_MeritPayRepository _meritPayRepository;

        [ActivatorUtilitiesConstructor]
        public Production_ReportWorkOrderController(
            IProduction_ReportWorkOrderService service,
            IHttpContextAccessor httpContextAccessor,
            IProduction_ReportWorkOrderRepository reportWorkOrderRepository,
             IBase_MeritPayRepository meritPayRepository
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _reportWorkOrderRepository = reportWorkOrderRepository;
            _meritPayRepository = meritPayRepository;
        }

        /// <summary>
        /// 获取工单下面的工序列表
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet, Route("getProgress")]
        public JsonResult GetProgress(string workOrder_Id, int processId,int productId,int planQty)
        {
            //获取已报工数量
            int alreadyQty = 0;
            var goodQtySum =   _reportWorkOrderRepository.FindAsIQueryable(x => x.WorkOrder_Id == workOrder_Id && x.Process_Id == processId && x.Product_Id == productId)
                  .GroupBy(x => 1).Select(x => new
                  {
                      GoodQty = x.Sum(o => o.GoodQty)
                  }).FirstOrDefault();
            if (goodQtySum.GoodQty != null)
            {
                alreadyQty = (int)goodQtySum.GoodQty;
            }
            //获取标准效率
            var merit = _meritPayRepository.FindAsIQueryable(x => x.Process_Id == processId && x.Product_Id  == productId)
                 .OrderByDescending(x => x.CreateDate)
                 .Select(s => new
                 {
                     standardNumber = s.StandardNumber,
                     standardHour = s.StandardHour,
                     standardMin = s.StandardMin,
                     standardSec = s.StandardSec,
                     unitPrice = s.UnitPrice
                 })
                 .FirstOrDefault();
            Production_ReturnData entity = new Production_ReturnData();
            entity.ProcessProgress = alreadyQty + "/" + planQty;
            entity.StandardProgress = merit == null ?  "" : merit.standardNumber + "/" + merit.standardHour + ":" + merit.standardMin + ":" + merit.standardSec;
            entity.UnitPrice = merit == null ? "" : merit.unitPrice.ToString();
            return Json(entity);
        }
        /// <summary>
        /// 获取报工明细
        /// </summary>
        /// <returns></returns>
        [Route("getReportDetailInfo"), HttpGet]
        public JsonResult getReportDetailInfo(string workOrderId)
        {
            const string woSql = @"SELECT rwo.*, p.ProcessName, u.UserTrueName ProductUserName
                                             FROM Production_ReportWorkOrder rwo
                                             left join Base_Process p on rwo.Process_Id = p.Process_Id
                                             left join Sys_User u on u.User_Id = rwo.ProductUser
                                             where rwo.WorkOrder_Id = @workOrderId";
            List<Production_ReportWorkOrder> list = DBServerProvider.SqlDapper.QueryList<Production_ReportWorkOrder>(woSql, new { workOrderId });
            return JsonNormal(list);
        }

        /// <summary>
        /// APP统计报表工序报工数
        /// </summary>
        /// <returns></returns>
        [Route("getAppHomeReportProcessTop5"), HttpGet]
        public JsonResult GetAppHomeReportProcessTop5()
        {
            string woSql = @" SELECT TOP 5 p.ProcessName name ,SUM([ReportQty]) data
                                         FROM [Production_ReportWorkOrder] rwo  left join Base_Process p on rwo.Process_Id = p.Process_Id GROUP BY P.ProcessName ";
            List<BoardEntity> list = DBServerProvider.SqlDapper.QueryList<BoardEntity>(woSql, new { });
            return JsonNormal(list);
        }
    }
}
