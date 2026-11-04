import { ABOUT_SEO, CURTIS } from "@/content/about/about";

export type Kind =
  | "service"
  | "product"
  | "industry"
  | "about"
  | "contact"
  | "blog"
  | "faqs"
  | "cases"
  | "reviews"
  | "external"
  | "productsIndex"
  | "vendors"
  | "member";

export type PageDef = {
  path: string;
  kind: Kind;
  title: string;
  eyebrow: string;
  tagline: string;
  intro: string[];
  bullets: string[];
  roles: string[];
  parent?: { label: string; href: string } | undefined;
  children?: { label: string; href: string }[] | undefined;
  external?: string;
  metaDescription: string;
  /** <title> when it differs from the on-page H1 (Rank Math title from the old site). */
  seoTitle?: string;
  /** Absolute og:image / twitter:image URL. */
  ogImage?: string;
};

const LIVE = "https://marketjoy.com";
const norm = (p: string) => "/" + p.replace(/^\/+|\/+$/g, "");

/* ---------------- services & products ---------------- */
type Core = Pick<PageDef, "title" | "tagline" | "intro" | "bullets">;

const SERVICES: Record<string, Core> = {
  "b2b-lead-generation-services": {
    title: "B2B Lead Generation Services",
    tagline: "Sales-qualified leads that are nurtured, verified, and ready for a conversation.",
    intro: [
      "Our specialized team leverages multichannel outreach, buyer intent data, and custom sales scripts to generate high-quality B2B leads tailored to your ideal customer profile.",
      "We're not just delivering names. We deliver sales-qualified leads (SQLs) backed by our 100% SQL Guarantee, so you see measurable ROI.",
    ],
    bullets: [
      "Multichannel email and calling outreach",
      "Buyer intent data targeting",
      "Custom cold email and call scripts",
      "Bi-weekly campaign strategy reviews",
      "100% SQL Guarantee",
    ],
  },
  salesfacilitation: {
    title: "Sales Facilitation",
    tagline: "Support your sales team with qualified opportunities and real buyer insight.",
    intro: [
      "Sales facilitation bridges the gap between early-stage interest and a conversation your closers actually want to have.",
      "We nurture and verify opportunities, so your team spends its time selling instead of prospecting.",
    ],
    bullets: [
      "Qualified opportunities handed to your team",
      "Buyer insight gathered during outreach",
      "Lead nurturing and follow-up",
      "Clear hand-off process with your sales reps",
    ],
  },
  "b2b-list-building-services": {
    title: "B2B List Building Services",
    tagline: "Hand-curated contact lists built around your ideal customer profile.",
    intro: [
      "Great outreach starts with great data. We define your ICP, research target accounts, and curate contacts of the real decision-makers you want to reach.",
      "Our lists are powered by the InfoJoy GTM engine and its 310M+ B2B profiles.",
    ],
    bullets: [
      "ICP definition and target account research",
      "Hand-curated decision-maker contacts",
      "Powered by 310M+ B2B profiles in InfoJoy",
      "Segmented for personalized messaging",
    ],
  },
  "digital-marketing": {
    title: "Digital Marketing",
    tagline: "Amplify outreach with multichannel campaigns that reach decision-makers.",
    intro: [
      "Our digital marketing services work alongside outbound so buyers meet your brand in more than one place.",
      "From AI-driven search visibility to omnichannel campaigns, we help you stay in front of the people who matter.",
    ],
    bullets: [
      "AI SEO services",
      "Answer Engine Optimization (AEO)",
      "Generative Engine Optimization (GEO)",
      "Omnichannel marketing campaigns",
    ],
  },
  "ai-seo-services": {
    title: "AI SEO Services",
    tagline: "Be found where B2B buyers now research: search engines and AI assistants.",
    intro: [
      "AI SEO combines proven search fundamentals with content structured for AI-driven discovery.",
      "We help your expertise show up when decision-makers look for solutions like yours.",
    ],
    bullets: [
      "Search strategy for B2B buyers",
      "Content built to answer buyer questions",
      "Technical and on-page optimization",
      "Reporting tied to pipeline",
    ],
  },
  "answer-engine-optimization-services": {
    title: "Answer Engine Optimization Services",
    tagline: "Structure your content so answer engines cite your brand.",
    intro: [
      "Buyers increasingly get direct answers instead of a list of links. Answer Engine Optimization (AEO) makes your content the answer.",
    ],
    bullets: [
      "Question-led content strategy",
      "Clear, citable page structure",
      "Schema and entity optimization",
      "Ongoing monitoring and refinement",
    ],
  },
  "generative-engine-optimization-services": {
    title: "Generative Engine Optimization Services",
    tagline: "Earn visibility inside generative AI responses.",
    intro: [
      "Generative Engine Optimization (GEO) helps your brand appear in responses from generative AI tools when buyers research your category.",
    ],
    bullets: [
      "Authority and entity building",
      "Content optimized for generative responses",
      "Third-party mentions and citations",
      "Visibility tracking and iteration",
    ],
  },
  "omnichannel-marketing-services": {
    title: "Omnichannel Marketing Services",
    tagline: "One connected message across every channel your buyers use.",
    intro: [
      "Omnichannel marketing coordinates email, calling, social and web touchpoints so prospects experience one consistent story.",
    ],
    bullets: [
      "Coordinated email, calling and social outreach",
      "Consistent messaging across touchpoints",
      "Behavioral data feeding campaign decisions",
      "Bi-weekly performance reviews",
    ],
  },
  "appointment-generation-setting": {
    title: "Appointment Generation & Setting",
    tagline: "Book qualified sales meetings with prospects who match your ICP.",
    intro: [
      "Our appointment setting team handles outreach and qualification, then puts meetings straight on your reps' calendars.",
      "Every appointment is with a real decision-maker who fits your ideal customer profile.",
    ],
    bullets: [
      "Dedicated email and calling SDRs",
      "Qualification before every meeting",
      "Calendar-ready appointments",
      "Transparent reporting and bi-weekly reviews",
    ],
  },
  "outbound-sdr-services": {
    title: "Outbound SDR Services",
    tagline: "Dedicated email and calling SDRs acting as an extension of your team.",
    intro: [
      "Get a full outbound team without the hiring, training and management overhead of building an in-house SDR function.",
      "Each client is paired with a GTM Engineer, Customer Success Manager (CSM), Email and Calling SDRs, Content Writer and Script Developers, and Technical Operations and Delivery Experts.",
    ],
    bullets: [
      "Team of up to six people",
      "Go live in as little as 15 business days",
      "No setup fees ever",
      "Domain warming and inbox setup included",
    ],
  },
  "finance-and-accounting-outsourcing-services": {
    title: "Finance & Accounting Outsourcing Services",
    tagline: "Reliable back-office support so you can focus on growth.",
    intro: [
      "Alongside revenue growth services, MarketJoy supports businesses with finance and accounting outsourcing.",
      "Talk to our team to learn how we can support your finance operations.",
    ],
    bullets: [
      "Dedicated support team",
      "Process-driven and transparent",
      "Scales with your business",
      "Clear communication and reporting",
    ],
  },
};

