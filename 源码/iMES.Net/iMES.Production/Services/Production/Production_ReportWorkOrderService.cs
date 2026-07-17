/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Production_ReportWorkOrderService与IProduction_ReportWorkOrderService中编写
 */
using iMES.Production.IRepositories;
using iMES.Production.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Production.Services
{
    public partial class Production_ReportWorkOrderService : ServiceBase<Production_ReportWorkOrder, IProduction_ReportWorkOrderRepository>
    , IProduction_ReportWorkOrderService, IDependency
    {
    public Production_ReportWorkOrderService(IProduction_ReportWorkOrderRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static IProduction_ReportWorkOrderService Instance
    {
      get { return AutofacContainerModule.GetService<IProduction_ReportWorkOrderService>(); } }
    }
 }
