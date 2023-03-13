using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;
using SimpleGptChatHost.Api.Enums;
using SimpleGptChatHost.Api.Hubs;
using SimpleGptChatHost.Api.Models;
using System;

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

    private async Task SendTextMsg(string username, SendMsgArg arg)
    {
        var timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
        await _chatHubContext.Clients.User(username).SendAsync("StreamChatMsg", string.Empty, timestamp, "2");

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
                    await _chatHubContext.Clients.User(username)
                        .SendAsync("StreamChatMsg", choice.Message.Content ?? string.Empty, timestamp, "1");
                }
                else
                {
                    if (completion.Error == null)
                    {
                        throw new Exception("Unknown error");
                    }
                }
            }

            await _chatHubContext.Clients.User(username)
                .SendAsync("StreamChatMsg", string.Empty, timestamp, "0");
        }
        catch (Exception e)
        {
            await _chatHubContext.Clients.User(username)
                .SendAsync("StreamChatMsg", e.Message, timestamp, "0");
            throw;
        }
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMsgArg arg)
    {
        if (string.IsNullOrWhiteSpace(User.Identity?.Name))
            return Unauthorized();

        try
        {
            await SendTextMsg(User.Identity.Name, arg);
            return Ok();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> SendAudio([FromForm] IFormFile file)
    {
        if (string.IsNullOrWhiteSpace(User.Identity?.Name))
            return Unauthorized();

        if (file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        // file to byte[]
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        var bytes = memoryStream.ToArray();

        var transcriptionResponse = _openAiService.Audio.CreateTranscription(new AudioCreateTranscriptionRequest
        {
            File = bytes,
            FileName = "audio.mp3",
            // Language = language,
            Model = "whisper-1",
            Prompt = "",
            ResponseFormat = "text"
        });

        if (transcriptionResponse.Result.Successful)
        {
            var resultText = transcriptionResponse.Result.Text;
            return Ok(resultText);
        }
        else
        {
            return Problem();
        }
    }
}