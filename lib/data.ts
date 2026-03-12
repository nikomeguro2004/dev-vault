import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, EntryInput, EntryListItem, EntryWithRelations } from "@/lib/types";

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

type RawCategoryShape = { id: string; name: string; slug: string };

type RawEntryListItem = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  created_at: string;
  category: RawCategoryShape | RawCategoryShape[] | null;
};

type RawEntry = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  when_to_use: string;
  pros: string;
  cons: string;
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
};

function decodeEscapedMultiline(value: string): string {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

function normalizeEntry(entry: RawEntry): EntryWithRelations {
  const normalizedCategory = Array.isArray(entry.category)
    ? (entry.category[0] ?? null)
    : entry.category;

  return {
    id: entry.id,
    title: decodeEscapedMultiline(entry.title),
    description: decodeEscapedMultiline(entry.description),
    category_id: entry.category_id,
    when_to_use: decodeEscapedMultiline(entry.when_to_use),
    pros: decodeEscapedMultiline(entry.pros),
    cons: decodeEscapedMultiline(entry.cons),
    notes: decodeEscapedMultiline(entry.notes),
    created_at: entry.created_at,
    category: normalizedCategory,
  };
}

function normalizeEntryListItem(entry: RawEntryListItem): EntryListItem {
  const normalizedCategory = Array.isArray(entry.category)
    ? (entry.category[0] ?? null)
    : entry.category;

  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category_id: entry.category_id,
    created_at: entry.created_at,
    category: normalizedCategory,
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
  categorySlugs?: string[];
  search?: string;
  limit?: number;
  sort?: "newest" | "oldest" | "title-asc" | "title-desc";
}): Promise<EntryListItem[]> {
  const supabase = createSupabaseServerClient();

  const sort = params?.sort ?? "newest";
  const orderColumn = sort === "title-asc" || sort === "title-desc" ? "title" : "created_at";
  const orderAscending = sort === "oldest" || sort === "title-asc";

  let query = supabase
    .from("entries")
    .select("id,title,description,category_id,created_at,category:categories(id,name,slug)")
    .order(orderColumn, { ascending: orderAscending });

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

  if (params?.categorySlugs?.length) {
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id,slug")
      .in("slug", params.categorySlugs);

    if (categoriesError) {
      throw new Error(categoriesError.message);
    }

    const categoryIds = (categories ?? []).map((item) => item.id);
    if (!categoryIds.length) {
      return [];
    }

    query = query.in("category_id", categoryIds);
  }

  if (params?.search) {
    const safe = sanitizeForLike(params.search);
    query = query.or(
      `title.ilike.%${safe}%,description.ilike.%${safe}%,when_to_use.ilike.%${safe}%,pros.ilike.%${safe}%,cons.ilike.%${safe}%,notes.ilike.%${safe}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RawEntryListItem[]).map(normalizeEntryListItem);
}

export async function getEntryById(id: string) {
  if (!UUID_RE.test(id)) return null;
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id,title,description,category_id,when_to_use,pros,cons,notes,created_at,category:categories(id,name,slug)",
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
    .select("id", { count: "planned", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
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
      when_to_use: input.when_to_use,
      pros: input.pros,
      cons: input.cons,
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
      when_to_use: input.when_to_use,
      pros: input.pros,
      cons: input.cons,
      notes: input.notes,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("An entry with this title already exists.");
    }
    throw new Error(error.message);
  }
}

export async function deleteEntry(_id: string) {
  void _id;
  throw new Error("Deleting entries is disabled.");
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}
