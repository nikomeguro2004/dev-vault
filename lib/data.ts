import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, EntryInput, EntryListItem, EntryWithRelations, Tag } from "@/lib/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Escape characters that break PostgREST filter string syntax (`,`, `(`, `)`)
 * and LIKE wildcards (`%`, `_`) so user search input is treated as a literal string.
 */
function sanitizeForLike(value: string): string {
  return value
    .trim()
    .slice(0, 200)
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/[(),]/g, "");
}

type RawTag = {
  id: string;
  name: string;
};

type RawEntryTag = {
  tag: RawTag | null;
};

type RawCategoryShape = { id: string; name: string; slug: string };

/** Minimal raw shape returned by list queries (no heavy text fields). */
type RawEntryListItem = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  created_at: string;
  category: RawCategoryShape | RawCategoryShape[] | null;
  entry_tags?: RawEntryTag[];
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

function normalizeEntryListItem(entry: RawEntryListItem): EntryListItem {
  const normalizedCategory = Array.isArray(entry.category)
    ? (entry.category[0] ?? null)
    : entry.category;

  const tags: Tag[] = (entry.entry_tags ?? [])
    .map((item) => item.tag)
    .filter(isRawTag)
    .map((tag) => ({ id: tag.id, name: tag.name }));

  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category_id: entry.category_id,
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
}): Promise<EntryListItem[]> {
  const supabase = createSupabaseServerClient();
  // Lean select — omits heavy text fields not needed by list/card views
  let query = supabase
    .from("entries")
    .select(
      "id,title,description,category_id,created_at,category:categories(id,name,slug),entry_tags(tag:tags(id,name))",
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
    const safe = sanitizeForLike(params.search);
    query = query.or(
      `title.ilike.%${safe}%,description.ilike.%${safe}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  let entries = ((data ?? []) as unknown as RawEntryListItem[]).map(normalizeEntryListItem);

  if (params?.tag) {
    const tagLower = params.tag.toLowerCase();
    entries = entries.filter((entry) =>
      entry.tags.some((tag) => tag.name.toLowerCase().includes(tagLower)),
    );
  }

  return entries;
}

export async function getEntryById(id: string) {
  if (!UUID_RE.test(id)) return null;
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
  // Query only the junction table + tag names — avoids fetching full entry rows
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entry_tags")
    .select("tag:tags(name)");

  if (error) throw new Error(error.message);

  const tagCount = new Map<string, number>();
  for (const row of data ?? []) {
    const tagObj = row.tag as unknown as { name: string } | { name: string }[] | null;
    const name = Array.isArray(tagObj) ? tagObj[0]?.name : tagObj?.name;
    if (name) tagCount.set(name, (tagCount.get(name) ?? 0) + 1);
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

  await assertNoDuplicateTitle(input.title);

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
    if (entryError.code === "23505") {
      throw new Error("An entry with this title already exists.");
    }
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

  await assertNoDuplicateTitle(input.title, id);

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
    if (error.code === "23505") {
      throw new Error("An entry with this title already exists.");
    }
    throw new Error(error.message);
  }

  await syncTagsForEntry(id, input.tags);
}

export async function deleteEntry(_id: string) {
  throw new Error("Deleting entries is disabled.");
}

async function assertNoDuplicateTitle(title: string, excludeId?: string) {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) return;

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .ilike("title", normalizedTitle);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  if ((count ?? 0) > 0) {
    throw new Error("An entry with this title already exists.");
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

  // Batch upsert all tags at once (replaces N sequential SELECT/INSERT queries)
  const { data: upsertedTags, error: upsertError } = await supabase
    .from("tags")
    .upsert(
      cleanedTags.map((name) => ({ name })),
      { onConflict: "name" },
    )
    .select("id, name");

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const payload = (upsertedTags ?? []).map((tag) => ({ entry_id: entryId, tag_id: tag.id }));
  const { error: relationError } = await supabase.from("entry_tags").insert(payload);
  if (relationError) {
    throw new Error(relationError.message);
  }
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}
