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
    public async Task<IActionResult> Login([FromBody] LoginDto loginData)
    {
        var user = await _authService.Login(loginData.Username, loginData.Password);

        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginDto registerData)
    {
        try
        {
            var user = await _authService.Register(registerData.Username, registerData.Password);
            return CreatedAtAction(nameof(Login), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}