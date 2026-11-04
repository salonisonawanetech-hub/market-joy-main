/**
 * About page + team member content, migrated from marketjoy.com (WordPress export 2026-10-27, page "about" and "curtis-bendt").
 * Text is kept as on the old site. Images use /wp-content/... paths: served from /public once copied
 * (node scripts/fetch-wp-images.mjs migration/about-images.csv), otherwise they fall back to marketjoy.com.
 */
const UP = "/wp-content/uploads";

export const ABOUT_SEO = {
  title: "About MarketJoy | Experts in B2B Growth and Sales Success",
  description:
    "MarketJoy helps businesses grow and succeed in sales. We provide personalized strategies to help you reach your goals.",
  ogImage: "https://marketjoy.com/wp-content/uploads/2025/02/MarketJoy-Brand-Signature-1.png",
} as const;

export const ABOUT_HERO = {
  title: "Empowering Businesses With Predictable, Scalable Growth",
  intro:
    "At MarketJoy, we believe that sustainable growth is not built on guesswork, it’s built on strategy, consistency, and meaningful conversations with the right decision-makers. For over 10 years, we’ve supported companies across industries by helping them break through growth barriers, strengthen their sales pipelines, and build predictable revenue engines.",
  purposeLead: "Our purpose is clear:",
  purpose: "Help businesses achieve results faster, with less effort, and more clarity.",
  purposeBody:
    "Whether you’re a growing startup or an enterprise-level brand, we deliver systems that bring you high-quality opportunities every single month, so your team can focus on closing, not chasing.",
  cta: "Get Qualified Leads Now",
  /** Hero background (full-bleed, white text on top) */
  bg: `${UP}/2025/12/about-us-banner-1.png`,
};

export const ABOUT_SERVICES = {
  title: "Our Services",
  intro:
    "Our process is straightforward, strategic, and built for results. After our initial consultation, our sales strategist consolidates the key insights from our discussion and collaborates with our internal team to begin shaping your outreach plan. From there, we create a sample database for your review and outline the recommended approach for engaging your target audience. Once we walk you through the strategy and align in direction, we prepare a detailed proposal for your approval.",
  items: [
    {
      title: "Lead Generation Services",
      body: "We deliver a proven lead generation framework that drives real outcomes. Our process is designed to consistently fill your sales pipeline with high-quality, relevant, and sales-ready leads, giving your team more time to focus on closing deals.",
      image: `${UP}/2026/01/Mask-group-7.png`,
      alt: "Lead generation services",
      href: "/b2b-lead-generation-services/",
    },
    {
      title: "Sales Facilitation",
      body: "We help optimize and streamline your sales operations by enhancing workflows, improving lead routing, and implementing smart automations and AI-driven efficiencies. The result is a more productive pipeline and a smoother journey from prospect to customer.",
      image: `${UP}/2026/01/Mask-group-8.png`,
      alt: "Sales facilitation",
      href: "/salesfacilitation/",
    },
    {
      title: "InfoJoy SAAS",
      body: "Through our InfoJoy platform, we track buyer intent signals and generate rich, actionable data. This increases the odds of a fast decision. This also empowers your team with the intelligence needed to refine strategies, improve engagement, and make confident, data-backed decisions.",
      image: `${UP}/2026/01/10155.jpg`,
      alt: "InfoJoy SaaS platform",
      href: "/products/infojoy/",
    },
  ],
};

export const ABOUT_MISSION = {
  eyebrow: "Our Mission",
  title: "Your Growth, Simplified",
  body: [
    "We exist to eliminate the challenges businesses face in scaling outreach, managing prospecting, and generating qualified leads. Instead of internal teams struggling to build pipelines, MarketJoy gives you a dedicated system that works consistently, powered by research, technology, and human expertise.",
    "Our mission is to provide predictability, confidence, and control over revenue growth.",
  ],
  /** Section background artwork (centered, behind the text) */
  bg: `${UP}/2025/12/our-mission.png`,
};

