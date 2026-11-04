import { CASE_STUDIES_INDEX, loadCaseStudy } from "./case-studies/loader";
import { INDUSTRY_NEWS_INDEX, loadIndustryNews } from "./industry-news/loader";
import { PRESS_RELEASES_INDEX, loadPressRelease } from "./press-releases/loader";
import { CPT_META, type CptEntry, type CptIndexItem, type CptType } from "./cpt-types";

export { CPT_META };
export type { CptEntry, CptIndexItem, CptType };

export const CPT: Record<
  CptType,
  { index: readonly CptIndexItem[]; load: (slug: string) => Promise<CptEntry | null> }
> = {
  "case-studies": { index: CASE_STUDIES_INDEX, load: loadCaseStudy },
  "industry-news": { index: INDUSTRY_NEWS_INDEX, load: loadIndustryNews },
  "press-releases": { index: PRESS_RELEASES_INDEX, load: loadPressRelease },
};

/** Maps the first URL segment of an old WordPress URL to a content type. */
export const CPT_BY_SEGMENT: Record<string, CptType> = {
  "case-studies": "case-studies",
  "industry-news": "industry-news",
  "press-release": "press-releases",
};


/** Fetch a custom-post-type entry directly from WordPress using its discovered REST base. */
export async function loadLiveCptEntry(type: CptType, slug: string): Promise<CptEntry | null> {
  const api = (import.meta.env.VITE_WP_API_URL || "https://marketjoy.com/wp-json/wp/v2").replace(/\/$/, "");
  try {
    const typesResponse = await fetch(`${api}/types`);
    if (!typesResponse.ok) return null;
    const types = await typesResponse.json() as Record<string, { name?: string; slug?: string; rest_base?: string }>;
    const match = Object.values(types).find((item) => {
      const label = `${item.name || ""} ${item.slug || ""}`.toLowerCase().replace(/[_-]/g, " ");
      if (type === "case-studies") return label.includes("case stud");
      if (type === "industry-news") return label.includes("industry news");
      return label.includes("press release");
    });
    const restBase = match?.rest_base || match?.slug;
    if (!restBase) return null;
    const response = await fetch(`${api}/${encodeURIComponent(restBase)}?slug=${encodeURIComponent(slug)}&_embed=1`);
    if (!response.ok) return null;
    const records = await response.json() as Array<any>;
    const post = records[0];
    if (!post) return null;
    const strip = (html = "") => String(html).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    const title = strip(post.title?.rendered);
    const excerpt = strip(post.excerpt?.rendered);
    const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    return {
      id: post.id, slug: post.slug, path: `${CPT_META[type].base}/${post.slug}/`,
      sourceUrl: post.link, title, date: post.date, modified: post.modified,
      excerpt, featuredImage: image ? { src: image, alt: post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || title } : null,
      seo: { title: null, description: null, canonical: null, robots: null, note: "SEO fields are managed by the WordPress SEO plugin." },
      html: post.content?.rendered || "",
    };
  } catch (error) {
    console.warn(`Live WordPress ${type} lookup failed`, error);
    return null;
  }
}
