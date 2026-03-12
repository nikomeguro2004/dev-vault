import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="border-beam panel-sheen glow-pulse relative overflow-hidden rounded-2xl border border-white/15 p-6 soft-shadow sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5 reveal-up">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">Developer Knowledge Hub</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your working memory for real-world engineering choices.
            </h1>
            <p className="max-w-2xl text-zinc-300">
              Store decisions with context, trade-offs, and caveats. Then find them fast with the global search in the nav.
            </p>
          </div>

          <div className="reveal-up rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-sm">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-zinc-400">
              <Sparkles className="h-3.5 w-3.5" />
              Clean Workflow
            </p>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-zinc-300">
                Capture decision + context
              </div>
              <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-zinc-300">
                Add pros, cons, and practical caveats
              </div>
              <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-zinc-300">
                Retrieve fast with global search and filters
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-beam panel-sheen rounded-2xl border border-white/15 p-5 soft-shadow sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Browse Categories</h2>
            <p className="mt-1 text-sm text-zinc-400">Open a lane and jump straight into focused knowledge.</p>
          </div>
        </div>

        <div className="stagger-reveal grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="group hover-lift relative block overflow-hidden rounded-xl border border-white/15 bg-black/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.07] focus-visible:-translate-y-0.5 focus-visible:border-white/35 focus-visible:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/60"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${CATEGORY_META[slug].gradient} opacity-75`}
              />
              <div className="flex items-center justify-between gap-4">
                <p className="text-base font-medium text-zinc-100">{CATEGORY_META[slug].title}</p>
                <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-200" />
              </div>

              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">Category</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:mt-0 md:max-h-0 md:overflow-hidden md:text-zinc-400 md:transition-all md:duration-250 md:group-hover:mt-3 md:group-hover:max-h-24 md:group-hover:text-zinc-300 md:group-focus-visible:mt-3 md:group-focus-visible:max-h-24 md:group-focus-visible:text-zinc-300">
                {CATEGORY_META[slug].description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
