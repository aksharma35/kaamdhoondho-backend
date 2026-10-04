# KaamDhoondho Backend

Node.js + Express 5 REST API backed by PostgreSQL (Prisma ORM).

## Requirements

- Node.js 22+
- PostgreSQL 14+

## Getting started

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # then edit values
npm run db:migrate     # apply migrations to your local DB
npm run dev            # start with auto-reload
```

Health check: `GET http://localhost:5000/api/v1/health`

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start server with auto-reload |
| `npm start` | Start server (production) |
| `npm test` | Run unit + integration tests |
| `npm run db:migrate -- --name <name>` | Create & apply a migration after editing `schema.prisma` |
| `npm run db:deploy` | Apply pending migrations (CI / production) |
| `npm run db:reset` | Drop, re-create and re-seed the local DB |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

## Project structure

```
prisma/
  schema.prisma        # Database models (source of truth)
  migrations/          # Auto-generated SQL migrations — never edit after applying
  seed.js              # Development seed data
src/
  config/              # Env validation, DB client, logger
  routes/              # URL → middleware → controller wiring (no logic)
  controllers/         # HTTP layer: read req, call service, send response
  services/            # Business logic (no req/res)
  middlewares/         # Error handler, 404, validation, rate limiting
  validators/          # Zod request schemas
  utils/               # ApiError, ApiResponse, asyncHandler, pagination, constants
  app.js               # Express app (no listen — importable in tests)
  server.js            # Entry point: DB connect, listen, graceful shutdown
tests/
  unit/
  integration/
```

## Conventions

- **Request flow:** `route → middleware(s) → controller → service → prisma`
- **Errors:** throw `ApiError` (e.g. `ApiError.notFound('Job not found')`) anywhere; the central error
  handler formats it. Prisma and Zod errors are mapped automatically.
- **Responses:**
  - Success: `{ "success": true, "message": "...", "data": {...}, "meta"?: {...} }`
  - Error: `{ "success": false, "message": "...", "errors"?: [...] }`
- **Validation:** `validate({ body, query, params })` with Zod schemas from `src/validators/`.
- **File naming:** `<feature>.<layer>.js` — e.g. `job.controller.js`, `job.service.js`.
- **API versioning:** all routes are mounted under `API_PREFIX` (default `/api/v1`).
