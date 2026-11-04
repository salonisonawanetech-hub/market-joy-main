import { FlowButton } from "@/components/ui/flow-button";
import { useGetPostsQuery } from "@/lib/wordpressApi";
import { useState, type CSSProperties } from "react";
import { useInView } from "./useInView";
import {
  ArrowRight,
  Check,
  Users,
  Cpu,
  Route,
  Megaphone,
  CalendarCheck,
  Rocket,
  ShieldCheck,
  Database,
  Bot,
  Gift,
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import heroImg from "@/assets/hero-team.jpg";
import ParticlesBg from "@/components/ui/particles-bg";
import { HeroStats } from "./HeroStats";
import { CountUp, AutoCount } from "./CountUp";
import { FxIcon } from "./FxIcon";
import { Reveal, slide, zig } from "./Reveal";
import { FaqSection } from "./Faq";
import { VideoTestimonial } from "./VideoTestimonial";
import {
  BOOK_URL,
  CLIENT_LOGOS,
  SERVICES,
  INDUSTRIES,
  PRODUCTS,
  FEATURES,
  STORIES,
  TESTIMONIALS,
  FAQS,
  FOOTER,
  LOGO_WHITE_URL,
  NAV,
  FREE_Q4_URL,
  PILLARS,
  ONBOARDING,
  TEAM_ROLES,
  BUNDLE,
  RECOGNITION,
} from "./data";

const MJ = "";

export function SectionHead({
  eyebrow,
  title,
  sub,
  link,
  linkLabel,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  link?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-2xl">
        <span className="eyebrow">{eyebrow}</span>
        <h2
          className={`mt-3 text-3xl font-extrabold sm:text-4xl ${dark ? "text-navy-foreground" : "text-foreground"}`}
        >
          {title}
        </h2>
        {sub && (
          <p className={`mt-3 ${dark ? "text-navy-foreground/75" : "text-muted-foreground"}`}>
            {sub}
          </p>
        )}
      </div>
      {link && (
        <a
          href={link}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline ${dark ? "text-white" : "text-brand-blue"}`}
        >
          {linkLabel}{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </Reveal>
  );
}

function GeoBackground() {
  return (
    <svg
      className="drift pointer-events-none absolute -right-20 -top-20 h-[140%] w-[70%] opacity-[0.07]"
      viewBox="0 0 400 400"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <polygon
            key={`${r}-${c}`}
            points={`${c * 50},${r * 50} ${c * 50 + 50},${r * 50} ${c * 50 + 25},${r * 50 + 43}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        )),
      )}
    </svg>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <div
        className="blob-morph pointer-events-none absolute -left-24 top-1/4 -z-30 h-80 w-80 bg-brand-blue/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="blob-morph pointer-events-none absolute bottom-[-4rem] left-1/3 -z-30 h-60 w-60 bg-gold/15 blur-3xl [animation-delay:-4s]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 -z-20 w-full opacity-30 [mask-image:linear-gradient(to_right,transparent,#000_45%)] lg:w-[62%] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent,#000_38%)]"
        aria-hidden="true"
      >
        <img
          src={heroImg}
          alt=""
          width={1280}
          height={960}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-transparent to-brand-blue/20" />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_50%,rgb(15_32_64/0.8),transparent_58%),linear-gradient(to_bottom,rgb(15_32_64/0.35),transparent_25%,transparent_75%,rgb(15_32_64/0.6))]"
        aria-hidden="true"
      />
      <ParticlesBg className="-z-[5]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div>
          <Reveal eager from="left">
            <span className="inline-flex items-center gap-2.5 text-[.72rem] font-bold uppercase tracking-[.14em] text-gold max-sm:text-[.68rem]">
              <span className="relative inline-flex h-3 w-3 shrink-0" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
                <span className="relative h-3 w-3 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
              </span>
              AI-Powered B2B Lead Generation Agency
            </span>
          </Reveal>
          <Reveal
            eager
            from="left"
            delay={80}
            as="h1"
            className="mt-4 text-[2rem] font-extrabold leading-[1.1] min-[400px]:text-4xl sm:mt-5 sm:text-5xl xl:text-[3.4rem]"
          >
            Generate More Qualified B2B Meetings{" "}
            <span className="text-shimmer">Without Building an In-House SDR Team.</span>
          </Reveal>
          <Reveal
            eager
            from="left"
            delay={160}
            as="p"
            className="mt-4 max-w-xl text-base text-navy-foreground/85 sm:mt-6 sm:text-lg"
          >
            We use an AI-powered GTM engine to find the companies most likely to buy from you, and
            then our team verifies every lead before it reaches your sales reps. You get qualified
            meetings, not lists.
          </Reveal>
          <Reveal
            eager
            from="left"
            delay={240}
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row"
          >
            <FlowButton href={FREE_Q4_URL} variant="gold" className="py-3.5">
              Get FREE Lead Generation for Q4
            </FlowButton>
            <FlowButton href="#services" variant="ghost" className="py-3.5">
              See How It Works
            </FlowButton>
          </Reveal>
          <Reveal
            eager
            from="left"
            delay={320}
            as="ul"
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-foreground/85 sm:mt-8"
          >
            {[
              "No Setup Fees",
              "AI-powered Targeting",
              "Human-verified Leads",
              "100% SQL Guarantee",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 rounded-full bg-gold/25 p-0.5 text-gold-bright" />
                {t}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal eager from="right" delay={200} className="relative hidden min-h-[430px] lg:block">
          <HeroStats />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- ABOUT + PILLARS ---------------- */
const PILLAR_ICONS = { guarantee: ShieldCheck, team: Users, setup: DollarSign } as const;

export function About() {
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:items-start">
        <Reveal from="left">
          <span className="eyebrow">Why MarketJoy</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            More than a B2B lead generation company. Committed partners in your sales and
            profitability.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Our data-driven approach identifies sales-qualified leads and buyers interested in your
            product or service, crafts tailored outreach campaigns and delivers early-stage
            opportunities that drive growth. We guarantee{" "}
            <a
              className="font-semibold text-brand-blue hover:underline"
              href="https://marketjoy.com/12-ways-to-generate-sales-qualified-leads-sqls-faster/"
            >
              sales-qualified leads
            </a>{" "}
            (SQL), ensuring you see measurable ROI.
          </p>
          <p className="mt-4 text-muted-foreground">
            Rooted in transparency, empathy, and performance, our structured outbound approach helps
            you accelerate your sales pipeline in just 15 days. From strategy to execution, our
            focus is simple: generate predictable, sales-qualified leads so you can close more deals
            faster.
          </p>
          <FlowButton href={BOOK_URL} variant="gold" popup className="mt-8 py-3.5">
            Claim Your 100% SQL Guarantee
          </FlowButton>
        </Reveal>
        <div>
          <Reveal from="right">
            <h3 className="text-xl font-bold">Trusted B2B Lead Generation Company in the USA</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Predictability and performance are key to scaling your revenue. We built a process
              that guarantees transparency, speed, and quality.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = PILLAR_ICONS[p.key];
              return (
                <Reveal
                  key={p.key}
                  from={slide(i)}
                  delay={i * 90}
                  className="group rounded-2xl bg-navy p-5 text-navy-foreground shadow-card transition hover:-translate-y-1 hover:shadow-lift sm:p-6 lg:p-5 xl:p-6"
                >
                  <span className="grid h-12 w-12 icon-tile place-items-center rounded-xl bg-gold transition-transform group-hover:rotate-6">
                    <FxIcon icon={Icon} className="h-6 w-6 text-navy-deep" />
                  </span>
                  <p className="mt-4 font-display text-base font-bold sm:text-lg lg:text-base xl:text-lg">
                    {p.title}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LOGOS + METRICS ---------------- */
export function Trust() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  const metrics = [
    { icon: Building2, value: "500+", label: "Companies trust MarketJoy" },
    { icon: Rocket, value: "15-Day", label: "Average launch time" },
    { icon: ShieldCheck, value: "100%", label: "Sales-qualified lead guarantee" },
    { icon: Database, value: "310M+", label: "B2B profiles" },
  ];
  return (
    <section className="border-b bg-muted">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <p className="eyebrow">Trusted by industry leaders</p>
        <div className="relative mt-6 overflow-hidden bg-muted [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="marquee flex w-max items-center gap-10 bg-muted py-3 sm:gap-16">
            {logos.map((l, i) => (
              <img
                key={i}
                src={l.src}
                alt={`${l.name} logo`}
                loading="lazy"
                className="logo-clean h-20 w-auto max-w-[250px] object-contain transition duration-300 ease-out hover:scale-[1.08] sm:h-24 sm:max-w-[290px]"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:gap-4 sm:px-6 sm:py-10 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal
            key={m.label}
            from={zig(i)}
            delay={i * 80}
            className="group flex flex-col items-start gap-3 rounded-xl bg-card p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lift min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-4 sm:p-5"
          >
            <span className="grid h-12 w-12 shrink-0 icon-tile place-items-center rounded-xl bg-gold/15 transition-transform group-hover:scale-110">
              <FxIcon icon={m.icon} className="h-6 w-6 text-navy" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold sm:text-2xl">
                <AutoCount value={m.value} />
              </p>
              <p className="text-sm text-muted-foreground">{m.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICE_ICONS = {
  lead: Cpu,
  sales: Route,
  list: Database,
  digital: Megaphone,
  appt: CalendarCheck,
  sdr: Users,
} as const;

export function Services() {
  return (
    <section id="services" className="section-y scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Our services"
          title="Everything is included under one, budget friendly, cost."
          sub="We combine AI, data and human expertise to find, engage and convert your ideal buyers — and we back it with a performance guarantee."
          link={NAV[1]?.items[0]?.href ?? "/"}
          linkLabel="Find the Right Service for You"
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.key];
            return (
              <Reveal key={s.key} from={slide(i)} delay={i * 70}>
                <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glow flex h-full flex-col p-6"
              >
                  <span className="icon-anim grid h-12 w-12 icon-tile place-items-center rounded-xl bg-accent">
                    <FxIcon icon={Icon} className="h-6 w-6 text-brand-blue" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                  <span className="mt-5 grid h-9 w-9 place-items-center rounded-full border">
                    <ArrowRight className="arrow h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ONBOARDING ---------------- */
const TEAM_TAGS = ["GTM", "CSM", "SDR", "CW", "OPS"] as const;

export function Onboarding() {
  const [ref, on] = useInView<HTMLDivElement>(0.2);
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Seamless onboarding"
          title="Your Campaign, Live in as Little as 15 Days"
          sub="Our fast-track onboarding is engineered for results from day 1. Whether you're new to outbound or scaling an internal team, we handle the heavy lifting."
        />
        <div ref={ref} data-on={on} className="ob">
          <div className="ob-track mb-8 px-4 sm:mb-10" aria-hidden="true">
            <div className="mb-3 -mx-4 flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs sm:tracking-widest">
              <span>Kickoff</span>
              <span className="ob-golive inline-flex items-center gap-1.5 text-brand-blue">
                <Rocket className="h-3.5 w-3.5" />
                Go live · 15 days
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-secondary">
              <div className="ob-fill absolute inset-y-0 left-0 rounded-full">
                <span className="ob-rocket absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-gold text-navy-deep shadow-gold">
                  <Rocket className="h-4 w-4 -rotate-45" />
                </span>
              </div>
              {ONBOARDING.map((_, i) => (
                <span
                  key={i}
                  className="ob-node absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card"
                  style={
                    {
                      left: `${(i / (ONBOARDING.length - 1)) * 100}%`,
                      "--n": i / (ONBOARDING.length - 1),
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h3 className="mb-4 flex items-start gap-2 text-lg font-bold">
                <FxIcon icon={Gift} className="h-5 w-5 text-gold" />
                What's included in free onboarding
              </h3>
              <ol className="grid gap-3 md:grid-cols-2">
                {ONBOARDING.map((o, i) => (
                  <li
                    key={o}
                    className="ob-step group relative flex items-start gap-3 overflow-hidden rounded-xl bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span
                      className="ob-bar absolute inset-y-0 left-0 w-1 bg-gold"
                      aria-hidden="true"
                    />
                    <span className="ob-num relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-navy-foreground transition-transform duration-500 group-hover:rotate-[360deg]">
                      <span className="ob-num-n">{i + 1}</span>
                      <Check className="ob-num-c absolute h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium">{o}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ob-team relative overflow-hidden rounded-2xl bg-navy p-5 text-navy-foreground shadow-lift sm:p-7">
              <span
                className="ob-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                aria-hidden="true"
              />
              <div className="relative flex -space-x-2" aria-hidden="true">
                {TEAM_TAGS.map((t, i) => (
                  <span
                    key={t}
                    className="ob-avatar grid h-10 w-10 place-items-center rounded-full border-2 border-navy bg-gold text-[10px] font-extrabold text-navy-deep"
                    style={{ "--i": i } as CSSProperties}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="relative mt-5 text-lg font-bold text-gold-bright">
                Every client is paired with a seasoned team
              </h3>
              <ul className="relative mt-4 space-y-2.5 text-sm">
                {TEAM_ROLES.map((r, i) => (
                  <li
                    key={r}
                    className="ob-role flex items-center gap-2 transition-transform duration-300 hover:translate-x-1.5"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <Check className="ob-check h-4 w-4 shrink-0 text-gold" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="ob-note relative mt-5 text-xs text-navy-foreground/70">
                End-to-end campaign support from a team that knows your industry and goals. After
                go-live we manage, analyze and improve your campaign every two weeks with live
                performance reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BUNDLE ---------------- */
const BUNDLE_ICONS = {
  targeting: Target,
  managed: Bot,
  insights: BarChart3,
  guarantee: ShieldCheck,
  partner: Users,
} as const;

export function Bundle() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Add-on"
          title="AI GTM Managed Services with Performance Guarantee"
          sub="We combine AI-powered intelligence with human expertise to find, engage and convert your ideal buyers — and we back it with a performance guarantee."
          link={`${MJ}/b2b-lead-generation-services/`}
          linkLabel="Learn more"
        />
        <div className="cards-5">
          {BUNDLE.map((b, i) => {
            const Icon = BUNDLE_ICONS[b.key];
            return (
              <Reveal key={b.key} from={slide(i)} delay={i * 70}>
                <div className="card-glow flex h-full flex-col p-6">
                  <span className="icon-anim grid h-12 w-12 icon-tile place-items-center rounded-xl bg-accent">
                    <FxIcon icon={Icon} className="h-6 w-6 text-brand-blue" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- INDUSTRIES ---------------- */
export function Industries() {
  return (
    <section className="section-y-lg relative overflow-hidden bg-navy text-navy-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#e7e7e9_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_top,#000,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-blue/40 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          dark
          eyebrow="Industries we serve"
          title="B2B Lead Generation for Every Industry"
          sub="From high-growth startups to mid-market tech firms and enterprise solution providers, we help businesses across sectors scale their pipeline."
          link="/industries/manufacturing-lead-generation/"
          linkLabel="Explore Your Industry"
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.title} from={slide(i)} delay={i * 70}>
              <a
                href={ind.href}
                className="group relative block h-56 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:ring-gold/70 hover:shadow-lift sm:h-64 lg:h-72"
              >
                <img
                  src={ind.img}
                  alt={ind.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/60 to-navy/10 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-brand-blue/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-brand-blue/40" />
                <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 font-display text-xs font-bold tracking-widest text-white backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-3 block h-0.5 w-8 rounded bg-gold transition-all duration-500 group-hover:w-20" />
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{ind.title}</h3>
                      <p className="mt-1 text-sm text-white/80 transition-all duration-500 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                        Explore lead generation for {ind.title.toLowerCase()}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-navy-deep transition-all duration-500 group-hover:-rotate-45 group-hover:bg-gold-bright">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRODUCTS ---------------- */
function ProductVisual() {
  return (
    <div className="space-y-2">
      {["Company", "Industry", "Decision-maker", "Location"].map((f, i) => (
        <div
          key={f}
          className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-xs"
        >
          <span className="text-muted-foreground">{f}</span>
          <span className="h-2 rounded-full bg-brand-blue/30" style={{ width: `${40 + i * 12}%` }} />
        </div>
      ))}
    </div>
  );
}

export function Products() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Our products"
          title="Powerful Tools to Supercharge Your Outreach"
          sub="Our proprietary tools help you identify, engage and convert the right prospects faster."
        />
        <div className="mx-auto grid max-w-4xl gap-5 sm:gap-6">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.key} from={slide(i)} delay={i * 90}>
              <a
                href={p.href}
                className="card-glow grid h-full gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="icon-anim grid h-11 w-11 shrink-0 icon-tile place-items-center rounded-xl bg-gold/15">
                      <FxIcon icon={Database} className="h-5 w-5 text-navy" />
                    </span>
                    <h3 className="text-xl font-bold sm:text-2xl">AI-Powered GTM Engine</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">{p.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                    Learn more <ArrowRight className="arrow h-4 w-4" />
                  </span>
                </div>
                <div className="min-w-0 rounded-xl border p-3 sm:p-4">
                  <ProductVisual />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES (navy) ---------------- */
const FEATURE_ICONS = {
  team: Users,
  launch: Rocket,
  review: BarChart3,
  guarantee: ShieldCheck,
} as const;

export function Features() {
  return (
    <section className="bg-hero section-y relative overflow-hidden text-navy-foreground">
      <GeoBackground />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-12">
        <Reveal>
          <span className="eyebrow">What sets us apart</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            A Smarter, More Predictable Way to Build Your Sales Pipeline
          </h2>
          <p className="mt-4 text-navy-foreground/75">
            We're not a cookie-cutter lead vendor. We're a performance-first lead generation company
            that brings structure, speed, and scale to your outbound sales strategy.
          </p>
          <FlowButton href={BOOK_URL} variant="gold" className="mt-8 py-3.5">
            Meet Your Growth Team
          </FlowButton>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => {
            const Icon = FEATURE_ICONS[f.key];
            return (
              <Reveal
                key={f.key}
                from={slide(i)}
                delay={i * 90}
                className="group rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-gold/60 hover:bg-navy-foreground/10"
              >
                <FxIcon
                  icon={Icon}
                  className="h-8 w-8 text-gold transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
                />
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-navy-foreground/70">{f.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STORIES ---------------- */
export function Stories() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Success stories"
          title="Real Results for Real Businesses"
          sub="Not just logos — actual outcomes from manufacturers, software companies and financial firms."
          link={`${MJ}/case-studies/`}
          linkLabel="See Real Client Results"
        />
        <div className="grid cols-3 gap-5 sm:gap-6">
          {STORIES.map((s, i) => (
            <Reveal key={s.client} from={slide(i)} delay={i * 90}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glow flex h-full flex-col p-6"
              >
                <p className="text-sm font-semibold text-muted-foreground">{s.client}</p>
                <h3 className="mt-1 flex-1 text-lg font-bold">{s.title}</h3>
                <div className="mt-6 flex items-end justify-between gap-3 border-t pt-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <FxIcon icon={TrendingUp} className="h-5 w-5 text-success" />
                    <span className="font-display text-3xl font-extrabold">
                      <AutoCount value={s.metric} />
                    </span>
                    <span className="text-sm text-muted-foreground">{s.metricLabel}</span>
                  </div>
                  <ArrowRight className="arrow h-5 w-5 shrink-0" />
                </div>
                <p className="mt-4 text-sm font-semibold text-brand-blue">
                  See how we did it for {s.industry}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
export function Testimonials() {
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="What our clients say"
          title="Trusted by Growing Businesses"
          link={`${MJ}/client-reviews/`}
          linkLabel="Hear From Our Clients"
        />
        <div className="grid cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              from={slide(i)}
              delay={i * 90}
              as="figure"
              className="flex h-full flex-col rounded-2xl bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift sm:p-7"
            >
              <VideoTestimonial t={t} />
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy font-display text-sm font-bold text-navy-foreground">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RECOGNITION + BLOG ---------------- */
export function Recognition() {
  return (
    <section className="border-y bg-card py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow">We're the top-rated B2B lead generation company in the USA</p>
        <div className="mt-5 grid grid-cols-2 items-center gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
          {RECOGNITION.map((r) => (
            <div key={r.name} className="group grid h-28 place-items-center sm:h-32">
              <img
                src={r.src}
                alt={r.name}
                loading="lazy"
                className="logo-clean max-h-24 w-auto max-w-full object-contain transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-125 sm:max-h-28"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Blog() {
  const { data: posts = [], isLoading, isError } = useGetPostsQuery({ page: 1, perPage: 3 });
  return (
    <section className="section-y bg-muted">
      <div className="container-fluid mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Latest blog" title="Insights for B2B Sales Teams" link="/blog/" linkLabel="Get B2B Sales Insights" />
        {isLoading && <p className="py-6 text-center text-muted-foreground">Loading latest articles…</p>}
        {isError && <p className="py-6 text-center text-muted-foreground">Latest articles are temporarily unavailable.</p>}
        <div className="grid cols-3 gap-5 sm:gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.id} from={slide(i)} delay={i * 90}>
              <a href={`/blog/${post.slug}/`} className="card-glow flex h-full flex-col overflow-hidden">
                {post.image && <img src={post.image} alt={post.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold text-brand-blue">{post.category} · {post.date}</span>
                  <h3 className="mt-3 flex-1 text-lg font-bold">{post.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">Read article <ArrowRight className="arrow h-4 w-4" /></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  return <FaqSection heading popup allLink={`${MJ}/faqs/`} />;
}

/* ---------------- CTA + FOOTER ---------------- */
export function FinalCta() {
  return (
    <section className="bg-hero relative overflow-hidden text-navy-foreground">
      <GeoBackground />
      <Reveal className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-10 sm:px-6 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-6 lg:py-14">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready to build a healthier sales pipeline?
          </h2>
          <p className="mt-2 text-navy-foreground/75">
            Let's discuss your goals and create a custom lead generation plan for your business.
          </p>
        </div>
        <FlowButton href={BOOK_URL} variant="gold" className="shrink-0 py-3.5">
          Get Your Pipeline Plan
        </FlowButton>
      </Reveal>
    </section>
  );
}

function FootCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-gold">{title}</h4>
      <ul className="mt-3 space-y-1 sm:mt-4">
        {items.map((i) => (
          <li key={i.label}>
            <a
              href={i.href}
              className="inline-block py-1 text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const SocialIcons = { LinkedIn: Linkedin, YouTube: Youtube, Facebook: Facebook } as const;
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-3 lg:py-14 xl:grid-cols-[1.6fr_1fr_1fr_1.2fr_1fr_1.3fr]">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <a href="/" aria-label="MarketJoy home" className="inline-block">
            <img
              src={LOGO_WHITE_URL}
              alt="MarketJoy Inc"
              className="logo-anim h-11 w-auto"
              width={196}
              height={44}
              loading="lazy"
            />
          </a>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-navy-foreground/70">
            MarketJoy, Inc. is your go-to partner for accelerating sales growth. Specializing in
            tailored B2B lead generation, we align with your unique needs to enhance your customer
            acquisition pipeline.
          </p>
          <div className="mt-5 flex gap-3">
            {FOOTER.social.map((s) => {
              const Icon = SocialIcons[s.label as keyof typeof SocialIcons];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-navy-foreground/10 transition hover:-translate-y-0.5 hover:bg-gold hover:text-navy-deep"
                >
                  <FxIcon icon={Icon} className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        <FootCol title="Products" items={FOOTER.products} />
        <FootCol title="Services" items={FOOTER.services} />
        <FootCol title="Industries" items={FOOTER.industries.slice(0, 10)} />
        <FootCol title="Resources" items={FOOTER.resources} />
        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="text-sm font-bold text-gold">Contact Information</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/70">
            <li className="flex gap-2">
              <FxIcon icon={MapPin} className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              186 N Palafox Street, Pensacola, FL 32502, USA
            </li>
            <li>
              <a href="tel:+14846386389" className="flex gap-2 hover:text-navy-foreground">
                <FxIcon icon={Phone} className="h-4 w-4 shrink-0 text-gold" />
                +1 (484) 638-6389
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@marketjoy.com"
                className="flex gap-2 hover:text-navy-foreground"
              >
                <FxIcon icon={Mail} className="h-4 w-4 shrink-0 text-gold" />
                hello@marketjoy.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-navy-foreground/60 sm:flex-row sm:justify-between sm:px-6 sm:py-5">
          <p>© {new Date().getFullYear()} MarketJoy, Inc. All rights reserved.</p>
          <a href={FOOTER.privacy} className="hover:text-navy-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
