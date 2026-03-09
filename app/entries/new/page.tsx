import Link from "next/link";
import { BookOpen } from "lucide-react";

import { createEntryAction } from "@/app/actions";
import { EntryForm } from "@/components/entry-form";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";

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
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        {initialCategory ? (
          <>
            <Link href={`/${initialCategory}`} className="transition-colors hover:text-zinc-300">
              {CATEGORY_META[initialCategory as keyof typeof CATEGORY_META]?.title ?? initialCategory}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-zinc-300">New Entry</span>
      </nav>

      <section className="space-y-2 border-b border-white/15 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Create entry</h1>
        <p className="text-zinc-400">Keep the content direct, practical, and easy to scan later.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <EntryForm
          action={createEntryAction}
          initialCategory={initialCategory}
          cancelHref={initialCategory ? `/${initialCategory}` : "/"}
          submitLabel="Create Entry"
        />

        <aside className="h-fit space-y-3 border border-white/15 p-4 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Writing Checklist</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>State concrete use cases.</li>
            <li>List trade-offs clearly.</li>
            <li>Avoid vague one-liners.</li>
            <li>Use notes for links and caveats.</li>
          </ul>
          <Link href="/how-to" className="inline-flex items-center text-sm text-zinc-300 hover:text-white">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Open guide
          </Link>
        </aside>
      </div>
    </div>
  );
}
