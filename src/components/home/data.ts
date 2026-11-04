import { PUBLISHED_FAQS } from "@/content/faqs/loader";
const MJ = "";
export const LIVE = "https://marketjoy.com";
const UP = `${LIVE}/wp-content/uploads`;

// Logo files live in /public. Colour version for light surfaces, white version for dark surfaces.
export const LOGO_URL = "/marketjoy-logo.png";
export const LOGO_WHITE_URL = "/marketjoy-logo-white.png";
export const BOOK_URL =
  "https://meetings.hubspot.com/curtis-bendt/inbound-round-robin-for-discovery-calls";
export const FREE_Q4_URL =
  "https://meetings.hubspot.com/curtis-bendt/data-building-only-meeting-link";

export type NavLeaf = { label: string; href: string };
export type NavItem = NavLeaf & { children?: NavLeaf[] };
export type NavGroup = { label: string; items: NavItem[] };

const MFG = `${MJ}/industries/manufacturing-lead-generation`;
const CON = `${MJ}/construction-lead-generation`;
const CHEM = `${MJ}/industries/chemical-lead-generation`;

export const NAV: NavGroup[] = [
  {
    label: "Products",
    items: [
      { label: "InfoJoy", href: `${MJ}/products/infojoy/` },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "B2B Lead Generation", href: `${MJ}/b2b-lead-generation-services/` },
      { label: "Sales Facilitation", href: `${MJ}/salesfacilitation/` },
      { label: "List Building", href: `${MJ}/b2b-list-building-services/` },
      { label: "Digital Marketing", href: `${MJ}/digital-marketing/` },
      { label: "AI SEO Services", href: `${MJ}/ai-seo-services/` },
      { label: "Answer Engine Optimization", href: `${MJ}/answer-engine-optimization-services/` },
      {
        label: "Generative Engine Optimization",
        href: `${MJ}/generative-engine-optimization-services/`,
      },
      { label: "Omnichannel Marketing", href: `${MJ}/omnichannel-marketing-services/` },
      { label: "Appointment Generation Setting", href: `${MJ}/appointment-generation-setting/` },
      { label: "Outbound SDR Services", href: `${MJ}/outbound-sdr-services/` },
      {
        label: "Finance & Accounting Outsourcing",
        href: `${MJ}/finance-and-accounting-outsourcing-services/`,
      },
    ],
  },
  {
    label: "Industries",
    items: [
      {
        label: "Business | Consulting",
        href: `${MJ}/industries/business-consulting-lead-generation/`,
      },
      { label: "Utilities", href: `${MJ}/industries/utilities-lead-generation/` },
      { label: "E-commerce", href: `${MJ}/industries/e-commerce-online-retail-lead-generation/` },
      { label: "Finance | Fintech", href: `${MJ}/industries/fintech-lead-generation/` },
      {
        label: "High Tech | Software",
        href: `${MJ}/industries/high-tech-and-software-lead-generation/`,
      },
      {
        label: "Medical | Healthcare",
        href: `${MJ}/industries/medical-healthcare-lead-generation/`,
      },
      {
        label: "Manufacturing",
        href: `${MFG}/`,
        children: [
          { label: "Chemical & Materials Manufacturing", href: `${MFG}/chemical-and-materials/` },
          { label: "Consumer Goods & Electronics", href: `${MFG}/consumer-goods-electronics/` },
          { label: "Contract & Custom Manufacturing", href: `${MFG}/contract-custom/` },
          {
            label: "Energy & Environmental Manufacturing",
            href: `${MFG}/energy-and-environmental/`,
          },
          {
            label: "High-Tech & Precision Manufacturing",
            href: `${MFG}/high-tech-precision-manufacturing/`,
          },
          {
            label: "Industrial & Heavy Manufacturing",
            href: `${MFG}/industrial-heavy-manufacturing/`,
          },
          { label: "Food & Beverage Manufacturers", href: `${MFG}/food-beverage-manufacturers/` },
        ],
      },
      {
        label: "Construction",
        href: `${CON}/`,
        children: [
          { label: "Roofing Business", href: `${CON}/roofing/` },
          { label: "Flooring Business", href: `${CON}/flooring/` },
          { label: "Architecture Business", href: `${CON}/architecture/` },
          { label: "Paving Business", href: `${CON}/paving-lead-generation-services/` },
          { label: "Painting Business", href: `${CON}/painting-business/` },
          { label: "HVAC Business", href: `${CON}/hvac-lead-generation/` },
        ],
      },
      {
        label: "Environmental | Facilities",
        href: `${MJ}/industries/environmental-and-facilities-lead-generation/`,
      },
      {
        label: "Manufacturing Suppliers",
        href: `${MJ}/industries/manufacturing-suppliers-lead-generation/`,
      },
      {
        label: "Logistics | Supply Chain",
        href: `${MJ}/industries/shipping-and-supply-chain-logistics-lead-generation/`,
      },
      { label: "Food & Beverages", href: `${MJ}/industries/food-and-beverages-lead-generation/` },
      {
        label: "Chemicals",
        href: `${CHEM}/`,
        children: [
          { label: "Basic & Commodity Chemical Companies", href: `${CHEM}/basic-and-commodity/` },
          {
            label: "Green & Sustainable Chemical Companies",
            href: `${CHEM}/green-sustainable-chemical-companies/`,
          },
          {
            label: "Industrial Chemical Companies",
            href: `${CHEM}/industrial-chemical-companies/`,
          },
          {
            label: "Pharmaceutical & Life Science Chemicals",
            href: `${CHEM}/pharmaceutical-life-science/`,
          },
          { label: "Specialty Chemical Companies", href: `${CHEM}/specialty-chemical-companies/` },
        ],
      },
      {
        label: "Industrial Automation",
        href: `${MJ}/industries/industrial-automation-lead-generation/`,
      },
      { label: "Renewable Energy", href: `${MJ}/industries/renewable-energy-lead-generation/` },
    ],
  },
  {
    label: "Success Stories",
    items: [
      { label: "Client Reviews", href: `${MJ}/client-reviews/` },
      { label: "Case Studies", href: `${MJ}/case-studies/` },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Contact Us", href: `${MJ}/contact-us/` },
      { label: "Blog", href: `${MJ}/blog/` },
      { label: "FAQs", href: `${MJ}/faqs/` },
      { label: "Press Releases", href: `${MJ}/press-release/` },
      { label: "Industry News", href: `${MJ}/industry-news/` },
      { label: "JoyPedia", href: `${MJ}/joypedia/` },
      { label: "B2B Platforms", href: `${MJ}/b2b-sales-marketing-lead-generation-vendors/` },
    ],
  },
];
export const ALL_INDUSTRIES: NavItem[] = NAV.find((g) => g.label === "Industries")?.items ?? [];

