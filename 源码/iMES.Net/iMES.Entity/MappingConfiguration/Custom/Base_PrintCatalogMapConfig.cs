using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_PrintCatalogMapConfig : EntityMappingConfiguration<Base_PrintCatalog>
    {
        public override void Map(EntityTypeBuilder<Base_PrintCatalog>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

