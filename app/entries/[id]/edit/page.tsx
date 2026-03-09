import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Eye } from "lucide-react";

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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Breadcrumb */}
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
        <Link href={`/entries/${id}`} className="max-w-[160px] truncate transition-colors hover:text-zinc-300">
          {entry.title}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Edit</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge>{entry.category?.name ?? "Unknown"}</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white">Edit entry</h1>
            <p className="max-w-xl text-zinc-400">{entry.title}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link
              href={`/entries/${id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200"
            >
              <Eye className="h-3.5 w-3.5" />
              View Entry
            </Link>
            <Link
              href="/how-to"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Formatting guide
            </Link>
          </div>
        </div>
      </div>

      <EntryForm
        action={updateEntryAction.bind(null, id)}
        defaultValue={entry}
        cancelHref={`/entries/${id}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
