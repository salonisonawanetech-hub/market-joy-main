import { ArrowRight, BarChart3, Check, Database, Headset, Phone, Target, TrendingUp, X, type LucideIcon } from "lucide-react";
import { Reveal, slide } from "@/components/home/Reveal";
import { SectionHead } from "@/components/home/Sections";
import { FlowButton } from "@/components/ui/flow-button";
import { WpImg } from "@/components/pages/WpImg";
import { INFOJOY, PRODUCTS_HUB } from "@/content/services/product-layouts";
import type { ServiceEntry } from "@/content/services/loader";

type Pic = { src: string; alt: string; width?: number; height?: number };

/** Illustration with a neutral placeholder if the file cannot be loaded (never a broken-image icon). */
function Picture({ pic, className = "", icon: Icon = BarChart3 }: { pic: Pic; className?: string; icon?: LucideIcon }) {
  return (
    <WpImg
      src={pic.src}
      alt={pic.alt}
      width={pic.width}
      height={pic.height}
      className={`h-auto w-full object-contain ${className}`}
      fallback={
        <div
          role="img"
          aria-label={pic.alt}
          className="grid aspect-[4/3] w-full place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-deep text-gold-bright"
        >
          <Icon className="h-14 w-14" aria-hidden="true" />
        </div>
      }
    />
  );
}

