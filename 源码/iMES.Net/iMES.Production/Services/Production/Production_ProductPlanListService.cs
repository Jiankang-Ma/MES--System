/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Production_ProductPlanListService与IProduction_ProductPlanListService中编写
 */
using iMES.Production.IRepositories;
using iMES.Production.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Services
{
    public partial class Production_ProductPlanListService : ServiceBase<Production_ProductPlanList, IProduction_ProductPlanListRepository>
    , IProduction_ProductPlanListService, IDependency
    {
    public Production_ProductPlanListService(IProduction_ProductPlanListRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IProduction_ProductPlanListService Instance
    {
      get { return AutofacContainerModule.GetService<IProduction_ProductPlanListService>(); } }
    }
 }
