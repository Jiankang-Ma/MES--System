/*
 *所有关于Production_WorkOrderList类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Production_WorkOrderListService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
*/
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;
using System.Linq;
using iMES.Core.Utilities;
using System.Linq.Expressions;
using iMES.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using iMES.Production.IRepositories;
using iMES.Core.DBManager;
using System.Collections.Generic;

namespace iMES.Production.Services
{
    public partial class Production_WorkOrderListService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_WorkOrderListRepository _repository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Production_WorkOrderListService(
            IProduction_WorkOrderListRepository dbRepository,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }

        //查询
        public override PageGridData<Production_WorkOrderList> GetPageData(PageDataOptions options)
        {
            GetPageDataOnExecuted = (PageGridData<Production_WorkOrderList> grid) =>
            {
                //获取当前库存数量
                string sql = @" select WorkOrderList_Id, wo.Process_Id,ProcessName,ProcessCode
                                        ,SubmitWorkLimit,SubmitWorkMatch ,DefectItem ,DistributionList
                                        ,Wo.PlanStartDate,Wo.PlanEndDate,Wo.PlanQty,SUM(rwo.GoodQty) GoodQty,SUM(rwo.NoGoodQty) NoGoodQty
                                        ,Wo.ActualStartDate,Wo.ActualEndDate,wo.WorkOrder_Id,wo.WorkOrderCode,W.Status,W.ProductCode,w.ProductName
                                        from Production_WorkOrderList wo
                                        LEFT JOIN Production_WorkOrder W ON WO.WorkOrder_Id = W.WorkOrder_Id
                                        LEFT JOIN Production_ReportWorkOrder rwo on wo.WorkOrder_Id = rwo.WorkOrder_Id and wo.Process_Id = rwo.Process_Id
                                        group by WorkOrderList_Id, wo.Process_Id,ProcessName,ProcessCode,W.Status
                                        ,SubmitWorkLimit,SubmitWorkMatch ,DefectItem ,DistributionList
                                        ,wo.PlanStartDate,wo.PlanEndDate,wo.PlanQty,wo.ActualStartDate,wo.ActualEndDate,wo.WorkOrder_Id,wo.WorkOrderCode,W.ProductCode,w.ProductName ";
                //与原生dapper使用方式基本一致，更多使用方法参照dapper文档
                List<Production_WorkOrderList> storeList = DBServerProvider.SqlDapper.QueryList<Production_WorkOrderList>(sql, new { });
                for (int i = 0; i < grid.rows.Count; i++)
                {
                    if (storeList.Exists(x => x.WorkOrder_Id == grid.rows[i].WorkOrder_Id && x.Process_Id == grid.rows[i].Process_Id))
                    {
                        var entity = storeList.Find(x => x.WorkOrder_Id == grid.rows[i].WorkOrder_Id && x.Process_Id == grid.rows[i].Process_Id);
                        grid.rows[i].Status = entity.Status;
                        grid.rows[i].ProductCode = entity.ProductCode;
                        grid.rows[i].ProductName = entity.ProductName;
                        grid.rows[i].GoodQty = entity.GoodQty;
                        grid.rows[i].NoGoodQty = entity.NoGoodQty;
                    }
                    else
                    {
                        grid.rows[i].Status = "1";
                        grid.rows[i].ProductCode = "";
                        grid.rows[i].ProductName = "";
                        grid.rows[i].GoodQty = 0;
                        grid.rows[i].NoGoodQty = 0;
                    }
                }
            };
            return base.GetPageData(options);
        }

    }
}
