import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { EntryWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EntryCard({ entry }: { entry: EntryWithRelations }) {
  return (
    <Link href={`/entries/${entry.id}`} className="group block">
      <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-cyan-500/20">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-base">{entry.title}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-cyan-500" />
          </div>
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{entry.description}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {entry.category?.name ?? "Unknown"}
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id}>#{tag.name}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
