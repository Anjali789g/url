# Shortly — URL Shortener + Analytics

A beginner-friendly web app that turns long URLs into short links and later shows click analytics.

**Current status:** Phase 1 — project skeleton only. Shortening, database, Redis, and charts are not built yet.

## What you need on your computer

- [Node.js 20 or newer](https://nodejs.org) (this also installs `npm`)
- A free [Supabase](https://supabase.com) account (PostgreSQL in the cloud)
- A free [Upstash](https://upstash.com) account (Redis in the cloud)

You do **not** need to install PostgreSQL or Redis on your own machine.

## How to run this project (Phase 1)

1. Open a terminal in this folder.
2. Install packages (already done if you cloned this after setup):

   ```bash
   npm install
   ```

3. Copy the example environment file:

   ```bash
   copy .env.example .env.local
   ```

   On macOS or Linux, use `cp .env.example .env.local`.

4. You can leave the cloud keys empty for Phase 1. We only need them when we connect the database (Phase 2) and Redis (Phase 5).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

The home page should say **Shorten links. Track clicks.** Click **Dashboard** in the top menu to see the placeholder stats page.

## Useful commands

| Command | What it does |
|---------|----------------|
| `npm run dev` | Starts the local website with live reload |
| `npm run build` | Creates a production build (used later for deploy) |
| `npm run start` | Serves the production build |
| `npm run lint` | Checks the code for common mistakes |

## Folder map (simple English)

| Path | What it is |
|------|------------|
| `src/app/layout.tsx` | Shared chrome: title, header, and page wrapper |
| `src/app/page.tsx` | Home page |
| `src/app/dashboard/page.tsx` | Dashboard placeholder |
| `src/app/globals.css` | Global colors and Tailwind setup |
| `.env.example` | List of settings you will fill later (safe to share) |
| `.env.local` | Your real keys (never share this file) |
| `package.json` | Project name, scripts, and libraries |
| `next.config.ts` | Next.js settings |

## Coming next

- Phase 2: Connect Supabase PostgreSQL with Prisma
- Phase 3: Create short URLs and redirect
- Phase 4: Real analytics on the dashboard
- Phase 5: Upstash Redis cache and rate limiting
- Phase 6: Validation and security
- Phase 7: Tests
- Phase 8: Full README, GitHub, and deployment
