/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果数据库字段发生变化，请在代码生器重新生成此Model
 */
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iMES.Entity.SystemModels;

namespace iMES.Entity.DomainModels
{
    [Entity(TableCnName = "工单",TableName = "Production_WorkOrder",DetailTable =  new Type[] { typeof(Production_WorkOrderList)},DetailTableCnName = "生产任务")]
    public partial class Production_WorkOrder:SysEntity
    {
        /// <summary>
       ///工单主键ID
       /// </summary>
       [Key]
       [Display(Name ="工单主键ID")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int WorkOrder_Id { get; set; }

       /// <summary>
       ///工单编号
       /// </summary>
       [Display(Name ="工单编号")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string WorkOrderCode { get; set; }

       /// <summary>
       ///产品
       /// </summary>
       [Display(Name ="产品")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Product_Id { get; set; }

       /// <summary>
       ///产品编号
       /// </summary>
       [Display(Name ="产品编号")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string ProductCode { get; set; }

       /// <summary>
       ///产品名称
       /// </summary>
       [Display(Name ="产品名称")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string ProductName { get; set; }

       /// <summary>
       ///产品规格
       /// </summary>
       [Display(Name ="产品规格")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ProductStandard { get; set; }

       /// <summary>
       ///单位
       /// </summary>
       [Display(Name ="单位")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Unit_Id { get; set; }

       /// <summary>
       ///关联单据
       /// </summary>
       [Display(Name ="关联单据")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string AssociatedForm { get; set; }

       /// <summary>
       ///状态
       /// </summary>
       [Display(Name ="状态")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string Status { get; set; }

       /// <summary>
       ///计划开始时间
       /// </summary>
       [Display(Name ="计划开始时间")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public DateTime PlanStartDate { get; set; }

       /// <summary>
       ///计划结束时间
       /// </summary>
       [Display(Name ="计划结束时间")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public DateTime PlanEndDate { get; set; }

       /// <summary>
       ///计划数
       /// </summary>
       [Display(Name ="计划数")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int PlanQty { get; set; }

       /// <summary>
       ///实际数
       /// </summary>
       [Display(Name ="实际数")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int RealQty { get; set; }

       /// <summary>
       ///良品数
       /// </summary>
       [Display(Name ="良品数")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int GoodQty { get; set; }

       /// <summary>
       ///不良品数
       /// </summary>
       [Display(Name ="不良品数")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int NoGoodQty { get; set; }

       /// <summary>
       ///报工时长
       /// </summary>
       [Display(Name ="报工时长")]
       [Column(TypeName="datetime")]
       public DateTime? ReportTime { get; set; }

       /// <summary>
       ///生产进度
       /// </summary>
       [Display(Name ="生产进度")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string ProductionSchedule { get; set; }

       /// <summary>
       ///实际开始时间
       /// </summary>
       [Display(Name ="实际开始时间")]
       [Column(TypeName="datetime")]
       public DateTime? ActualStartDate { get; set; }

       /// <summary>
       ///实际结束时间
       /// </summary>
       [Display(Name ="实际结束时间")]
       [Column(TypeName="datetime")]
       public DateTime? ActualEndDate { get; set; }

       /// <summary>
       ///备注
       /// </summary>
       [Display(Name ="备注")]
       [MaxLength(1000)]
       [Column(TypeName="nvarchar(1000)")]
       [Editable(true)]
       public string Remark { get; set; }

       /// <summary>
       ///创建时间
       /// </summary>
       [Display(Name ="创建时间")]
       [Column(TypeName="datetime")]
       public DateTime? CreateDate { get; set; }

       /// <summary>
       ///创建人编号
       /// </summary>
       [Display(Name ="创建人编号")]
       [Column(TypeName="int")]
       public int? CreateID { get; set; }

       /// <summary>
       ///创建人
       /// </summary>
       [Display(Name ="创建人")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string Creator { get; set; }

       /// <summary>
       ///修改人
       /// </summary>
       [Display(Name ="修改人")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string Modifier { get; set; }

       /// <summary>
       ///修改时间
       /// </summary>
       [Display(Name ="修改时间")]
       [Column(TypeName="datetime")]
       public DateTime? ModifyDate { get; set; }

       /// <summary>
       ///修改人编号
       /// </summary>
       [Display(Name ="修改人编号")]
       [Column(TypeName="int")]
       public int? ModifyID { get; set; }

       /// <summary>
       ///来源类型
       /// </summary>
       [Display(Name ="来源类型")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string FromType { get; set; }

       [Display(Name ="生产任务")]
       [ForeignKey("WorkOrder_Id")]
       public List<Production_WorkOrderList> Production_WorkOrderList { get; set; }

    }
}