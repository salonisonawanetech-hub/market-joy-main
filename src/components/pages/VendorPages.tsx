import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, ExternalLink, Search } from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { FlowButton } from "@/components/ui/flow-button";
import { Navbar } from "@/components/home/Navbar";
import { Reveal, slide } from "@/components/home/Reveal";
import { FinalCta, Footer, SectionHead } from "@/components/home/Sections";
import {
  VENDORS_LABEL,
  VENDORS_PATH,
  VENDOR_CATEGORIES,
  VENDOR_INDEX,
  isExternalVendorHref,
  relatedVendors,
  vendorHref,
  type VendorPage,
  type VendorSummary,
} from "@/data/vendors/vendors";

const STEP = 24;

/* ---------------- shared bits ---------------- */
function Pill({ children, tone = "gold" }: { children: string; tone?: "gold" | "muted" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        tone === "gold" ? "bg-gold/20 text-navy" : "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function Logo({ v, className = "" }: { v: VendorSummary; className?: string }) {
  if (!v.logo) {
    return (
      <div
        className={`grid place-items-center bg-muted text-3xl font-extrabold text-navy ${className}`}
        aria-hidden="true"
      >
        {v.title.charAt(0)}
      </div>
    );
  }
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <img
        src={v.logo}
        alt={`${v.title} logo`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain p-3"
      />
    </div>
  );
}

function VendorCard({ v, index = 0 }: { v: VendorSummary; index?: number }) {
  const href = vendorHref(v);
  const external = isExternalVendorHref(href);
  return (
    <Reveal from={slide(index)} delay={(index % 3) * 90} className="h-full">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="card-glow flex h-full flex-col overflow-hidden"
      >
        <Logo v={v} className="aspect-[16/9] border-b" />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {v.type && <Pill>{v.type}</Pill>}
            {v.category && <Pill tone="muted">{v.category}</Pill>}
          </div>
          <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">{v.tagline}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
            {v.page ? "View details" : "Visit website"}{" "}
            {external ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowRight className="arrow h-4 w-4" />
            )}
          </span>
        </div>
      </a>
    </Reveal>
  );
}

/* ---------------- directory (/b2b-sales-marketing-lead-generation-vendors) ---------------- */
export function VendorsDirectory() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [limit, setLimit] = useState(STEP);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VENDOR_INDEX.filter(
      (v) =>
        (!cat || v.categorySlug === cat) &&
        (!q || `${v.title} ${v.tagline} ${v.category} ${v.type}`.toLowerCase().includes(q)),
    );
  }, [query, cat]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
      active
        ? "border-gold bg-gold text-navy-deep"
        : "bg-card text-muted-foreground hover:border-gold hover:text-foreground"
    }`;

  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground">
            Discover and compare leading B2B tools specializing in{" "}
            <a
              href="/blog/top-10-lead-generation-companies-usa/"
              className="font-semibold text-brand-blue hover:underline"
            >
              lead generation
            </a>
            , appointment setting,{" "}
            <a
              href="/outbound-sdr-services/"
              className="font-semibold text-brand-blue hover:underline"
            >
              SDR services
            </a>
            , demand generation, and revenue growth. Find the right solutions and partners to
            accelerate business growth.
          </p>
          <label className="relative mt-6 block">
            <span className="sr-only">Search tools</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(STEP);
              }}
              placeholder="Search tools by name, category, or feature..."
              className="w-full rounded-xl border bg-card py-3.5 pl-11 pr-4 text-sm shadow-card outline-none focus:border-gold"
            />
          </label>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            aria-pressed={cat === ""}
            className={chip(cat === "")}
            onClick={() => {
              setCat("");
              setLimit(STEP);
            }}
          >
            All
          </button>
          {VENDOR_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={cat === c.slug}
              className={chip(cat === c.slug)}
              onClick={() => {
                setCat(c.slug);
                setLimit(STEP);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
          Showing {Math.min(limit, results.length)} of {results.length} listings
        </p>
        {results.length === 0 ? (
          <p className="mt-6 rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            No listings match your search. Try a different keyword or category.
          </p>
        ) : (
          <div className="mt-4 grid cols-3 gap-5 sm:gap-6">
            {results.slice(0, limit).map((v, i) => (
              <VendorCard key={v.slug} v={v} index={i} />
            ))}
          </div>
        )}
        {results.length > limit && (
          <div className="mt-10 text-center">
            <FlowButton variant="outline" className="py-3.5" onClick={() => setLimit(limit + STEP)}>
              Show more
            </FlowButton>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- article (/vendor/<slug>) ---------------- */
function VendorHero({ v }: { v: VendorPage }) {
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
          <a href={VENDORS_PATH} className="hover:text-gold">
            {VENDORS_LABEL}
          </a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-navy-foreground">{v.title}</span>
        </nav>
        <Reveal from="left">
          <span className="eyebrow">{[v.type, v.category].filter(Boolean).join(" · ")}</span>
        </Reveal>
        <Reveal
          from="left"
          delay={80}
          as="h1"
          className="mt-4 max-w-3xl text-[2rem] font-extrabold leading-[1.1] min-[400px]:text-4xl sm:text-5xl"
        >
          {v.title}
        </Reveal>
        {v.tagline && (
          <Reveal
            from="left"
            delay={160}
            as="p"
            className="mt-4 max-w-2xl text-base text-navy-foreground/85 sm:mt-5 sm:text-lg"
          >
            {v.tagline}
          </Reveal>
        )}
        {v.website && (
          <Reveal from="left" delay={240} className="mt-6 sm:mt-8">
            <FlowButton
              href={v.website}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold"
              className="py-3.5"
            >
              Visit website <ExternalLink className="h-4 w-4" />
            </FlowButton>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function VendorPageView({ vendor }: { vendor: VendorPage }) {
  const related = relatedVendors(vendor);
  return (
    <>
      <Navbar />
      <main>
        <VendorHero v={vendor} />
        <section className="section-y">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
            <article
              className="article-body min-w-0"
              // Content comes from our own WordPress export and was sanitised at migration time.
              dangerouslySetInnerHTML={{ __html: vendor.content }}
            />
            <aside className="min-w-0 lg:order-last">
              <Reveal
                from="right"
                className="rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-24"
              >
                <Logo v={vendor} className="aspect-[16/9] rounded-xl border" />
                <dl className="mt-5 space-y-3 text-sm">
                  {vendor.type && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Type
                      </dt>
                      <dd className="mt-1 font-semibold">{vendor.type}</dd>
                    </div>
                  )}
                  {vendor.category && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </dt>
                      <dd className="mt-1 font-semibold">{vendor.category}</dd>
                    </div>
                  )}
                </dl>
                {vendor.website && (
                  <FlowButton
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="gold"
                    className="mt-5 w-full py-3"
                  >
                    Visit website <ExternalLink className="h-4 w-4" />
                  </FlowButton>
                )}
              </Reveal>
            </aside>
          </div>
        </section>
        {related.length > 0 && (
          <section className="section-y bg-muted">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHead
                eyebrow="Keep exploring"
                title="Related platforms"
                link={VENDORS_PATH}
                linkLabel="All platforms"
              />
              <div className="grid cols-3 gap-5 sm:gap-6">
                {related.map((v, i) => (
                  <VendorCard key={v.slug} v={v} index={i} />
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
