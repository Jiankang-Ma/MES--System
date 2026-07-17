/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Base_Process_ExtendDataService与IBase_Process_ExtendDataService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Base_Process_ExtendDataService : ServiceBase<Base_Process_ExtendData, IBase_Process_ExtendDataRepository>
    , IBase_Process_ExtendDataService, IDependency
    {
    public Base_Process_ExtendDataService(IBase_Process_ExtendDataRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IBase_Process_ExtendDataService Instance
    {
      get { return AutofacContainerModule.GetService<IBase_Process_ExtendDataService>(); } }
    }
 }
