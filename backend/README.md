# Restaurant Management System — Backend (MVP)

A production-ready REST API for QR-based restaurant ordering, built with NestJS, Prisma, and PostgreSQL.

## Stack

- NestJS 10 + TypeScript
- PostgreSQL + Prisma ORM
- Zod (request validation)
- JWT auth (three token types: guest, employee, admin)
- Bcrypt (password hashing)
- Swagger (auto-generated API docs)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# edit .env — at minimum set DATABASE_URL and the three JWT secrets
```

### 3. Start Postgres (optional, if you don't already have one)

```bash
docker compose up -d
```

### 4. Run migrations & generate the Prisma client

```bash
npm run prisma:migrate
```

### 5. (Optional) Seed demo data

Creates a demo restaurant, branch, table, one menu item, and an admin login
(`admin@demo-restaurant.com` / `Admin@123`):

```bash
npm run prisma:seed
```

### 6. Run the server

```bash
npm run start:dev
```

API: `http://localhost:3000/api/v1`
Swagger docs: `http://localhost:3000/api/v1/docs`

## Authentication Model

| Actor    | How they authenticate                              | Token lifetime      | Scope |
|----------|------------------------------------------------------|----------------------|-------|
| Customer | `POST /auth/guest/token { tableId }` — no account    | Short (default 30m)  | View menu, place order, view own order/bill for that table |
| Employee | `POST /auth/login { email, password }`               | Access + refresh     | View/update orders for their own branch |
| Admin    | Same `/auth/login` endpoint — role is in the token    | Access + refresh     | Full access across all branches |

Every protected route requires `Authorization: Bearer <token>`. The single `JwtAuthGuard`
detects whether a token is a guest or staff token and normalizes both into `request.user`.
`@Roles(...)` + `RolesGuard` then enforce per-route authorization.

## Project Structure

```
src/
├── common/        # decorators, guards, filters, interceptors, pipes, shared utils
├── config/        # environment loading & validation
├── prisma/        # PrismaService/PrismaModule
├── modules/
│   ├── auth/       # guest token, employee/admin login, refresh
│   ├── restaurant/ # restaurant profile (admin)
│   ├── branch/     # branch CRUD (admin)
│   ├── employee/   # employee CRUD (admin) + "me" profile
│   ├── category/   # menu categories (public read, admin write)
│   ├── menu/        # menu items (public read, admin write)
│   ├── table/       # tables + auto-generated QR URLs (admin)
│   ├── order/       # guest order placement, staff order management
│   ├── payment/     # read-only bill info (no payment gateway)
│   ├── dashboard/   # admin & employee stats
│   └── health/      # liveness/readiness check
├── app.module.ts
└── main.ts
```

## API Response Shape

All responses share a consistent envelope via `ResponseInterceptor` / `HttpExceptionFilter`:

```json
{ "success": true, "message": "Order created successfully.", "data": { } }
```

```json
{ "success": false, "message": "Validation failed.", "errors": [] }
```

## Notes / Scope

This is intentionally an MVP per the spec: no payment gateway, no WebSockets, no
notifications, no multi-restaurant SaaS UI — but the schema (`restaurantId` on every
branch-scoped model) is already shaped so those can be layered on without a schema rewrite.

Redis was not introduced since nothing in the current MVP requires it (see spec: "Do not
introduce Redis unless there is a clear benefit").
