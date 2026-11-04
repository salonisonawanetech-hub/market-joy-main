#!/usr/bin/env python3
"""Validate the WordPress -> React migration.

Usage: python3 scripts/validate-migration.py <folder with the 5 export JSON files> [--root .]
Checks: source vs converted counts, duplicate slugs, malformed HTML, missing local images,
broken internal links / invalid routes. Writes migration/validation-report.json and exits 1 on failure.
"""
import glob, json, os, re, sys
from html.parser import HTMLParser
from urllib.parse import urlparse

args = [a for a in sys.argv[1:] if not a.startswith("--")]
SRC = args[0] if args else "."
ROOT = "."
if "--root" in sys.argv:
    ROOT = sys.argv[sys.argv.index("--root") + 1]

def jload(p):
    with open(p, encoding="utf-8-sig") as f:
        return json.load(f)

def find_src(name):
    m = glob.glob(os.path.join(SRC, f"*{name}*.json"))
    return m[0] if m else None

VOID = {"br", "img", "hr", "input", "meta", "link", "source", "wbr", "col"}

class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.errors, self.imgs, self.links = [], [], [], []
    def handle_starttag(self, t, a):
        a = dict(a)
        if t == "img":
            self.imgs.append(a)
        if t == "a" and a.get("href"):
            self.links.append(a["href"])
        if t not in VOID:
            self.stack.append(t)
    def handle_startendtag(self, t, a):
        self.handle_starttag(t, a)
        if t not in VOID and self.stack and self.stack[-1] == t:
            self.stack.pop()
    def handle_endtag(self, t):
        if t in VOID:
            return
        if t in self.stack:
            while self.stack and self.stack[-1] != t:
                self.errors.append(f"unclosed <{self.stack.pop()}>")
            self.stack.pop()
        else:
            self.errors.append(f"stray </{t}>")

def html_check(h):
    c = Check()
    c.feed(h)
    c.close()
    c.errors += [f"unclosed <{t}>" for t in c.stack]
    return c

# ---- routes -------------------------------------------------------------
routes = set()
content_ts = open(os.path.join(ROOT, "src/components/pages/content.ts"), encoding="utf-8").read()
routes |= {p.rstrip("/") or "/" for p in re.findall(r'path:\s*"(/[^"]*)"', content_ts)}
routes |= {"/" + k for k in re.findall(r'^  "([a-z0-9-]+)": \{', content_ts, re.M)}
BLOG_SLUGS = {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(ROOT, "src/data/blog/posts/*.json"))}
routes |= {"/" + s for s in BLOG_SLUGS}  # old root-level post URLs 301 to /blog/<slug> in src/routes/$.tsx
routes |= {"/", "/blog", "/joypedia", "/case-studies", "/industry-news", "/press-release"}
for kind, d, base in [("blog", "src/data/blog/posts", "/blog"), ("vendor", "src/data/vendors/pages", "/vendor"),
                      ("jp", "src/content/joypedia/entries", "/joypedia"),
                      ("cs", "src/content/case-studies/entries", "/case-studies"),
                      ("in", "src/content/industry-news/entries", "/industry-news"),
                      ("pr", "src/content/press-releases/entries", "/press-release")]:
    for f in glob.glob(os.path.join(ROOT, d, "*.json")):
        routes.add(f"{base}/{os.path.basename(f)[:-5]}")
# redirects handled in src/routes/$.tsx
redirects = set(re.findall(r'"(/[a-z0-9\-/]+)":\s*"/', open(os.path.join(ROOT, "src/content/redirects.ts"), encoding="utf-8").read())) \
    if os.path.exists(os.path.join(ROOT, "src/content/redirects.ts")) else set()
routes |= {r.rstrip("/") for r in redirects}

def norm_link(h):
    u = urlparse(h)
    if u.scheme in ("http", "https"):
        if u.netloc.replace("www.", "") != "marketjoy.com":
            return None
    elif u.scheme or h.startswith(("#", "mailto:", "tel:")):
        return None
    p = u.path or "/"
    return p.rstrip("/") or "/"

