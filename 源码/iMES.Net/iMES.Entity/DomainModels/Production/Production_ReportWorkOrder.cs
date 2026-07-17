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
    [Entity(TableCnName = "报工",TableName = "Production_ReportWorkOrder",DetailTable =  new Type[] { typeof(Production_ReportWorkOrderList)},DetailTableCnName = "不良品项")]
    public partial class Production_ReportWorkOrder:SysEntity
    {
        /// <summary>
       ///报工主键ID
       /// </summary>
       [Key]
       [Display(Name ="报工主键ID")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int ReportWorkOrder_Id { get; set; }

       /// <summary>
       ///工单
       /// </summary>
       [Display(Name ="工单")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string WorkOrder_Id { get; set; }

       /// <summary>
       ///工序名称
       /// </summary>
       [Display(Name ="工序名称")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Process_Id { get; set; }

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
       ///工序状态
       /// </summary>
       [Display(Name ="工序状态")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ProcessStatus { get; set; }

       /// <summary>
       ///生产人员
       /// </summary>
       [Display(Name ="生产人员")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string ProductUser { get; set; }

       /// <summary>
       ///报工数
       /// </summary>
       [Display(Name ="报工数")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ReportQty { get; set; }

       /// <summary>
       ///单位
       /// </summary>
       [Display(Name ="单位")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? Unit_Id { get; set; }

       /// <summary>
       ///良品数
       /// </summary>
       [Display(Name ="良品数")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? GoodQty { get; set; }

       /// <summary>
       ///不良品数
       /// </summary>
       [Display(Name ="不良品数")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? NoGoodQty { get; set; }

       /// <summary>
       ///工序进度
       /// </summary>
       [Display(Name ="工序进度")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ProcessProgress { get; set; }

       /// <summary>
       ///开始时间
       /// </summary>
       [Display(Name ="开始时间")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       public DateTime? StartDate { get; set; }

       /// <summary>
       ///结束时间
       /// </summary>
       [Display(Name ="结束时间")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       public DateTime? EndDate { get; set; }

       /// <summary>
       ///报工时长
       /// </summary>
       [Display(Name ="报工时长")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ReoportDurationHour { get; set; }

       /// <summary>
       ///
       /// </summary>
       [Display(Name ="ReoportDurationMinute")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ReoportDurationMinute { get; set; }

       /// <summary>
       ///标准效率
       /// </summary>
       [Display(Name ="标准效率")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string StandardProgress { get; set; }

       /// <summary>
       ///实际效率
       /// </summary>
       [Display(Name ="实际效率")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ActualProgress { get; set; }

       /// <summary>
       ///达标率
       /// </summary>
       [Display(Name ="达标率")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string RateStandard { get; set; }

       /// <summary>
       ///计价方式
       /// </summary>
       [Display(Name ="计价方式")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? PriceType { get; set; }

       /// <summary>
       ///工资单价
       /// </summary>
       [Display(Name ="工资单价")]
       [DisplayFormat(DataFormatString="20,3")]
       [Column(TypeName="decimal")]
       [Editable(true)]
       public decimal? UnitPrice { get; set; }

       /// <summary>
       ///预计工资
       /// </summary>
       [Display(Name ="预计工资")]
       [DisplayFormat(DataFormatString="20,3")]
       [Column(TypeName="decimal")]
       [Editable(true)]
       public decimal? GuessPrice { get; set; }

       /// <summary>
       ///审批状态
       /// </summary>
       [Display(Name ="审批状态")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ApproveStatus { get; set; }

       /// <summary>
       ///审批人
       /// </summary>
       [Display(Name ="审批人")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ApproveUser { get; set; }

       /// <summary>
       ///报工时间
       /// </summary>
       [Display(Name ="报工时间")]
       [Column(TypeName="datetime")]
       [Editable(true)]
       public DateTime? ReportTime { get; set; }

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

       [Display(Name ="不良品项")]
       [ForeignKey("ReportWorkOrder_Id")]
       public List<Production_ReportWorkOrderList> Production_ReportWorkOrderList { get; set; }

    }
}