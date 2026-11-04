import index from "./index.json";

export type ServiceIndexItem = {
  slug: string;
  kind: "service" | "product";
  path: string;
  title: string;
  parent: string | null;
  description: string | null;
  ogImage: string | null;
};

export type ServiceEntry = {
  slug: string;
  kind: "service" | "product";
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
};

export const SERVICES_INDEX = index as unknown as readonly ServiceIndexItem[];

const modules = import.meta.glob<{ default: ServiceEntry }>("./entries/*.json");

const norm = (p: string) => "/" + p.replace(/^\/+|\/+$/g, "") + "/";

/** Old URL path (e.g. "/b2b-list-building-services") -> entry, or null. */
export async function loadServiceByPath(p: string): Promise<ServiceEntry | null> {
  const item = SERVICES_INDEX.find((i) => i.path === norm(p));
  if (!item) return null;
  const load = modules[`./entries/${item.slug}.json`];
  return load ? (await load()).default : null;
}

/** Short names + schema.org serviceType for the product pages (breadcrumbs, JSON-LD, nav). */
export const PRODUCT_META: Record<string, { label: string; serviceType: string }> = {
  "/products/": { label: "Products", serviceType: "B2B prospecting products" },
  "/products/infojoy/": { label: "InfoJoy", serviceType: "B2B buyer intent prospecting platform" },
};

export const isServicePath = (p: string) => SERVICES_INDEX.some((i) => i.path === norm(p));
