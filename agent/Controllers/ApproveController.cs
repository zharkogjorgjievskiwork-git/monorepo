using Agent.Models;
using Agent.Services;
using Microsoft.AspNetCore.Mvc;

namespace Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class ApproveController : ControllerBase
{
    private readonly DraftTranslator _translator;
    private readonly TimesheetApiClient _timesheetClient;
    private readonly ILogger<ApproveController> _logger;

    public ApproveController(
        DraftTranslator translator,
        TimesheetApiClient timesheetClient,
        ILogger<ApproveController> logger)
    {
        _translator = translator;
        _timesheetClient = timesheetClient;
        _logger = logger;
    }

    /// <summary>
    /// Accepts a draft timesheet, translates it, and submits to the existing Timesheet API.
    /// POST /approve
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApproveRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Approving draft for user {UserId} on {Date}",
            request.UserId, request.Draft.Date);

        var payload = _translator.Translate(request);
        var result = await _timesheetClient.SubmitAsync(payload, ct);

        if (!result.Success)
        {
            _logger.LogError("Approval failed: {Error}", result.Error);
            return StatusCode(502, new { error = result.Error });
        }

        return Ok(new { success = true, rows = payload.Rows.Count });
    }
}
