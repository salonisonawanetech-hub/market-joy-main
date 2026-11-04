import { findPage } from "@/components/pages/content";

const ABS = /href="https?:\/\/(?:www\.)?marketjoy\.com(\/[^"#?]*)([^"]*)"/g;

/**
 * Body links were stored with their original absolute marketjoy.com URLs.
 * Rewrite to root-relative only when the new site has a page for that path;
 * anything else (e.g. blog posts not migrated yet) keeps pointing at the live URL.
 */
export function resolveInternalLinks(html: string): string {
  return html.replace(ABS, (whole, path: string, rest: string) =>
    findPage(path) ? `href="${path}${rest}"` : whole,
  );
}
