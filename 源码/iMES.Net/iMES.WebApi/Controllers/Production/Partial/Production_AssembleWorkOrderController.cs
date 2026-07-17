/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_AssembleWorkOrder",Enums.ActionPermissionOptions.Search)]
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
using Microsoft.EntityFrameworkCore;
using iMES.Core.DBManager;

namespace iMES.Production.Controllers
{
    public partial class Production_AssembleWorkOrderController
    {
        private readonly IProduction_AssembleWorkOrderService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_AssembleWorkOrderListRepository _assembleWorkOrder;

        [ActivatorUtilitiesConstructor]
        public Production_AssembleWorkOrderController(
            IProduction_AssembleWorkOrderService service,
            IHttpContextAccessor httpContextAccessor,
             IProduction_AssembleWorkOrderListRepository assembleWorkOrder
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _assembleWorkOrder = assembleWorkOrder;
        }

        /// <summary>
        /// 获取装配订单产品明细列表
        /// </summary>
        /// <param name="SalesOrder_Id">装配订单ID</param>
        /// <returns></returns>
        [Route("getDetailRows"), HttpGet]
        public async Task<IActionResult> GetDetailRows(int AssembleWorkOrder_Id)
        {
            var rows = await _assembleWorkOrder.FindAsIQueryable(x => x.AssembleWorkOrder_Id == AssembleWorkOrder_Id)
                  .ToListAsync();
            string woSql = " select * from Production_WorkOrder ";
            List<Production_WorkOrder> list = DBServerProvider.SqlDapper.QueryList<Production_WorkOrder>(woSql, new { });
            for (int i = 0; i < rows.Count; i++)
            {
                if (list.Exists(x => x.WorkOrderCode == rows[i].WorkOrderCode))
                {
                    rows[i].FinishQty = list.Find(x => x.WorkOrderCode == rows[i].WorkOrderCode).GoodQty;
                    rows[i].BadQty = list.Find(x => x.WorkOrderCode == rows[i].WorkOrderCode).NoGoodQty;
                }
                else
                {
                    rows[i].FinishQty = 0;
                    rows[i].BadQty = 0;
                }
            }
            //获取当前库存数量
            return JsonNormal(rows);
        }
    }
}
