using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _context;

    public TodosController(AppDbContext context)
    {
        _context = context;
    }

    // get tasks with id filter
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos([FromQuery] int userId)
    {
        return await _context.TodoItems
                             .Where(t => t.OwnerId == userId && t.DeletedAt == null) // Filter condition
                             .ToListAsync();
    }

    // create task
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoItem todo)
    {
        if (todo.OwnerId <= 0)
        {
            return BadRequest("OwnerId needed.");
        }

        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
    }

    // update task
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(int id, TodoItem todo)
    {
        if (id != todo.Id) return BadRequest();

        _context.Entry(todo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.TodoItems.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // delete task
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.TodoItems.FindAsync(id);
        if (todo == null) return NotFound();

        // To perform HARD delete
        //_context.TodoItems.Remove(todo);

        // To perform SOFT delete
        todo.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Mark all as completed
    [HttpPut("complete-all")]
    public async Task<IActionResult> CompleteAllTodos([FromQuery] int userId)
    {
        var todos = await _context.TodoItems
            .Where(t => t.OwnerId == userId && t.DeletedAt == null && !t.IsDone)
            .ToListAsync();

        foreach (var todo in todos)
        {
            todo.IsDone = true;
        }

        await _context.SaveChangesAsync();
        
        return Ok(new { updatedCount = todos.Count });
    }

    // Unmark all (set as not completed)
    [HttpPut("uncomplete-all")]
    public async Task<IActionResult> UncompleteAllTodos([FromQuery] int userId)
    {
        var todos = await _context.TodoItems
            .Where(t => t.OwnerId == userId && t.DeletedAt == null && t.IsDone)
            .ToListAsync();

        foreach (var todo in todos)
        {
            todo.IsDone = false;
        }

        await _context.SaveChangesAsync();
        
        return Ok(new { updatedCount = todos.Count });
    }

    // Delete all completed tasks (soft delete)
    [HttpDelete("completed")]
    public async Task<IActionResult> DeleteCompletedTodos([FromQuery] int userId)
    {
        var completedTodos = await _context.TodoItems
            .Where(t => t.OwnerId == userId && t.DeletedAt == null && t.IsDone)
            .ToListAsync();

        var now = DateTime.UtcNow;
        foreach (var todo in completedTodos)
        {
            todo.DeletedAt = now;
        }

        await _context.SaveChangesAsync();
        
        return Ok(new { deletedCount = completedTodos.Count });
    }
    
}