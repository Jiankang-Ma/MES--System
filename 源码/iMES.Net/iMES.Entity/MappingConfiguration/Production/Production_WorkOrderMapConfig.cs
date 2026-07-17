using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_WorkOrderMapConfig : EntityMappingConfiguration<Production_WorkOrder>
    {
        public override void Map(EntityTypeBuilder<Production_WorkOrder>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

