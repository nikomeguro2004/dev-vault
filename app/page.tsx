import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Plus } from "lucide-react";

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
    <div className="space-y-10">
      <section className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">Developer Knowledge Hub</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A minimal vault for practical engineering decisions.
          </h1>
          <p className="max-w-2xl text-zinc-300">
            Store what to use, why it works, and where it fails. Keep entries short, specific, and searchable.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/entries/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </Link>
            <Link href="/frameworks">
              <Button variant="secondary">
                <Layers className="mr-2 h-4 w-4" />
                Browse Categories
              </Button>
            </Link>
            <Link href="/how-to">
              <Button variant="ghost">
                <BookOpen className="mr-2 h-4 w-4" />
                Guide
              </Button>
            </Link>
          </div>
        </div>

        <dl className="grid min-w-56 grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-zinc-500">Entries</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{totalEntries}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Categories</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{CATEGORY_SLUGS.length}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Categories</h2>
          <span className="text-sm text-zinc-500">{CATEGORY_SLUGS.length} lanes</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORY_SLUGS.map((slug) => (
            <Link key={slug} href={`/${slug}`} className="group rounded-md border border-white/15 p-4 transition-colors hover:border-white/30 hover:bg-white/5">
              <p className="text-base font-medium text-zinc-100">{CATEGORY_META[slug].title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{CATEGORY_META[slug].description}</p>
              <span className="mt-3 inline-flex items-center text-xs text-zinc-300">
                Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Recent Entries</h2>
          {recentEntries.length > 0 ? (
            <Link href={`/${recentEntries[0].category?.slug ?? "frameworks"}`} className="text-sm text-zinc-300 hover:text-white">
              View lane
            </Link>
          ) : null}
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
            description="Start by creating your first entry."
            ctaHref="/entries/new"
            ctaLabel="Create Entry"
          />
        )}
      </section>
    </div>
  );
}
