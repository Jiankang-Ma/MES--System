/*
 *所有关于Base_MeritPay_ExtendData类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Base_MeritPay_ExtendDataService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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

namespace iMES.Custom.Services
{
    public partial class Base_MeritPay_ExtendDataService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBase_MeritPay_ExtendDataRepository _repository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Base_MeritPay_ExtendDataService(
            IBase_MeritPay_ExtendDataRepository dbRepository,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        /// <summary>
        /// 获取表扩展字段
        /// </summary>
        /// <param name="meritPayId">绩效工资ID</param>
        /// <returns></returns>
        public object GetExtendDataByMeritPayID(int meritPayId)
        {
            return (repository.Find(x => x.MeritPay_Id == meritPayId, a =>
              new
              {
                  MeritPayExData_Id = a.MeritPayExData_Id,
                  MeritPay_Id = a.MeritPay_Id,
                  TableEx_Id = a.TableEx_Id,
                  FieldCode = a.FieldCode,
                  FieldName = a.FieldName,
                  FieldValue = a.FieldValue

              })).OrderByDescending(a => a.MeritPayExData_Id)
                 .ThenByDescending(q => q.TableEx_Id).ToList();
        }
    }
}
