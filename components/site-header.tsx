"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    if (window.matchMedia("(min-width: 1024px)").matches) {
      desktopInputRef.current?.focus();
      return;
    }

    mobileInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-2 transition-transform duration-200 ease-out hover:-translate-y-px">
          <span className="font-mono text-sm font-semibold tracking-[0.14em] text-zinc-200 transition-colors group-hover:text-white">
            DEV VAULT
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <nav
            className={`no-scrollbar flex max-w-[68vw] items-center gap-1 overflow-x-auto transition-all duration-200 ${
              searchOpen ? "pointer-events-none max-w-0 opacity-0" : "max-w-[68vw] opacity-100"
            }`}
            aria-hidden={searchOpen}
          >
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;

            return (
            <Link
              key={slug}
              href={href}
              className="shrink-0 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-[color,background-color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-white/5 hover:text-zinc-200"
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
          </nav>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSearchOpen((value) => !value)}
            aria-expanded={searchOpen}
            aria-controls="nav-search-form"
            className="hover-lift"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            <span className="ml-1.5">{searchOpen ? "Close" : "Search"}</span>
          </Button>

          <form
            id="nav-search-form"
            action="/search"
            method="GET"
            className={`flex items-center gap-2 overflow-hidden transition-all duration-200 ${searchOpen ? "w-85 opacity-100" : "w-0 opacity-0"}`}
            aria-hidden={!searchOpen}
          >
            <label htmlFor="nav-search-input" className="sr-only">
              Search all entries
            </label>
            <Input
              id="nav-search-input"
              ref={desktopInputRef}
              type="search"
              name="q"
              placeholder="Search vault..."
              tabIndex={searchOpen ? 0 : -1}
              disabled={!searchOpen}
              className="h-9 flex-1 border-white/20 bg-zinc-900/60"
            />
            <Button
              type="submit"
              size="sm"
              tabIndex={searchOpen ? 0 : -1}
              disabled={!searchOpen}
              aria-label="Submit search"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>

      </div>

      <div className="border-t border-white/10 px-4 pb-3 lg:hidden">
        <div className="flex items-center justify-between gap-2 pt-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSearchOpen((value) => !value)}
            aria-expanded={searchOpen}
            aria-controls="nav-search-form-mobile"
            className="hover-lift"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            <span className="ml-1.5">{searchOpen ? "Close" : "Search"}</span>
          </Button>

          <form
            id="nav-search-form-mobile"
            action="/search"
            method="GET"
            className={`flex items-center gap-2 overflow-hidden transition-all duration-200 ${searchOpen ? "w-full opacity-100" : "w-0 opacity-0"}`}
            aria-hidden={!searchOpen}
          >
            <label htmlFor="nav-search-input-mobile" className="sr-only">
              Search all entries
            </label>
            <Input
              id="nav-search-input-mobile"
              ref={mobileInputRef}
              type="search"
              name="q"
              placeholder="Search vault..."
              tabIndex={searchOpen ? 0 : -1}
              disabled={!searchOpen}
              className="h-9 flex-1 border-white/20 bg-zinc-900/60"
            />
            <Button
              type="submit"
              size="sm"
              tabIndex={searchOpen ? 0 : -1}
              disabled={!searchOpen}
              aria-label="Submit search"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>

        <nav
          className={`no-scrollbar flex gap-1.5 overflow-x-auto transition-all duration-200 ${searchOpen ? "max-h-0 opacity-0 pt-0" : "max-h-20 opacity-100 pt-3"}`}
          aria-hidden={searchOpen}
        >
          {CATEGORY_SLUGS.map((slug) => {
            const href = `/${slug}`;

            return (
            <Link
              key={slug}
              href={href}
              className="shrink-0 rounded-md border border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-300 transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-white/5"
            >
              {CATEGORY_META[slug].title}
            </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
