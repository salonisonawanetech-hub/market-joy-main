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
import { fetchWordPressPageBySlug, getWordPressPageSeo } from "@/lib/wordpressPages";

const HOME_TITLE = "B2B Lead Generation Agency & Company USA | MarketJoy";
const HOME_DESC =
  "MarketJoy is a leading B2B lead generation agency & company in the USA, offering expert services in sales qualified leads. Book a meeting today.";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const page = await fetchWordPressPageBySlug("lead-generation-services-2");
      return page ? getWordPressPageSeo(page) : null;
    } catch (error) {
      console.warn("Unable to load homepage metadata from WordPress", error);
      return null;
    }
  },
  head: ({ loaderData }) => {
    const { meta, links } = seo({
      title: loaderData?.title || HOME_TITLE,
      description: loaderData?.description || HOME_DESC,
      path: "/",
      ...(loaderData?.image ? { image: loaderData.image } : {}),
    });
    if (loaderData?.canonical) {
      const canonical = links.find((link) => link.rel === "canonical");
      if (canonical) canonical.href = loaderData.canonical;
    }
    if (loaderData?.robots) meta.push({ name: "robots", content: loaderData.robots } as never);
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
