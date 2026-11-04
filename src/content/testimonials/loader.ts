import data from "./testimonials.json";
import type { Testimonial } from "../cpt-types";

export const TESTIMONIALS = data as unknown as readonly Testimonial[];
/** Only testimonials whose quote text could be recovered from the old site's page widgets. */
export const TESTIMONIALS_WITH_QUOTE = TESTIMONIALS.filter((t) => t.quote);
