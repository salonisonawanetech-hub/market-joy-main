import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SitePage } from "@/components/pages/Pages";
import { findPage } from "@/components/pages/content";
import { BlogPostPage } from "@/components/pages/BlogPages";
import { VendorPageView } from "@/components/pages/VendorPages";
import { JoypediaEntryPage, JoypediaListing } from "@/components/pages/JoypediaPages";
import { ContentEntryPage, ContentListing } from "@/components/pages/ContentPages";
import { IndustryEntryPage } from "@/components/pages/IndustryPages";
import { ServiceEntryPage } from "@/components/pages/ServicePages";
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
const NONE = { industry: null, service: null, post: null, vendor: null, term: null, cptType: null, entry: null, crumb: null, image: null } as const;

export const Route = createFileRoute("/$")({
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
        return {
          ...NONE,
          path: `/joypedia/${term.slug}`,
          kind: "joypedia-entry" as string,
          title: term.seo.title ?? `${term.title} | JoyPedia`,
          description: term.seo.description ?? term.excerpt,
          parent: { label: "JoyPedia", href: "/joypedia/" },
          term,
          crumb: term.title,
        };
      }
      return {
        ...NONE,
        path: "/joypedia",
        kind: "joypedia" as string,
        title: "JoyPedia",
        description: "Our B2B sales and marketing knowledge base.",
        parent: null,
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
        return {
          ...NONE,
          path: `${meta.base}/${entry.slug}`,
          kind: "cpt-entry" as string,
          title: entry.seo.title ?? entry.title,
          description: entry.seo.description ?? entry.excerpt,
          parent: { label: meta.label, href: `${meta.base}/` },
          cptType,
          entry,
          crumb: entry.title,
        };
      }
      return {
        ...NONE,
        path: meta.base,
        kind: "cpt-list" as string,
        title: meta.label,
        description: meta.sub,
        parent: null,
        cptType,
      };
    }

    // Migrated WordPress industry pages: /industries/..., /construction-lead-generation/...
    if (/^(industries|construction-lead-generation)(\/|$)/.test(splat)) {
      const industry = await loadIndustryByPath(splat);
      if (industry) {
        const segs = industry.path.split("/").filter(Boolean);
        const parentPath = segs.length > (segs[0] === "industries" ? 2 : 1) ? `/${segs.slice(0, -1).join("/")}/` : null;
        const parent = parentPath ? await loadIndustryByPath(parentPath) : null;
        return {
          ...NONE,
          path: industry.path,
          kind: "industry-entry" as string,
          title: industry.seo.title ?? industry.title,
          description: industry.seo.description ?? "",
          parent: parent ? { label: parent.title, href: parent.path } : { label: "Industries", href: "/industries/" },
          industry,
          crumb: industry.title,
        };
      }
    }

    // Migrated WordPress service + product pages: /b2b-list-building-services/, /products/infojoy/ ...
    const service = await loadServiceByPath(splat);
    if (service) {
      return {
        ...NONE,
        path: service.path,
        kind: "service-entry" as string,
        title: service.seo.title ?? service.title,
        description: service.seo.description ?? "",
        parent: service.kind === "product" && service.path !== "/products/" ? { label: "Products", href: "/products/" } : null,
        service,
        crumb: PRODUCT_META[service.path]?.label ?? service.title,
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
      };
    }
    const vend = /^vendor\/([^/]+)$/.exec(splat);
    if (vend?.[1]) {
      const vendor = await loadVendor(vend[1]);
      if (!vendor) throw notFound();
      return {
        ...NONE,
        path: `/vendor/${vendor.slug}`,
        kind: "vendor" as string,
        title: vendor.seoTitle,
        description: vendor.metaDescription,
        parent: { label: VENDORS_LABEL, href: VENDORS_PATH },
        vendor,
      };
    }
    const page = findPage(splat);
    if (!page) {
      // Old WordPress posts lived at /<slug>/ — send them to /blog/<slug> (301).
      if (/^[^/]+$/.test(splat) && findSummary(splat)) {
        throw redirect({ href: `/blog/${splat}`, statusCode: 301 });
      }
      throw notFound();
    }
    return {
      ...NONE,
      path: page.path,
      kind: page.kind as string,
      title: page.seoTitle ?? page.title,
      description: page.metaDescription,
      parent: page.parent ?? null,
      crumb: page.title,
      image: (page.ogImage ?? null) as string | null,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const ind = loaderData.industry ?? loaderData.service;
    // Industry pages keep their exact old Rank Math title; everything else gets the site suffix.
    const title =
      ind || /marketjoy/i.test(loaderData.title) ? loaderData.title : `${loaderData.title} | MarketJoy`;
    const post = loaderData.post;
    const { meta, links } = seo({
      title,
      description: loaderData.description,
      path: loaderData.path,
      ...(loaderData.image ? { image: loaderData.image } : {}),
      ...(post
        ? {
            image: post.image,
            type: "article" as const,
            ...(post.canonicalSlug ? { canonicalPath: `/blog/${post.canonicalSlug}` } : {}),
          }
        : {}),
      ...(ind
        ? {
            ...(loaderData.service ? {} : { type: "article" as const }),
            ...(ind.seo.ogImage
              ? { image: absUrl(ind.seo.ogImage).replace(/\/$/, "") }
              : loaderData.service
                ? { image: OG_IMAGE } // services/products without a Rank Math social image still get a share card
                : {}),
          }
        : {}),
    });
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
    if (ind?.seo.robots && /noindex/i.test(ind.seo.robots)) meta.push({ name: "robots", content: ind.seo.robots } as never);
    if (ind) meta.push({ name: "twitter:card", content: "summary_large_image" } as never);
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
                  image: post.image,
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

function Page() {
  const { path, post, vendor, term, kind, cptType, entry, industry, service } = Route.useLoaderData();
  if (kind === "service-entry" && service) return <ServiceEntryPage entry={service} />;
  if (kind === "industry-entry" && industry) return <IndustryEntryPage entry={industry} />;
  if (post) return <BlogPostPage post={post} />;
  if (vendor) return <VendorPageView vendor={vendor} />;
  if (kind === "joypedia-entry" && term) return <JoypediaEntryPage entry={term} />;
  if (kind === "joypedia") return <JoypediaListing />;
  if (kind === "cpt-entry" && entry && cptType) return <ContentEntryPage type={cptType} entry={entry} />;
  if (kind === "cpt-list" && cptType) return <ContentListing type={cptType} />;
  return <SitePage path={path} />;
}
