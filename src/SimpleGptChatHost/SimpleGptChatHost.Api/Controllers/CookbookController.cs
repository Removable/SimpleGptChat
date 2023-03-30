using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleGptChatHost.Api.Models;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class CookbookController : Controller
{
    private readonly SQLiteDbContext _dbContext;

    public CookbookController(SQLiteDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetIngredients(string keyword)
    {
        var selectSql =
            $"SELECT * FROM Ingredients t WHERE t.name LIKE '%{keyword}%' or t.pinyin LIKE '%{keyword}%' or t.initial LIKE '%{keyword}%'";
        var ingredients = await _dbContext.Ingredients.FromSqlRaw(selectSql).AsNoTracking().ToArrayAsync();

        return Json(ingredients);
    }
}