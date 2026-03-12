import Link from "next/link";
import { ArrowUpDown, Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { getEntries } from "@/lib/data";

export const metadata = {
  title: "Search - Developer Knowledge Hub",
  description: "Search all entries and refine results by section and sort options.",
};

type SearchParams = {
  q?: string;
  category?: string | string[];
  sort?: string;
};

function normalizeToArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isCategorySlugValue(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}

function buildSearchHref({
  q,
  categories,
  sort,
}: {
  q: string;
  categories: CategorySlug[];
  sort: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (sort && sort !== "newest") params.set("sort", sort);
  categories.forEach((category) => params.append("category", category));

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;

  const query = (resolved.q ?? "").trim();
  const sort = (resolved.sort ?? "newest") as "newest" | "oldest" | "title-asc" | "title-desc";
  const selectedCategories = normalizeToArray(resolved.category).filter(isCategorySlugValue);

  const entries = await getEntries({
    search: query,
    categorySlugs: selectedCategories,
    sort,
  });
  const hasActiveFilters = Boolean(query || selectedCategories.length || sort !== "newest");

  return (
    <div className="space-y-6">
      <section className="border-beam panel-sheen reveal-up rounded-xl border border-white/15 p-5 soft-shadow">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Search</h1>
            <p className="mt-2 text-zinc-300">
              Explore entries across all sections and refine with filters on the left.
            </p>
          </div>
          <Badge className="border-white/25 text-zinc-100">{entries.length} results</Badge>
        </div>
      </section>

      <details className="lg:hidden">
        <summary className="inline-flex w-full cursor-pointer list-none items-center justify-center rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters & Sort
        </summary>
        <div className="mt-3">
          <Card className="border-beam panel-sheen rounded-xl border-white/20 soft-shadow">
            <CardContent className="space-y-5 p-4">
              <form method="GET" action="/search" className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="search-query-mobile" className="text-sm font-medium text-zinc-200">
                    Search text
                  </label>
                  <Input
                    id="search-query-mobile"
                    name="q"
                    placeholder="Title, description, pros, notes..."
                    defaultValue={query}
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-zinc-200">Sections</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {CATEGORY_SLUGS.map((slug) => {
                      const checked = selectedCategories.includes(slug);
                      return (
                        <label key={`mobile-${slug}`} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            name="category"
                            value={slug}
                            defaultChecked={checked}
                            className="h-4 w-4 rounded border-white/20 bg-zinc-900/60 text-zinc-200"
                          />
                          <span>{CATEGORY_META[slug].title}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <label htmlFor="sort-mobile" className="text-sm font-medium text-zinc-200">
                    Sort
                  </label>
                  <Select id="sort-mobile" name="sort" defaultValue={sort}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Apply
                  </Button>
                  <Link href="/search">
                    <Button type="button" variant="secondary">Reset</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </details>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="reveal-up hidden lg:sticky lg:top-24 lg:block lg:h-fit">
          <Card className="border-beam panel-sheen rounded-xl border-white/20 soft-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <form method="GET" action="/search" className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="search-query" className="text-sm font-medium text-zinc-200">
                    Search text
                  </label>
                  <Input
                    id="search-query"
                    name="q"
                    placeholder="Title, description, pros, notes..."
                    defaultValue={query}
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-zinc-200">Sections</legend>
                  <div className="space-y-2">
                    {CATEGORY_SLUGS.map((slug) => {
                      const checked = selectedCategories.includes(slug);
                      return (
                        <label key={slug} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            name="category"
                            value={slug}
                            defaultChecked={checked}
                            className="h-4 w-4 rounded border-white/20 bg-zinc-900/60 text-zinc-200"
                          />
                          <span>{CATEGORY_META[slug].title}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <label htmlFor="sort" className="text-sm font-medium text-zinc-200">
                    Sort
                  </label>
                  <Select id="sort" name="sort" defaultValue={sort}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Apply
                  </Button>
                  <Link href="/search">
                    <Button type="button" variant="secondary">Reset</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </aside>

        <section className="reveal-up space-y-4">
          <Card className="border-white/20">
            <CardContent className="space-y-3 p-4">
              <form action="/search" method="GET" className="flex w-full flex-wrap items-center gap-2">
                {selectedCategories.map((slug) => (
                  <input key={slug} type="hidden" name="category" value={slug} />
                ))}
                <input type="hidden" name="sort" value={sort} />
                <Input
                  name="q"
                  defaultValue={query}
                  placeholder="Search all entries"
                  className="w-full sm:w-85"
                />
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1 text-sm text-zinc-400">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>{entries.length} result{entries.length === 1 ? "" : "s"}</span>
                </div>

                {hasActiveFilters ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {query ? (
                      <Badge className="gap-1 border-cyan-300/40 bg-cyan-400/10 text-cyan-100">
                        q: {query}
                        <Link
                          href={buildSearchHref({ q: "", categories: selectedCategories, sort })}
                          className="inline-flex rounded p-0.5"
                          aria-label="Clear query"
                        >
                          <X className="h-3 w-3" />
                        </Link>
                      </Badge>
                    ) : null}

                    {selectedCategories.map((category) => {
                      const remaining = selectedCategories.filter((value) => value !== category);
                      return (
                        <Badge key={category} className="gap-1 border-white/30 bg-white/10 text-zinc-100">
                          {CATEGORY_META[category].title}
                          <Link
                            href={buildSearchHref({ q: query, categories: remaining, sort })}
                            className="inline-flex rounded p-0.5"
                            aria-label={`Remove ${CATEGORY_META[category].title} filter`}
                          >
                            <X className="h-3 w-3" />
                          </Link>
                        </Badge>
                      );
                    })}

                    {sort !== "newest" ? (
                      <Badge className="gap-1 border-white/30 bg-white/10 text-zinc-100">
                        sort: {sort}
                        <Link
                          href={buildSearchHref({ q: query, categories: selectedCategories, sort: "newest" })}
                          className="inline-flex rounded p-0.5"
                          aria-label="Reset sort"
                        >
                          <X className="h-3 w-3" />
                        </Link>
                      </Badge>
                    ) : null}

                    <Link href="/search" className="text-xs text-zinc-400 transition-colors hover:text-zinc-200">
                      Clear all
                    </Link>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {entries.length ? (
            <div className="stagger-reveal grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching entries"
              description="Try a broader query or remove one of the section filters."
              ctaHref="/search"
              ctaLabel="Reset Search"
            />
          )}
        </section>
      </div>
    </div>
  );
}
