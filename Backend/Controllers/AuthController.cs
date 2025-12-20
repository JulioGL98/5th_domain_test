using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService)
    {
        _authService = authService;
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto loginData)
    {
        var user = _authService.Login(loginData.Username, loginData.Password);

        if (user == null)
        {
            return Unauthorized("Incorrect user or pass");
        }
        return Ok(user);
    }
}