const PRODUCTS: Record<string, Core> = {
  infojoy: {
    title: "InfoJoy",
    tagline:
      "The AI-Powered GTM engine, powered by 310M+ B2B profiles, to find and reach real decision-makers.",
    intro: [
      "InfoJoy is MarketJoy's go-to-market engine. It gives you accurate B2B data to build targeted lists and run precise outreach.",
    ],
    bullets: [
      "310M+ B2B profiles",
      "Filter by company, industry, decision-maker and location",
      "Built for outbound campaigns",
      "Powers our hand-curated lists",
    ],
  },
};

/* ---------------- industries ---------------- */
type Ind = { name: string; path: string; roles: string[]; kids?: { name: string; path: string }[] };
const R = {
  mfg: [
    "Plant & operations managers",
    "Procurement and sourcing leaders",
    "Engineering directors",
    "Owners and general managers",
  ],
};
const IND: Ind[] = [
  {
    name: "Business | Consulting",
    path: "/industries/business-consulting-lead-generation/",
    roles: [
      "Managing partners",
      "Business development leaders",
      "Chief operating officers",
      "Practice heads",
    ],
  },
  {
    name: "Utilities",
    path: "/industries/utilities-lead-generation/",
    roles: [
      "Operations directors",
      "Asset and grid managers",
      "Procurement leaders",
      "Sustainability heads",
    ],
  },
  {
    name: "E-commerce | Online Retail",
    path: "/industries/e-commerce-online-retail-lead-generation/",
    roles: [
      "Founders and owners",
      "Heads of growth and marketing",
      "Operations and fulfillment leaders",
      "Merchandising directors",
    ],
  },
  {
    name: "Finance | Fintech",
    path: "/industries/fintech-lead-generation/",
    roles: [
      "Chief financial officers",
      "Heads of payments and product",
      "Risk and compliance leaders",
      "Business development directors",
    ],
  },
  {
    name: "High Tech | Software",
    path: "/industries/high-tech-and-software-lead-generation/",
    roles: ["VPs of sales and revenue", "Chief technology officers", "Product leaders", "Founders"],
  },
  {
    name: "Medical | Healthcare",
    path: "/industries/medical-healthcare-lead-generation/",
    roles: [
      "Hospital and clinic administrators",
      "Practice managers",
      "Procurement and supply leaders",
      "Clinical directors",
    ],
  },
  {
    name: "Manufacturing",
    path: "/industries/manufacturing-lead-generation/",
    roles: R.mfg,
    kids: [
      {
        name: "Chemical & Materials Manufacturing",
        path: "/industries/manufacturing-lead-generation/chemical-and-materials/",
      },
      {
        name: "Consumer Goods & Electronics",
        path: "/industries/manufacturing-lead-generation/consumer-goods-electronics/",
      },
      {
        name: "Contract & Custom Manufacturing",
        path: "/industries/manufacturing-lead-generation/contract-custom/",
      },
      {
        name: "Energy & Environmental Manufacturing",
        path: "/industries/manufacturing-lead-generation/energy-and-environmental/",
      },
      {
        name: "High-Tech & Precision Manufacturing",
        path: "/industries/manufacturing-lead-generation/high-tech-precision-manufacturing/",
      },
      {
        name: "Industrial & Heavy Manufacturing",
        path: "/industries/manufacturing-lead-generation/industrial-heavy-manufacturing/",
      },
      {
        name: "Food & Beverage Manufacturers",
        path: "/industries/manufacturing-lead-generation/food-beverage-manufacturers/",
      },
    ],
  },
  {
    name: "Construction",
    path: "/construction-lead-generation/",
    roles: [
      "Owners and general contractors",
      "Estimators and project managers",
      "Procurement leaders",
      "Business development managers",
    ],
    kids: [
      { name: "Roofing Business", path: "/construction-lead-generation/roofing/" },
      { name: "Flooring Business", path: "/construction-lead-generation/flooring/" },
      { name: "Architecture Business", path: "/construction-lead-generation/architecture/" },
      {
        name: "Paving Business",
        path: "/construction-lead-generation/paving-lead-generation-services/",
      },
      { name: "Painting Business", path: "/construction-lead-generation/painting-business/" },
      { name: "HVAC Business", path: "/construction-lead-generation/hvac-lead-generation/" },
    ],
  },
  {
    name: "Environmental | Facilities",
    path: "/industries/environmental-and-facilities-lead-generation/",
    roles: ["Facility managers", "EHS directors", "Operations leaders", "Procurement managers"],
  },
  {
    name: "Manufacturing Suppliers",
    path: "/industries/manufacturing-suppliers-lead-generation/",
    roles: ["Purchasing managers", "Supply chain directors", "Plant managers", "Owners"],
  },
  {
    name: "Logistics | Supply Chain | Storage",
    path: "/industries/shipping-and-supply-chain-logistics-lead-generation/",
    roles: [
      "Supply chain directors",
      "Logistics and transportation managers",
      "Warehouse operations leaders",
      "Procurement heads",
    ],
  },
  {
    name: "Food & Beverages",
    path: "/industries/food-and-beverages-lead-generation/",
    roles: [
      "Operations and plant leaders",
      "Procurement and sourcing managers",
      "Product development heads",
      "Owners",
    ],
  },
  {
    name: "Chemicals",
    path: "/industries/chemical-lead-generation/",
    roles: [
      "Plant and operations managers",
      "Procurement leaders",
      "R&D directors",
      "Business development heads",
    ],
    kids: [
      {
        name: "Basic & Commodity Chemical Companies",
        path: "/industries/chemical-lead-generation/basic-and-commodity/",
      },
      {
        name: "Green & Sustainable Chemical Companies",
        path: "/industries/chemical-lead-generation/green-sustainable-chemical-companies/",
      },
      {
        name: "Industrial Chemical Companies",
        path: "/industries/chemical-lead-generation/industrial-chemical-companies/",
      },
      {
        name: "Pharmaceutical & Life Science Chemical Companies",
        path: "/industries/chemical-lead-generation/pharmaceutical-life-science/",
      },
      {
        name: "Specialty Chemical Companies",
        path: "/industries/chemical-lead-generation/specialty-chemical-companies/",
      },
    ],
  },
  {
    name: "Industrial Automation",
    path: "/industries/industrial-automation-lead-generation/",
    roles: [
      "Controls and automation engineers",
      "Plant managers",
      "Operations directors",
      "Procurement leaders",
    ],
  },
  {
    name: "Renewable Energy",
    path: "/industries/renewable-energy-lead-generation/",
    roles: [
      "Project developers",
      "Energy managers",
      "Procurement leaders",
      "Business development directors",
    ],
  },
];

