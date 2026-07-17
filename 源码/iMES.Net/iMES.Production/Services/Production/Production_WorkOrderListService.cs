/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Production_WorkOrderListService与IProduction_WorkOrderListService中编写
 */
using iMES.Production.IRepositories;
using iMES.Production.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Services
{
    public partial class Production_WorkOrderListService : ServiceBase<Production_WorkOrderList, IProduction_WorkOrderListRepository>
    , IProduction_WorkOrderListService, IDependency
    {
    public Production_WorkOrderListService(IProduction_WorkOrderListRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IProduction_WorkOrderListService Instance
    {
      get { return AutofacContainerModule.GetService<IProduction_WorkOrderListService>(); } }
    }
 }
