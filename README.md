# Dev Vault

Personal developer knowledge hub for documenting and revisiting engineering knowledge in one place. Built with Next.js App Router, Supabase, and Tailwind CSS v4.

---

## Features

- **Dashboard home**: hero stats, category browser, recent entries, and quick onboarding card
- **8 category pages**: `/frameworks`, `/modules`, `/tools`, `/packages`, `/backend-concepts`, `/devops`, `/platforms`, `/effects`
- **Category search**: per-category search across title and description
- **Entry details**: structured sections (`When to use`, `Pros`, `Cons`) and notes
- **Create and edit flows**: server actions with strict validation
- **No delete flow**: deletion is disabled at UI and server layers
- **How-To guide**: formatting and writing conventions for high-quality entries
- **Sticky header + footer**: category navigation plus contact footer (`adihere2000@gmail.com`)
- **Dynamic metadata**: page titles/descriptions generated per route
- **Dark UI system**: forced dark theme with custom gradients and glassmorphism styling

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
  layout.tsx                # Root layout (fonts, ThemeProvider, SiteHeader, SiteFooter)
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
  entry-form.tsx            # Shared create/edit form
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
  data.ts                   # Supabase queries and mutations
  types.ts                  # TypeScript types (Entry, EntryListItem, EntryWithRelations, etc.)
  constants.ts              # CATEGORY_SLUGS, CATEGORY_META (titles, descriptions, gradients)
  supabase/
    server.ts               # createSupabaseServerClient()
  utils.ts                  # cn() helper (clsx + tailwind-merge)

supabase/
  schema.sql                # Tables (categories, entries), policies, and performance indexes
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

The provided schema enables RLS and creates permissive public policies (`anon`/`authenticated`) for personal usage.
For production, restrict policies and add authentication.

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
entries        id, title, description, category_id (FK), when_to_use, pros,
               cons, notes, created_at
```

Key indexes include:

- `entries(category_id)`
- `entries(created_at desc)`
- `entries(category_id, created_at desc)`
- full-text GIN indexes on `entries.title` and `entries.description`
- trigram GIN indexes on `entries.title` and `entries.description` for `ILIKE` search
- case-insensitive unique index on `lower(entries.title)`

---

## Routes

- `/` (Static): Dashboard home
- `/how-to` (Static): Formatting guide
- `/[category]` (Dynamic): Category listing (search)
- `/entries/new` (Dynamic): Create entry
- `/entries/[id]` (Dynamic): Entry detail
- `/entries/[id]/edit` (Dynamic): Edit entry

## Data Notes

- Category set is fixed in code (`lib/constants.ts`).
- Entries cannot be deleted from the app.
- Duplicate entry titles are blocked via a DB-level case-insensitive unique index.

## Contact

- Footer email: `adihere2000@gmail.com`
