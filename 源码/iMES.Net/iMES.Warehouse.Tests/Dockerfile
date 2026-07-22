FROM mcr.microsoft.com/dotnet/sdk:3.1 AS test

WORKDIR /src

COPY ["iMES.Warehouse.Tests/iMES.Warehouse.Tests.csproj", "iMES.Warehouse.Tests/"]
COPY ["iMES.Warehouse/iMES.Warehouse.csproj", "iMES.Warehouse/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
COPY ["iMES.Custom/iMES.Custom.csproj", "iMES.Custom/"]
RUN dotnet restore "iMES.Warehouse.Tests/iMES.Warehouse.Tests.csproj"

COPY . .
WORKDIR "/src/iMES.Warehouse.Tests"
RUN dotnet test "iMES.Warehouse.Tests.csproj" --no-restore --logger "console;verbosity=minimal"