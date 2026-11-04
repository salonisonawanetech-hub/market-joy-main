import index from "./index.json";
import type { CptEntry, CptIndexItem } from "../cpt-types";

export const CASE_STUDIES_INDEX = index as unknown as readonly CptIndexItem[];

// One lazily-loaded chunk per entry, so article bodies are not in the main bundle.
const modules = import.meta.glob<{ default: CptEntry }>("./entries/*.json");

export async function loadCaseStudy(slug: string): Promise<CptEntry | null> {
  const load = modules[`./entries/${slug}.json`];
  return load ? (await load()).default : null;
}
