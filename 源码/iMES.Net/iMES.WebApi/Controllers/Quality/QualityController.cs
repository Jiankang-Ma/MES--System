using System;
using System.Collections.Generic;
using System.Linq;
using iMES.Core.EFDbContext;
using iMES.Core.Filters;
using iMES.Core.Utilities;
using iMES.Entity.DomainModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iMES.WebApi.Controllers.Quality
{
    [JWTAuthorize, ApiController]
    [Route("api/Quality")]
    public class QualityController : ControllerBase
    {
        private readonly SysDbContext _db;
        private static readonly string[] InspectionTypes = { "incoming", "process", "shipping" };

        public QualityController(SysDbContext db) { _db = db; }

        [HttpPost("AddInspectionItem")]
        public WebResponseContent AddInspectionItem([FromBody] QualityInspectionItemInput input)
        {
            var response = new WebResponseContent();
            if (input == null || string.IsNullOrWhiteSpace(input.InspectionItemName)) return response.Error("检测项名称不能为空");
            if (input.DefaultLowerLimit.HasValue && input.DefaultUpperLimit.HasValue && input.DefaultLowerLimit > input.DefaultUpperLimit) return response.Error("检测项下限不得大于上限");
            if (_db.Set<Quality_InspectionItem>().Any(x => x.InspectionItemName == input.InspectionItemName)) return response.Error("检测项名称已存在");
            var item = new Quality_InspectionItem
            {
                InspectionItemCode = string.IsNullOrWhiteSpace(input.InspectionItemCode) ? $"QI-{DateTime.Now:yyyyMMddHHmmssfff}" : input.InspectionItemCode,
                InspectionItemName = input.InspectionItemName,
                DataType = input.DataType ?? "number",
                DefaultStandard = input.DefaultStandard,
                DefaultLowerLimit = input.DefaultLowerLimit,
                DefaultUpperLimit = input.DefaultUpperLimit,
                Unit = input.Unit,
                CreateDate = DateTime.Now
            };
            if (_db.Set<Quality_InspectionItem>().Any(x => x.InspectionItemCode == item.InspectionItemCode)) return response.Error("检测项编号已存在");
            _db.Add(item); _db.SaveChanges();
            return response.OK("保存成功", new { inspectionItemId = item.InspectionItem_Id });
        }

        [HttpPost("AddInspectionTemplate")]
        public WebResponseContent AddInspectionTemplate([FromBody] QualityInspectionTemplateInput input)
        {
            var response = new WebResponseContent();
            if (input == null || input.Product_Id <= 0 || string.IsNullOrWhiteSpace(input.InspectionType)) return response.Error("产品和检验类型不能为空");
            if (!InspectionTypes.Contains(input.InspectionType)) return response.Error("检验类型仅支持 incoming、process、shipping");
            if (!_db.Set<Base_Product>().Any(x => x.Product_Id == input.Product_Id)) return response.Error("产品不存在");
            if (input.Items == null || input.Items.Count == 0) return response.Error("检测模板至少需要一个检测项");
            if (input.Items.Select(x => x.InspectionItem_Id).Distinct().Count() != input.Items.Count) return response.Error("同一检测项不能重复添加");
            if (input.Items.Any(x => x.LowerLimit.HasValue && x.UpperLimit.HasValue && x.LowerLimit > x.UpperLimit)) return response.Error("检测项下限不得大于上限");
            if (_db.Set<Quality_InspectionTemplate>().Any(x => x.Product_Id == input.Product_Id && x.InspectionType == input.InspectionType)) return response.Error("同一产品同一检验类型只能配置一个模板");
            var itemIds = input.Items.Select(x => x.InspectionItem_Id).ToList();
            var items = _db.Set<Quality_InspectionItem>().Where(x => itemIds.Contains(x.InspectionItem_Id)).ToDictionary(x => x.InspectionItem_Id);
            if (items.Count != itemIds.Count) return response.Error("模板中存在未定义的检测项");
            var template = new Quality_InspectionTemplate
            {
                InspectionTemplateCode = string.IsNullOrWhiteSpace(input.InspectionTemplateCode) ? $"QT-{DateTime.Now:yyyyMMddHHmmssfff}" : input.InspectionTemplateCode,
                InspectionTemplateName = string.IsNullOrWhiteSpace(input.InspectionTemplateName) ? $"{input.InspectionType}检测模板" : input.InspectionTemplateName,
                Product_Id = input.Product_Id, InspectionType = input.InspectionType, CreateDate = DateTime.Now
            };
            if (_db.Set<Quality_InspectionTemplate>().Any(x => x.InspectionTemplateCode == template.InspectionTemplateCode)) return response.Error("检测模板编号已存在");
            using var transaction = _db.Database.BeginTransaction();
            _db.Add(template); _db.SaveChanges();
            _db.AddRange(input.Items.Select((x, index) => new Quality_InspectionTemplateItem
            {
                InspectionTemplate_Id = template.InspectionTemplate_Id, InspectionItem_Id = x.InspectionItem_Id,
                InspectionItemName = items[x.InspectionItem_Id].InspectionItemName,
                StandardValue = x.StandardValue ?? items[x.InspectionItem_Id].DefaultStandard,
                LowerLimit = x.LowerLimit ?? items[x.InspectionItem_Id].DefaultLowerLimit,
                UpperLimit = x.UpperLimit ?? items[x.InspectionItem_Id].DefaultUpperLimit,
                Sequence = index + 1
            }));
            _db.SaveChanges(); transaction.Commit();
            return response.OK("保存成功", new { inspectionTemplateId = template.InspectionTemplate_Id });
        }

        [HttpPost("CreateInspectionOrder")]
        public WebResponseContent CreateInspectionOrder([FromBody] QualityInspectionOrderInput input)
        {
            var response = new WebResponseContent();
            if (input == null || input.Product_Id <= 0 || string.IsNullOrWhiteSpace(input.SourceNo) || !InspectionTypes.Contains(input.InspectionType)) return response.Error("检验类型、产品和来源单号不能为空");
            if (input.InspectionQty <= 0) return response.Error("检验数量必须大于0");
            if (input.InspectionType == "process" && (!input.WorkOrder_Id.HasValue || !input.Process_Id.HasValue)) return response.Error("过程检验必须关联工单和工序");
            var sourceDate = input.SourceDate ?? DateTime.Now;
            var inspectionDate = input.InspectionDate ?? DateTime.Now;
            if (inspectionDate < sourceDate) return response.Error("检验日期不得早于来源日期");
            if (_db.Set<Quality_InspectionOrder>().Any(x => x.InspectionType == input.InspectionType && x.Product_Id == input.Product_Id && x.SourceNo == input.SourceNo)) return response.Error("同一来源单据不能重复创建检验单");
            var template = _db.Set<Quality_InspectionTemplate>().FirstOrDefault(x => x.Product_Id == input.Product_Id && x.InspectionType == input.InspectionType);
            if (template == null) return response.Error("未找到该产品和检验类型的检测模板");
            var templateItems = _db.Set<Quality_InspectionTemplateItem>().Where(x => x.InspectionTemplate_Id == template.InspectionTemplate_Id).OrderBy(x => x.Sequence).ToList();
            if (templateItems.Count == 0) return response.Error("检测模板没有检测项");
            var order = new Quality_InspectionOrder
            {
                InspectionOrderCode = string.IsNullOrWhiteSpace(input.InspectionOrderCode) ? $"QO-{DateTime.Now:yyyyMMddHHmmssfff}" : input.InspectionOrderCode,
                InspectionType = input.InspectionType, Product_Id = input.Product_Id, SourceNo = input.SourceNo,
                WorkOrder_Id = input.WorkOrder_Id, Process_Id = input.Process_Id, SourceDate = sourceDate, InspectionDate = inspectionDate,
                InspectionQty = input.InspectionQty, InspectionTemplate_Id = template.InspectionTemplate_Id, FinalResult = "pending", CreateDate = DateTime.Now
            };
            using var transaction = _db.Database.BeginTransaction();
            _db.Add(order); _db.SaveChanges();
            _db.AddRange(templateItems.Select(x => new Quality_InspectionOrderItem
            {
                InspectionOrder_Id = order.InspectionOrder_Id, InspectionItem_Id = x.InspectionItem_Id, InspectionItemName = x.InspectionItemName,
                StandardValue = x.StandardValue, LowerLimit = x.LowerLimit, UpperLimit = x.UpperLimit, Result = "pending"
            }));
            _db.SaveChanges(); transaction.Commit();
            return response.OK("保存成功", new { inspectionOrderId = order.InspectionOrder_Id, inspectionItemCount = templateItems.Count });
        }

        [HttpPost("SubmitInspectionOrder")]
        public WebResponseContent SubmitInspectionOrder([FromBody] QualitySubmitInspectionInput input)
        {
            var response = new WebResponseContent();
            if (input == null || input.InspectionOrder_Id <= 0 || input.Items == null) return response.Error("检验单和检测结果不能为空");
            var order = _db.Set<Quality_InspectionOrder>().FirstOrDefault(x => x.InspectionOrder_Id == input.InspectionOrder_Id);
            if (order == null) return response.Error("检验单不存在");
            var orderItems = _db.Set<Quality_InspectionOrderItem>().Where(x => x.InspectionOrder_Id == order.InspectionOrder_Id).ToList();
            if (orderItems.Count != input.Items.Count || input.Items.Select(x => x.InspectionOrderItem_Id).Distinct().Count() != input.Items.Count || input.Items.Any(x => !x.ActualValue.HasValue)) return response.Error("必须完整且唯一地填写所有检测项结果");
            var inputs = input.Items.ToDictionary(x => x.InspectionOrderItem_Id);
            if (orderItems.Any(x => !inputs.ContainsKey(x.InspectionOrderItem_Id))) return response.Error("检测结果与检验单不匹配");
            bool failed = false;
            foreach (var item in orderItems)
            {
                item.ActualValue = inputs[item.InspectionOrderItem_Id].ActualValue;
                item.Result = (!item.LowerLimit.HasValue || item.ActualValue >= item.LowerLimit) && (!item.UpperLimit.HasValue || item.ActualValue <= item.UpperLimit) ? "passed" : "failed";
                failed |= item.Result == "failed";
                _db.Update(item);
            }
            if (failed && input.FinalResult == "passed") return response.Error("存在不合格检测项，最终结果不能为合格");
            order.FinalResult = failed ? "failed" : "passed";
            order.QualifiedQty = order.FinalResult == "passed" ? order.InspectionQty : 0;
            order.UnqualifiedQty = order.InspectionQty - order.QualifiedQty;
            _db.Update(order); _db.SaveChanges();
            return response.OK("提交成功", new { finalResult = order.FinalResult });
        }
    }

    public class QualityInspectionItemInput { public string InspectionItemCode { get; set; } public string InspectionItemName { get; set; } public string DataType { get; set; } public string DefaultStandard { get; set; } public decimal? DefaultLowerLimit { get; set; } public decimal? DefaultUpperLimit { get; set; } public string Unit { get; set; } }
    public class QualityInspectionTemplateItemInput { public int InspectionItem_Id { get; set; } public string StandardValue { get; set; } public decimal? LowerLimit { get; set; } public decimal? UpperLimit { get; set; } }
    public class QualityInspectionTemplateInput { public string InspectionTemplateCode { get; set; } public string InspectionTemplateName { get; set; } public int Product_Id { get; set; } public string InspectionType { get; set; } public List<QualityInspectionTemplateItemInput> Items { get; set; } }
    public class QualityInspectionOrderInput { public string InspectionOrderCode { get; set; } public string InspectionType { get; set; } public int Product_Id { get; set; } public string SourceNo { get; set; } public int? WorkOrder_Id { get; set; } public int? Process_Id { get; set; } public DateTime? SourceDate { get; set; } public DateTime? InspectionDate { get; set; } public decimal InspectionQty { get; set; } }
    public class QualityInspectionResultInput { public int InspectionOrderItem_Id { get; set; } public decimal? ActualValue { get; set; } }
    public class QualitySubmitInspectionInput { public int InspectionOrder_Id { get; set; } public string FinalResult { get; set; } public List<QualityInspectionResultInput> Items { get; set; } }
}
