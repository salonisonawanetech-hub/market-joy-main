const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function splitTopLevelElements(html: string): string[] {
  const elements: string[] = [];
  const tokenPattern = /<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi;
  let depth = 0;
  let start = -1;

  for (const match of html.matchAll(tokenPattern)) {
    const token = match[0];
    if (token.startsWith("<!--")) continue;

    const closing = /^<\//.test(token);
    const name = token.match(/^<\/?([a-z]+)/i)?.[1]?.toLowerCase();
    if (!name) continue;

    if (closing) {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        elements.push(html.slice(start, match.index! + token.length));
        start = -1;
      }
    } else if (depth === 0) {
      start = match.index!;
      if (VOID_ELEMENTS.has(name) || /\/>$/.test(token)) {
        elements.push(token);
        start = -1;
      } else {
        depth = 1;
      }
    } else if (!VOID_ELEMENTS.has(name) && !/\/>$/.test(token)) {
      depth += 1;
    }
  }

  if (start !== -1) elements.push(html.slice(start));
  return elements;
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function wrap(tag: string, className: string, content: string): string {
  return `<${tag} class="${className}">${content}</${tag}>`;
}

function groupImageChunks(elements: string[]): string[] {
  const chunks: string[] = [];
  let card: string[] = [];

  for (const element of elements) {
    if (/<img\b/i.test(element) && card.length > 0) {
      chunks.push(card.join(""));
      card = [];
    }
    card.push(element);
  }
  if (card.length > 0) chunks.push(card.join(""));
  return chunks;
}

function groupImageContent(elements: string[], className: string): string {
  return groupImageChunks(elements)
    .map((content) => wrap("div", className, content))
    .join("");
}

function statCard(content: string, index: number): string {
  const icon = [
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20"/><circle cx="9.5" cy="7.5" r="3.5"/><path d="M17 11a3.5 3.5 0 1 0-1.2-6.8M17 15h.6a3.4 3.4 0 0 1 3.4 3.4V20"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17.5h8"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M16 3v4M8 3v4M3.5 10h17M8 14h3m-3 3h7"/></svg>',
  ][index];
  const textContent = content.replace(/<img\b[^>]*>/i, "");

  return wrap(
    "div",
    "b2b-stat-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
    `${wrap("div", "b2b-stat-content", textContent)}${wrap("span", "b2b-stat-icon", icon ?? "")}`,
  );
}

function heroContent(elements: string[]): string {
  const eyebrow = elements.find((element) => /^<p\b/i.test(element));
  const intro = elements.find((element) => /^<p\b/i.test(element) && element !== eyebrow);
  const contactLink = elements.find((element) => /<a\b[^>]*href="\/contact-us\/"/i.test(element));

  if (!eyebrow || !intro || !contactLink) return elements.join("");

  return `${wrap("div", "b2b-hero-copy", `${eyebrow}${intro}`)}${wrap("div", "b2b-hero-action", contactLink)}`;
}

