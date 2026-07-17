/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *Repository提供数据库操作，如果要增加数据库操作请在当前目录下Partial文件夹Production_ProductPlanRepository编写代码
 */
using iMES.Production.IRepositories;
using iMES.Core.BaseProvider;
using iMES.Core.EFDbContext;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Repositories
{
    public partial class Production_ProductPlanRepository : RepositoryBase<Production_ProductPlan> , IProduction_ProductPlanRepository
    {
    public Production_ProductPlanRepository(SysDbContext dbContext)
    : base(dbContext)
    {

    }
    public static IProduction_ProductPlanRepository Instance
    {
      get {  return AutofacContainerModule.GetService<IProduction_ProductPlanRepository>(); } }
    }
}
