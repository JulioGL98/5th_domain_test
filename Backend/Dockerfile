# Backend/Dockerfile

# 1. Imagen de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar csproj y restaurar
COPY ["Backend.csproj", "./"]
RUN dotnet restore "Backend.csproj"

# Copiar todo lo demás
COPY . .

# --- IMPORTANTE: NO EJECUTAR 'dotnet ef' AQUÍ ---
# El código en Program.cs se encargará de la DB al iniciar.

# Publicar
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Imagen final de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Crear carpeta para la DB y dar permisos
RUN mkdir -p /app/data && chmod 777 /app/data

EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"]