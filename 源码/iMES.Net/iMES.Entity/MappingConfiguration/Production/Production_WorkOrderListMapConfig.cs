using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_WorkOrderListMapConfig : EntityMappingConfiguration<Production_WorkOrderList>
    {
        public override void Map(EntityTypeBuilder<Production_WorkOrderList>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

