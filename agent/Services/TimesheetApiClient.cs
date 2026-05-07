using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Agent.Models;

namespace Agent.Services;

public class TimesheetApiClient
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<TimesheetApiClient> _logger;

    public TimesheetApiClient(HttpClient http, IConfiguration config, ILogger<TimesheetApiClient> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task<ApproveResult> SubmitAsync(TimesheetApiRequest payload, CancellationToken ct = default)
    {
        var baseUrl = _config["TimesheetApi:BaseUrl"];
        var endpoint = _config["TimesheetApi:SubmitEndpoint"] ?? "/api/timesheets";

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            _logger.LogWarning("TimesheetApi:BaseUrl is not configured — returning stub success");
            // Stub: remove this block once the real API is configured
            return new ApproveResult(Success: true);
        }

        // Auth — swap this block for OBO token or API key once auth strategy is decided
        var authScheme = _config["TimesheetApi:AuthScheme"]; // "Bearer" or "ApiKey"
        var authValue = _config["TimesheetApi:AuthValue"];

        if (!string.IsNullOrWhiteSpace(authScheme) && !string.IsNullOrWhiteSpace(authValue))
        {
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(authScheme, authValue);
        }

        var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _http.PostAsync($"{baseUrl}{endpoint}", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Timesheet API returned {Status}: {Body}", response.StatusCode, body);
                return new ApproveResult(Success: false, Error: $"API error {(int)response.StatusCode}");
            }

            return new ApproveResult(Success: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to call Timesheet API");
            return new ApproveResult(Success: false, Error: ex.Message);
        }
    }
}
