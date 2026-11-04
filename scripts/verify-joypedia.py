#!/usr/bin/env python3
"""Independent check: for every source record, converted text must equal source
text minus ONLY the intentionally dropped parts (dynamic related-posts widgets+labels,
the title heading duplicated by the page hero, 'CTA' label headings).
Usage: python scripts/verify-joypedia.py <joypedia.json>"""
import json, re, sys
from pathlib import Path
from bs4 import BeautifulSoup as B
nw = lambda s: re.sub(r"\s+", "", s.replace("\xa0", " "))
src = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
root = Path(__file__).resolve().parent.parent / "src/content/joypedia/entries"
bad = []
rep = json.loads((root.parent.parent.parent.parent / "migration/joypedia/report.json").read_text())
removed = {}
for d in rep["consecutive_duplicate_paragraphs_removed"]:
    removed.setdefault(d["slug"], []).append(d["removed_text"])
for r in src:
    e = json.loads((root / f"{r['slug']}.json").read_text(encoding="utf-8"))
    s = B(r["content"]["rendered"], "html.parser")
    for x in s.select(".elementor-widget-posts,svg"):
        x.decompose()
    first = True
    for h in s.select(".elementor-widget-heading"):
        t = h.get_text(" ", strip=True)
        if re.match(r"Latest (Blogs|Case Studies)$", t) or re.fullmatch(r"CTA:?", t) or (first and t.lower() == e["title"].lower()):
            h.decompose()
        first = False
    st = nw(s.get_text(" "))
    o = []
    for b in e["blocks"]:
        if b["t"] == "h2": o.append(b["text"])
        elif b["t"] in ("p", "cta"): o.append(B(b["html"], "html.parser").get_text(" "))
        else:
            for i in b["items"]: o += [i["title"] or "", B(i["html"], "html.parser").get_text(" ")]
    o += removed.get(r["slug"], [])  # intentionally de-duplicated source repeats (see report.json)
    if sorted(st) != sorted(nw("".join(o))):
        bad.append(r["slug"])
print(f"records checked: {len(src)}; text mismatches: {len(bad)}", bad[:10])
sys.exit(1 if bad else 0)
