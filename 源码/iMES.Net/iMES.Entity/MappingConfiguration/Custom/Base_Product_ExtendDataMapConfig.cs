using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_Product_ExtendDataMapConfig : EntityMappingConfiguration<Base_Product_ExtendData>
    {
        public override void Map(EntityTypeBuilder<Base_Product_ExtendData>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

