import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Search, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { getEntries, isCategorySlug } from "@/lib/data";

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategorySlug(category)) return { title: "Not found" };
  const meta = CATEGORY_META[category as CategorySlug];
  return {
    title: `${meta.title} — Dev Vault`,
    description: meta.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!isCategorySlug(resolvedParams.category)) {
    notFound();
  }

  const category = resolvedParams.category as CategorySlug;
  const query = resolvedSearchParams.q?.trim() ?? "";

  const entries = await getEntries({
    categorySlug: category,
    search: query,
  });

  const categoryMeta = CATEGORY_META[category];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_38%),var(--panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-90" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <Badge>{categoryMeta.title}</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{categoryMeta.title}</h1>
            <p className="max-w-2xl text-zinc-300">{categoryMeta.description}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                {entries.length} visible {entries.length === 1 ? "entry" : "entries"}
              </span>
              {query ? (
                <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-cyan-200">
                  filtered by: {query}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Home
              </Button>
            </Link>
            <Link href={`/entries/new?category=${category}`}>
              <Button>Add Entry</Button>
            </Link>
          </div>
        </div>
      </section>

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <form className="grid gap-3 sm:grid-cols-[1fr_auto_auto]" method="GET">
            <label htmlFor="category-search" className="sr-only">
              Search entries in {categoryMeta.title}
            </label>
            <Input
              id="category-search"
              name="q"
              placeholder="Search by title or description"
              defaultValue={query}
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            {query ? (
              <Link href={`/${category}`}>
                <Button type="button" variant="secondary">Clear</Button>
              </Link>
            ) : null}
          </form>
          <p className="text-sm text-zinc-300">
            Showing {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {query ? ` matching \"${query}\"` : ""}
          </p>
        </CardContent>
      </Card>

      {entries.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No matching entries"
          description="Try a different search term or create a new entry for this category."
          ctaHref={`/entries/new?category=${category}`}
          ctaLabel="Add Entry"
        />
      )}
    </div>
  );
}
