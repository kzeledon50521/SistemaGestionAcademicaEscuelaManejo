FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Cronos.API/Cronos.API.csproj", "Cronos.API/"]
COPY ["Cronos.BLL/Cronos.BLL.csproj", "Cronos.BLL/"]
COPY ["Cronos.DAL/Cronos.DAL.csproj", "Cronos.DAL/"]
COPY ["Cronos.DTOs/Cronos.DTOs.csproj", "Cronos.DTOs/"]

RUN dotnet restore "Cronos.API/Cronos.API.csproj"

COPY . .

WORKDIR "/src/Cronos.API"
RUN dotnet publish "Cronos.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "Cronos.API.dll"]