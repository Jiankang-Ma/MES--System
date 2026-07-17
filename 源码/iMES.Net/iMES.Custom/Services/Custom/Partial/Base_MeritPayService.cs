/*
 *所有关于Base_MeritPay类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Base_MeritPayService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
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
using iMES.Custom.IServices;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace iMES.Custom.Services
{
    public partial class Base_MeritPayService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBase_MeritPayRepository _repository;//访问数据库
        private readonly ISys_Table_ExtendRepository _sysTableExtendRepository;//扩展字段访问数据库
        private readonly IBase_MeritPay_ExtendDataRepository _baseMeritPayExtendDataRepository;//扩展字段访问数据库
        private readonly IBase_MeritPay_ExtendDataService _baseMeritPayExtendDataService;//访问业务代码

        [ActivatorUtilitiesConstructor]
        public Base_MeritPayService(
            IBase_MeritPayRepository dbRepository,
            ISys_Table_ExtendRepository sysTableExtendRepository,
            IBase_MeritPay_ExtendDataRepository baseMeritPayExtendDataRepository,
            IBase_MeritPay_ExtendDataService baseMeritPayExtendDataService,
            IHttpContextAccessor httpContextAccessor
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _sysTableExtendRepository = sysTableExtendRepository;
            _baseMeritPayExtendDataRepository = baseMeritPayExtendDataRepository;
            _baseMeritPayExtendDataService = baseMeritPayExtendDataService;
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
            //扩展字段开始 start
            AddOnExecuted = (Base_MeritPay meritPay, object list) =>
            {
                var extra = saveDataModel.Extra.ToString();
                JObject jo = (JObject)JsonConvert.DeserializeObject(extra);
                int meritPay_Id = meritPay.MeritPay_Id.GetInt();
                var extend = _sysTableExtendRepository.Find(x => x.TableName == "Base_MeritPay", a => new
                {
                    TableEx_Id = a.TableEx_Id,
                    FieldName = a.FieldName,
                    FieldCode = a.FieldCode,
                    FieldType = a.FieldType
                }).ToList();

                List<Base_MeritPay_ExtendData> listData = new List<Base_MeritPay_ExtendData>();
                for (int i = 0; i < extend.Count; i++)
                {
                    Base_MeritPay_ExtendData extendData = new Base_MeritPay_ExtendData();
                    extendData.MeritPay_Id = meritPay_Id;
                    extendData.TableEx_Id = extend[i].TableEx_Id;
                    extendData.FieldValue = jo[extend[i].FieldCode].ToString();
                    extendData.FieldName = extend[i].FieldName;
                    extendData.FieldCode = extend[i].FieldCode;
                    extendData.CreateDate = meritPay.CreateDate;
                    extendData.CreateID = meritPay.CreateID;
                    extendData.Creator = meritPay.Creator;
                    listData.Add(extendData);
                }
                _baseMeritPayExtendDataRepository.AddRange(listData, true);
                return webResponse.OK();
            };
            //扩展字段开始 end
            return base.Add(saveDataModel);
        }
        /// <summary>
        /// 删除产品
        /// </summary>
        /// <param name="keys"></param>
        /// <param name="delList"></param>
        /// <returns></returns>
        public override WebResponseContent Del(object[] keys, bool delList = false)
        {
            base.DelOnExecuted = (object[] meritPayIds) =>
            {
                for (int i = 0; i < meritPayIds.Length; i++)
                {
                    var processExtend = _baseMeritPayExtendDataRepository.Find(x => x.MeritPay_Id == meritPayIds[i].GetInt(), a => new
                    {
                        MeritPayExData_Id = a.MeritPayExData_Id,
                        MeritPay_Id = a.MeritPay_Id,
                        TableEx_Id = a.TableEx_Id
                    }).ToList();
                    object[] keys = new object[processExtend.Count];
                    for (int j = 0; j < processExtend.Count; j++)
                    {
                        keys[j] = processExtend[j].MeritPayExData_Id.GetInt();
                    }
                    _baseMeritPayExtendDataRepository.DeleteWithKeys(keys, false);
                };
                return new WebResponseContent() { Status = true };
            };
            return base.Del(keys, delList);
        }
        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="saveDataModel"></param>
        /// <returns></returns>
        public override WebResponseContent Update(SaveModel saveDataModel)
        {
            base.UpdateOnExecuted = (Base_MeritPay meritPay, object obj1, object obj2, List<object> List) =>
            {
                var extra = saveDataModel.Extra.ToString();
                JObject jo = (JObject)JsonConvert.DeserializeObject(extra);
                int meritPay_Id = meritPay.MeritPay_Id.GetInt();
                var meritPayExtend = _sysTableExtendRepository.Find(x => x.TableName == "Base_MeritPay", a => new
                {
                    TableEx_Id = a.TableEx_Id,
                    FieldName = a.FieldName,
                    FieldCode = a.FieldCode,
                    FieldType = a.FieldType
                }).ToList();
                for (int i = 0; i < meritPayExtend.Count; i++)
                {
                    Base_MeritPay_ExtendData meritPayExtendData = _baseMeritPayExtendDataRepository.FindAsIQueryable(x => x.MeritPay_Id == meritPay_Id && x.TableEx_Id == meritPayExtend[i].TableEx_Id)
                   .FirstOrDefault();
                    if (meritPayExtendData == null)
                    {
                        Base_MeritPay_ExtendData extendData = new Base_MeritPay_ExtendData();
                        extendData.MeritPay_Id = meritPay_Id;
                        extendData.TableEx_Id = meritPayExtend[i].TableEx_Id;
                        extendData.FieldValue = jo[meritPayExtend[i].FieldCode].ToString();
                        extendData.FieldName = meritPayExtend[i].FieldName;
                        extendData.FieldCode = meritPayExtend[i].FieldCode;
                        extendData.CreateDate = meritPay.ModifyDate;
                        extendData.CreateID = meritPay.ModifyID;
                        extendData.Creator = meritPay.Modifier;
                        _baseMeritPayExtendDataRepository.Add(extendData, true);
                    }
                    else
                    {
                        meritPayExtendData.ModifyDate = meritPay.ModifyDate;
                        meritPayExtendData.ModifyID = meritPay.ModifyID;
                        meritPayExtendData.Modifier = meritPay.Modifier;
                        meritPayExtendData.FieldValue = jo[meritPayExtend[i].FieldCode].ToString();
                        _baseMeritPayExtendDataRepository.Update(meritPayExtendData, true);
                    };
                }
                return new WebResponseContent(true);
            };
            return base.Update(saveDataModel);
        }
    }
}
