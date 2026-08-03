/*
 *所有关于Production_AssembleWorkOrder类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Production_AssembleWorkOrderService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using iMES.Custom.IRepositories;
using Sys = System;
using System.Collections.Generic;
using iMES.Core.DBManager;
using iMES.Production.Repositories;
using iMES.Core.Enums;
using iMES.Custom.IServices;
using iMES.Core.ManageUser;

namespace iMES.Production.Services
{
    public partial class Production_AssembleWorkOrderService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_AssembleWorkOrderRepository _repository;//访问数据库
        private readonly IBase_NumberRuleRepository _numberRuleRepository;//自定义编码规则访问数据库
        private readonly IProduction_WorkOrderRepository _workOrderRepository;//访问数据库
        private readonly IBase_ProductRepository _productRepository;//访问数据库
        private readonly IBase_ProcessService _processService;//访问业务代码
        private readonly IBase_ProcessRepository _processRepository;//访问数据库
        private readonly IProduction_WorkOrderListRepository _workOrderListRepository;//访问数据库
        private readonly IProduction_AssembleWorkOrderListRepository _assembleWorkOrderListRepository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Production_AssembleWorkOrderService(
            IProduction_AssembleWorkOrderRepository dbRepository,
            IBase_NumberRuleRepository numberRuleRepository,
            IHttpContextAccessor httpContextAccessor,
            IProduction_WorkOrderRepository workOrderRepository,
            IBase_ProductRepository productRepository,
            IBase_ProcessService processService,
            IBase_ProcessRepository processRepository,
            IProduction_WorkOrderListRepository workOrderListRepository,
            IProduction_AssembleWorkOrderListRepository assembleWorkOrderListRepository
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _numberRuleRepository = numberRuleRepository;
            _repository = dbRepository;
            _workOrderRepository = workOrderRepository;
            _productRepository = productRepository;
            _processService = processService;
            _processRepository = processRepository;
            _workOrderListRepository = workOrderListRepository;
            _assembleWorkOrderListRepository = assembleWorkOrderListRepository;

            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        WebResponseContent webResponse = new WebResponseContent();
        //查询
        public override PageGridData<Production_AssembleWorkOrder> GetPageData(PageDataOptions options)
        {
            // 工单数量、完成数量和进度均由 GetAssembleProcess 按明细/工单实时统计。
            // 必须在通用 GetPageData 生成 WHERE、ORDER BY 和分页之前合并视图，
            // 否则页面显示的是统计值，筛选却会命中主表中长期为 NULL 的同名字段。
            QuerySql = @"
SELECT
    a.AssembleWorkOrder_Id,
    a.AssembleWorkOrderCode,
    ISNULL(p.WorkOrderQty, 0) AS WorkOrderQty,
    ISNULL(p.FinishedQty, 0) AS FinishedQty,
    ISNULL(p.FormProcess, '0') AS FormProcess,
    a.Remark,
    a.CreateDate,
    a.CreateID,
    a.Creator,
    a.Modifier,
    a.ModifyDate,
    a.ModifyID
FROM Production_AssembleWorkOrder AS a
LEFT JOIN GetAssembleProcess AS p
    ON p.AssembleWorkOrder_Id = a.AssembleWorkOrder_Id";
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
            AddOnExecuting = (Production_AssembleWorkOrder assembleWorkOrder, object list) =>
            {
                if (string.IsNullOrWhiteSpace(assembleWorkOrder.AssembleWorkOrderCode))
                    assembleWorkOrder.AssembleWorkOrderCode = GetAssembleWorkOrderCode();
                //如果返回false,后面代码不会再执行
                if (repository.Exists(x => x.AssembleWorkOrderCode == assembleWorkOrder.AssembleWorkOrderCode))
                {
                    return webResponse.Error("装配工单编号已存在");
                }
                List<Production_AssembleWorkOrderList> orderLists = list as List<Production_AssembleWorkOrderList>;
                if (orderLists != null && orderLists.Any(x => x.Qty <= 0))
                {
                    return webResponse.Error("装配工单明细数量必须大于 0");
                }
                int sequence = 1;
                string maxWorkOrderCode = _workOrderRepository.FindAsIQueryable(x => x.WorkOrderCode.Contains(assembleWorkOrder.AssembleWorkOrderCode))
                  .OrderByDescending(x => x.CreateDate)
                  .Select(s => s.WorkOrderCode)
                  .FirstOrDefault();
                if (!string.IsNullOrEmpty(maxWorkOrderCode) && maxWorkOrderCode.Contains("-"))
                {
                    sequence = maxWorkOrderCode.Split('-')[1].GetInt() + 1;
                }
                for (int i = 0; i < orderLists.Count; i++)
                {
                    sequence += i;
                    orderLists[i].WorkOrderCode = assembleWorkOrder.AssembleWorkOrderCode + "-" + sequence;
                    UserInfo userInfo = UserContext.Current.UserInfo;
                    Production_WorkOrder workOrder = new Production_WorkOrder();
                    workOrder.WorkOrderCode = orderLists[i].WorkOrderCode;
                    workOrder.Product_Id = orderLists[i].Product_Id;
                    workOrder.ProductCode = orderLists[i].ProductCode;
                    workOrder.ProductName = orderLists[i].ProductName;
                    workOrder.ProductStandard = orderLists[i].ProductStandard;
                    var product = _productRepository.FindAsIQueryable(x => x.Product_Id == orderLists[i].Product_Id)
                               .OrderByDescending(x => x.CreateDate)
                               .Select(s => new
                               {
                                   s.Unit_Id,
                                   s.Product_Id,
                                   s.Process_Id
                               })
                               .FirstOrDefault();
                    workOrder.Unit_Id = product.Unit_Id;
                    workOrder.AssociatedForm = assembleWorkOrder.AssembleWorkOrderCode;
                    workOrder.FromType = "AssembleWorkOrder";
                    workOrder.Status = "1";
                    workOrder.PlanStartDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 00:00:00").ToDateTime();
                    workOrder.PlanEndDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 23:59:59").ToDateTime();
                    workOrder.PlanQty = orderLists[i].Qty;
                    workOrder.RealQty = 0;
                    workOrder.GoodQty = 0;
                    workOrder.NoGoodQty = 0;
                    workOrder.CreateID = userInfo.User_Id;
                    workOrder.Creator = userInfo.UserTrueName;
                    workOrder.CreateDate = Sys.DateTime.Now;
                    _workOrderRepository.Add(workOrder, true);
                    List<Base_Process> processList = (List<Base_Process>)_processService.GetProcessListByLineID(product.Process_Id.GetInt());
                    List<Production_WorkOrderList> orderListNext = new List<Production_WorkOrderList>();
                    for (int j = 0; j < processList.Count; j++)
                    {
                        var process = _processRepository.FindAsIQueryable(x => x.Process_Id == processList[j].Process_Id)
                              .OrderByDescending(x => x.CreateDate)
                              .Select(s => new
                              {
                                  s.Process_Id,
                                  s.ProcessName,
                                  s.ProcessCode,
                                  s.SubmitWorkLimit,
                                  s.SubmitWorkMatch,
                                  s.DefectItem
                              })
                              .FirstOrDefault();
                        Production_WorkOrderList entity = new Production_WorkOrderList();
                        entity.Process_Id = process.Process_Id;
                        entity.ProcessName = process.ProcessName;
                        entity.ProcessCode = process.ProcessCode;
                        entity.SubmitWorkLimit = process.SubmitWorkLimit;
                        entity.SubmitWorkMatch = process.SubmitWorkMatch;
                        entity.DefectItem = process.DefectItem;
                        entity.PlanStartDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 00:00:00").ToDateTime();
                        entity.PlanEndDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 23:59:59").ToDateTime();
                        entity.PlanQty = orderLists[i].Qty;
                        entity.GoodQty = 0;
                        entity.NoGoodQty = 0;
                        entity.WorkOrder_Id = workOrder.WorkOrder_Id;
                        entity.WorkOrderCode = workOrder.WorkOrderCode;
                        entity.CreateID = userInfo.User_Id;
                        entity.Creator = userInfo.UserTrueName;
                        entity.CreateDate = Sys.DateTime.Now;
                        orderListNext.Add(entity);
                    }
                    _workOrderListRepository.AddRange(orderListNext, true);
                }
                return webResponse.OK();
            };
            return base.Add(saveDataModel);
        }
        /// <summary>
        /// 编辑操作
        /// </summary>
        /// <param name="saveModel"></param>
        /// <returns></returns>
        public override WebResponseContent Update(SaveModel saveModel)
        {
            UpdateOnExecute = (SaveModel model) =>
            {
                return webResponse.OK();
            };
            //编辑方法保存数据库前处理
            UpdateOnExecuting = (Production_AssembleWorkOrder assembleWorkOrder, object addList, object updateList, List<object> delKeys) =>
            {
                //新增的明细表
                List<Production_AssembleWorkOrderList> orderLists = addList as List<Production_AssembleWorkOrderList>;
                if (orderLists != null && orderLists.Any(x => x.Qty <= 0))
                {
                    return webResponse.Error("装配工单明细数量必须大于 0");
                }
                if (orderLists.Count > 0)
                {
                    int sequence = 1;
                    string maxWorkOrderCode = _workOrderRepository.FindAsIQueryable(x => x.WorkOrderCode.Contains(assembleWorkOrder.AssembleWorkOrderCode))
                     .OrderByDescending(x => x.CreateDate)
                     .Select(s => s.WorkOrderCode)
                     .FirstOrDefault();
                    UserInfo userInfo = UserContext.Current.UserInfo;
                    if (!string.IsNullOrEmpty(maxWorkOrderCode) && maxWorkOrderCode.Contains("-"))
                    {
                        sequence = maxWorkOrderCode.Split('-')[1].GetInt() + 1;
                    }
                    for (int i = 0; i < orderLists.Count; i++)
                    {
                        sequence += i;
                        orderLists[i].WorkOrderCode = assembleWorkOrder.AssembleWorkOrderCode + "-" + sequence;
                        Production_WorkOrder workOrder = new Production_WorkOrder();
                        workOrder.WorkOrderCode = orderLists[i].WorkOrderCode;
                        workOrder.Product_Id = orderLists[i].Product_Id;
                        workOrder.ProductCode = orderLists[i].ProductCode;
                        workOrder.ProductName = orderLists[i].ProductName;
                        workOrder.ProductStandard = orderLists[i].ProductStandard;
                        var product = _productRepository.FindAsIQueryable(x => x.Product_Id == orderLists[i].Product_Id)
                                   .OrderByDescending(x => x.CreateDate)
                                   .Select(s => new
                                   {
                                       s.Unit_Id,
                                       s.Product_Id,
                                       s.Process_Id
                                   })
                                   .FirstOrDefault();
                        workOrder.Unit_Id = product.Unit_Id;
                        workOrder.AssociatedForm = assembleWorkOrder.AssembleWorkOrderCode;
                        workOrder.FromType = "AssembleWorkOrder";
                        workOrder.Status = "1";
                        workOrder.PlanStartDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 00:00:00").ToDateTime();
                        workOrder.PlanEndDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 23:59:59").ToDateTime();
                        workOrder.PlanQty = orderLists[i].Qty;
                        workOrder.RealQty = 0;
                        workOrder.GoodQty = 0;
                        workOrder.NoGoodQty = 0;
                        workOrder.ModifyID = userInfo.User_Id;
                        workOrder.Modifier = userInfo.UserTrueName;
                        workOrder.ModifyDate = Sys.DateTime.Now;
                        _workOrderRepository.Add(workOrder, true);
                        List<Base_Process> processList = (List<Base_Process>)_processService.GetProcessListByLineID(product.Process_Id.GetInt());
                        List<Production_WorkOrderList> orderListNext = new List<Production_WorkOrderList>();
                        for (int j = 0; j < processList.Count; j++)
                        {
                            var process = _processRepository.FindAsIQueryable(x => x.Process_Id == processList[j].Process_Id)
                                  .OrderByDescending(x => x.CreateDate)
                                  .Select(s => new
                                  {
                                      s.Process_Id,
                                      s.ProcessName,
                                      s.ProcessCode,
                                      s.SubmitWorkLimit,
                                      s.SubmitWorkMatch,
                                      s.DefectItem
                                  })
                                  .FirstOrDefault();
                            Production_WorkOrderList entity = new Production_WorkOrderList();
                            entity.Process_Id = process.Process_Id;
                            entity.ProcessName = process.ProcessName;
                            entity.ProcessCode = process.ProcessCode;
                            entity.SubmitWorkLimit = process.SubmitWorkLimit;
                            entity.SubmitWorkMatch = process.SubmitWorkMatch;
                            entity.DefectItem = process.DefectItem;
                            entity.PlanStartDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 00:00:00").ToDateTime();
                            entity.PlanEndDate = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd 23:59:59").ToDateTime();
                            entity.PlanQty = orderLists[i].Qty;
                            entity.GoodQty = 0;
                            entity.NoGoodQty = 0;
                            entity.WorkOrder_Id = workOrder.WorkOrder_Id;
                            entity.WorkOrderCode = workOrder.WorkOrderCode;
                            entity.ModifyID = userInfo.User_Id;
                            entity.Modifier = userInfo.UserTrueName;
                            entity.ModifyDate = Sys.DateTime.Now;
                            orderListNext.Add(entity);
                        }
                        _workOrderListRepository.AddRange(orderListNext, true);
                    }
                };
                //修改的明细表
                List<Production_AssembleWorkOrderList> updateOrderLists = updateList as List<Production_AssembleWorkOrderList>;
                if (updateOrderLists != null && updateOrderLists.Any(x => x.Qty <= 0))
                {
                    return webResponse.Error("装配工单明细数量必须大于 0");
                }
                if (updateOrderLists.Count > 0)
                {
                    for (int i = 0; i < updateOrderLists.Count; i++)
                    {
                        Production_WorkOrder workOrder = new Production_WorkOrder();
                        int workOrder_Id = _workOrderRepository.FindAsIQueryable(x => x.WorkOrderCode == updateOrderLists[i].WorkOrderCode && x.Product_Id == updateOrderLists[i].Product_Id)
                                      .OrderByDescending(x => x.CreateDate)
                                      .Select(s => s.WorkOrder_Id)
                                      .FirstOrDefault();
                        workOrder.WorkOrder_Id = workOrder_Id;
                        var product = _productRepository.FindAsIQueryable(x => x.Product_Id == updateOrderLists[i].Product_Id)
                                   .OrderByDescending(x => x.CreateDate)
                                   .Select(s => new
                                   {
                                       s.Unit_Id,
                                       s.Product_Id,
                                       s.Process_Id
                                   })
                                   .FirstOrDefault();
                        workOrder.PlanQty = updateOrderLists[i].Qty;
                        _workOrderRepository.Update(workOrder, x => new { x.PlanQty }, true);
                        List<Base_Process> processList = (List<Base_Process>)_processService.GetProcessListByLineID(product.Process_Id.GetInt());
                        List<Production_WorkOrderList> orderListNext = new List<Production_WorkOrderList>();
                        for (int j = 0; j < processList.Count; j++)
                        {
                            Production_WorkOrderList entity = new Production_WorkOrderList();
                            int workOrderList_Id = _workOrderListRepository.FindAsIQueryable(x => x.WorkOrderCode == updateOrderLists[i].WorkOrderCode && x.Process_Id == processList[j].Process_Id)
                                    .OrderByDescending(x => x.CreateDate)
                                    .Select(s => s.WorkOrderList_Id)
                                    .FirstOrDefault();
                            entity.WorkOrderList_Id = workOrderList_Id;
                            entity.PlanQty = updateOrderLists[i].Qty;
                            orderListNext.Add(entity);
                        }
                        _workOrderListRepository.UpdateRange(orderListNext, x => new { x.PlanQty }, true);
                    }
                }

                //删除明细表Id
                var guids = delKeys?.Select(x => (int)x);
                foreach (int id in guids)
                {

                    var wo = _assembleWorkOrderListRepository.FindAsIQueryable(x => x.AssembleWorkOrderList_Id == id)
                         .OrderByDescending(x => x.CreateDate)
                         .Select(s => new
                         {
                             s.WorkOrderCode
                         })
                         .FirstOrDefault();
                    var woi = _workOrderRepository.FindAsIQueryable(x => x.WorkOrderCode == wo.WorkOrderCode)
                         .OrderByDescending(x => x.CreateDate)
                         .Select(s => new
                         {
                             s.WorkOrder_Id
                         })
                         .FirstOrDefault();
                    if (woi != null)
                    {
                        object[] mainIds = new object[] { woi.WorkOrder_Id };
                        _workOrderRepository.DeleteWithKeys(mainIds, true);
                    }
                }
                return webResponse.OK();
            };
            return base.Update(saveModel);
        }
        public override object GetDetailPage(PageDataOptions pageData)
        {
            var query = Production_AssembleWorkOrderListRepository.Instance.IQueryablePage<Production_AssembleWorkOrderList>(
                 pageData.Page,
                 pageData.Rows,
                 out int count,
                 x => x.AssembleWorkOrder_Id == pageData.Value.GetInt(),
                  orderBy: x => new Dictionary<object, QueryOrderBy>() { { x.LevelPath, QueryOrderBy.Asc } }
                );
            PageGridData<Production_AssembleWorkOrderList> detailGrid = new PageGridData<Production_AssembleWorkOrderList>();
            detailGrid.rows = query.ToList();
            detailGrid.total = count;
            //获取当前库存数量
            //List<Base_Product> storeList = Base_ProductService.GetStoreNumber();
            for (int i = 0; i < detailGrid.rows.Count; i++)
            {
                if (detailGrid.rows[i].ProcessLine_Id != null)
                {
                    string woSql = " select * from Production_WorkOrder ";
                    List<Production_WorkOrder>  list =  DBServerProvider.SqlDapper.QueryList<Production_WorkOrder>(woSql, new { });
                    if (list.Exists(x => x.WorkOrderCode == detailGrid.rows[i].WorkOrderCode))
                    {
                        detailGrid.rows[i].FinishQty = list.Find(x => x.WorkOrderCode == detailGrid.rows[i].WorkOrderCode).GoodQty;
                        detailGrid.rows[i].BadQty = list.Find(x => x.WorkOrderCode == detailGrid.rows[i].WorkOrderCode).NoGoodQty;
                        detailGrid.rows[i].Status = list.Find(x => x.WorkOrderCode == detailGrid.rows[i].WorkOrderCode).Status;
                    }
                    else
                    {
                        detailGrid.rows[i].FinishQty = 0;
                        detailGrid.rows[i].BadQty = 0;
                        detailGrid.rows[i].Status = "1";
                    }
                    string ParameterSQL = "select * from  Func_GetProcessLineAndProgressByID('" + detailGrid.rows[i].WorkOrderCode + "'," + detailGrid.rows[i].ProcessLine_Id + ")";
                    object obj =  DBServerProvider.SqlDapper.ExecuteScalar("SerializeJSON", new { ParameterSQL }, Sys.Data.CommandType.StoredProcedure);
                    detailGrid.rows[i].ProductionSchedule = obj.ToString();//storeList.Find(x => x.Product_Id == detailGrid.rows[i].Product_Id).InventoryQty;
                }
                else
                {
                    detailGrid.rows[i].ProductionSchedule = "-";
                }
            }
            return detailGrid;
        }
        /// <summary>
        /// 自动生成工序编号
        /// </summary>
        /// <returns></returns>
        public string GetAssembleWorkOrderCode()
        {
            Sys.DateTime dateNow = (Sys.DateTime)Sys.DateTime.Now.ToString("yyyy-MM-dd").GetDateTime();
            //查询当天最新的订单号
            string defectItemCode = repository.FindAsIQueryable(x => x.CreateDate > dateNow)
                .OrderByDescending(x => x.AssembleWorkOrderCode)
                .Select(s => s.AssembleWorkOrderCode)
                .FirstOrDefault();
            Base_NumberRule numberRule = _numberRuleRepository.FindAsIQueryable(x => x.FormCode == "AssembleWorkOrder")
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
    }
}