export const ABOUT_WHAT_WE_DO = {
  eyebrow: "What We Do",
  title: "Turning Prospects Into Revenue",
  tabs: [
    {
      label: "Research-Driven Strategic Planning",
      icon: `${UP}/2025/12/growth-1.png`,
      heading: "Before any outreach begins, we dive deep into your business landscape:",
      points: [
        "Understanding your buyer personas",
        "Analyzing your industry and competitors",
        "Designing a roadmap that speaks to your goals",
        "Identifying high-value opportunities",
      ],
      note: "Our strategies are not templates; they are custom-built for your market, your message, and your mission.",
    },
    {
      label: "High-Precision Prospecting & Database Building",
      icon: `${UP}/2025/12/database-storage.png`,
      heading: "Accurate data is the foundation of successful outreach. Our research specialists:",
      points: [
        "Identify key decision-makers",
        "Validate contact details",
        "Build segmented lists customized for your ICP",
        "Ensure every prospect is relevant and ready for engagement",
        "Utilize AI-driven Buyer Intent signals to maximize conversion",
      ],
      note: "This eliminates wasted outreach and improves response rates significantly.",
    },
    {
      label: "Personalized Multi-Channel Engagement",
      icon: `${UP}/2025/12/3.png`,
      heading: "We blend human connection with smart automation to reach your prospects through:",
      points: [
        "Targeted email sequences",
        "Personalized calling campaigns",
        "Social and digital channels",
        "Follow-up frameworks designed to nurture interest",
      ],
      note: "Each touchpoint is crafted to spark a conversation, not just deliver a message.",
    },
    {
      label: "Appointment Setting & Opportunity Creation",
      icon: `${UP}/2025/12/dart.png`,
      heading: "Deliver sales-ready meetings that your team can confidently close.",
      lead: "We handle everything:",
      points: [
        "Initial outreach",
        "Follow-ups",
        "Prospect nurturing",
        "Qualification",
        "Scheduling meetings directly on your calendar",
      ],
      note: "This ensures your sales team always has a steady stream of warm, engaged prospects.",
    },
    {
      label: "Performance Monitoring & Continuous Optimization",
      icon: `${UP}/2025/12/1.png`,
      heading: "Growth is not a one-time event; it’s a process.",
      lead: "We constantly refine messaging, targeting, cadence, and strategy based on real-time results. You get complete visibility through:",
      points: [
        "Transparent reports",
        "Performance dashboards",
        "Strategy reviews",
        "Regular insights to improve ROI",
        "Bi-weekly meetings with your Campaign Support Team",
      ],
      note: "We make sure every campaign improves over time. We are focused on building a stream of predictable revenue opportunities that assist in fortifying, and diversifying, your sales pipeline for ongoing business continuity.",
    },
  ],
} as const;

export const ABOUT_WHY = {
  title: "Why MarketJoy Works",
  items: [
    {
      title: "A Data-Driven Approach to Revenue Growth",
      body: "Every action we take is backed by research, insights, and measurable data — never assumptions.",
      icon: `${UP}/2025/12/Group-1000001747.svg`,
    },
    {
      title: "Human Intelligence + Technology",
      body: "Our experts combine experience, emotional intelligence, and scalable tech tools to deliver unmatched engagement quality.",
      icon: `${UP}/2025/12/Group-1000001749.svg`,
    },
    {
      title: "Consistency You Can Depend On",
      body: "We build processes that deliver predictable results monthly, helping your sales team stay productive and confident.",
      icon: `${UP}/2025/12/Group-1000001748.svg`,
    },
    {
      title: "A Team Dedicated to Your Success",
      body: "Your goals aren’t just part of the project; they guide every decision we make.",
      icon: `${UP}/2025/12/Group-1000001750.svg`,
    },
  ],
};

export const ABOUT_TEAM_GROUPS = {
  eyebrow: "Our Team",
  title: "The People Behind Your Pipeline",
  intro: "MarketJoy brings together a diverse team of experts who understand the science and art of outreach.",
  groups: [
    ["Strategists & Growth Architects", "They build vision, roadmap, and positioning strategies that guide success."],
    ["Research & Data Specialists", "They analyze industries, markets, and decision-makers to craft precise prospect lists."],
    ["Outreach & Engagement Teams", "They create messaging, run campaigns, and turn cold prospects into warm conversations."],
    ["Analysts & Optimization Experts", "They track performance, refine strategies, and ensure every campaign gets better with time."],
    ["Client Success Managers", "Your dedicated partners keep communication clear, transparent, and goal-driven."],
  ] as const,
  outro: "Together, we form a complete revenue engine built around you.",
  /** Section background texture behind the five role cards */
  bg: `${UP}/2025/12/Group-1000001746.png`,
  image: `${UP}/2025/12/banner-image.png`,
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image: string;
  /** Only Curtis Bendt had a profile page on the old site. */
  href?: string;
};

