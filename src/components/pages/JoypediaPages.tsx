import { useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronRight, Search } from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { Navbar } from "@/components/home/Navbar";
import { Reveal } from "@/components/home/Reveal";
import { FinalCta, Footer } from "@/components/home/Sections";
import {
  JOYPEDIA_INDEX,
  type JoypediaBlock,
  type JoypediaEntry,
  type JoypediaIndexItem,
} from "@/content/joypedia/loader";

/* ---------------- shared hero ---------------- */
function Hero({
  eyebrow,
  title,
  sub,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  sub?: string | undefined;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 -z-20">
        <GatewayFlow className="h-full w-full" density={0.6} />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_25%_50%,rgb(15_32_64/0.8),transparent_65%),radial-gradient(ellipse_at_center,transparent_40%,rgb(15_32_64/0.85)_100%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-xs text-navy-foreground/70"
        >
          <a href="/" className="hover:text-gold">
            Home
          </a>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {c.href ? (
                <a href={c.href} className="hover:text-gold">
                  {c.label}
                </a>
              ) : (
                <span className="line-clamp-1 max-w-[16rem] text-navy-foreground sm:max-w-md">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <Reveal from="left">
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <Reveal
          from="left"
          delay={80}
          as="h1"
          className="mt-4 max-w-4xl text-[1.75rem] font-extrabold leading-[1.15] min-[400px]:text-3xl sm:text-4xl lg:text-[2.75rem]"
        >
          {title}
        </Reveal>
        {sub && (
          <Reveal
            from="left"
            delay={160}
            className="mt-5 max-w-2xl text-base text-navy-foreground/85 sm:text-lg"
          >
            {sub}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------- listing (/joypedia) ---------------- */
const letterOf = (title: string) => {
  const c = title.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
};

export function JoypediaListing() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...JOYPEDIA_INDEX].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );
  const letters = useMemo(() => [...new Set(sorted.map((i) => letterOf(i.title)))].sort(), [sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (i) =>
        (!letter || letterOf(i.title) === letter) &&
        (!q || i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)),
    );
  }, [sorted, query, letter]);

  const groups = useMemo(() => {
    const m = new Map<string, JoypediaIndexItem[]>();
    filtered.forEach((i) => {
      const l = letterOf(i.title);
      m.set(l, [...(m.get(l) ?? []), i]);
    });
    return [...m.entries()];
  }, [filtered]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          eyebrow="Resources"
          title="JoyPedia"
          sub="Our B2B sales and marketing knowledge base."
          crumbs={[{ label: "JoyPedia" }]}
        />
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative mx-auto max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${JOYPEDIA_INDEX.length} terms...`}
                aria-label="Search JoyPedia"
                className="w-full rounded-full border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Filter by letter">
              <button
                type="button"
                onClick={() => setLetter(null)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  letter === null ? "bg-gold text-navy" : "bg-muted text-muted-foreground"
                }`}
              >
                All
              </button>
              {letters.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLetter(l === letter ? null : l)}
                  className={`h-8 w-8 rounded-full text-xs font-semibold ${
                    letter === l ? "bg-gold text-navy" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {JOYPEDIA_INDEX.length} terms
            </p>

            {groups.length === 0 && (
              <p className="mt-10 text-center text-muted-foreground">
                No terms match your search. Try a different word.
              </p>
            )}

            {groups.map(([l, items]) => (
              <div key={l} className="mt-10">
                <h2 className="mb-4 border-b pb-2 text-2xl font-extrabold text-navy">{l}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((i) => (
                    <a key={i.slug} href={`/joypedia/${i.slug}/`} className="card-glow flex flex-col p-5">
                      <h3 className="text-lg font-bold">{i.title}</h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                        {i.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                        Read More <ArrowRight className="arrow h-4 w-4" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ---------------- entry (/joypedia/<slug>) ---------------- */
function Block({ b }: { b: JoypediaBlock }) {
  // Content comes from our own WordPress export and was sanitised at migration time.
  switch (b.t) {
    case "h2":
      return <h2>{b.text}</h2>;
    case "p":
      return <p dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "cta":
      return (
        <div
          className="my-8 rounded-2xl bg-muted p-6"
          dangerouslySetInnerHTML={{ __html: b.html }}
        />
      );
    case "ul":
      return (
        <ul>
          {b.items.map((it, idx) => (
            <li key={idx}>
              {it.title && <strong>{it.title} </strong>}
              <span dangerouslySetInnerHTML={{ __html: it.html }} />
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export function JoypediaEntryPage({ entry }: { entry: JoypediaEntry }) {
  const related = useMemo(() => {
    const i = JOYPEDIA_INDEX.findIndex((x) => x.slug === entry.slug);
    const n = JOYPEDIA_INDEX.length;
    return [1, 2, 3].map((d) => JOYPEDIA_INDEX[(i + d) % n]).filter((x): x is JoypediaIndexItem => !!x);
  }, [entry.slug]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          eyebrow="JoyPedia"
          title={entry.title}
          crumbs={[{ label: "JoyPedia", href: "/joypedia/" }, { label: entry.title }]}
        />
        <section className="section-y">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 text-gold" />
              Updated <time dateTime={entry.modified}>{fmt(entry.modified)}</time>
            </p>
            <article className="article-body">
              {entry.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
            </article>
            <div className="mt-10 border-t pt-6">
              <a href="/joypedia/" className="text-sm font-semibold text-brand-blue">
                &larr; Back to all terms
              </a>
            </div>
          </div>
        </section>
        {related.length > 0 && (
          <section className="section-y bg-muted">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <h2 className="mb-6 text-2xl font-extrabold">More terms</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((i) => (
                  <a key={i.slug} href={`/joypedia/${i.slug}/`} className="card-glow flex flex-col p-5">
                    <h3 className="text-lg font-bold">{i.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{i.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
