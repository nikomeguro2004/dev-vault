import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, Pencil, Tag } from "lucide-react";
import type { Metadata } from "next";

import { deleteEntryAction } from "@/app/actions";
import { DeleteEntryButton } from "@/components/delete-entry-button";
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Breadcrumb */}
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
        <span className="max-w-[220px] truncate text-zinc-300">{entry.title}</span>
      </nav>

      {/* Hero Header */}
      <header className="rounded-3xl border border-white/10 bg-[var(--panel)] p-7 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{entry.category?.name ?? "Unknown"}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              {createdAt}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{entry.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">{entry.description}</p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag className="h-3.5 w-3.5 text-zinc-500" />
              {entry.tags.map((tag) => (
                <Badge key={tag.id}>#{tag.name}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
          <Link href={`/entries/${entry.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Entry
            </Button>
          </Link>
          <form action={deleteEntryAction.bind(null, entry.id, entry.category?.slug)}>
            <DeleteEntryButton title={entry.title} />
          </form>
          <Link href={entry.category?.slug ? `/${entry.category.slug}` : "/"} className="ml-auto">
            <Button variant="ghost">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* What it is + How it works */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="What it is" content={entry.what_it_is} accent="cyan" />
        <InfoCard title="How it works" content={entry.how_it_works} accent="sky" />
      </div>

      {/* When to use */}
      <InfoCard title="When to use it" content={entry.when_to_use} accent="indigo" />

      {/* Pros & Cons */}
      <div className="grid gap-4 md:grid-cols-2">
        <ProsConsCard title="Pros" content={entry.pros} type="pros" />
        <ProsConsCard title="Cons" content={entry.cons} type="cons" />
      </div>

      {/* Example Code */}
      {entry.example_code && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/10 bg-white/5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <CardTitle className="font-mono text-xs font-normal text-zinc-400">
                example.ts
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <MarkdownRenderer content={"```ts\n" + entry.example_code + "\n```"} />
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {entry.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={entry.notes} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const accentClasses = {
  cyan: "border-l-cyan-500",
  sky: "border-l-sky-500",
  indigo: "border-l-indigo-500",
} as const;

function InfoCard({
  title,
  content,
  accent = "cyan",
}: {
  title: string;
  content: string;
  accent?: keyof typeof accentClasses;
}) {
  if (!content) return null;
  return (
    <Card className={`border-l-4 ${accentClasses[accent]}`}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
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
    <Card className={type === "pros" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-rose-500"}>
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
