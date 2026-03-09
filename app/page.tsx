import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Layers,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";
import { getEntries, getEntriesCount } from "@/lib/data";

export default async function Home() {
  const [recentEntries, totalEntries] = await Promise.all([
    getEntries({ limit: 6 }),
    getEntriesCount(),
  ]);

  const featuredCategories = CATEGORY_SLUGS.slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="hero-glow relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_45%),radial-gradient(circle_at_20%_25%,rgba(251,146,60,0.2),transparent_40%),var(--panel)] p-7 shadow-2xl backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Personal Engineering Atlas
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build a sharper
              <span className="ml-3 bg-linear-to-r from-cyan-300 via-sky-300 to-orange-300 bg-clip-text text-transparent">
                technical memory
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-200 sm:text-lg">
              Capture decisions, trade-offs, and practical notes across frameworks, packages, backend concepts,
              DevOps, and platforms in one searchable vault.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link href="/entries/new">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Knowledge Entry
                </Button>
              </Link>
              <Link href="/frameworks">
                <Button variant="secondary" size="lg">
                  <Compass className="mr-2 h-4 w-4" />
                  Browse Vault
                </Button>
              </Link>
              <Link href="/how-to">
                <Button variant="ghost" size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  How to Use
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {featuredCategories.map((slug) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:border-white/30 hover:text-white"
                >
                  <span className={`h-1.5 w-1.5 rounded-full bg-linear-to-r ${CATEGORY_META[slug].gradient}`} />
                  {CATEGORY_META[slug].title}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard icon={<Layers className="h-4 w-4 text-cyan-300" />} value={String(totalEntries)} label="Total entries" />
            <StatCard icon={<Zap className="h-4 w-4 text-orange-300" />} value={String(CATEGORY_SLUGS.length)} label="Category lanes" />
            <StatCard icon={<BookOpen className="h-4 w-4 text-emerald-300" />} value={String(recentEntries.length)} label="Recent snapshots" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Knowledge Lanes</h2>
          <span className="text-xs uppercase tracking-wider text-zinc-500">{CATEGORY_SLUGS.length} lanes</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORY_SLUGS.map((slug) => (
            <Link key={slug} href={`/${slug}`} className="group block">
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.05),transparent_45%),var(--panel)] p-5 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
                <div className={`mb-4 h-1.5 w-full rounded-full bg-linear-to-r ${CATEGORY_META[slug].gradient}`} />
                <h3 className="font-semibold text-white">{CATEGORY_META[slug].title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{CATEGORY_META[slug].description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
            {recentEntries.length > 0 && (
              <Link href={`/${recentEntries[0].category?.slug ?? "frameworks"}`} className="text-sm text-cyan-400 transition-colors hover:text-cyan-300">
                Open lane <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          {recentEntries.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No entries yet"
              description="Start building your vault by creating your first entry."
              ctaHref="/entries/new"
              ctaLabel="Create First Entry"
            />
          )}
        </section>

        <aside className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.05),transparent_55%),var(--panel)] p-5 backdrop-blur-xl">
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-xs text-cyan-200">
              Keep entries short, specific, and decision-driven.
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Onboarding</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                Review the guide to structure entries with practical usage notes, pros/cons, and clean markdown.
              </p>
              <Link href="/how-to" className="block">
                <Button variant="secondary" size="sm" className="mt-1 w-full">
                  Read the Guide
                </Button>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
      <div className="mb-2 flex items-center gap-2">{icon}<span className="text-xs uppercase tracking-wide text-zinc-400">{label}</span></div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

