"use client";
import {
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_URL } from "@/components/home/data";
import { useBooking } from "@/components/home/BookingModal";

/**
 * FlowButton — pill button with sliding arrows and a circle that floods the button on hover
 * (the pill also morphs into a rounded rectangle).
 *
 * - Renders an <a> when `href` is given, otherwise a <button>.
 * - `variant` picks the colours:  "outline" (original look) · "gold" (brand CTA) · "ghost" (for dark backgrounds)
 * - Label: pass `text="..."` (original API) or children.
 */
type Variant = "outline" | "gold" | "ghost";

const VARIANTS: Record<Variant, { root: string; arrow: string; circle: string }> = {
  outline: {
    root: "border-navy/40 bg-transparent text-navy hover:border-transparent hover:text-white dark:border-white/40 dark:text-white dark:hover:text-navy-deep",
    arrow:
      "stroke-navy group-hover:stroke-white dark:stroke-white dark:group-hover:stroke-navy-deep",
    circle: "bg-navy dark:bg-white",
  },
  gold: {
    root: "border-gold bg-gold text-navy-deep hover:border-gold hover:text-white",
    arrow: "stroke-navy-deep group-hover:stroke-white",
    circle: "bg-navy-deep",
  },
  ghost: {
    root: "border-white/40 bg-transparent text-white hover:border-white hover:text-navy-deep",
    arrow: "stroke-white group-hover:stroke-navy-deep",
    circle: "bg-white",
  },
};

type Common = {
  text?: string;
  children?: ReactNode;
  variant?: Variant;
  className?: string;
  /** Set true on a BOOK_URL button to open the booking popup instead of the link. */
  popup?: boolean;
};
type AnchorProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string };
type ButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
export type FlowButtonProps = AnchorProps | ButtonProps;

export function FlowButton(props: FlowButtonProps) {
  const {
    text = "Modern Button",
    children,
    variant = "outline",
    className,
    popup = false,
    ...rest
  } = props;
  const v = VARIANTS[variant];
  const booking = useBooking();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBook = popup && !!booking && (rest as { href?: string }).href === BOOK_URL;
  const classes = cn(
    "group relative inline-flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] px-7 py-3.5 text-sm font-semibold",
    "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    v.root,
    className,
  );
  const inner = (
    <>
      {/* Left arrow: slides in on hover */}
      <ArrowRight
        className={cn(
          "absolute left-[-25%] z-[9] h-4 w-4 fill-none transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4",
          v.arrow,
        )}
        aria-hidden="true"
      />
      {/* Label */}
      <span className="relative z-[1] -translate-x-3 whitespace-nowrap transition-all duration-[800ms] ease-out group-hover:translate-x-3">
        {children ?? text}
      </span>
      {/* Circle that floods the button */}
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[560px] group-hover:w-[560px] group-hover:opacity-100",
          v.circle,
        )}
        aria-hidden="true"
      />
      {/* Right arrow: slides out on hover */}
      <ArrowRight
        className={cn(
          "absolute right-4 z-[9] h-4 w-4 fill-none transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]",
          v.arrow,
        )}
        aria-hidden="true"
      />
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    const a = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const bookProps = isBook
      ? {
          onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
            a.onMouseEnter?.(e);
            if (!window.matchMedia("(hover: hover)").matches || booking!.recentlyClosed()) return;
            timer.current = setTimeout(booking!.open, 150);
          },
          onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
            a.onMouseLeave?.(e);
            if (timer.current) clearTimeout(timer.current);
          },
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            a.onClick?.(e);
            if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            booking!.open();
          },
        }
      : {};
    return (
      <a {...a} {...bookProps} className={classes}>
        {inner}
      </a>
    );
  }
  const { type = "button", ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...btn} type={type} className={classes}>
      {inner}
    </button>
  );
}

export default FlowButton;
