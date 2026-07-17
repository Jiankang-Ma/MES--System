/*
 *Author：COCO
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下Sys_User_ExtendDataService与ISys_User_ExtendDataService中编写
 */
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Core.BaseProvider;
using iMES.Core.Extensions.AutofacManager;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Services
{
    public partial class Sys_User_ExtendDataService : ServiceBase<Sys_User_ExtendData, ISys_User_ExtendDataRepository>
    , ISys_User_ExtendDataService, IDependency
    {
    public Sys_User_ExtendDataService(ISys_User_ExtendDataRepository repository)
    : base(repository)
    {
    Init(repository);
    }
    public static ISys_User_ExtendDataService Instance
    {
      get { return AutofacContainerModule.GetService<ISys_User_ExtendDataService>(); } }
    }
 }
