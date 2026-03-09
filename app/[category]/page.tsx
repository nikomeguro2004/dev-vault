import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-(--panel) p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge>{CATEGORY_META[category].title}</Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{CATEGORY_META[category].title}</h1>
            <p className="mt-2 text-zinc-300">{CATEGORY_META[category].description}</p>
          </div>
          <Link href={`/entries/new?category=${category}`}>
            <Button>Add Entry</Button>
          </Link>
        </div>
      </section>

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" method="GET">
            <label htmlFor="category-search" className="sr-only">
              Search entries in {CATEGORY_META[category].title}
            </label>
            <Input
              id="category-search"
              name="q"
              placeholder="Search entries"
              defaultValue={query}
              autoFocus={!query}
            />
            <Button type="submit">Search</Button>
          </form>
          <p className="text-sm text-zinc-300">
            Showing {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {query ? ` matching \"${query}\"` : ""}
          </p>
          {query && (
            <div className="flex flex-wrap gap-2">
              <Link href={`/${category}`}>
                <Badge className="bg-rose-500/10 text-rose-300">Clear Search</Badge>
              </Link>
            </div>
          )}
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
