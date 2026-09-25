# FlowBoard

A team Kanban board built with React, TypeScript, and Vite, backed by Supabase (Auth + Postgres).

## Stack

- React 18 + TypeScript, bundled with Vite
- `react-router-dom` for routing (`/login`, `/boards`, `/boards/:boardId`)
- Supabase Auth (email/password, magic link) for real user accounts
- Supabase Postgres for boards, columns, and cards, with Row Level Security scoping every row to its owning user
- Plain CSS Modules for styling — no CSS framework

## Local development

1. Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and publishable key.
2. `npm install`
3. `npm run dev`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally

## Deployment

Deployed on Vercel, connected to this repository's `main` branch — every push triggers a new production deployment. The `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables must be set in the Vercel project settings.
