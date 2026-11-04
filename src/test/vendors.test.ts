import { describe, expect, it } from "vitest";
import { findPage } from "@/components/pages/content";
import {
  VENDOR_CATEGORIES,
  VENDOR_INDEX,
  isExternalVendorHref,
  loadVendor,
  relatedVendors,
  vendorHref,
} from "@/data/vendors/vendors";

describe("migrated vendors", () => {
  it("registers the directory as an internal page", () => {
    expect(findPage("b2b-sales-marketing-lead-generation-vendors/")?.kind).toBe("vendors");
  });

  it("has unique clean slugs and the required listing fields", () => {
    expect(VENDOR_INDEX.length).toBeGreaterThan(100);
    expect(new Set(VENDOR_INDEX.map((v) => v.slug)).size).toBe(VENDOR_INDEX.length);
    for (const v of VENDOR_INDEX) {
      expect(v.slug, v.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(v.title, v.slug).not.toBe("");
      expect(v.website, v.slug).toMatch(/^https?:\/\//);
    }
    const known = new Set(VENDOR_CATEGORIES.map((c) => c.slug));
    VENDOR_INDEX.filter((v) => v.category).forEach((v) =>
      expect(known.has(v.categorySlug), v.slug).toBe(true),
    );
  });

  it("links cards to the article, or out to the vendor site when there is no article", () => {
    for (const v of VENDOR_INDEX) {
      const href = vendorHref(v);
      if (v.page) expect(href).toBe(`/vendor/${v.slug}/`);
      else expect(href.startsWith("/") || isExternalVendorHref(href)).toBe(true);
    }
  });

  it("gives related platforms that exist, have articles and are not the same listing", () => {
    for (const v of VENDOR_INDEX) {
      const rel = relatedVendors(v);
      rel.forEach((r) => {
        expect(r.slug).not.toBe(v.slug);
        expect(r.page).toBe(true);
      });
    }
  });

  it("loads sanitised article bodies with SEO fields and FAQs", async () => {
    for (const v of VENDOR_INDEX.filter((x) => x.page)) {
      const page = await loadVendor(v.slug);
      expect(page?.content.length, v.slug).toBeGreaterThan(800);
      expect(page?.content, v.slug).not.toMatch(
        /<h1|<svg|<script|<img|contact-form|\sstyle=|get in touch/i,
      );
      expect(page?.seoTitle, v.slug).not.toBe("");
      expect(page?.metaDescription, v.slug).not.toBe("");
      expect(page?.faqs.length, v.slug).toBeGreaterThan(0);
    }
    expect(await loadVendor("does-not-exist")).toBeNull();
  });
});
