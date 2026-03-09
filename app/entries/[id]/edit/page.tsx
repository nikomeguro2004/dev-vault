import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";

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
        {entry.category?.slug ? (
          <>
            <Link href={`/${entry.category.slug}`} className="transition-colors hover:text-zinc-300">
              {entry.category.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <Link href={`/entries/${id}`} className="max-w-44 truncate transition-colors hover:text-zinc-300">
          {entry.title}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Edit</span>
      </nav>

      <section className="space-y-2 border-b border-white/15 pb-6">
        <Badge>{entry.category?.name ?? "Unknown"}</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Edit entry</h1>
        <p className="text-zinc-400">{entry.title}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <EntryForm
          action={updateEntryAction.bind(null, id)}
          defaultValue={entry}
          cancelHref={`/entries/${id}`}
          submitLabel="Save Changes"
        />

        <aside className="h-fit space-y-3 border border-white/15 p-4 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Editing Rules</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>Be specific in pros and cons.</li>
            <li>Avoid repeating description text.</li>
            <li>Update notes with current caveats.</li>
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
