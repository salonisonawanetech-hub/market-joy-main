#!/usr/bin/env python3
"""Verify the CPT migration. Usage: python scripts/verify-cpt.py --src <json folder> [--root .] [--project <project root for route lookup>]
Exit code 1 if any hard check fails."""
import argparse, glob, json, re, sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from bs4 import BeautifulSoup

VOID = {"br", "img", "hr", "input", "meta", "link"}
T = {"case-studies": "case-studies.json", "industry-news": "industry-news.json", "press-releases": "press-release.json"}


class Balance(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack, self.errors = [], []
    def handle_starttag(self, t, a):
        if t not in VOID: self.stack.append(t)
    def handle_endtag(self, t):
        if t in VOID: return
        if not self.stack or self.stack[-1] != t: self.errors.append(f"unexpected </{t}> (open: {self.stack[-3:]})")
        else: self.stack.pop()


def ws(s): return re.sub(r"\s+", " ", (s or "").replace("\xa0", " ")).strip()


def src_text(raw):
    s = BeautifulSoup(raw, "html.parser")
    for t in s(["style", "script", "svg"]): t.decompose()
    ws_ = s.select("[data-widget_type]")
    if ws_:
        for w in ws_:
            if w["data-widget_type"].split(".")[0] in ("posts", "shortcode", "rating", "divider", "post-info", "spacer"):
                w.decompose()
    return ws(s.get_text(" "))


def words(t): return re.findall(r"[A-Za-z0-9’'%$.-]+", t.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True); ap.add_argument("--root", default="."); ap.add_argument("--project", default=None)
    a = ap.parse_args(); root = Path(a.root); fails, notes = [], []
    known = set()
    proj = Path(a.project or a.root)
    for pat, rx in [("src/data/blog/posts/*.json", "/blog/{}/"), ("src/data/vendors/pages/*.json", "/vendor/{}/"), ("src/content/joypedia/entries/*.json", "/joypedia/{}/")]:
        for p in glob.glob(str(proj / pat)): known.add(rx.format(Path(p).stem))
    for key, fn in T.items():
        recs = json.loads(Path(glob.glob(str(Path(a.src) / ("*" + fn)))[0]).read_text(encoding="utf-8-sig"))
        recs = [recs] if isinstance(recs, dict) else recs
        ents = {Path(p).stem: json.loads(Path(p).read_text(encoding="utf-8")) for p in glob.glob(str(root / f"src/content/{key}/entries/*.json"))}
        for e in ents.values(): known.add(e["path"])
        idx = json.loads((root / f"src/content/{key}/index.json").read_text(encoding="utf-8"))
        print(f"== {key}: source {len(recs)} | entries {len(ents)} | index {len(idx)}")
        if not (len(recs) == len(ents) == len(idx)): fails.append(f"{key}: count mismatch")
        if len({i['slug'] for i in idx}) != len(idx): fails.append(f"{key}: duplicate slugs")
        low = []
        for r in recs:
            e = ents.get(r["slug"])
            if not e: fails.append(f"{key}/{r['slug']}: missing"); continue
            b = Balance(); b.feed(e["html"]); b.close()
            if b.errors or b.stack: fails.append(f"{key}/{r['slug']}: malformed HTML {b.errors[:2]} unclosed={b.stack}")
            if not ws(BeautifulSoup(e["html"], "html.parser").get_text()): fails.append(f"{key}/{r['slug']}: empty body")
            sw, cw = Counter(words(src_text(r["content"]["rendered"]))), Counter(words(BeautifulSoup(e["html"], "html.parser").get_text(" ")))
            total = sum(sw.values()) or 1
            missing = sum((sw - cw).values())
            # headings/title and hero badges are intentionally removed, so allow a small gap
            if missing / total > 0.06: low.append((r["slug"], round(100 * missing / total, 1)))
            for m in re.finditer(r'src="([^"]+)"', e["html"]):
                if not m.group(1).startswith(("/wp-content/", "https://www.youtube.com/embed/")): fails.append(f"{key}/{r['slug']}: non-local src {m.group(1)[:60]}")
            for m in re.finditer(r'href="(/[^"#?]*)', e["html"]):
                h = m.group(1)
                if not h.endswith("/"): h += "/"
                notes.append((key, r["slug"], h))
        print(f"   text-loss > 6% (words in source not in output): {low if low else 'none'}")
        if low: notes.append((key, "TEXT-LOSS", str(low)))
    # internal links
    page_paths = set()
    cp = proj / "src/components/pages/content.ts"
    if cp.exists(): page_paths = set(re.findall(r'"(/[a-z0-9\-/]+)"', cp.read_text(encoding="utf-8", errors="ignore")))
    page_paths = {p if p.endswith("/") else p + "/" for p in page_paths}
    broken = Counter(); 
    for k, s, h in notes:
        if s == "TEXT-LOSS": continue
        if h not in known and h not in page_paths: broken[(k, h)] += 1
    print("== internal links not matching any known route (may be old-site-only pages):")
    for (k, h), c in sorted(broken.items()): print("  ", k, h, c)
    print("RESULT:", "FAIL" if fails else "PASS")
    for f in fails: print("  FAIL", f)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
