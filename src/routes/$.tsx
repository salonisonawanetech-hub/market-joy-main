import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SitePage } from "@/components/pages/Pages";
import { WordPressPageView } from "@/components/pages/WordPressPage";
import { fetchRankMathSeo, fetchWordPressPageBySlug, getWordPressPageSeo } from "@/lib/wordpressPages";
import { findPage } from "@/components/pages/content";
import { BlogPostPage } from "@/components/pages/BlogPages";
import { VendorPageView } from "@/components/pages/VendorPages";
import { JoypediaEntryPage, JoypediaListing } from "@/components/pages/JoypediaPages";
import { ContentEntryPage, ContentListing } from "@/components/pages/ContentPages";
import { IndustryEntryPage } from "@/components/pages/IndustryPages";
import { ServiceEntryPage } from "@/components/pages/ServicePages";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";
import { Skeleton } from "@/components/ui/skeleton";
import { loadServiceByPath, PRODUCT_META, SERVICES_INDEX } from "@/content/services/loader";
import { loadIndustryByPath } from "@/content/industries/loader";
import { FAQS } from "@/components/home/data";
import { findSummary, loadPost } from "@/data/blog/blog";
import { VENDORS_LABEL, VENDORS_PATH, loadVendor } from "@/data/vendors/vendors";
import { REDIRECTS } from "@/content/redirects";
import { CURTIS } from "@/content/about/about";
import { loadJoypedia } from "@/content/joypedia/loader";
import { CPT_BY_SEGMENT, CPT_META, loadLiveCptEntry, type CptType } from "@/content/cpt";
import {
  seo,
  jsonLd,
  faqSchema,
  breadcrumbSchema,
  blogPostingSchema,
  productServiceSchema,
  productsHubSchema,
  OG_IMAGE,
  absUrl,
  SITE_URL,
} from "@/lib/seo";

type Params = { _splat?: string; "*"?: string };
const splatOf = (p: Params) => p._splat ?? p["*"] ?? "";
// Every loader branch returns the same keys (TypeScript needs a consistent shape).
const NONE = { industry: null, service: null, post: null, vendor: null, term: null, cptType: null, entry: null, crumb: null, image: null, wpPage: null, wpSeo: null, rankMathSeo: null } as const;

