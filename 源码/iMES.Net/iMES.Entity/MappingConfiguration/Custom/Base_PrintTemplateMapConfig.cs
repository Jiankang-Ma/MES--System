using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_PrintTemplateMapConfig : EntityMappingConfiguration<Base_PrintTemplate>
    {
        public override void Map(EntityTypeBuilder<Base_PrintTemplate>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

