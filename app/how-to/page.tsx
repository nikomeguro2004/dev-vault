import Link from "next/link";
import { ArrowRight, BookOpen, ChevronLeft, Code2, LayoutList, Lightbulb, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "How to Use — Developer Knowledge Hub",
  description: "Learn how to add and format entries in your developer vault.",
};

export default function HowToPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">How to Use</span>
      </nav>

      {/* Header */}
      <header className="hero-glow rounded-3xl border border-white/10 bg-(--panel) p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-400">
              Documentation
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How to use the vault
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
            This guide explains how to create well-structured entries, use markdown
            formatting, and write useful code examples.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/entries/new">
              <Button size="lg">
                <Pencil className="mr-2 h-4 w-4" />
                Create an Entry
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Quick links */}
      <nav aria-label="Page sections">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "#fields", icon: <LayoutList className="h-4 w-4" />, label: "Field guide" },
            { href: "#markdown", icon: <BookOpen className="h-4 w-4" />, label: "Markdown syntax" },
            { href: "#code", icon: <Code2 className="h-4 w-4" />, label: "Code examples" },
            { href: "#categories", icon: <LayoutList className="h-4 w-4" />, label: "Categories" },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-(--panel) px-4 py-3 text-sm font-medium text-zinc-300 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
            >
              <span className="text-cyan-400">{icon}</span>
              {label}
              <ArrowRight className="ml-auto h-3.5 w-3.5 text-zinc-600" />
            </a>
          ))}
        </div>
      </nav>

      {/* Step 1: Creating an entry */}
      <section className="space-y-4">
        <SectionHeader step="01" title="Creating an entry" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="text-zinc-300 leading-relaxed">
              Every entry in the vault follows a consistent structure with 9 fields. Some are required,
              some optional — but the more you fill in, the more useful the entry will be later.
            </p>
            <ol className="space-y-3">
              {[
                { n: 1, label: "Go to dashboard", desc: 'Click "Add Entry" or navigate to a category and click the + button.' },
                { n: 2, label: "Choose a category", desc: "Pick the most relevant category: Frameworks, Modules, Tools, or Effects." },
                { n: 3, label: "Fill in the core fields", desc: "Title, description, and category are the minimum required to save an entry." },
                { n: 4, label: "Add knowledge blocks", desc: "Write what it is, how it works, when to use it, pros/cons, and a code example." },
                { n: 5, label: "Save", desc: 'Click "Create Entry". The entry is immediately saved and searchable.' },
              ].map(({ n, label, desc }) => (
                <li key={n} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                    {n}
                  </span>
                  <div>
                    <span className="font-medium text-zinc-200">{label}</span>{" "}
                    <span className="text-zinc-400">{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Field guide */}
      <section id="fields" className="space-y-4 scroll-mt-24">
        <SectionHeader step="02" title="Field guide" />
        <div className="grid gap-4">
          {FIELD_GUIDE.map((field) => (
            <Card key={field.name} className="border-l-4 border-l-cyan-500/40">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{field.name}</CardTitle>
                  {field.required && (
                    <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-300">Required</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-zinc-300">{field.description}</p>
                {field.tip && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <p className="text-xs text-amber-200/80">{field.tip}</p>
                  </div>
                )}
                {field.example && (
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">
                    <code>{field.example}</code>
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Markdown guide */}
      <section id="markdown" className="space-y-4 scroll-mt-24">
        <SectionHeader step="03" title="Markdown syntax" />
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4 text-sm text-zinc-400">
              All text fields (What it is, How it works, Pros, Cons, Notes) support GitHub-flavoured markdown.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {MARKDOWN_CHEATSHEET.map(({ syntax, output, description }) => (
                <div
                  key={syntax}
                  className="rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-zinc-400">{syntax}</p>
                      <p className="text-sm font-medium text-zinc-200">{output}</p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-600">{description}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Code examples */}
      <section id="code" className="space-y-4 scroll-mt-24">
        <SectionHeader step="04" title="Code examples" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm text-zinc-300 leading-relaxed">
              The <strong className="text-zinc-100">Example code</strong> field is a plain code textarea — no backtick
              fences needed. Just paste your raw snippet and the vault wraps it in a syntax-highlighted block automatically.
            </p>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Do this ✓</p>
              <pre className="overflow-x-auto rounded-xl bg-zinc-900/70 px-4 py-3 text-xs text-zinc-300">
                <code>{`const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_TOKEN,
})`}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Not this ✗</p>
              <pre className="overflow-x-auto rounded-xl border border-rose-500/20 bg-rose-900/10 px-4 py-3 text-xs text-zinc-400">
                <code>{`\`\`\`ts
const client = createClient({ url: '...' })
\`\`\``}</code>
              </pre>
              <p className="text-xs text-zinc-500">Backtick fences are added automatically — adding them manually will break the display.</p>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
              <p className="text-sm text-cyan-200">
                <strong>Note:</strong> Code is always highlighted as TypeScript by default. For other languages,
                use the Notes field to add your snippet inside triple backticks with a language identifier (e.g.{" "}
                <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">```python</code>).
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Categories */}
      <section id="categories" className="space-y-4 scroll-mt-24">
        <SectionHeader step="05" title="Categories" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-sky-400" />
              <CardTitle className="text-base">Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed">
              There are 4 fixed categories. Choose the one that best matches the entry&apos;s type.
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              {[
                { name: "Frameworks", desc: "Architecture, runtime, ecosystems" },
                { name: "Modules", desc: "Reusable patterns: auth, cache, pagination" },
                { name: "Tools", desc: "Dev tooling, CLIs, infra" },
                { name: "Effects", desc: "Visual, animation, UI motion" },
              ].map(({ name, desc }) => (
                <li key={name} className="flex items-center gap-2">
                  <span className="w-24 shrink-0 font-medium text-zinc-300">{name}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Tips */}
      <section className="space-y-4">
        <SectionHeader step="06" title="Tips for great entries" />
        <div className="grid gap-3 sm:grid-cols-2">
          {TIPS.map(({ title, description }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl border border-white/10 bg-(--panel) p-4 backdrop-blur-xl"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-white/10 bg-(--panel) p-6 backdrop-blur-xl text-center space-y-4">
        <h2 className="text-xl font-semibold text-white">Ready to start?</h2>
        <p className="text-zinc-400">Create your first entry and start building your personal dev reference vault.</p>
        <Link href="/entries/new">
          <Button size="lg">
            <Pencil className="mr-2 h-4 w-4" />
            Create an Entry
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SectionHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold text-cyan-500">{step}</span>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

const FIELD_GUIDE = [
  {
    name: "Title",
    required: true,
    description:
      "A short, specific name for the entry. Treat it like a doc page title — descriptive enough to find at a glance.",
    tip: "Be specific. 'React Server Components' is better than 'RSC' or 'React stuff'.",
    example: "React Server Components\nRedis Caching Strategy\nESLint Flat Config Setup",
  },
  {
    name: "Description",
    required: true,
    description:
      "One or two sentences summarising what this entry is. This text appears in search results and cards — make it scan-friendly.",
    tip: "Write it as if explaining to a colleague in 10 seconds. No markdown here — plain prose works best.",
    example: "A Next.js pattern for running components exclusively on the server, reducing client bundle size and enabling direct DB access.",
  },
  {
    name: "Category",
    required: true,
    description: "The primary category bucket. Drives navigation and filtering across the vault.",
  },
  {
    name: "What it is",
    required: true,
    description:
      "Define the concept. Explain what it is in plain language, as if the reader has never heard of it.",
    tip: "Focus on the 'what', not the 'how'. Keep it under 5 sentences.",
    example: "A React Server Component is a component that renders on the server and sends HTML to the client, with no client-side JS bundle.",
  },
  {
    name: "How it works",
    required: true,
    description:
      "Describe the mechanism, lifecycle, or internals. Bullet lists work well here.",
    tip: "Think of this as the 'mental model' section. Use numbered steps for processes.",
    example: "1. Component tree renders on the server\n2. React serialises the result\n3. Client receives HTML + RSC payload\n4. Client hydrates interactive nodes only",
  },
  {
    name: "When to use it",
    required: true,
    description:
      "Describe ideal use cases and anti-patterns. Be honest about trade-offs.",
    tip: "Include both 'use when' and 'avoid when' to make the entry more useful as reference.",
  },
  {
    name: "Pros",
    required: true,
    description: "Key advantages. Use a markdown bullet list for readability.",
    example: "- Smaller client bundle\n- Direct DB/API access without an extra layer\n- Improved initial page load",
  },
  {
    name: "Cons",
    required: true,
    description: "Key drawbacks, limitations, or gotchas. Be candid.",
    example: "- No access to browser APIs (window, localStorage)\n- Can't use useState or useEffect\n- Requires careful boundary planning",
  },
  {
    name: "Example code",
    required: true,
    description:
      "A focused, runnable snippet. Raw code only — no triple-backtick fences. The vault wraps it in a TypeScript-highlighted block automatically.",
    tip: "Keep it short and self-contained. One file, one concept. Comments help.",
  },
  {
    name: "Notes",
    required: false,
    description:
      "Catch-all for additional context, links, migration notes, or anything that doesn't fit elsewhere. Full markdown supported.",
    tip: "Use this for external docs links, version-specific warnings, or related entries worth cross-referencing.",
    example: "See also: [Streaming UI patterns](/entries/xyz)\n\nDocs: https://react.dev/reference/rsc/server-components",
  },
];

const MARKDOWN_CHEATSHEET = [
  { syntax: "**bold**", output: "Bold text", description: "Strong emphasis" },
  { syntax: "*italic*", output: "Italic text", description: "Emphasis" },
  { syntax: "`code`", output: "Inline code", description: "Inline snippet" },
  { syntax: "# Heading", output: "H1 heading", description: "Section title" },
  { syntax: "## Heading", output: "H2 heading", description: "Subsection" },
  { syntax: "- item", output: "Bullet list", description: "Unordered list" },
  { syntax: "1. item", output: "Numbered list", description: "Ordered list" },
  { syntax: "> text", output: "Blockquote", description: "Callout / quote" },
  { syntax: "---", output: "Horizontal rule", description: "Divider" },
  { syntax: "[text](url)", output: "Hyperlink", description: "External link" },
  { syntax: "```ts\\ncode\\n```", output: "Code block", description: "Fenced code (Notes only)" },
  { syntax: "| col | col |", output: "Table", description: "Markdown table" },
];

const TIPS = [
  {
    title: "Write for future you",
    description:
      "Assume you'll read this 6 months from now with no context. Write what you'd wish you had documented.",
  },
  {
    title: "Use bullet lists over paragraphs",
    description:
      "Pros, cons, how-it-works and when-to-use fields are all easier to scan as bullet lists.",
  },
  {
    title: "Keep code examples minimal",
    description:
      "A 10-line snippet that captures the core pattern is more useful than a full module copy-paste.",
  },
  {
    title: "Link related entries in Notes",
    description:
      "Use the Notes field to cross-reference other vault entries. It builds a personal knowledge graph over time.",
  },
  {
    title: "Don't wait for perfection",
    description:
      "Stub entries with just title, description, and a quick code example are already valuable. You can always edit later.",
  },
];
