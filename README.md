# Pixel Perfect Promise

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/76fdc9a3-d859-4300-840d-5a29adc2dcd8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Images from the old site

The About, Products and InfoJoy pages use files from `https://marketjoy.com/wp-content/...`. `npm run dev` / `npm run build`
download any that are missing into `public/` (see `scripts/fetch-industry-images.mjs`; run it by hand with
`npm run images:industries`). Until a file is downloaded the page loads it straight from marketjoy.com, and if that fails
too it shows a neutral placeholder instead of a broken image.


## Live WordPress backend

See [WORDPRESS-HEADLESS-SETUP.md](./WORDPRESS-HEADLESS-SETUP.md) for the live REST API endpoints, WordPress custom-post-type requirements, environment configuration, and editor workflow. The UI styles/layout are preserved; Redux Toolkit Query now fetches blog content and the WordPress custom content types at runtime.
