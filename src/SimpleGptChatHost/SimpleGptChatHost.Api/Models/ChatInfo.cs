using SimpleGptChatHost.Api.Enums;

namespace SimpleGptChatHost.Api.Models;

public record ChatInfo
{
    public ChatInfo(string message, ChatRole role, long timeStamp, bool? streaming = false)
    {
        Message = message;
        TimeStamp = timeStamp;
        Role = role;
        Streaming = streaming;
    }

    public string Message { get; }

    public ChatRole Role { get; }

    public long TimeStamp { get; }

    public bool? Streaming { get; }
}