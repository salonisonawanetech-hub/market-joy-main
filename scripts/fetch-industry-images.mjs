// node scripts/fetch-industry-images.mjs [--list]
// Downloads every /wp-content/... image used by the industry pages (CSV + generated layouts + page components) into public/.
// Re-runnable: files that already exist are skipped. Failures are written to migration/industries-images-failed.txt.
import { readFile, readdir, access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://marketjoy.com";
const found = new Set();
const grab = (text) => { for (const m of text.matchAll(/\/wp-content\/[^"'\s,)\\<>]+\.(?:png|jpe?g|webp|svg|gif|avif)/gi)) found.add(m[0]); };

for (const csv of ["industries-images", "about-images", "products-images"]) {
  try { grab(await readFile(`migration/${csv}.csv`, "utf8")); } catch {}
}
// Industry pages, About page + team, and the product pages (hub + InfoJoy).
for (const dir of ["src/content/industries/layouts", "src/content/industries/entries", "src/components/pages", "src/content/about", "src/content/services"]) {
  for (const f of await readdir(dir)) if (/\.(json|tsx?)$/.test(f)) grab(await readFile(path.join(dir, f), "utf8"));
}
for (const f of ["products.json", "products__infojoy.json"]) grab(await readFile(path.join("src/content/services/entries", f), "utf8"));
const list = [...found].sort();
console.log(`${list.length} images referenced`);
if (process.argv.includes("--list")) { console.log(list.join("\n")); process.exit(0); }

let ok = 0, skip = 0, netErrors = 0, offline = false;
const fail = [];
const get = async (p) => {
  const r = await fetch(ORIGIN + p, { headers: { "user-agent": "Mozilla/5.0 (image migration)" }, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(String(r.status));
  const type = r.headers.get("content-type") ?? "";
  if (!/^image\//.test(type)) throw new Error("not an image: " + type);
  return Buffer.from(await r.arrayBuffer());
};
const one = async (p) => {
  if (offline) return;
  const dest = path.join("public", decodeURI(p));
  try { await access(dest); skip++; return; } catch {}
  const candidates = [p, p.replace(/-\d+x\d+(\.\w+)$/, "$1"), p.replace(/-scaled(\.\w+)$/, "$1")].filter((v, i, a) => a.indexOf(v) === i);
  let lastErr = "";
  for (const c of candidates) {
    try {
      const buf = await get(c);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, buf);
      ok++; netErrors = 0; return;
    } catch (e) {
      lastErr = e.message;
      if (!/^\d+$/.test(lastErr) && !lastErr.startsWith("not an image")) { // network-level failure (DNS, timeout, offline)
        if (++netErrors >= 12) { offline = true; return; }
      }
    }
  }
  fail.push(`${p} (${lastErr})`);
};
const q = [...list];
await Promise.all(Array.from({ length: 6 }, async () => { while (q.length) await one(q.shift()); }));
if (offline) console.log("Site not reachable - stopped early. Re-run when online (existing files are kept).");
console.log(`downloaded ${ok}, already there ${skip}, failed ${fail.length}`);
if (fail.length) { await writeFile("migration/industries-images-failed.txt", fail.join("\n")); console.log("see migration/industries-images-failed.txt"); }
