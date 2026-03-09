import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, FileText, Pencil, Tag } from "lucide-react";
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
    title: `${entry.title} — Dev Vault`,
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
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        <Link
          href={entry.category?.slug ? `/${entry.category.slug}` : "/"}
          className="transition-colors hover:text-zinc-300"
        >
          {entry.category?.name ?? "Unknown"}
        </Link>
        <span>/</span>
        <span className="max-w-55 truncate text-zinc-300">{entry.title}</span>
      </nav>

      <header className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.2),transparent_38%),var(--panel)] p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge>{entry.category?.name ?? "Unknown"}</Badge>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-zinc-400">
              <Calendar className="h-3 w-3" />
              Added {createdAt}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{entry.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-300">
            Decision snapshot for quick recall and better implementation choices.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
          <Link href={`/entries/${entry.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Entry
            </Button>
          </Link>
          <Link href={entry.category?.slug ? `/${entry.category.slug}` : "/"} className="ml-auto">
            <Button variant="ghost">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="space-y-4">
          <ContentCard title="Overview" icon={<FileText className="h-4 w-4 text-cyan-300" />} content={entry.description} />
          <ContentCard title="When to use" icon={<Tag className="h-4 w-4 text-sky-300" />} content={entry.when_to_use} />

          <div className="grid gap-4 md:grid-cols-2">
            <ProsConsCard title="Pros" content={entry.pros} type="pros" />
            <ProsConsCard title="Cons" content={entry.cons} type="cons" />
          </div>

          {entry.notes ? (
            <ContentCard title="Notes" icon={<FileText className="h-4 w-4 text-violet-300" />} content={entry.notes} />
          ) : null}
        </section>

        <aside className="space-y-3 rounded-2xl border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.06),transparent_60%),var(--panel)] p-4 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Entry meta</p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Category</dt>
              <dd className="text-zinc-200">{entry.category?.name ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Created</dt>
              <dd className="text-zinc-200">{createdAt}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Entry ID</dt>
              <dd className="truncate font-mono text-xs text-zinc-300">{entry.id}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function ContentCard({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
}) {
  if (!content) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer content={content} />
      </CardContent>
    </Card>
  );
}

function ProsConsCard({
  title,
  content,
  type,
}: {
  title: string;
  content: string;
  type: "pros" | "cons";
}) {
  if (!content) return null;
  return (
    <Card className={type === "pros" ? "border-l-4 border-l-emerald-500/70" : "border-l-4 border-l-rose-500/70"}>
      <CardHeader>
        <CardTitle
          className={`text-base ${type === "pros" ? "text-emerald-400" : "text-rose-400"}`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer content={content} />
      </CardContent>
    </Card>
  );
}
