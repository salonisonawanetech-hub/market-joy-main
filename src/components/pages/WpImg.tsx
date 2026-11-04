import { useEffect, useRef, useState, type ReactNode } from "react";
import { wpFallbackSrc } from "@/lib/wp-images";

type Props = {
  src: string;
  alt: string;
  className?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  /** Shown instead of the image when it cannot be loaded from /public or from marketjoy.com. Default: nothing. */
  fallback?: ReactNode | undefined;
  /** Above-the-fold image: load eagerly. */
  priority?: boolean | undefined;
};

/**
 * <img> for migrated `/wp-content/...` files.
 *   1. loads the local copy from /public
 *   2. if it is not there yet, retries once from marketjoy.com
 *   3. if that fails too, renders `fallback` (or nothing) instead of a broken-image icon
 * It also catches images that failed before React hydrated (the `error` event is missed in that case).
 */
export function WpImg({ src, alt, className, width, height, fallback = null, priority = false }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [current, setCurrent] = useState(src);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setDead(false);
  }, [src]);

  const fail = () => {
    const remote = wpFallbackSrc(src);
    if (current === src && remote !== src) setCurrent(remote);
    else setDead(true);
  };

  useEffect(() => {
    const img = ref.current;
    // SVGs without an intrinsic size report naturalWidth 0 in some browsers, so they are not checked here.
    if (img && img.complete && img.naturalWidth === 0 && !/\.svg(\?|$)/i.test(current)) fail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (dead) return <>{fallback}</>;
  return (
    <img
      ref={ref}
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy={current !== src ? "no-referrer" : undefined}
      aria-hidden={alt === "" ? true : undefined}
      onError={fail}
      className={className}
    />
  );
}
