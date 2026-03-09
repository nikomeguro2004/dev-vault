import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Eye, PencilLine, Sparkles } from "lucide-react";

import { updateEntryAction } from "@/app/actions";
import { EntryForm } from "@/components/entry-form";
import { Badge } from "@/components/ui/badge";
import { getEntryById } from "@/lib/data";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        {entry.category?.slug && (
          <>
            <Link href={`/${entry.category.slug}`} className="transition-colors hover:text-zinc-300">
              {entry.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <Link href={`/entries/${id}`} className="max-w-40 truncate transition-colors hover:text-zinc-300">
          {entry.title}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Edit entry</span>
      </nav>

      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.2),transparent_40%),var(--panel)] p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge>{entry.category?.name ?? "Unknown"}</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Refine this entry</h1>
            <p className="max-w-2xl text-zinc-300">{entry.title}</p>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Keep wording practical and specific.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/entries/${id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
            <Link
              href="/how-to"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Guide
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <EntryForm
          action={updateEntryAction.bind(null, id)}
          defaultValue={entry}
          cancelHref={`/entries/${id}`}
          submitLabel="Save Changes"
        />

        <aside className="space-y-3 rounded-2xl border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.06),transparent_60%),var(--panel)] p-4 lg:sticky lg:top-24 lg:h-fit">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <PencilLine className="h-3.5 w-3.5" />
            Edit focus
          </p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>Keep language direct and avoid generic phrases.</li>
            <li>Ensure pros and cons describe real trade-offs.</li>
            <li>Add notes only if they help future implementation.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