export const TEAM: TeamMember[] = [
  { slug: "jay-singh", name: "Jay Singh", role: "Founder & CEO", image: `${UP}/2023/07/Jay.png` },
  { slug: "roop-singh", name: "Roop Singh", role: "COO", image: `${UP}/2023/07/Roop.png` },
  { slug: "curtis-bendt", name: "Curtis Bendt", role: "Chief Revenue Officer", image: `${UP}/2023/07/Curtis.png`, href: "/curtis-bendt/" },
  { slug: "chris-bowles", name: "Chris Bowles", role: "Senior Growth Advisor", image: `${UP}/2024/02/Chris-Bowles.png` },
  { slug: "rosemin-paroo", name: "Rosemin Paroo", role: "Operations Manager", image: `${UP}/2023/08/Rosemin-Paroo.png` },
];

export const ABOUT_HOW = {
  eyebrow: "How We Work",
  title: "A Seamless Partner in Your Growth",
  intro: "MarketJoy brings together a diverse team of experts who understand the science and art of outreach.",
  steps: [
    ["Discovery & Alignment", "We understand your goals, market, ICP, and challenges."],
    ["Strategic Roadmap Creation", "A clear plan outlining how we’ll reach your ideal customers."],
    ["Prospect Research & Database Development", "Accurate, verified prospect lists tailored to your needs."],
    ["Multi-Channel Outreach Execution", "Personalized campaigns that generate conversations and interest."],
    ["Opportunity Delivery", "We book qualified appointments directly on your calendar."],
    ["Optimization & Insights", "Continuous performance improvement backed by data."],
  ] as const,
};

export const ABOUT_COMMITMENT = {
  title: "Our Commitment to You",
  intro: "When you work with MarketJoy, you don’t just get a service, you gain a partnership that’s built on:",
  points: [
    "Integrity and transparency",
    "A passion for performance",
    "A focus on tangible results",
    "A relationship rooted in trust",
    "A shared goal of predictable growth",
    "Over a decade in the business of helping companies scale sales",
  ],
  outro: "We don’t just want to help you hit your numbers; we want to raise them.",
  image: `${UP}/2025/12/Group-1000001751-1.png`,
};

export const ABOUT_CTA = {
  title: "Let’s Start Building Your Growth Engine",
  lead: "If you're ready to:",
  points: ["Scale your pipeline", "Boost sales productivity", "Reach more decision-makers", "Build a predictable revenue system"],
  outro: "Then MarketJoy is ready to help you grow.",
  button: "Let’s talk, book your strategy session today",
  image: `${UP}/2025/12/Group-1000001752.png`,
  tick: `${UP}/2025/08/tick.svg`,
};

export const CURTIS = {
  slug: "curtis-bendt",
  name: "Curtis Bendt",
  role: "Chief Revenue Officer",
  image: `${UP}/2026/06/Curtis-300x300-1.png`,
  linkedin: "https://www.linkedin.com/in/curtis-bendt-96119b46",
  bio: [
    "Curtis Bendt is the Chief Revenue Officer at MarketJoy, bringing over 35+ years of global experience in lead generation, telesales, and revenue growth. He specializes in building scalable, high-performing sales operations and has successfully managed and optimized call center teams across the United States, Canada, India, the Philippines, Grenada, and the Dominican Republic.",
    "Curtis has deep expertise in designing, launching, and scaling both inbound and outbound call centers, helping businesses improve performance, increase conversions, and achieve sustainable growth. His leadership combines strategic vision with hands-on operational excellence to deliver measurable results.",
    "Connect with Curtis on LinkedIn to discuss lead generation, sales strategy, revenue growth, or building world-class call center operations.",
  ],
  seo: {
    title: "Curtis Bendt | Chief Revenue Officer at MarketJoy",
    description:
      "Curtis Bendt is the Chief Revenue Officer at MarketJoy, with 35+ years of experience in lead generation, telesales, and revenue growth.",
  },
} as const;
