using System.ComponentModel.DataAnnotations;

namespace SimpleGptChatHost.Api.Models;

public class Ingredient
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string PinYin { get; set; }
    public string Initial { get; set; }
}