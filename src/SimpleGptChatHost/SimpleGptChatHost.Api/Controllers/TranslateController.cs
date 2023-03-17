using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;
using SimpleGptChatHost.Api.Enums;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class TranslateController : Controller
{
    private readonly IOpenAIService _openAiService;

    public TranslateController(IOpenAIService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost]
    public async Task<IActionResult> Translate([FromForm] string originContent, [FromForm] string to,
        [FromForm] string? from = null)
    {
        try
        {
            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem(
                            $"你是一个专业的翻译官，请将用户输入的所有内容翻译成{to}，语气活泼一些，并直接输出翻译结果。"),
                        ChatMessage.FromUser(originContent)
                    },
                });

            if (completionResult.Successful && completionResult.Choices.FirstOrDefault() is { } choice)
            {
                var msg = choice.Message.Content ?? "";
                return Ok(msg);
            }

            return Problem();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }
}