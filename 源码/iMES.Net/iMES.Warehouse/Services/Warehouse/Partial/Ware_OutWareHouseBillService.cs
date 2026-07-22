/*
 *所有关于Ware_OutWareHouseBill类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Ware_OutWareHouseBillService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using iMES.Warehouse.IRepositories;
using System;
using iMES.Custom.IRepositories;
using iMES.Warehouse.Repositories;
using System.Collections.Generic;
using iMES.Core.Enums;
using iMES.Custom.Services;

namespace iMES.Warehouse.Services
{
    public partial class Ware_OutWareHouseBillService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWare_OutWareHouseBillRepository _repository;//访问数据库
        private readonly IBase_NumberRuleRepository _numberRuleRepository;//自定义编码规则访问数据库

        [ActivatorUtilitiesConstructor]
        public Ware_OutWareHouseBillService(
            IWare_OutWareHouseBillRepository dbRepository,
           IBase_NumberRuleRepository numberRuleRepository,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _numberRuleRepository = numberRuleRepository;
            _repository = dbRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        WebResponseContent webResponse = new WebResponseContent();
        /// <summary>
        /// 新建
        /// </summary>
        /// <param name="saveDataModel"></param>
        /// <returns></returns>
        public override WebResponseContent Add(SaveModel saveDataModel)
        {
            //此处saveModel是从前台提交的原生数据，可对数据进修改过滤
            AddOnExecuting = (Ware_OutWareHouseBill outWareHouseBill, object list) =>
            {
                if (string.IsNullOrWhiteSpace(outWareHouseBill.OutWareHouseBillCode))
                    outWareHouseBill.OutWareHouseBillCode = GetOutWareHouseBillCode();
                //如果返回false,后面代码不会再执行
                if (repository.Exists(x => x.OutWareHouseBillCode == outWareHouseBill.OutWareHouseBillCode))
                {
                    return webResponse.Error("出库单编号已存在");
                }
                var details = list as List<Ware_OutWareHouseBillList>;
                if (details == null || details.Count == 0)
                {
                    return webResponse.Error("出库单至少需要一条产品明细");
                }
                var inventory = Base_ProductService.GetStoreNumber();
                foreach (var group in details.GroupBy(x => x.Product_Id))
                {
                    var available = inventory.FirstOrDefault(x => x.Product_Id == group.Key)?.InventoryQty ?? 0;
                    var requested = group.Sum(x => x.OutStoreQty);
                    if (requested <= 0)
                    {
                        return webResponse.Error("出库数量必须大于0");
                    }
                    if (requested > available)
                    {
                        return webResponse.Error($"产品库存不足，当前库存{available}，申请出库{requested}");
                    }
                }
                return webResponse.OK();
            };
            return base.Add(saveDataModel);
        }
        public override object GetDetailPage(PageDataOptions pageData) 
        {
            var query = Ware_OutWareHouseBillListRepository.Instance.IQueryablePage<Ware_OutWareHouseBillList>(
                 pageData.Page,
                 pageData.Rows,
                 out int count,
                 x => x.OutWareHouseBill_Id == pageData.Value.GetInt(),
                  orderBy: x => new Dictionary<object, QueryOrderBy>() { { x.CreateDate, QueryOrderBy.Desc } }
                );
            PageGridData<Ware_OutWareHouseBillList> detailGrid = new PageGridData<Ware_OutWareHouseBillList>();
            detailGrid.rows = query.ToList();
            detailGrid.total = count;
            //获取当前库存数量
            List<Base_Product> storeList = Base_ProductService.GetStoreNumber();
            for (int i = 0; i < detailGrid.rows.Count; i++)
            {
                if (storeList.Exists(x => x.Product_Id == detailGrid.rows[i].Product_Id))
                {
                    detailGrid.rows[i].InventoryQty = storeList.Find(x => x.Product_Id == detailGrid.rows[i].Product_Id).InventoryQty;
                }
                else
                {
                    detailGrid.rows[i].InventoryQty = 0;
                }
            }
            return detailGrid;
        }
        public string GetOutWareHouseBillCode()
        {
            DateTime dateNow = (DateTime)DateTime.Now.ToString("yyyy-MM-dd").GetDateTime();
            return WarehouseCodeGenerator.GenerateBillCode(
                () => repository.FindAsIQueryable(x => x.CreateDate > dateNow)
                    .OrderByDescending(x => x.OutWareHouseBillCode)
                    .Select(s => s.OutWareHouseBillCode)
                    .FirstOrDefault(),
                _numberRuleRepository,
                "OutStoreForm"
            );
        }
    }
}