function industryPage(
  name: string,
  path: string,
  roles: string[],
  parent?: { label: string; href: string },
  kids?: { name: string; path: string }[],
): PageDef {
  const clean = name.replace(/ Business$/, "");
  return {
    path,
    kind: "industry",
    parent,
    roles,
    bullets: [],
    title: `${clean} Lead Generation`,
    eyebrow: parent ? parent.label : "Industries we serve",
    tagline: `Reach the decision-makers who buy in ${clean.toLowerCase()} and book qualified meetings without building an in-house SDR team.`,
    intro: [
      `MarketJoy helps ${clean.toLowerCase()} companies build a predictable, sales-qualified pipeline using buyer intent data, hand-curated contacts, and dedicated outbound teams.`,
      "We define your ideal customer profile, research target accounts, run multichannel outreach, and review performance with you every two weeks.",
    ],
    children: kids?.map((k) => ({ label: k.name, href: k.path })),
    metaDescription: `B2B lead generation for ${clean.toLowerCase()} companies. Sales-qualified leads, appointment setting and outbound SDR support from MarketJoy.`,
  };
}

/* ---------------- registry ---------------- */
const pages: PageDef[] = [];
const add = (
  p: Omit<PageDef, "metaDescription" | "bullets" | "roles" | "intro"> & Partial<PageDef>,
) => pages.push({ metaDescription: p.tagline, bullets: [], roles: [], intro: [], ...p });

