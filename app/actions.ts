"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { createEntry, deleteEntry, updateEntry } from "@/lib/data";

const MAX_LEN = {
  title: 300,
  description: 2000,
  textField: 50_000,
};

function parsePayload(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categorySlug: String(formData.get("category") ?? ""),
    what_it_is: String(formData.get("what_it_is") ?? "").trim(),
    how_it_works: String(formData.get("how_it_works") ?? "").trim(),
    when_to_use: String(formData.get("when_to_use") ?? "").trim(),
    pros: String(formData.get("pros") ?? "").trim(),
    cons: String(formData.get("cons") ?? "").trim(),
    example_code: String(formData.get("example_code") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) =>
        t
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\-\.]/g, "")
          .slice(0, 50),
      )
      .filter(Boolean)
      .slice(0, 20),
  };
}

function validatePayload(payload: ReturnType<typeof parsePayload>) {
  if (!CATEGORY_SLUGS.includes(payload.categorySlug as CategorySlug)) {
    throw new Error("Invalid category.");
  }
  if (!payload.title) throw new Error("Title is required.");
  if (payload.title.length > MAX_LEN.title) throw new Error("Title is too long.");
  if (!payload.description) throw new Error("Description is required.");
  if (payload.description.length > MAX_LEN.description) throw new Error("Description is too long.");
  for (const field of [
    "what_it_is",
    "how_it_works",
    "when_to_use",
    "pros",
    "cons",
    "example_code",
    "notes",
  ] as const) {
    if (payload[field].length > MAX_LEN.textField) {
      throw new Error(`Field "${field}" exceeds the maximum allowed length.`);
    }
  }
}

export async function createEntryAction(formData: FormData) {
  const payload = parsePayload(formData);
  validatePayload(payload);
  const id = await createEntry(payload);

  revalidatePath("/");
  revalidatePath(`/${payload.categorySlug}`);
  redirect(`/entries/${id}`);
}

export async function updateEntryAction(id: string, formData: FormData) {
  const payload = parsePayload(formData);
  validatePayload(payload);
  await updateEntry(id, payload);

  revalidatePath("/");
  revalidatePath(`/${payload.categorySlug}`);
  revalidatePath(`/entries/${id}`);
  redirect(`/entries/${id}`);
}

export async function deleteEntryAction(id: string, categorySlug?: string) {
  await deleteEntry(id);
  revalidatePath("/");

  if (categorySlug && CATEGORY_SLUGS.includes(categorySlug as CategorySlug)) {
    revalidatePath(`/${categorySlug}`);
    redirect(`/${categorySlug}`);
  }

  redirect("/");
}
