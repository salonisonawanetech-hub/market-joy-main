import { describe, expect, it } from "vitest";
import { BLOG_INDEX, BLOG_PER_PAGE, findSummary, formatDate, loadPost, relatedOf } from "@/data/blog/blog";
import { blogPostingSchema, seo } from "@/lib/seo";

describe("migrated blog data", () => {
  it("has unique, clean slugs and the required listing fields", () => {
    expect(BLOG_INDEX.length).toBeGreaterThan(100);
    expect(new Set(BLOG_INDEX.map((p) => p.slug)).size).toBe(BLOG_INDEX.length);
    for (const p of BLOG_INDEX) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(p.title, p.slug).not.toBe("");
      expect(p.date, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.image, p.slug).toMatch(/^https:\/\//);
      expect(p.excerpt.length, p.slug).toBeGreaterThan(20);
      expect(p.author, p.slug).not.toBe("");
      expect(p.category, p.slug).not.toBe("");
    }
  });

  it("is sorted newest first", () => {
    const dates = BLOG_INDEX.map((p) => p.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("gives every post up to three related posts that exist and are not itself", () => {
    for (const p of BLOG_INDEX) {
      const rel = relatedOf(p);
      expect(rel.length, p.slug).toBe(3);
      expect(rel.map((r) => r.slug)).not.toContain(p.slug);
      rel.forEach((r) => expect(findSummary(r.slug)).toBeDefined());
    }
  });

  it("loads article bodies with sanitised HTML and a single-H1 page structure", async () => {
    for (const p of BLOG_INDEX.slice(0, 25)) {
      const post = await loadPost(p.slug);
      expect(post?.content.length, p.slug).toBeGreaterThan(500);
      expect(post?.content, p.slug).not.toMatch(/<h1|<script|<iframe|\sstyle=|\sonclick=/i);
      expect(post?.seoTitle, p.slug).not.toBe("");
      expect(post?.metaDescription, p.slug).not.toBe("");
    }
    expect(await loadPost("does-not-exist")).toBeNull();
  });

  it("paginates the rest of the posts after the featured one", () => {
    expect(Math.ceil((BLOG_INDEX.length - 1) / BLOG_PER_PAGE)).toBeGreaterThan(1);
  });

  it("formats dates without timezone drift", () => {
    expect(formatDate("2023-08-22")).toBe("Aug 22, 2023");
  });

  it("builds article SEO: og:type article, image, canonical and BlogPosting schema", () => {
    const { meta, links } = seo({
      title: "T",
      description: "D",
      path: "/blog/x",
      image: "https://marketjoy.com/a.jpg",
      type: "article",
    });
    expect(meta).toContainEqual({ property: "og:type", content: "article" });
    expect(meta).toContainEqual({ property: "og:image", content: "https://marketjoy.com/a.jpg" });
    expect(links[0]?.href).toMatch(/\/blog\/x\/$/);
    const s = blogPostingSchema({
      title: "T",
      description: "D",
      path: "/blog/x",
      image: "i",
      date: "2025-01-01",
      author: "A",
      category: "C",
      tags: ["t"],
    });
    expect(s["@type"]).toBe("BlogPosting");
    expect(s.datePublished).toBe("2025-01-01");
  });
});
