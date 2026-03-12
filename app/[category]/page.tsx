import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;

  if (!isCategorySlug(resolvedParams.category)) {
    notFound();
  }

  const category = resolvedParams.category as CategorySlug;
  const entries = await getEntries({ categorySlug: category });

  return (
    <div className="space-y-6">
      <section className="border-beam panel-sheen reveal-up space-y-3 rounded-xl border border-white/15 p-5 pb-6 soft-shadow">
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
          </div>
        </div>
      </section>

      <p className="text-sm text-zinc-400">
        {entries.length} {entries.length === 1 ? "entry" : "entries"}
      </p>

      {entries.length ? (
        <section className="stagger-reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No entries yet"
          description="No entries are available in this category yet."
        />
      )}
    </div>
  );
}
