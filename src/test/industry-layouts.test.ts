import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { IndustryBlocks } from "@/components/pages/IndustryBlocks";
import { IndustriesHub } from "@/components/pages/IndustriesHub";
import { INDUSTRIES_INDEX, loadIndustryByPath } from "@/content/industries/loader";

describe("industry layouts", () => {
  it("renders every generated layout and keeps the headings", async () => {
    let withLayout = 0;
    for (const item of INDUSTRIES_INDEX) {
      const e = await loadIndustryByPath(item.path);
      if (!e?.layout) continue;
      withLayout++;
      const html = renderToString(createElement(IndustryBlocks, { blocks: e.layout }));
      expect(html.length, e.slug).toBeGreaterThan(1500);
      for (const b of e.layout) if ("title" in b && b.title) expect(html, `${e.slug}: ${b.title}`).toContain(b.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;"));
    }
    expect(withLayout).toBeGreaterThan(25);
  });

  it("renders the industries hub with a link to every top-level industry", () => {
    const html = renderToString(createElement(IndustriesHub));
    for (const i of INDUSTRIES_INDEX.filter((x) => x.parent === null && x.path !== "/industries/")) expect(html, i.path).toContain(`href="${i.path}"`);
    expect(html).toContain("Built on Customer Success");
  });
});
