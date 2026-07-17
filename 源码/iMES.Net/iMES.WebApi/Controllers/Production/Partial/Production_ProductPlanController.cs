/*
 *接口编写处...
*如果接口需要做Action的权限验证，请在Action上使用属性
*如: [ApiActionPermission("Production_ProductPlan",Enums.ActionPermissionOptions.Search)]
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
    public partial class Production_ProductPlanController
    {
        private readonly IProduction_ProductPlanService _service;//访问业务代码
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_ProductPlanListRepository _productPlanListRepository;

        [ActivatorUtilitiesConstructor]
        public Production_ProductPlanController(
            IProduction_ProductPlanService service,
            IHttpContextAccessor httpContextAccessor,
             IProduction_ProductPlanListRepository productPlanListRepository
        )
        : base(service)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _productPlanListRepository = productPlanListRepository;
    }
        /// <summary>
        /// 获取生产计划产品明细列表
        /// </summary>
        /// <param name="SalesOrder_Id">生产计划主键ID</param>
        /// <returns></returns>
        [Route("getDetailRows"), HttpGet]
        public async Task<IActionResult> GetDetailRows(int ProductPlan_Id)
        {
            var rows = await _productPlanListRepository.FindAsIQueryable(x => x.ProductPlan_Id == ProductPlan_Id)
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
