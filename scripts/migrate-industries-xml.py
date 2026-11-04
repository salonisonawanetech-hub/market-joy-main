#!/usr/bin/env python3
"""Migrate the industries section from a WordPress WXR export (no network needed).

  pip install lxml
  python scripts/migrate-industries-xml.py <export.xml> [--out .]

Writes src/content/industries/{index.json,entries/*.json}, public/sitemap-industries.xml,
migration/industries-report.json and migration/industries-images.csv.
"""
import argparse, csv, html as htmlmod, json, re, sys
from pathlib import Path
from urllib.parse import urlparse
from lxml import etree
import lxml.html as LH

W = "{http://wordpress.org/export/1.2/}"
C = "{http://purl.org/rss/1.0/modules/content/}encoded"
ORIGIN = "https://marketjoy.com"
SITE_NAME = "MarketJoy"

ap = argparse.ArgumentParser()
ap.add_argument("xml")
ap.add_argument("--out", default=".")
args = ap.parse_args()
OUT = Path(args.out)

def is_industry(path):
    return path == "/industries/" or path.startswith("/industries/") or path.startswith("/construction-lead-generation/") or path == "/construction-lead-generation/"

# ---------- pass over the export ----------
pages, attach = [], {}
for _, it in etree.iterparse(args.xml, tag="item", huge_tree=True, recover=True):
    t = it.findtext(W + "post_type")
    if t == "attachment":
        meta = {m.findtext(W + "meta_key"): (m.findtext(W + "meta_value") or "") for m in it.findall(W + "postmeta")}
        url = it.findtext(W + "attachment_url") or ""
        wm = re.search(r's:5:"width";i:(\d+);s:6:"height";i:(\d+);', meta.get("_wp_attachment_metadata", ""))
        attach[it.findtext(W + "post_id")] = {"url": url, "alt": meta.get("_wp_attachment_image_alt", "").strip(), "area": int(wm.group(1)) * int(wm.group(2)) if wm else 0}
    elif t == "page" and it.findtext(W + "status") == "publish":
        link = it.findtext("link") or ""
        path = urlparse(link).path
        if is_industry(path):
            meta = {m.findtext(W + "meta_key"): (m.findtext(W + "meta_value") or "") for m in it.findall(W + "postmeta")}
            pages.append({
                "id": it.findtext(W + "post_id"), "wp_title": (it.findtext("title") or "").strip(), "path": path,
                "content": it.findtext(C) or "", "excerpt": it.findtext("{http://wordpress.org/export/1.2/excerpt/}encoded") or "",
                "date": it.findtext(W + "post_date_gmt"), "modified": it.findtext(W + "post_modified_gmt"),
                "thumb": meta.get("_thumbnail_id"), "meta": {k: v for k, v in meta.items() if k.startswith("rank_math") or k == "_thumbnail_id"},
            })
    it.clear()

def base_key(url):  # strip WP size suffix so alt text matches the full-size attachment
    u = re.sub(r"-\d+x\d+(?=\.[a-z0-9]+$)", "", url.split("?")[0])
    return u.replace(ORIGIN, "")
ALT = {base_key(a["url"]): a["alt"] for a in attach.values() if a["url"] and a["alt"]}

def local(u):
    return re.sub(r"^https?://(www\.)?marketjoy\.com", "", u or "")

def norm(s):
    return re.sub(r"\s+", " ", (s or "").replace("\xa0", " ")).strip()

def resolve(tpl, title):
    s = tpl or ""
    s = s.replace("%title%", title).replace("%sitename%", SITE_NAME).replace("%sep%", "|").replace("%page%", "").replace("%sitedesc%", "")
    return norm(s) if "%" not in s else ""

KEEP = {"h1","h2","h3","h4","h5","h6","p","ul","ol","li","a","img","strong","em","b","i","br","blockquote","table","thead","tbody","tr","th","td","figure","figcaption","div","span","section","details","summary"}
ATTR = {"a": {"href","title","target","rel"}, "img": {"src","alt","width","height","loading","decoding"}}
DROP = ["svg","script","style","noscript","iframe","form","button","input","select","textarea","video","audio","canvas","object","embed"]

