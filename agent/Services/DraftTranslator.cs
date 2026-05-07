using Agent.Models;

namespace Agent.Services;

public class DraftTranslator
{
    /// <summary>
    /// Translates a draft day into the payload the existing Timesheet API expects.
    /// Adjust the mapping here once the existing API contract is known.
    /// </summary>
    public TimesheetApiRequest Translate(ApproveRequest request)
    {
        var rows = request.Draft.Entries.Select(entry => new TimesheetRow(
            UserId: request.UserId,
            Date: request.Draft.Date,
            Project: entry.Project,
            Task: entry.Task,
            Hours: entry.Hours,
            StartTime: entry.Start,
            EndTime: entry.End,
            Notes: entry.Notes
        )).ToList();

        return new TimesheetApiRequest(rows);
    }
}
