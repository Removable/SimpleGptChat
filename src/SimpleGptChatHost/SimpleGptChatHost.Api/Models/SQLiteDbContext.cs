using Microsoft.EntityFrameworkCore;

namespace SimpleGptChatHost.Api.Models;

public class SQLiteDbContext : DbContext
{
    public SQLiteDbContext(DbContextOptions<SQLiteDbContext> options) : base(options)
    {
    }

    public DbSet<Ingredient> Ingredients { get; set; }
}