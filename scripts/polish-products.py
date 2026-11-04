#!/usr/bin/env python3
"""Polish the migrated /products/ pages (hub, InfoJoy, Buyer Intent, Web Traffic Revealer).

The WordPress/Elementor export left: hard <br> line-wraps inside sentences, orphan text after </p><br>, decorative
"->" paragraphs, duplicated headings, old WordPress slugs in internal links, filename-hash alt text, and a hub page
whose industry grid was split in two. This script fixes those deterministically and is safe to re-run.

    python3 scripts/polish-products.py          # rewrites src/content/services/entries/products*.json in place
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENTRIES = ROOT / "src/content/services/entries"
BLOG = ROOT / "src/data/blog/posts"
BOOK = "https://meetings.hubspot.com/curtis-bendt/inbound-round-robin-for-discovery-calls"

# Old WordPress root-level slugs -> where the page lives on the new site.
LINKS = {
    "/buyer-intent/": "/products/buyer-intent/",
    "/infojoy/": "/products/infojoy/",
}


def fix_links(h: str) -> str:
    def sub(m: re.Match) -> str:
        href = m.group(1)
        if href in LINKS:
            return f'href="{LINKS[href]}"'
        slug = href.strip("/")
        if href.startswith("/") and "/" not in slug and (BLOG / f"{slug}.json").exists():
            return f'href="/blog/{slug}/"'
        return m.group(0)

    return re.sub(r'href="([^"#?]+)"', sub, h)


def clean(h: str) -> str:
    # orphan text left after "</p><br> text" -> merge back into the paragraph
    h = re.sub(r"([^>\s])</p>\s*<br\s*/?>\s*([^<]+?)\s*(?=<|$)", lambda m: f"{m.group(1)} {m.group(2).strip()}</p>", h)
    h = re.sub(r"</(p|h[1-6]|ul|div)>\s*(<br\s*/?>\s*)+", r"</\1>\n", h)  # stray <br> between blocks
    h = re.sub(r"\s*<br\s*/?>\s*", " ", h)  # hard wraps inside sentences
    h = re.sub(r"(<(?:p|h[1-6]|li|summary|strong|b)(?:\s[^>]*)?>)\s+", r"\1", h)
    h = re.sub(r"\s+(</(?:p|h[1-6]|li|summary|strong|b)>)", r"\1", h)
    h = re.sub(r"(<a(?:\s[^>]*)?>)\s+", r"\1", h)
    h = re.sub(r"\s+(</a>)", r"\1", h)
    h = re.sub(r"[ \t ]{2,}", " ", h)
    # text typos introduced by the export (words glued together once the <br> was dropped)
    for a, b in [
        ("complete70%", "complete 70%"),
        ("lead generationexpertise", "lead generation expertise"),
        ("campaigns, reduce wasted", "campaigns, reduce wasted"),
    ]:
        h = h.replace(a, b)
    return h


def must(h: str, old: str, new: str, what: str) -> str:
    if old not in h:
        sys.exit(f"polish-products: expected text not found ({what}): {old[:70]!r}")
    return h.replace(old, new, 1)


def has(h: str, s: str) -> bool:
    return s in h


# ---------------------------------------------------------------- hub
HUB = f"""<h2>MarketJoy Product Suite</h2>
<p>Smarter tools to empower your sales, marketing, and revenue teams. Our intelligent B2B solutions combine buyer intent data, AI-powered insights, and verified contact intelligence to help you connect with decision-makers faster, convert more leads, and grow predictable revenue.</p>
<p><a href="{BOOK}">Contact Us Today</a></p>
<img src="/wp-content/uploads/2025/11/product-banner.png" alt="MarketJoy product suite: buyer intent signals, InfoJoy and Web Traffic Revealer" width="511" height="477" loading="lazy" decoding="async">
<h2>Lead Generation Intelligence Tailored for Modern B2B Teams</h2>
<p>At MarketJoy, we go beyond traditional lead generation: we help you turn data into deals. Our advanced tools are designed to make your pipeline more predictable, measurable, and scalable. Whether you’re identifying new prospects or converting active intent into sales conversations, our products ensure your team stays ahead of the competition.</p>
<h2>Our Products</h2>
<img src="/wp-content/uploads/2025/11/Mask-group.png" alt="Buyer Intent Signals" width="346" height="239" loading="lazy" decoding="async">
<h3><a href="/products/buyer-intent/">Buyer Intent Signals</a></h3>
<p>MarketJoy’s Buyer Intent Signals help you engage prospects before your competitors. <a href="/products/buyer-intent/">Explore Buyer Intent →</a></p>
<img src="/wp-content/uploads/2025/11/Mask-group-1.png" alt="InfoJoy smarter B2B prospecting" width="346" height="239" loading="lazy" decoding="async">
<h3><a href="/products/infojoy/">InfoJoy: Smarter B2B Prospecting</a></h3>
<p>InfoJoy, powered by AI and verified data, transforms how your teams find and qualify leads. <a href="/products/infojoy/">Explore InfoJoy →</a></p>
<img src="/wp-content/uploads/2025/11/Mask-group-2.png" alt="Web Traffic Revealer" width="346" height="239" loading="lazy" decoding="async">
<h3><a href="/products/web-traffic-revealer/">Web Traffic Revealer</a></h3>
<p>Reveal the anonymous visitors on your website and turn them into sales conversations. <a href="/products/web-traffic-revealer/">Explore Web Traffic Revealer →</a></p>
<h2>Built for Predictable Growth</h2>
<p>Our technology solutions work hand-in-hand with MarketJoy’s proven B2B lead generation services. Together, they create a performance-driven ecosystem that powers your sales success from identifying high-intent buyers to nurturing them into long-term customers.</p>
<img src="/wp-content/uploads/2025/11/2149611205-1.png" alt="Industries MarketJoy products and lead generation services support" width="384" height="308" loading="lazy" decoding="async">
<h3>Industries we serve</h3>
<ul>
<li><a href="/industries/medical-healthcare-lead-generation/">Healthcare</a></li>
<li><a href="/industries/fintech-lead-generation/">Financial Services</a></li>
<li><a href="/industries/high-tech-and-software-lead-generation/">IT &amp; Tech</a></li>
<li><a href="/industries/manufacturing-lead-generation/">Manufacturing</a></li>
<li><a href="/industries/business-consulting-lead-generation/">Business Consulting</a></li>
<li><a href="/industries/shipping-and-supply-chain-logistics-lead-generation/">Logistics</a></li>
<li><a href="/digital-marketing/">Marketing &amp; Advertising</a></li>
</ul>
<h2>Stop Guessing. Start Growing.</h2>
<p>Experience the power of intelligent data, AI-driven insights, and proven lead generation expertise. Let’s transform how your business identifies, engages, and converts prospects.</p>
<p><a href="{BOOK}">Book a Demo</a></p>
"""


def polish_hub(_: str) -> str:
    return HUB


# ---------------------------------------------------------------- InfoJoy
def polish_infojoy(h: str) -> str:
    h = clean(h)
    # headings: first heading in the body was an <h3>; keep a clean h2 > h3 outline
    h = h.replace("<h3>The Problem Without InfoJoy</h3>", "<h2>The Problem Without InfoJoy</h2>")
    h = h.replace("<h3>What InfoJoy Delivers</h3>", "<h2>What InfoJoy Delivers</h2>")
    h = h.replace('alt="98d3404ce776f55bbd91fc52394da1a32ae04922"', 'alt="InfoJoy B2B prospecting platform preview"')
    h = h.replace('alt="Flexible Pricing Model "', 'alt="InfoJoy flexible pricing model"')
    h = h.replace('alt="Buyer insights shorter sales cycles"', 'alt="Buyer insights shorter sales cycles"')
    h = re.sub(r'(src="/wp-content/uploads/2025/10/Buyer-insights-shorter-sales-cycles.svg" alt=)""', r'\1"Buyer insights, shorter sales cycles"', h)
    return fix_links(h)


# ---------------------------------------------------------------- Buyer Intent
def polish_buyer_intent(h: str) -> str:
    h = clean(h)
    h = h.replace('<h2>Flexible Pricing &amp; Engagement</h2>\n<h2>Custom plans</h2>', '<h2>Flexible Pricing &amp; Engagement</h2>\n<h3>Custom plans</h3>')
    h = h.replace("<h2>Flexible engagement</h2>", "<h3>Flexible engagement</h3>")
    return fix_links(h)


# ---------------------------------------------------------------- Web Traffic Revealer
def polish_wtr(h: str) -> str:
    h = clean(h)
    # the Elementor export repeated these headings (mobile + desktop copies of one widget)
    intro = "<p>Not all the visiting website traffic is equal. Web Traffic Revealer provides clarity on</p>\n"
    if h.count(intro) == 2:  # first copy + first two headings are the duplicates; keep the second set
        h = h.replace(intro, "", 1)
        h = h.replace("<h2>Know Who’s Visiting and Why</h2>\n", "", 1)
        h = h.replace("<h2>Validate Your Traffic Quality</h2>\n", "", 1)
    h = h.replace("campaign landing pages client websites", "campaign landing pages and client websites")
    h = h.replace("<h2>Connect Inbound Traffic to Outbound Success</h2>", "<h3>Connect Inbound Traffic to Outbound Success</h3>")
    h = h.replace("<h2>Every Visit is an Opportunity</h2>", "<h3>Every Visit is an Opportunity</h3>")
    # integrations: tag-manager entries were stand-alone headings -> a list
    h = h.replace(
        "<h2>Analytics &amp; Tag Management</h2>\n<h2>Google Analytics,</h2>\n<h2>Google Tag Manager</h2>",
        "<h2>Analytics &amp; Tag Management</h2>\n<ul>\n<li>Google Analytics</li>\n<li>Google Tag Manager</li>\n</ul>",
    )
    h = h.replace("<h2>Supported Integrations:</h2>\n<h2>CRM Platforms</h2>", "<h2>Supported Integrations</h2>\n<h3>CRM Platforms</h3>")
    h = h.replace("<h2>Marketing Automation</h2>", "<h3>Marketing Automation</h3>")
    h = h.replace("<h2>Analytics &amp; Tag Management</h2>", "<h3>Analytics &amp; Tag Management</h3>")
    # use-case headings are h2 siblings of the section title: demote to h3 and drop the trailing colon
    for t in [
        "B2B SaaS Companies",
        "Marketing Agencies",
        "Manufacturing and Industrial Firms",
        "Financial Services and Healthcare Providers",
        "Tech Startups",
    ]:
        h = re.sub(rf"<h2>{re.escape(t)}:?</h2>", f"<h3>{t}</h3>", h)
    # alt text: file-name alts and empty alts on logos
    alts = {
        "HubSpot_Logo.jpg": "HubSpot",
        "Salesforce.com_logo.jpg": "Salesforce",
        "ZOHO.jpg": "Zoho CRM",
        "pipedrive.jpg": "Pipedrive",
        "Dynamics-365.jpg": "Microsoft Dynamics 365",
        "Marketo_logo.png": "Marketo",
        "pardot-logo.png": "Salesforce Pardot",
        "ActiveCampaign_logo.png": "ActiveCampaign",
        "intuit-mc.png": "Intuit Mailchimp",
        "opportunities.jpg": "Missed opportunities in website traffic",
    }
    for f, alt in alts.items():
        h = re.sub(rf'(src="[^"]*{re.escape(f)}" alt=)"[^"]*"', rf'\1"{alt}"', h)
    return fix_links(h)


POLISH = {
    "products": polish_hub,
    "products__infojoy": polish_infojoy,
    "products__buyer-intent": polish_buyer_intent,
    "products__web-traffic-revealer": polish_wtr,
}

# SEO: keep Rank Math titles; the hub description was 168 chars (SERPs cut at ~160).
HUB_DESC = "Discover MarketJoy’s products like InfoJoy for clear buyer intent insights and accurate contact data, making B2B prospecting easier and more effective."
OG_ALT = {
    "products": "MarketJoy product suite",
    "products__infojoy": "InfoJoy B2B prospecting platform",
    "products__buyer-intent": "Buyer intent data: benefits of working with MarketJoy",
    "products__web-traffic-revealer": "Web Traffic Revealer",
}

for slug, fn in POLISH.items():
    p = ENTRIES / f"{slug}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    d["html"] = fn(d["html"]).strip() + "\n"
    if slug == "products":
        d["seo"]["description"] = HUB_DESC
    d["seo"]["ogImageAlt"] = OG_ALT[slug]
    p.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{slug}: {len(d['html'])} chars")
