/*
 *所有关于Production_ReportWorkOrder类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Production_ReportWorkOrderService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using System.Collections.Generic;
using System;
using iMESSystem = iMES.System.IRepositories;
using iMES.Custom.IRepositories;

namespace iMES.Production.Services
{
    public partial class Production_ReportWorkOrderService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProduction_ReportWorkOrderRepository _repository;//访问数据库
        private readonly iMESSystem.ISys_UserRepository _userRepository;
        private readonly IBase_ProcessRepository _processRepository;
        private readonly IProduction_WorkOrderRepository _workOrderRepository;
        private readonly IBase_MaterialDetailRepository _materialDetailRepository;

        [ActivatorUtilitiesConstructor]
        public Production_ReportWorkOrderService(
            IProduction_ReportWorkOrderRepository dbRepository,
            IHttpContextAccessor httpContextAccessor,
            iMESSystem.ISys_UserRepository userRepository,
            IBase_ProcessRepository processRepository,
            IProduction_WorkOrderRepository workOrderRepository,
            IBase_MaterialDetailRepository materialDetailRepository
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            _userRepository = userRepository;
            _processRepository = processRepository;
            _workOrderRepository = workOrderRepository;
            _materialDetailRepository = materialDetailRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        WebResponseContent webResponse = new WebResponseContent();

        // uni-app 报工页以 Date.now() 的 Unix 毫秒值提交 ReportTime；在通用实体校验前标准化为日期。
        private void NormalizeMobileReportTime(SaveModel saveDataModel)
        {
            if (saveDataModel?.MainData == null || !saveDataModel.MainData.TryGetValue("ReportTime", out object value) || value == null)
            {
                return;
            }
            if (long.TryParse(value.ToString(), out long epochMilliseconds)
                && epochMilliseconds >= 946684800000L
                && epochMilliseconds <= 4102444800000L)
            {
                saveDataModel.MainData["ReportTime"] = DateTimeOffset.FromUnixTimeMilliseconds(epochMilliseconds).LocalDateTime;
            }
        }

        private List<Base_MaterialDetail> GetProcessBom(Production_ReportWorkOrder reportWorkOrder)
        {
            return _materialDetailRepository.FindAsIQueryable(x =>
                    x.ParentProduct_Id == reportWorkOrder.Product_Id &&
                    x.Process_Id == reportWorkOrder.Process_Id)
                .ToList();
        }

        private decimal GetAvailableInventory(int productId)
        {
            var inbound = _repository.DbContext.Set<Ware_WareHouseBillList>()
                .Where(x => x.Product_Id == productId)
                .Select(x => (decimal?)x.InStoreQty)
                .Sum() ?? 0m;
            var outbound = _repository.DbContext.Set<Ware_OutWareHouseBillList>()
                .Where(x => x.Product_Id == productId)
                .Select(x => (decimal?)x.OutStoreQty)
                .Sum() ?? 0m;
            return inbound - outbound;
        }

        private WebResponseContent ValidateMaterialConsumption(Production_ReportWorkOrder reportWorkOrder)
        {
            if (reportWorkOrder.ApproveStatus != 2) return webResponse.OK();
            decimal reportQty = reportWorkOrder.ReportQty ?? 0;
            if (reportQty <= 0)
            {
                return webResponse.Error("报工数必须大于0");
            }
            var requiredMaterials = GetProcessBom(reportWorkOrder)
                .GroupBy(x => x.ChildProduct_Id)
                .Select(x => new
                {
                    ProductId = x.Key,
                    RequiredQty = x.Sum(y => y.QuantityPer) * reportQty
                })
                .ToList();
            foreach (var material in requiredMaterials)
            {
                var available = GetAvailableInventory(material.ProductId);
                if (available < material.RequiredQty)
                {
                    return webResponse.Error($"BOM物料库存不足，产品ID={material.ProductId}，当前库存{available:0.####}，需领用{material.RequiredQty:0.####}");
                }
            }
            return webResponse.OK();
        }

        private WebResponseContent CreateMaterialConsumption(Production_ReportWorkOrder reportWorkOrder)
        {
            // 当前报工页面默认审批状态为 2，表示直接确认生效；未确认记录不产生领料。
            if (reportWorkOrder.ApproveStatus != 2) return webResponse.OK();

            var bomRows = GetProcessBom(reportWorkOrder);
            if (bomRows.Count == 0) return webResponse.OK();

            string billCode = $"BOM-RWO-{reportWorkOrder.ReportWorkOrder_Id}";
            if (_repository.DbContext.Set<Ware_OutWareHouseBill>().Any(x => x.OutWareHouseBillCode == billCode))
            {
                return webResponse.Error("该报工已生成BOM领料单，不能重复扣料");
            }
            var materialIds = bomRows.Select(x => x.ChildProduct_Id).Distinct().ToList();
            var products = _repository.DbContext.Set<Base_Product>()
                .Where(x => materialIds.Contains(x.Product_Id))
                .ToDictionary(x => x.Product_Id);
            if (products.Count != materialIds.Count)
            {
                return webResponse.Error("BOM存在未定义的子项产品");
            }
            var bill = new Ware_OutWareHouseBill
            {
                OutWareHouseBillCode = billCode,
                OutWareHouseBillType = "production-consume",
                OutWareHouseDate = reportWorkOrder.ReportTime ?? DateTime.Now,
                AuditStatus = 2,
                Remark = $"报工{reportWorkOrder.ReportWorkOrder_Id}自动扣料",
                CreateDate = DateTime.Now,
                CreateID = reportWorkOrder.CreateID,
                Creator = reportWorkOrder.Creator
            };
            _repository.DbContext.Set<Ware_OutWareHouseBill>().Add(bill);
            _repository.DbContext.SaveChanges();

            var details = bomRows
                .GroupBy(x => x.ChildProduct_Id)
                .Select(x =>
                {
                    var product = products[x.Key];
                    return new Ware_OutWareHouseBillList
                    {
                        OutWareHouseBill_Id = bill.OutWareHouseBill_Id,
                        Product_Id = product.Product_Id,
                        ProductCode = product.ProductCode,
                        ProductName = product.ProductName,
                        ProductStandard = product.ProductStandard,
                        Unit_Id = product.Unit_Id,
                        MaxInventory = product.MaxInventory,
                        MinInventory = product.MinInventory,
                        SafeInventory = product.SafeInventory,
                        InventoryQty = GetAvailableInventory(product.Product_Id),
                        OutStoreQty = x.Sum(y => y.QuantityPer) * (reportWorkOrder.ReportQty ?? 0),
                        CreateDate = DateTime.Now,
                        CreateID = reportWorkOrder.CreateID,
                        Creator = reportWorkOrder.Creator
                    };
                })
                .ToList();
            _repository.DbContext.Set<Ware_OutWareHouseBillList>().AddRange(details);
            _repository.DbContext.SaveChanges();
            return webResponse.OK();
        }

        private int? GetFinalProcessId(int productId)
        {
            var processLineId = _repository.DbContext.Set<Base_Product>()
                .Where(x => x.Product_Id == productId)
                .Select(x => x.Process_Id)
                .FirstOrDefault();
            if (!processLineId.HasValue)
            {
                return null;
            }
            return _repository.DbContext.Set<Base_ProcessLineList>()
                .Where(x => x.ProcessLine_Id == processLineId.Value
                    && x.ProcessLineType == "process"
                    && x.Process_Id.HasValue)
                .OrderByDescending(x => x.Sequence)
                .ThenByDescending(x => x.ProcessLineList_Id)
                .Select(x => x.Process_Id)
                .FirstOrDefault();
        }

        private WebResponseContent CreateProductionOutput(Production_ReportWorkOrder reportWorkOrder)
        {
            // 只有确认生效的末工序报工才产出成品。中间工序继续使用同一产品时，
            // 不得重复计入成品库存；当前数据模型也没有“工序 -> 半成品产品”的映射字段。
            if (reportWorkOrder.ApproveStatus != 2 || GetFinalProcessId(reportWorkOrder.Product_Id) != reportWorkOrder.Process_Id)
            {
                return webResponse.OK();
            }

            var product = _repository.DbContext.Set<Base_Product>()
                .FirstOrDefault(x => x.Product_Id == reportWorkOrder.Product_Id);
            if (product == null)
            {
                return webResponse.Error("报工产品不存在，不能自动产出");
            }

            int reportQty = reportWorkOrder.ReportQty ?? 0;
            int goodQty = reportWorkOrder.GoodQty ?? (reportQty - (reportWorkOrder.NoGoodQty ?? 0));
            if (goodQty < 0 || goodQty > reportQty)
            {
                return webResponse.Error("良品数必须大于等于0且不得大于报工数");
            }
            // 纯不良报工不生成零数量入库单，也不会进入正常成品库存。
            if (goodQty == 0)
            {
                return webResponse.OK();
            }

            string billCode = $"OUTPUT-RWO-{reportWorkOrder.ReportWorkOrder_Id}";
            if (_repository.DbContext.Set<Ware_WareHouseBill>().Any(x => x.WareHouseBillCode == billCode))
            {
                return webResponse.Error("该报工已生成自动产出入库单，不能重复产出");
            }

            var bill = new Ware_WareHouseBill
            {
                WareHouseBillCode = billCode,
                WareHouseBillType = "production-output",
                WareHouseDate = reportWorkOrder.ReportTime ?? DateTime.Now,
                Remark = $"报工{reportWorkOrder.ReportWorkOrder_Id}（工单{reportWorkOrder.WorkOrder_Id}、工序{reportWorkOrder.Process_Id}）自动产出",
                CreateDate = DateTime.Now,
                CreateID = reportWorkOrder.CreateID,
                Creator = reportWorkOrder.Creator
            };
            _repository.DbContext.Set<Ware_WareHouseBill>().Add(bill);
            _repository.DbContext.SaveChanges();
            _repository.DbContext.Set<Ware_WareHouseBillList>().Add(new Ware_WareHouseBillList
            {
                WareHouseBill_Id = bill.WareHouseBill_Id,
                Product_Id = product.Product_Id,
                ProductCode = product.ProductCode,
                ProductName = product.ProductName,
                ProductStandard = product.ProductStandard,
                Unit_Id = product.Unit_Id,
                MaxInventory = product.MaxInventory,
                MinInventory = product.MinInventory,
                SafeInventory = product.SafeInventory,
                InventoryQty = GetAvailableInventory(product.Product_Id),
                InStoreQty = goodQty,
                CreateDate = DateTime.Now,
                CreateID = reportWorkOrder.CreateID,
                Creator = reportWorkOrder.Creator
            });
            _repository.DbContext.SaveChanges();
            return webResponse.OK();
        }
        //查询
        public override PageGridData<Production_ReportWorkOrder> GetPageData(PageDataOptions options)
        {
            //查询完成后，在返回页面前可对查询的数据进行操作
            GetPageDataOnExecuted = (PageGridData<Production_ReportWorkOrder> grid) =>
            {
                //可对查询的结果的数据操作
                List<Production_ReportWorkOrder> list = grid.rows;
                for (int i = 0; i < list.Count; i++)
                {
                    var userTrueName = _userRepository.FindAsIQueryable(x => x.User_Id == list[i].ProductUser.GetInt())
                            .OrderByDescending(x => x.CreateDate)
                            .Select(s => s.UserTrueName)
                            .FirstOrDefault();
                    var processName = _processRepository.FindAsIQueryable(x => x.Process_Id == list[i].Process_Id.GetInt())
                           .OrderByDescending(x => x.CreateDate)
                           .Select(s => s.ProcessName)
                           .FirstOrDefault();
                    var workOrderCode = _workOrderRepository.FindAsIQueryable(x => x.WorkOrder_Id == list[i].WorkOrder_Id.GetInt())
                         .OrderByDescending(x => x.CreateDate)
                         .Select(s => s.WorkOrderCode)
                         .FirstOrDefault();
                    list[i].ProductUserName = userTrueName?.ToString() ?? "";
                    list[i].ProcessName = processName?.ToString() ?? "";
                    list[i].WorkOrderCode = workOrderCode?.ToString() ?? "";
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
            NormalizeMobileReportTime(saveDataModel);
            //此处saveModel是从前台提交的原生数据，可对数据进修改过滤
            AddOnExecuting = (Production_ReportWorkOrder reportWorkOrder, object list) =>
            {
                List<Production_ReportWorkOrderList> reportLists = list as List<Production_ReportWorkOrderList>;
                if (reportWorkOrder.NoGoodQty != null  &&  reportWorkOrder.NoGoodQty != 0 && reportLists== null)
                {
                    return webResponse.Error("有不良品请填写不良品项");
                }
                return ValidateMaterialConsumption(reportWorkOrder);
            };
            AddOnExecuted = (Production_ReportWorkOrder reportWorkOrder, object list) =>
            {
                var consumption = CreateMaterialConsumption(reportWorkOrder);
                return consumption.Status ? CreateProductionOutput(reportWorkOrder) : consumption;
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
            //编辑方法保存数据库前处理
            UpdateOnExecuting = (Production_ReportWorkOrder reportWorkOrder, object addList, object updateList, List<object> delKeys) =>
            {
                List<Production_ReportWorkOrderList> addListS = addList as List<Production_ReportWorkOrderList>;
                List<Production_ReportWorkOrderList> updateLists = updateList as List<Production_ReportWorkOrderList>;
                if (reportWorkOrder.NoGoodQty != null && reportWorkOrder.NoGoodQty != 0 && (addListS.Count == 0 && updateLists == null))
                {
                    return webResponse.Error("有不良品请填写不良品项");
                };
                return webResponse.OK();
            };
            return base.Update(saveModel);
        }
    }
}
