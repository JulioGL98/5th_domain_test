# Backend/Dockerfile

# 1. Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["Backend.csproj", "./"]
RUN dotnet restore "Backend.csproj"

# Copy everything else
COPY . .

# The code in Program.cs will handle the DB on startup.
# Publish
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create folder for the DB and set permissions
RUN mkdir -p /app/data && chmod 777 /app/data

EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"]