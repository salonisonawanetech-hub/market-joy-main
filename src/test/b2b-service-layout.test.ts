import { describe, expect, it } from "vitest";
import { loadServiceByPath } from "@/content/services/loader";
import { layoutB2BServiceHtml } from "@/components/pages/B2BServiceLayout";

describe("B2B lead generation service layout", () => {
  it("organizes the existing page content into responsive section grids", async () => {
    const entry = await loadServiceByPath("/b2b-lead-generation-services/");
    expect(entry).not.toBeNull();

    const source = entry!.html;
    const layout = layoutB2BServiceHtml(source);

    expect(layout.match(/class="b2b-section b2b-section-/g)).toHaveLength(8);
    expect(layout).toContain("sm:grid-cols-2 lg:grid-cols-3");
    expect(layout).toContain("md:grid-cols-2");
    expect(layout.match(/class="b2b-stat-card grid grid-cols-/g)).toHaveLength(3);
    expect(layout.match(/class="b2b-stat-icon"/g)).toHaveLength(3);
    expect(layout).toContain("Trusted by 500+ B2B");
    expect(layout).toContain("US &amp; Canada Decision-Maker Focus");
    expect(layout).toContain("Go Live in 15 Days | Zero</strong>");
    expect(layout).toContain("<strong>Setup Fees</strong>");
    expect(layout).toContain('<table class="b2b-comparison-table">');
    expect(layout.match(/<tr><td>/g)).toHaveLength(4);
    expect(layout).toContain('scope="col"');
    expect(layout).toContain(
      'role="region" aria-label="Agency versus MarketJoy lead generation comparison" tabindex="0"',
    );
    const comparisonRows = [
      ...layout.matchAll(/<tr><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g),
    ];
    expect(comparisonRows).toHaveLength(4);
    expect(comparisonRows[0]?.[1]).toContain("0 meetings in 3–4 months");
    expect(comparisonRows[0]?.[2]).toContain("Targeted SQL delivery");
    expect(comparisonRows[1]?.[1]).toContain("Generic template emails");
    expect(comparisonRows[1]?.[2]).toContain("Hyper-personalized copy");
    expect(comparisonRows[2]?.[1]).toContain("2+ weeks waiting");
    expect(comparisonRows[2]?.[2]).toContain("Agile, bi-weekly reviews");
    expect(comparisonRows[3]?.[1]).toContain("Burned sender domains");
    expect(comparisonRows[3]?.[2]).toContain("Enterprise email deliverability");
    expect(comparisonRows[3]?.[2]).not.toContain("CORE CAPABILITIES");
    expect(layout).toContain('class="b2b-section-eyebrow">CORE CAPABILITIES</p>');
    expect(layout.match(/class="b2b-capability-card"/g)).toHaveLength(4);
    expect(layout).toContain(
      'class="b2b-capability-layout grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]"',
    );
    expect(layout.match(/class="b2b-capability-icon"/g)).toHaveLength(4);
    expect(layout).toContain('class="b2b-capability-visual"');
    expect(layout.match(/<img\b/g)).toHaveLength((source.match(/<img\b/g)?.length ?? 0) - 3);
    expect(layout).toContain("PREDICTABLE PIPELINE GROWTH FOR B2B ENTERPRISES");
    expect(layout).toContain('class="b2b-hero-copy"');
    expect(layout).toContain('class="b2b-hero-action"');
    expect(layout).toContain("Claim Free Sales-Qualified Leads for Q4");
    expect(layout).toContain('<a href="/contact-us/">Contact us</a>');
    expect(layout).not.toContain("<h2>Contact Us</h2>");
    expect(layout).toContain("From Kickoff to First Qualified Meeting in 15 Days");
    expect(layout).toContain(
      'class="b2b-onboarding-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"',
    );
    expect(layout.match(/class="b2b-onboarding-card"/g)).toHaveLength(5);
    expect(layout).toContain("Days 1–3");
    expect(layout).toContain("Days 4–7");
    expect(layout).toContain("Days 8–11");
    expect(layout).toContain("Days 12–14");
    expect(layout).toContain("Day 15 & Beyond");
    expect(layout).not.toContain("SOCIAL PROOF &amp; TESTIMONIALS");
    expect(layout).toContain("Frequently Asked Questions");
    expect(layout).toContain("Ready to Fill Your Sales Calendar");
  });
});
