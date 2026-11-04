import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { routeTree } from "@/routeTree.gen";
import { ALL_PAGES, findPage } from "@/components/pages/content";
import { JOYPEDIA_INDEX, loadJoypedia, type JoypediaEntry } from "@/content/joypedia/loader";
import { resolveInternalLinks } from "@/content/joypedia/links";

const SOURCE_COUNT = 153; // records in the WordPress export (joypedia.json), verified by migration/joypedia/report.json
const entries = await Promise.all(JOYPEDIA_INDEX.map((i) => loadJoypedia(i.slug)));
const loaded = entries.filter((e): e is JoypediaEntry => e !== null);
const htmlOf = (e: JoypediaEntry) =>
  e.blocks.flatMap((b) =>
    b.t === "h2" ? [b.text] : b.t === "ul" ? b.items.map((i) => i.html) : [b.html],
  );

describe("joypedia migration", () => {
  it("converted every source record", () => {
    expect(JOYPEDIA_INDEX.length).toBe(SOURCE_COUNT);
    expect(loaded.length).toBe(SOURCE_COUNT);
  });
  it("has unique slugs/ids and non-empty titles, excerpts and bodies", () => {
    expect(new Set(JOYPEDIA_INDEX.map((i) => i.slug)).size).toBe(SOURCE_COUNT);
    expect(new Set(JOYPEDIA_INDEX.map((i) => i.id)).size).toBe(SOURCE_COUNT);
    for (const e of loaded) {
      expect(e.title.trim(), e.slug).not.toBe("");
      expect(e.excerpt.trim(), e.slug).not.toBe("");
      expect(e.blocks.length, e.slug).toBeGreaterThan(0);
    }
  });
  it("keeps the original WordPress slug in the route", () => {
    for (const e of loaded) {
      expect(e.path).toBe(`/joypedia/${e.slug}/`);
      expect(e.sourceUrl).toBe(`https://marketjoy.com/joypedia/${e.slug}/`);
    }
  });
  it("every term and the index resolve to a real route and a registered page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const p of ["/joypedia/", ...JOYPEDIA_INDEX.map((i) => i.path)]) {
      expect(findPage(p), p).not.toBeNull();
      expect(router.matchRoutes(p).at(-1)?.routeId, p).not.toBe(rootRouteId);
    }
    expect(ALL_PAGES.filter((p) => p.kind === "joypedia").length).toBe(SOURCE_COUNT);
  });
  it("has no leftover Elementor/Word markup and only whitelisted inline tags", () => {
    for (const e of loaded)
      for (const h of htmlOf(e)) {
        expect(h, e.slug).not.toMatch(
          /elementor|SCXW|NormalTextRun|\sdata-[\w-]+=|style=|<span|<div|&nbsp;/i,
        );
        const tags = [...h.matchAll(/<\/?([a-z0-9]+)/gi)].map((m) => m[1]!.toLowerCase());
        for (const t of tags) expect(["a", "strong", "em", "br"], `${e.slug}: <${t}>`).toContain(t);
      }
  });
  it("has no empty or immediately repeated blocks", () => {
    for (const e of loaded) {
      const keys = e.blocks.map((b) => JSON.stringify(b));
      keys.forEach((k, i) => expect(k !== keys[i - 1], `${e.slug} block ${i}`).toBe(true));
    }
  });
  it("every in-body joypedia link points at an existing term", () => {
    const slugs = new Set(JOYPEDIA_INDEX.map((i) => i.slug));
    for (const e of loaded)
      for (const h of htmlOf(e))
        for (const m of h.matchAll(/href="https?:\/\/marketjoy\.com\/joypedia\/([^/"#?]+)/g))
          expect(slugs.has(m[1]!), `${e.slug} -> ${m[1]}`).toBe(true);
  });
  it("rewrites links only when the new site has the page", () => {
    expect(resolveInternalLinks('<a href="https://marketjoy.com/about/">x</a>')).toBe(
      '<a href="/about/">x</a>',
    );
    const unknown = '<a href="https://marketjoy.com/some-unmigrated-blog-post/">x</a>';
    expect(resolveInternalLinks(unknown)).toBe(unknown);
  });
  it("url map covers every record and maps old URL to the same path", () => {
    const map = JSON.parse(readFileSync("migration/joypedia/url-map.json", "utf8")) as {
      old_url: string;
      new_route: string;
    }[];
    expect(map.length).toBe(SOURCE_COUNT);
    for (const m of map) {
      expect(new URL(m.old_url).pathname).toBe(m.new_route);
      expect(findPage(m.new_route), m.new_route).not.toBeNull();
    }
  });
});