function comparisonTable(elements: string[]): string {
  const [agencyHeading = "", marketJoyHeading = "", ...rawPointChunks] = groupImageChunks(elements);
  const pointChunks = rawPointChunks.map((chunk) =>
    chunk.replace(/<strong>\s*CORE CAPABILITIES\s*<\/strong>/i, ""),
  );
  const rows: string[] = [];

  for (let index = 0; index < pointChunks.length; index += 2) {
    const wrong = pointChunks[index] ?? "";
    const right = pointChunks[index + 1] ?? "";
    rows.push(`<tr><td>${wrong}</td><td>${right}</td></tr>`);
  }

  return `<div class="b2b-comparison-table-wrap" role="region" aria-label="Agency versus MarketJoy lead generation comparison" tabindex="0"><table class="b2b-comparison-table"><thead><tr><th scope="col">${agencyHeading}</th><th scope="col">${marketJoyHeading}</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function onboardingContent(elements: string[]): string {
  const intro = elements.find((element) => /^<p\b/i.test(element));
  const heading = elements.find((element) => /^<h2\b/i.test(element));
  const body = elements.find((element) => /^<p\b/i.test(element) && element !== intro);
  if (!intro || !heading || !body) return elements.join("");

  const text = plainText(body)
    .replace(/\s+SOCIAL PROOF\s*&\s*TESTIMONIALS\s*$/i, "")
    .trim();
  const firstStep = text.indexOf("01 ");
  if (firstStep < 0) return elements.join("");

  const introduction = text.slice(0, firstStep).trim();
  const stepsText = text.slice(firstStep);
  const starts = [...stepsText.matchAll(/\b0[1-5]\s/g)];
  const stepDetails = [
    { date: "Days 1–3", title: "ICP & Value Proposition Alignment.", description: "We analyse" },
    { date: "Days 4–7", title: "Tech Setup & Domain Deliverability", description: "We configure" },
    { date: "Days 8–11", title: "List Curation & Copywriting", description: "Our data team" },
    { date: "Days 12–14", title: "Client Playbook Review", description: "You review" },
    {
      date: "Day 15 & Beyond",
      title: "Go-Live & Pipeline Delivery.",
      description: "Campaigns launch.",
    },
  ];

  const cards = stepDetails.map((details, index) => {
    const start = starts[index]?.index;
    if (start === undefined) return "";
    const contentStart = start + (stepsText.slice(start).match(/^0[1-5]\s/)?.[0].length ?? 0);
    const end = starts[index + 1]?.index ?? stepsText.length;
    const content = stepsText.slice(contentStart, end).trim();
    const dateStart = content.indexOf(details.date);
    const descriptionStart = content.indexOf(details.description);
    if (dateStart < 0 || descriptionStart < dateStart) return "";

    const title = content.slice(dateStart + details.date.length, descriptionStart).trim();
    const description = content.slice(descriptionStart).trim();
    return `<article class="b2b-onboarding-card"><span class="b2b-onboarding-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><p class="b2b-onboarding-date">${details.date}</p><h3>${title}</h3><p>${description}</p></article>`;
  });

  if (cards.some((card) => !card)) return elements.join("");

  return `<div class="b2b-onboarding-intro">${intro}${heading}<p>${introduction}</p></div><div class="b2b-onboarding-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">${cards.join("")}</div>`;
}

function section(
  name: string,
  classes: string,
  elements: string[],
  content: (elements: string[]) => string = (items) => items.join(""),
): string {
  return wrap("section", `b2b-section b2b-section-${name} ${classes}`, content(elements));
}

function capabilityCard(content: string): string {
  const text = plainText(content);
  const icon = text.includes("Buyer Intent")
    ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.8" cy="10.8" r="6.8"/><circle cx="10.8" cy="10.8" r="2.6"/><path d="m16 16 4.5 4.5"/></svg>'
    : text.includes("Multi-Channel")
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="m10.9 6.9-4.8 9m6.9-9 4.8 9M7.2 18h9.6"/></svg>'
      : text.includes("Rigorous Lead")
        ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8 19 5.7v5.1c0 4.8-2.9 8.3-7 10.4-4.1-2.1-7-5.6-7-10.4V5.7z"/><path d="m8.7 12.1 2.2 2.2 4.5-4.7"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8 19 5.7v5.1c0 4.8-2.9 8.3-7 10.4-4.1-2.1-7-5.6-7-10.4V5.7z"/><path d="M9 12h6m-3-3v6"/></svg>';

  return wrap(
    "div",
    "b2b-capability-card",
    `${wrap("span", "b2b-capability-icon", icon)}${content}`,
  );
}

