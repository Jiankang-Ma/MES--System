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
    [Entity(TableCnName = "打印模版",TableName = "Base_PrintTemplate")]
    public partial class Base_PrintTemplate:SysEntity
    {
        /// <summary>
       ///打印模板主键ID
       /// </summary>
       [Key]
       [Display(Name ="打印模板主键ID")]
       [Column(TypeName="uniqueidentifier")]
       [Required(AllowEmptyStrings=false)]
       public Guid PrintTemplateId { get; set; }

       /// <summary>
       ///模板分类
       /// </summary>
       [Display(Name ="模板分类")]
       [Column(TypeName="uniqueidentifier")]
       [Editable(true)]
       public Guid? CatalogId { get; set; }

       /// <summary>
       ///模版名称
       /// </summary>
       [Display(Name ="模版名称")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public string TemplateName { get; set; }

       /// <summary>
       ///默认
       /// </summary>
       [Display(Name ="默认")]
       [Column(TypeName="int")]
       [Editable(true)]
       [Required(AllowEmptyStrings=false)]
       public int StatusFlag { get; set; }

       /// <summary>
       ///备注
       /// </summary>
       [Display(Name ="备注")]
       [MaxLength(200)]
       [Column(TypeName="nvarchar(200)")]
       [Editable(true)]
       public string Remark { get; set; }

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
       [MaxLength(30)]
       [Column(TypeName="nvarchar(30)")]
       public string Creator { get; set; }

       /// <summary>
       ///创建时间
       /// </summary>
       [Display(Name ="创建时间")]
       [Column(TypeName="datetime")]
       public DateTime? CreateDate { get; set; }

       /// <summary>
       ///修改人编号
       /// </summary>
       [Display(Name ="修改人编号")]
       [Column(TypeName="int")]
       public int? ModifyID { get; set; }

       /// <summary>
       ///修改人
       /// </summary>
       [Display(Name ="修改人")]
       [MaxLength(30)]
       [Column(TypeName="nvarchar(30)")]
       public string Modifier { get; set; }

       /// <summary>
       ///修改时间
       /// </summary>
       [Display(Name ="修改时间")]
       [Column(TypeName="datetime")]
       public DateTime? ModifyDate { get; set; }

       /// <summary>
       ///模版内容
       /// </summary>
       [Display(Name ="模版内容")]
       [Column(TypeName="varchar(max)")]
       public string TemplateContent { get; set; }

       /// <summary>
       ///是否系统默认
       /// </summary>
       [Display(Name ="是否系统默认")]
       [Column(TypeName="int")]
       public int? isDefault { get; set; }

       
    }
}