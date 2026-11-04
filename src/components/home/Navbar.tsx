import { FlowButton } from "@/components/ui/flow-button";
import { useEffect, useState, type SyntheticEvent, type CSSProperties } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NAV, LOGO_URL, LOGO_WHITE_URL, BOOK_URL, ABOUT_URL } from "./data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [ind, setInd] = useState({ x: 0, w: 0, on: false });
  const moveInd = (e: SyntheticEvent<HTMLElement>) =>
    setInd({ x: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth, on: true });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 overflow-x-clip border-b bg-background transition-shadow ${scrolled ? "shadow-card" : "border-transparent"}`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 xl:h-[72px]"
        aria-label="Main"
      >
        <a href="/" className="shrink-0" aria-label="MarketJoy home">
          <img
            src={LOGO_URL}
            alt="MarketJoy Inc"
            className="logo-anim block h-9 w-auto object-contain dark:hidden xl:h-11"
            width={196}
            height={44}
            fetchPriority="high"
            decoding="async"
          />
          <img
            src={LOGO_WHITE_URL}
            alt="MarketJoy Inc"
            className="logo-anim hidden h-9 w-auto object-contain dark:block xl:h-11"
            width={196}
            height={44}
            decoding="async"
          />
        </a>
        <ul
          className="relative hidden items-center gap-1 xl:flex"
          onMouseLeave={() => setInd((v) => ({ ...v, on: false }))}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setInd((v) => ({ ...v, on: false }));
          }}
        >
          <span
            aria-hidden="true"
            className="nav-ind pointer-events-none absolute inset-y-1 left-0"
            style={{ transform: `translateX(${ind.x}px)`, width: ind.w, opacity: ind.on ? 1 : 0 }}
          />
          {NAV.map((g) => (
            <li key={g.label} className="group relative" onMouseEnter={moveInd} onFocus={moveInd}>
              <button
                className="relative z-10 flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground group-focus-within:text-foreground"
                aria-haspopup="true"
              >
                {g.label}
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>
              <div className="nav-drop absolute left-0 top-full z-20 pt-3">
                <ul
                  className={`nav-panel relative rounded-xl border bg-popover p-2 shadow-lift ${g.items.length > 8 ? "grid w-[520px] grid-cols-2" : "w-64"}`}
                >
                  {g.items.map((i, n) => (
                    <li
                      key={i.label}
                      style={{ "--i": n } as CSSProperties}
                      className={i.children ? "sub-group relative" : undefined}
                    >
                      <a
                        href={i.href}
                        className={`nav-item-link rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground ${i.children ? "flex items-center justify-between gap-2" : "block"}`}
                      >
                        {i.label}
                        {i.children && (
                          <ChevronRight
                            className="h-3.5 w-3.5 shrink-0 opacity-60"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                      {i.children && (
                        <div className="nav-sub absolute left-full top-0 z-30 pl-2">
                          <ul
                            className="w-72 rounded-xl border bg-popover p-2 shadow-lift"
                            aria-label={`${i.label} specialties`}
                          >
                            {i.children.map((c, k) => (
                              <li key={c.label} style={{ "--i": k } as CSSProperties}>
                                <a
                                  href={c.href}
                                  className="nav-item-link block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                  {c.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li onMouseEnter={moveInd} onFocus={moveInd}>
            <a
              href={ABOUT_URL}
              className="relative z-10 block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              About Us
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <FlowButton href={BOOK_URL} variant="gold" popup className="hidden py-2.5 sm:inline-flex">
            Talk to Sales
          </FlowButton>
          <button
            className="grid h-11 w-11 place-items-center rounded-md xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="max-h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t bg-background px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 xl:hidden">
          {NAV.map((g) => (
            <div key={g.label} className="border-b">
              <button
                className="flex w-full items-center justify-between py-3.5 font-medium"
                onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)}
                aria-expanded={mobileGroup === g.label}
              >
                {g.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mobileGroup === g.label ? "rotate-180" : ""}`}
                />
              </button>
              {mobileGroup === g.label && (
                <ul className="pb-3">
                  {g.items.map((i) => (
                    <li key={i.label}>
                      <div className="flex items-center justify-between">
                        <a
                          href={i.href}
                          className="block flex-1 py-2 pl-3 text-sm text-muted-foreground"
                        >
                          {i.label}
                        </a>
                        {i.children && (
                          <button
                            className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground"
                            onClick={() => setMobileSub(mobileSub === i.label ? null : i.label)}
                            aria-expanded={mobileSub === i.label}
                            aria-label={`${i.label} specialties`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${mobileSub === i.label ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                      {i.children && mobileSub === i.label && (
                        <ul className="mb-1 ml-3 border-l-2 border-gold/60 pl-3">
                          {i.children.map((c) => (
                            <li key={c.label}>
                              <a href={c.href} className="block py-2 text-sm text-muted-foreground">
                                {c.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <a href={ABOUT_URL} className="block border-b py-3.5 font-medium">
            About Us
          </a>
          <FlowButton href={BOOK_URL} variant="gold" popup className="mt-4 w-full py-3 text-sm">
            Talk to Sales
          </FlowButton>
        </div>
      )}
    </header>
  );
}
