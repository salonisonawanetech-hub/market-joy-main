import { describe, expect, it } from "vitest";
import { CPT, type CptType } from "@/content/cpt";
import { TESTIMONIALS } from "@/content/testimonials/loader";
import { ALL_FAQ_ITEMS, PUBLISHED_FAQS } from "@/content/faqs/loader";
import { REDIRECTS } from "@/content/redirects";
import { findPage } from "@/components/pages/content";

// Record counts in the WordPress exports (verified by scripts/validate-migration.py).
const SOURCE: Record<CptType, number> = { "case-studies": 39, "industry-news": 12, "press-releases": 1 };

describe("CPT migration", () => {
  for (const type of Object.keys(SOURCE) as CptType[]) {
    it(`${type}: converts every source record with a unique slug and non-empty body`, async () => {
      const { index, load } = CPT[type];
      expect(index.length).toBe(SOURCE[type]);
      expect(new Set(index.map((i) => i.slug)).size).toBe(SOURCE[type]);
      for (const i of index) {
        const e = await load(i.slug);
        expect(e, i.slug).not.toBeNull();
        expect(e!.html.replace(/<[^>]+>|\s/g, "").length, i.slug).toBeGreaterThan(0);
      }
    });
  }
  it("testimonials: 38 records, unique ids", () => {
    expect(TESTIMONIALS.length).toBe(38);
    expect(new Set(TESTIMONIALS.map((t) => t.id)).size).toBe(38);
  });
  it("faqs: no duplicate questions and every published FAQ has an answer", () => {
    const norm = (s: string) => s.replace(/\W+/g, " ").trim().toLowerCase();
    const qs = ALL_FAQ_ITEMS.map((f) => norm(f.question));
    expect(new Set(qs).size).toBe(qs.length);
    expect(PUBLISHED_FAQS.length).toBeGreaterThanOrEqual(8);
    PUBLISHED_FAQS.forEach((f) => expect(f.a.length).toBeGreaterThan(20));
  });
  it("redirect targets are real routes", () => {
    for (const to of Object.values(REDIRECTS)) expect(findPage(to), to).not.toBeNull();
  });
});
