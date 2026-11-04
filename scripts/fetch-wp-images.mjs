// Downloads every image listed in migration/images-needed.csv from the old site into public/.
// Run on a machine that can reach https://marketjoy.com:   node scripts/fetch-wp-images.mjs [migration/<list>.csv]
//   default list: migration/images-needed.csv; products: node scripts/fetch-wp-images.mjs migration/products-images.csv
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const rows = readFileSync(process.argv[2] ?? "migration/images-needed.csv", "utf8").trim().split("\n").slice(1);
const paths = rows.map((r) => r.split(",")[0]).filter(Boolean);
let ok = 0, skipped = 0;
const failed = [];
async function one(p) {
  const dest = join("public", p);
  if (existsSync(dest)) return void skipped++;
  try {
    const res = await fetch("https://marketjoy.com" + p);
    if (!res.ok) throw new Error(String(res.status));
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) {
    failed.push(`${p} (${e.message})`);
  }
}
const queue = [...paths];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await one(queue.shift()); }));
console.log(`downloaded ${ok}, already present ${skipped}, failed ${failed.length}`);
if (failed.length) { writeFileSync("migration/images-failed.txt", failed.join("\n")); process.exit(1); }
