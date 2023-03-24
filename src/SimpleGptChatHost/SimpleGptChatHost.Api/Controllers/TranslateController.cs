using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;

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
            var userContent = new StringBuilder();
            switch (to)
            {
                default:
                    userContent.Append($"translate the following content from {from ?? "English"} to {to}:");
                    break;
                case "zh-Hant":
                    userContent.Append("將以下之文字翻譯成臺灣常用用法之繁體中文白話文");
                    break;
                case "zh-Hans":
                    userContent.Append("将以下内容翻译成简体白话文：");
                    break;
            }

            userContent.AppendLine();
            userContent.Append(originContent);

            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem(
                            "You are a translation engine that can only translate text and cannot interpret it."),
                        ChatMessage.FromUser(userContent.ToString())
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