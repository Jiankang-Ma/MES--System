using iMES.Entity.MappingConfiguration;
using iMES.Entity.DomainModels;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace iMES.Entity.MappingConfiguration
{
    public class Sys_User_ExtendDataMapConfig : EntityMappingConfiguration<Sys_User_ExtendData>
    {
        public override void Map(EntityTypeBuilder<Sys_User_ExtendData>
        builderTable)
        {
          //b.Property(x => x.StorageName).HasMaxLength(45);
        }
     }
}

