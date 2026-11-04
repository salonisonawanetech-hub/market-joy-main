import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowRight, Award, BadgeCheck, BarChart3, CheckCircle2, Layers, Lightbulb, Mail, Plus, Search, Target, TrendingUp, Users } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { AssetImg } from "@/components/pages/IndustryLayouts";
import { wpFallbackSrc } from "@/lib/wp-images";
import type { LayoutBlock, LayoutCta } from "@/content/industries/loader";

type Icon = ComponentType<{ className?: string }>;
const ICONS: Icon[] = [Users, Target, BarChart3, Layers, Lightbulb, Award, TrendingUp, BadgeCheck, Mail, Search];
const H2 = "text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl";
const BODY = "article-body";
const BODY_SM = "article-body text-[0.95rem] leading-relaxed [&_p]:m-0 [&_p+p]:mt-3";

/** Photo with /public -> old-site fallback; renders nothing if both fail (never a broken-image icon). */
function Photo({ src, className = "" }: { src: string; className?: string }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setStage((v) => (v === 0 ? 1 : 2));
  }, []);
  if (stage === 2) return null;
  return (
    <img
      ref={ref}
      referrerPolicy="no-referrer"
      src={stage === 0 ? src : wpFallbackSrc(src)}
      alt=""
      loading="lazy"
      onError={() => setStage((v) => (v === 0 ? 1 : 2))}
      className={`h-auto w-full rounded-2xl object-contain ${className}`}
    />
  );
}

