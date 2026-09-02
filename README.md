# Job Portal

Full-stack Job Portal Management System with separate **Admin** and **User** portals.

Admins manage job postings (CRUD). Users browse jobs and apply when logged in.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT access token + refresh token |

## Prerequisites

- Node.js 18+
- PostgreSQL, **or** Docker (for Postgres only)

## Setup

### 1. Database

```bash
docker compose up -d
```

Postgres is exposed on port **5433**.

Without Docker, create a database named `job_portal` and set `DATABASE_URL` in `backend/.env` to match your host/port.

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


## Environment

**Backend** (`backend/.env`) — copy from `backend/.env.example`:

- `DATABASE_URL` — must use port **5433** if using Docker Compose
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `PORT` — default `5000`
- `FRONTEND_URL` — default `http://localhost:5173`

**Frontend** (`frontend/.env`) — copy from `frontend/.env.example`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Demo accounts

Created by `npm run db:seed`. Public registration always creates a **USER**. There is no self-serve admin signup.

| Portal | URL | Email | Password |
|---|---|---|---|
| User | http://localhost:5173/login | user@jobportal.com | User@123 |
| Admin | http://localhost:5173/admin/login | admin@jobportal.com | Admin@123 |

## How to verify the assignment

Seed creates accounts only. Create at least one **Published** job so the landing page and job list have data.

1. Open `/admin/login` → sign in as admin.
2. Go to **Jobs** → **Add Job** → fill the form → set status to **Published**.
3. Open `/` — header, featured jobs, categories, footer.
4. Open `/jobs` — filters (category, experience, search, location) and pagination.
5. Open a job → `/login` as user (or register) → **Apply** (cover letter required).

## Admin portal

| URL | Page |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/jobs` | Job listing (category / experience filters, pagination) |
| `/admin/jobs/new` | Create job |
| `/admin/jobs/:id/edit` | Edit job |

Job CRUD, listing, and auth user state are handled through **Redux** and the API.

## User portal

| URL | Page |
|---|---|
| `/` | Landing — header, featured jobs, category section, footer |
| `/jobs` | Job listing — filters and pagination |
| `/jobs/:id` | Job details (from API) + apply if logged in |
| `/login` | User login |
| `/register` | User registration (optional extra) |
| `/my-applications` | User’s applications (optional extra) |

## Auth

- Login / register return **access token** and **refresh token**.
- Protected routes send `Authorization: Bearer <accessToken>`.
- Expired access tokens are refreshed via `POST /api/auth/refresh`.

## API

### Auth

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Bearer |

### Public jobs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/featured` | Public |
| GET | `/api/jobs/categories` | Public |
| GET | `/api/jobs/:id` | Public |

Query params on `GET /api/jobs`: `page`, `limit`, `category`, `experienceLevel`, `location`, `search`, `sort` (`newest` \| `oldest`).

### Applications (user)

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/applications` | USER |
| GET | `/api/applications/me` | USER |
| GET | `/api/applications/check/:jobId` | USER |

Apply body: `jobId`, `coverLetter` (min 20 characters), optional `resumeUrl`.

### Admin jobs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/dashboard/stats` | ADMIN |
| GET | `/api/admin/jobs` | ADMIN |
| GET | `/api/admin/jobs/:id` | ADMIN |
| POST | `/api/admin/jobs` | ADMIN |
| PUT | `/api/admin/jobs/:id` | ADMIN |
| DELETE | `/api/admin/jobs/:id` | ADMIN |

Admin list query: `page`, `limit`, `category`, `experienceLevel`, `search`.

`GET /api/health` — health check.

## Job fields

- **Category:** Engineering, Design, Marketing, Sales, Operations, HR, Other
- **Experience:** Intern, Junior, Mid, Senior, Lead
- **Status:** Draft, Published, Closed

Only **Published** jobs appear on the public site and can be applied to.
