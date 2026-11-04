import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import {
  Hero,
  About,
  Trust,
  Services,
  Onboarding,
  Bundle,
  Industries,
  Products,
  Features,
  Stories,
  Testimonials,
  Recognition,
  Blog,
  Faq,
  FinalCta,
  Footer,
} from "@/components/home/Sections";
import { ScrollUi } from "@/components/home/ScrollUi";
import { FAQS } from "@/components/home/data";
import { seo, jsonLd, faqSchema, SITE_NAME, SITE_URL } from "@/lib/seo";

const HOME_TITLE = "B2B Lead Generation Agency & Company USA | MarketJoy";
const HOME_DESC =
  "MarketJoy is a leading B2B lead generation agency & company in the USA, offering expert services in sales qualified leads. Book a meeting today.";

export const Route = createFileRoute("/")({
  head: () => {
    const { meta, links } = seo({ title: HOME_TITLE, description: HOME_DESC, path: "/" });
    return {
      meta,
      links,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
        }),
        jsonLd(faqSchema(FAQS)),
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <>
      <ScrollUi />
      <Navbar />
      <main>
        <Hero />
        <Stories />
        <Trust />
        <About />
        <Services />
        <Features />
        <Onboarding />
        <Bundle />
        <Industries />
        <Products />
        <Testimonials />
        <Recognition />
        <Blog />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
