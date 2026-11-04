/**
 * Structured copy for the two product pages (/products/ and /products/infojoy/).
 * Text and image files are the ones migrated from marketjoy.com (see entries/products*.json); only the layout is new.
 * The JSON entries stay the source for SEO, JSON-LD and FAQ data.
 */
const UP = "/wp-content/uploads";
const BOOK = "https://meetings.hubspot.com/curtis-bendt/inbound-round-robin-for-discovery-calls";

export const PRODUCTS_HUB = {
  intro: {
    eyebrow: "Product suite",
    title: "MarketJoy Product Suite",
    body: "Smarter tools to empower your sales, marketing, and revenue teams. Our intelligent B2B solutions combine buyer intent data, AI-powered insights, and verified contact intelligence to help you connect with decision-makers faster, convert more leads, and grow predictable revenue.",
    cta: { label: "Contact Us Today", href: BOOK },
    image: { src: `${UP}/2025/11/product-banner.png`, alt: "MarketJoy product suite: InfoJoy smarter B2B prospecting", width: 511, height: 477 },
  },
  tailored: {
    title: "Lead Generation Intelligence Tailored for Modern B2B Teams",
    body: "At MarketJoy, we go beyond traditional lead generation: we help you turn data into deals. Our advanced tools are designed to make your pipeline more predictable, measurable, and scalable. Whether you’re identifying new prospects or converting active intent into sales conversations, our products ensure your team stays ahead of the competition.",
  },
  products: {
    eyebrow: "Our products",
    title: "Our Products",
    items: [
      {
        title: "InfoJoy: Smarter B2B Prospecting",
        body: "InfoJoy, powered by AI and verified data, transforms how your teams find and qualify leads.",
        href: "/products/infojoy/",
        cta: "Explore InfoJoy",
        image: { src: `${UP}/2025/11/Mask-group-1.png`, alt: "InfoJoy smarter B2B prospecting", width: 346, height: 239 },
      },
    ],
  },
  growth: {
    eyebrow: "Better together",
    title: "Built for Predictable Growth",
    body: "Our technology solutions work hand-in-hand with MarketJoy’s proven B2B lead generation services. Together, they create a performance-driven ecosystem that powers your sales success from identifying high-intent buyers to nurturing them into long-term customers.",
    image: {
      src: `${UP}/2025/11/2149611205-1.png`,
      alt: "Industries MarketJoy products and lead generation services support",
      width: 384,
      height: 308,
    },
    industriesTitle: "Industries we serve",
    industries: [
      { label: "Healthcare", href: "/industries/medical-healthcare-lead-generation/" },
      { label: "Financial Services", href: "/industries/fintech-lead-generation/" },
      { label: "IT & Tech", href: "/industries/high-tech-and-software-lead-generation/" },
      { label: "Manufacturing", href: "/industries/manufacturing-lead-generation/" },
      { label: "Business Consulting", href: "/industries/business-consulting-lead-generation/" },
      { label: "Logistics", href: "/industries/shipping-and-supply-chain-logistics-lead-generation/" },
      { label: "Marketing & Advertising", href: "/digital-marketing/" },
    ],
  },
  cta: {
    title: "Stop Guessing. Start Growing.",
    body: "Experience the power of intelligent data, AI-driven insights, and proven lead generation expertise. Let’s transform how your business identifies, engages, and converts prospects.",
    button: { label: "Book a Demo", href: BOOK },
  },
};

