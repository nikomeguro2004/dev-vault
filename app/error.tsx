"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            We could not load this view. Try again, or go back to the dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={reset}>Try Again</Button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-zinc-900 backdrop-blur-xl transition-colors hover:bg-white/20 dark:border-white/15 dark:text-zinc-100"
            >
              Back Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