def _q(t):  # compare text ignoring curly vs straight quotes and spacing
    return norm((t or "").replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"').replace("\u00a0", " ")).lower()

def fix_faq(root, stats):
    """Elementor FAQ accordions: the answer is bare text after <summary>, and the same answers are repeated as plain text
    *outside* the accordion (sometimes between items, sometimes several answers joined in one paragraph). Wrap the answer
    in <p> and remove the outside copies."""
    for d in root.iter("details"):
        s = d.find("summary")
        if s is not None and s.tail and norm(s.tail):
            np_ = LH.Element("p"); np_.text = s.tail.strip(); s.tail = None; s.addnext(np_)
    answers = []
    for d in root.iter("details"):
        s = d.find("summary")
        a = _q(" ".join(c.text_content() for c in d if c is not s))
        if a: answers.append(a)
    if not answers: return
    blob = " ".join(answers)
    removed = 0
    for el in list(root.iter("p", "ul", "ol", "div")):
        if el.getparent() is None or any(a.tag == "details" for a in el.iterancestors()) or el.tag == "details": continue
        if el.tag == "div" and any(c.tag in ("p", "ul", "ol", "div", "details", "h2", "h3") for c in el): continue
        t = _q(el.text_content())
        if len(t) < 20: continue
        rest = t
        for a in sorted(answers, key=len, reverse=True): rest = rest.replace(a, " ")
        if t in blob or len(rest.strip()) <= 3:
            el.drop_tree(); removed += 1
    if removed: stats["dropped"]["faq answer copies outside accordion"] = removed
    # anything left sitting *between* accordion items is an orphaned answer (its question was removed on the old site)
    dets = list(root.iter("details"))
    if dets:
        for par in {d.getparent() for d in dets if d.getparent() is not None}:
            kids = list(par); idx = [i for i, k in enumerate(kids) if k.tag == "details"]
            for i in range(min(idx), max(idx) + 1):
                if kids[i].tag in ("p", "ul", "ol", "div"):
                    stats["dropped"]["orphan text between faq items"] = stats["dropped"].get("orphan text between faq items", 0) + 1
                    kids[i].drop_tree()

def clean(raw, stats):
    # Shortcodes: the form gets a link to the contact page; others are removed.
    def sc(m):
        stats["shortcodes"].append(m.group(1))
        return '<p><a href="/contact-us/">Contact us</a></p>' if m.group(1).startswith("contact-form") else ""
    raw = re.sub(r"\[([a-z][a-z0-9_-]*)(?:\s[^\]]*)?\]", sc, raw)
    root = LH.fragment_fromstring(raw, create_parent="div")
    for tag in DROP:
        for el in root.iter(tag):
            pass
        found = list(root.iter(tag))
        if found: stats["dropped"][tag] = stats["dropped"].get(tag, 0) + len(found)
        for el in found: el.drop_tree()
    for el in list(root.iter("img")):
        src = el.get("src") or ""
        if src.startswith("data:") or not src:
            stats["dropped"]["img(data-uri)"] = stats["dropped"].get("img(data-uri)", 0) + 1
            el.drop_tree(); continue
        el.set("src", local(src))
        if not norm(el.get("alt")):
            alt = ALT.get(base_key(src))
            if alt: el.set("alt", alt); stats["alt_filled"] += 1
        el.set("loading", "lazy"); el.set("decoding", "async")
        stats["images"].append(local(src))
    for a in root.iter("a"):
        if a.get("href"): a.set("href", local(a.get("href")))
    for el in list(root.iter()):
        if not isinstance(el.tag, str):
            el.drop_tag() if el is not root else None; continue
        if el is root: continue
        if el.tag not in KEEP: el.drop_tag(); continue
        for k in list(el.attrib):
            if k not in ATTR.get(el.tag, set()): del el.attrib[k]
    # first <h1> is rendered by the page hero
    h1 = root.find(".//h1")
    h1_text = norm(h1.text_content()) if h1 is not None else ""
    if h1 is not None: h1.drop_tree()
    # the page hero already renders the one <h1>; any further <h1> inside the old Elementor body becomes <h2>
    for extra in list(root.iter("h1")): extra.tag = "h2"
    # drop empty wrappers/paragraphs (repeat: removing a child can empty its parent)
    for _ in range(4):
        for el in list(root.iter("div", "span", "section", "p", "li", "ul", "ol", "a", "strong", "em", "b", "i")):
            if el is root: continue
            if not norm(el.text_content()) and not list(el.iter("img")) and not list(el.iter("br")) or (el.tag in ("p",) and not norm(el.text_content()) and not list(el.iter("img"))):
                el.drop_tree()
    # Headings of dynamic widgets (latest posts / case studies) render empty in the export; drop the orphan heading.
    for h in list(root.iter("h2", "h3")):
        nxt = h.getnext()
        if re.match(r"(?i)our latest\b", norm(h.text_content())) and (nxt is None or nxt.tag in ("h1", "h2", "h3")):
            h.drop_tree(); stats["dropped"]["empty 'latest' widget heading"] = stats["dropped"].get("empty 'latest' widget heading", 0) + 1
    fix_faq(root, stats)
    dedupe(root, stats)
    out = "".join(LH.tostring(c, encoding="unicode") for c in root)
    out = re.sub(r"[ \t]*\n[ \t\n]*", "\n", out).strip()
    if root.text and norm(root.text): out = htmlmod.escape(norm(root.text)) + out
    faqs = []
    for d in root.iter("details"):
        s = d.find("summary")
        q = norm(s.text_content()) if s is not None else ""
        a = norm(" ".join(c.text_content() for c in d if c is not s))
        if q and a: faqs.append({"q": q, "a": a})
    return out, h1_text, faqs

def dedupe(root, stats):
    """Elementor repeats blocks (desktop/mobile/tab variants). Keep the first occurrence only."""
    cand = []
    def drop(el, why):
        stats["dropped"][why] = stats["dropped"].get(why, 0) + 1
        for nb in ("getprevious", "getnext"):  # images hanging off a repeated block go with it (if they are repeats too)
            x = getattr(el, nb)()
            while x is not None and x.tag == "img":
                cand.append(x); x = getattr(x, nb)()
        el.drop_tree()
    # decorative step counters ("01", "02") rendered as headings
    for h in list(root.iter("h1", "h2", "h3", "h4")):
        if re.fullmatch(r"\d{1,2}", norm(h.text_content())): drop(h, "step-number heading")
    # exact repeats of headings / paragraphs / lists (first one wins). A short line that repeats inside a *different*
    # section is kept; it is only dropped when it belongs to a section whose heading was itself a repeat.
    seen, in_dropped = set(), False
    for el in list(root.iter("h2", "h3", "h4", "p", "ul", "ol")):
        if any(a.tag == "details" for a in el.iterancestors()): continue
        if el.getparent() is None: continue
        t = norm(el.text_content())
        is_h = el.tag in ("h2", "h3", "h4")
        if len(t) < (8 if is_h else 25): continue
        key = (el.tag if is_h else "block", t.lower())
        if key in seen and (is_h or len(t) >= 100 or in_dropped):
            drop(el, "repeated block")
            if is_h: in_dropped = True
            continue
        if is_h: in_dropped = False
        seen.add(key)
    # images that belonged to a dropped repeat and were already used earlier
    imgs = list(root.iter("img"))
    order = {im: n for n, im in enumerate(imgs)}
    first = {}
    for im in imgs: first.setdefault(im.get("src"), order[im])
    for im in cand:
        if im in order and im.getparent() is not None and order[im] > first.get(im.get("src"), -1):
            stats["dropped"]["repeated image"] = stats["dropped"].get("repeated image", 0) + 1; im.drop_tree()
    # consecutive identical images
    prev = None
    for im in list(root.iter("img")):
        if prev is not None and im.getprevious() is prev and im.get("src") == prev.get("src"):
            stats["dropped"]["repeated image"] = stats["dropped"].get("repeated image", 0) + 1; im.drop_tree(); continue
        prev = im
    # remove wrappers that became empty
    for _ in range(3):
        for el in list(root.iter("div", "section", "p", "ul", "ol", "li")):
            if el is not root and not norm(el.text_content()) and not list(el.iter("img")) and not list(el.iter("br")): el.drop_tree()

def prose_summary(html_str, n=155):
    t = norm(re.sub(r"<[^>]+>", " ", html_str))
    return (t[: n - 1].rsplit(" ", 1)[0] + "…") if len(t) > n else t

entries, report = [], []
for p in sorted(pages, key=lambda x: x["path"]):
    stats = {"dropped": {}, "shortcodes": [], "images": [], "alt_filled": 0}
    body, h1, faqs = clean(p["content"], stats)
    m = p["meta"]
    title_h = h1 or norm(p["wp_title"]).title()
    seo_title = resolve(m.get("rank_math_title"), title_h) or f"{title_h} | {SITE_NAME}"
    seo_desc = resolve(m.get("rank_math_description"), title_h) or norm(p["excerpt"]) or prose_summary(body)
    robots = None
    mr = m.get("rank_math_robots", "")
    if mr:
        robots = ", ".join(sorted(set(re.findall(r'"(noindex|index|nofollow|follow|noarchive|nosnippet|noimageindex)"', mr)))) or None
    og_id = None
    ids = re.findall(r"i:\d+;i:(\d+);", m.get("rank_math_og_content_image", "").split('"images";', 1)[-1])
    # Rank Math lists every content image; the live og:image for the consulting page is the largest one (510x519 webp), not the first icon.
    if ids: og_id = max(ids, key=lambda i: (attach.get(i, {}).get("area", 0), ids.index(i)))
    og_id = (re.search(r"(\d+)", m.get("rank_math_facebook_image_id", "") or "") or [None, None])[1] or p["thumb"] or og_id
    og = local(attach.get(og_id, {}).get("url", "")) if og_id else ""
    if og: stats["images"].append(og)
    segs = [s for s in p["path"].split("/") if s]
    depth_parent = 2 if segs[0] == "industries" else 1
    parent = "/" + "/".join(segs[:-1]) + "/" if len(segs) > depth_parent else None
    slug = "__".join(segs)
    e = {
        "slug": slug, "path": p["path"], "sourceUrl": ORIGIN + p["path"], "wpId": int(p["id"]), "title": title_h, "parent": parent,
        "seo": {"title": seo_title, "description": seo_desc, "canonical": None, "robots": robots, "ogType": "article",
                "ogImage": og, "ogImageAlt": None, "twitterCard": "summary_large_image",
                "published": (p["date"] or "").replace(" ", "T") + "Z" if p["date"] else None,
                "modified": (p["modified"] or "").replace(" ", "T") + "Z" if p["modified"] else None,
                "focusKeyword": m.get("rank_math_focus_keyword") or None},
        "faqs": faqs, "jsonLd": [], "html": body,
    }
    entries.append(e)
    internal = sorted({l for l in re.findall(r'href="(/[^"#?]*)', body)})
    report.append({"path": p["path"], "wpId": e["wpId"], "seoTitle": seo_title, "seoDescriptionChars": len(seo_desc), "titleHadVariables": "%" in (m.get("rank_math_title") or ""),
                   "robots": robots, "ogImage": og or None, "htmlChars": len(body), "h2": body.count("<h2"), "faqs": len(faqs), "images": len(set(stats["images"])),
                   "altFilledFromMediaLibrary": stats["alt_filled"], "dropped": stats["dropped"], "shortcodes": stats["shortcodes"], "internalLinks": internal})

ent_dir = OUT / "src/content/industries/entries"
ent_dir.mkdir(parents=True, exist_ok=True)
for old in ent_dir.glob("*.json"): old.unlink()
for e in entries: (ent_dir / f"{e['slug']}.json").write_text(json.dumps(e, ensure_ascii=False, indent=1), encoding="utf-8")
index = [{"slug": e["slug"], "path": e["path"], "title": e["title"], "parent": e["parent"], "description": e["seo"]["description"], "ogImage": e["seo"]["ogImage"]} for e in entries]
(OUT / "src/content/industries/index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
(OUT / "migration").mkdir(exist_ok=True)
known = {e["path"] for e in entries}
for r in report: r["internalLinksNotInIndustries"] = [l for l in r["internalLinks"] if l not in known]
(OUT / "migration/industries-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
imgs = sorted({i for r_e in entries for i in re.findall(r'src="(/wp-content/[^"]+)"', r_e["html"])} | {e["seo"]["ogImage"] for e in entries if e["seo"]["ogImage"]})
with open(OUT / "migration/industries-images.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["path"]); [w.writerow([i]) for i in imgs]
(OUT / "public").mkdir(exist_ok=True)
(OUT / "public/sitemap-industries.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(f"  <url><loc>{ORIGIN}{e['path']}</loc></url>" for e in entries) + "\n</urlset>\n")
print(f"{len(entries)} pages, {len(imgs)} unique images")
