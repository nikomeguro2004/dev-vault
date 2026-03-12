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
    <div className="mx-auto max-w-2xl reveal-up">
      <Card className="border-beam panel-sheen rounded-xl border-white/20 soft-shadow">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-300">
            We could not load this view. Try again, or go back to the dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={reset}>Try Again</Button>
            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
