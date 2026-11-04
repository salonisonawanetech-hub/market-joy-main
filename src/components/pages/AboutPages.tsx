import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Cpu,
  Database,
  Linkedin,
  MessageSquare,
  Repeat,
  Search,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal, slide, zig } from "@/components/home/Reveal";
import { SectionHead } from "@/components/home/Sections";
import { FlowButton } from "@/components/ui/flow-button";
import { BOOK_URL } from "@/components/home/data";
import { WpImg } from "@/components/pages/WpImg";
import {
  ABOUT_COMMITMENT,
  ABOUT_CTA,
  ABOUT_HERO,
  ABOUT_HOW,
  ABOUT_MISSION,
  ABOUT_SERVICES,
  ABOUT_TEAM_GROUPS,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY,
  CURTIS,
  TEAM,
  type TeamMember,
} from "@/content/about/about";

/** Image with a graceful fallback (see WpImg): never shows a broken-image icon. */
function Img({
  src,
  alt,
  className,
  width,
  height,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  fallback?: ReactNode | undefined;
}) {
  return <WpImg src={src} alt={alt} width={width} height={height} className={className} fallback={fallback} />;
}

/** Decorative section background (hidden from assistive tech; the section keeps its plain colour if it fails). */
function Bg({ src, fit = "cover", className = "" }: { src: string; fit?: "cover" | "contain"; className?: string }) {
  return (
    <WpImg
      src={src}
      alt=""
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full object-center ${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
    />
  );
}

/** Icon tile shown in place of an icon image that cannot be loaded. */
function IconTile({ icon: Icon, className = "h-14 w-14" }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl bg-gold/15 text-navy dark:text-gold ${className}`}>
      <Icon className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );
}

const TAB_ICONS: LucideIcon[] = [Search, Database, MessageSquare, Target, BarChart3];
const SERVICE_ICONS: LucideIcon[] = [Target, Repeat, Database];
const WHY_ICONS: LucideIcon[] = [BarChart3, Cpu, Repeat, Users];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ---------------- 1. intro / purpose ---------------- */
function Intro() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <Bg src={ABOUT_HERO.bg} className="object-right" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/85 via-navy/60 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <Reveal from="left" className="min-w-0 max-w-3xl">
          <span className="eyebrow">Who we are</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">{ABOUT_HERO.title}</h2>
          <p className="mt-4 text-navy-foreground/90">{ABOUT_HERO.intro}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-navy-foreground/80">{ABOUT_HERO.purposeLead}</p>
          <h3 className="mt-1 text-xl font-bold text-gold-bright sm:text-2xl">{ABOUT_HERO.purpose}</h3>
          <p className="mt-3 text-navy-foreground/90">{ABOUT_HERO.purposeBody}</p>
          <div className="mt-7">
            <FlowButton href={BOOK_URL} variant="gold" className="py-3.5">
              {ABOUT_HERO.cta}
            </FlowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 2. services ---------------- */
function Services() {
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="What we offer" title={ABOUT_SERVICES.title} sub={ABOUT_SERVICES.intro} />
        <div className="grid cols-3 gap-5">
          {ABOUT_SERVICES.items.map((s, i) => (
            <Reveal key={s.title} from={slide(i)} delay={i * 90} className="min-w-0">
              <article className="card-glow flex h-full flex-col overflow-hidden">
                <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-muted">
                  <Img
                    src={s.image}
                    alt={s.alt}
                    className="h-full w-full object-cover object-center"
                    fallback={<IconTile icon={SERVICE_ICONS[i] ?? Target} className="h-20 w-20" />}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-muted-foreground">{s.body}</p>
                  <a
                    href={s.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold dark:text-white"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3. mission ---------------- */
function Mission() {
  return (
    <section className="section-y relative isolate overflow-hidden">
      <Bg src={ABOUT_MISSION.bg} fit="contain" />
      {/* Keeps the text readable where it sits over the artwork on narrow screens. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-transparent lg:via-background/30"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal from="left" className="min-w-0 max-w-xl">
          <span className="eyebrow">{ABOUT_MISSION.eyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{ABOUT_MISSION.title}</h2>
          {ABOUT_MISSION.body.map((t) => (
            <p key={t} className="mt-4 text-muted-foreground">
              {t}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 4. what we do (tabs) ---------------- */
function WhatWeDo() {
  const [active, setActive] = useState(0);
  const tabs = ABOUT_WHAT_WE_DO.tabs;
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow={ABOUT_WHAT_WE_DO.eyebrow} title={ABOUT_WHAT_WE_DO.title} />
        <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr] lg:gap-8">
          <div role="tablist" aria-orientation="vertical" aria-label={ABOUT_WHAT_WE_DO.title} className="flex min-w-0 flex-col gap-2">
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  id={`about-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`about-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault();
                      setActive((active + 1) % tabs.length);
                    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      setActive((active - 1 + tabs.length) % tabs.length);
                    }
                  }}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition sm:text-base ${
                    on
                      ? "border-gold bg-navy text-navy-foreground shadow-lift"
                      : "bg-card hover:border-gold/60"
                  }`}
                >
                  <span>{t.label}</span>
                  <ArrowRight className={`h-4 w-4 shrink-0 ${on ? "text-gold" : "text-muted-foreground"}`} />
                </button>
              );
            })}
          </div>
          <div className="min-w-0">
            {tabs.map((t, i) => (
              <div
                key={t.label}
                role="tabpanel"
                id={`about-panel-${i}`}
                aria-labelledby={`about-tab-${i}`}
                hidden={i !== active}
                className="h-full rounded-2xl border bg-card p-5 shadow-card sm:p-8"
              >
                <Img
                  src={t.icon}
                  alt=""
                  width={67}
                  height={67}
                  className="h-16 w-16 object-contain"
                  fallback={<IconTile icon={TAB_ICONS[i] ?? Target} className="h-16 w-16" />}
                />
                <h3 className="mt-4 text-xl font-bold sm:text-2xl">{t.heading}</h3>
                {"lead" in t && t.lead && <p className="mt-3 text-muted-foreground">{t.lead}</p>}
                <ul className="mt-4 grid gap-2.5">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-l-4 border-gold pl-4 text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5. why marketjoy works ---------------- */
function Why() {
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Our difference" title={ABOUT_WHY.title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_WHY.items.map((w, i) => (
            <Reveal key={w.title} from={slide(i)} delay={i * 80} className="min-w-0">
              <div className="card-glow h-full p-5 sm:p-6">
                <Img
                  src={w.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                  fallback={<IconTile icon={WHY_ICONS[i] ?? Target} />}
                />
                <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 6. team ---------------- */
function MemberCard({ m, i }: { m: TeamMember; i: number }) {
  const body = (
    <>
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        <Img
          src={m.image}
          alt={m.name}
          className="h-full w-full object-cover object-top"
          fallback={
            <span
              aria-hidden="true"
              className="grid h-full w-full place-items-center bg-gradient-to-br from-navy to-navy-deep text-4xl font-extrabold text-gold-bright"
            >
              {initials(m.name)}
            </span>
          }
        />
      </div>
      <h3 className="mt-4 text-lg font-bold">{m.name}</h3>
      <p className="text-sm text-muted-foreground">{m.role}</p>
    </>
  );
  return (
    <Reveal from={slide(i)} delay={i * 70} className="min-w-0">
      {m.href ? (
        <a href={m.href} aria-label={`${m.name}, ${m.role}`} className="card-glow block h-full p-4 transition hover:-translate-y-1">
          {body}
        </a>
      ) : (
        <div className="card-glow h-full p-4">{body}</div>
      )}
    </Reveal>
  );
}

function Team() {
  const g = ABOUT_TEAM_GROUPS;
  return (
    <>
      <section className="section-y relative isolate overflow-hidden">
        <Bg src={g.bg} fit="contain" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <SectionHead eyebrow={g.eyebrow} title={`Our Team: ${g.title}`} sub={g.intro} />
            <div className="grid gap-3 sm:grid-cols-2">
              {g.groups.map(([t, d], i) => (
                <Reveal key={t} from={zig(i)} delay={i * 60} className="min-w-0">
                  <div className="h-full rounded-xl border bg-card p-4">
                    <h3 className="font-bold">{t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal from="up" delay={300} className="min-w-0">
                <div className="flex h-full items-center rounded-xl bg-navy p-4 font-semibold text-navy-foreground">
                  {g.outro}
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal from="right" delay={120} className="min-w-0">
            <Img src={g.image} alt="MarketJoy team" className="mx-auto h-auto w-full max-w-sm object-contain" />
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Leadership" title="Our Team" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {TEAM.map((m, i) => (
              <MemberCard key={m.slug} m={m} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- 7. how we work ---------------- */
function How() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow={ABOUT_HOW.eyebrow} title={`How We Work: ${ABOUT_HOW.title}`} sub={ABOUT_HOW.intro} />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_HOW.steps.map(([t, d], i) => (
            <Reveal key={t} from={slide(i)} delay={i * 70} as="li" className="min-w-0 list-none">
              <div className="card-glow h-full p-5 sm:p-6">
                <span className="text-4xl font-extrabold text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- 8. commitment ---------------- */
function Commitment() {
  const c = ABOUT_COMMITMENT;
  return (
    <section className="section-y bg-muted">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <Reveal from="left" className="min-w-0">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{c.title}</h2>
          <p className="mt-4 text-muted-foreground">{c.intro}</p>
          <ul className="mt-5 grid gap-3">
            {c.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <Check className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <span className="font-medium">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg font-semibold">{c.outro}</p>
        </Reveal>
        <Reveal from="right" delay={120} className="min-w-0">
          <Img src={c.image} alt="Our commitment to you" className="mx-auto h-auto w-full max-w-xs object-contain" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 9. closing CTA ---------------- */
function Cta() {
  const c = ABOUT_CTA;
  return (
    <section className="bg-hero relative overflow-hidden text-navy-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-16">
        <Reveal from="left" className="min-w-0">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{c.title}</h2>
          <p className="mt-4 text-navy-foreground/80">{c.lead}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {c.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <Img
                  src={c.tick}
                  alt=""
                  width={20}
                  height={20}
                  className="mt-0.5 h-5 w-5 shrink-0"
                  fallback={<Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-bright" aria-hidden="true" />}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-navy-foreground/80">{c.outro}</p>
          <div className="mt-7">
            <FlowButton href={BOOK_URL} variant="gold" className="py-3.5">
              {c.button}
            </FlowButton>
          </div>
        </Reveal>
        <Reveal from="right" delay={120} className="hidden min-w-0 lg:block">
          <Img src={c.image} alt="" className="mx-auto h-auto w-full max-w-[16rem] object-contain" />
        </Reveal>
      </div>
    </section>
  );
}

/** Body of /about/ (the page hero is rendered by SitePage). */
export function AboutBody() {
  return (
    <>
      <Intro />
      <Services />
      <Mission />
      <WhatWeDo />
      <Why />
      <Team />
      <How />
      <Commitment />
      <Cta />
    </>
  );
}

/** Body of /curtis-bendt/ (the page hero is rendered by SitePage). */
export function CurtisBody() {
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-[280px_1fr] md:gap-12">
        <Reveal from="left" className="min-w-0">
          <div className="mx-auto max-w-[17rem] overflow-hidden rounded-2xl border bg-muted shadow-card md:max-w-none">
            <Img src={CURTIS.image} alt={`${CURTIS.name}, ${CURTIS.role} at MarketJoy`} width={300} height={300} className="aspect-square h-auto w-full object-cover" />
          </div>
          <a
            href={CURTIS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            <Linkedin className="h-4 w-4" /> Connect on LinkedIn
          </a>
        </Reveal>
        <Reveal from="right" delay={100} className="min-w-0">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{CURTIS.name}</h2>
          <p className="mt-1 font-semibold text-gold">{CURTIS.role}</p>
          {CURTIS.bio.map((p) => (
            <p key={p} className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          <a href="/about/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-gold">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to About MarketJoy
          </a>
        </Reveal>
      </div>
    </section>
  );
}
