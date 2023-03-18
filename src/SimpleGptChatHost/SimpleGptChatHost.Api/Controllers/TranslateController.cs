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
            var content = new StringBuilder(string.IsNullOrWhiteSpace(from) || from.Equals("auto", StringComparison.OrdinalIgnoreCase)
                ? $"请先判断出以下内容的语种，然后将其翻译为{to}"
                : $"请将以下的{from}内容翻译为{to}");
            content.Append("。我要你只返回翻译结果，不用对其进行解释或介绍，也不要告诉我语种的判断结果：");
            // content.Append("，并直接告诉我以下内容的翻译结果，除此之外请勿包含任何其他提示、询问等内容：");
            content.AppendLine();
            content.Append(originContent);

            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem(
                            $"现在你是一个专业的翻译员，翻译时不要带翻译腔，请翻译得准确、自然、流畅。"),
                        ChatMessage.FromUser(content.ToString())
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