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
    [Entity(TableCnName = "装配工单-产品明细",TableName = "Production_AssembleWorkOrderList")]
    public partial class Production_AssembleWorkOrderList:SysEntity
    {
        /// <summary>
       ///装配工单明细表主键ID
       /// </summary>
       [Key]
       [Display(Name ="装配工单明细表主键ID")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int AssembleWorkOrderList_Id { get; set; }

       /// <summary>
       ///转配工单
       /// </summary>
       [Display(Name ="转配工单")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int AssembleWorkOrder_Id { get; set; }

       /// <summary>
       ///层级编号
       /// </summary>
       [Display(Name ="层级编号")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string LevelPath { get; set; }

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
       ///产品属性
       /// </summary>
       [Display(Name ="产品属性")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string ProductAttribute { get; set; }

       /// <summary>
       ///单位
       /// </summary>
       [Display(Name ="单位")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Unit_Id { get; set; }

       /// <summary>
       ///单位数量
       /// </summary>
       [Display(Name ="单位数量")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int UnitQty { get; set; }

       /// <summary>
       ///数量
       /// </summary>
       [Display(Name ="数量")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Qty { get; set; }

       /// <summary>
       ///工单编号
       /// </summary>
       [Display(Name ="工单编号")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string WorkOrderCode { get; set; }

       /// <summary>
       ///状态
       /// </summary>
       [Display(Name ="状态")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string Status { get; set; }

       /// <summary>
       ///生产进度
       /// </summary>
       [Display(Name ="生产进度")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string ProductionSchedule { get; set; }

       /// <summary>
       ///完成数
       /// </summary>
       [Display(Name ="完成数")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? FinishQty { get; set; }

       /// <summary>
       ///不良品数
       /// </summary>
       [Display(Name ="不良品数")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? BadQty { get; set; }

       /// <summary>
       ///创建时间
       /// </summary>
       [Display(Name ="创建时间")]
       [Column(TypeName="datetime")]
       public DateTime? CreateDate { get; set; }

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
       ///产品ID
       /// </summary>
       [Display(Name ="产品ID")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int Product_Id { get; set; }

       /// <summary>
       ///工艺路线
       /// </summary>
       [Display(Name ="工艺路线")]
       [Column(TypeName="int")]
       [Editable(true)]
       public int? ProcessLine_Id { get; set; }

       /// <summary>
       ///创建人编号
       /// </summary>
       [Display(Name ="创建人编号")]
       [Column(TypeName="int")]
       public int? CreateID { get; set; }

       
    }
}