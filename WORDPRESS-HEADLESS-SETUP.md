# MarketJoy React + WordPress (Headless) integration

The React UI is kept in place. Public content is now requested from the live MarketJoy WordPress REST API; Redux Toolkit Query owns request state and caching.

## What is live

| Frontend area | WordPress API |
| --- | --- |
| Homepage latest articles | `GET /wp/v2/posts?_embed=1&per_page=3&orderby=date&order=desc` |
| Blog listing and pagination | `GET /wp/v2/posts?_embed=1&per_page=13&page=1` |
| Blog article by slug | `GET /wp/v2/posts?slug={slug}&_embed=1` |
| Case studies, industry news, press releases | Discovers `/wp/v2/types`, reads each matching `rest_base`, then requests `/{rest_base}?_embed=1` |
| WordPress page directory / single page queries | `GET /wp/v2/pages`, `GET /wp/v2/pages?slug={slug}` |
| Media and categories | `GET /wp/v2/media`, `GET /wp/v2/categories` |

The app deliberately does not use WordPress credentials in the browser. Public published content is read anonymously. Draft previews and publishing/editing from the React frontend are not enabled; editors should continue to publish in `/wp-admin`.

## Configure

1. Copy `.env.example` to `.env`.
2. Confirm `VITE_WP_API_URL` points to the WordPress REST API root, normally `https://marketjoy.com/wp-json/wp/v2`.
3. Run `npm install`, then `npm run dev`.
4. Check the API from Chrome:
   - `https://marketjoy.com/wp-json/`
   - `https://marketjoy.com/wp-json/wp/v2/posts?per_page=5&_embed=1`
   - `https://marketjoy.com/wp-json/wp/v2/pages?per_page=5`
   - `https://marketjoy.com/wp-json/wp/v2/types`

## Important WordPress backend requirements

The built-in Posts, Pages, Categories, Tags and Media endpoints are available in standard WordPress. Custom post types (Case Studies, Industry News, Press Releases, Testimonials, etc.) must be registered with REST support enabled:

```php
register_post_type('case_study', [
    'public'       => true,
    'show_in_rest' => true,
    'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'custom-fields'],
]);
```

Use the exact `rest_base` shown by `/wp-json/wp/v2/types`; the React app discovers it rather than assuming a slug. If a custom post type is not listed there, ask the WordPress administrator/developer to enable `show_in_rest` and check that the post type is public.

For featured images, enable `thumbnail` support and upload/set the Featured Image in the WordPress editor. The app uses `_embed=1` to retrieve featured media and category/tag labels.

If custom page-builder fields are used (Elementor, ACF, etc.), they may not be present in the default REST response. Expose the fields needed by the frontend using the plugin's REST API setting or `register_rest_field()`. Do not expose private/internal fields.

## SEO publishing workflow

- SEO/content team creates or edits posts and custom post entries in WordPress.
- They set title, body, excerpt, category/tags, featured image, slug, and SEO plugin metadata.
- They publish/update the content in WordPress.
- The React frontend fetches the latest published data through the public REST API; no React code change or data migration is required for new blog slugs.
- Keep the WordPress sitemap and canonical configuration aligned with the React frontend deployment. A headless React SPA alone does not guarantee SEO parity: production should use SSR/prerendering or a rendering layer that returns page content and metadata to crawlers. Verify canonical URLs, redirects, robots, Open Graph and schema markup after deployment.

## Notes / boundaries

- This integration replaces migrated blog content for listing and detail fetching, and migrated CPT entries for case study/news/press release detail routes. It also replaces the homepage's static latest-blog cards.
- Other hand-crafted service/industry/about page layouts remain in the project to preserve the existing UI. Their page text/layout is not automatically replaced with WordPress page-builder markup because that would change the design. The REST client includes page/media/category queries as the next integration point. To make those pages fully editor-managed without a developer, agree a structured WordPress content model (ACF fields or Gutenberg blocks) and map those fields to the existing React sections.
- Forms, booking integrations, menus and global business details are not automatically editable via the public content endpoints. They should be connected separately to the approved WordPress/plugin endpoints if the SEO/content team needs to manage them.
