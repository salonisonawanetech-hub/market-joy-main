#!/usr/bin/env python3
"""WordPress CPT export (Elementor) -> structured JSON for the React site.

Usage:
  python scripts/migrate-cpt.py --src <folder with the 4 json files> --xml <WordPress export .xml> \
      --public public/wp-content [--out .]
Needs: pip install beautifulsoup4

Handles: case-studies.json, industry-news.json, press-release.json (single object),
         testimonials.json (names only - quotes recovered from Elementor widgets in the XML).
Nothing is invented. Fields absent from the export are null and listed in report.json.
"""
import argparse, csv, glob, html, json, os, re, sys
from collections import Counter, defaultdict
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

SITE = "https://marketjoy.com"
ALLOWED = {"p", "ul", "ol", "li", "strong", "em", "a", "br", "blockquote", "table", "thead", "tbody",
           "tr", "th", "td", "figure", "figcaption", "img", "h2", "h3", "h4"}
HEADING_MAP = {"h1": "h2", "h2": "h2", "h3": "h3", "h4": "h4", "h5": "h4", "h6": "h4"}
TYPES = {
    "case-studies": dict(file="case-studies.json", base="/case-studies", label="Case Studies"),
    "industry-news": dict(file="industry-news.json", base="/industry-news", label="Industry News"),
    "press-releases": dict(file="press-release.json", base="/press-release", label="Press Releases"),
}


def ws(s):
    return re.sub(r"\s+", " ", (s or "").replace("\xa0", " ")).strip()


def local_url(u):
    """Absolute marketjoy.com media URL -> root-relative (matches existing blog convention)."""
    u = (u or "").strip()
    if u.startswith(SITE + "/wp-content/"):
        return u[len(SITE):]
    return u


def fix_link(href):
    href = (href or "").strip()
    if href.startswith(SITE + "/"):
        return href[len(SITE):] or "/"
    return href


def text_of(s):
    return ws(BeautifulSoup(s, "html.parser").get_text(" "))


class Ctx:
    def __init__(self):
        self.images, self.links, self.dropped = [], [], Counter()


def clean(node, ctx):
    """Recursively sanitise a bs4 node into an HTML string using the whitelist."""
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            out.append(html.escape(str(c), quote=False))
            continue
        if not isinstance(c, Tag):
            continue
        n = c.name
        if n in ("svg", "style", "script", "noscript", "button", "form", "input"):
            ctx.dropped["stripped:" + n] += 1
            continue
        if n == "iframe":
            src = c.get("src") or ""
            if re.match(r"https://(www\.)?youtube(-nocookie)?\.com/embed/", src):
                src = src.split("?")[0]
                out.append(f'<div class="video-embed"><iframe src="{src}" title="{html.escape(c.get("title") or "Video", quote=True)}" loading="lazy" allowfullscreen></iframe></div>')
            else:
                ctx.dropped["stripped:iframe_non_youtube"] += 1
            continue
        if n == "img":
            src = local_url(c.get("data-src") or c.get("src") or "")
            if not src or src.startswith("data:"):
                ctx.dropped["stripped:img_no_src"] += 1
                continue
            alt = ws(c.get("alt") or "")
            ctx.images.append(src)
            out.append(f'<img src="{html.escape(src, quote=True)}" alt="{html.escape(alt, quote=True)}" loading="lazy" decoding="async">')
            continue
        inner = clean(c, ctx)
        if n == "a":
            href = fix_link(c.get("href"))
            if not href or href.startswith("#") or href.lower().startswith("javascript:"):
                out.append(inner)
            else:
                ctx.links.append(href)
                ext = href.startswith("http")
                attrs = f' href="{html.escape(href, quote=True)}"' + (' target="_blank" rel="noopener noreferrer"' if ext else "")
                out.append(f"<a{attrs}>{inner}</a>")
        elif n == "br":
            # Source HTML sometimes has "<br>text</br>"; html.parser nests the text inside <br>. Keep it.
            out.append("<br>" + inner)
        elif n in ("b", "strong"):
            out.append(f"<strong>{inner}</strong>" if text_of(inner) else inner)
        elif n in ("i", "em"):
            out.append(f"<em>{inner}</em>" if text_of(inner) else inner)
        elif re.fullmatch(r"h[1-6]", n):
            t = HEADING_MAP[n]
            out.append(f"<{t}>{inner}</{t}>" if text_of(inner) else "")
        elif n in ALLOWED:
            out.append(f"<{n}>{inner}</{n}>")
        else:  # span / div / section / etc: unwrap
            out.append(inner)
    return "".join(out)


