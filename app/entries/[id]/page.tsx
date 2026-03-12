import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, FileText, Pencil } from "lucide-react";
import type { Metadata } from "next";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEntryById } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) return { title: "Entry not found" };
  return {
    title: `${entry.title} - Dev Vault`,
    description: entry.description,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  const createdAt = new Date(entry.created_at).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        <Link href={entry.category?.slug ? `/${entry.category.slug}` : "/"} className="transition-colors hover:text-zinc-300">
          {entry.category?.name ?? "Unknown"}
        </Link>
        <span>/</span>
        <span className="min-w-0 max-w-56 truncate text-zinc-300">{entry.title}</span>
      </nav>

      <header className="border-beam panel-sheen reveal-up space-y-4 rounded-xl border border-white/15 p-5 pb-6 soft-shadow">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge>{entry.category?.name ?? "Unknown"}</Badge>
          <span className="inline-flex items-center gap-1 text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            {createdAt}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{entry.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/entries/${entry.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Entry
            </Button>
          </Link>
          <Link href={entry.category?.slug ? `/${entry.category.slug}` : "/"}>
            <Button variant="ghost">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <section className="space-y-4">
          <ContentCard title="Overview" content={entry.description} />
          <ContentCard title="When to use" content={entry.when_to_use} />
          <div className="grid gap-4 md:grid-cols-2">
            <ContentCard title="Pros" content={entry.pros} />
            <ContentCard title="Cons" content={entry.cons} />
          </div>
          {entry.notes ? <ContentCard title="Notes" content={entry.notes} /> : null}
        </section>

        <aside className="border-beam panel-sheen reveal-up h-fit space-y-3 rounded-xl border border-white/15 p-4 soft-shadow lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Metadata</p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">Category</dt>
              <dd className="text-zinc-200">{entry.category?.name ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created</dt>
              <dd className="text-zinc-200">{createdAt}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">ID</dt>
              <dd className="truncate font-mono text-xs text-zinc-300">{entry.id}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function ContentCard({ title, content }: { title: string; content: string }) {
  if (!content) return null;

  return (
    <Card className="hover-lift border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-zinc-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer content={content} />
      </CardContent>
    </Card>
  );
}
