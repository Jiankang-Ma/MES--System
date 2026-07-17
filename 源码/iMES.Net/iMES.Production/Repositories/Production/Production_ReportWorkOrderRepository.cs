/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *Repository提供数据库操作，如果要增加数据库操作请在当前目录下Partial文件夹Production_ReportWorkOrderRepository编写代码
 */
using iMES.Production.IRepositories;
using iMES.Core.BaseProvider;
using iMES.Core.EFDbContext;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Repositories
{
    public partial class Production_ReportWorkOrderRepository : RepositoryBase<Production_ReportWorkOrder> , IProduction_ReportWorkOrderRepository
    {
    public Production_ReportWorkOrderRepository(SysDbContext dbContext)
    : base(dbContext)
    {

    }
    public static IProduction_ReportWorkOrderRepository Instance
    {
      get {  return AutofacContainerModule.GetService<IProduction_ReportWorkOrderRepository>(); } }
    }
}
