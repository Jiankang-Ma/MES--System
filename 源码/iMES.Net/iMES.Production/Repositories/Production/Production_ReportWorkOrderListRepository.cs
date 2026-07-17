/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *Repository提供数据库操作，如果要增加数据库操作请在当前目录下Partial文件夹Production_ReportWorkOrderListRepository编写代码
 */
using iMES.Production.IRepositories;
using iMES.Core.BaseProvider;
using iMES.Core.EFDbContext;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Repositories
{
    public partial class Production_ReportWorkOrderListRepository : RepositoryBase<Production_ReportWorkOrderList> , IProduction_ReportWorkOrderListRepository
    {
    public Production_ReportWorkOrderListRepository(SysDbContext dbContext)
    : base(dbContext)
    {

    }
    public static IProduction_ReportWorkOrderListRepository Instance
    {
      get {  return AutofacContainerModule.GetService<IProduction_ReportWorkOrderListRepository>(); } }
    }
}
