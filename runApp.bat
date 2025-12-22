@echo off
echo STARTING...

start "Backend API (.NET)" cmd /k "cd Backend && dotnet run"

start "Frontend Vite (React)" cmd /k "cd frontend && npm run dev"