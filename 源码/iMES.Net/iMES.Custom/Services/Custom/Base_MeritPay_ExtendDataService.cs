/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Base_MeritPay_ExtendDataService与IBase_MeritPay_ExtendDataService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Base_MeritPay_ExtendDataService : ServiceBase<Base_MeritPay_ExtendData, IBase_MeritPay_ExtendDataRepository>
    , IBase_MeritPay_ExtendDataService, IDependency
    {
    public Base_MeritPay_ExtendDataService(IBase_MeritPay_ExtendDataRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IBase_MeritPay_ExtendDataService Instance
    {
      get { return AutofacContainerModule.GetService<IBase_MeritPay_ExtendDataService>(); } }
    }
 }
