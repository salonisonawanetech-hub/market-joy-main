export type BlogSummary = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD, from the original WordPress publish date
  category: string;
  categorySlug: string;
  author: string;
  image: string;
  excerpt: string;
  tags: string[];
  related: string[];
};

export type BlogPost = BlogSummary & {
  seoTitle: string;
  metaDescription: string;
  /** Set only when the old post's canonical pointed at another migrated post. */
  canonicalSlug: string | null;
  excerptSource: "meta-description" | "article-text";
  /** Sanitised article HTML (headings, paragraphs, lists, tables, images). */
  content: string;
};
