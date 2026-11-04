import { useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowRight, Bot, Briefcase, Building2, Cpu, Factory, FlaskConical, HardHat, Landmark, Leaf, Quote, ShoppingCart, Stethoscope, Sun, Truck, UtensilsCrossed, Wrench, Zap } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { wpFallbackSrc } from "@/lib/wp-images";
import { INDUSTRIES_INDEX } from "@/content/industries/loader";

type Icon = ComponentType<{ className?: string }>;
const BOOK = "https://meetings.hubspot.com/curtis-bendt/inbound-round-robin-for-discovery-calls";
const H2 = "text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl";

/** The ten tiles of the old "tailored for your industry" gallery (image + title), linked to the closest industry page. */
const GALLERY: { title: string; img: string; href?: string }[] = [
  { title: "Information Technology", img: "/wp-content/uploads/2023/06/Rectangle-4601.png", href: "/industries/high-tech-and-software-lead-generation/" },
  { title: "Business Insurance", img: "/wp-content/uploads/2023/06/Rtgle-4601.png" },
  { title: "Business-Business Services", img: "/wp-content/uploads/2023/06/Rtangle-01.png", href: "/industries/manufacturing-suppliers-lead-generation/" },
  { title: "Medical and HealthCare", img: "/wp-content/uploads/2023/06/Rangle-401.png", href: "/industries/medical-healthcare-lead-generation/" },
  { title: "Digital Marketing & Advertising", img: "/wp-content/uploads/2023/06/Recangle-461.png" },
  { title: "Business Products & Services", img: "/wp-content/uploads/2023/06/Rectangle-401.png" },
  { title: "Management Consulting", img: "/wp-content/uploads/2023/06/ectagle-4601.png", href: "/industries/business-consulting-lead-generation/" },
  { title: "Fintech", img: "/wp-content/uploads/2023/06/ectangle-4601.png", href: "/industries/fintech-lead-generation/" },
  { title: "Human Resources", img: "/wp-content/uploads/2023/06/Rctagle-4601.png" },
  { title: "Manufacturing", img: "/wp-content/uploads/2023/06/Retangle-4601.png", href: "/industries/manufacturing-lead-generation/" },
];

/** Short labels (same as the navbar) + icon for every top-level industry page. */
const META: Record<string, { label: string; Icon: Icon }> = {
  "/industries/business-consulting-lead-generation/": { label: "Business | Consulting", Icon: Briefcase },
  "/industries/utilities-lead-generation/": { label: "Utilities", Icon: Zap },
  "/industries/e-commerce-online-retail-lead-generation/": { label: "E-commerce", Icon: ShoppingCart },
  "/industries/fintech-lead-generation/": { label: "Finance | Fintech", Icon: Landmark },
  "/industries/high-tech-and-software-lead-generation/": { label: "High Tech | Software", Icon: Cpu },
  "/industries/medical-healthcare-lead-generation/": { label: "Medical | Healthcare", Icon: Stethoscope },
  "/industries/manufacturing-lead-generation/": { label: "Manufacturing", Icon: Factory },
  "/construction-lead-generation/": { label: "Construction", Icon: HardHat },
  "/industries/environmental-and-facilities-lead-generation/": { label: "Environmental | Facilities", Icon: Leaf },
  "/industries/manufacturing-suppliers-lead-generation/": { label: "Manufacturing Suppliers", Icon: Wrench },
  "/industries/shipping-and-supply-chain-logistics-lead-generation/": { label: "Logistics | Supply Chain", Icon: Truck },
  "/industries/food-and-beverages-lead-generation/": { label: "Food & Beverages", Icon: UtensilsCrossed },
  "/industries/chemical-lead-generation/": { label: "Chemicals", Icon: FlaskConical },
  "/industries/industrial-automation-lead-generation/": { label: "Industrial Automation", Icon: Bot },
  "/industries/renewable-energy-lead-generation/": { label: "Renewable Energy", Icon: Sun },
};

