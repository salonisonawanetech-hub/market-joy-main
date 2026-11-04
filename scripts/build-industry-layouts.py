#!/usr/bin/env python3
"""Re-runnable: python scripts/build-industry-layouts.py
Reads src/content/industries/entries/*.json (flat WordPress HTML) and writes src/content/industries/layouts/<slug>.json:
layouts/<slug>.json = list of layout blocks used by IndustryBlocks.tsx. Entries it cannot structure are left out (old article layout)."""
import glob, html as H, json, os, re
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "src/content/industries/entries")
OUT = os.path.join(ROOT, "src/content/industries/layouts")
SKIP = {"industries"}  # the hub page keeps its own gallery layout
UNWRAP = {"div", "section", "article"}
VOID = {"br", "img", "hr", "input"}
SECTION_WORDS = re.compile(r"\b(challenges?|services?|benefits?|why|how|what|markets?|who|solutions?|process|results?|reach|choose|different|works?|help|industries|segments?|types?|areas?)\b", re.I)
STEPS_WORDS = re.compile(r"\b(works?|process|steps?|journey|approach|roadmap)\b", re.I)


def plain(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", H.unescape(s).replace("\xa0", " ")).strip()


class Top(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.nodes, self.depth, self.tag, self.attrs, self.buf, self.bare = [], 0, None, {}, [], []

    def flush_bare(self):
        raw = "".join(self.bare).strip()
        self.bare = []
        if plain(raw):
            self.nodes.append({"tag": "text", "html": raw, "text": plain(raw)})

    def handle_starttag(self, t, a):
        if self.depth == 0:
            if t in UNWRAP:
                self.flush_bare(); return
            if t == "br":
                self.bare.append("<br>"); return
            if t == "img":
                self.flush_bare(); d = dict(a)
                self.nodes.append({"tag": "img", "src": d.get("src", ""), "alt": d.get("alt", ""), "w": int(d.get("width") or 0), "html": "", "text": ""}); return
            self.flush_bare(); self.tag, self.attrs, self.buf = t, dict(a), []
            self.depth = 1; return
        if t not in VOID: self.depth += 1
        self.buf.append(self.get_starttag_text())

    def handle_startendtag(self, t, a):
        self.handle_starttag(t, a)

    def handle_endtag(self, t):
        if self.depth == 0: return
        self.depth -= 1
        if self.depth == 0:
            inner = "".join(self.buf)
            self.nodes.append({"tag": self.tag, "html": inner, "text": plain(inner), "attrs": self.attrs})
            self.tag = None
        else:
            self.buf.append(f"</{t}>")

    def handle_data(self, d):
        (self.buf if self.depth else self.bare).append(d)

    def handle_entityref(self, n):
        self.handle_data(f"&{n};")

    def handle_charref(self, n):
        self.handle_data(f"&#{n};")

    def close(self):
        super().close(); self.flush_bare()


def outer(n):
    if n["tag"] == "text": return f"<p>{n['html']}</p>"
    if n["tag"] == "img": return ""
    return f"<{n['tag']}>{n['html']}</{n['tag']}>"


def is_title(t):
    return 0 < len(t.split()) <= 9 and not t.endswith((".", "?", "!", ":")) or (0 < len(t.split()) <= 9 and t.endswith("?"))


def label_split(n):
    m = re.match(r"^\s*<(strong|b)>(.*?)</\1>\s*(.*)$", n["html"], re.S | re.I)
    if m and plain(m.group(2)) and plain(m.group(3)) and is_title(plain(m.group(2))) and "." not in plain(m.group(2)) and len(plain(m.group(2)).split()) <= 6:
        return plain(m.group(2)), f"<p>{m.group(3).strip()}</p>"
    return None


def ctas_of(nodes):
    out = []
    for n in nodes:
        if n["tag"] == "a":
            out.append({"label": n["text"], "href": n["attrs"].get("href", "#")})
        elif n["tag"] == "p":
            ms = re.findall(r'^\s*<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>\s*$', n["html"], re.S)
            for href, lab in ms: out.append({"label": plain(lab), "href": href})
    return out


def is_cta_node(n):
    return n["tag"] == "a" or (n["tag"] == "p" and re.match(r'^\s*<a [^>]*>.*?</a>\s*$', n["html"], re.S) is not None)


def junk(n):
    t = n["text"]
    return n["tag"] != "img" and (not t or re.search(r"\b0\s*[+%x]\b", t) and len(t) < 160)  # flattened counters ("Leads 0 +")


def body_html(nodes):
    return "".join(outer(n) for n in nodes if n["tag"] not in ("img", "a") and not is_cta_node(n) and not junk(n))


def card_from(title, nodes, img=None):
    c = {"title": title}
    h = body_html(nodes)
    if h: c["html"] = h
    if img: c["img"] = img
    return c


def build_unit(title, nodes):
    """One H2 unit -> list of blocks."""
    blocks = []
    details = [n for n in nodes if n["tag"] == "details"]
    rest = [n for n in nodes if n["tag"] != "details"]
    ctas = ctas_of(rest)
    imgs = [n for n in rest if n["tag"] == "img"]
    heads = [i for i, n in enumerate(rest) if n["tag"] in ("h3", "h4", "h5", "h6")]
    main = None
    icon_imgs = [i for i, n in enumerate(rest) if n["tag"] == "img" and (n["w"] == 0 or n["w"] <= 320)]
    if len(icon_imgs) >= 3:  # image-led items
        lead = body_html(rest[: icon_imgs[0]])
        items = []
        for k, i in enumerate(icon_imgs):
            end = icon_imgs[k + 1] if k + 1 < len(icon_imgs) else len(rest)
            seg = [n for n in rest[i + 1 : end] if not is_cta_node(n)]
            seg = [n for n in seg if not junk(n)]
            if seg and seg[0]["tag"] in ("p", "text", "h3", "h4", "h5", "h6") and is_title(seg[0]["text"]) and (len(seg) > 1 or seg[0]["tag"] != "text"):
                items.append(card_from(seg[0]["text"], seg[1:], rest[i]["src"]))
            elif seg and seg[0]["tag"] in ("p", "text", "h3") and len(seg[0]["text"].split()) <= 14 and len(seg) == 1:
                items.append(card_from(seg[0]["text"], [], rest[i]["src"]))
            elif seg:
                items.append({"title": "", "html": body_html(seg), "img": rest[i]["src"]})
        if len(items) >= 3:
            main = {"k": "cards", "title": title, "lead": lead, "items": items, "style": "icons"}
    if not main and len(heads) >= 3:  # heading-led items
        lead = body_html(rest[: heads[0]])
        items, i = [], 0
        hs = heads + [len(rest)]
        for k in range(len(heads)):
            seg = rest[hs[k] : hs[k + 1]]
            t, body = seg[0]["text"], seg[1:]
            if body == [] and k + 1 < len(heads) and False: pass
            items.append(card_from(t, body))
        # h3 title immediately followed by an h3 sentence (title/description pairs)
        merged, k = [], 0
        while k < len(items):
            it = items[k]
            nxt = items[k + 1] if k + 1 < len(items) else None
            if "html" not in it and nxt and "html" not in nxt and len(nxt["title"].split()) > 7 and len(it["title"].split()) <= 9:
                merged.append({"title": it["title"], "html": f"<p>{nxt['title']}</p>"}); k += 2
            else:
                merged.append(it); k += 1
        items = merged
        if len(items) >= 3:
            style = "steps" if STEPS_WORDS.search(title) and len(items) <= 6 else "cards"
            main = {"k": "cards", "title": title, "lead": lead, "items": items, "style": style}
    if not main:
        paras = [n for n in rest if n["tag"] in ("p", "text") and not is_cta_node(n) and not junk(n)]
        lab = [label_split(n) for n in paras]
        if len(paras) >= 4 and sum(1 for x in lab if x) >= 3:  # "<strong>Label</strong> text" runs
            first = next(i for i, x in enumerate(lab) if x)
            lead = body_html([n for n in paras[:first]])
            items = [{"title": x[0], "html": x[1]} for x in lab if x]
            main = {"k": "cards", "title": title, "lead": lead, "items": items, "style": "cards"}
    if not main:
        side = next((n for n in imgs if n["w"] >= 200), None)
        main = {"k": "prose", "title": title, "html": body_html(rest)}
        if side: main["img"] = side["src"]
    if ctas: main["ctas"] = ctas
    if main["k"] == "prose" and not main["html"] and not main.get("ctas") and not main.get("img"):
        if title and details == []: main = {"k": "prose", "title": title, "html": ""}
    blocks.append(main)
    if details:
        items = []
        for d in details:
            m = re.search(r"<summary[^>]*>(.*?)</summary>(.*)", d["html"], re.S)
            if m: items.append({"q": plain(m.group(1)), "a": m.group(2).strip()})
        if items: blocks.append({"k": "faq", "title": "Frequently Asked Questions" if re.search(r"faq|frequently|questions", title, re.I) is None else title, "items": items})
        if blocks[0]["k"] == "prose" and re.search(r"faq|frequently|questions", title, re.I) and not blocks[0]["html"]:
            blocks.pop(0)
    return blocks


def is_small(u):
    body = [n for n in u["nodes"] if n["tag"] not in ("img",) and not is_cta_node(n) and not junk(n)]
    if any(n["tag"] in ("details", "table", "ul", "h3", "h4", "h5", "h6") for n in body): return False
    if len([n for n in u["nodes"] if n["tag"] == "img"]) > 1: return False
    return len(body) <= 2 and len(u["title"].split()) <= 9 and sum(len(n["text"]) for n in body) <= 420 and all(n["tag"] in ("p", "text") for n in body)


def section_like(u):
    return bool(SECTION_WORDS.search(u["title"])) and len(u["title"].split()) >= 4


def convert(entry):
    p = Top(); p.feed(entry["html"]); p.close()
    nodes = [n for n in p.nodes if not (n["tag"] in ("p", "text") and not n["text"])]
    # intro = everything before the first h2
    i = next((k for k, n in enumerate(nodes) if n["tag"] == "h2"), len(nodes))
    intro_nodes, rest = nodes[:i], nodes[i:]
    blocks = []
    intro = {"k": "intro", "html": body_html([n for n in intro_nodes if n["tag"] not in ("h1",)]), "ctas": ctas_of(intro_nodes)}
    side = next((n for n in intro_nodes if n["tag"] == "img" and n["w"] >= 200), None)
    if side: intro["img"] = side["src"]
    if intro["html"] or intro["ctas"]: blocks.append(intro)
    # h2 units
    units, cur = [], None
    for n in rest:
        if n["tag"] == "h2":
            cur = {"title": n["text"], "nodes": []}; units.append(cur)
        elif cur is not None:
            cur["nodes"].append(n)
    k = 0
    while k < len(units):
        u = units[k]
        if not [n for n in u["nodes"] if not junk(n)] and k + 1 < len(units) and not units[k + 1].get("eyebrow") and not is_small(units[k + 1]):
            units[k + 1]["eyebrow"] = u["title"]; k += 1; continue
        if re.match(r"^(contact us|get in touch)", u["title"], re.I) and len(u["nodes"]) <= 3 and ctas_of(u["nodes"]):
            blocks.append({"k": "cta", "title": u["title"], "html": "", "ctas": ctas_of(u["nodes"])}); k += 1; continue
        if u["title"].endswith("?"):
            j = k
            while j < len(units) and units[j]["title"].endswith("?") and not any(n["tag"] == "details" for n in units[j]["nodes"]): j += 1
            if j - k >= 3:
                blocks.append({"k": "faq", "title": "Common questions", "items": [{"q": x["title"], "a": body_html(x["nodes"])} for x in units[k:j]]}); k = j; continue
        if is_small(u):
            j = k + 1
            while j < len(units) and is_small(units[j]) and not section_like(units[j]) and not re.match(r"^(contact us|get in touch)", units[j]["title"], re.I): j += 1
            run = units[k:j]
            if len(run) >= 3:
                head = None
                first = run[0]
                has_body = lambda x: bool(body_html(x["nodes"]))
                if (not has_body(first) and any(has_body(x) for x in run[1:])) or section_like(first):
                    head, run = first, run[1:]
                items = []
                for x in run:
                    img = next((n["src"] for n in x["nodes"] if n["tag"] == "img"), None)
                    items.append(card_from(x["title"], x["nodes"], img))
                chips = sum(1 for c in items if "html" not in c) >= len(items) * 0.7
                blk = {"k": "cards", "title": head["title"] if head else "", "lead": body_html(head["nodes"]) if head else "", "items": items, "style": "chips" if chips else "cards"}
                allc = ctas_of(sum([x["nodes"] for x in ([head] if head else []) + run], []))
                if allc: blk["ctas"] = allc
                blocks.append(blk); k = j; continue
        nb = build_unit(u["title"], u["nodes"])
        if u.get("eyebrow") and nb: nb[0]["eyebrow"] = u["eyebrow"]
        blocks.extend(nb); k += 1
    # drop blocks with nothing to show
    out = []
    for b in blocks:
        if b["k"] == "prose" and not (b.get("html") or b.get("ctas") or b.get("img")):
            continue
        out.append(b)
    return out


def main():
    layouts, skipped = {}, []
    for f in sorted(glob.glob(os.path.join(SRC, "*.json"))):
        e = json.load(open(f, encoding="utf-8"))
        if e["slug"] in SKIP: continue
        try:
            b = convert(e)
        except Exception as ex:  # keep the old layout for anything unexpected
            skipped.append((e["slug"], repr(ex))); continue
        if len(b) >= 3: layouts[e["slug"]] = b
        else: skipped.append((e["slug"], f"only {len(b)} blocks"))
    os.makedirs(OUT, exist_ok=True)
    for old in glob.glob(os.path.join(OUT, "*.json")): os.remove(old)
    for slug, b in layouts.items():
        json.dump(b, open(os.path.join(OUT, slug + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"layouts for {len(layouts)} pages -> {os.path.relpath(OUT, ROOT)}/")
    for s in skipped: print("  kept old layout:", s)


if __name__ == "__main__":
    main()
