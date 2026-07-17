/*
 *所有关于Base_PrintTemplate类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Base_PrintTemplateService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using System;

namespace iMES.Custom.Services
{
    public partial class Base_PrintTemplateService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBase_PrintTemplateRepository _repository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Base_PrintTemplateService(
            IBase_PrintTemplateRepository dbRepository,
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
            AddOnExecuting = (Base_PrintTemplate printTemplate, object list) =>
            {
                if (printTemplate.StatusFlag == 1)
                {
                    var listTemplate = _repository.FindAsIQueryable(x => x.StatusFlag == 1)
                       .ToList();
                    for (int i = 0; i < listTemplate.Count; i++)
                    {
                        listTemplate[i].StatusFlag = 0;
                    }
                    _repository.UpdateRange(listTemplate, true);
                }
                return webResponse.OK();
            };
            return base.Add(saveDataModel);
        }

        public override WebResponseContent Update(SaveModel saveModel)
        {
            //编辑方法保存数据库前处理
            AddOnExecuting = (Base_PrintTemplate printTemplate, object list) =>
            {
                if (printTemplate.StatusFlag == 1)
                {
                    var listTemplate = _repository.FindAsIQueryable(x => x.StatusFlag == 1)
                       .ToList();
                    for (int i = 0; i < listTemplate.Count; i++)
                    {
                        listTemplate[i].StatusFlag = 0;
                    }
                    _repository.UpdateRange(listTemplate, true);
                }
                return webResponse.OK();
            };
            return base.Update(saveModel);
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="keys">删除的行的主键</param>
        /// <param name="delList">删除时是否将明细也删除</param>
        /// <returns></returns>
        public override WebResponseContent Del(object[] keys, bool delList = true)
        {
            //删除前处理
            //删除的行的主键
            DelOnExecuting = (object[] _keys) =>
            {
                for (int i = 0; i < _keys.Length; i++)
                {
                    Guid id = new Guid((string)_keys[i]);
                    if (repository.Exists(x => x.PrintTemplateId == id && x.isDefault == 1))
                    {
                        return webResponse.Error("系统内置模版不允许删除");
                    }
                }
                return webResponse.OK();
            };
            return base.Del(keys, delList);
        }
    }
}