export const ABOUT_URL = `${MJ}/about/`;

export const CLIENT_LOGOS = [
  { name: "Hitachi", src: `${UP}/2024/02/Hitachi-Logo.png` },
  { name: "Western Union", src: `${UP}/2025/07/westernunion.png` },
  { name: "Peet's Coffee", src: `${UP}/2024/02/Peets-Coffee-Logo.png` },
  { name: "110 Metalworks", src: `${UP}/2024/02/110-Metalworks-Logo.png` },
  { name: "Spacelabs Healthcare", src: `${UP}/2024/02/Spacelabs-Healthcare-Logo.png` },
  { name: "Certara", src: `${UP}/2024/06/Certara-Logo.png` },
  { name: "Client", src: `${UP}/2023/10/Group-33924.svg` },
  { name: "Client", src: `${UP}/2023/10/Group-33908.svg` },
  { name: "Client", src: `${UP}/2023/10/Group-33994.svg` },
  { name: "Client", src: `${UP}/2023/10/Group-33916.svg` },
];

export const SERVICES = [
  {
    key: "lead",
    title: "AI Driven Lead Generation",
    desc: "We use AI to identify and prioritize your ideal accounts and buyers, so you get high-quality leads, faster.",
    href: `${MJ}/b2b-lead-generation-services/`,
  },
  {
    key: "sales",
    title: "Strategic Campaign Management",
    desc: "We build and manage multi-channel campaigns with the right message, creative and timing — continuously optimizing for better results.",
    href: `${MJ}/salesfacilitation/`,
  },
  {
    key: "list",
    title: "Data Curation",
    desc: "We research and enrich your target accounts and contacts with accurate, up-to-date firmographic and technographic data.",
    href: `${MJ}/b2b-list-building-services/`,
  },
  {
    key: "digital",
    title: "Digital Marketing",
    desc: "We amplify your message with targeted content, SEO, and paid media to increase visibility, build credibility and drive inbound interest.",
    href: `${MJ}/digital-marketing/`,
  },
  {
    key: "appt",
    title: "Appointment Setting",
    desc: "We connect you with qualified prospects and schedule meetings with your ideal buyers — so your team can focus on closing.",
    href: `${MJ}/appointment-generation-setting/`,
  },
  {
    key: "sdr",
    title: "Human SDR",
    desc: "Our experienced SDRs handle outreach, follow up and engage prospects with a personalized approach that starts real conversations.",
    href: `${MJ}/outbound-sdr-services/`,
  },
] as const;

