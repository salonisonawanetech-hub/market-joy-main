#!/usr/bin/env python3
"""WordPress (Elementor) Joypedia export -> structured JSON for the React site.

Usage:  python scripts/migrate-joypedia.py <joypedia.json> [--out .]
Needs:  pip install beautifulsoup4

Writes (relative to --out, default = project root):
  src/content/joypedia/index.json            one light record per term
  src/content/joypedia/entries/<slug>.json   one full record per term (blocks)
  migration/joypedia/url-map.csv|json        old WP URL -> new route
  migration/joypedia/report.json             counts, drops, warnings

Nothing is invented: fields absent from the export (SEO title, meta description,
canonical, robots, featured image, ACF, redirects) are recorded as null/absent.
"""
import argparse, csv, html, json, re, sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup, NavigableString, Tag

SITE = "https://marketjoy.com"
KEEP_INLINE = {"strong": "strong", "b": "strong", "em": "em", "i": "em", "br": "br", "a": "a"}


def ws(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("\xa0", " ")).strip()


def inline(node, stats) -> str:
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            out.append(html.escape(str(c), quote=False))
        elif isinstance(c, Tag):
            n = c.name
            if n == "br":
                out.append("<br>")
            elif n == "a":
                href = (c.get("href") or "").strip()
                inner = inline(c, stats)
                if not href or href.startswith("#") or href.lower().startswith("javascript:"):
                    stats["links_unwrapped"] += 1
                    out.append(inner)
                else:
                    stats["links"].append(href)
                    ext = not (href.startswith(SITE) or href.startswith("/"))
                    attrs = f' href="{html.escape(href, quote=True)}"'
                    if ext:
                        attrs += ' target="_blank" rel="noopener noreferrer"'
                    out.append(f"<a{attrs}>{inner}</a>")
            elif n in KEEP_INLINE:
                t = KEEP_INLINE[n]
                out.append(f"<{t}>{inline(c, stats)}</{t}>")
            else:  # span/div/etc: unwrap (Word/Elementor wrappers)
                out.append(inline(c, stats))
    return "".join(out)


def clean_inline(node, stats) -> str:
    s = ws(inline(node, stats))
    s = re.sub(r"(<br>\s*)+$", "", s)
    s = re.sub(r"^(\s*<br>)+", "", s).strip()
    s = re.sub(r"</(strong|em)>\s*<\1>", " ", s)  # adjacent identical wrappers
    return s


def text_of(s: str) -> str:
    return ws(BeautifulSoup(s, "html.parser").get_text(" "))


def blocks_from_text_editor(w, stats, cta=False):
    """Walk the widget body in order. <p>/<ul>/<ol> become blocks; loose inline
    content (spans/text with no <p>, common in Word-pasted Elementor text) is
    gathered into a paragraph so no text is lost."""
    out = []
    kind = "cta" if cta else "p"
    cont = w.select_one(".elementor-widget-container") or w

    def flush(buf):
        if not buf:
            return
        tmp = BeautifulSoup("<p></p>", "html.parser").p
        for n in buf:
            tmp.append(n.extract() if hasattr(n, "extract") else n)
        h = clean_inline(tmp, stats)
        if text_of(h):
            out.append({"t": kind, "html": h})

    def walk(parent):
        buf = []
        for ch in list(parent.children):
            if isinstance(ch, Tag) and ch.name == "p":
                flush(buf); buf = []
                h = clean_inline(ch, stats)
                if text_of(h):
                    out.append({"t": kind, "html": h})
            elif isinstance(ch, Tag) and ch.name in ("ul", "ol"):
                flush(buf); buf = []
                items = [clean_inline(li, stats) for li in ch.find_all("li", recursive=False)]
                items = [{"title": None, "html": i} for i in items if text_of(i)]
                if items:
                    out.append({"t": "ul", "items": items})
            elif isinstance(ch, Tag) and ch.name == "div":
                flush(buf); buf = []
                walk(ch)
            else:
                buf.append(ch)
        flush(buf)

    walk(cont)
    return out


