# ToDo App Challenge

Full Stack task management APP built with .NET 10 and React.

## 🛠 Tech Stack

- **Backend:** C# .NET 10 Web API, Entity Framework Core, SQLite.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Arquitectura:** Simplified Repository Pattern, Code-First approach.

## How to Run the Project

### Prerequisites
- .NET 10 SDK
- Node.js (LTS)

### Setup and Start the Backend
From the terminal in the root folder:

cd Backend
dotnet restore
dotnet ef database update

# Run server
dotnet run

## 🔄 Database Workflow

This project uses **Entity Framework Core (Code-First)**. This means we **never** modify the SQLite database manually. We modify the C# code, and tools update the DB.

Follow these 3 steps to modify the schema (Add/Remove columns or Tables):

### 1. Modify the Code (Models)
- **To edit columns:** Go to `Backend/Models`, open the corresponding class (e.g., `TodoItem.cs`), and add, remove, or modify the public property.
- **To add a table:** Create a new class in `Models` and add it as a `DbSet<YourClass>` in `Backend/Data/AppDbContext.cs`.

### 2. Create the Migration
Tell EF Core to calculate the difference between your new code and the old database. Run this in the terminal (inside `Backend/` folder):

```bash
dotnet ef migrations add DescriptiveNameOfChange
# Example: dotnet ef migrations add AddUserBirthDate