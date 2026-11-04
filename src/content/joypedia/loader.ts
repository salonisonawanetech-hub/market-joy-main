import index from "./index.json";

export type JoypediaBlock =
  | { t: "h2"; text: string }
  | { t: "p" | "cta"; html: string }
  | {
      t: "ul";
      variant?: "check";
      items: { title: string | null; html: string }[];
    };

export type JoypediaIndexItem = {
  id: number;
  slug: string;
  path: string;
  sourceUrl: string;
  title: string;
  date: string;
  modified: string;
  sourceFormat: "elementor" | "plain-html";
  excerpt: string;
};

export type JoypediaEntry = JoypediaIndexItem & {
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    note: string;
  };
  featuredImage: null;
  acf: null;
  blocks: JoypediaBlock[];
};

export const JOYPEDIA_INDEX = index as unknown as readonly JoypediaIndexItem[];

// One lazily-loaded chunk per term, so the 153 article bodies are not in the main bundle.
const modules = import.meta.glob<{ default: JoypediaEntry }>("./entries/*.json");

export async function loadJoypedia(slug: string): Promise<JoypediaEntry | null> {
  const load = modules[`./entries/${slug}.json`];
  return load ? (await load()).default : null;
}
