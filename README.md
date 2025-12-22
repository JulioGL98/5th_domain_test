# ToDo App

Full Stack task management APP built with .NET 10 and React.

## Tech Stack

### Backend
- **Framework:** .NET 10 Web API (C#)
- **ORM:** Entity Framework Core
- **Database:** SQLite
- **Security:** BCrypt.Net + System.IdentityModel.Tokens.Jwt
- **Documentation:** Swagger UI

### Frontend
- **Framework:** React (via Vite)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **HTTP Client:** Axios (with Interceptors)

# How to Run the Project

## Prerequisites
- .NET 10 SDK
- Node.js (LTS)

### Setup and Start the Backend
From the terminal in the root folder:
```bash
cd Backend
dotnet restore
dotnet ef database update
```
### Run server
```bash
cd Backend
dotnet run
```
### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
## Database Workflow

This project uses **Entity Framework Core**. So to update the DB we only need to change lines in the C# code.
To Add/Remove columns or Tables:

### 1. Modify the Code (Models)
- **To edit columns:** Go to `Backend/Models`, open the corresponding class (e.g., `TodoItem.cs`), and add, remove, or modify the public property.
- **To add a table:** Create a new class in `Models` and add it as a `DbSet<YourClass>` in `Backend/Data/AppDbContext.cs`.

### 2. Create the Migration
Updates changes. Run in Backed folder:

```bash
dotnet ef migrations add NameOfChange
```
