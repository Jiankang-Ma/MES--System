using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_MaterialDetail_ExtendDataMapConfig : EntityMappingConfiguration<Base_MaterialDetail_ExtendData>
    {
        public override void Map(EntityTypeBuilder<Base_MaterialDetail_ExtendData>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

