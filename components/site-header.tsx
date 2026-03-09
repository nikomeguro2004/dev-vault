"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
          <span className="font-mono text-sm font-semibold tracking-wide text-zinc-200 transition-colors group-hover:text-cyan-300">
            DEV VAULT
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;
            const active = pathname === href;

            return (
            <Link
              key={slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-100"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
          <Link
            href="/how-to"
            aria-current={pathname === "/how-to" ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/how-to"
                ? "bg-cyan-500/15 text-cyan-100"
                : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Guide
          </Link>
        </nav>

      </div>

      <div className="border-t border-white/10 px-4 pb-3 md:hidden">
        <nav className="no-scrollbar flex gap-2 overflow-x-auto pt-3">
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;
            const active = pathname === href;

            return (
            <Link
              key={slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-colors ${
                active
                  ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
                  : "border-white/15 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-900/80"
              }`}
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
          <Link
            href="/how-to"
            aria-current={pathname === "/how-to" ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-colors ${
              pathname === "/how-to"
                ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
                : "border-white/15 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-900/80"
            }`}
          >
            <BookOpen className="h-3 w-3" />
            Guide
          </Link>
        </nav>
      </div>
    </header>
  );
}
