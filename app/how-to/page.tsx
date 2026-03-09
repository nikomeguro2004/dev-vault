import Link from "next/link";
import { ArrowRight, ChevronLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How to Use - Developer Knowledge Hub",
  description: "Entry structure and writing guidance for the developer vault.",
};

export default function HowToPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-8">
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-zinc-300">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-300">How to Use</span>
      </nav>

      <header className="space-y-5 border-b border-white/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Guide</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Write entries that are easy to scan and easy to trust.
        </h1>
        <p className="max-w-2xl text-zinc-300">
          Keep each entry practical. Focus on where it fits, where it fails, and the trade-offs that matter.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/entries/new">
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Create Entry
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav className="space-y-2 border-l border-white/15 pl-4 text-sm" aria-label="Sections">
            {[
              ["workflow", "Workflow"],
              ["template", "Template"],
              ["fields", "Field Guide"],
              ["markdown", "Markdown"],
              ["writing", "Writing"],
              ["categories", "Categories"],
            ].map(([href, label]) => (
              <a key={href} href={`#${href}`} className="block text-zinc-400 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="space-y-8">
          <GuideSection id="workflow" index="01" title="Workflow">
            <ol className="space-y-2 text-sm text-zinc-300">
              <li>1. Open a category or click Add Entry.</li>
              <li>2. Pick the most accurate category first.</li>
              <li>3. Fill title, description, and trade-off fields.</li>
              <li>4. Save and refine later as your understanding improves.</li>
            </ol>
          </GuideSection>

          <GuideSection id="template" index="02" title="Current Template">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/15 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Required</p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-200">
                  <li>Title</li>
                  <li>Description</li>
                  <li>Category</li>
                  <li>When to use</li>
                  <li>Pros</li>
                  <li>Cons</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/15 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Optional</p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-200">
                  <li>Notes</li>
                </ul>
                <p className="mt-3 text-xs text-zinc-400">Use Notes for links, caveats, and team conventions.</p>
              </div>
            </div>
          </GuideSection>

          <GuideSection id="fields" index="03" title="Field Guide">
            <div className="overflow-x-auto rounded-xl border border-white/15">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-white/15 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">What to write</th>
                  </tr>
                </thead>
                <tbody>
                  {FIELD_ROWS.map((row) => (
                    <tr key={row.field} className="border-b border-white/10 last:border-none">
                      <td className="px-4 py-3 font-medium text-zinc-100">{row.field}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.required}</td>
                      <td className="px-4 py-3 text-zinc-400">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GuideSection>

          <GuideSection id="markdown" index="04" title="Markdown">
            <div className="grid gap-3 sm:grid-cols-2">
              {MARKDOWN_ROWS.map((item) => (
                <div key={item.syntax} className="rounded-xl border border-white/15 p-3">
                  <p className="font-mono text-xs text-zinc-400">{item.syntax}</p>
                  <p className="mt-1 text-sm text-zinc-200">{item.output}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
                </div>
              ))}
            </div>
          </GuideSection>

          <GuideSection id="writing" index="05" title="Writing Rules">
            <div className="space-y-4">
              <div className="rounded-xl border border-white/15 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Good</p>
                <pre className="mt-2 overflow-x-auto text-xs text-zinc-300"><code>{GOOD_EXAMPLE}</code></pre>
              </div>
              <div className="rounded-xl border border-white/15 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Avoid</p>
                <pre className="mt-2 overflow-x-auto text-xs text-zinc-400"><code>{BAD_EXAMPLE}</code></pre>
              </div>
            </div>
          </GuideSection>

          <GuideSection id="categories" index="06" title="Categories">
            <ul className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
              {CATEGORIES.map((item) => (
                <li key={item.name} className="rounded-xl border border-white/15 p-3">
                  <p className="font-medium text-zinc-100">{item.name}</p>
                  <p className="mt-1 text-xs text-zinc-400">{item.desc}</p>
                </li>
              ))}
            </ul>
          </GuideSection>

          <section className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6">
            <p className="text-sm text-zinc-400">Keep entries short and update them when your approach changes.</p>
            <Link href="/entries/new" className="inline-flex items-center text-sm font-medium text-zinc-200 hover:text-white">
              Start a new entry <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

function GuideSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      <div className="flex items-baseline gap-3 border-b border-white/10 pb-2">
        <span className="font-mono text-xs text-zinc-500">{index}</span>
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

const FIELD_ROWS = [
  { field: "Title", required: "Yes", detail: "Specific name that is easy to search later." },
  { field: "Description", required: "Yes", detail: "One or two lines of plain summary." },
  { field: "Category", required: "Yes", detail: "Choose the best-fit lane for navigation." },
  { field: "When to use", required: "Yes", detail: "Include use cases and avoid cases." },
  { field: "Pros", required: "Yes", detail: "Bullet list of clear benefits." },
  { field: "Cons", required: "Yes", detail: "Bullet list of limits and costs." },
  { field: "Notes", required: "No", detail: "Links, migration caveats, and extra context." },
];

const MARKDOWN_ROWS = [
  { syntax: "**bold**", output: "Bold text", note: "Highlight key words" },
  { syntax: "`code`", output: "Inline code", note: "Commands, APIs, config keys" },
  { syntax: "- item", output: "Bullet list", note: "Best for pros/cons" },
  { syntax: "1. item", output: "Numbered list", note: "Ordered steps" },
  { syntax: "[text](url)", output: "Link", note: "Reference docs and specs" },
  { syntax: "```ts code ```", output: "Code block", note: "Use in notes when needed" },
];

const GOOD_EXAMPLE = `When to use
- Use in data-heavy pages with repeated API calls.
- Avoid when data is static at build time.

Pros
- Better cache reuse across screens.
- Reduces duplicate request logic.`;

const BAD_EXAMPLE = `When to use
Sometimes.

Pros
It is good.`;

const CATEGORIES = [
  { name: "Frameworks", desc: "Architecture, runtime, ecosystem choices" },
  { name: "Tools", desc: "CLI tooling and developer workflow" },
  { name: "Packages", desc: "Common npm dependencies" },
  { name: "Backend Concepts", desc: "APIs, caching, reliability patterns" },
  { name: "DevOps", desc: "CI/CD, infra, monitoring" },
  { name: "Platforms", desc: "Cloud and hosting products" },
  { name: "Effects", desc: "UI motion and interaction patterns" },
];
