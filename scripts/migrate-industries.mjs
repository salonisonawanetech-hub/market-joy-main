// Usage: node scripts/migrate-industries.mjs [--only <slug-substring>] [--delay 600]
// Scrapes every old-site industry page into src/content/industries/{entries/*.json,index.json}
// and writes public/sitemap-industries.xml + migration/industries-report.json.
import { load } from "cheerio";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = process.env.MJ_ORIGIN || "https://marketjoy.com";
const PATHS = [
  "/industries/business-consulting-lead-generation/",
  "/industries/utilities-lead-generation/",
  "/industries/e-commerce-online-retail-lead-generation/",
  "/industries/fintech-lead-generation/",
  "/industries/high-tech-and-software-lead-generation/",
  "/industries/medical-healthcare-lead-generation/",
  "/industries/manufacturing-lead-generation/",
  "/industries/manufacturing-lead-generation/chemical-and-materials/",
  "/industries/manufacturing-lead-generation/consumer-goods-electronics/",
  "/industries/manufacturing-lead-generation/contract-custom/",
  "/industries/manufacturing-lead-generation/energy-and-environmental/",
  "/industries/manufacturing-lead-generation/high-tech-precision-manufacturing/",
  "/industries/manufacturing-lead-generation/industrial-heavy-manufacturing/",
  "/industries/manufacturing-lead-generation/food-beverage-manufacturers/",
  "/construction-lead-generation/",
  "/construction-lead-generation/roofing/",
  "/construction-lead-generation/flooring/",
  "/construction-lead-generation/architecture/",
  "/construction-lead-generation/paving-lead-generation-services/",
  "/construction-lead-generation/painting-business/",
  "/construction-lead-generation/hvac-lead-generation/",
  "/industries/environmental-and-facilities-lead-generation/",
  "/industries/manufacturing-suppliers-lead-generation/",
  "/industries/shipping-and-supply-chain-logistics-lead-generation/",
  "/industries/food-and-beverages-lead-generation/",
  "/industries/chemical-lead-generation/",
  "/industries/chemical-lead-generation/basic-and-commodity/",
  "/industries/chemical-lead-generation/green-sustainable-chemical-companies/",
  "/industries/chemical-lead-generation/industrial-chemical-companies/",
  "/industries/chemical-lead-generation/pharmaceutical-life-science/",
  "/industries/chemical-lead-generation/specialty-chemical-companies/",
  "/industries/industrial-automation-lead-generation/",
  "/industries/renewable-energy-lead-generation/",
];

const args = process.argv.slice(2);
const arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const only = arg("--only", "");
const delay = Number(arg("--delay", 600));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/content/industries");

const KEEP_ATTR = { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height", "srcset", "sizes", "loading", "decoding"] };
const KEEP_TAGS = new Set(["h1","h2","h3","h4","h5","h6","p","ul","ol","li","a","img","strong","em","b","i","br","blockquote","table","thead","tbody","tr","th","td","figure","figcaption","div","span","section"]);

const toLocal = (u) => (u || "").replace(/^https?:\/\/(www\.)?marketjoy\.com/i, "");
const text = ($el) => $el.text().replace(/\s+/g, " ").trim();

function meta($, sel, attr = "content") {
  return $(sel).first().attr(attr)?.trim() || null;
}

function extractContent($) {
  // Elementor page body; header/footer/popups are separate Elementor templates.
  let $root = $('[data-elementor-type="wp-page"]').first();
  if (!$root.length) $root = $("main, #content, .site-content").first();
  if (!$root.length) $root = $("body");
  $root = $root.clone();
  const dropped = {};
  for (const t of ["svg", "iframe", "video", "form", "button", "input", "select", "textarea"]) {
    const n = $root.find(t).length;
    if (n) dropped[t] = n;
  }
  const bg = ($root.html().match(/background-image/g) || []).length;
  if (bg) dropped["inline background-image"] = bg;
  $root.find("script, style, noscript, svg, form, iframe, nav, header, footer, button, input, select, textarea, .elementor-widget-spacer, .elementor-divider").remove();
  $root.find("[data-elementor-type='popup'], .elementor-popup-modal").remove();
  // Lazy-load images: prefer the real source.
  $root.find("img").each((_, el) => {
    const $i = $root.find(el);
    const real = $i.attr("data-lazy-src") || $i.attr("data-src") || $i.attr("src");
    if (real && !real.startsWith("data:")) $i.attr("src", toLocal(real));
    else $i.remove();
    $i.attr("loading", "lazy").attr("decoding", "async");
  });
  $root.find("a[href]").each((_, el) => {
    const $a = $root.find(el);
    $a.attr("href", toLocal($a.attr("href")));
  });
  // Strip attributes + unwrap non-whitelisted tags, then collapse empty wrappers.
  $root.find("*").each((_, el) => {
    const $e = $root.find(el);
    const tag = el.tagName?.toLowerCase();
    if (!KEEP_TAGS.has(tag)) { $e.replaceWith($e.contents()); return; }
    const allow = KEEP_ATTR[tag] || [];
    for (const a of Object.keys(el.attribs || {})) if (!allow.includes(a)) $e.removeAttr(a);
  });
  for (let i = 0; i < 4; i++) {
    $root.find("div, span, section").each((_, el) => {
      const $e = $root.find(el);
      if (!$e.text().trim() && !$e.find("img").length) $e.remove();
      else if ($e.children().length === 1 && !$e.contents().filter((_, n) => n.type === "text" && n.data.trim()).length) $e.replaceWith($e.contents());
    });
  }
  // Drop a leading H1 identical to the page title (the page hero renders it).
  const $h1 = $root.find("h1").first();
  const h1 = text($h1);
  $h1.remove();
  const images = [...new Set($root.find("img").map((_, el) => $root.find(el).attr("src")).get())];
  const links = [...new Set($root.find("a[href]").map((_, el) => $root.find(el).attr("href")).get())];
  return { html: $root.html().replace(/\n{3,}/g, "\n\n").trim(), h1, images, links, dropped };
}

function extractFaqs($) {
  const out = [];
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const j = JSON.parse($(el).contents().text());
      const nodes = Array.isArray(j) ? j : j["@graph"] || [j];
      for (const n of nodes) {
        if (n["@type"] === "FAQPage") for (const q of n.mainEntity || []) out.push({ q: q.name, a: q.acceptedAnswer?.text || "" });
      }
    } catch {}
  });
  return out;
}

