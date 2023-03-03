using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;
using SimpleGptChatHost.Api.Enums;
using SimpleGptChatHost.Api.Hubs;
using SimpleGptChatHost.Api.Models;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class ChatController : Controller
{
    private readonly IOpenAIService _openAiService;
    private readonly IHubContext<ChatHub> _chatHubContext;

    public ChatController(IOpenAIService openAiService, IHubContext<ChatHub> chatHubContext)
    {
        _openAiService = openAiService;
        _chatHubContext = chatHubContext;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMsgArg arg)
    {
        if (string.IsNullOrWhiteSpace(User.Identity?.Name))
            return Unauthorized();

        var timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
        await _chatHubContext.Clients.User(User.Identity.Name).SendAsync("StreamChatMsg", string.Empty, timestamp, "2");

        try
        {
            var completionResult = _openAiService.ChatCompletion.CreateCompletionAsStream(new ChatCompletionCreateRequest
            {
                Messages = arg.ChatInfos.OrderBy(c => c.TimeStamp).Select(c =>
                {
                    switch (c.Role)
                    {
                        default:
                        case ChatRole.User:
                            return ChatMessage.FromUser(c.Message);
                        case ChatRole.Bot:
                            return ChatMessage.FromAssistant(c.Message);
                        case ChatRole.System:
                            return ChatMessage.FromSystem(c.Message);
                    }
                }).ToList()
            });

            await foreach (var completion in completionResult)
            {
                if (completion.Successful && completion.Choices.FirstOrDefault() is { } choice)
                {
                    await _chatHubContext.Clients.User(User.Identity.Name)
                        .SendAsync("StreamChatMsg", choice.Message.Content ?? string.Empty, timestamp, "1");
                }
                else
                {
                    if (completion.Error == null)
                    {
                        return Problem("Unknown Error");
                    }
                }
            }

            await _chatHubContext.Clients.User(User.Identity.Name)
                .SendAsync("StreamChatMsg", string.Empty, timestamp, "0");
            return Ok();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }
}