export const INFOJOY = {
  intro: {
    body: "Empower your sales and marketing teams with account-level intent data, verified contacts, and advanced filters so you never waste time chasing the wrong leads.",
    cta: {
      label: "Book a Demo",
      href: `${BOOK}?utm_source=organic_click&utm_medium=booking&utm_campaign=calendar-lead`,
    },
    images: [
      {
        src: `${UP}/elementor/thumbs/chart-rd53lacvy4utbdpj01b84l56xrontl2ohurx1e3qbw.png`,
        alt: "InfoJoy: B2B Buyer Intent Prospecting Platform Powered by AI",
      },
      {
        src: `${UP}/elementor/thumbs/98d3404ce776f55bbd91fc52394da1a32ae04922-rd54b6syd28ssbt2245a0mn8zgsatmspa6ttmmwu2w.png`,
        alt: "InfoJoy B2B prospecting platform preview",
      },
    ],
  },
  problem: {
    title: "The Problem Without InfoJoy",
    lead: "In today’s competitive B2B landscape, relying on outdated or incomplete data can slow down growth:",
    points: [
      "Domain health suffers when teams send campaigns to unvalidated or incorrect emails.",
      "Outdated contact data means wasted effort as people frequently change roles across industries.",
      "Low connection rates make calling efforts frustrating and inefficient.",
      "Business Development teams waste hours fixing data instead of focusing on meaningful outreach",
    ],
  },
  delivers: {
    title: "What InfoJoy Delivers",
    leadStrong: "With MarketJoy’s InfoJoy,",
    lead: "you eliminate guesswork and focus only on what matters:",
    points: [
      "Direct access to decision-makers across industries.",
      "Instant account intelligence including company insights, LinkedIn data, domains, and targeted keywords.",
      "Direct Dial numbers – from extensions to mobile contacts",
      "On-demand list building tailored to your needs.",
      "Effortless ICP-matched account creation that ensures quality outreach every time.",
    ],
  },
  intent: {
    title: "AI-Powered Buyer Intent Signals",
    image: { src: `${UP}/2025/10/AI-Powered-Buyer-Intent-Signals.png`, alt: "AI-Powered Buyer Intent Signals", width: 588, height: 544 },
    leadBefore: "Stop wasting time with cold leads. InfoJoy uses ",
    leadLink: { label: "AI-driven", href: "/blog/ai-driven-outbound-how-machine-learning-predicts-which-prospects-will-reply/" },
    leadAfter: " intent signals to bring the hottest prospects straight to your pipeline:",
    steps: [
      { title: "Scan 5,000+ data sources", body: "to identify companies already engaging with content relevant to your solutions." },
      { title: "AI tools trigger new opportunities", body: "the moment companies start searching for what you offer." },
      { title: "Focus outreach on in-market contacts", body: "who are more likely to convert." },
    ],
  },
  features: {
    title: "Platform Features",
    lead: "Designed for efficiency and accuracy, InfoJoy includes:",
    items: [
      { title: "25+ advanced search filters & triggers", body: "for precise targeting" },
      { title: "5,000+ verified data sources", body: "for unmatched reliability." },
      { title: "Seamless CRM + marketing automation integrations", body: "" },
      { title: "Verified emails and millions of contacts", body: "to fuel outreach" },
      { title: "Bulk data pulls via credits", body: "for scalable campaigns" },
    ],
  },
  pricing: {
    title: "Flexible Pricing Model",
    lead: "InfoJoy is built for teams of all sizes. Choose the plan that fits your growth stage:",
    points: ["Flexible pricing based on your needs", "Annual subscriptions or credit-based options available"],
    image: { src: `${UP}/2025/10/Flexible-Pricing-Model-.png`, alt: "Flexible Pricing Model", width: 282, height: 323 },
  },
  love: {
    title: "Why Teams Love InfoJoy",
    leadStrong: "real results:",
    lead: "Sales and marketing teams choose InfoJoy by MarketJoy because it delivers",
    items: [
      { icon: `${UP}/2025/10/Enhanced-targeting.svg`, alt: "Enhanced targeting", text: "Enhanced targeting = better ROI from every campaign" },
      {
        icon: `${UP}/2025/10/Automated-list-building-hours-saved-for-your-team.svg`,
        alt: "Automated list building hours saved for your team",
        text: "Automated list building = hours saved for your team",
      },
      {
        icon: `${UP}/2025/10/Direct-dials-more-conversations-with-decision-makers.svg`,
        alt: "Direct dials more conversations with decision-makers",
        text: "Direct dials = more conversations with decision-makers",
      },
      {
        icon: `${UP}/2025/10/Buyer-insights-shorter-sales-cycles.svg`,
        alt: "Buyer insights, shorter sales cycles",
        text: "Buyer insights = shorter sales cycles and faster wins",
      },
      {
        icon: `${UP}/2025/10/Dedicated-support-customer.svg`,
        alt: "Dedicated support & customer",
        text: "Dedicated support & customer success resources at every step",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Prospecting?",
    body: "With InfoJoy, your team gains smarter, faster, and more reliable B2B prospecting, powered by MarketJoy’s proven expertise.",
    button: { label: "Get in touch today to start your transformation", href: BOOK },
  },
  faqTitle: "Frequently Asked Questions",
};
