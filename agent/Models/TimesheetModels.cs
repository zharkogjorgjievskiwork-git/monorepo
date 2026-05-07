namespace Agent.Models;

// Incoming from panel
public record DraftEntry(
    string Id,
    string Project,
    string Task,
    string Start,   // "HH:MM"
    string End,     // "HH:MM"
    double Hours,
    string Notes
);

public record DraftDay(
    string Date,
    List<DraftEntry> Entries
);

public record ApproveRequest(
    string UserId,
    DraftDay Draft
);

// Outgoing to existing Timesheet API
public record TimesheetRow(
    string UserId,
    string Date,
    string Project,
    string Task,
    double Hours,
    string StartTime,
    string EndTime,
    string Notes
);

public record TimesheetApiRequest(
    List<TimesheetRow> Rows
);

public record ApproveResult(
    bool Success,
    string? Error = null
);
