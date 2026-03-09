## Personal Developer Knowledge Hub

Creative developer vault built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and shadcn-style UI primitives.

### Features

- Dashboard-style home page with hero, quick category navigation, recent entries, favorite entries, and popular tags
- Category pages for `/frameworks`, `/modules`, `/tools`, `/prompts`, `/effects`
- Full entry pages with markdown rendering and syntax-highlighted code blocks
- Create, edit, and delete entries from the UI
- Search and tag filtering per category
- Glassmorphism cards, gradients, hover motion, and dark mode

### Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- shadcn-style components (local primitives)

### 1) Install

```bash
npm install
```

### 2) Configure Supabase

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

In Supabase SQL Editor, run `supabase/schema.sql`.

### 3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Project Structure

- `app/page.tsx`: dashboard home
- `app/[category]/page.tsx`: category listing with search and filters
- `app/entries/new/page.tsx`: create entry form
- `app/entries/[id]/page.tsx`: detailed entry page
- `app/entries/[id]/edit/page.tsx`: edit entry form
- `app/actions.ts`: server actions for CRUD
- `lib/data.ts`: Supabase queries and mutations
- `supabase/schema.sql`: schema + seed data

### Notes

- This app assumes your Supabase table policies allow read/write from the provided key.
- For production, add Row Level Security policies and auth.
