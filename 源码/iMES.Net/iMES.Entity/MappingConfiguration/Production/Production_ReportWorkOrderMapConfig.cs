using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_ReportWorkOrderMapConfig : EntityMappingConfiguration<Production_ReportWorkOrder>
    {
        public override void Map(EntityTypeBuilder<Production_ReportWorkOrder>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

