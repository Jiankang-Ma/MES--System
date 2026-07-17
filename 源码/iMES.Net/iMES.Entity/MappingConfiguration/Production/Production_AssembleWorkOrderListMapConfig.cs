using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_AssembleWorkOrderListMapConfig : EntityMappingConfiguration<Production_AssembleWorkOrderList>
    {
        public override void Map(EntityTypeBuilder<Production_AssembleWorkOrderList>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

