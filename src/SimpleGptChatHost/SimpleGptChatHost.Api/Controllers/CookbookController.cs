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
        var ingredients = await _dbContext.Ingredients.FromSqlRaw(selectSql).ToArrayAsync();

        // using (var command = new SQLiteCommand(selectSql, _dbContext))
        // {
        //     command.Parameters.Add(new SQLiteParameter("@keyword", DbType.String) { Value = $"%{keyword}%" });
        //
        //     using (var reader = command.ExecuteReader())
        //     {
        //         while (reader.Read())
        //         {
        //             var name = reader["name"]?.ToString();
        //             var pinyin = reader["pinyin"]?.ToString();
        //             if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(pinyin)) continue;
        //             matchedIngredients.Add(new
        //             {
        //                 name,
        //                 pinyin
        //             });
        //         }
        //     }
        // }

        return Json(ingredients);
    }
}