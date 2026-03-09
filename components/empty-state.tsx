import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref}>
            <Button>{ctaLabel}</Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
