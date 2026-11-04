import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  SERVICES_INDEX,
  PRODUCT_META,
  isServicePath,
  loadServiceByPath,
} from "@/content/services/loader";
import { loadIndustryByPath } from "@/content/industries/loader";
import { findSummary } from "@/data/blog/blog";
import { REDIRECTS } from "@/content/redirects";
import { PRODUCTS } from "@/components/home/data";

const PRODUCT_PATHS = SERVICES_INDEX.filter((i) => i.kind === "product").map((i) => i.path);
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("products section", () => {
  it("has only the hub and InfoJoy (Buyer Intent and Web Traffic Revealer were removed)", () => {
    expect(PRODUCT_PATHS.sort()).toEqual(
      ["/products/", "/products/infojoy/"].sort(),
    );
    for (const p of PRODUCT_PATHS) expect(PRODUCT_META[p], p).toBeDefined();
  });

  it("removed products are gone everywhere and old URLs redirect to the hub", async () => {
    for (const p of ["/products/buyer-intent/", "/products/web-traffic-revealer/"]) {
      expect(isServicePath(p), p).toBe(false);
      expect(PRODUCT_META[p], p).toBeUndefined();
      expect(REDIRECTS[p.replace(/\/$/, "")], p).toBe("/products/");
      expect(read("public/sitemap-services.xml"), p).not.toContain(p);
      expect(PRODUCTS.some((c) => c.href === p), `homepage card for ${p}`).toBe(false);
    }
    const hub = (await loadServiceByPath("/products/"))!;
    expect(hub.html).not.toMatch(/buyer-intent|web-traffic-revealer|Web Traffic Revealer/);
  });

  it("hub links to every product, and the homepage cards do too", async () => {
    const hub = (await loadServiceByPath("/products/"))!;
    for (const p of PRODUCT_PATHS.filter((x) => x !== "/products/")) {
      expect(hub.html, p).toContain(`href="${p}"`);
      expect(
        PRODUCTS.some((c) => c.href === p),
        `homepage card for ${p}`,
      ).toBe(true);
    }
  });

  it("every internal link resolves directly (no old WordPress slugs, no redirect hops)", async () => {
    for (const path of PRODUCT_PATHS) {
      const e = (await loadServiceByPath(path))!;
      for (const m of e.html.matchAll(/href="([^"]+)"/g)) {
        const href = m[1]!;
        if (/^https?:/.test(href)) continue;
        const clean = "/" + href.replace(/^\/+|\/+$/g, "");
        expect(
          REDIRECTS[clean],
          `${path} -> ${href} is an old URL that only redirects`,
        ).toBeUndefined();
        const blog = /^\/blog\/([^/]+)$/.exec(clean)?.[1];
        const ok =
          clean === "/contact-us" ||
          isServicePath(href) ||
          (await loadIndustryByPath(href.replace(/^\/+|\/+$/g, ""))) !== null ||
          (blog !== undefined && findSummary(blog) !== undefined);
        expect(ok, `${path} -> ${href} does not exist on the new site`).toBe(true);
      }
    }
  });

  it("has clean markup: no hard line breaks, orphan arrows, hash alts or extra <h1>", async () => {
    for (const path of PRODUCT_PATHS) {
      const e = (await loadServiceByPath(path))!;
      expect(e.html, path).not.toMatch(/<br\s*\/?>/);
      expect(e.html, path).not.toMatch(/<p>\s*(<a[^>]*>)?\s*→\s*(<\/a>)?\s*<\/p>/);
      expect(e.html, path).not.toMatch(/<h1[\s>]/);
      for (const m of e.html.matchAll(/<img[^>]*\salt="([^"]*)"/g))
        expect(m[1], path).not.toMatch(/^[0-9a-f]{20,}$|\.(png|jpe?g|webp|svg)$/i);
      // the same heading must not appear twice in a row-level duplicate
      const heads = [...e.html.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/g)].map((m) =>
        m[1]!.replace(/<[^>]+>/g, "").trim(),
      );
      expect(new Set(heads).size, `${path} repeats a heading`).toBe(heads.length);
    }
  });

  it("has complete SEO fields", async () => {
    for (const path of PRODUCT_PATHS) {
      const e = (await loadServiceByPath(path))!;
      expect(e.seo.title!.length, path).toBeGreaterThan(20);
      expect(e.seo.description!.length, path).toBeGreaterThan(80);
      expect(
        e.seo.description!.length,
        `${path} description too long for a SERP snippet`,
      ).toBeLessThanOrEqual(160);
      expect(e.seo.ogImageAlt, path).toBeTruthy();
      expect(e.seo.robots ?? "index", path).not.toMatch(/noindex/);
      expect(e.seo.modified, path).toBeTruthy();
    }
  });

  it("lists every product in the sitemap and every product image in the download list", async () => {
    const sitemap = read("public/sitemap-services.xml");
    const list = new Set(read("migration/products-images.csv").trim().split("\n").slice(1));
    for (const path of PRODUCT_PATHS) {
      expect(sitemap, path).toContain(`<loc>https://marketjoy.com${path}</loc>`);
      const e = (await loadServiceByPath(path))!;
      for (const m of e.html.matchAll(/<img[^>]+src="(\/wp-content\/[^"]+)"/g))
        expect(list.has(m[1]!), `${path}: ${m[1]}`).toBe(true);
      if (e.seo.ogImage) expect(list.has(e.seo.ogImage), `${path} ogImage`).toBe(true);
    }
  });

  it("keeps FAQ answers inside <details> so FAQ schema matches visible content", async () => {
    for (const path of PRODUCT_PATHS) {
      const e = (await loadServiceByPath(path))!;
      expect(e.faqs.length, path).toBe((e.html.match(/<details/g) ?? []).length);
    }
  });
});