export function layoutB2BServiceHtml(html: string): string {
  const elements = splitTopLevelElements(html);
  const findStart = (predicate: (element: string, text: string) => boolean, from = 0) =>
    elements.findIndex((element, index) => index >= from && predicate(element, plainText(element)));

  const statsStart = findStart((element) => /Trusted-by-500-B2B\.png/i.test(element));
  const comparisonStart = findStart((_, text) => text.startsWith("THE OUTBOUND PROBLEM"));
  const capabilitiesStart = findStart((_, text) =>
    text.startsWith("Full-Stack B2B Lead Generation Engineered"),
  );
  const onboardingStart = findStart((_, text) => text.startsWith("15-DAY ONBOARDING SPRINT"));
  const resultsStart = findStart((_, text) => text.startsWith("Proven Results"));
  const faqStart = findStart((_, text) => text.startsWith("Frequently Asked Questions"));
  const ctaStart = findStart((_, text) => text.startsWith("Ready to Fill Your Sales Calendar"));

  const boundaries = [
    0,
    statsStart,
    comparisonStart,
    capabilitiesStart,
    onboardingStart,
    resultsStart,
    faqStart,
    ctaStart,
    elements.length,
  ];

  if (
    boundaries.some(
      (boundary, index) => boundary < 0 || (index > 0 && boundary < (boundaries[index - 1] ?? 0)),
    )
  ) {
    return html;
  }

  const groups = boundaries
    .slice(0, -1)
    .map((start, index) => elements.slice(start, boundaries[index + 1]));
  const [
    hero = [],
    stats = [],
    comparison = [],
    capabilities = [],
    onboarding = [],
    results = [],
    faq = [],
    cta = [],
  ] = groups;

  const comparisonGridStart = comparison.findIndex((element) => /<img\b/i.test(element));
  const comparisonIntro = comparison.slice(0, comparisonGridStart);
  const comparisonCards = comparison.slice(comparisonGridStart);
  const capabilityCardsStart = capabilities.findIndex((element) =>
    plainText(element).includes("Buyer Intent & Custom ICP Mapping"),
  );
  const capabilityIntro = capabilities.slice(0, capabilityCardsStart);
  const capabilityElements = capabilities.slice(capabilityCardsStart);
  const capabilityHeading = capabilityIntro.filter((element) => /^<h2\b/i.test(element)).join("");
  const capabilityDescription = capabilityIntro
    .filter((element) => /^<p\b/i.test(element))
    .map((element) => element.replace(/^<p\b[^>]*>|<\/p>$/gi, ""))
    .join(" ");
  const capabilityIntroBlock = wrap(
    "div",
    "b2b-capability-intro",
    `<p class="b2b-section-eyebrow">CORE CAPABILITIES</p>${capabilityHeading}${capabilityDescription ? `<p>${capabilityDescription}</p>` : ""}`,
  );
  const capabilityCards: string[] = [];
  let currentCapability: string[] = [];
  const capabilityTitles = [
    "Buyer Intent & Custom ICP Mapping",
    "Multi-Channel Outbound Execution",
    "Rigorous Lead Qualification",
    "Technical Infrastructure & Deliverability",
  ];
  let capabilityVisual = "";

  for (const element of capabilityElements) {
    const text = plainText(element);
    if (capabilityTitles.some((title) => text.includes(title)) && currentCapability.length > 0) {
      capabilityCards.push(capabilityCard(currentCapability.join("")));
      currentCapability = [];
    }
    if (/<img\b/i.test(element) && currentCapability.length > 0) {
      capabilityCards.push(capabilityCard(currentCapability.join("")));
      currentCapability = [];
      capabilityVisual = element;
      continue;
    }
    currentCapability.push(element);
  }
  if (currentCapability.length > 0)
    capabilityCards.push(capabilityCard(currentCapability.join("")));

  const resultsCardsStart = results.findIndex((element) => /<img\b/i.test(element));
  const output = [
    section(
      "hero",
      "grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto]",
      hero,
      heroContent,
    ),
    section("stats", "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", stats, (items) =>
      groupImageChunks(items)
        .map((content, index) => statCard(content, index))
        .join(""),
    ),
    section(
      "comparison",
      "grid grid-cols-1 gap-5",
      comparison,
      () => comparisonIntro.join("") + comparisonTable(comparisonCards),
    ),
    section(
      "capabilities",
      "grid grid-cols-1 gap-5",
      capabilities,
      () =>
        capabilityIntroBlock +
        wrap(
          "div",
          "b2b-capability-layout grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]",
          wrap(
            "div",
            "b2b-capability-grid grid grid-cols-1 gap-4 sm:grid-cols-2",
            capabilityCards.join(""),
          ) + (capabilityVisual ? wrap("div", "b2b-capability-visual", capabilityVisual) : ""),
        ),
    ),
    section("onboarding", "grid grid-cols-1 gap-5", onboarding, onboardingContent),
    section(
      "results",
      "grid grid-cols-1 gap-5",
      results,
      (items) =>
        items.slice(0, resultsCardsStart).join("") +
        wrap(
          "div",
          "b2b-results-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
          groupImageContent(items.slice(resultsCardsStart), "b2b-result-card"),
        ),
    ),
    section("faq", "grid grid-cols-1 gap-4 md:grid-cols-2", faq),
    section("cta", "grid grid-cols-1 gap-4", cta),
  ];

  return output.join("");
}
