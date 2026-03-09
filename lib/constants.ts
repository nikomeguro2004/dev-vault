export const CATEGORY_SLUGS = [
  "frameworks",
  "modules",
  "tools",
  "effects",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_META: Record<
  CategorySlug,
  { title: string; description: string; gradient: string }
> = {
  frameworks: {
    title: "Frameworks",
    description: "Architectures, runtimes, and ecosystem references.",
    gradient: "from-cyan-400/70 via-blue-500/60 to-indigo-600/70",
  },
  modules: {
    title: "Modules",
    description: "Reusable patterns such as auth, caching, and pagination.",
    gradient: "from-emerald-400/70 via-teal-500/60 to-cyan-600/70",
  },
  tools: {
    title: "Tools",
    description: "Dev tooling and infrastructure knowledge snapshots.",
    gradient: "from-amber-400/70 via-orange-500/60 to-rose-500/70",
  },
  effects: {
    title: "Effects",
    description: "Visual interaction patterns and delightful UI motion references.",
    gradient: "from-violet-400/70 via-sky-500/60 to-cyan-500/70",
  },
};
