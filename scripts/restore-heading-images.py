#!/usr/bin/env python3
"""Restores <img> elements that the first converter dropped because they were wrapped in a heading
(<h1><img ...></h1>) in the WordPress HTML. The image is re-inserted as <p><img></p> right after the block
that preceded it in the source. Idempotent. Usage: restore-heading-images.py <export-folder>"""
import glob, html, json, os, re, sys
SRC = sys.argv[1]
TYPES = [("case-studies", "case-studies"), ("industry-news", "industry-news"), ("press-release", "press-releases")]
norm = lambda t: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).replace(" ", " ").strip().lower()
log = []
for key, d in TYPES:
    f = glob.glob(os.path.join(SRC, f"*{key}.json"))[0]
    src = json.load(open(f, encoding="utf-8-sig"))
    src = src if isinstance(src, list) else [src]
    for r in src:
        p = f"src/content/{d}/entries/{r['slug']}.json"
        c = json.load(open(p, encoding="utf-8"))
        h = r["content"]["rendered"]
        changed = False
        blocks = list(re.finditer(r"<(p|h[1-6]|li)\b[^>]*>(.*?)</\1>", h, re.S))
        for n, m in enumerate(blocks):
            if m.group(1)[0] != "h" or not re.search(r"<img\b", m.group(2)):
                continue
            for im in re.findall(r"<img\b[^>]*>", m.group(2)):
                u = re.search(r'\ssrc="([^"]+)"', im)
                if not u:
                    continue
                path = re.sub(r"^https?://(www\.)?marketjoy\.com", "", u.group(1))
                if os.path.basename(path) in c["html"]:
                    continue
                alt = re.search(r'\salt="([^"]*)"', im)
                tag = f'<p><img src="{path}" alt="{alt.group(1) if alt else ""}" loading="lazy" decoding="async"></p>'
                prev = next((norm(b.group(2)) for b in reversed(blocks[:n]) if len(norm(b.group(2))) > 20), "")
                key_txt = prev[:50]
                where = "end"
                if key_txt:
                    for pm in re.finditer(r"</(p|h[1-6]|ul|ol)>", c["html"]):
                        pass
                    idx = -1
                    for bm in re.finditer(r"<(p|h[1-6]|li)\b[^>]*>(.*?)</\1>", c["html"], re.S):
                        if key_txt in norm(bm.group(2)):
                            idx = bm.end()
                            break
                    if idx >= 0:
                        c["html"] = c["html"][:idx] + " " + tag + c["html"][idx:]
                        where = "after previous block"
                    else:
                        c["html"] += " " + tag
                else:
                    c["html"] += " " + tag
                changed = True
                log.append((r["slug"], os.path.basename(path), where))
        if changed:
            json.dump(c, open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
for l in log:
    print(*l, sep=" | ")
print("restored", len(log))
