# Moto Trip Planner (Next.js App Router)

Local/dev demo app for motorcycle riders planning trips.

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **No production DB**: uses **browser localStorage** for users, groups, and trips
- Includes **demo seed data** and a **dev auth bypass** toggle

## Features (core)

### Auth & Profiles
- Dev-only local auth (email + password stored in localStorage)
- Profile: name, bio
- Motorcycles list with details: brand, model, year, engine size (cc)

### Trips
- Create trips (public/private)
- Fields: title, description, starting point, start date & time, allowed engine size rule
- Creator is trip owner
- Trips can be **standalone** or belong to a **group**

### Groups
- Create groups (public/private)
- Join public groups

## Getting started

### 1) Install deps

```bash
cd moto-trip-planner
npm install
```

### 2) Run locally

```bash
npm run dev
```

Open:
- http://localhost:3000

## Notes

- This is meant for **localhost testing**.
- Auth is intentionally simple and not secure (dev-only).
- Demo seed data + auth bypass are controlled by `DEV_BYPASS_AUTH` in `src/lib/storage.ts`.
- Data lives in the browser:
  - open DevTools → Application → Local Storage
  - key: `motoTripPlanner.db`

## Project structure

- `src/app/` → App Router pages (`/auth`, `/profile`, `/trips`, `/groups`)
- `src/lib/models.ts` → core TypeScript models
- `src/lib/storage.ts` → localStorage “DB” + CRUD helpers
- `src/components/` → `AppShell`, `RequireAuth`
