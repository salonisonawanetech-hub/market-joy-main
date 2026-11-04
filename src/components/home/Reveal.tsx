import { useEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";

export type From = "up" | "down" | "left" | "right" | "zoom";

/** Pick a slide direction for item i of a row: left, up, right, left, up, right … */
export const slide = (i: number): From => (["left", "up", "right"] as const)[i % 3] ?? "up";
/** Alternate left / right (for two-column lists). */
export const zig = (i: number): From => (i % 2 === 0 ? "left" : "right");

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  from = "up",
  eager = false,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  from?: From;
  eager?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || eager) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${from} ${eager ? "reveal-eager" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
