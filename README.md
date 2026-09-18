# UniPilot — Smart University Academic Management + AI Advisor

UniPilot là MVP đồ án Công nghệ phần mềm theo hướng: **hệ thống quản lý học vụ là phần chính, AI chỉ là module hỗ trợ cố vấn học tập**.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: NestJS + TypeScript
- ORM: Prisma
- Database: PostgreSQL
- AI: OpenAI-compatible provider (optional)
- Local infrastructure: Docker Compose

## Nguyên tắc kiến trúc

AI không được tự quyết định điều kiện tiên quyết. Luồng đúng là:

```text
Student data
   ↓
Academic Rule Engine
   ↓
Eligible courses
   ↓
AI Advisor
   ↓
Explanation / personalization
```

Nếu không cấu hình API key AI, backend vẫn chạy bằng deterministic fallback.

## Chức năng MVP

- Course catalog
- Prerequisite graph
- Student profile demo
- Tính môn đủ điều kiện
- Lập kế hoạch học kỳ theo giới hạn tín chỉ
- Xếp ưu tiên theo mục tiêu nghề nghiệp
- AI Academic Advisor
- React dashboard

## Chạy PostgreSQL

```bash
docker compose up -d
```

## Chạy backend

Yêu cầu Node.js 20+.

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

Windows PowerShell có thể dùng:

```powershell
Copy-Item .env.example .env
```

Backend: `http://localhost:5080`

Health check:

```text
GET http://localhost:5080/health
```

### AI optional

Trong `backend/.env`:

```env
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

Có thể thay bằng provider OpenAI-compatible khác.

## Chạy frontend

```bash
cd web
npm install
npm run dev
```

Frontend: `http://localhost:5174`

## API MVP

- `GET /health`
- `GET /api/courses`
- `GET /api/students/demo`
- `GET /api/advisor/eligible/demo?careerGoal=Backend%20Developer`
- `POST /api/advisor/plan/demo`

Ví dụ:

```json
{
  "careerGoal": "Backend Developer",
  "maxCredits": 12
}
```

## Cấu trúc backend

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── advisor/
│   ├── ai/
│   ├── courses/
│   ├── health/
│   ├── prisma/
│   └── students/
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Roadmap đồ án

1. Auth + JWT + refresh token + RBAC
2. Student / Lecturer / Advisor / Admin
3. Curriculum + semester + course section
4. Đăng ký học phần + kiểm tra trùng lịch
5. Attendance + grades + transcript + GPA
6. Graduation Planner + What-if Simulator
7. RAG trên curriculum/syllabus
8. pgvector cho semantic search
9. Redis + queue nếu AI workload tăng
10. Notification + audit log + test automation
11. Nếu cần ML thật: tách Python/FastAPI inference service thay vì đổi toàn bộ backend
