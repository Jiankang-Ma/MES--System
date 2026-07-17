using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Base_MeritPay_ExtendDataMapConfig : EntityMappingConfiguration<Base_MeritPay_ExtendData>
    {
        public override void Map(EntityTypeBuilder<Base_MeritPay_ExtendData>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

