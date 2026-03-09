export const CATEGORY_SLUGS = [
  "frameworks",
  "tools",
  "packages",
  "backend-concepts",
  "devops",
  "platforms",
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
  tools: {
    title: "Tools",
    description: "Dev tooling and infrastructure knowledge snapshots.",
    gradient: "from-amber-400/70 via-orange-500/60 to-rose-500/70",
  },
  packages: {
    title: "Packages",
    description: "Common npm libraries and practical usage references.",
    gradient: "from-fuchsia-400/70 via-pink-500/60 to-rose-600/70",
  },
  "backend-concepts": {
    title: "Backend Concepts",
    description: "API, data, messaging, and reliability patterns for backend systems.",
    gradient: "from-lime-400/70 via-emerald-500/60 to-cyan-600/70",
  },
  devops: {
    title: "DevOps",
    description: "CI/CD, infrastructure, observability, and deployment operations.",
    gradient: "from-orange-400/70 via-red-500/60 to-rose-600/70",
  },
  platforms: {
    title: "Platforms",
    description: "Managed cloud and hosting platforms used to run and scale apps.",
    gradient: "from-sky-400/70 via-blue-500/60 to-violet-600/70",
  },
  effects: {
    title: "Effects",
    description: "Visual interaction patterns and delightful UI motion references.",
    gradient: "from-violet-400/70 via-sky-500/60 to-cyan-500/70",
  },
};
