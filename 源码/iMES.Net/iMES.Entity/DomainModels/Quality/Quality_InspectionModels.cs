using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using iMES.Entity.SystemModels;

namespace iMES.Entity.DomainModels
{
    [Entity(TableCnName = "检测项", TableName = "Quality_InspectionItem")]
    public class Quality_InspectionItem : SysEntity
    {
        [Key] public int InspectionItem_Id { get; set; }
        [Required, MaxLength(100)] public string InspectionItemCode { get; set; }
        [Required, MaxLength(200)] public string InspectionItemName { get; set; }
        [MaxLength(50)] public string DataType { get; set; }
        [MaxLength(500)] public string DefaultStandard { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? DefaultLowerLimit { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? DefaultUpperLimit { get; set; }
        [MaxLength(50)] public string Unit { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CreateID { get; set; }
        [MaxLength(200)] public string Creator { get; set; }
    }

    [Entity(TableCnName = "检测模板", TableName = "Quality_InspectionTemplate", DetailTable = new Type[] { typeof(Quality_InspectionTemplateItem) }, DetailTableCnName = "模板检测项")]
    public class Quality_InspectionTemplate : SysEntity
    {
        [Key] public int InspectionTemplate_Id { get; set; }
        [Required, MaxLength(100)] public string InspectionTemplateCode { get; set; }
        [Required, MaxLength(200)] public string InspectionTemplateName { get; set; }
        public int Product_Id { get; set; }
        [Required, MaxLength(30)] public string InspectionType { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CreateID { get; set; }
        [MaxLength(200)] public string Creator { get; set; }
        [ForeignKey("InspectionTemplate_Id")] public List<Quality_InspectionTemplateItem> Quality_InspectionTemplateItem { get; set; }
    }

    [Entity(TableCnName = "检测模板明细", TableName = "Quality_InspectionTemplateItem")]
    public class Quality_InspectionTemplateItem : SysEntity
    {
        [Key] public int InspectionTemplateItem_Id { get; set; }
        public int InspectionTemplate_Id { get; set; }
        public int InspectionItem_Id { get; set; }
        [Required, MaxLength(200)] public string InspectionItemName { get; set; }
        [MaxLength(500)] public string StandardValue { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? LowerLimit { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? UpperLimit { get; set; }
        public int Sequence { get; set; }
    }

    [Entity(TableCnName = "检验单", TableName = "Quality_InspectionOrder", DetailTable = new Type[] { typeof(Quality_InspectionOrderItem) }, DetailTableCnName = "检验结果")]
    public class Quality_InspectionOrder : SysEntity
    {
        [Key] public int InspectionOrder_Id { get; set; }
        [Required, MaxLength(100)] public string InspectionOrderCode { get; set; }
        [Required, MaxLength(30)] public string InspectionType { get; set; }
        public int Product_Id { get; set; }
        [Required, MaxLength(200)] public string SourceNo { get; set; }
        public int? WorkOrder_Id { get; set; }
        public int? Process_Id { get; set; }
        public DateTime SourceDate { get; set; }
        public DateTime InspectionDate { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal InspectionQty { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? QualifiedQty { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? UnqualifiedQty { get; set; }
        [MaxLength(30)] public string FinalResult { get; set; }
        public int InspectionTemplate_Id { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CreateID { get; set; }
        [MaxLength(200)] public string Creator { get; set; }
        [ForeignKey("InspectionOrder_Id")] public List<Quality_InspectionOrderItem> Quality_InspectionOrderItem { get; set; }
    }

    [Entity(TableCnName = "检验结果明细", TableName = "Quality_InspectionOrderItem")]
    public class Quality_InspectionOrderItem : SysEntity
    {
        [Key] public int InspectionOrderItem_Id { get; set; }
        public int InspectionOrder_Id { get; set; }
        public int InspectionItem_Id { get; set; }
        [Required, MaxLength(200)] public string InspectionItemName { get; set; }
        [MaxLength(500)] public string StandardValue { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? LowerLimit { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? UpperLimit { get; set; }
        [Column(TypeName = "decimal(18,4)")] public decimal? ActualValue { get; set; }
        [MaxLength(30)] public string Result { get; set; }
    }
}
