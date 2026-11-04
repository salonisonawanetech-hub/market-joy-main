import { useRef, type RefObject } from "react";
import { Navbar } from "@/components/home/Navbar";
import { FinalCta, Footer } from "@/components/home/Sections";
import { Hero } from "@/components/pages/ContentPages";
import { useWpImageFallback } from "@/lib/wp-images";
import industryHero from "@/assets/industry-hero.jpg";
import { IndustriesHub } from "@/components/pages/IndustriesHub";
import { IndustryBlocks } from "@/components/pages/IndustryBlocks";
import { BusinessConsultingBody } from "@/components/pages/IndustryLayouts";
import { INDUSTRIES_INDEX, type IndustryEntry } from "@/content/industries/loader";

const CONSULTING_SLUG = "industries__business-consulting-lead-generation";

export function IndustryEntryPage({ entry }: { entry: IndustryEntry }) {
  const bodyRef = useRef<HTMLElement>(null);
  useWpImageFallback(bodyRef, entry.slug);
  const parentItem = entry.parent ? INDUSTRIES_INDEX.find((i) => i.path === entry.parent) : undefined;
  const crumbs =
    entry.path === "/industries/"
      ? [{ label: entry.title }]
      : [
          { label: "Industries", href: "/industries/" },
          ...(parentItem ? [{ label: parentItem.title, href: parentItem.path }] : []),
          { label: entry.title },
        ];
  const children = INDUSTRIES_INDEX.filter((i) => i.parent === entry.path);
  return (
    <>
      <Navbar />
      <main>
        <Hero
          eyebrow="Industries we serve"
          title={entry.title}
          crumbs={crumbs}
          image={industryHero}
        />
        {entry.path === "/industries/" ? (
          <IndustriesHub />
        ) : entry.slug === CONSULTING_SLUG ? (
          <div ref={bodyRef as RefObject<HTMLDivElement>}>
            <BusinessConsultingBody />
          </div>
        ) : entry.layout ? (
          <div ref={bodyRef as RefObject<HTMLDivElement>}>
            <IndustryBlocks blocks={entry.layout} />
            {children.length > 0 && (
              <section className="section-y">
                <ul className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
                  {children.map((c) => (
                    <li key={c.slug}>
                      <a href={c.path} className="card-glow block p-4 font-semibold">
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <section className="section-y">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <article
                ref={bodyRef}
                className="article-body"
                // Sanitised at migration time by scripts/migrate-industries.mjs.
                dangerouslySetInnerHTML={{ __html: entry.html }}
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
        )}
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
