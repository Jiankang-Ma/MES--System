FROM mcr.microsoft.com/dotnet/sdk:3.1 AS test

WORKDIR /src

# 先复制项目文件以便 Docker 缓存 NuGet 还原层。
COPY ["iMES.System.Tests/iMES.System.Tests.csproj", "iMES.System.Tests/"]
COPY ["iMES.System/iMES.System.csproj", "iMES.System/"]
COPY ["iMES.Custom/iMES.Custom.csproj", "iMES.Custom/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
RUN dotnet restore "iMES.System.Tests/iMES.System.Tests.csproj"

COPY . .
WORKDIR "/src/iMES.System.Tests"
RUN dotnet test "iMES.System.Tests.csproj" --no-restore --logger "console;verbosity=minimal"
