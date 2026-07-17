/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Sys_Table_ExtendService与ISys_Table_ExtendService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Sys_Table_ExtendService : ServiceBase<Sys_Table_Extend, ISys_Table_ExtendRepository>
    , ISys_Table_ExtendService, IDependency
    {
    public Sys_Table_ExtendService(ISys_Table_ExtendRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static ISys_Table_ExtendService Instance
    {
      get { return AutofacContainerModule.GetService<ISys_Table_ExtendService>(); } }
    }
 }
