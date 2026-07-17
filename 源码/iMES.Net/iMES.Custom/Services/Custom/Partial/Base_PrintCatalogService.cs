/*
 *所有关于Base_PrintCatalog类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Base_PrintCatalogService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using iMES.Custom.IRepositories;
using System.Collections.Generic;

namespace iMES.Custom.Services
{
    public partial class Base_PrintCatalogService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBase_PrintCatalogRepository _repository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Base_PrintCatalogService(
            IBase_PrintCatalogRepository dbRepository,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }

        private WebResponseContent webResponse = new WebResponseContent();
        public override WebResponseContent Add(SaveModel saveDataModel)
        {
            // 在保存数据库前的操作，所有数据都验证通过了，这一步执行完就执行数据库保存
            AddOnExecuting = (Base_PrintCatalog catalog, object list) =>
            {
                if (repository.Exists(x => x.CatalogCode == catalog.CatalogCode))
                {
                    return webResponse.Error("分类编号已存在");
                }
                if (catalog.ParentId == null)
                {
                    catalog.LevelPath = 0;
                }
                else
                {
                    catalog.LevelPath = 1;
                }
                return webResponse.OK();
            };

            AddOnExecuted = (Base_PrintCatalog catalog, object list) =>
            {
                return webResponse.OK("");
            };
            return base.Add(saveDataModel);
        }

        public override WebResponseContent Update(SaveModel saveModel)
        {
            //编辑方法保存数据库前处理
            UpdateOnExecuting = (Base_PrintCatalog catalog, object addList, object updateList, List<object> delKeys) =>
            {
                if (repository.Exists(x => x.CatalogCode == catalog.CatalogCode && x.CatalogId != catalog.CatalogId))
                {
                    return webResponse.Error("分类编号已存在");
                }
                if (catalog.ParentId == null)
                {
                    catalog.LevelPath = 0;
                }
                else
                {
                    catalog.LevelPath = 1;
                }
                return webResponse.OK();
            };
            return base.Update(saveModel);
        }
    }
}
