/*
 *所有关于Sys_Table_Extend类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Sys_Table_ExtendService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using System.Threading.Tasks;
using System.Collections.Generic;

namespace iMES.Custom.Services
{
    public partial class Sys_Table_ExtendService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISys_Table_ExtendRepository _repository;//访问数据库

        [ActivatorUtilitiesConstructor]
        public Sys_Table_ExtendService(
            ISys_Table_ExtendRepository dbRepository,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }

        WebResponseContent webResponse = new WebResponseContent();
        public override PageGridData<Sys_Table_Extend> GetPageData(PageDataOptions options)
        {
            QueryRelativeExpression = (IQueryable<Sys_Table_Extend> queryable) =>
              {
                  if (options.Value != null)
                  {
                      switch (options.Value.GetInt())
                      {
                          case 1:
                              queryable = queryable.Where(c => c.TableName == "Sys_User");
                              break;
                          case 2:
                              queryable = queryable.Where(c => c.TableName == "Base_Product");
                              break;
                          case 3:
                              queryable = queryable.Where(c => c.TableName == "Base_Process");
                              break;
                          case 4:
                              queryable = queryable.Where(c => c.TableName == "Base_MeritPay");
                              break;
                          case 5:
                              queryable = queryable.Where(c => c.TableName == "Base_DefectItem");
                              break;
                          default:
                              break;
                      }
                  };
                  return queryable;
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
            AddOnExecuting = (Sys_Table_Extend sysTableExtend, object list) =>
            {
                sysTableExtend.FieldCode = "EXT_" + ChnToPh.convertCh(sysTableExtend.FieldName);
                //如果返回false,后面代码不会再执行
                if (repository.Exists(x => x.TableName == sysTableExtend.TableName && x.FieldCode == sysTableExtend.FieldCode))
                {
                    return webResponse.Error("字段编号已存在");
                }
                return webResponse.OK();
            };
            return base.Add(saveDataModel);
        }
        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="saveDataModel"></param>
        /// <returns></returns>
        public override WebResponseContent Update(SaveModel saveDataModel)
        {
            //编辑方法保存数据库前处理
            UpdateOnExecuting = (Sys_Table_Extend sysTableExtend, object addList, object updateList, List<object> delKeys) =>
            {
                if (repository.Exists(x => x.TableName == sysTableExtend.TableName && x.FieldCode == sysTableExtend.FieldCode && x.TableEx_Id != sysTableExtend.TableEx_Id))
                {
                    return webResponse.Error("字段编号已存在");
                }
                return webResponse.OK();
            };
            return base.Update(saveDataModel);
        }

        /// <summary>
        /// 获取表扩展字段
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public async Task<object> GetTableExtendFieldList(string tableName)
        {
            return (await repository.FindAsync(x => x.TableName == tableName, a =>
              new
              {
                  TableEx_Id = a.TableEx_Id,
                  FieldName = a.FieldName,
                  FieldType = a.FieldType,
                  AllowScan = a.AllowScan,
                  AllowEditScanResult = a.AllowEditScanResult,
                  HiddenCondition = a.HiddenCondition,
                  FieldAttr = a.FieldAttr,
                  FieldCode = a.FieldCode,
                  GuideWords  = a.GuideWords,
                  InstructionsExplain = a.InstructionsExplain,
                  DisplayPrecision =  a.DisplayPrecision,
                  BusinessObject = a.BusinessObject,
                  ViewField = a.ViewField,
                  DataFillRule = a.DataFillRule,
                  DataDic = a.DataDic,
                  AssoObject = a.AssoObject,
                  AssoField = a.AssoField
              })).OrderByDescending(a => a.TableEx_Id)
                 .ThenByDescending(q => q.FieldName).ToList();
        }
    }
}
