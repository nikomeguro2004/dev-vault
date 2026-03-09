# Dev Vault

Personal developer knowledge hub — a structured reference vault for frameworks, modules, tools, and UI effects. Built with Next.js App Router, Supabase, and Tailwind CSS v4.

---

## Features

- **Dashboard home** — hero with live stats (entry count and category count), category grid with gradient cards, recent entries, and a first-time guide nudge
- **7 category pages** — `/frameworks`, `/modules`, `/tools`, `/backend-concepts`, `/devops`, `/platforms`, `/effects` — each with search and entry grid
- **Entry detail pages** — breadcrumb nav, colour-coded knowledge sections (What it is, How it works, When to use, Pros/Cons), syntax-highlighted code block with copy button, and notes
- **Create / Edit** — write and update entries via Next.js Server Actions with server-side validation
- **How To page** — step-by-step guide, field reference, markdown cheatsheet, code formatting tips, categories reference
- **Search** — per-category full-text search (ILIKE across title + description)
- **Forced dark mode** — no light mode, no toggle, no flash
- **Security** — PostgREST injection prevention, UUID validation, server-side length/whitelist validation, HTTP security headers
- **Performance** — lean DB selects (list views omit heavy text fields), parallel data fetching, `display: swap` fonts
- **Per-page dynamic metadata** — browser tab titles and descriptions for every route

---

## Tech Stack

- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4 + `@tailwindcss/typography`
- Supabase (PostgreSQL)
- `@supabase/supabase-js` v2 (anon key, no auth)
- `react-markdown` + `remark-gfm` + `rehype-highlight`
- `lucide-react`
- Space Grotesk + JetBrains Mono via `next/font`
- Local shadcn-style UI components
- `next-themes` with `forcedTheme="dark"`

---

## Project Structure

```
app/
  page.tsx                  # Dashboard home (hero, categories, recent entries)
  layout.tsx                # Root layout (fonts, ThemeProvider, SiteHeader, skip nav)
  globals.css               # CSS variables, Tailwind base styles
  actions.ts                # Server Actions: createEntry, updateEntry
  [category]/
    page.tsx                # Category listing with search
  entries/
    new/page.tsx            # Create entry form
    [id]/
      page.tsx              # Entry detail view
      edit/page.tsx         # Edit entry form
  how-to/page.tsx           # Formatting guide (step-by-step, field reference, tips)

components/
  site-header.tsx           # Sticky header with category nav + guide link
  site-footer.tsx           # Footer with contact link
  entry-card.tsx            # Card used in list/grid views (lean EntryListItem type)
  entry-form.tsx            # Shared create/edit form with CodeField + Field components
  empty-state.tsx           # Dashed-border empty state card
  form-submit-button.tsx    # useFormStatus-aware submit button
  markdown-renderer.tsx     # prose-invert ReactMarkdown with copy-code button
  copy-code-button.tsx      # Clipboard copy button for code blocks
  providers/
    theme-provider.tsx      # next-themes wrapper (forcedTheme="dark")
  ui/
    badge.tsx               # Cyan pill badge
    button.tsx              # cva Button (default, secondary, ghost, destructive)
    card.tsx                # Glassmorphism card (Card, CardHeader, CardTitle, etc.)
    input.tsx               # Text input
    textarea.tsx            # Textarea
    select.tsx              # Native select

lib/
  data.ts                   # All Supabase queries and mutations
  types.ts                  # TypeScript types (Entry, EntryListItem, EntryWithRelations, etc.)
  constants.ts              # CATEGORY_SLUGS, CATEGORY_META (titles, descriptions, gradients)
  supabase/
    server.ts               # createSupabaseServerClient()
  utils.ts                  # cn() helper (clsx + tailwind-merge)

supabase/
  schema.sql                # Tables (categories, entries) + indexes
```

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure Supabase

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

In the Supabase SQL Editor, run `supabase/schema.sql` to create all tables and indexes.

> **Note:** The app uses the anon key with no Row Level Security enforced. Suitable for a private/personal vault. Do not expose this instance publicly without adding RLS policies.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build

```bash
npm run build
npm run start
```

---

## Database Schema

```
categories     id, name, slug, created_at
entries        id, title, description, category_id (FK), what_it_is, how_it_works,
               when_to_use, pros, cons, example_code, notes, created_at
```

Indexes on `entries.category_id`, `entries.title` (GIN full-text), and `entries.description` (GIN full-text).

---

## Routes

- `/` (Static): Dashboard home
- `/how-to` (Static): Formatting guide
- `/[category]` (Dynamic): Category listing (search)
- `/entries/new` (Dynamic): Create entry
- `/entries/[id]` (Dynamic): Entry detail
- `/entries/[id]/edit` (Dynamic): Edit entry

- For production, add Row Level Security policies and auth.
