/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_SalesOrder",Enums.ActionPermissionOptions.Search)]
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
    public partial class Production_SalesOrderController
    {
        private readonly IProduction_SalesOrderService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_SalesOrderListRepository _salesOrderListRepository;

        [ActivatorUtilitiesConstructor]
        public Production_SalesOrderController(
            IProduction_SalesOrderService service,
            IHttpContextAccessor httpContextAccessor,
            IProduction_SalesOrderListRepository salesOrderListRepository
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _salesOrderListRepository = salesOrderListRepository;
        }

        /// <summary>
        /// 获取销售订单产品明细列表
        /// </summary>
        /// <param name="SalesOrder_Id">销售单号</param>
        /// <returns></returns>
        [Route("getDetailRows"), HttpGet]
        public async Task<IActionResult> GetDetailRows(int SalesOrder_Id)
        {
            var rows = await _salesOrderListRepository.FindAsIQueryable(x => x.SalesOrder_Id == SalesOrder_Id)
                  .ToListAsync();
            string woSql = " select * from Production_WorkOrder ";
            List<Production_WorkOrder> list = DBServerProvider.SqlDapper.QueryList<Production_WorkOrder>(woSql, new { });
            for (int i = 0; i < rows.Count; i++)
            {
                if (list.Exists(x => x.WorkOrderCode == rows[i].WorkOrderCode))
                {
                    rows[i].FinishQty = list.Find(x => x.WorkOrderCode == rows[i].WorkOrderCode).GoodQty;
                }
                else
                {
                    rows[i].FinishQty = 0;
                }
            }
            //获取当前库存数量
            return JsonNormal(rows);
        }
    }
}
