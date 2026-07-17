/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Base_DefectItem_ExtendDataService与IBase_DefectItem_ExtendDataService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Base_DefectItem_ExtendDataService : ServiceBase<Base_DefectItem_ExtendData, IBase_DefectItem_ExtendDataRepository>
    , IBase_DefectItem_ExtendDataService, IDependency
    {
    public Base_DefectItem_ExtendDataService(IBase_DefectItem_ExtendDataRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IBase_DefectItem_ExtendDataService Instance
    {
      get { return AutofacContainerModule.GetService<IBase_DefectItem_ExtendDataService>(); } }
    }
 }