export const Route = createFileRoute("/$")({
  pendingMs: 200,
  pendingComponent: RoutePending,
  loader: async ({ params }) => {
    const splat = splatOf(params as Params).replace(/^\/+|\/+$/g, "");
    // Old WordPress URLs that moved (see src/content/redirects.ts)
    const moved = REDIRECTS[`/${splat}`];
    if (moved) throw redirect({ href: moved, statusCode: 301 });
    // JoyPedia: /joypedia (list) and /joypedia/<slug> (term)
    const jp = /^joypedia(?:\/([^/]+))?$/.exec(splat);
    if (jp) {
      if (jp[1]) {
        const term = await loadJoypedia(jp[1]);
        if (!term) throw notFound();
        const rankMathSeo = await fetchRankMathSeo(term.sourceUrl);
        return {
          ...NONE,
          path: `/joypedia/${term.slug}`,
          kind: "joypedia-entry" as string,
          title: rankMathSeo?.title || term.seo.title || `${term.title} | JoyPedia`,
          description: rankMathSeo?.description || term.seo.description || term.excerpt,
          parent: { label: "JoyPedia", href: "/joypedia/" },
          term,
          crumb: term.title,
          rankMathSeo,
        };
      }
      const rankMathSeo = await fetchRankMathSeo(absUrl("/joypedia"));
      return {
        ...NONE,
        path: "/joypedia",
        kind: "joypedia" as string,
        title: rankMathSeo?.title || "JoyPedia",
        description: rankMathSeo?.description || "Our B2B sales and marketing knowledge base.",
        parent: null,
        rankMathSeo,
      };
    }

    // Migrated WordPress CPTs: /case-studies, /industry-news, /press-release (list) and /<type>/<slug> (entry)
    const cp = /^(case-studies|industry-news|press-release)(?:\/([^/]+))?$/.exec(splat);
    if (cp) {
      const cptType = CPT_BY_SEGMENT[cp[1] as string] as CptType;
      const meta = CPT_META[cptType];
      if (cp[2]) {
        const entry = await loadLiveCptEntry(cptType, cp[2]);
        if (!entry) throw notFound();
        const rankMathSeo = await fetchRankMathSeo(entry.sourceUrl);
        return {
          ...NONE,
          path: `${meta.base}/${entry.slug}`,
          kind: "cpt-entry" as string,
          title: rankMathSeo?.title || entry.seo.title || entry.title,
          description: rankMathSeo?.description || entry.seo.description || entry.excerpt,
          parent: { label: meta.label, href: `${meta.base}/` },
          cptType,
          entry,
          crumb: entry.title,
          rankMathSeo,
        };
      }
      const rankMathSeo = await fetchRankMathSeo(absUrl(meta.base));
      return {
        ...NONE,
        path: meta.base,
        kind: "cpt-list" as string,
        title: rankMathSeo?.title || meta.label,
        description: rankMathSeo?.description || meta.sub,
        parent: null,
        cptType,
        rankMathSeo,
      };
    }

    // Migrated WordPress industry pages: /industries/..., /construction-lead-generation/...
    if (/^(industries|construction-lead-generation)(\/|$)/.test(splat)) {
      const industry = await loadIndustryByPath(splat);
      if (industry) {
        const segs = industry.path.split("/").filter(Boolean);
        const parentPath = segs.length > (segs[0] === "industries" ? 2 : 1) ? `/${segs.slice(0, -1).join("/")}/` : null;
        const parent = parentPath ? await loadIndustryByPath(parentPath) : null;
        const rankMathSeo = await fetchRankMathSeo(industry.sourceUrl);
        return {
          ...NONE,
          path: industry.path,
          kind: "industry-entry" as string,
          title: rankMathSeo?.title || industry.seo.title || industry.title,
          description: rankMathSeo?.description || industry.seo.description || "",
          parent: parent ? { label: parent.title, href: parent.path } : { label: "Industries", href: "/industries/" },
          industry,
          crumb: industry.title,
          image: rankMathSeo?.image || null,
          rankMathSeo,
        };
      }
    }

    // Migrated WordPress service + product pages: /b2b-list-building-services/, /products/infojoy/ ...
    const service = await loadServiceByPath(splat);
    if (service) {
      const rankMathSeo = await fetchRankMathSeo(service.sourceUrl);
      return {
        ...NONE,
        path: service.path,
        kind: "service-entry" as string,
        title: rankMathSeo?.title || service.seo.title || service.title,
        description: rankMathSeo?.description || service.seo.description || "",
        parent: service.kind === "product" && service.path !== "/products/" ? { label: "Products", href: "/products/" } : null,
        service,
        crumb: PRODUCT_META[service.path]?.label ?? service.title,
        image: rankMathSeo?.image || null,
        rankMathSeo,
      };
    }

    const blog = /^blog\/([^/]+)$/.exec(splat);
    if (blog?.[1]) {
      const post = await loadPost(blog[1]);
      if (!post) throw notFound();
      return {
        ...NONE,
        path: `/blog/${post.slug}`,
        kind: "post" as string,
        title: post.seoTitle,
        description: post.metaDescription,
        parent: { label: "Blog", href: "/blog/" },
        post,
        rankMathSeo: post.rankMathSeo ?? null,
      };
    }
    const vend = /^vendor\/([^/]+)$/.exec(splat);
    if (vend?.[1]) {
      const vendor = await loadVendor(vend[1]);
      if (!vendor) throw notFound();
      const rankMathSeo = await fetchRankMathSeo(absUrl(`/vendor/${vendor.slug}`));
      return {
        ...NONE,
        path: `/vendor/${vendor.slug}`,
        kind: "vendor" as string,
        title: rankMathSeo?.title || vendor.seoTitle,
        description: rankMathSeo?.description || vendor.metaDescription,
        parent: { label: VENDORS_LABEL, href: VENDORS_PATH },
        vendor,
        image: rankMathSeo?.image || null,
        rankMathSeo,
      };
    }
    const page = findPage(splat);
    if (!page) {
      // Resolve newly-created pages and changed WordPress slugs without a React route edit.
      const wpPage = await fetchWordPressPageBySlug(splat.split('/').filter(Boolean).at(-1) || '');
      if (wpPage) {
        const wpSeo = await getWordPressPageSeo(wpPage);
        return {
          ...NONE,
          path: `/${wpPage.slug}`,
          kind: "wordpress-page" as string,
          title: wpSeo.title,
          description: wpSeo.description,
          parent: null,
          crumb: wpPage.title.rendered,
          image: wpSeo.image || null,
          wpPage,
          wpSeo,
          rankMathSeo: wpSeo.rankMath,
        };
      }
      // Old WordPress posts lived at /<slug>/ — send them to /blog/<slug> (301).
      if (/^[^/]+$/.test(splat) && findSummary(splat)) {
        throw redirect({ href: `/blog/${splat}`, statusCode: 301 });
      }
      throw notFound();
    }
    // Preserve the hand-built page design, but let WordPress SEO fields override its metadata.
    const liveWpPage = await fetchWordPressPageBySlug(splat.split('/').filter(Boolean).at(-1) || '');
    const liveWpSeo = liveWpPage ? await getWordPressPageSeo(liveWpPage) : null;
    const rankMathSeo = liveWpSeo?.rankMath || await fetchRankMathSeo(absUrl(page.path));
    return {
      ...NONE,
      path: page.path,
      kind: page.kind as string,
      parent: page.parent ?? null,
      crumb: page.title,
      image: (rankMathSeo?.image || liveWpSeo?.image || page.ogImage || null) as string | null,
      ...(liveWpPage ? { wpPage: liveWpPage, wpSeo: liveWpSeo } : {}),
      rankMathSeo,
      title: rankMathSeo?.title || liveWpSeo?.title || page.seoTitle || page.title,
      description: rankMathSeo?.description || liveWpSeo?.description || page.metaDescription,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const ind = loaderData.industry ?? loaderData.service;
    const rankMathSeo = loaderData.rankMathSeo ?? loaderData.wpSeo?.rankMath ?? null;
    // Keep Rank Math titles exact; fallback titles retain the MarketJoy suffix.
    const title =
      rankMathSeo?.title || (ind || /marketjoy/i.test(loaderData.title) ? loaderData.title : `${loaderData.title} | MarketJoy`);
    const post = loaderData.post;
    const image = rankMathSeo?.image || loaderData.image || post?.image;
    const { meta, links } = seo({
      title,
      description: rankMathSeo?.description || loaderData.description,
      path: loaderData.path,
      ...(image ? { image } : {}),
      ...(post
        ? {
            image: rankMathSeo?.image || post.rankMathSeo?.image || post.image,
            type: "article" as const,
            ...(post.canonicalSlug ? { canonicalPath: `/blog/${post.canonicalSlug}` } : {}),
          }
        : {}),
      ...(ind
        ? {
            ...(loaderData.service ? {} : { type: "article" as const }),
            ...(rankMathSeo?.image || ind.seo.ogImage
              ? { image: rankMathSeo?.image || absUrl(ind.seo.ogImage || "").replace(/\/$/, "") }
              : loaderData.service
                ? { image: OG_IMAGE } // services/products without a Rank Math social image still get a share card
                : {}),
          }
        : {}),
    });
    const wpSeo = loaderData.wpSeo;
    const canonical = rankMathSeo?.canonical || wpSeo?.canonical;
    if (canonical) {
      const canonicalLink = links.find((link) => link.rel === "canonical");
      if (canonicalLink) canonicalLink.href = canonical;
    }
    if (rankMathSeo?.robots || wpSeo?.robots) {
      meta.push({ name: "robots", content: rankMathSeo?.robots || wpSeo?.robots || "" } as never);
    }
    if (rankMathSeo?.type) {
      const ogType = meta.find((item) => "property" in item && item.property === "og:type");
      if (ogType) ogType.content = rankMathSeo.type;
    }
    if (rankMathSeo?.twitterCard) {
      meta.push({ name: "twitter:card", content: rankMathSeo.twitterCard } as never);
    }
    const toUrl = (href: string) => (/^https?:/.test(href) ? href : absUrl(href));
    const crumbs = [
      { name: "Home", url: `${SITE_URL}/` },
      ...(loaderData.parent
        ? [{ name: loaderData.parent.label, url: toUrl(loaderData.parent.href) }]
        : []),
      {
        name: post ? post.title : loaderData.vendor ? loaderData.vendor.title : (loaderData.crumb ?? loaderData.title),
        url: absUrl(loaderData.path),
      },
    ];
    // FAQ schema only where the FAQs are visible: the full FAQ page shows all, service/product pages show the first 4.
    if (!rankMathSeo?.robots && ind?.seo.robots && /noindex/i.test(ind.seo.robots)) meta.push({ name: "robots", content: ind.seo.robots } as never);
    if (ind && !rankMathSeo?.twitterCard) meta.push({ name: "twitter:card", content: "summary_large_image" } as never);
    const svc = loaderData.service;
    if (svc?.seo.ogImageAlt) meta.push({ property: "og:image:alt", content: svc.seo.ogImageAlt } as never);
    if (svc?.seo.modified) meta.push({ property: "og:updated_time", content: svc.seo.modified } as never);
    const productMeta = svc ? PRODUCT_META[svc.path] : undefined;
    const faqs =
      ind ? ind.faqs.map((f) => ({ q: f.q, a: f.a })) : loaderData.kind === "faqs"
        ? FAQS
        : loaderData.kind === "service" || loaderData.kind === "product"
          ? FAQS.slice(0, 4)
          : [];
    return {
      meta,
      links,
      scripts: [
        jsonLd(breadcrumbSchema(crumbs)),
        ...(post
          ? [
              jsonLd(
                blogPostingSchema({
                  title: post.title,
                  description: post.metaDescription,
                  path: loaderData.path,
                  image: rankMathSeo?.image || post.image,
                  date: post.date,
                  author: post.author,
                  category: post.category,
                  tags: post.tags,
                }),
              ),
            ]
          : []),
        ...(faqs.length ? [jsonLd(faqSchema(faqs))] : []),
        ...(ind
          ? [
              jsonLd({
                "@context": "https://schema.org",
                "@type": loaderData.service ? "WebPage" : "Article",
                headline: ind.title,
                description: ind.seo.description,
                url: absUrl(ind.path),
                ...(ind.seo.published ? { datePublished: ind.seo.published } : {}),
                ...(ind.seo.modified ? { dateModified: ind.seo.modified } : {}),
                ...(ind.seo.ogImage ? { image: absUrl(ind.seo.ogImage).replace(/\/$/, "") } : {}),
                publisher: { "@type": "Organization", name: "MarketJoy, Inc.", url: SITE_URL },
              }),
            ]
          : []),
        // Product pages: /products/ is a CollectionPage, each product a Service (see lib/seo.ts).
        ...(svc && productMeta
          ? [
              jsonLd(
                svc.path === "/products/"
                  ? productsHubSchema({
                      name: svc.seo.title ?? svc.title,
                      description: svc.seo.description ?? "",
                      path: svc.path,
                      items: SERVICES_INDEX.filter((i) => i.parent === "/products/").map((i) => ({
                        name: PRODUCT_META[i.path]?.label ?? i.title,
                        path: i.path,
                      })),
                    })
                  : productServiceSchema({
                      name: productMeta.label,
                      description: svc.seo.description ?? "",
                      path: svc.path,
                      serviceType: productMeta.serviceType,
                      image: absUrl(svc.seo.ogImage || "/og-image.png").replace(/\/$/, ""),
                    }),
              ),
            ]
          : []),
        // /curtis-bendt/: schema.org Person (name, title and employer exactly as on the page).
        ...(loaderData.kind === "member"
          ? [
              jsonLd({
                "@context": "https://schema.org",
                "@type": "Person",
                name: CURTIS.name,
                jobTitle: CURTIS.role,
                image: absUrl(CURTIS.image).replace(/\/$/, ""),
                url: absUrl(loaderData.path),
                sameAs: [CURTIS.linkedin],
                worksFor: { "@type": "Organization", name: "MarketJoy, Inc.", url: SITE_URL },
              }),
            ]
          : []),
        // Vendor pages show their FAQs in an accordion, so the FAQ schema matches visible content.
        ...(loaderData.vendor?.faqs.length ? [jsonLd(faqSchema(loaderData.vendor.faqs))] : []),
      ],
    };
  },
  component: Page,
});

function RoutePending() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" aria-label="Loading page">
        <section className="bg-navy py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Skeleton className="h-4 w-32 bg-navy-foreground/15" />
            <Skeleton className="mt-5 h-10 w-full max-w-2xl bg-navy-foreground/15" />
            <Skeleton className="mt-3 h-10 w-4/5 max-w-xl bg-navy-foreground/15" />
          </div>
        </section>
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Skeleton className="h-8 w-64" />
            <div className="mt-8 grid cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="card-glow flex h-full flex-col overflow-hidden"
                  aria-hidden="true"
                >
                  <Skeleton className="aspect-[16/9] w-full rounded-none" />
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-4 h-6 w-full" />
                    <Skeleton className="mt-2 h-6 w-4/5" />
                    <Skeleton className="mt-5 h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Page() {
  const { path, post, vendor, term, kind, cptType, entry, industry, service, wpPage } = Route.useLoaderData();
  if (kind === "service-entry" && service) return <ServiceEntryPage entry={service} />;
  if (kind === "industry-entry" && industry) return <IndustryEntryPage entry={industry} />;
  if (post) return <BlogPostPage post={post} />;
  if (vendor) return <VendorPageView vendor={vendor} />;
  if (kind === "joypedia-entry" && term) return <JoypediaEntryPage entry={term} />;
  if (kind === "joypedia") return <JoypediaListing />;
  if (kind === "cpt-entry" && entry && cptType) return <ContentEntryPage type={cptType} entry={entry} />;
  if (kind === "cpt-list" && cptType) return <ContentListing type={cptType} />;
  if (kind === "wordpress-page" && wpPage) return <WordPressPageView page={wpPage} />;
  return <SitePage path={path} />;
}
