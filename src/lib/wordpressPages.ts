/** Public WordPress Pages adapter. No credentials are sent to the browser. */
export type WordPressPage = {
  id: number;
  slug: string;
  link: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  featured_media?: number;
  _embedded?: { 'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }> };
  yoast_head_json?: Record<string, unknown>;
  rank_math_title?: string;
  rank_math_description?: string;
  rank_math_focus_keyword?: string;
  acf?: Record<string, unknown> | null;
  meta?: Record<string, unknown>;
};

export type RankMathSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  image: string;
  type: string;
  twitterCard: string;
};

const API_ROOT = (import.meta.env['VITE_WP_API_URL'] || 'https://marketjoy.com/wp-json/wp/v2').replace(/\/$/, '');
const RANK_MATH_URL = API_ROOT.replace(/\/wp\/v2$/, '/rankmath/v1/getHead');
const text = (value: unknown) => typeof value === 'string' ? value : '';
const decode = (value: string) => value.replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8211;/g, '–').replace(/&nbsp;/g, ' ');
export const stripHtml = (value = '') => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function decodeHtml(value: string) {
  return value
    .replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
      if (code.startsWith('#')) {
        const numeric = code.slice(1, 2).toLowerCase() === 'x'
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
        return Number.isInteger(numeric) && numeric >= 0 && numeric <= 0x10ffff
          ? String.fromCodePoint(numeric)
          : entity;
      }
      const named: Record<string, string> = {
        amp: '&',
        quot: '"',
        apos: "'",
        lt: '<',
        gt: '>',
        nbsp: ' ',
      };
      return named[code.toLowerCase()] ?? entity;
    });
}

function readAttributes(tag: string) {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const name = match[1];
    if (name) attributes[name.toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

export async function fetchRankMathSeo(url: string): Promise<RankMathSeo | null> {
  let target: URL;
  try {
    target = new URL(url);
  } catch (error) {
    console.warn('Unable to parse the WordPress URL for Rank Math metadata', error);
    return null;
  }
  const apiOrigin = new URL(API_ROOT).origin;
  if (target.origin !== apiOrigin) {
    console.warn(`Skipping Rank Math metadata for a different origin: ${target.origin}`);
    return null;
  }

  const requestUrl = new URL(RANK_MATH_URL);
  requestUrl.searchParams.set('url', target.href);
  try {
    const response = await fetch(requestUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      console.warn(`Rank Math metadata API returned ${response.status} for ${target.href}`);
      return null;
    }

    const payload = await response.json() as { success?: boolean; head?: string };
    if (!payload.success || typeof payload.head !== 'string') {
      console.warn(`Rank Math metadata was not available for ${target.href}`);
      return null;
    }

    let title = '';
    let description = '';
    let canonical = '';
    let robots = '';
    let image = '';
    let type = '';
    let twitterCard = '';

    for (const match of payload.head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)) {
      title = decodeHtml(stripHtml(match[1]));
      break;
    }
    for (const match of payload.head.matchAll(/<(meta|link)\b[^>]*>/gi)) {
      const tag = match[0];
      const attributes = readAttributes(tag);
      if (match[1]?.toLowerCase() === 'link' && attributes['rel']?.toLowerCase() === 'canonical') {
        canonical = attributes['href'] || canonical;
        continue;
      }
      const name = (attributes['name'] || attributes['property'] || '').toLowerCase();
      const content = attributes['content'] || '';
      if (name === 'description') description = content;
      else if (name === 'robots') robots = content;
      else if (name === 'og:title' && !title) title = content;
      else if (name === 'og:description' && !description) description = content;
      else if (name === 'og:image') image = content;
      else if (name === 'og:type') type = content;
      else if (name === 'twitter:card') twitterCard = content;
      else if (name === 'twitter:image' && !image) image = content;
    }

    return { title, description, canonical, robots, image, type, twitterCard };
  } catch (error) {
    console.warn(`Unable to fetch Rank Math metadata for ${target.href}`, error);
    return null;
  }
}

export async function fetchWordPressPageBySlug(slug: string): Promise<WordPressPage | null> {
  if (!slug) return null;
  const response = await fetch(`${API_ROOT}/pages?slug=${encodeURIComponent(slug)}&_embed=1`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`WordPress Pages API returned ${response.status}`);
  }
  const pages = await response.json() as WordPressPage[];
  return pages[0] ?? null;
}

export async function getWordPressPageSeo(page: WordPressPage) {
  const yoast = page.yoast_head_json ?? {};
  const meta = page.meta ?? {};
  const rankMath = await fetchRankMathSeo(page.link);
  const rankMathTitle = text(meta['rank_math_title']) || text(page.rank_math_title);
  const rankMathDescription = text(meta['rank_math_description']) || text(page.rank_math_description);
  const rankMathCanonical = text(meta['rank_math_canonical_url']);
  const rankMathRobots = text(meta['rank_math_robots']);
  const ogImage = yoast['og_image'];
  const og = typeof ogImage === 'object' && Array.isArray(ogImage)
    ? (ogImage[0] as { url?: string } | undefined)?.url
    : undefined;
  const image = text(og) || page._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  return {
    title: rankMath?.title || text(yoast['title']) || rankMathTitle || stripHtml(page.title.rendered),
    description: rankMath?.description || text(yoast['description']) || rankMathDescription || stripHtml(page.excerpt?.rendered || ''),
    canonical: rankMath?.canonical || text(yoast['canonical']) || rankMathCanonical || text(meta['canonical_url']),
    robots: rankMath?.robots || text(yoast['robots']) || rankMathRobots || text(meta['robots']),
    image: rankMath?.image || image,
    modified: page.modified,
    rankMath,
  };
}
