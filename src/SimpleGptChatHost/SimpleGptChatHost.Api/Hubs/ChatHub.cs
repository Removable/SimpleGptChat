using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SimpleGptChatHost.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
}