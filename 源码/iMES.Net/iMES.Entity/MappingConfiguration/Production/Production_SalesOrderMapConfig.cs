using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Production_SalesOrderMapConfig : EntityMappingConfiguration<Production_SalesOrder>
    {
        public override void Map(EntityTypeBuilder<Production_SalesOrder>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

