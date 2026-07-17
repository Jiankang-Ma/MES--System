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
    [Entity(TableCnName = "物料清单扩展",TableName = "Base_MaterialDetail_ExtendData")]
    public partial class Base_MaterialDetail_ExtendData:SysEntity
    {
        /// <summary>
       ///物料清单扩展数据表主键ID
       /// </summary>
       [Key]
       [Display(Name ="物料清单扩展数据表主键ID")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int MaterialDetailExData_Id { get; set; }

       /// <summary>
       ///物料清单编号
       /// </summary>
       [Display(Name ="物料清单编号")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int MaterialDetail_Id { get; set; }

       /// <summary>
       ///扩展字段编号
       /// </summary>
       [Display(Name ="扩展字段编号")]
       [Column(TypeName="int")]
       [Required(AllowEmptyStrings=false)]
       public int TableEx_Id { get; set; }

       /// <summary>
       ///字段名称
       /// </summary>
       [Display(Name ="字段名称")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string FieldName { get; set; }

       /// <summary>
       ///字段编码
       /// </summary>
       [Display(Name ="字段编码")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string FieldCode { get; set; }

       /// <summary>
       ///字段值
       /// </summary>
       [Display(Name ="字段值")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       public string FieldValue { get; set; }

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

       
    }
}