namespace SimpleGptChatHost.Api.Models;

public record SendMsgArg
{
    public SendMsgArg(ChatInfo[] chatInfos)
    {
        ChatInfos = chatInfos;
    }

    public ChatInfo[] ChatInfos { get; }
}