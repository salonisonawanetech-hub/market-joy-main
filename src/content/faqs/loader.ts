import data from "./faqs.json";

export type FaqItem = {
  question: string;
  category: string | null;
  answer: string | null;
  status: "migrated" | "pending-source";
  source: string;
  liveSections: string[];
  note?: string;
};

export const ALL_FAQ_ITEMS = data.items as FaqItem[];
/** Only items that have real answer text are shown on the site. */
export const PUBLISHED_FAQS = ALL_FAQ_ITEMS.filter(
  (f): f is FaqItem & { answer: string; category: string } => !!f.answer && !!f.category,
).map((f) => ({ q: f.question, cat: f.category, a: f.answer }));
export const PENDING_FAQS = ALL_FAQ_ITEMS.filter((f) => !f.answer);
