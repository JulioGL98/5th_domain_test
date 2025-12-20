using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> Login(string username, string password)
    {
        // find user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        if (user == null) return null;

        // verify the password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        if (!isPasswordValid) return null;
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username
        };
    }

    public async Task<UserDto> Register(string username, string password)
    {
        // user already exists
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
        {
            throw new Exception("Username already exists");
        }

        // encode password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        // create new user in the db
        var newUser = new User
        {
            Username = username,
            PasswordHash = passwordHash
        };
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = newUser.Id,
            Username = newUser.Username
        };
    }
}