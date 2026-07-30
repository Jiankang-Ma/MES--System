/*
 *所有关于Production_WorkOrder类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Production_WorkOrderService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
*/
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;
using System.Linq;
using iMES.Core.Utilities;
using iMES.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using iMES.Production.IRepositories;
using Sys = System;
using iMES.Custom.IRepositories;
using System.Collections.Generic;
using iMES.Core.DBManager;

namespace iMES.Production.Services
{
    public partial class Production_WorkOrderService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_WorkOrderRepository _repository;//访问数据库
        private readonly IBase_NumberRuleRepository _numberRuleRepository;//自定义编码规则访问数据库
        private readonly IBase_ProductRepository _productRepository;

        [ActivatorUtilitiesConstructor]
        public Production_WorkOrderService(
            IProduction_WorkOrderRepository dbRepository,
            IBase_NumberRuleRepository numberRuleRepository,
            IHttpContextAccessor httpContextAccessor,
            IBase_ProductRepository productRepository
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _numberRuleRepository = numberRuleRepository;
            _repository = dbRepository;
            _productRepository = productRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        WebResponseContent webResponse = new WebResponseContent();
        //查询
        public override PageGridData<Production_WorkOrder> GetPageData(PageDataOptions options)
        {
            //查询完成后，在返回页面前可对查询的数据进行操作
            GetPageDataOnExecuted = (PageGridData<Production_WorkOrder> grid) =>
            {
                //可对查询的结果的数据操作
                List<Production_WorkOrder> list = grid.rows;
                for (int i = 0; i < list.Count; i++)
                {
                    var processLineId = _productRepository.FindAsIQueryable(x => x.Product_Id == list[i].Product_Id)
                            .OrderByDescending(x => x.CreateDate)
                            .Select(s => s.Process_Id.GetInt())
                            .FirstOrDefault();
                    string ParameterSQL = "select * from  Func_GetProcessLineAndProgressByID('" + list[i].WorkOrderCode + "'," + processLineId + ")";
                    object obj = DBServerProvider.SqlDapper.ExecuteScalar("SerializeJSON", new { ParameterSQL }, Sys.Data.CommandType.StoredProcedure);
                    list[i].ProductionSchedule = obj.ToString();
                }
            };
            return base.GetPageData(options);
        }
        /// <summary>
        /// 新建
        /// </summary>
        /// <param name="saveDataModel"></param>
        /// <returns></returns>
        public override WebResponseContent Add(SaveModel saveDataModel)
        {
            //此处saveModel是从前台提交的原生数据，可对数据进修改过滤
            AddOnExecuting = (Production_WorkOrder workOrder, object list) =>
            {
                if (string.IsNullOrWhiteSpace(workOrder.WorkOrderCode))
                    workOrder.WorkOrderCode = GetWorkOrderCode();
                //如果返回false,后面代码不会再执行
                if (repository.Exists(x => x.WorkOrderCode == workOrder.WorkOrderCode))
                {
                    return webResponse.Error("工单编号已存在");
                }
                return webResponse.OK();
            };
            return base.Add(saveDataModel);
        }
        /// <summary>
        /// 自动生成工单编号
        /// </summary>
        /// <returns></returns>
        public string GetWorkOrderCode()
        {
            Sys.DateTime dateNow = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd").GetDateTime();
            //查询当天最新的订单号
            string defectItemCode = repository.FindAsIQueryable(x => x.CreateDate > dateNow)
                .OrderByDescending(x => x.WorkOrderCode)
                .Select(s => s.WorkOrderCode)
                .FirstOrDefault();
            Base_NumberRule numberRule = _numberRuleRepository.FindAsIQueryable(x => x.FormCode == "WorkOrderForm")
                .OrderByDescending(x => x.CreateDate)
                .FirstOrDefault();
            if (numberRule != null)
            {
                string rule = numberRule.Prefix + Sys.DateTime.Now.ToString(numberRule.SubmitTime.Replace("hh", "HH"));
                if (string.IsNullOrEmpty(defectItemCode))
                {
                    rule += "1".PadLeft(numberRule.SerialNumber, '0');
                }
                else
                {
                    rule += (defectItemCode.Substring(defectItemCode.Length - numberRule.SerialNumber).GetInt() + 1).ToString("0".PadLeft(numberRule.SerialNumber, '0'));
                }
                return rule;
            }
            else //如果自定义序号配置项不存在，则使用日期生成
            {
                return Sys.DateTime.Now.ToString("yyyyMMddHHmmssffff");
            }
        }
        /// <summary>
        /// 查询业务代码编写(从表(明细表查询))
        /// </summary>
        /// <param name="pageData"></param>
        /// <returns></returns>
        public override object GetDetailPage(PageDataOptions pageData)
        {
            //自定义查询明细表

            //明细表自定义查询dapper
            PageGridData<Production_WorkOrderList> detailGrid = new PageGridData<Production_WorkOrderList>();
            string sql = "select count(1) from Production_WorkOrderList where WorkOrder_Id=@workOrderId";
            detailGrid.total = repository.DapperContext.ExecuteScalar(sql, new { workOrderId = pageData.Value }).GetInt();

            sql = @$"select s.WorkOrderList_Id,
                            s.Process_Id,s.ProcessName,s.ProcessCode,s.SubmitWorkLimit,s.SubmitWorkMatch,s.DefectItem,s.DistributionList,s.PlanStartDate,s.PlanEndDate,s.PlanQty,sum(rwo.GoodQty) GoodQty,sum(rwo.NoGoodQty) NoGoodQty,s.ActualStartDate,
                            s.ActualEndDate,s.CreateDate,s.CreateID,s.Creator	,s.Modifier	,s.ModifyDate	,s.ModifyID	,s.WorkOrder_Id	,s.WorkOrderCode,s.rowId
                              from (
                                      select *,ROW_NUMBER()over(order by createdate desc) as rowId
                                         from Production_WorkOrderList where WorkOrder_Id=@workOrderId
                                            ) as s 
                                     LEFT JOIN Production_ReportWorkOrder rwo on s.WorkOrder_Id = rwo.WorkOrder_Id and s.Process_Id = rwo.Process_Id
                         
                         where s.rowId between {((pageData.Page - 1) * pageData.Rows + 1)} and {pageData.Page * pageData.Rows} 
                             group by  s.WorkOrderList_Id,
                            s.Process_Id,s.ProcessName,s.ProcessCode,s.SubmitWorkLimit,s.SubmitWorkMatch,s.DefectItem,s.DistributionList,s.PlanStartDate,s.PlanEndDate,s.PlanQty,s.ActualStartDate,
                            s.ActualEndDate,s.CreateDate,s.CreateID,s.Creator	,s.Modifier	,s.ModifyDate	,s.ModifyID	,s.WorkOrder_Id	,s.WorkOrderCode,s.rowId";
            detailGrid.rows = repository.DapperContext.QueryList<Production_WorkOrderList>(sql, new { workOrderId = pageData.Value });
            return detailGrid;
        }
    }
}
