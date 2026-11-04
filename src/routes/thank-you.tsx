import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";
import { Reveal } from "@/components/home/Reveal";
import GatewayFlow from "@/components/ui/gateway-flow";
import { seo } from "@/lib/seo";

const TITLE = "Thank You | MarketJoy";
const DESC = "Thank You for Your Submission!";

export const Route = createFileRoute("/thank-you")({
  head: () => {
    const { meta, links } = seo({ title: TITLE, description: DESC, path: "/thank-you" });
    return { meta: [...meta, { name: "robots", content: "noindex, follow" }], links };
  },
  component: ThankYou,
});

const LINKS = [
  { pre: "Visit Our", label: "Blog", href: "https://marketjoy.com/blog/" },
  {
    pre: "Check Out Our",
    label: "Social Proof",
    href: "https://marketjoy.com/what-our-clients-say/",
  },
  {
    pre: "Follow Us on",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/marketjoy-inc./",
  },
];

function ThankYou() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
          <div className="absolute inset-0 -z-20">
            <GatewayFlow className="h-full w-full" density={0.6} />
          </div>
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(15_32_64/0.75),transparent_65%),radial-gradient(ellipse_at_center,transparent_40%,rgb(15_32_64/0.85)_100%)]"
            aria-hidden="true"
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-28">
            <div className="ty-badge relative grid h-24 w-24 place-items-center" aria-hidden="true">
              <span className="ty-ring absolute inset-0 rounded-full bg-gold/30" />
              <span className="ty-ring ty-ring-2 absolute inset-0 rounded-full bg-gold/20" />
              <svg viewBox="0 0 96 96" className="relative h-24 w-24">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  className="fill-gold stroke-gold-bright"
                  strokeWidth="3"
                />
                <path
                  d="M30 49l13 13 24-27"
                  className="ty-check fill-none stroke-navy-deep"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <Reveal
              eager
              delay={300}
              as="h1"
              className="mt-8 text-[2rem] font-extrabold leading-[1.1] min-[400px]:text-4xl sm:text-5xl"
            >
              Thank You for Your Submission!
            </Reveal>
            <Reveal
              eager
              delay={380}
              as="p"
              className="mt-4 text-base text-navy-foreground/85 sm:text-lg"
            >
              Our team will review your request and get back to you as soon as possible.
            </Reveal>

            <Reveal eager delay={460} className="mt-8 w-full">
              <p className="text-sm font-semibold text-navy-foreground/90 sm:text-base">
                Feel free to explore more about us:
              </p>
              <ul className="mx-auto mt-4 grid max-w-sm gap-2.5 text-left">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/10 sm:text-base"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rotate-45 bg-gold transition-transform duration-300 group-hover:rotate-[225deg] group-hover:scale-125"
                        aria-hidden="true"
                      />
                      <span className="text-navy-foreground/85">
                        {l.pre}{" "}
                        <span className="font-semibold text-gold underline-offset-4 group-hover:underline">
                          {l.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              eager
              delay={540}
              as="p"
              className="mt-8 text-sm text-navy-foreground/85 sm:text-base"
            >
              You can contact us directly at{" "}
              <a href="mailto:hello@marketjoy.com" className="font-bold text-gold hover:underline">
                hello@marketjoy.com
              </a>
              , if your request is urgent.
            </Reveal>
            <Reveal
              eager
              delay={620}
              as="p"
              className="mt-3 text-sm font-semibold text-navy-foreground sm:text-base"
            >
              Looking forward to connecting with you!
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
