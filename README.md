# Job Portal

Full-stack job portal with admin job management and user job browsing/application.

## Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)

## Setup

### 1. Database

```bash
docker compose up -d
```

Postgres runs on port **5433**.

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API: `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

## Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@jobportal.com | Admin@123 |
| User | user@jobportal.com | User@123 |

## API Endpoints

### Auth
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh | Public |
| GET | /api/auth/me | Bearer |

### Public Jobs
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/jobs | Public |
| GET | /api/jobs/featured | Public |
| GET | /api/jobs/categories | Public |
| GET | /api/jobs/:id | Public |

### Applications (User)
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/applications | USER |
| GET | /api/applications/me | USER |
| GET | /api/applications/check/:jobId | USER |

### Admin
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/admin/jobs | ADMIN |
| POST | /api/admin/jobs | ADMIN |
| PUT | /api/admin/jobs/:id | ADMIN |
| DELETE | /api/admin/jobs/:id | ADMIN |
| GET | /api/admin/dashboard/stats | ADMIN |
| GET | /api/admin/jobs/:jobId/applications | ADMIN |

## Routes

| URL | Description |
|---|---|
| / | Landing page |
| /jobs | Browse jobs |
| /jobs/:id | Job detail + apply |
| /login | User login |
| /register | User registration |
| /my-applications | User applications |
| /admin | Admin dashboard |
| /admin/jobs/:id/applications | View applications for a job |
