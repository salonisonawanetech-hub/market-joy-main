import index from "./index.json";

export type IndustryIndexItem = {
  slug: string;
  path: string;
  title: string;
  parent: string | null;
  description: string | null;
  ogImage: string | null;
};

export type LayoutCta = { label: string; href: string };
export type LayoutCard = { title: string; html?: string; img?: string };
export type LayoutBlock =
  | { k: "intro"; html: string; ctas: LayoutCta[]; img?: string }
  | { k: "prose"; title: string; eyebrow?: string; html: string; img?: string; ctas?: LayoutCta[] }
  | { k: "cards"; title: string; eyebrow?: string; lead: string; items: LayoutCard[]; style: "cards" | "icons" | "steps" | "chips"; ctas?: LayoutCta[] }
  | { k: "faq"; title: string; items: { q: string; a: string }[] }
  | { k: "cta"; title: string; html: string; ctas: LayoutCta[] };

export type IndustryEntry = {
  slug: string;
  path: string;
  sourceUrl: string;
  title: string;
  parent: string | null;
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    ogType: string | null;
    ogImage: string | null;
    ogImageAlt: string | null;
    twitterCard: string | null;
    published: string | null;
    modified: string | null;
    focusKeyword: string | null;
  };
  faqs: { q: string; a: string }[];
  jsonLd: Record<string, unknown>[];
  html: string;
  /** Structured sections built by scripts/build-industry-layouts.py (absent -> plain article layout). */
  layout?: LayoutBlock[];
};

export const INDUSTRIES_INDEX = index as unknown as readonly IndustryIndexItem[];

const modules = import.meta.glob<{ default: IndustryEntry }>("./entries/*.json");

const layouts = import.meta.glob<{ default: LayoutBlock[] }>("./layouts/*.json");

const norm = (p: string) => "/" + p.replace(/^\/+|\/+$/g, "") + "/";

/** Old URL path (e.g. "/industries/utilities-lead-generation") -> entry, or null. */
export async function loadIndustryByPath(p: string): Promise<IndustryEntry | null> {
  const item = INDUSTRIES_INDEX.find((i) => i.path === norm(p));
  if (!item) return null;
  const load = modules[`./entries/${item.slug}.json`];
  if (!load) return null;
  const entry = (await load()).default;
  const loadLayout = layouts[`./layouts/${item.slug}.json`];
  return loadLayout ? { ...entry, layout: (await loadLayout()).default } : entry;
}

export const isIndustryPath = (p: string) => INDUSTRIES_INDEX.some((i) => i.path === norm(p));
