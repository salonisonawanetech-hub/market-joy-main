import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRankMathSeo } from "@/lib/wordpressPages";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Rank Math SEO metadata", () => {
  it("parses metadata returned by the Headless CMS endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          head: [
            "<title>Live &amp; current title</title>",
            '<meta name="description" content="A live description &amp; details"/>',
            '<meta name="robots" content="index, follow"/>',
            '<link rel="canonical" href="https://marketjoy.com/example/"/>',
            '<meta property="og:image" content="https://marketjoy.com/share.jpg"/>',
            '<meta property="og:type" content="article"/>',
            '<meta name="twitter:card" content="summary_large_image"/>',
          ].join("\n"),
        }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchRankMathSeo("https://marketjoy.com/example/")).resolves.toEqual({
      title: "Live & current title",
      description: "A live description & details",
      canonical: "https://marketjoy.com/example/",
      robots: "index, follow",
      image: "https://marketjoy.com/share.jpg",
      type: "article",
      twitterCard: "summary_large_image",
    });

    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] as URL);
    expect(requestUrl.pathname).toBe("/wp-json/rankmath/v1/getHead");
    expect(requestUrl.searchParams.get("url")).toBe("https://marketjoy.com/example/");
  });
});
