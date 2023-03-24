using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels.RequestModels;

namespace SimpleGptChatHost.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class MinutesController : Controller
{
    private readonly IOpenAIService _openAiService;

    public MinutesController(IOpenAIService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost]
    public async Task<IActionResult> SpeechToText([FromForm] IFormFile file, [FromForm] string? prompt = null,
        [FromForm] string? language = null)
    {
        try
        {
            if (file.Length <= 0)
                return BadRequest("No file");
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();
            var audioCreateTranscriptionRequest = new AudioCreateTranscriptionRequest
            {
                File = bytes,
                FileName = file.FileName,
                Language = language,
                Model = "whisper-1",
                Prompt = prompt,
                ResponseFormat = "json"
            };
            var transcriptionResponse = await _openAiService.Audio.CreateTranscription(audioCreateTranscriptionRequest);

            if (transcriptionResponse.Successful)
            {
                var text =
                    JsonSerializer.Deserialize<TranscriptionResponseText>(transcriptionResponse.Text);
                if (string.IsNullOrWhiteSpace(text?.Text)) return Problem();

                return Ok(text.Text);
            }

            return Problem();
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }
}

internal class TranscriptionResponseText
{
    public TranscriptionResponseText(string text)
    {
        Text = text;
    }

    [JsonPropertyName("text")] public string Text { get; set; }
}