def convert_elementor(raw, title, stats):
    soup = BeautifulSoup(raw, "html.parser")
    widgets = soup.select("[data-widget_type]")
    blocks, dropped = [], Counter()
    skip_next_heading = False
    i = 0
    cta_next = False
    first_heading_seen = False
    for idx, w in enumerate(widgets):
        wt = w["data-widget_type"].split(".")[0]
        if wt == "posts":
            dropped["posts_widget"] += 1
            continue
        if wt == "heading":
            txt = ws(w.get_text(" "))
            j = idx + 1  # look past consecutive headings to the next non-heading widget
            while j < len(widgets) and widgets[j]["data-widget_type"].startswith("heading"):
                j += 1
            nxt = widgets[j]["data-widget_type"].split(".")[0] if j < len(widgets) else None
            if nxt == "posts" and re.match(r"Latest\b", txt):  # label of a dynamic related-posts list
                dropped["posts_widget_heading:" + txt] += 1
                continue
            if not first_heading_seen:
                first_heading_seen = True
                if txt.lower() == title.strip().lower():
                    dropped["title_heading_duplicated_in_hero"] += 1
                    continue
            if re.fullmatch(r"CTA:?", txt, re.I):
                cta_next = True
                dropped["cta_label_heading"] += 1
                continue
            tag = w.find(re.compile(r"^h[1-6]$"))
            blocks.append({"t": "h2", "text": txt})
            continue
        if wt == "text-editor":
            blocks += blocks_from_text_editor(w, stats, cta=cta_next)
            cta_next = False
            continue
        if wt in ("icon-box", "icon-list"):
            items = []
            if wt == "icon-box":
                t = w.select_one(".elementor-icon-box-title")
                d = w.select_one(".elementor-icon-box-description")
                items.append({"title": ws(t.get_text(" ")) if t else None,
                              "html": clean_inline(d, stats) if d else ""})
            else:
                for li in w.select(".elementor-icon-list-item"):
                    items.append({"title": None, "html": clean_inline(li.select_one(".elementor-icon-list-text") or li, stats)})
            items = [x for x in items if x["title"] or text_of(x["html"])]
            if not items:
                continue
            if blocks and blocks[-1]["t"] == "ul" and blocks[-1].get("variant") == "check":
                blocks[-1]["items"] += items
            else:
                blocks.append({"t": "ul", "variant": "check", "items": items})
            continue
        dropped["unknown_widget:" + wt] += 1
    return blocks, dropped


def convert_plain(raw, stats):
    return blocks_from_text_editor(BeautifulSoup(raw, "html.parser"), stats)


def excerpt_of(blocks):
    first_p = None
    for i, b in enumerate(blocks):
        if b["t"] == "h2" and b["text"].lower().startswith("definition"):
            first_p = next((x for x in blocks[i + 1:] if x["t"] == "p"), None)
            break
    first_p = first_p or next((x for x in blocks if x["t"] == "p"), None)
    if not first_p:
        return ""
    t = text_of(first_p["html"])
    if len(t) <= 160:
        return t
    cut = t[:157].rsplit(" ", 1)[0].rstrip(",;:- ")
    return cut + "..."


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    out = Path(a.out)
    recs = json.loads(Path(a.src).read_text(encoding="utf-8-sig"))
    ent_dir = out / "src/content/joypedia/entries"
    rep_dir = out / "migration/joypedia"
    ent_dir.mkdir(parents=True, exist_ok=True)
    rep_dir.mkdir(parents=True, exist_ok=True)
    for f in ent_dir.glob("*.json"):
        f.unlink()

    index, urlmap, warnings, per_dropped, dups = [], [], [], Counter(), []
    all_links = Counter()
    for r in recs:
        slug, title = r["slug"], ws(BeautifulSoup(r["title"]["rendered"], "html.parser").get_text(" "))
        raw = r["content"]["rendered"]
        stats = {"links": [], "links_unwrapped": 0}
        is_el = "data-elementor-type" in raw
        if is_el:
            blocks, dropped = convert_elementor(raw, title, stats)
        else:
            blocks, dropped = convert_plain(raw, stats), Counter()
        per_dropped.update(dropped)
        deduped = []  # exact consecutive repeats of the same paragraph (editor pasted a line twice)
        for b in blocks:
            if deduped and b["t"] == "p" and b == deduped[-1]:
                dups.append({"slug": slug, "removed_text": text_of(b["html"])})
                continue
            deduped.append(b)
        blocks = deduped
        if not blocks:
            warnings.append({"slug": slug, "warning": "no content blocks produced"})
        all_links.update(stats["links"])
        path = f"/joypedia/{slug}/"
        entry = {
            "id": r["id"], "slug": slug, "path": path, "sourceUrl": r["link"],
            "title": title, "date": r["date"], "modified": r["modified"],
            "sourceFormat": "elementor" if is_el else "plain-html",
            "excerpt": excerpt_of(blocks),
            "seo": {"title": None, "description": None, "canonical": None, "robots": None,
                    "note": "Not present in export (no Yoast/RankMath fields). excerpt is derived from the body."},
            "featuredImage": None, "acf": None,
            "blocks": blocks,
        }
        (ent_dir / f"{slug}.json").write_text(json.dumps(entry, ensure_ascii=False, indent=1), encoding="utf-8")
        index.append({k: entry[k] for k in ("id", "slug", "path", "sourceUrl", "title", "date", "modified", "sourceFormat", "excerpt")})
        urlmap.append({"old_url": r["link"], "new_route": path, "status": "same-path", "redirect_needed": "no",
                       "wp_id": r["id"]})
    index.sort(key=lambda x: x["title"].lower())
    (out / "src/content/joypedia/index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    (rep_dir / "url-map.json").write_text(json.dumps(urlmap, indent=1), encoding="utf-8")
    with open(rep_dir / "url-map.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(urlmap[0].keys())); w.writeheader(); w.writerows(urlmap)
    report = {
        "source_records": len(recs), "converted_records": len(index),
        "elementor": sum(i["sourceFormat"] == "elementor" for i in index),
        "plain_html": sum(i["sourceFormat"] == "plain-html" for i in index),
        "dropped_widgets": dict(per_dropped),
        "links_in_body": {"total": sum(all_links.values()), "distinct": len(all_links)},
        "consecutive_duplicate_paragraphs_removed": dups,
        "warnings": warnings,
    }
    (rep_dir / "report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    sys.exit(main())