def tidy(h):
    h = re.sub(r"<(p|li|h[2-4]|td|th)>\s*(<br>\s*)*</\1>", "", h)       # empty blocks
    h = re.sub(r"(<br>\s*){3,}", "<br><br>", h)
    h = re.sub(r"</(strong|em)>\s*<\1>", " ", h)
    h = re.sub(r"\s{2,}", " ", h)
    return h.strip()


def convert(raw, title, ctx):
    """Elementor widgets -> ordered clean HTML. Returns html string."""
    soup = BeautifulSoup(raw, "html.parser")
    for t in soup(["style", "script"]):
        t.decompose()
    widgets = soup.select("[data-widget_type]")
    if not widgets:  # plain WordPress HTML (not Elementor): sanitise the whole body in order
        ctx.dropped["plain_html_record"] += 1
        return tidy(clean(soup, ctx))
    parts, first_heading = [], False
    for w in widgets:
        wt = w["data-widget_type"].split(".")[0]
        if wt in ("posts", "shortcode"):
            ctx.dropped[wt + "_related_cards_(dynamic)"] += 1
            continue
        if wt in ("rating", "divider", "post-info", "spacer"):
            ctx.dropped[wt + "_decorative"] += 1
            continue
        if wt == "heading":
            hn = w.find(re.compile(r"^h[1-6]$"))
            txt = ws(w.get_text(" "))
            if not txt:
                continue
            if not first_heading:
                first_heading = True
                if txt.lower() == title.strip().lower():
                    ctx.dropped["first_heading_duplicates_page_title"] += 1
                    continue
            t = HEADING_MAP.get(hn.name if hn else "h2", "h2")
            parts.append(f"<{t}>{clean(hn or w, ctx)}</{t}>")
        elif wt == "text-editor":
            cont = w.select_one(".elementor-widget-container") or w
            parts.append(clean(cont, ctx))
        elif wt == "image":
            img = w.find("img")
            if not img:
                continue
            cap = w.find("figcaption") or w.select_one(".widget-image-caption")
            ih = clean(img.parent if img.parent is w else w, ctx)
            imgs = re.findall(r"<img [^>]+>", ih)
            if imgs:
                capt = f"<figcaption>{clean(cap, ctx)}</figcaption>" if cap and ws(cap.get_text()) else ""
                parts.append(f"<figure>{imgs[0]}{capt}</figure>")
        elif wt == "icon-list":
            items = [clean(li.select_one(".elementor-icon-list-text") or li, ctx) for li in w.select(".elementor-icon-list-item")]
            items = [f"<li>{i}</li>" for i in items if text_of(i)]
            if items:
                parts.append("<ul>" + "".join(items) + "</ul>")
        elif wt == "icon-box":
            t = w.select_one(".elementor-icon-box-title")
            d = w.select_one(".elementor-icon-box-description")
            if t and ws(t.get_text()):
                parts.append(f"<h3>{clean(t, ctx)}</h3>")
            if d and ws(d.get_text()):
                parts.append(f"<p>{clean(d, ctx)}</p>")
        elif wt == "button":
            a = w.find("a")
            label = ws(w.get_text(" "))
            href = fix_link(a.get("href")) if a else ""
            if not label:
                continue
            if not href or href == "#":
                # Elementor "button" with no link is a section label ("The Challenge", "Case Study"...)
                if not first_heading:
                    ctx.dropped["hero_badge_button_(Case Study / Success Story)"] += 1
                else:
                    parts.append(f"<p><strong>{html.escape(label, quote=False)}</strong></p>")
            else:
                ctx.links.append(href)
                ext = href.startswith("http")
                attrs = f' href="{html.escape(href, quote=True)}"' + (' target="_blank" rel="noopener noreferrer"' if ext else "")
                parts.append(f"<p><a{attrs}>{html.escape(label, quote=False)}</a></p>")
        else:
            ctx.dropped["unknown_widget:" + wt] += 1
    return tidy("".join(parts))


def excerpt_of(h):
    m = re.search(r"<p>(.*?)</p>", h, flags=re.S)
    t = text_of(m.group(1)) if m else text_of(h)
    if len(t) <= 160:
        return t
    return t[:157].rsplit(" ", 1)[0].rstrip(",;:- ") + "..."


