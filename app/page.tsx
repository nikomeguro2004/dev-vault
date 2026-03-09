import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Plus, Zap } from "lucide-react";

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

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden rounded-3xl border border-white/10 bg-(--panel) p-8 shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-400">
                Developer Knowledge Hub
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your personal
              <br />
              <span className="bg-linear-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                dev reference vault.
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-zinc-300">
              Frameworks, backend concepts, DevOps, platforms, and more — all documented and searchable in one place.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/entries/new">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </Link>
              <Link href="/frameworks">
                <Button variant="secondary" size="lg">
                  <Layers className="mr-2 h-4 w-4" />
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
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-64">
            <StatCard icon={<Layers className="h-5 w-5 text-cyan-400" />} value={String(totalEntries)} label="Entries" />
            <StatCard icon={<Zap className="h-5 w-5 text-indigo-400" />} value={String(CATEGORY_SLUGS.length)} label="Categories" />
            <StatCard icon={<BookOpen className="h-5 w-5 text-violet-400" />} value="Always" label="Updated" />
            <StatCard icon={<Plus className="h-5 w-5 text-emerald-400" />} value={String(recentEntries.length)} label="Recent" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-white">Browse Categories</h2>
          <span className="text-sm text-zinc-500">{CATEGORY_SLUGS.length} categories</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {CATEGORY_SLUGS.map((slug) => (
            <Link key={slug} href={`/${slug}`} className="group block">
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-(--panel) p-5 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
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

      {/* Recent Entries + Sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <section className="space-y-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
            {recentEntries.length > 0 && (
              <Link href={`/${recentEntries[0].category?.slug ?? "frameworks"}`} className="text-sm text-cyan-400 transition-colors hover:text-cyan-300">
                View all →
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

        <aside className="space-y-6">
          <section>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-(--panel) p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">First time?</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                Read the guide to learn how to structure entries with markdown, code blocks, and pros/cons.
              </p>
              <Link href="/how-to" className="block">
                <Button variant="secondary" size="sm" className="mt-1 w-full">
                  Read the Guide →
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
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
      {icon}
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
    </div>
  );
}

