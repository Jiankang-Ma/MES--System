/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Production_ProductPlanService与IProduction_ProductPlanService中编写
 */
using iMES.Production.IRepositories;
using iMES.Production.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Services
{
    public partial class Production_ProductPlanService : ServiceBase<Production_ProductPlan, IProduction_ProductPlanRepository>
    , IProduction_ProductPlanService, IDependency
    {
    public Production_ProductPlanService(IProduction_ProductPlanRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IProduction_ProductPlanService Instance
    {
      get { return AutofacContainerModule.GetService<IProduction_ProductPlanService>(); } }
    }
 }