function Ctas({ ctas, center = false, dark = false }: { ctas?: LayoutCta[] | undefined; center?: boolean; dark?: boolean }) {
  if (!ctas?.length) return null;
  return (
    <div className={`mt-7 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      {ctas.map((c, i) =>
        i === 0 ? (
          <a key={c.href + c.label} href={c.href} className="btn-gold px-6 py-3.5 text-sm sm:text-base">
            {c.label}
            <ArrowRight className="arrow h-4 w-4" />
          </a>
        ) : (
          <a
            key={c.href + c.label}
            href={c.href}
            className={`inline-flex items-center gap-2 rounded-[.6rem] border px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:text-base ${
              dark ? "border-white/40 text-white hover:bg-white/10" : "border-border text-foreground hover:border-gold"
            }`}
          >
            {c.label}
          </a>
        ),
      )}
    </div>
  );
}

function Head({ eyebrow, title, lead, center = true, dark = false }: { eyebrow?: string | undefined; title?: string; lead?: string | undefined; center?: boolean; dark?: boolean }) {
  if (!eyebrow && !title && !lead) return null;
  return (
    <Reveal className={`mb-9 ${center ? "mx-auto max-w-3xl text-center" : ""}`}>
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      {title && <h2 className={`${H2} ${eyebrow ? "mt-3" : ""}`}>{title}</h2>}
      {lead && (
        <div
          className={`${BODY} mt-4 ${dark ? "[&_*]:!text-navy-foreground/75" : ""}`}
          // Generated from sanitised migration HTML (scripts/build-industry-layouts.py).
          dangerouslySetInnerHTML={{ __html: lead }}
        />
      )}
    </Reveal>
  );
}

function Shell({ tone, dark = false, children }: { tone: number; dark?: boolean; children: ReactNode }) {
  const bg = dark ? "bg-navy-deep text-navy-foreground" : tone % 2 ? "bg-muted/60" : "";
  return (
    <section className={`section-y ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

function Html({ html, className = BODY }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function IndustryBlocks({ blocks }: { blocks: LayoutBlock[] }) {
  let tone = 0;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.k === "intro") {
          return (
            <section key={i} className="section-y">
              <div className={`mx-auto px-4 sm:px-6 ${b.img ? "grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr]" : "max-w-4xl text-center"}`}>
                <Reveal from={b.img ? "left" : "up"}>
                  <Html html={b.html} className={`${BODY} ${b.img ? "" : "text-lg sm:text-xl"}`} />
                  <Ctas ctas={b.ctas} center={!b.img} />
                </Reveal>
                {b.img && (
                  <Reveal from="right">
                    <Photo src={b.img} />
                  </Reveal>
                )}
              </div>
            </section>
          );
        }

        if (b.k === "cta") {
          return (
            <section key={i} className="section-y bg-accent">
              <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 className="text-balance text-2xl font-extrabold sm:text-3xl">{b.title}</h2>
                <Ctas ctas={b.ctas} center />
              </Reveal>
            </section>
          );
        }

        if (b.k === "faq") {
          tone++;
          return (
            <Shell key={i} tone={tone}>
              <div className="mx-auto max-w-3xl">
                <Head title={b.title} />
                <div className="space-y-3">
                  {b.items.map((f, n) => (
                    <details key={f.q} open={n === 0} className="group card-glow px-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <Plus className="h-5 w-5 shrink-0 text-gold transition-transform group-open:rotate-45" />
                      </summary>
                      <Html html={f.a} className={`${BODY_SM} pb-5 text-muted-foreground`} />
                    </details>
                  ))}
                </div>
              </div>
            </Shell>
          );
        }

        if (b.k === "cards") {
          const dark = b.style === "steps";
          if (!dark) tone++;
          const n = b.items.length;
          return (
            <Shell key={i} tone={tone} dark={dark}>
              <Head eyebrow={b.eyebrow} title={b.title} lead={b.lead} dark={dark} />
              {b.style === "chips" ? (
                <ul className="flex flex-wrap justify-center gap-3">
                  {b.items.map((c, k) => (
                    <Reveal as="li" key={c.title} delay={Math.min(k, 8) * 40} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-card">
                      <CheckCircle2 className="h-4 w-4 text-gold" />
                      {c.title}
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <ul
                  className={`grid gap-5 ${
                    n <= 2 ? "sm:grid-cols-2" : b.style === "steps" ? "sm:grid-cols-2 lg:grid-cols-4" : n === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {b.items.map((c, k) => {
                    const FallbackIcon = ICONS[k % ICONS.length] ?? Users;
                    return (
                      <Reveal
                        as="li"
                        key={c.title + k}
                        delay={Math.min(k, 6) * 70}
                        className={dark ? "rounded-2xl border border-white/10 bg-white/5 p-6" : "card-glow p-6"}
                      >
                        {dark ? (
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy-deep">{k + 1}</span>
                        ) : b.style === "icons" && c.img ? (
                          <AssetImg src={c.img} alt="" size={56} Fallback={FallbackIcon} className="mb-4" />
                        ) : (
                          <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent text-brand-blue">
                            <FallbackIcon className="h-5 w-5" />
                          </span>
                        )}
                        {c.title && <h3 className={`${dark ? "mt-4" : ""} text-lg font-bold leading-snug`}>{c.title}</h3>}
                        {c.html && <Html html={c.html} className={`${BODY_SM} ${c.title ? "mt-2" : ""} ${dark ? "[&_*]:!text-navy-foreground/75" : "text-muted-foreground"}`} />}
                      </Reveal>
                    );
                  })}
                </ul>
              )}
              <Ctas ctas={b.ctas} center dark={dark} />
            </Shell>
          );
        }

        // prose
        tone++;
        const hasText = !!b.html;
        return (
          <Shell key={i} tone={tone}>
            <div className={b.img && hasText ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : "mx-auto max-w-4xl"}>
              <Reveal from={b.img && hasText ? "left" : "up"}>
                {b.eyebrow && <span className="eyebrow mb-3">{b.eyebrow}</span>}
                <h2 className={`${H2} ${b.eyebrow ? "mt-3" : ""} ${b.img && !hasText ? "text-center" : ""}`}>{b.title}</h2>
                {hasText && <Html html={b.html} className={`${BODY} mt-5`} />}
                <Ctas ctas={b.ctas} />
              </Reveal>
              {b.img && (
                <Reveal from="right" className={hasText ? "" : "mt-8 flex justify-center"}>
                  <Photo src={b.img} className={hasText ? "" : "max-w-3xl"} />
                </Reveal>
              )}
            </div>
          </Shell>
        );
      })}
    </>
  );
}
