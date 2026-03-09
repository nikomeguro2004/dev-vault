import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, EntryInput, EntryWithRelations, Tag } from "@/lib/types";

type RawTag = {
  id: string;
  name: string;
};

type RawEntryTag = {
  tag: RawTag | null;
};

type RawEntry = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  what_it_is: string;
  how_it_works: string;
  when_to_use: string;
  pros: string;
  cons: string;
  example_code: string;
  notes: string;
  created_at: string;
  category:
    | {
        id: string;
        name: string;
        slug: string;
      }
    | {
        id: string;
        name: string;
        slug: string;
      }[]
    | null;
  entry_tags?: RawEntryTag[];
};

function decodeEscapedMultiline(value: string): string {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

function isRawTag(value: RawTag | null): value is RawTag {
  return value !== null;
}

function normalizeEntry(entry: RawEntry): EntryWithRelations {
  const normalizedCategory = Array.isArray(entry.category)
    ? (entry.category[0] ?? null)
    : entry.category;

  const tags: Tag[] = (entry.entry_tags ?? [])
    .map((item) => item.tag)
    .filter(isRawTag)
    .map((tag) => ({ id: tag.id, name: tag.name }));

  return {
    id: entry.id,
    title: decodeEscapedMultiline(entry.title),
    description: decodeEscapedMultiline(entry.description),
    category_id: entry.category_id,
    what_it_is: decodeEscapedMultiline(entry.what_it_is),
    how_it_works: decodeEscapedMultiline(entry.how_it_works),
    when_to_use: decodeEscapedMultiline(entry.when_to_use),
    pros: decodeEscapedMultiline(entry.pros),
    cons: decodeEscapedMultiline(entry.cons),
    example_code: decodeEscapedMultiline(entry.example_code),
    notes: decodeEscapedMultiline(entry.notes),
    created_at: entry.created_at,
    category: normalizedCategory,
    tags,
  };
}

export async function getCategories() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Category | null) ?? null;
}

export async function getEntries(params?: {
  categorySlug?: string;
  search?: string;
  tag?: string;
  limit?: number;
}) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("entries")
    .select(
      "id,title,description,category_id,what_it_is,how_it_works,when_to_use,pros,cons,example_code,notes,created_at,category:categories(id,name,slug),entry_tags(tag:tags(id,name))",
    )
    .order("created_at", { ascending: false });

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.categorySlug) {
    const category = await getCategoryBySlug(params.categorySlug);
    if (!category) {
      return [];
    }
    query = query.eq("category_id", category.id);
  }

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  let entries = ((data ?? []) as unknown as RawEntry[]).map(normalizeEntry);

  if (params?.tag) {
    entries = entries.filter((entry) =>
      entry.tags.some((tag) =>
        tag.name.toLowerCase().includes(params.tag!.toLowerCase()),
      ),
    );
  }

  return entries;
}

export async function getEntryById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id,title,description,category_id,what_it_is,how_it_works,when_to_use,pros,cons,example_code,notes,created_at,category:categories(id,name,slug),entry_tags(tag:tags(id,name))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeEntry(data as unknown as RawEntry) : null;
}

export async function getEntriesCount() {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getPopularTags(limit = 12) {
  const entries = await getEntries({ limit: 200 });
  const tagCount = new Map<string, number>();

  for (const entry of entries) {
    for (const tag of entry.tags) {
      tagCount.set(tag.name, (tagCount.get(tag.name) ?? 0) + 1);
    }
  }

  return [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export async function createEntry(input: EntryInput) {
  const supabase = createSupabaseServerClient();
  const category = await getCategoryBySlug(input.categorySlug);

  if (!category) {
    throw new Error("Category not found.");
  }

  const { data: entry, error: entryError } = await supabase
    .from("entries")
    .insert({
      title: input.title,
      description: input.description,
      category_id: category.id,
      what_it_is: input.what_it_is,
      how_it_works: input.how_it_works,
      when_to_use: input.when_to_use,
      pros: input.pros,
      cons: input.cons,
      example_code: input.example_code,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (entryError) {
    throw new Error(entryError.message);
  }

  await syncTagsForEntry(entry.id, input.tags);
  return entry.id;
}

export async function updateEntry(id: string, input: EntryInput) {
  const supabase = createSupabaseServerClient();
  const category = await getCategoryBySlug(input.categorySlug);

  if (!category) {
    throw new Error("Category not found.");
  }

  const { error } = await supabase
    .from("entries")
    .update({
      title: input.title,
      description: input.description,
      category_id: category.id,
      what_it_is: input.what_it_is,
      how_it_works: input.how_it_works,
      when_to_use: input.when_to_use,
      pros: input.pros,
      cons: input.cons,
      example_code: input.example_code,
      notes: input.notes,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await syncTagsForEntry(id, input.tags);
}

export async function deleteEntry(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

async function syncTagsForEntry(entryId: string, tags: string[]) {
  const cleanedTags = Array.from(
    new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  );

  const supabase = createSupabaseServerClient();
  const { error: deleteError } = await supabase
    .from("entry_tags")
    .delete()
    .eq("entry_id", entryId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (cleanedTags.length === 0) {
    return;
  }

  const tagIds: string[] = [];

  for (const name of cleanedTags) {
    const { data: existing, error: findError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (findError) {
      throw new Error(findError.message);
    }

    if (existing?.id) {
      tagIds.push(existing.id);
      continue;
    }

    const { data: created, error: insertError } = await supabase
      .from("tags")
      .insert({ name })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    tagIds.push(created.id);
  }

  const payload = tagIds.map((tagId) => ({ entry_id: entryId, tag_id: tagId }));
  const { error: relationError } = await supabase.from("entry_tags").insert(payload);
  if (relationError) {
    throw new Error(relationError.message);
  }
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}
