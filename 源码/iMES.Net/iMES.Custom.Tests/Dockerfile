FROM mcr.microsoft.com/dotnet/sdk:3.1 AS test

WORKDIR /src

# Copy project files first so NuGet restore can be cached by Docker.
COPY ["iMES.Custom.Tests/iMES.Custom.Tests.csproj", "iMES.Custom.Tests/"]
COPY ["iMES.Custom/iMES.Custom.csproj", "iMES.Custom/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
RUN dotnet restore "iMES.Custom.Tests/iMES.Custom.Tests.csproj"

COPY . .
WORKDIR "/src/iMES.Custom.Tests"
RUN dotnet test "iMES.Custom.Tests.csproj" --no-restore --logger "console;verbosity=minimal"
