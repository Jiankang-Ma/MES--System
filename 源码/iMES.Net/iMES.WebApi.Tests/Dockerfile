FROM mcr.microsoft.com/dotnet/sdk:3.1 AS test

WORKDIR /src

# WebApi 的项目引用覆盖全部业务层；先复制项目文件以便 Docker 缓存 NuGet 还原层。
COPY ["iMES.WebApi.Tests/iMES.WebApi.Tests.csproj", "iMES.WebApi.Tests/"]
COPY ["iMES.WebApi/iMES.WebApi.csproj", "iMES.WebApi/"]
COPY ["iMES.Builder/iMES.Builder.csproj", "iMES.Builder/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Custom/iMES.Custom.csproj", "iMES.Custom/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
COPY ["iMES.Production/iMES.Production.csproj", "iMES.Production/"]
COPY ["iMES.Report/iMES.Report.csproj", "iMES.Report/"]
COPY ["iMES.System/iMES.System.csproj", "iMES.System/"]
COPY ["iMES.Warehouse/iMES.Warehouse.csproj", "iMES.Warehouse/"]
RUN dotnet restore "iMES.WebApi.Tests/iMES.WebApi.Tests.csproj"

COPY . .
WORKDIR "/src/iMES.WebApi.Tests"
RUN dotnet test "iMES.WebApi.Tests.csproj" --no-restore --logger "console;verbosity=minimal"
