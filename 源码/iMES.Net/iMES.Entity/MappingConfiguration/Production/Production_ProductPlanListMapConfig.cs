using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_ProductPlanListMapConfig : EntityMappingConfiguration<Production_ProductPlanList>
    {
        public override void Map(EntityTypeBuilder<Production_ProductPlanList>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

