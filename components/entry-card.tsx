import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import type { EntryListItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EntryCard({ entry }: { entry: EntryListItem }) {
  const slug = entry.category?.slug;
  const isValidSlug = slug != null && (CATEGORY_SLUGS as readonly string[]).includes(slug);
  const gradient = isValidSlug ? CATEGORY_META[slug as CategorySlug].gradient : null;

  return (
    <Link href={`/entries/${entry.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-cyan-500/20">
        {gradient && (
          <div className={`h-1 w-full bg-linear-to-r ${gradient}`} />
        )}
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-base">{entry.title}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-cyan-500" />
          </div>
          <p className="line-clamp-2 text-sm text-zinc-300">{entry.description}</p>
        </CardHeader>
        <CardContent>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            {entry.category?.name ?? "Unknown"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
