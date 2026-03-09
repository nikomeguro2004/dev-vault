import Link from "next/link";
import { BookOpen, ClipboardCheck, Sparkles } from "lucide-react";

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
        <span className="text-zinc-300">Create</span>
      </nav>

      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.2),transparent_42%),var(--panel)] p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              New knowledge record
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Create a new entry</h1>
            <p className="max-w-2xl text-zinc-300">
              Write for your future self: concise summary, clear usage conditions, and practical trade-offs.
            </p>
          </div>
          <Link
            href="/how-to"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Formatting guide
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <EntryForm
          action={createEntryAction}
          initialCategory={initialCategory}
          cancelHref={initialCategory ? `/${initialCategory}` : "/"}
          submitLabel="Create Entry"
        />

        <aside className="space-y-3 rounded-2xl border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.06),transparent_60%),var(--panel)] p-4 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Checklist</p>
          <div className="space-y-3 text-sm text-zinc-300">
            {[
              "Pick the most accurate category.",
              "Keep description under two short lines.",
              "Write pros/cons as scan-friendly bullets.",
              "Use notes for links and edge cases.",
            ].map((item) => (
              <p key={item} className="flex gap-2">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
