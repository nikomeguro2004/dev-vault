import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Search } from "lucide-react";

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
    title: `${meta.title} - Dev Vault`,
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
  const entries = await getEntries({ categorySlug: category, search: query });

  return (
    <div className="space-y-6">
      <section className="space-y-3 border-b border-white/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge>{CATEGORY_META[category].title}</Badge>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{CATEGORY_META[category].title}</h1>
            <p className="mt-1 text-zinc-400">{CATEGORY_META[category].description}</p>
          </div>
          <div className="flex gap-2">
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
        <CardContent className="space-y-3 p-4 sm:p-5">
          <form className="grid gap-2 sm:grid-cols-[1fr_auto_auto]" method="GET">
            <label htmlFor="category-search" className="sr-only">
              Search entries in {CATEGORY_META[category].title}
            </label>
            <Input id="category-search" name="q" placeholder="Search entries" defaultValue={query} />
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
          <p className="text-sm text-zinc-400">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {query ? ` matching "${query}"` : ""}
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
          description="Try another search term or create a new entry."
          ctaHref={`/entries/new?category=${category}`}
          ctaLabel="Add Entry"
        />
      )}
    </div>
  );
}
