using Backend.DTOs;

namespace Backend.Services;

public class AuthService
{
    public UserDto? Login(string username, string password)
    {
        if (username.ToLower() == "admin" && password == "123")
        {
            return new UserDto { Id = 1, Username = "Admin" };
        }

        if (username.ToLower() == "user2" && password == "123")
        {
            return new UserDto { Id = 2, Username = "user2Name" };
        }

        if (username.ToLower() == "user3" && password == "123")
        {
            return new UserDto { Id = 3, Username = "user3Name" };
        }
        return null;
    }
}