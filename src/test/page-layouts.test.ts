import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadServiceByPath } from "@/content/services/loader";
import { INFOJOY, PRODUCTS_HUB } from "@/content/services/product-layouts";
import { ABOUT_HERO, ABOUT_SERVICES, ABOUT_WHAT_WE_DO, ABOUT_WHY, ABOUT_TEAM_GROUPS, TEAM } from "@/content/about/about";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Every string in a nested structure. */
const strings = (v: unknown): string[] =>
  typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

describe("product page layouts", () => {
  it("InfoJoy layout keeps the migrated copy", async () => {
    const html = text((await loadServiceByPath("/products/infojoy/"))!.html);
    const copy = [
      INFOJOY.intro.body,
      INFOJOY.problem.title,
      ...INFOJOY.problem.points,
      INFOJOY.delivers.title,
      ...INFOJOY.delivers.points,
      INFOJOY.intent.title,
      ...INFOJOY.intent.steps.map((s) => s.title),
      INFOJOY.features.title,
      ...INFOJOY.features.items.map((f) => f.title),
      INFOJOY.pricing.title,
      ...INFOJOY.pricing.points,
      INFOJOY.love.title,
      INFOJOY.cta.title,
      INFOJOY.cta.body,
    ];
    for (const c of copy) expect(html, c).toContain(norm(c));
  });

  it("hub layout keeps the migrated copy and links every industry", async () => {
    const entry = (await loadServiceByPath("/products/"))!;
    const html = text(entry.html);
    for (const c of [PRODUCTS_HUB.intro.body, PRODUCTS_HUB.tailored.title, PRODUCTS_HUB.tailored.body, PRODUCTS_HUB.growth.body, PRODUCTS_HUB.cta.title, PRODUCTS_HUB.cta.body])
      expect(html, c).toContain(norm(c));
    for (const i of PRODUCTS_HUB.growth.industries) expect(entry.html, i.href).toContain(`href="${i.href}"`);
  });

  it("every layout image is in the download list so the build fetches it", () => {
    const list = new Set(read("migration/products-images.csv").trim().split("\n").slice(1));
    const imgs = strings([PRODUCTS_HUB, INFOJOY]).filter((s) => s.startsWith("/wp-content/"));
    expect(imgs.length).toBeGreaterThan(8);
    for (const i of imgs) expect(list.has(i), i).toBe(true);
  });
});

describe("about page images", () => {
  it("every image the About page uses is in the download list", () => {
    const list = new Set(
      read("migration/about-images.csv")
        .trim()
        .split("\n")
        .slice(1)
        .map((r) => r.split(",")[0]),
    );
    const imgs = strings([ABOUT_HERO, ABOUT_SERVICES, ABOUT_WHAT_WE_DO, ABOUT_WHY, ABOUT_TEAM_GROUPS, TEAM]).filter((s) =>
      /^\/wp-content\/.+\.(png|jpe?g|svg|webp)$/i.test(s),
    );
    expect(imgs.length).toBeGreaterThan(15);
    for (const i of imgs) expect(list.has(i), i).toBe(true);
  });

  it("the build step downloads About + product images", () => {
    const script = read("scripts/fetch-industry-images.mjs");
    expect(script).toContain("about-images");
    expect(script).toContain("products-images");
  });
});

describe("home products section", () => {
  it("no longer has a 'View all products' link", () => {
    expect(read("src/components/home/Sections.tsx")).not.toContain("View all products");
  });
});
