import { useRef } from "react";
import { Navbar } from "@/components/home/Navbar";
import { FinalCta, Footer } from "@/components/home/Sections";
import { Hero } from "@/components/pages/ContentPages";
import { InfoJoyBody, ProductsHubBody } from "@/components/pages/ProductPages";
import { layoutB2BServiceHtml } from "@/components/pages/B2BServiceLayout";
import { useWpImageFallback } from "@/lib/wp-images";
import { PRODUCT_META, SERVICES_INDEX, type ServiceEntry } from "@/content/services/loader";

const DIGITAL_MARKETING_SERVICE_TITLES: Record<string, string> = {
  "ai-seo-services": "AI SEO Services",
  "answer-engine-optimization-services": "Answer Engine Optimization Services",
  "generative-engine-optimization-services": "Generative Engine Optimization Services",
  "omnichannel-marketing-services": "Omnichannel Marketing Services",
};

/** Services + products pages migrated from the WordPress export (content, SEO and images kept as-is). */
export function ServiceEntryPage({ entry }: { entry: ServiceEntry }) {
  const bodyRef = useRef<HTMLElement>(null);
  useWpImageFallback(bodyRef, entry.slug);
  const isProduct = entry.kind === "product";
  const isIndex = entry.path === "/products/";
  const isB2BLeadGeneration = entry.slug === "b2b-lead-generation-services";
  const pageTitle = DIGITAL_MARKETING_SERVICE_TITLES[entry.slug] ?? entry.title;
  const crumbs = isIndex
    ? [{ label: entry.title }]
    : isProduct
      ? [{ label: "Products", href: "/products/" }, { label: PRODUCT_META[entry.path]?.label ?? entry.title }]
      : DIGITAL_MARKETING_SERVICE_TITLES[entry.slug]
        ? [{ label: "Digital Marketing", href: "/digital-marketing/" }, { label: pageTitle }]
        : [{ label: pageTitle }];
  // The hub body already links to each product; don't repeat the title-only list under it.
  const children = isIndex ? [] : SERVICES_INDEX.filter((i) => i.parent === entry.path);
  // The hub and InfoJoy have hand-built section layouts (copy + SEO stay in the JSON entries).
  const custom = isIndex ? <ProductsHubBody /> : entry.path === "/products/infojoy/" ? <InfoJoyBody entry={entry} /> : null;
  if (custom) {
    return (
      <>
        <Navbar />
        <main>
          <Hero eyebrow="Products" title={entry.title} crumbs={crumbs} />
          {custom}
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />
      <main>
        <Hero eyebrow={isProduct ? "Products" : "Services"} title={pageTitle} crumbs={crumbs} />
        <section className="section-y">
          <div className={`mx-auto ${isProduct ? "max-w-4xl" : "max-w-7xl"} px-4 sm:px-6`}>
            <article
              ref={bodyRef}
              className={`article-body ${isProduct ? "" : "service-entry-body mx-auto max-w-6xl"} ${isB2BLeadGeneration ? "b2b-service-body" : ""}`}
              // Sanitised at migration time by scripts/migrate-services-xml.py.
              dangerouslySetInnerHTML={{
                __html: isB2BLeadGeneration ? layoutB2BServiceHtml(entry.html) : entry.html,
              }}
            />
            {children.length > 0 && (
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {children.map((c) => (
                  <li key={c.slug}>
                    <a href={c.path} className="card-glow block p-4 font-semibold">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
