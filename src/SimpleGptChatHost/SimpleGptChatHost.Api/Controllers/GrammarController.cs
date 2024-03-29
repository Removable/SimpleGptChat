using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;
using SimpleGptChatHost.Api.Hubs;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class GrammarController : Controller
{
    private readonly IOpenAIService _openAiService;

    public GrammarController(IOpenAIService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost]
    public async Task<IActionResult> Improve([FromForm] string originContent, [FromForm] string improveStyle)
    {
        try
        {
            improveStyle = improveStyle switch
            {
                "标准" => "一下",
                _ => $"得更{improveStyle}一些"
            };
            var userPrompt =
                $"我是非英语母语使用者，我希望你能协助我检查并修正句子中的语法等错误, 并在不改变原有意思的情况下将其润色{improveStyle}。 同时，我希望你只回复修改后的内容，不要回复任何其他内容，也不要写解释。";
            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem("You are a spelling corrector, grammar checker and improver."),
                        ChatMessage.FromUser(userPrompt),
                        ChatMessage.FromUser(originContent)
                    }
                });

            if (completionResult.Successful && completionResult.Choices.FirstOrDefault() is { } choice)
            {
                var msg = choice.Message.Content ?? "";
                return Ok(msg.Trim());
            }


            return Problem();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }
}