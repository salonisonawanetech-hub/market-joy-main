export type VendorSummary = {
  slug: string;
  title: string;
  type: string; // "Agency" | "SaaS", as set on the old site
  tagline: string;
  website: string;
  category: string;
  categorySlug: string;
  logo: string;
  /** false when the old site had no article for this listing (card links to the vendor's own website). */
  page: boolean;
  related: string[];
};

export type VendorPage = VendorSummary & {
  date: string;
  seoTitle: string;
  metaDescription: string;
  faqs: { q: string; a: string }[];
  /** Sanitised article HTML. */
  content: string;
};
