using System.Configuration;
using System.Data.SQLite;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using OpenAI.GPT3.Extensions;
using OpenAI.GPT3.ObjectModels;
using SimpleGptChatHost.Api;
using SimpleGptChatHost.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);
var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IUserIdProvider, NameUserIdProvider>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p =>
    {
        p.WithOrigins(origins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR().AddJsonProtocol(options =>
{
    options.PayloadSerializerOptions.PropertyNamingPolicy = null;
});

#region Add Authentication

builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration.GetSection("AuthOptions:Authority").Get<string>();
        options.Audience = builder.Configuration.GetSection("AuthOptions:Audience").Get<string>();
        options.TokenValidationParameters.ValidTypes =
            builder.Configuration.GetSection("AuthOptions:TokenValidTypes").Get<string[]>();
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    // Read the token out of the query string
                    context.Token = accessToken;

                return Task.CompletedTask;
            },
            //验证失败时
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    context.Response.Headers.Add("act", "expired");

                return Task.CompletedTask;
            }
        };
    });

#endregion

builder.Services.AddOpenAIService(options =>
{
    options.ApiKey = builder.Configuration.GetSection("OpenAiApiKey").Get<string>();
    options.DefaultModelId = Models.ChatGpt3_5Turbo;
});

builder.Services.AddScoped<SQLiteConnection>(_ => new SQLiteConnection(builder.Configuration.GetConnectionString("SQLiteConnection")));

var app = builder.Build();

app.UseRouting();

// 以下是.NET Core 针对websocket同源限制做出的跨域策略
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120)
};
foreach (var origin in origins) webSocketOptions.AllowedOrigins.Add(origin);
app.UseWebSockets(webSocketOptions);

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

Console.OutputEncoding = Encoding.UTF8;

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

await app.RunAsync();