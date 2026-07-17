using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_ReportWorkOrderListMapConfig : EntityMappingConfiguration<Production_ReportWorkOrderList>
    {
        public override void Map(EntityTypeBuilder<Production_ReportWorkOrderList>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

