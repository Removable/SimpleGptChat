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
public class CodePlayground : Controller
{
    private readonly IOpenAIService _openAiService;

    public CodePlayground(IOpenAIService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost]
    public async Task<IActionResult> Play([FromForm] string code, [FromForm] string language)
    {
        try
        {
            var userPrompt = language switch
            {
                "Javascript" => "我要你充当Javascript的console。我输入Javascript代码",
                "C#" => "我要你充当C# Playground。我输入C#代码",
                "Python" => "我要你充当Python的interpreter。我输入Python代码",
                "PHP" => "我要你充当PHP的interpreter。我输入PHP代码",
                _ => "我要你充当终端。我输入代码"
            };
            userPrompt += "，你将显示会在控制台出现的内容。我希望你只在一个唯一的代码块内回复终端输出。不要写解释，或其他任何内容，除非我明确说明要这样做。";

            var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                new ChatCompletionCreateRequest
                {
                    Messages = new[]
                    {
                        ChatMessage.FromSystem("You are a helpful assistant."),
                        ChatMessage.FromUser(userPrompt),
                        ChatMessage.FromUser(code)
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