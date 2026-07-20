FROM mcr.microsoft.com/dotnet/sdk:3.1 AS test

WORKDIR /src

# 先复制项目文件以便 Docker 缓存 NuGet 还原层。
COPY ["iMES.Core.Tests/iMES.Core.Tests.csproj", "iMES.Core.Tests/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
RUN dotnet restore "iMES.Core.Tests/iMES.Core.Tests.csproj"

COPY . .
WORKDIR "/src/iMES.Core.Tests"
RUN dotnet test "iMES.Core.Tests.csproj" --no-restore --logger "console;verbosity=minimal"
