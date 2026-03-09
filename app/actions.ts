"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEntry, deleteEntry, updateEntry } from "@/lib/data";

function parsePayload(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    categorySlug: String(formData.get("category") ?? ""),
    what_it_is: String(formData.get("what_it_is") ?? ""),
    how_it_works: String(formData.get("how_it_works") ?? ""),
    when_to_use: String(formData.get("when_to_use") ?? ""),
    pros: String(formData.get("pros") ?? ""),
    cons: String(formData.get("cons") ?? ""),
    example_code: String(formData.get("example_code") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export async function createEntryAction(formData: FormData) {
  const payload = parsePayload(formData);
  const id = await createEntry(payload);

  revalidatePath("/");
  revalidatePath(`/${payload.categorySlug}`);
  redirect(`/entries/${id}`);
}

export async function updateEntryAction(id: string, formData: FormData) {
  const payload = parsePayload(formData);
  await updateEntry(id, payload);

  revalidatePath("/");
  revalidatePath(`/${payload.categorySlug}`);
  revalidatePath(`/entries/${id}`);
  redirect(`/entries/${id}`);
}

export async function deleteEntryAction(id: string, categorySlug?: string) {
  await deleteEntry(id);
  revalidatePath("/");

  if (categorySlug) {
    revalidatePath(`/${categorySlug}`);
    redirect(`/${categorySlug}`);
  }

  redirect("/");
}
