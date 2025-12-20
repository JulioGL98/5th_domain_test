namespace Backend.Models;

public class User
{
    public int Id { get; set; }

    // Username must be unique
    public string Username { get; set; } = string.Empty;

    // store the BCrypt hash
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}