function Tile({ title, img, href }: { title: string; img: string; href?: string | undefined }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setStage((v) => (v === 0 ? 1 : 2));
  }, []);
  const inner = (
    <>
      {stage < 2 ? (
        <img
          ref={ref}
          referrerPolicy="no-referrer"
      src={stage === 0 ? img : wpFallbackSrc(img)}
          alt=""
          loading="lazy"
          onError={() => setStage((v) => (v === 0 ? 1 : 2))}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-blue to-navy-deep">
          <Building2 className="h-12 w-12 text-white/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/25 to-transparent" />
      <h3 className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-base font-bold leading-snug text-white sm:text-lg">
        {title}
        {href && <ArrowRight className="arrow h-4 w-4 shrink-0 text-gold" />}
      </h3>
    </>
  );
  const cls = "group card-glow relative block aspect-[548/442] overflow-hidden";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function IndustriesHub() {
  const top = INDUSTRIES_INDEX.filter((i) => META[i.path]);
  return (
    <>
      {/* Experience */}
      <section className="section-y">
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="eyebrow">Industries we serve</span>
          <h2 className={`${H2} mt-3`}>MarketJoy Industry Experience</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            <a href="/" className="font-semibold text-brand-blue underline underline-offset-4 hover:text-gold">MarketJoy</a> caters to a wide range of industries, including tech companies and specialized sectors
            throughout{" "}
            <a href="https://en.wikipedia.org/wiki/North_America" className="font-semibold text-brand-blue underline underline-offset-4 hover:text-gold">North America</a>. Our expertise lies in delivering
            industry-specific lead generation solutions that precisely target the ideal customers for your business.
          </p>
        </Reveal>
      </section>

      {/* Gallery */}
      <section className="section-y bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto mb-9 max-w-3xl text-center">
            <h2 className={H2}>
              Lead Generation and Sales Development Services <span className="text-brand-blue">tailored for your Industry</span>
            </h2>
          </Reveal>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {GALLERY.map((g, i) => (
              <Reveal as="li" key={g.title} delay={Math.min(i, 8) * 50}>
                <Tile {...g} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Every industry page */}
      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto mb-9 max-w-3xl text-center">
            <span className="eyebrow">Explore</span>
            <h2 className={`${H2} mt-3`}>Find lead generation built for your industry</h2>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((i, k) => {
              const m = META[i.path]!;
              const subs = INDUSTRIES_INDEX.filter((c) => c.parent === i.path).length;
              return (
                <Reveal as="li" key={i.path} delay={Math.min(k, 6) * 50}>
                  <a href={i.path} className="card-glow flex h-full items-center gap-4 p-5">
                    <span className="icon-anim grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-brand-blue">
                      <m.Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-snug">{m.label}</span>
                      {subs > 0 && <span className="text-sm text-muted-foreground">{subs} specialties</span>}
                    </span>
                    <ArrowRight className="arrow h-4 w-4 shrink-0 text-gold" />
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="section-y bg-navy-deep text-navy-foreground">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className={H2}>Stop wasting time searching for prospects</h2>
          <a href={BOOK} className="btn-gold mt-7 px-7 py-3.5">
            Book a Demo <ArrowRight className="arrow h-4 w-4" />
          </a>
        </Reveal>
      </section>

      {/* Testimonial */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal className="mb-8 text-center">
            <h2 className={H2}>Built on Customer Success</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Transform your sales pipeline and achieve your revenue goals with our comprehensive services, tailored to suit your unique business needs
            </p>
          </Reveal>
          <Reveal as="figure" className="card-glow p-6 sm:p-10">
            <Quote className="h-9 w-9 text-gold" />
            <blockquote className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              MarketJoy has been a key partner in WaterSmart Software’s sales development efforts. They have consistently exceeded our meeting creation goals by 100% each month and have been a
              flexible, patient, and strategic partner. They really understand how to generate responses from prospects and have actually helped our sales development reps become more productive
              through adoption of MarketJoy best practices. On top of all that, the service is about as cost-effective as you could possibly hope for. We look forward to continuing and expanding our
              relationship with MarketJoy in the months and years ahead.
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <span className="block font-bold">Jeff Lipton</span>
              <span className="text-sm text-muted-foreground">SVP, Business Development, WaterSmart Software</span>
            </figcaption>
          </Reveal>
        </div>
      </section>
    </>
  );
}
