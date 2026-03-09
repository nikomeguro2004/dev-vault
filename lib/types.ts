export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Entry = {
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
};

export type EntryWithRelations = Entry & {
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: Tag[];
};

/**
 * Lightweight entry type used in list/card views.
 * Does not include heavy text fields (what_it_is, how_it_works, etc.)
 * which are only needed on the detail page.
 */
export type EntryListItem = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
  tags: Tag[];
};

export type EntryInput = {
  title: string;
  description: string;
  categorySlug: string;
  what_it_is: string;
  how_it_works: string;
  when_to_use: string;
  pros: string;
  cons: string;
  example_code: string;
  notes: string;
  tags: string[];
};
