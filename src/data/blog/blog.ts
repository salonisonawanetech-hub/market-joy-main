import { BLOG_INDEX } from "./index";
import type { BlogPost, BlogSummary } from "./types";

export { BLOG_INDEX };
export type { BlogPost, BlogSummary };

export const BLOG_PER_PAGE = 12;

const WP_API_ROOT = (import.meta.env.VITE_WP_API_URL || "https://marketjoy.com/wp-json/wp/v2").replace(/\/$/, "");

export async function loadPost(slug: string): Promise<BlogPost | null> {
  // Resolve every article from live WordPress first. This also makes newly published slugs routable
  // without a code change or a JSON migration/export.
  try {
    const response = await fetch(`${WP_API_ROOT}/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
    if (response.ok) {
      const posts = await response.json() as Array<any>;
      const post = posts[0];
      if (post) {
        const terms = (post._embedded?.["wp:term"] || []).flat();
        const category = terms.find((term: any) => term.taxonomy === "category");
        const strip = (value = "") => String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\\s+/g, " ").trim();
        const title = strip(post.title?.rendered);
        const excerpt = strip(post.excerpt?.rendered);
        return {
          slug: post.slug, title, date: String(post.date || "").slice(0, 10),
          category: category?.name || "Insights", categorySlug: category?.slug || "",
          author: post._embedded?.author?.[0]?.name || "MarketJoy",
          image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
          excerpt, tags: terms.filter((term: any) => term.taxonomy === "post_tag").map((term: any) => term.name),
          related: [], seoTitle: title, metaDescription: excerpt,
          canonicalSlug: null, excerptSource: "article-text", content: post.content?.rendered || "",
        };
      }
    }
  } catch (error) {
    console.warn("Live WordPress post lookup failed", error);
  }
  // No static migrated article fallback: an unavailable API should be visible rather than silently stale.
  return null;
}

const bySlug = new Map(BLOG_INDEX.map((p) => [p.slug, p]));
export const findSummary = (slug: string): BlogSummary | undefined => bySlug.get(slug);

export const relatedOf = (post: BlogSummary): BlogSummary[] =>
  post.related.map((s) => bySlug.get(s)).filter((p): p is BlogSummary => !!p);

/** "2025-03-04" -> "Mar 4, 2025" (UTC, so server and browser always agree). */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export const blogPath = (slug: string) => `/blog/${slug}/`;
