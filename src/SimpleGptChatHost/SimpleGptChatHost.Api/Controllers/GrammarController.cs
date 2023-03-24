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

    public GrammarController(IOpenAIService openAiService, IHubContext<ChatHub> chatHubContext)
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
                "standard" => string.Empty,
                "expand" => " and expand them",
                "contract" => " and contract them",
                _ => $" that would make them more {improveStyle}"
            };
            var userPrompt =
                $"I would like you to do some grammar and spelling checks on the sentences I input and give suggestions on style, tone, and sentence structure{improveStyle} without changing their original meaning. I want you to only reply the correction, the improvements and nothing else, do not write explanations.";
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