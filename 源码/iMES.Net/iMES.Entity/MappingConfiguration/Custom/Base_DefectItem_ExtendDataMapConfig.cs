using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_DefectItem_ExtendDataMapConfig : EntityMappingConfiguration<Base_DefectItem_ExtendData>
    {
        public override void Map(EntityTypeBuilder<Base_DefectItem_ExtendData>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

