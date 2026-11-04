import { VideoTestimonial } from "@/components/home/VideoTestimonial";
import { FlowButton } from "@/components/ui/flow-button";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Plus,
  ExternalLink,
  ShieldCheck,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { Navbar } from "@/components/home/Navbar";
import { Reveal, slide, zig } from "@/components/home/Reveal";
import { FxIcon } from "@/components/home/FxIcon";
import { FaqSection } from "@/components/home/Faq";
import { TESTIMONIALS_WITH_QUOTE } from "@/content/testimonials/loader";
import { AutoCount } from "@/components/home/CountUp";
import { FinalCta, Footer, SectionHead } from "@/components/home/Sections";
import {
  BOOK_URL,
  FAQS,
  PILLARS,
  STORIES,
  TESTIMONIALS,
} from "@/components/home/data";
import { BlogListing } from "./BlogPages";
import { AboutBody, CurtisBody } from "./AboutPages";
import { VendorsDirectory } from "./VendorPages";
import { ALL_PAGES, INDUSTRY_TOP, PRODUCT_LIST, SERVICE_LIST, type PageDef } from "./content";

const PILLAR_ICONS = { guarantee: ShieldCheck, team: Users, setup: DollarSign } as const;

function PageHero({ page }: { page: PageDef }) {
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
          {page.parent && (
            <>
              <ChevronRight className="h-3 w-3" />
              <a href={page.parent.href} className="hover:text-gold">
                {page.parent.label}
              </a>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-navy-foreground">{page.title}</span>
        </nav>
        <Reveal from="left">
          <span className="eyebrow">{page.eyebrow}</span>
        </Reveal>
        <Reveal
          from="left"
          delay={80}
          as="h1"
          className="mt-4 max-w-3xl text-[2rem] font-extrabold leading-[1.1] min-[400px]:text-4xl sm:text-5xl"
        >
          {page.title}
        </Reveal>
        <Reveal
          from="left"
          delay={160}
          as="p"
          className="mt-4 max-w-2xl text-base text-navy-foreground/85 sm:mt-5 sm:text-lg"
        >
          {page.tagline}
        </Reveal>
        <Reveal from="left" delay={240} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <FlowButton href={BOOK_URL} variant="gold" className="py-3.5">
            Book a Meeting
          </FlowButton>
          <FlowButton href="/contact-us/" variant="ghost" className="py-3.5">
            Contact Us
          </FlowButton>
        </Reveal>
      </div>
    </section>
  );
}

function Intro({ page }: { page: PageDef }) {
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <Reveal from="left" className="min-w-0">
          <span className="eyebrow">Overview</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{page.title}</h2>
          {page.intro.map((t) => (
            <p key={t} className="mt-4 text-muted-foreground">
              {t}
            </p>
          ))}
        </Reveal>
        {page.bullets.length > 0 && (
          <Reveal
            from="right"
            delay={120}
            className="min-w-0 rounded-2xl bg-navy p-5 text-navy-foreground shadow-lift sm:p-7"
          >
            <h3 className="text-lg font-bold text-gold-bright">What you get</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {page.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

const STEPS = [
  ["Define your ICP", "We map your ideal customer profile and research target accounts."],
  ["Build targeted data", "Hand-curated contacts powered by InfoJoy and buyer intent signals."],
  ["Launch in 15 days", "Custom scripts, domain warming and inbox setup, then outreach goes live."],
  [
    "Optimize every two weeks",
    "Live performance reviews and updated tactics to keep improving results.",
  ],
];
function Process() {
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="How it works"
          title="From Kickoff to Qualified Meetings"
          sub="A structured process built for speed, transparency and results."
        />
        <ol className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <Reveal
              as="li"
              key={t}
              from={zig(i)}
              delay={i * 80}
              className="relative rounded-2xl bg-card p-6 shadow-card"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display font-extrabold text-navy-deep">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-3">
        {PILLARS.map((p, i) => {
          const Icon = PILLAR_ICONS[p.key];
          return (
            <Reveal
              key={p.key}
              from={slide(i)}
              delay={i * 90}
              className="flex items-center gap-4 rounded-2xl bg-navy p-5 text-navy-foreground shadow-card sm:p-6"
            >
              <span className="grid h-12 w-12 shrink-0 icon-tile place-items-center rounded-xl bg-gold">
                <FxIcon icon={Icon} className="h-6 w-6 text-navy-deep" />
              </span>
              <p className="font-display text-lg font-bold">{p.title}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function CardGrid({
  items,
  cols = "lg:grid-cols-3",
}: {
  items: { label: string; href: string }[];
  cols?: string;
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${cols}`}>
      {items.map((it, i) => (
        <Reveal key={it.href} delay={(i % 6) * 50}>
          <a
            href={it.href}
            className="card-glow flex h-full items-center justify-between gap-3 p-5"
          >
            <span className="font-semibold">{it.label}</span>
            <ArrowRight className="arrow h-4 w-4 shrink-0 text-brand-blue" />
          </a>
        </Reveal>
      ))}
    </div>
  );
}

function FaqMini({ count = 4 }: { count?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-y">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHead eyebrow="FAQ" title="Common Questions" link="/faqs/" linkLabel="All FAQs" />
        <div className="space-y-3">
          {FAQS.slice(0, count).map((f, i) => {
            const o = open === i;
            return (
              <div key={f.q} className="rounded-xl border bg-card">
                <button
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold sm:px-5"
                  aria-expanded={o}
                  onClick={() => setOpen(o ? null : i)}
                >
                  {f.q}
                  <Plus
                    className={`h-5 w-5 shrink-0 text-gold transition-transform ${o ? "rotate-45" : ""}`}
                  />
                </button>
                {o && (
                  <p className="px-4 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-5">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- templates ---------- */
function ServiceLike({ page }: { page: PageDef }) {
  const others = (page.kind === "product" ? PRODUCT_LIST : SERVICE_LIST).filter(
    (p) => p.path !== page.path,
  );
  return (
    <>
      <Intro page={page} />
      <Process />
      <Pillars />
      <section className="section-pb">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            eyebrow="Explore more"
            title={page.kind === "product" ? "More MarketJoy Products" : "More Services"}
          />
          <CardGrid
            items={others.slice(0, 6).map((o) => ({ label: o.title, href: o.path + "/" }))}
          />
        </div>
      </section>
      <FaqMini />
    </>
  );
}

const HELP = [
  ["ICP-first targeting", "We define the buyers, accounts and signals that matter in your market."],
  ["Hand-curated contacts", "Verified decision-maker data from the InfoJoy GTM engine."],
  ["Multichannel outreach", "Personalized email and calling campaigns run by dedicated SDRs."],
  ["Guaranteed SQLs", "Our 100% SQL Guarantee keeps results accountable."],
];
function IndustryPage({ page }: { page: PageDef }) {
  const siblings = INDUSTRY_TOP.filter(
    (i) => i.href !== page.path && i.href !== page.parent?.href,
  ).slice(0, 6);
  return (
    <>
      <Intro page={page} />
      <section className="section-y bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Who we reach" title="Decision-Makers We Connect You With" />
          <div className="flex flex-wrap gap-3">
            {page.roles.map((r) => (
              <span
                key={r}
                className="rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-card sm:px-5 sm:py-2.5"
              >
                <Check className="mr-2 inline h-4 w-4 text-gold" />
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            eyebrow="How MarketJoy helps"
            title="A Predictable Pipeline for Your Sales Team"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HELP.map(([t, d], i) => (
              <Reveal key={t} from={slide(i)} delay={i * 80}>
                <div className="card-glow h-full p-6">
                  <h3 className="font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {page.children && page.children.length > 0 && (
        <section className="section-y bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHead
              eyebrow="Specializations"
              title={`${page.title.replace(" Lead Generation", "")} Segments We Serve`}
            />
            <CardGrid items={page.children} />
          </div>
        </section>
      )}
      <Pillars />
      <section className="section-pb">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            eyebrow="Other industries"
            title="Explore More Industries"
            link="/industries/manufacturing-lead-generation/"
            linkLabel="View manufacturing"
          />
          <CardGrid items={siblings} />
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Name: ${f.get("name")}\nCompany: ${f.get("company")}\nEmail: ${f.get("email")}\n\n${f.get("message")}`;
    window.location.href = `mailto:hello@marketjoy.com?subject=${encodeURIComponent("Website enquiry from " + f.get("name"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const input =
    "w-full min-w-0 rounded-lg border bg-background px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/40 sm:text-sm";
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <Reveal as="div" className="min-w-0 rounded-2xl border bg-card p-5 shadow-card sm:p-7">
          <h2 className="text-2xl font-extrabold">Send us a message</h2>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              required
              name="name"
              placeholder="Your name"
              aria-label="Your name"
              className={input}
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Work email"
              aria-label="Work email"
              className={input}
            />
            <input
              name="company"
              placeholder="Company"
              aria-label="Company"
              className={`${input} sm:col-span-2`}
            />
            <textarea
              required
              name="message"
              rows={5}
              placeholder="How can we help?"
              aria-label="Message"
              className={`${input} sm:col-span-2`}
            />
            <FlowButton type="submit" variant="gold" className="sm:col-span-2">
              Send message
            </FlowButton>
            {sent && (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                Your email app should open with the message ready to send.
              </p>
            )}
          </form>
        </Reveal>
        <Reveal delay={120} className="min-w-0 space-y-4">
          <div className="rounded-2xl bg-navy p-5 text-navy-foreground shadow-lift sm:p-7">
            <h3 className="text-lg font-bold text-gold-bright">Contact information</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-gold" />
                186 N Palafox Street, Pensacola, FL 32502, USA
              </li>
              <li>
                <a href="tel:+14846386389" className="flex gap-3 hover:text-gold">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  +1 (484) 638-6389
                </a>
              </li>
              <li>
                <a href="mailto:hello@marketjoy.com" className="flex gap-3 hover:text-gold">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  hello@marketjoy.com
                </a>
              </li>
            </ul>
          </div>
          <FlowButton href={BOOK_URL} variant="gold" className="w-full py-4">
            Book a Meeting
          </FlowButton>
        </Reveal>
      </div>
    </section>
  );
}

function FaqFull() {
  return <FaqSection />;
}

function Cases() {
  return (
    <section className="section-y">
      <div className="mx-auto grid cols-3 max-w-7xl gap-5 px-4 sm:gap-6 sm:px-6">
        {STORIES.map((s, i) => (
          <Reveal key={s.client} from={slide(i)} delay={i * 90}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-glow flex h-full flex-col p-5 sm:p-7"
            >
              <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-brand-blue">
                {s.industry}
              </span>
              <p className="mt-4 text-sm font-semibold text-muted-foreground">{s.client}</p>
              <h3 className="mt-1 flex-1 text-xl font-bold">{s.title}</h3>
              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4">
                <FxIcon icon={TrendingUp} className="h-5 w-5 text-success" />
                <span className="font-display text-3xl font-extrabold sm:text-4xl">
                  <AutoCount value={s.metric} />
                </span>
                <span className="text-sm text-muted-foreground">{s.metricLabel}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-brand-blue">
                See how we did it for {s.industry}
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section-y">
      <div className="mx-auto grid cols-3 max-w-7xl gap-5 px-4 sm:gap-6 sm:px-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.name}
            from={slide(i)}
            delay={i * 90}
            as="figure"
            className="flex h-full flex-col rounded-2xl bg-card p-5 shadow-card sm:p-7"
          >
            <VideoTestimonial t={t} />
            <figcaption className="mt-6 border-t pt-4">
              <p className="font-bold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </figcaption>
          </Reveal>
        ))}
      </div>
      <QuoteReviews />
    </section>
  );
}

/** Written testimonials migrated from the WordPress `testimonials` post type (quotes recovered from the old pages). */
function QuoteReviews() {
  // The export contains "Sean Cotter" twice with the same quote; show each distinct name+quote once (data is kept).
  const seen = new Set<string>();
  const list = TESTIMONIALS_WITH_QUOTE.filter((t) => {
    const k = `${t.name}|${t.quote}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-6 text-2xl font-extrabold">More client feedback</h2>
      <div className="grid cols-3 gap-5 sm:gap-6">
        {list.map((t, i) => (
          <Reveal
            key={t.slug}
            from={slide(i)}
            delay={(i % 3) * 90}
            as="figure"
            className="flex h-full flex-col rounded-2xl bg-card p-5 shadow-card sm:p-7"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t pt-4">
              <p className="font-bold">{t.name}</p>
              {t.roleCompany && <p className="text-xs text-muted-foreground">{t.roleCompany}</p>}
            </figcaption>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function External({ page }: { page: PageDef }) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-lg text-muted-foreground">{page.tagline}</p>
        <FlowButton
          href={page.external}
          target="_blank"
          rel="noopener noreferrer"
          variant="gold"
          className="mt-8 py-4"
        >
          Open on marketjoy.com <ExternalLink className="h-4 w-4" />
        </FlowButton>
      </div>
    </section>
  );
}

function ProductsIndex() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CardGrid items={PRODUCT_LIST.map((p) => ({ label: p.title, href: p.path + "/" }))} />
      </div>
    </section>
  );
}

export function SitePage({ path }: { path: string }) {
  const page = ALL_PAGES.find(
    (p) => "/" + p.path.replace(/^\/+|\/+$/g, "") === "/" + path.replace(/^\/+|\/+$/g, ""),
  );
  if (!page) return null;
  const body = {
    service: <ServiceLike page={page} />,
    product: <ServiceLike page={page} />,
    industry: <IndustryPage page={page} />,
    about: <AboutBody />,
    member: <CurtisBody />,
    contact: <Contact />,
    blog: <BlogListing />,
    faqs: <FaqFull />,
    cases: <Cases />,
    reviews: <Reviews />,
    external: <External page={page} />,
    productsIndex: <ProductsIndex />,
    vendors: <VendorsDirectory />,
  }[page.kind];
  return (
    <>
      <Navbar />
      <main>
        <PageHero page={page} />
        {body}
        {page.kind !== "contact" && page.kind !== "about" && <FinalCta />}
      </main>
      <Footer />
    </>
  );
}
