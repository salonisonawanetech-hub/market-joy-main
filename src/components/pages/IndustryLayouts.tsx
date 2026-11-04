import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  CalendarCheck,
  Crosshair,
  Database,
  Layers,
  Lightbulb,
  ListChecks,
  Mail,
  Plus,
  Search,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { AutoCount } from "@/components/home/CountUp";
import { Reveal } from "@/components/home/Reveal";
import { wpFallbackSrc } from "@/lib/wp-images";

type Icon = ComponentType<{ className?: string }>;

/** Tries /public first, then the old site, and if both fail shows a lucide icon so the card is never empty. */
export function AssetImg({ src, alt, size, Fallback, className = "" }: { src: string; alt: string; size: number; Fallback: Icon; className?: string }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setStage((v) => (v === 0 ? 1 : 2));
  }, []);
  if (stage === 2) {
    return (
      <span
        className={`icon-anim grid shrink-0 place-items-center rounded-2xl bg-accent text-brand-blue ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={alt || undefined}
      >
        <Fallback className="h-1/2 w-1/2" />
      </span>
    );
  }
  return (
    <img
      ref={ref}
      referrerPolicy="no-referrer"
      src={stage === 0 ? src : wpFallbackSrc(src)}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setStage((v) => (v === 0 ? 1 : 2))}
      className={`icon-anim shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

const BOOK = "https://meetings.hubspot.com/curtis-bendt/inbound-round-robin-for-discovery-calls";
const BOOK_UTM = `${BOOK}?utm_source=organic_click&utm_medium=booking&utm_campaign=calendar-lead`;

const FEATURES = [
  { img: "/wp-content/uploads/2026/04/leads.png", title: "Qualified B2B leads", Icon: Users },
  { img: "/wp-content/uploads/2026/04/Group-1000001939-1.png", title: "Buyer intent data", Icon: Target },
  { img: "/wp-content/uploads/2026/04/Group-1000001940.png", title: "ICP-focused targeting and outreach", Icon: Crosshair },
  { img: "/wp-content/uploads/2026/04/Group-1000001941.png", title: "Industry insights and competitor intelligence", Icon: Lightbulb },
];

const STEPS = [
  { Icon: Search, t: "Targeted Prospect Identification", d: "We leverage AI technology to identify your ideal prospects using advanced analytics, ensuring effective Lead Generation for Consulting." },
  { Icon: Mail, t: "Multi-Channel Outreach", d: "We engage decision-makers through personalized email campaigns, strategic cold calling, and LinkedIn outreach." },
  { Icon: ListChecks, t: "Lead Qualification & Nurturing", d: "We filter out low-quality prospects and nurture high-intent leads, strengthening your Lead Generation for business outcomes." },
  { Icon: CalendarCheck, t: "Sales-Ready Appointments", d: "We deliver warm, high-intent leads directly to your calendar making Lead Generation For Consulting Companies more efficient and conversion-focused." },
];

const WHY = [
  { img: "/wp-content/uploads/2025/10/expertise-1.png", alt: "expertise", Icon: Award, t: "Deep industry expertise with a proven track record" },
  { img: "/wp-content/uploads/2025/10/data-driven-3.png", alt: "data-driven", Icon: BarChart3, t: "Data-driven strategies to improve conversions." },
  { img: "/wp-content/uploads/2025/10/multi-channel-1.png", alt: "multi-channel", Icon: Layers, t: "Multi-channel engagement for better response rates." },
  { img: "/wp-content/uploads/2025/10/high-performance-1.png", alt: "high-performance", Icon: TrendingUp, t: "Performance-based delivery model" },
  { img: "/wp-content/uploads/2026/04/user-engagement-1.svg", alt: "", Icon: BadgeCheck, t: "100% qualified and high-intent leads." },
];

const CHOOSE = [
  {
    t: "Outbound Lead Generation Built for B2B Sales",
    d: "We help connect you to the right people in the Enterprise and SMB markets to ensure that your sales team is talking to people who are ready to buy.",
  },
  {
    t: "Data-Driven Revenue Growth",
    d: "Our constant analysis of campaign performance ensures that your strategy is always optimized to guarantee the maximum potential for your Lead Generation for Consulting Companies.",
  },
];


type Faq = { q: string; a: string; items?: string[]; after?: string };
const FAQS: Faq[] = [
  {
    q: "What makes MarketJoy different from other lead generation companies for consulting firms?",
    a: "MarketJoy is a lead generation company specializing in working with Consulting Companies. We utilize AI technology in lead generation with a personal touch. Unlike other lead generation companies, we operate like an extension of your sales team, providing you with quality and sales-ready leads according to your ideal client profile.",
  },
  {
    q: "How long does it take to start seeing results?",
    a: "In general, clients start to see initial traction within a few weeks. For most clients, qualified leads and scheduled meetings tend to start coming in within the first 30 to 60 days, depending on your industry scope.",
  },
  {
    q: "What types of consulting firms do you work with?",
    a: "We work with a variety of consulting firms, such as:",
    items: ["Management consulting firms", "Financial advisory services", "Strategy and operations consulting firms", "Boutique and niche consulting firms"],
    after: "Lead Generation is done according to your industry scope.",
  },
  {
    q: "How do you ensure lead quality?",
    a: "We use a combination of:",
    items: ["Using Artificial Intelligence to identify our prospects", "Analyzing intent data", "Manually qualifying our leads with our senior SDRs"],
    after: "In this way, we ensure that our leads are qualified and also have high intent to buy and are within your ideal client profile parameters.",
  },
  {
    q: "What channels do you use for lead generation?",
    a: "MarketJoy uses a multi-channel outreach strategy, including:",
    items: ["Personalized email campaigns", "LinkedIn outreach", "Strategic cold calling"],
    after: "This integrated approach maximizes engagement and improves conversion rates for Lead Generation for Consulting Companies.",
  },
];

const H2 = "text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl";

function Cta({ href = BOOK_UTM, children }: { href?: string; children: string }) {
  return (
    <a href={href} className="btn-gold px-6 py-3.5 text-sm sm:text-base">
      {children}
      <ArrowRight className="arrow h-4 w-4" />
    </a>
  );
}

function CaseImage() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setStage((v) => (v === 0 ? 1 : 2));
  }, []);
  if (stage === 2) {
    return (
      <div className="grid aspect-square w-full max-w-md place-items-center rounded-2xl bg-gradient-to-br from-brand-blue to-navy-deep p-8 text-center text-white">
        <div>
          <Database className="mx-auto h-12 w-12 text-gold" />
          <p className="mt-4 text-5xl font-extrabold">71</p>
          <p className="mt-1 text-sm font-semibold text-white/80">qualified leads in 12 months</p>
        </div>
      </div>
    );
  }
  const src = "/wp-content/uploads/2026/04/Group-1000001783.webp";
  return (
    <img
      ref={ref}
      referrerPolicy="no-referrer"
      src={stage === 0 ? src : wpFallbackSrc(src)}
      alt="MarketJoy: generate more qualified B2B meetings"
      width={510}
      height={519}
      loading="lazy"
      onError={() => setStage((v) => (v === 0 ? 1 : 2))}
      className="h-auto w-full max-w-md rounded-2xl object-contain"
    />
  );
}

