import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Sections';
import type { WordPressPage } from '@/lib/wordpressPages';
import { stripHtml } from '@/lib/wordpressPages';

/** Fallback renderer for WordPress pages not backed by a hand-crafted React template. */
export function WordPressPageView({ page }: { page: WordPressPage }) {
  const title = stripHtml(page.title.rendered);
  return (
    <>
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-20">
            <h1 className="max-w-4xl text-[2rem] font-extrabold leading-[1.1] sm:text-5xl">{title}</h1>
          </div>
        </section>
        <article className="section-y">
          <div className="wp-content prose prose-lg mx-auto max-w-4xl px-4 text-foreground sm:px-6" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
