import Link from "next/link";
import { BookOpen } from "lucide-react";

import { createEntryAction } from "@/app/actions";
import { EntryForm } from "@/components/entry-form";
import { CATEGORY_SLUGS } from "@/lib/constants";

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedCategory = resolvedSearchParams.category;
  const initialCategory =
    requestedCategory &&
    CATEGORY_SLUGS.includes(requestedCategory as (typeof CATEGORY_SLUGS)[number])
      ? requestedCategory
      : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        {initialCategory && (
          <>
            <Link href={`/${initialCategory}`} className="capitalize transition-colors hover:text-zinc-300">
              {initialCategory}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-300">New Entry</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create a new entry</h1>
            <p className="text-zinc-400">
              Fill in each section to keep your developer vault rich, searchable, and well-documented.
            </p>
          </div>
          <Link
            href="/how-to"
            className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200 sm:inline-flex"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Formatting guide
          </Link>
        </div>
      </div>

      <EntryForm
        action={createEntryAction}
        initialCategory={initialCategory}
        cancelHref={initialCategory ? `/${initialCategory}` : "/"}
        submitLabel="Create Entry"
      />
    </div>
  );
}
