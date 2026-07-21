using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using iMES.Custom.IRepositories;
using iMES.Custom.IServices;
using iMES.Custom.Services;
using iMES.Entity.DomainModels;

namespace iMES.Custom.Tests
{
    internal static class ServiceFactory
    {
        public static Base_ProductService Product(
            out RepositoryProxy<Base_Product_ExtendData> extendData,
            IEnumerable<Base_Product> products = null,
            IEnumerable<Base_NumberRule> rules = null,
            IEnumerable<Sys_Table_Extend> fields = null)
        {
            var productRepository = TestProxy.Repository<Base_Product, IBase_ProductRepository>(products ?? new Base_Product[0], out _);
            var ruleRepository = TestProxy.Repository<Base_NumberRule, IBase_NumberRuleRepository>(rules ?? new Base_NumberRule[0], out _);
            var fieldRepository = TestProxy.Repository<Sys_Table_Extend, ISys_Table_ExtendRepository>(fields ?? new Sys_Table_Extend[0], out _);
            var extendRepository = TestProxy.Repository<Base_Product_ExtendData, IBase_Product_ExtendDataRepository>(new Base_Product_ExtendData[0], out extendData);
            return new Base_ProductService(
                productRepository,
                fieldRepository,
                extendRepository,
                TestProxy.Empty<IBase_Product_ExtendDataService>(),
                ruleRepository,
                new HttpContextAccessor());
        }

        public static Base_ProductService Product(
            IEnumerable<Base_Product> products = null,
            IEnumerable<Base_NumberRule> rules = null)
        {
            return Product(out _, products, rules);
        }

        public static Base_ProcessService Process(
            out RepositoryProxy<Base_Process_ExtendData> extendData,
            IEnumerable<Base_Process> processes = null,
            IEnumerable<Base_NumberRule> rules = null,
            IEnumerable<Sys_Table_Extend> fields = null)
        {
            var processRepository = TestProxy.Repository<Base_Process, IBase_ProcessRepository>(processes ?? new Base_Process[0], out _);
            var ruleRepository = TestProxy.Repository<Base_NumberRule, IBase_NumberRuleRepository>(rules ?? new Base_NumberRule[0], out _);
            var fieldRepository = TestProxy.Repository<Sys_Table_Extend, ISys_Table_ExtendRepository>(fields ?? new Sys_Table_Extend[0], out _);
            var extendRepository = TestProxy.Repository<Base_Process_ExtendData, IBase_Process_ExtendDataRepository>(new Base_Process_ExtendData[0], out extendData);
            return new Base_ProcessService(
                processRepository,
                ruleRepository,
                fieldRepository,
                extendRepository,
                TestProxy.Empty<IBase_Process_ExtendDataService>(),
                new HttpContextAccessor());
        }

        public static Base_ProcessService Process(
            IEnumerable<Base_Process> processes = null,
            IEnumerable<Base_NumberRule> rules = null)
        {
            return Process(out _, processes, rules);
        }

        public static Base_DefectItemService Defect(
            out RepositoryProxy<Base_DefectItem_ExtendData> extendData,
            IEnumerable<Base_DefectItem> defects = null,
            IEnumerable<Base_NumberRule> rules = null,
            IEnumerable<Sys_Table_Extend> fields = null)
        {
            var defectRepository = TestProxy.Repository<Base_DefectItem, IBase_DefectItemRepository>(defects ?? new Base_DefectItem[0], out _);
            var ruleRepository = TestProxy.Repository<Base_NumberRule, IBase_NumberRuleRepository>(rules ?? new Base_NumberRule[0], out _);
            var fieldRepository = TestProxy.Repository<Sys_Table_Extend, ISys_Table_ExtendRepository>(fields ?? new Sys_Table_Extend[0], out _);
            var extendRepository = TestProxy.Repository<Base_DefectItem_ExtendData, IBase_DefectItem_ExtendDataRepository>(new Base_DefectItem_ExtendData[0], out extendData);
            return new Base_DefectItemService(
                defectRepository,
                ruleRepository,
                fieldRepository,
                extendRepository,
                TestProxy.Empty<IBase_DefectItem_ExtendDataService>(),
                new HttpContextAccessor());
        }

        public static Base_DefectItemService Defect(
            IEnumerable<Base_DefectItem> defects = null,
            IEnumerable<Base_NumberRule> rules = null)
        {
            return Defect(out _, defects, rules);
        }

        public static Base_ProcessLineService ProcessLine(
            IEnumerable<Base_ProcessLine> lines = null,
            IEnumerable<Base_NumberRule> rules = null)
        {
            var lineRepository = TestProxy.Repository<Base_ProcessLine, IBase_ProcessLineRepository>(lines ?? new Base_ProcessLine[0], out _);
            var ruleRepository = TestProxy.Repository<Base_NumberRule, IBase_NumberRuleRepository>(rules ?? new Base_NumberRule[0], out _);
            return new Base_ProcessLineService(lineRepository, ruleRepository, new HttpContextAccessor());
        }
    }
}