report, ok = {}, True
TYPES = [
    ("case-studies", "case-studies", "src/content/case-studies/entries"),
    ("industry-news", "industry-news", "src/content/industry-news/entries"),
    ("press-release", "press-release", "src/content/press-releases/entries"),
    ("joypedia", "joypedia", "src/content/joypedia/entries"),
]
all_missing_imgs, all_broken_links = {}, {}
for name, key, d in TYPES:
    sp = find_src(key)
    if not sp:
        report[name] = {"status": "SOURCE FILE NOT FOUND"}
        ok = False
        continue
    src = jload(sp)
    src = src if isinstance(src, list) else [src]
    src_slugs = [r["slug"] for r in src]
    conv = {os.path.basename(f)[:-5]: jload(f) for f in glob.glob(os.path.join(ROOT, d, "*.json"))}
    missing = sorted(set(src_slugs) - set(conv))
    extra = sorted(set(conv) - set(src_slugs))
    dup_src = sorted({s for s in src_slugs if src_slugs.count(s) > 1})
    bad_html, imgs_missing, links_bad, empty = {}, [], [], []
    for slug, e in conv.items():
        h = e.get("html") or e.get("content") or json.dumps(e.get("blocks") or "").replace('\\"', '"')
        if not re.sub(r"<[^>]+>|\s|&nbsp;", "", h):
            empty.append(slug)
        c = html_check(h)
        if c.errors:
            bad_html[slug] = c.errors[:5]
        srcs = [i.get("src", "") for i in c.imgs]
        fi = (e.get("featuredImage") or {}).get("src")
        if fi:
            srcs.append(fi)
        for s in srcs:
            if s.startswith("/") and not os.path.exists(os.path.join(ROOT, "public", s.lstrip("/"))):
                imgs_missing.append(s)
        for l in c.links:
            n = norm_link(l)
            if n and n not in routes and not n.startswith(("/wp-content", "/blog/page")):
                links_bad.append((slug, l))
    all_missing_imgs[name] = sorted(set(imgs_missing))
    all_broken_links[name] = links_bad
    r = {
        "source_records": len(src), "converted_records": len(conv),
        "missing_in_output": missing, "extra_in_output": extra, "duplicate_slugs_in_source": dup_src,
        "empty_body": empty, "malformed_html": bad_html,
        "images_missing_locally": len(set(imgs_missing)), "broken_internal_links": len(links_bad),
        "routes_valid": all(f"/{key}/{s}" in routes for s in conv),
    }
    r["status"] = "PASS" if not (missing or extra or bad_html or not r["routes_valid"]) else "FAIL"
    ok &= r["status"] == "PASS"
    report[name] = r

# testimonials
sp = find_src("testimonials")
if sp:
    src = jload(sp)
    conv = jload(os.path.join(ROOT, "src/content/testimonials/testimonials.json"))
    names = [t["name"] for t in conv]
    report["testimonials"] = {
        "source_records": len(src), "converted_records": len(conv),
        "missing": sorted({r["slug"] for r in src} - {t["slug"] for t in conv}),
        "with_quote": sum(1 for t in conv if t["quote"]), "without_quote": [t["name"] for t in conv if not t["quote"]],
        "duplicate_names": sorted({n for n in names if names.count(n) > 1}),
    }
    report["testimonials"]["status"] = "PASS" if len(src) == len(conv) and not report["testimonials"]["missing"] else "FAIL"
    ok &= report["testimonials"]["status"] == "PASS"

# FAQs
fp = os.path.join(ROOT, "src/content/faqs/faqs.json")
if os.path.exists(fp):
    f = jload(fp)
    qs = [norm for norm in (re.sub(r"\W+", " ", x["question"]).strip().lower() for x in f["items"])]
    dups = sorted({q for q in qs if qs.count(q) > 1})
    live = [x for x in f["items"] if x.get("answer")]
    report["faqs"] = {"total_questions": len(f["items"]), "with_answer": len(live),
                      "pending_source": len(f["items"]) - len(live), "exact_duplicate_questions": dups,
                      "status": "PASS" if not dups else "FAIL"}
    ok &= report["faqs"]["status"] == "PASS"

report["_images_missing_by_type"] = {k: len(v) for k, v in all_missing_imgs.items()}
report["_broken_links_sample"] = {k: v[:10] for k, v in all_broken_links.items() if v}
os.makedirs(os.path.join(ROOT, "migration"), exist_ok=True)
json.dump(report, open(os.path.join(ROOT, "migration/validation-report.json"), "w"), indent=1)
json.dump({k: v for k, v in all_missing_imgs.items()}, open(os.path.join(ROOT, "migration/missing-images.json"), "w"), indent=1)
print(json.dumps(report, indent=1)[:6000])
sys.exit(0 if ok else 1)
