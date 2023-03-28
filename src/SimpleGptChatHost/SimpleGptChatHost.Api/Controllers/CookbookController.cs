using System.Data;
using System.Data.SQLite;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class CookbookController : Controller
{
    private readonly SQLiteConnection _connection;

    public CookbookController(SQLiteConnection connection)
    {
        _connection = connection;
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetIngredients(string keyword)
    {
        var matchedIngredients = new List<dynamic>(210);
        _connection.Open();
        const string selectSql =
            "SELECT name, pinyin FROM Ingredients t WHERE t.name LIKE @keyword or t.pinyin LIKE @keyword or t.initial LIKE @keyword";
        using (var command = new SQLiteCommand(selectSql, _connection))
        {
            command.Parameters.Add(new SQLiteParameter("@keyword", DbType.String) { Value = $"%{keyword}%" });

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var name = reader["name"]?.ToString();
                    var pinyin = reader["pinyin"]?.ToString();
                    if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(pinyin)) continue;
                    matchedIngredients.Add(new
                    {
                        name,
                        pinyin
                    });
                }
            }
        }

        _connection.Close();
        return Json(matchedIngredients);
    }
}