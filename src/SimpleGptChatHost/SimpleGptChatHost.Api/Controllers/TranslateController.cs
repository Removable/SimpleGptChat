using System.Text;
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
            var userPrompt = $"translate from {from ?? "English"} to {to}.";
            switch (to)
            {
                case "zh-Hant":
                    userPrompt = "翻譯成台灣常用用法之繁體中文白話文";
                    break;
                case "zh-Hans":
                    userPrompt = "翻译成简体白话文";
                    break;
            }

            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem($"You are a translation engine that can only translate text and cannot interpret it."),
                        ChatMessage.FromUser(userPrompt),
                        ChatMessage.FromUser(originContent)
                    },
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