Object.entries(SERVICES).forEach(([slug, c]) =>
  add({ ...c, path: norm(slug), kind: "service", eyebrow: "Services" }),
);
Object.entries(PRODUCTS).forEach(([slug, c]) =>
  add({
    ...c,
    path: norm(`products/${slug}`),
    kind: "product",
    eyebrow: "Products",
    parent: { label: "Products", href: "/products/" },
  }),
);

add({
  path: "/products",
  kind: "productsIndex",
  title: "Our Products",
  eyebrow: "Products",
  tagline:
    "Proprietary tools that help you identify, engage and convert the right prospects faster.",
  intro: [
    "InfoJoy works together with our outbound teams to power every campaign.",
  ],
});

IND.forEach((i) => {
  pages.push(industryPage(i.name, i.path, i.roles, undefined, i.kids));
  i.kids?.forEach((k) =>
    pages.push(industryPage(k.name, k.path, i.roles, { label: i.name, href: i.path })),
  );
});

add({
  path: "/about",
  kind: "about",
  title: "About MarketJoy",
  eyebrow: "About us",
  tagline: "Empowering businesses with predictable, scalable growth.",
  metaDescription: ABOUT_SEO.description,
  seoTitle: ABOUT_SEO.title,
  ogImage: ABOUT_SEO.ogImage,
  intro: [],
});
add({
  path: "/curtis-bendt",
  kind: "member",
  title: CURTIS.name,
  eyebrow: CURTIS.role,
  tagline: "Global lead generation, telesales and revenue growth leader.",
  metaDescription: CURTIS.seo.description,
  seoTitle: CURTIS.seo.title,
  parent: { label: "About Us", href: "/about/" },
  intro: [],
});
add({
  path: "/contact-us",
  kind: "contact",
  title: "Contact Us",
  eyebrow: "Get in touch",
  tagline: "Let's discuss your goals and create a custom lead generation plan for your business.",
  intro: [],
});
add({
  path: "/blog",
  kind: "blog",
  title: "MarketJoy Blog",
  eyebrow: "Resources",
  tagline: "Insights for B2B sales and marketing teams.",
  intro: [],
});
add({
  path: "/faqs",
  kind: "faqs",
  title: "Frequently Asked Questions",
  eyebrow: "Resources",
  tagline: "Answers to common questions about B2B lead generation.",
  intro: [],
});
add({
  path: "/case-studies",
  kind: "cases",
  title: "Case Studies",
  eyebrow: "Success stories",
  tagline: "Real results for real businesses.",
  intro: [],
});
add({
  path: "/client-reviews",
  kind: "reviews",
  title: "Client Reviews",
  eyebrow: "Success stories",
  tagline: "What our clients say about working with MarketJoy.",
  intro: [],
});

