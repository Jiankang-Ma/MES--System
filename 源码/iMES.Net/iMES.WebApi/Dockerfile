FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
ARG DEBIAN_FRONTEND=noninteractive

# .NET Core 3.1 images are based on Debian buster, whose normal apt repositories
# have moved to archive.debian.org. Keep this here for repeatable local/cloud builds.
RUN sed -i \
        -e 's#http://deb.debian.org/debian#http://archive.debian.org/debian#g' \
        -e 's#http://security.debian.org/debian-security#http://archive.debian.org/debian-security#g' \
        -e 's#http://deb.debian.org/debian-security#http://archive.debian.org/debian-security#g' \
        /etc/apt/sources.list \
    && apt-get -o Acquire::Check-Valid-Until=false update \
    && apt-get install -y --no-install-recommends libfontconfig1 libgdiplus libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
EXPOSE 9991

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["iMES.WebApi/iMES.WebApi.csproj", "iMES.WebApi/"]
COPY ["iMES.System/iMES.System.csproj", "iMES.System/"]
COPY ["iMES.Core/iMES.Core.csproj", "iMES.Core/"]
COPY ["iMES.Entity/iMES.Entity.csproj", "iMES.Entity/"]
COPY ["iMES.Builder/iMES.Builder.csproj", "iMES.Builder/"]
COPY ["iMES.Custom/iMES.Custom.csproj", "iMES.Custom/"]
COPY ["iMES.Production/iMES.Production.csproj", "iMES.Production/"]
COPY ["iMES.Report/iMES.Report.csproj", "iMES.Report/"]
COPY ["iMES.Warehouse/iMES.Warehouse.csproj", "iMES.Warehouse/"]
RUN dotnet restore "iMES.WebApi/iMES.WebApi.csproj"
COPY . .
WORKDIR "/src/iMES.WebApi"
RUN dotnet publish "iMES.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "iMES.WebApi.dll"]
