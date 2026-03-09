-- Enable UUID generation
create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category_id uuid not null references categories(id) on delete cascade,
  what_it_is text not null,
  how_it_works text not null,
  when_to_use text not null,
  pros text not null,
  cons text not null,
  example_code text not null,
  notes text not null,
  created_at timestamp with time zone not null default now()
);

drop table if exists entry_tags;
drop table if exists tags;

create index if not exists idx_entries_category_id on entries (category_id);
create index if not exists idx_entries_title on entries using gin (to_tsvector('english', title));
create index if not exists idx_entries_description on entries using gin (to_tsvector('english', description));
create unique index if not exists uq_entries_title_lower on entries ((lower(title)));

alter table if exists categories enable row level security;
alter table if exists entries enable row level security;

drop policy if exists categories_public_access on categories;
drop policy if exists entries_public_access on entries;

drop policy if exists categories_select_public on categories;
drop policy if exists categories_insert_public on categories;
drop policy if exists categories_update_public on categories;
drop policy if exists categories_delete_public on categories;

drop policy if exists entries_select_public on entries;
drop policy if exists entries_insert_public on entries;
drop policy if exists entries_update_public on entries;
drop policy if exists entries_delete_public on entries;

create policy categories_select_public
  on categories for select
  using (auth.role() in ('anon', 'authenticated'));
create policy categories_insert_public
  on categories for insert
  with check (auth.role() in ('anon', 'authenticated'));
create policy categories_update_public
  on categories for update
  using (auth.role() in ('anon', 'authenticated'))
  with check (auth.role() in ('anon', 'authenticated'));
create policy categories_delete_public
  on categories for delete
  using (auth.role() in ('anon', 'authenticated'));

create policy entries_select_public
  on entries for select
  using (auth.role() in ('anon', 'authenticated'));
create policy entries_insert_public
  on entries for insert
  with check (auth.role() in ('anon', 'authenticated'));
create policy entries_update_public
  on entries for update
  using (auth.role() in ('anon', 'authenticated'))
  with check (auth.role() in ('anon', 'authenticated'));
create policy entries_delete_public
  on entries for delete
  using (auth.role() in ('anon', 'authenticated'));

insert into categories (name, slug)
values
  ('Frameworks', 'frameworks'),
  ('Modules', 'modules'),
  ('Tools', 'tools'),
  ('Effects', 'effects')
on conflict (slug) do nothing;

-- Remove legacy prompts category if it exists.
-- Related entries are removed via FK cascade.
delete from categories where slug = 'prompts';

-- Sample entries
insert into entries (
  title,
  description,
  category_id,
  what_it_is,
  how_it_works,
  when_to_use,
  pros,
  cons,
  example_code,
  notes
)
select
  'Next.js',
  'React framework for SSR, SSG, and app routing.',
  c.id,
  'A production framework for building React applications with rendering strategies and routing baked in.',
  'It compiles and optimizes bundles, supports server components, and can execute code on server or edge.',
  'Use when you need SEO, full-stack capabilities, and performance-oriented defaults.',
  '- Great DX\n- Strong ecosystem\n- Flexible rendering options',
  '- Can feel complex for small projects\n- Frequent framework evolution',
  'export default function Page() {\n  return <h1>Hello Next.js</h1>;\n}',
  'Great default for product teams that want frontend and backend in one repo.'
from categories c
where c.slug = 'frameworks'
and not exists (
  select 1 from entries e where e.title = 'Next.js'
);

insert into entries (
  title,
  description,
  category_id,
  what_it_is,
  how_it_works,
  when_to_use,
  pros,
  cons,
  example_code,
  notes
)
select
  'Docker',
  'Container platform for reproducible development and deployment.',
  c.id,
  'A containerization engine that packages your application and dependencies into portable images.',
  'Containers share the host kernel while isolating process spaces, network, and filesystem layers.',
  'Use for local parity with production, CI pipelines, and service orchestration.',
  '- Consistent environments\n- Easy deployment packaging\n- Broad ecosystem',
  '- Learning curve\n- Extra runtime overhead',
  'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "run", "start"]',
  'Pair with docker compose for multi-service local environments.'
from categories c
where c.slug = 'tools'
and not exists (
  select 1 from entries e where e.title = 'Docker'
);

