# Markly — Smart Bookmark Manager

A clean, real-time bookmark manager where you can save and organize your links. Built with **Next.js 15** (App Router), **Supabase** (Auth, PostgreSQL, Realtime), and **Tailwind CSS**.

Live URL: _[Add your Vercel deployment URL here]_

---

## Features

- **Google OAuth** — Sign in with your Google account (no email/password).
- **Add & Delete Bookmarks** — Save any URL with a title; remove it when you no longer need it.
- **Per-User Privacy** — Supabase Row Level Security ensures your bookmarks are invisible to other users.
- **Real-Time Sync** — Open two tabs, add a bookmark in one, and it instantly appears in the other — no page refresh needed.
- **Responsive Design** — Works smoothly on mobile, tablet, and desktop.

---

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Framework  | Next.js 15 (App Router)           |
| Auth       | Supabase Auth (Google OAuth)      |
| Database   | Supabase PostgreSQL               |
| Realtime   | Supabase Realtime (Postgres Changes) |
| Styling    | Tailwind CSS 4                    |
| Deployment | Vercel                            |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Configure Supabase

1. Create a new project on [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql` — this creates the `bookmarks` table, enables Row Level Security, and turns on Realtime.
3. In **Authentication → Providers**, enable **Google** and paste your Google OAuth Client ID and Client Secret.
4. Add your app's URL to the **Redirect URLs** list:
   - `http://localhost:3000/auth/callback` (local dev)
   - `https://your-app.vercel.app/auth/callback` (production)

### 3. Set environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find both values in **Supabase Dashboard → Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push your repo to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Add your Vercel domain to the Supabase **Redirect URLs** list: `https://your-app.vercel.app/auth/callback`.
5. Deploy 🚀

---

## Problems Faced & Solutions

### 1. OAuth callback losing session on production

**Problem:** After Google sign-in, the callback route redirected correctly in development but failed on Vercel because the `origin` didn't account for the forwarded host behind Vercel's proxy.

**Solution:** Checked `x-forwarded-host` header in the callback route and used `https://${forwardedHost}` for the redirect URL in production, while keeping `origin` for local development.

### 2. Real-time subscription not receiving events

**Problem:** After adding a bookmark, the second tab didn't update. The Supabase Realtime channel was subscribed but not receiving `postgres_changes` events.

**Solution:** The `bookmarks` table wasn't added to the `supabase_realtime` publication. Fixed by running `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;` in the SQL Editor. Also ensured the Realtime channel uses a `filter` on `user_id` so each client only receives events for their own bookmarks.

### 3. Duplicate bookmarks appearing after insert

**Problem:** When adding a bookmark, it appeared twice — once from the Supabase `INSERT` response and again from the Realtime subscription.

**Solution:** Added a deduplication check in the Realtime `INSERT` handler: before appending, verify the new bookmark's `id` doesn't already exist in the local state array.

### 4. Middleware cookie handling in server components

**Problem:** Supabase's `setAll` cookie method threw errors when called from a Server Component (where cookies are read-only).

**Solution:** Wrapped the `setAll` call in a try-catch. The middleware handles session refresh on every request, so the Server Component doesn't need to write cookies — it just reads them.

### 5. Tailwind v4 migration

**Problem:** Tailwind CSS 4 ships with `create-next-app` and uses the new `@import "tailwindcss"` approach instead of the `@tailwind` directives. Some older tutorials and references still use Tailwind v3 syntax.

**Solution:** Used the new `@theme inline` syntax for custom theme tokens and ensured all utility classes are compatible with Tailwind v4's design system.

---

## Project Structure

```
src/
├── app/
│   ├── api/auth/google/route.ts   # Initiates Google OAuth
│   ├── auth/
│   │   ├── callback/route.ts      # Handles OAuth callback
│   │   └── auth-code-error/page.tsx
│   ├── dashboard/page.tsx         # Main bookmarks page (protected)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
├── components/
│   ├── AddBookmarkForm.tsx
│   ├── BookmarkCard.tsx
│   ├── BookmarkList.tsx           # Real-time subscription
│   ├── EmptyState.tsx
│   └── Navbar.tsx
├── lib/supabase/
│   ├── client.ts                  # Browser client
│   ├── middleware.ts              # Session refresh
│   └── server.ts                  # Server client
├── types/bookmark.ts
└── middleware.ts                  # Next.js middleware
```

---

## License

MIT
