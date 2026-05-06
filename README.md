# AI Timesheet Agent — Monorepo

| Package | Stack | CI |
|---------|-------|----|
| `/agent` | .NET 8 Web API | `agent-ci` |
| `/panel` | React + TypeScript + Vite | `panel-ci` |

## Getting started

### Agent
```bash
cd agent
dotnet restore
dotnet run
```

### Panel
```bash
cd panel
npm install
npm run dev
```

## CI
Both pipelines run on every PR (lint + build). An empty PR will pass both green.
