import { useRouterState } from "@tanstack/react-router";
import { useGetPostsQuery, useGetPostBySlugQuery, type LiveBlog } from "@/lib/wordpressApi";
import { ArrowRight, Calendar, ChevronRight, User } from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Navbar } from "@/components/home/Navbar";
import { Reveal, slide } from "@/components/home/Reveal";
import { FinalCta, Footer, SectionHead } from "@/components/home/Sections";
import {
  blogPath,
  formatDate,
  relatedOf,
  type BlogPost,
  type BlogSummary,
} from "@/data/blog/blog";

/* ---------------- shared bits ---------------- */
function CategoryPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-navy">
      {name}
    </span>
  );
}

function PostDate({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} className="text-xs font-medium text-muted-foreground">
      {formatDate(iso)}
    </time>
  );
}

function BlogCard({ post, index = 0 }: { post: BlogSummary | LiveBlog; index?: number }) {
  return (
    <Reveal from={slide(index)} delay={(index % 3) * 90} className="h-full">
      <a href={blogPath(post.slug)} className="card-glow flex h-full flex-col overflow-hidden">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <CategoryPill name={post.category} />
            <PostDate iso={post.date} />
          </div>
          <h3 className="mt-4 line-clamp-3 text-lg font-bold">{post.title}</h3>
          <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
            Read More <ArrowRight className="arrow h-4 w-4" />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

/* ---------------- listing (/blog) ---------------- */
const pageHref = (n: number) => (n <= 1 ? "/blog/" : `/blog/?page=${n}`);

function pageWindow(page: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (prev !== undefined && n - prev > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function BlogListing() {
  const search = useRouterState({ select: (s) => s.location.search }) as Record<string, unknown>;
  const page = Math.max(1, parseInt(String(search["page"] ?? "1"), 10) || 1);
  const { data: posts = [], isLoading, isError, refetch } = useGetPostsQuery({ page, perPage: 13 });
  const featured = page === 1 ? posts[0] : undefined;
  const items = page === 1 ? posts.slice(1) : posts;
  const hasMore = posts.length === 13;
  return (
    <section className="section-y">
      <div className="container-fluid mx-auto max-w-7xl px-4 sm:px-6">
        {isLoading && <p className="py-8 text-center text-muted-foreground">Loading the latest articles from WordPress…</p>}
        {isError && <div className="my-6 rounded-xl border p-5 text-center"><p>Unable to load articles from WordPress. Please check the REST API connection.</p><button className="mt-3 font-semibold text-brand-blue" onClick={() => refetch()}>Try again</button></div>}
        {featured && <Reveal className="mb-8 sm:mb-10">
          <a href={blogPath(featured.slug)} className="card-glow grid overflow-hidden lg:grid-cols-2">
            <div className="aspect-[16/9] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[22rem]">
              {featured.image && <img src={featured.image} alt={featured.title} decoding="async" fetchPriority="high" className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="eyebrow">Latest article</span>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"><CategoryPill name={featured.category} /><PostDate iso={featured.date} /></div>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 line-clamp-4 text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">Read More <ArrowRight className="arrow h-4 w-4" /></span>
            </div>
          </a>
        </Reveal>}
        <SectionHead eyebrow="All articles" title="Insights for B2B Sales Teams" sub="Latest published articles from MarketJoy WordPress" />
        <div className="grid cols-3 gap-5 sm:gap-6">{items.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}</div>
        {!isLoading && !isError && posts.length === 0 && <p className="py-10 text-center text-muted-foreground">No published articles found.</p>}
        {(page > 1 || hasMore) && <Pagination className="mt-10 sm:mt-12"><PaginationContent className="flex-wrap justify-center">
          {page > 1 && <PaginationItem><PaginationPrevious href={pageHref(page - 1)} rel="prev" /></PaginationItem>}
          <PaginationItem><PaginationLink href={pageHref(page)} isActive>{page}</PaginationLink></PaginationItem>
          {hasMore && <PaginationItem><PaginationNext href={pageHref(page + 1)} rel="next" /></PaginationItem>}
        </PaginationContent></Pagination>}
      </div>
    </section>
  );
}

/* ---------------- article (/blog/<slug>) ---------------- */
function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 -z-20">
        <GatewayFlow className="h-full w-full" density={0.6} />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_25%_50%,rgb(15_32_64/0.8),transparent_65%),radial-gradient(ellipse_at_center,transparent_40%,rgb(15_32_64/0.85)_100%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-xs text-navy-foreground/70"
        >
          <a href="/" className="hover:text-gold">
            Home
          </a>
          <ChevronRight className="h-3 w-3" />
          <a href="/blog/" className="hover:text-gold">
            Blog
          </a>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 max-w-[16rem] text-navy-foreground sm:max-w-md">
            {post.title}
          </span>
        </nav>
        <Reveal from="left">
          <span className="eyebrow">{post.category}</span>
        </Reveal>
        <Reveal
          from="left"
          delay={80}
          as="h1"
          className="mt-4 max-w-4xl text-[1.75rem] font-extrabold leading-[1.15] min-[400px]:text-3xl sm:text-4xl lg:text-[2.75rem]"
        >
          {post.title}
        </Reveal>
        <Reveal
          from="left"
          delay={160}
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-foreground/85"
        >
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gold" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-gold" />
            {post.author}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const { data: livePost } = useGetPostBySlugQuery(post.slug);
  const activePost = livePost ? ({ ...post, ...livePost, seoTitle: livePost.title, metaDescription: livePost.excerpt, content: livePost.content } as BlogPost) : post;
  const related = relatedOf(activePost);
  return (
    <>
      <Navbar />
      <main>
        <ArticleHero post={activePost} />
        <section className="section-y">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <img
                src={activePost.image}
                alt={activePost.title}
                decoding="async"
                fetchPriority="high"
                className="aspect-[16/9] w-full rounded-2xl bg-muted object-cover shadow-card"
              />
            </Reveal>
            <article
              className="article-body mt-8 sm:mt-10"
              // Content is served directly by the public WordPress REST API.
              dangerouslySetInnerHTML={{ __html: activePost.content }}
            />
            {activePost.tags.length > 0 && (
              <ul
                aria-label="Tags"
                className="mt-10 flex flex-wrap gap-2 border-t pt-6 text-xs font-semibold"
              >
                {activePost.tags.map((t) => (
                  <li key={t} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        {related.length > 0 && (
          <section className="section-y bg-muted">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHead
                eyebrow="Keep reading"
                title="Related articles"
                link="/blog/"
                linkLabel="All articles"
              />
              <div className="grid cols-3 gap-5 sm:gap-6">
                {related.map((p, i) => (
                  <BlogCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
