"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="font-mono text-sm font-semibold tracking-[0.14em] text-zinc-200 transition-colors group-hover:text-white">
            DEV VAULT
          </span>
        </Link>

        <nav className="no-scrollbar hidden max-w-[68vw] items-center gap-1 overflow-x-auto lg:flex">
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;
            const active = pathname === href;

            return (
            <Link
              key={slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
          <Link
            href="/how-to"
            aria-current={pathname === "/how-to" ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              pathname === "/how-to"
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Guide
          </Link>
        </nav>

      </div>

      <div className="border-t border-white/10 px-4 pb-3 lg:hidden">
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto pt-3">
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;
            const active = pathname === href;

            return (
            <Link
              key={slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/15 bg-transparent text-zinc-300 hover:bg-white/5"
              }`}
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
          <Link
            href="/how-to"
            aria-current={pathname === "/how-to" ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              pathname === "/how-to"
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/15 bg-transparent text-zinc-300 hover:bg-white/5"
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
