import { describe, expect, it } from "vitest";
import { SERVICES_INDEX, loadServiceByPath } from "@/content/services/loader";
import { REDIRECTS } from "@/content/redirects";

describe("services + products migration", () => {
  it("migrated the old service/product URLs (15 after removing Buyer Intent and Web Traffic Revealer)", () => expect(SERVICES_INDEX.length).toBe(15));
  it("every entry has SEO title, description and a non-empty body", async () => {
    for (const i of SERVICES_INDEX) {
      const e = await loadServiceByPath(i.path);
      expect(e, i.path).not.toBeNull();
      expect(e!.seo.title, i.path).toBeTruthy();
      expect(e!.seo.title, i.path).not.toContain("&amp;");
      expect(e!.seo.description, i.path).toBeTruthy();
      expect(e!.html.replace(/<[^>]+>|\s/g, "").length, i.path).toBeGreaterThan(1000);
    }
  });
  it("has no broken relative images and no form-widget leftovers", async () => {
    for (const i of SERVICES_INDEX) {
      const e = (await loadServiceByPath(i.path))!;
      for (const m of e.html.matchAll(/<img[^>]+src="([^"]*)"/g)) expect(m[1], i.path).toMatch(/^(\/wp-content\/|https?:|data:)/);
      expect(e.html, i.path).not.toMatch(/<h[23]>\s*Contact Us\s*<\/h[23]>/i);
    }
  });
  it("keeps noindex on the landing/legacy pages", async () => {
    expect((await loadServiceByPath("/guaranteed-sales-qualified-leads/"))!.seo.robots).toMatch(/noindex/);
    expect((await loadServiceByPath("/lead-generation-services-v1/"))!.seo.robots).toMatch(/noindex/);
  });
  it("redirects never point at themselves or at another redirect", () => {
    for (const [from, to] of Object.entries(REDIRECTS)) {
      expect(to.replace(/\/$/, ""), from).not.toBe(from);
      expect(REDIRECTS[to.replace(/\/$/, "")], `${from} -> ${to}`).toBeUndefined();
    }
  });
});

describe("services FAQ accordions", () => {
  it("keep every answer inside its <details> and leave no stray copies between items", async () => {
    for (const i of SERVICES_INDEX) {
      const e = (await loadServiceByPath(i.path))!;
      const open = (e.html.match(/<details/g) ?? []).length;
      expect(e.faqs.length, i.path).toBe(open);
      // </details> followed by plain <p>/<ul> text and then another <details> = a stray answer copy
      expect(e.html, i.path).not.toMatch(/<\/details>\s*<(p|ul|ol)[\s>][^]*?<details/);
      for (const f of e.faqs) expect(f.a.length, `${i.path}: ${f.q}`).toBeGreaterThan(10);
    }
  });
});
