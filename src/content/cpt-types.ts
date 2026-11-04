export type CptType = "case-studies" | "industry-news" | "press-releases";

export type CptIndexItem = {
  id: number;
  slug: string;
  path: string;
  sourceUrl: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  featuredImage: { src: string; alt: string | null } | null;
};

export type CptEntry = CptIndexItem & {
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    note: string;
  };
  /** Sanitised article HTML, produced at migration time by scripts/migrate-cpt.py. */
  html: string;
};

export type Testimonial = {
  id: number;
  slug: string;
  name: string;
  date: string;
  sourceUrl: string;
  quote: string | null;
  roleCompany: string | null;
  quoteSource: "elementor-page-widget" | null;
};

export const CPT_META: Record<CptType, { label: string; base: string; sub: string }> = {
  "case-studies": {
    label: "Case Studies",
    base: "/case-studies",
    sub: "Real results for real businesses.",
  },
  "industry-news": {
    label: "Industry News",
    base: "/industry-news",
    sub: "News and trends shaping B2B sales and lead generation.",
  },
  "press-releases": {
    label: "Press Releases",
    base: "/press-release",
    sub: "Company news and announcements from MarketJoy.",
  },
};
