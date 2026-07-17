using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_ProductPlanMapConfig : EntityMappingConfiguration<Production_ProductPlan>
    {
        public override void Map(EntityTypeBuilder<Production_ProductPlan>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