export const INDUSTRIES = [
  {
    title: "Manufacturing",
    img: `${UP}/2025/08/Manufacturing.webp`,
    href: `${MJ}/industries/manufacturing-lead-generation/`,
  },
  {
    title: "Consulting",
    img: `${UP}/2025/08/Consulting-.webp`,
    href: `${MJ}/industries/business-consulting-lead-generation/`,
  },
  {
    title: "Healthcare & Life Sciences",
    img: `${UP}/2025/08/Healthcare-Life-Sciences.webp`,
    href: `${MJ}/industries/medical-healthcare-lead-generation/`,
  },
  {
    title: "Financial Services",
    img: `${UP}/2025/08/Financial-Services-.webp`,
    href: `${MJ}/industries/fintech-lead-generation/`,
  },
  {
    title: "Logistics",
    img: `${UP}/2025/08/Logistics.webp`,
    href: `${MJ}/industries/shipping-and-supply-chain-logistics-lead-generation/`,
  },
  {
    title: "IT Software & Tech",
    img: `${UP}/2025/08/IT-Software-Tech-.webp`,
    href: `${MJ}/industries/high-tech-and-software-lead-generation/`,
  },
];

export const PRODUCTS = [
  {
    key: "infojoy",
    title: "InfoJoy",
    desc: "The AI-Powered GTM engine, powered by 310M+ B2B profiles, to find and reach real decision-makers.",
    href: `${MJ}/products/infojoy/`,
  },
] as const;

export const FEATURES = [
  {
    key: "team",
    title: "Your Dedicated Growth Team",
    desc: "GTM Engineer, Customer Success Manager (CSM), Email and Calling SDRs, Content Writer and Script Developers, Technical Operations and Delivery Experts",
  },
  {
    key: "launch",
    title: "Go Live in Just 15 Days",
    desc: "From kickoff to outreach in as little as 15 business days. No delays.",
  },
  {
    key: "review",
    title: "Bi-Weekly Strategy Reviews",
    desc: "Live performance reviews, insight-driven adjustments and updated tactics.",
  },
  {
    key: "guarantee",
    title: "100% SQL Guarantee",
    desc: "If results don't meet agreed expectations, we continue at no cost.",
  },
] as const;

export const STORIES = [
  {
    industry: "Manufacturing",
    client: "Busch Vacuum",
    title: "159 Quality Leads in Just 8 Months",
    metric: "159",
    metricLabel: "quality leads",
    href: "https://marketjoy.com/case-studies/transforming-the-lead-generation-game/",
  },
  {
    industry: "Software",
    client: "Publicity.ai",
    title: "2 Major Deals Closed in Just 2 Months",
    metric: "2",
    metricLabel: "closed deals",
    href: "https://marketjoy.com/case-studies/unleashing-the-power-of-lead-generation/",
  },
  {
    industry: "Finance",
    client: "Tiger Payment Solutions",
    title: "48 Leads in 5 Months",
    metric: "48",
    metricLabel: "leads",
    href: "https://marketjoy.com/case-studies/48-leads-in-5-months-how-marketjoy-helped-tiger-payment-solutions-grow/",
  },
];

export const TESTIMONIALS = [
  {
    videoId: "vCWkzGcsInM",
    name: "Mark A. Kaiser",
    role: "President & CEO, Lindquist Machine Corporation",
  },
  {
    videoId: "Mgsebe2u3NA",
    name: "Jason Labriola",
    role: "Head of Sales, Publicity.ai",
  },
  {
    videoId: "UcyAuAPP3dA",
    name: "David Dulany & Harland Pond",
    role: "Founder/CEO, Tenbound · Vice President Sales, Busch LLC",
  },
];

export const FAQ_CATEGORIES = ["Basics", "Strategy", "Working with MarketJoy"] as const;
/** Generated from src/content/faqs/faqs.json (only items that have an answer). */
export const FAQS = PUBLISHED_FAQS;