function extractJsonLd($) {
  const keep = [];
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const j = JSON.parse($(el).contents().text());
      const nodes = Array.isArray(j) ? j : j["@graph"] || [j];
      for (const n of nodes) {
        const t = [].concat(n["@type"] || []);
        // WebPage/Organization/BreadcrumbList are generated by the new site; keep page-specific types only.
        if (t.some((x) => ["Service", "Article", "WebPage", "FAQPage"].includes(x)) && !t.includes("FAQPage")) keep.push(n);
      }
    } catch {}
  });
  return keep;
}

async function scrape(p) {
  const url = ORIGIN + p;
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "marketjoy-migration/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const finalPath = new URL(res.url).pathname;
  const $ = load(await res.text());
  const { html, h1, images, links, dropped } = extractContent($);
  const slug = p.replace(/^\/|\/$/g, "").replace(/\//g, "__");
  const faqs = extractFaqs($);
  return {
    slug,
    path: p,
    sourceUrl: url,
    redirectedTo: finalPath !== p ? finalPath : null,
    title: h1 || text($("h1").first()) || meta($, "title", "text"),
    h1,
    seo: {
      title: $("title").first().text().trim() || meta($, 'meta[property="og:title"]'),
      description: meta($, 'meta[name="description"]') || meta($, 'meta[property="og:description"]'),
      canonical: meta($, 'link[rel="canonical"]', "href"),
      robots: meta($, 'meta[name="robots"]'),
      ogType: meta($, 'meta[property="og:type"]'),
      ogImage: toLocal(meta($, 'meta[property="og:image"]') || ""),
      ogImageAlt: meta($, 'meta[property="og:image:alt"]'),
      twitterCard: meta($, 'meta[name="twitter:card"]'),
      published: meta($, 'meta[property="article:published_time"]'),
      modified: meta($, 'meta[property="article:modified_time"]'),
    },
    faqs,
    jsonLd: extractJsonLd($),
    html,
    images: [...new Set([...images, toLocal(meta($, 'meta[property="og:image"]') || "")].filter(Boolean))],
    links,
    dropped,
  };
}

async function downloadImage(local) {
  if (!local.startsWith("/wp-content/")) return "skipped";
  const dest = path.join(ROOT, "public", decodeURI(local.split("?")[0]));
  try { await access(dest); return "exists"; } catch {}
  const res = await fetch(ORIGIN + local, { headers: { "user-agent": "marketjoy-migration/1.0" } });
  if (!res.ok) return `fail ${res.status}`;
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return "downloaded";
}

await mkdir(path.join(OUT, "entries"), { recursive: true });
const list = PATHS.filter((p) => p.includes(only));
const index = [], report = [];
for (const p of list) {
  try {
    const e = await scrape(p);
    await writeFile(path.join(OUT, "entries", `${e.slug}.json`), JSON.stringify(e, null, 1));
    index.push({ slug: e.slug, path: e.path, title: e.title, parent: e.path.split("/").filter(Boolean).length > (e.path.startsWith("/industries") ? 2 : 1) ? "/" + e.path.split("/").filter(Boolean).slice(0, -1).join("/") + "/" : null, description: e.seo.description, ogImage: e.seo.ogImage });
    const imgStatus = {};
    for (const img of e.images) {
      const r = await downloadImage(img).catch((x) => `fail ${x.message}`);
      (imgStatus[r] ||= []).push(img);
    }
    const internal = e.links.filter((l) => l.startsWith("/"));
    report.push({ path: p, ok: true, redirectedTo: e.redirectedTo, htmlChars: e.html.length, faqs: e.faqs.length, hasDescription: !!e.seo.description, hasOgImage: !!e.seo.ogImage, images: Object.fromEntries(Object.entries(imgStatus).map(([k, v]) => [k, v.length])), failedImages: Object.entries(imgStatus).filter(([k]) => k.startsWith("fail")).flatMap(([, v]) => v), internalLinks: internal, externalLinks: e.links.length - internal.length, dropped: e.dropped });
    console.log("ok  ", p, `(${e.html.length} chars, ${e.faqs.length} faq, ${e.images.length} img)`);
  } catch (err) {
    report.push({ path: p, ok: false, error: String(err.message || err) });
    console.error("FAIL", p, err.message);
  }
  await sleep(delay);
}
if (!only) await writeFile(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
await mkdir(path.join(ROOT, "migration"), { recursive: true });
await writeFile(path.join(ROOT, "migration/industries-report.json"), JSON.stringify(report, null, 1));
if (!only) {
  const urls = index.map((i) => `  <url><loc>${ORIGIN}${i.path}</loc></url>`).join("\n");
  await writeFile(path.join(ROOT, "public/sitemap-industries.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log(`\nDone: ${report.filter((r) => r.ok).length}/${list.length} ok. See migration/industries-report.json`);
