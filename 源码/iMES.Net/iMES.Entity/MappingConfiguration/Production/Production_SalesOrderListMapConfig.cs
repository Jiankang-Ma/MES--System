using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_SalesOrderListMapConfig : EntityMappingConfiguration<Production_SalesOrderList>
    {
        public override void Map(EntityTypeBuilder<Production_SalesOrderList>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