export const FOOTER = {
  services: (NAV[1]?.items ?? []).filter((i) =>
    [
      "B2B Lead Generation",
      "Sales Facilitation",
      "List Building",
      "Digital Marketing",
      "Appointment Generation Setting",
      "Outbound SDR Services",
    ].includes(i.label),
  ),
  products: NAV[0]?.items ?? [],
  industries: NAV[2]?.items ?? [],
  resources: [
    { label: "About Us", href: ABOUT_URL },
    { label: "Contact Us", href: `${MJ}/contact-us/` },
    { label: "Blog", href: `${MJ}/blog/` },
    { label: "FAQs", href: `${MJ}/faqs/` },
    { label: "JoyPedia", href: `${MJ}/joypedia/` },
    { label: "MarketJoy Vendors", href: `${MJ}/b2b-sales-marketing-lead-generation-vendors/` },
    { label: "Client Reviews", href: `${MJ}/client-reviews/` },
    { label: "Case Studies", href: `${MJ}/case-studies/` },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/marketjoy-inc./" },
    { label: "YouTube", href: "https://www.youtube.com/@MarketJoy" },
    { label: "Facebook", href: "https://www.facebook.com/marketjoy" },
  ],
  privacy: `${MJ}/privacy-policy/`,
};

export const PILLARS = [
  { key: "guarantee", title: "100% Lead Guarantee" },
  { key: "team", title: "Team of up to six people" },
  { key: "setup", title: "No Setup Fees Ever" },
] as const;

export const ONBOARDING = [
  "Assigned Growth Team: GTM Engineer, CSM, Strategist & Tech Ops",
  "GTM Tool Setup",
  "Domain Infrastructure",
  "Launch Checklist & QA Review",
  "No Setup Fees",
];

export const TEAM_ROLES = [
  "GTM Engineer",
  "Customer Success Manager (CSM)",
  "Email and Calling SDRs",
  "Content Writer and Script Developers",
  "Technical Operations and Delivery Experts",
];

export const BUNDLE = [
  {
    key: "targeting",
    title: "AI-Powered Targeting & Data",
    desc: "We use AI to identify your ideal accounts and buyers, build enriched data, and surface real-time intent signals so you're always focused on the right people.",
  },
  {
    key: "managed",
    title: "AI GTM Managed Services",
    desc: "Our team of GTM specialists runs multi-channel campaigns — powered by AI and human intelligence — across email, phone, LinkedIn and more. You get a dedicated team, proven playbooks and continuous optimization.",
  },
  {
    key: "insights",
    title: "Real-Time Insights & Optimization",
    desc: "We monitor engagement, track pipeline impact and adjust in real time to improve performance, increase conversion rates and maximize your ROI.",
  },
  {
    key: "guarantee",
    title: "Performance Guarantee",
    desc: "We're confident in our process, so we guarantee results. If we don't hit your agreed-upon lead goals, we'll extend services at no additional cost — or end the contract if we still miss the mark.",
  },
  {
    key: "partner",
    title: "Your Growth Partner",
    desc: "You get a dedicated team including a GTM Engineer, Customer Success Manager (CSM), Email and Calling SDRs, Content Writer and Script Developers, Technical Operations and Delivery Experts all focused on your success, from strategy to execution.",
  },
] as const;

export const RECOGNITION = [
  {
    name: "DesignRush",
    src: `${UP}/2025/09/designrush.png`,
  },
  {
    name: "HubSpot",
    src: `${UP}/2025/09/hubspot.png`,
  },
  {
    name: "Best B2B Company",
    src: `${UP}/2025/09/best-b2b-company.png`,
  },
  {
    name: "Clutch",
    src: `${UP}/2025/09/clutch-1024x728.png`,
  },
  {
    name: "G2",
    src: `${UP}/2025/09/G2.png`,
  },
];

export const BLOGS = [
  {
    title: "How to Close a Sales Deal: 9 Proven Strategies for B2B Sales Teams",
    href: "/blog/how-to-close-a-sales-deal/",
  },
  {
    title: "How to Generate Sales Leads That Actually Convert Into B2B Opportunities",
    href: "/blog/how-to-generate-sales-leads/",
  },
  {
    title:
      "Outsourced SDR Services for Logistics Companies: How to Build a Predictable Sales Pipeline",
    href: "/blog/outsourced-sdr-services-logistics-companies/",
  },
];
