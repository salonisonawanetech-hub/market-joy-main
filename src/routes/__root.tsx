import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "bootstrap/dist/css/bootstrap-grid.min.css";

import appCss from "../styles.css?url";
import { LOGO_URL } from "../components/home/data";
import { OG_IMAGE, SITE_NAME, jsonLd, organizationSchema } from "../lib/seo";
import { INTRO_SCRIPT, THEME_SCRIPT } from "../lib/boot-scripts";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FlowButton } from "../components/ui/flow-button";
import { PageCurtain } from "../components/home/PageTransition";
import { BookingProvider } from "../components/home/BookingModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <FlowButton href="/" variant="gold">
            Go home
          </FlowButton>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <FlowButton
            variant="gold"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </FlowButton>
          <FlowButton href="/" variant="outline">
            Go home
          </FlowButton>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MarketJoy | B2B Lead Generation" },
      { name: "description", content: "MarketJoy B2B lead generation services." },
      { name: "author", content: "MarketJoy" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "MarketJoy: generate more qualified B2B meetings" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@GetMarketJoy" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    scripts: [jsonLd(organizationSchema), { children: THEME_SCRIPT }, { children: INTRO_SCRIPT }],
    links: [
      { rel: "preconnect", href: "https://marketjoy.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "image", href: LOGO_URL, fetchPriority: "high" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg?v=3", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png?v=3", type: "image/png", sizes: "32x32" },
      { rel: "shortcut icon", href: "/favicon.ico?v=3", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=3" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PageCurtain />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Provider store={store}>
        <BookingProvider>
          <Outlet />
        </BookingProvider>
      </Provider>
    </QueryClientProvider>
  );
}
