/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Base_Product_ExtendDataService与IBase_Product_ExtendDataService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Base_Product_ExtendDataService : ServiceBase<Base_Product_ExtendData, IBase_Product_ExtendDataRepository>
    , IBase_Product_ExtendDataService, IDependency
    {
    public Base_Product_ExtendDataService(IBase_Product_ExtendDataRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IBase_Product_ExtendDataService Instance
    {
      get { return AutofacContainerModule.GetService<IBase_Product_ExtendDataService>(); } }
    }
 }
