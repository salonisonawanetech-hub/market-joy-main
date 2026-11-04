import { useEffect, type RefObject } from "react";

/** Origin of the old WordPress site; used only as a fallback while images are not yet copied to /public. */
export const WP_ORIGIN = "https://marketjoy.com";

/** `/wp-content/...` -> `https://marketjoy.com/wp-content/...` (anything else is returned unchanged). */
export const wpFallbackSrc = (src: string) => (src.startsWith("/wp-content/") ? WP_ORIGIN + src : src);

/** onError handler for <img>: retry once from the original site, then hide the broken-image icon. */
export function wpImgOnError(e: { currentTarget: HTMLImageElement }) {
  const img = e.currentTarget;
  const src = img.getAttribute("src") ?? "";
  if (src.startsWith("/wp-content/") && !img.dataset.wpRetry) {
    img.dataset.wpRetry = "1";
    img.referrerPolicy = "no-referrer";
    img.removeAttribute("srcset");
    img.src = wpFallbackSrc(src);
  } else {
    img.style.visibility = "hidden";
  }
}

/**
 * For HTML injected with dangerouslySetInnerHTML: image `error` events do not bubble, so listen in the capture
 * phase on the container and apply the same fallback to every <img> inside it.
 */
export function useWpImageFallback(ref: RefObject<HTMLElement | null>, dep: unknown) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onErr = (ev: Event) => {
      const t = ev.target;
      if (t instanceof HTMLImageElement) wpImgOnError({ currentTarget: t });
    };
    el.addEventListener("error", onErr, true);
    // Images that already failed before hydration attached the listener.
    el.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) wpImgOnError({ currentTarget: img });
    });
    return () => el.removeEventListener("error", onErr, true);
  }, [ref, dep]);
}
