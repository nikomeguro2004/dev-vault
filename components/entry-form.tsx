import Link from "next/link";

import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/constants";
import type { EntryWithRelations } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function EntryForm({
  action,
  defaultValue,
  initialCategory,
  cancelHref,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValue?: EntryWithRelations;
  initialCategory?: string;
  cancelHref?: string;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="title" className="text-sm font-medium text-zinc-200">Title <span className="text-rose-400">*</span></label>
            <Input
              id="title"
              name="title"
              required
              maxLength={300}
              placeholder="e.g. React Server Components, Redis Caching, Playwright Setup"
              defaultValue={defaultValue?.title}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-200">Description <span className="text-rose-400">*</span></label>
            <Textarea
              id="description"
              name="description"
              required
              rows={2}
              placeholder="A concise one- or two-sentence summary of what this entry covers."
              defaultValue={defaultValue?.description}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="category" className="text-sm font-medium text-zinc-200">Category <span className="text-rose-400">*</span></label>
            <Select
              id="category"
              name="category"
              defaultValue={
                defaultValue?.category?.slug ??
                (initialCategory && CATEGORY_SLUGS.includes(initialCategory as (typeof CATEGORY_SLUGS)[number])
                  ? initialCategory
                  : CATEGORY_SLUGS[0])
              }
            >
              {CATEGORY_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {CATEGORY_META[slug].title}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage & Trade-offs</CardTitle>
          <p className="text-sm text-zinc-500">All fields support markdown. Use **bold**, inline code, and bullet lists freely.</p>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field
            name="when_to_use"
            label="When to use it"
            placeholder="Describe the ideal situations or patterns that call for this entry. Mention anti-patterns too."
            defaultValue={defaultValue?.when_to_use}
            className="sm:col-span-2"
          />
          <Field
            name="pros"
            label="Pros"
            placeholder="- Fast setup&#10;- Great DX&#10;- Active community"
            defaultValue={defaultValue?.pros}
          />
          <Field
            name="cons"
            label="Cons"
            placeholder="- Tight coupling&#10;- Limited SSR support&#10;- Large bundle size"
            defaultValue={defaultValue?.cons}
          />
          <Field
            name="notes"
            label="Notes"
            required={false}
            placeholder="Additional context, gotchas, links, or anything worth remembering. Markdown is supported."
            defaultValue={defaultValue?.notes}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-2">
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-semibold text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            Cancel
          </Link>
        ) : null}
        <FormSubmitButton label={submitLabel} pendingLabel="Saving..." size="lg" />
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  defaultValue,
  className,
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label htmlFor={name} className="text-sm font-medium text-zinc-200">
        {label}{required && <span className="ml-0.5 text-rose-400">*</span>}
      </label>
      <Textarea
        id={name}
        name={name}
        required={required}
        rows={4}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