/** Dark call-to-action band used at the bottom of both pages. */
function CtaBand({ title, body, label, href }: { title: string; body: string; label: string; href: string }) {
  return (
    <section className="bg-hero relative overflow-hidden text-navy-foreground">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-16">
        <Reveal>
          <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/80">{body}</p>
          <div className="mt-8 flex justify-center">
            <FlowButton href={href} variant="gold" className="py-3.5">
              {label}
            </FlowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =====================================================================================================
   /products/
   ===================================================================================================== */
export function ProductsHubBody() {
  const h = PRODUCTS_HUB;
  return (
    <>
      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal from="left" className="min-w-0">
            <span className="eyebrow">{h.intro.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">{h.intro.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{h.intro.body}</p>
            <div className="mt-7">
              <FlowButton href={h.intro.cta.href} variant="gold" className="py-3.5">
                {h.intro.cta.label}
              </FlowButton>
            </div>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0">
            <div className="mx-auto max-w-md rounded-3xl border bg-card p-4 shadow-card sm:p-6 lg:max-w-none">
              <Picture pic={h.intro.image} className="mx-auto max-h-[28rem]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-muted">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{h.tailored.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{h.tailored.body}</p>
        </Reveal>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow={h.products.eyebrow} title={h.products.title} />
          <div className="mx-auto grid max-w-5xl gap-6">
            {h.products.items.map((p, i) => (
              <Reveal key={p.href} from={slide(i)} delay={i * 90} className="min-w-0">
                <a
                  href={p.href}
                  className="card-glow group grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10"
                >
                  <div className="overflow-hidden rounded-2xl bg-muted p-4">
                    <Picture pic={p.image} icon={Database} className="mx-auto max-h-64" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold sm:text-2xl">{p.title}</h3>
                    <p className="mt-3 text-muted-foreground">{p.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                      {p.cta} <ArrowRight className="arrow h-4 w-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-muted">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <Reveal from="left" className="min-w-0 lg:order-1">
            <div className="mx-auto max-w-md rounded-3xl border bg-card p-4 shadow-card sm:p-6">
              <Picture pic={h.growth.image} icon={TrendingUp} className="mx-auto max-h-[22rem]" />
            </div>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0 lg:order-2">
            <span className="eyebrow">{h.growth.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{h.growth.title}</h2>
            <p className="mt-4 text-muted-foreground">{h.growth.body}</p>
            <h3 className="mt-7 text-lg font-bold">{h.growth.industriesTitle}</h3>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {h.growth.industries.map((i) => (
                <li key={i.href}>
                  <a
                    href={i.href}
                    className="inline-block rounded-full border bg-card px-4 py-2 text-sm font-semibold transition hover:border-gold hover:text-gold"
                  >
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand title={h.cta.title} body={h.cta.body} label={h.cta.button.label} href={h.cta.button.href} />
    </>
  );
}

/* =====================================================================================================
   /products/infojoy/
   ===================================================================================================== */
const LOVE_ICONS: LucideIcon[] = [Target, Database, Phone, TrendingUp, Headset];

export function InfoJoyBody({ entry }: { entry: ServiceEntry }) {
  const j = INFOJOY;
  return (
    <>
      {/* intro */}
      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <Reveal from="left" className="min-w-0">
            <p className="text-lg text-muted-foreground">{j.intro.body}</p>
            <div className="mt-7">
              <FlowButton href={j.intro.cta.href} variant="gold" className="py-3.5">
                {j.intro.cta.label}
              </FlowButton>
            </div>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0">
            <div className="grid items-center gap-4 sm:grid-cols-2">
              {j.intro.images.map((img) => (
                <div key={img.src} className="min-w-0 overflow-hidden rounded-2xl border bg-card p-3 shadow-card">
                  <Picture pic={img} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* problem vs. solution */}
      <section className="section-y bg-muted">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
          <Reveal from="left" className="min-w-0">
            <div className="card-glow h-full p-6 sm:p-8">
              <span className="inline-block rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive">
                Problem
              </span>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{j.problem.title}</h2>
              <p className="mt-3 text-muted-foreground">{j.problem.lead}</p>
              <ul className="mt-5 grid gap-3">
                {j.problem.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0">
            <div className="card-glow h-full p-6 sm:p-8">
              <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy dark:text-gold">
                Solution
              </span>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{j.delivers.title}</h2>
              <p className="mt-3 text-muted-foreground">
                <strong className="text-foreground">{j.delivers.leadStrong}</strong> {j.delivers.lead}
              </p>
              <ul className="mt-5 grid gap-3">
                {j.delivers.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20 text-navy dark:text-gold">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* buyer intent */}
      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <Reveal from="left" className="min-w-0">
            <div className="mx-auto max-w-md rounded-3xl border bg-card p-4 shadow-card sm:p-6 lg:max-w-none">
              <Picture pic={j.intent.image} icon={TrendingUp} className="mx-auto max-h-[26rem]" />
            </div>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0">
            <h2 className="text-3xl font-extrabold sm:text-4xl">{j.intent.title}</h2>
            <p className="mt-4 text-muted-foreground">
              {j.intent.leadBefore}
              <a href={j.intent.leadLink.href} className="font-semibold text-brand-blue underline underline-offset-4 hover:text-gold">
                {j.intent.leadLink.label}
              </a>
              {j.intent.leadAfter}
            </p>
            <ol className="mt-6 grid gap-3">
              {j.intent.steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4 rounded-xl border bg-card p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-extrabold text-gold-bright">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* platform features */}
      <section className="section-y bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="What's inside" title={j.features.title} sub={j.features.lead} />
          <div className="grid cols-3 gap-5">
            {j.features.items.map((f, i) => (
              <Reveal key={f.title} from={slide(i)} delay={i * 70} className="min-w-0">
                <div className="card-glow h-full p-5 sm:p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-navy dark:text-gold">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  {f.body && <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal from="left" className="min-w-0">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{j.pricing.title}</h2>
            <p className="mt-4 text-muted-foreground">{j.pricing.lead}</p>
            <ul className="mt-5 grid gap-3">
              {j.pricing.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal from="right" delay={100} className="min-w-0">
            <div className="mx-auto max-w-xs rounded-3xl border bg-card p-4 shadow-card sm:p-6">
              <Picture pic={j.pricing.image} icon={Database} className="mx-auto max-h-80" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* why teams love it */}
      <section className="section-y bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            eyebrow="Results"
            title={j.love.title}
            sub={`${j.love.lead} ${j.love.leadStrong}`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {j.love.items.map((it, i) => (
              <Reveal key={it.alt} from={slide(i)} delay={i * 70} className="min-w-0">
                <div className="card-glow flex h-full flex-col items-center p-5 text-center">
                  <WpImg
                    src={it.icon}
                    alt={it.alt}
                    width={126}
                    height={74}
                    className="h-[74px] w-[126px] object-contain"
                    fallback={
                      <span className="grid h-[74px] w-[74px] place-items-center rounded-2xl bg-gold/15 text-navy dark:text-gold">
                        {(() => {
                          const Icon = LOVE_ICONS[i] ?? Target;
                          return <Icon className="h-8 w-8" aria-hidden="true" />;
                        })()}
                      </span>
                    }
                  />
                  <p className="mt-4 text-sm font-semibold">{it.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      {entry.faqs.length > 0 && (
        <section className="section-y">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHead eyebrow="FAQ" title={j.faqTitle} />
            <div className="article-body">
              {entry.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="pb-4">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={j.cta.title} body={j.cta.body} label={j.cta.button.label} href={j.cta.button.href} />
    </>
  );
}
