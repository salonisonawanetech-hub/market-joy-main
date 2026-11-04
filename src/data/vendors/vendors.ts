import { VENDOR_CATEGORIES, VENDOR_INDEX } from "./index";
import type { VendorPage, VendorSummary } from "./types";

export { VENDOR_CATEGORIES, VENDOR_INDEX };
export type { VendorPage, VendorSummary };

export const VENDORS_PATH = "/b2b-sales-marketing-lead-generation-vendors/";
export const VENDORS_LABEL = "B2B Platforms & Vendors";

// One lazy chunk per vendor article, so the directory never ships every article body.
const loaders = import.meta.glob("./pages/*.json", { import: "default" }) as Record<
  string,
  () => Promise<VendorPage>
>;

export async function loadVendor(slug: string): Promise<VendorPage | null> {
  const load = loaders[`./pages/${slug}.json`];
  return load ? await load() : null;
}

const bySlug = new Map(VENDOR_INDEX.map((v) => [v.slug, v]));
export const relatedVendors = (v: VendorSummary): VendorSummary[] =>
  v.related.map((s) => bySlug.get(s)).filter((x): x is VendorSummary => !!x);

export const vendorPath = (slug: string) => `/vendor/${slug}/`;

/** Where a directory card points: the article if there is one, else the vendor's own site. */
export const vendorHref = (v: VendorSummary) => {
  if (v.page) return vendorPath(v.slug);
  try {
    return new URL(v.website).hostname.replace(/^www\./, "") === "marketjoy.com" ? "/" : v.website;
  } catch {
    return v.website;
  }
};
export const isExternalVendorHref = (href: string) => /^https?:/.test(href);