export function BusinessConsultingBody() {
  return (
    <>
      {/* Intro + CTA */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
              At MarketJoy, we specialize in <strong className="text-foreground">Lead Generation for Consulting Companies</strong> that want
              to scale faster and build a predictable, high-value sales pipeline. Whether you’re a management consultant, financial
              advisor, strategy firm, or boutique consultancy, our approach ensures your business connects with the right prospects quickly
              and effectively.
            </p>
            <div className="mt-8">
              <Cta>Schedule Your Free Consultation Today</Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our expertise */}
      <section className="section-y bg-muted/60">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <Reveal from="left">
            <span className="eyebrow">Our expertise</span>
            <h2 className={`${H2} mt-3`}>
              Our expertise in <span className="text-brand-blue">Lead Generation for Consulting</span>
            </h2>
          </Reveal>
          <Reveal from="right" className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              enables businesses to move beyond the ad hoc nature of their current business growth strategy to a more structured and
              results-driven business growth strategy. Within weeks, our clients are able to experience business growth with the precision
              and effectiveness of our lead generation services.
            </p>
            <p>
              We are not just consultants; we are your outsourced business development team, delivering qualified leads, insights, brand
              awareness, and Lead Generation for business growth that drives real revenue impact.
            </p>
            <a href="/contact-us/" className="btn-gold mt-2 px-5 py-3 text-sm">
              Contact us <ArrowRight className="arrow h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Strategic thinking + 4 feature cards */}
      <section className="section-y">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <Reveal from="left" className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className={`${H2} text-foreground`}>Strategic Thinking Deserves Strategic Leads</h2>
            <p>
              MarketJoy is a trusted, performance-driven partner for Lead Generation for Consulting Companies targeting corporate clients.
              We function as an extension of your internal sales team, delivering:
            </p>
            <p>
              Our proven expertise in Lead Generation for Consulting Companies helps firms not only generate leads but also refine their
              ideal customer profiles and identify high-value opportunities. Clients like Forensic Analytical and Riverside Risk Advisors
              rely on us for both execution and strategy.
            </p>
            <p>
              We don’t just generate leads; we build relationships that drive long-term value. Are you seeking a Lead Generation partner
              that actually performs? MarketJoy is here to offer this smarter and more scalable solution.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="card-glow flex flex-col items-start gap-4 p-5">
                <AssetImg src={f.img} alt="" size={64} Fallback={f.Icon} />
                <h3 className="text-lg font-bold leading-snug">{f.title}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proven system + 4 steps */}
      <section className="section-y bg-navy-deep text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How MarketJoy works</span>
            <h2 className={`${H2} mt-3`}>Proven System for Predictable Growth</h2>
            <p className="mt-4 text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              Our Lead Generation for Consulting Companies process is designed to help you leverage your sales pipeline to create a growth
              engine, so you can focus on selling instead of pursuing new leads.
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 80} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy-deep">{i + 1}</span>
                  <s.Icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/75">{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Case study */}
      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Real results</span>
            <h2 className={`${H2} mt-3`}>Real Results That Speak for Themselves</h2>
          </Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal from="left" className="card-glow p-6 sm:p-8">
              <h3 className="text-2xl font-extrabold leading-tight">71 Qualified Leads in 12 Months for FACs</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                A forensic consulting firm partnered with MarketJoy to build a consistent pipeline. Through intelligent targeting and
                outbound SDR support, they generated 71 highly qualified leads demonstrating the effectiveness of our Lead Generation for
                Consulting Companies strategy.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "71", l: "Qualified Leads" },
                  { v: "12", l: "Months" },
                  { v: "5.9", l: "Leads/Month" },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col rounded-xl bg-accent px-2 py-4">
                    <dt className="order-2 mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{s.l}</dt>
                    <dd className="text-3xl font-extrabold text-brand-blue sm:text-4xl">
                      <AutoCount value={s.v} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal from="right" className="flex justify-center">
              <CaseImage />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why MarketJoy */}
      <section className="section-y bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className={H2}>Why MarketJoy?</h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {WHY.map((w, i) => (
              <Reveal as="li" key={w.t} delay={i * 60} className="card-glow flex flex-col items-center gap-3 p-5 text-center">
                <AssetImg src={w.img} alt={w.alt} size={56} Fallback={w.Icon} />
                <p className="text-sm font-semibold leading-snug">{w.t}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-center leading-relaxed text-muted-foreground">
            Our approach to Lead Generation for Consulting ensures that every interaction is purposeful, targeted, and aligned with your
            growth goals.
          </p>
        </div>
      </section>

      {/* Why consultants choose */}
      <section className="section-y">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className={H2}>Why Business Consultants Choose MarketJoy</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {CHOOSE.map((c, i) => (
              <Reveal key={c.t} delay={i * 80} className="card-glow p-6 sm:p-8">
                <h3 className="text-xl font-bold leading-snug">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{c.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-muted/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className={H2}>Frequently Asked Questions</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} className="group card-glow px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="h-5 w-5 shrink-0 text-gold transition-transform group-open:rotate-45" />
                </summary>
                <div className="space-y-3 pb-5 leading-relaxed text-muted-foreground">
                  <p>{f.a}</p>
                  {f.items && (
                    <ul className="list-disc space-y-1 pl-5 marker:text-gold">
                      {f.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                  {f.after && <p>{f.after}</p>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