def load_json(p):
    return json.loads(Path(p).read_text(encoding="utf-8-sig"))


def load_attachments(xml):
    s = Path(xml).read_text(encoding="utf-8", errors="replace")
    att = {}
    for it in re.finditer(r"<item>(.*?)</item>", s, flags=re.S):
        b = it.group(1)
        if "<wp:post_type><![CDATA[attachment]]>" not in b:
            continue
        pid = int(re.search(r"<wp:post_id>(\d+)</wp:post_id>", b).group(1))
        u = re.search(r"<wp:attachment_url><!\[CDATA\[(.*?)\]\]>", b)
        alt = re.search(r"<wp:meta_key><!\[CDATA\[_wp_attachment_image_alt\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]>", b, flags=re.S)
        att[pid] = {"url": local_url(u.group(1)) if u else None, "alt": ws(alt.group(1)) if alt else ""}
    return att, s


def recover_testimonials(xml_text, names):
    """Quote/role/company are NOT in testimonials.json. Elementor 'testimonial' widgets embedded in pages
    carry them. Match by exact name; keep the most frequent (quote, role) pair. Never guessed."""
    found = defaultdict(Counter)
    for m in re.finditer(r'"description_text":"((?:[^"\\]|\\.)*)"', xml_text):
        try:
            raw = json.loads('"' + m.group(1) + '"')
        except Exception:
            continue
        nm = ws(re.split(r"<br>|<p", raw)[0])
        back = xml_text[max(0, m.start() - 4000):m.start()]
        q = re.findall(r'"title_text":"((?:[^"\\]|\\.)*)"', back)
        try:
            quote = ws(BeautifulSoup(json.loads('"' + q[-1] + '"'), "html.parser").get_text(" ")) if q else None
        except Exception:
            quote = None
        role_html = BeautifulSoup(raw, "html.parser")
        cn = role_html.find(class_="clientname")
        role = ws(cn.get_text(" | ")) if cn else None
        found[nm.lower().replace(".", "")][(quote, role)] += 1
    out = {}
    for n in names:
        key = n.lower().replace(".", "")
        if key in found:
            (quote, role), cnt = found[key].most_common(1)[0]
            out[n] = {"quote": quote, "roleCompany": role, "pageWidgetOccurrences": sum(found[key].values())}
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--xml", required=True)
    ap.add_argument("--public", default="public/wp-content")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    out = Path(a.out)
    src = Path(a.src)

    def find(name):
        m = [p for p in glob.glob(str(src / "*")) if p.endswith(name)]
        return m[0] if m else None

    att, xml_text = load_attachments(a.xml)
    public = Path(a.public)
    have = {str(p.relative_to(public.parent)).replace("\\", "/") for p in public.rglob("*") if p.is_file()} if public.exists() else set()
    big = {}
    all_images = Counter()
    summary = {}

    for key, cfg in TYPES.items():
        p = find(cfg["file"])
        if not p:
            summary[key] = {"status": "FILE NOT FOUND"}
            continue
        recs = load_json(p)
        if isinstance(recs, dict):
            recs = [recs]  # press-release.json is a single object, not a list
        ent_dir = out / f"src/content/{key}/entries"
        ent_dir.mkdir(parents=True, exist_ok=True)
        for f in ent_dir.glob("*.json"):
            f.unlink()
        mig = out / f"migration/{key}"
        mig.mkdir(parents=True, exist_ok=True)
        index, urlmap, warnings, dropped = [], [], [], Counter()
        link_all, empty_alt = Counter(), 0
        for r in recs:
            slug = r["slug"]
            title = ws(BeautifulSoup(r["title"]["rendered"], "html.parser").get_text(" "))
            ctx = Ctx()
            body = convert(r["content"]["rendered"], title, ctx)
            dropped.update(ctx.dropped)
            if not text_of(body):
                warnings.append({"slug": slug, "warning": "no body produced"})
            fm = att.get(r.get("featured_media") or 0)
            if r.get("featured_media") and not (fm and fm["url"]):
                warnings.append({"slug": slug, "warning": f"featured_media {r['featured_media']} not in XML attachments"})
            for u in ctx.images + ([fm["url"]] if fm and fm["url"] else []):
                all_images[u] += 1
            link_all.update(ctx.links)
            empty_alt += len(re.findall(r'alt=""', body))
            path = f"{cfg['base']}/{slug}/"
            entry = {
                "id": r["id"], "slug": slug, "path": path, "sourceUrl": r["link"], "title": title,
                "date": r["date"], "modified": r["modified"],
                "excerpt": excerpt_of(body),
                "seo": {"title": None, "description": None, "canonical": None, "robots": None,
                        "note": "Not present in the export (no Yoast/RankMath fields in the CPT JSON). excerpt is derived from the body."},
                "featuredImage": ({"src": fm["url"], "alt": fm["alt"] or None} if fm and fm["url"] else None),
                "html": body,
            }
            (ent_dir / f"{slug}.json").write_text(json.dumps(entry, ensure_ascii=False, indent=1), encoding="utf-8")
            index.append({k: entry[k] for k in ("id", "slug", "path", "sourceUrl", "title", "date", "modified", "excerpt", "featuredImage")})
            urlmap.append({"old_url": r["link"], "new_route": path, "status": "same-path", "redirect_needed": "no", "wp_id": r["id"]})
        index.sort(key=lambda x: x["date"], reverse=True)
        (out / f"src/content/{key}/index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
        (mig / "url-map.json").write_text(json.dumps(urlmap, indent=1), encoding="utf-8")
        with open(mig / "url-map.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(urlmap[0].keys())); w.writeheader(); w.writerows(urlmap)
        rep = {"source_records": len(recs), "converted_records": len(index), "failed": len(warnings),
               "dropped_or_stripped": dict(dropped), "body_links": {"total": sum(link_all.values()), "distinct": len(link_all)},
               "images_with_empty_alt_in_body": empty_alt, "warnings": warnings}
        (mig / "report.json").write_text(json.dumps(rep, indent=1), encoding="utf-8")
        summary[key] = rep

    # ---- testimonials ----
    tp = find("testimonials.json")
    if tp:
        recs = load_json(tp)
        names = [ws(html.unescape(r["title"]["rendered"])) for r in recs]
        rec = recover_testimonials(xml_text, names)
        items = []
        for r, n in zip(recs, names):
            x = rec.get(n)
            items.append({
                "id": r["id"], "slug": r["slug"], "name": n, "date": r["date"],
                "sourceUrl": r["link"],
                "quote": x["quote"] if x else None,
                "roleCompany": x["roleCompany"] if x else None,
                "quoteSource": "elementor-page-widget" if x and x["quote"] else None,
            })
        d = out / "src/content/testimonials"; d.mkdir(parents=True, exist_ok=True)
        (d / "testimonials.json").write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
        mig = out / "migration/testimonials"; mig.mkdir(parents=True, exist_ok=True)
        um = [{"old_url": i["sourceUrl"], "new_route": "(no single-page route; shown on /client-reviews/)", "status": "no-detail-page", "redirect_needed": "yes", "wp_id": i["id"]} for i in items]
        with open(mig / "url-map.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(um[0].keys())); w.writeheader(); w.writerows(um)
        withq = [i["name"] for i in items if i["quote"]]
        missing = [i["name"] for i in items if not i["quote"]]
        rep = {"source_records": len(recs), "converted_records": len(items), "with_quote_recovered_from_pages": len(withq),
               "without_quote": missing, "export_body_empty": sum(1 for r in recs if not r["content"]["rendered"].strip()),
               "duplicate_names": [n for n, c in Counter(names).items() if c > 1]}
        (mig / "report.json").write_text(json.dumps(rep, indent=1), encoding="utf-8")
        summary["testimonials"] = rep

    # ---- images ----
    rows = []
    for u, c in sorted(all_images.items()):
        rel = u.lstrip("/") if u.startswith("/wp-content/") else None
        rows.append({"image": u, "uses": c, "in_public_folder": "yes" if rel and rel in have else ("n/a-external" if not rel else "NO - copy from old site")})
    mdir = out / "migration"; mdir.mkdir(parents=True, exist_ok=True)
    with open(mdir / "images-needed.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["image", "uses", "in_public_folder"]); w.writeheader(); w.writerows(rows)
    summary["_images"] = {"distinct": len(rows), "already_in_public": sum(r["in_public_folder"] == "yes" for r in rows),
                          "missing_locally": sum(r["in_public_folder"].startswith("NO") for r in rows)}
    (mdir / "cpt-report.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
    print(json.dumps({k: ({kk: vv for kk, vv in v.items() if kk not in ("warnings", "without_quote")} if isinstance(v, dict) else v) for k, v in summary.items()}, indent=1))


if __name__ == "__main__":
    sys.exit(main())
