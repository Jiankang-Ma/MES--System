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
    [Entity(TableCnName = "装配工单",TableName = "Production_AssembleWorkOrder",DetailTable =  new Type[] { typeof(Production_AssembleWorkOrderList)},DetailTableCnName = "转配工单-产品明细")]
    public partial class Production_AssembleWorkOrder:SysEntity
    {
        /// <summary>
       ///装配工单主键ID
       /// </summary>
       [Key]
       [Display(Name ="装配工单主键ID")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int AssembleWorkOrder_Id { get; set; }

       /// <summary>
       ///单据编号
       /// </summary>
       [Display(Name ="单据编号")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string AssembleWorkOrderCode { get; set; }

       /// <summary>
       ///工单数
       /// </summary>
       [Display(Name ="工单数")]
       [Column(TypeName="int")]
       public int? WorkOrderQty { get; set; }

       /// <summary>
       ///已结束工单
       /// </summary>
       [Display(Name ="已结束工单")]
       [Column(TypeName="int")]
       public int? FinishedQty { get; set; }

       /// <summary>
       ///单据进度
       /// </summary>
       [Display(Name ="单据进度")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string FormProcess { get; set; }

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

       [Display(Name ="转配工单-产品明细")]
       [ForeignKey("AssembleWorkOrder_Id")]
       public List<Production_AssembleWorkOrderList> Production_AssembleWorkOrderList { get; set; }

    }
}