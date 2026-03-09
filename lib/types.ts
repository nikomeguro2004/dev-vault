export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Entry = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  when_to_use: string;
  pros: string;
  cons: string;
  notes: string;
  created_at: string;
};

export type EntryWithRelations = Entry & {
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

/**
 * Lightweight entry type used in list/card views.
 * Does not include heavy text fields used on detail pages.
 * which are only needed on the detail page.
 */
export type EntryListItem = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
};

export type EntryInput = {
  title: string;
  description: string;
  categorySlug: string;
  when_to_use: string;
  pros: string;
  cons: string;
  notes: string;
};
