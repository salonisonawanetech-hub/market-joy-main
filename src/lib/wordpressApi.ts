import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type WpRendered = { rendered?: string };
export type WpPost = {
  id: number; slug: string; date: string; modified: string;
  link: string; status: string; type: string;
  title: WpRendered; content: WpRendered; excerpt: WpRendered;
  featured_media?: number; categories?: number[]; tags?: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ name: string; slug: string; taxonomy: string }>>;
    author?: Array<{ name?: string }>;
  };
};

export type LiveBlog = {
  id: number; slug: string; title: string; date: string; modified: string;
  excerpt: string; content: string; image: string; category: string;
  categorySlug: string; author: string; tags: string[]; link: string;
};

const API_URL = (import.meta.env.VITE_WP_API_URL || "https://marketjoy.com/wp-json/wp/v2").replace(/\/$/, "");
const clean = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8217;/g, "’").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

export function mapWpPost(post: WpPost): LiveBlog {
  const terms = (post._embedded?.["wp:term"] || []).flat();
  const category = terms.find((term) => term.taxonomy === "category");
  return {
    id: post.id, slug: post.slug, title: clean(post.title?.rendered),
    date: post.date?.slice(0, 10) || "", modified: post.modified,
    excerpt: clean(post.excerpt?.rendered), content: post.content?.rendered || "",
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
    category: category?.name || "Insights", categorySlug: category?.slug || "",
    author: post._embedded?.author?.[0]?.name || "MarketJoy",
    tags: terms.filter((term) => term.taxonomy === "post_tag").map((term) => term.name),
    link: post.link,
  };
}

export const wordpressApi = createApi({
  reducerPath: "wordpressApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Post", "Page", "Cpt"],
  endpoints: (builder) => ({
    getPosts: builder.query<LiveBlog[], { page?: number; perPage?: number; search?: string } | void>({
      query: (args) => {
        const p = new URLSearchParams({ _embed: "1", per_page: String(args?.perPage || 12), page: String(args?.page || 1), orderby: "date", order: "desc" });
        if (args?.search) p.set("search", args.search);
        return `/posts?${p.toString()}`;
      },
      transformResponse: (data: WpPost[]) => data.map(mapWpPost),
      providesTags: ["Post"],
    }),
    getPostBySlug: builder.query<LiveBlog | null, string>({
      query: (slug) => `/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
      transformResponse: (data: WpPost[]) => data[0] ? mapWpPost(data[0]) : null,
      providesTags: (_result, _error, slug) => [{ type: "Post", id: slug }],
    }),
    getPages: builder.query<WpPost[], void>({ query: () => "/pages?per_page=100&_embed=1", providesTags: ["Page"] }),
    getPageBySlug: builder.query<WpPost | null, string>({
      query: (slug) => `/pages?slug=${encodeURIComponent(slug)}&_embed=1`,
      transformResponse: (data: WpPost[]) => data[0] || null,
      providesTags: (_result, _error, slug) => [{ type: "Page", id: slug }],
    }),
    getCustomPostType: builder.query<LiveBlog[], { restBase: string; page?: number; perPage?: number }>({
      query: ({ restBase, page = 1, perPage = 12 }) => `/${encodeURIComponent(restBase)}?_embed=1&per_page=${perPage}&page=${page}&orderby=date&order=desc`,
      transformResponse: (data: WpPost[]) => data.map(mapWpPost),
      providesTags: ["Cpt"],
    }),
    getPostTypes: builder.query<Record<string, { name: string; slug: string; rest_base?: string; viewable?: boolean }>, void>({
      query: () => "/types",
    }),
    getMedia: builder.query<unknown[], { page?: number; perPage?: number } | void>({
      query: (args) => `/media?per_page=${args?.perPage || 20}&page=${args?.page || 1}`,
    }),
    getCategories: builder.query<Array<{ id: number; name: string; slug: string }>, void>({
      query: () => "/categories?per_page=100&hide_empty=true",
    }),
  }),
});

export const {
  useGetPostsQuery, useGetPostBySlugQuery, useGetPagesQuery,
  useGetPageBySlugQuery, useGetCustomPostTypeQuery, useGetPostTypesQuery, useGetMediaQuery,
  useGetCategoriesQuery,
} = wordpressApi;

export const WP_REST_API_URL = API_URL;
