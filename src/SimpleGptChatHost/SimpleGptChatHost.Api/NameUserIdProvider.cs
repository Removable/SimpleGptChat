using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace SimpleGptChatHost.Api;

public class NameUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst(ClaimTypes.Name)?.Value!;
    }
}