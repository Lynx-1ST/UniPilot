# UniPilot — Smart University Academic Management + AI Advisor

UniPilot is an MVP for a software-engineering capstone: the core product is a university academic management system, while AI is a small advisory module.

## Philosophy

- Academic rules stay deterministic.
- Prerequisites are checked by backend business logic.
- AI only explains/personalizes recommendations.
- The app still works without any AI API key.

## MVP features

- Course catalog
- Prerequisite graph
- Demo student profile
- Eligible-course calculation
- Credit-limited semester planning
- Career-goal-aware ranking
- Optional OpenAI-compatible advisor narration
- React dashboard

## Tech stack

- Backend: ASP.NET Core (.NET 10)
- Frontend: React + TypeScript + Vite
- Planned production DB: PostgreSQL + EF Core

## Run backend

```bash
cd backend/UniPilot.Api
dotnet run
```

API: `http://localhost:5080`

Optional AI configuration:

```env
AI_API_KEY=...
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

## Run frontend

```bash
cd web
npm install
npm run dev
```

Web: `http://localhost:5174`

## Next capstone milestones

1. PostgreSQL + EF Core migrations
2. JWT + Refresh Token + RBAC (Student/Lecturer/Advisor/Admin)
3. Curriculum, semesters, course sections
4. Course registration + timetable conflict detection
5. Attendance, grading, transcript, GPA
6. Graduation planner + what-if simulation
7. AI advisor grounded on curriculum documents
8. SignalR notifications
9. Audit log
10. xUnit + integration tests + Playwright
