import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { EntryListItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EntryCard({ entry }: { entry: EntryListItem }) {
  return (
    <Link href={`/entries/${entry.id}`} className="group block">
      <Card className="h-full transition-colors group-hover:border-white/30 group-hover:bg-white/5">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-base">{entry.title}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-200" />
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
