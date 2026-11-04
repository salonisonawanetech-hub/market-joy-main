import { describe, expect, it } from "vitest";
import { findPage } from "@/components/pages/content";
import { REDIRECTS } from "@/content/redirects";
import {
  ABOUT_COMMITMENT,
  ABOUT_HOW,
  ABOUT_SEO,
  ABOUT_SERVICES,
  ABOUT_TEAM_GROUPS,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY,
  CURTIS,
  TEAM,
} from "@/content/about/about";

describe("About pages migration", () => {
  it("registers /about with the old Rank Math title and description", () => {
    const page = findPage("about");
    expect(page?.kind).toBe("about");
    expect(page?.seoTitle).toBe(ABOUT_SEO.title);
    expect(page?.metaDescription).toBe(ABOUT_SEO.description);
  });

  it("registers /curtis-bendt under About Us", () => {
    const page = findPage("curtis-bendt");
    expect(page?.kind).toBe("member");
    expect(page?.parent?.href).toBe("/about/");
  });

  it("keeps every section of the old page", () => {
    expect(ABOUT_SERVICES.items).toHaveLength(3);
    expect(ABOUT_WHAT_WE_DO.tabs).toHaveLength(5);
    expect(ABOUT_WHY.items).toHaveLength(4);
    expect(ABOUT_TEAM_GROUPS.groups).toHaveLength(5);
    expect(ABOUT_HOW.steps).toHaveLength(6);
    expect(ABOUT_COMMITMENT.points).toHaveLength(6);
    expect(TEAM.map((m) => m.name)).toEqual([
      "Jay Singh",
      "Roop Singh",
      "Curtis Bendt",
      "Chris Bowles",
      "Rosemin Paroo",
    ]);
  });

  it("links only Curtis Bendt to a profile page (the only one on the old site)", () => {
    expect(TEAM.filter((m) => m.href).map((m) => m.href)).toEqual(["/curtis-bendt/"]);
    expect(CURTIS.bio).toHaveLength(3);
  });

  it("redirects the old author URL to the profile page", () => {
    expect(REDIRECTS["/author/curtis-bendt"]).toBe("/curtis-bendt/");
  });
});