add({
  path: "/b2b-sales-marketing-lead-generation-vendors",
  kind: "vendors",
  title: "B2B Platforms & Vendors",
  eyebrow: "Resources",
  tagline: "A directory of B2B sales, marketing and lead generation platforms.",
  intro: [],
});

const EXT: [string, string, string, string][] = [
  [
    "/press-release",
    "Press Releases",
    "Company news and announcements from MarketJoy.",
    "/press-release/",
  ],
  [
    "/industry-news",
    "Industry News",
    "News and trends shaping B2B sales and lead generation.",
    "/industry-news",
  ],
  ["/joypedia", "JoyPedia", "Our B2B sales and marketing knowledge base.", "/joypedia"],
  [
    "/privacy-policy",
    "Privacy Policy",
    "How MarketJoy handles your information.",
    "/privacy-policy/",
  ],
];
EXT.forEach(([path, title, tagline, live]) =>
  add({
    path,
    kind: "external",
    title,
    eyebrow: "Resources",
    tagline,
    intro: [],
    external: LIVE + live,
  }),
);

const byPath = new Map(pages.map((p) => [norm(p.path), p]));
export const ALL_PAGES = pages;
export const findPage = (splat: string | undefined) => byPath.get(norm(splat ?? "")) ?? null;
export const SERVICE_LIST = pages.filter((p) => p.kind === "service");
export const PRODUCT_LIST = pages.filter((p) => p.kind === "product");
export const INDUSTRY_TOP = IND.map((i) => ({ label: i.name, href: i.path }));
