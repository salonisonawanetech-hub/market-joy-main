"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";

export const THANK_YOU_URL = "/thank-you/";
const LEAD_ENDPOINT = (import.meta.env["VITE_LEAD_ENDPOINT"] as string | undefined) || "";

const COUNTRIES = [
  { iso: "us", dial: "+1", name: "United States" },
  { iso: "ca", dial: "+1", name: "Canada" },
  { iso: "gb", dial: "+44", name: "United Kingdom" },
  { iso: "in", dial: "+91", name: "India" },
  { iso: "au", dial: "+61", name: "Australia" },
  { iso: "ae", dial: "+971", name: "UAE" },
  { iso: "de", dial: "+49", name: "Germany" },
  { iso: "fr", dial: "+33", name: "France" },
  { iso: "sg", dial: "+65", name: "Singapore" },
  { iso: "nl", dial: "+31", name: "Netherlands" },
  { iso: "za", dial: "+27", name: "South Africa" },
  { iso: "mx", dial: "+52", name: "Mexico" },
];

type Ctx = { open: () => void; close: () => void; isOpen: boolean; recentlyClosed: () => boolean };
const BookingCtx = createContext<Ctx | null>(null);

/** Returns null outside the provider so buttons fall back to their normal link. */
export const useBooking = () => useContext(BookingCtx);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const closedAt = useRef(0);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => {
    closedAt.current = Date.now();
    setOpen(false);
  }, []);
  const recentlyClosed = useCallback(() => Date.now() - closedAt.current < 1500, []);
  const value = useMemo(
    () => ({ open, close, isOpen, recentlyClosed }),
    [open, close, isOpen, recentlyClosed],
  );
  return (
    <BookingCtx.Provider value={value}>
      {children}
      <BookingModal />
    </BookingCtx.Provider>
  );
}

type Errors = Partial<Record<"name" | "email" | "company" | "phone" | "form", string>>;

function BookingModal() {
  const ctx = useContext(BookingCtx)!;
  const { isOpen, close } = ctx;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false); // stays true during the exit animation
  const [country, setCountry] = useState(COUNTRIES[0]!);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setErrors({});
      const t = setTimeout(() => firstRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible(false), 320);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const digits = phone.replace(/\D/g, "");

    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Enter a valid work email";
    if (company.length < 2) next.company = "Please enter your company name";
    if (digits.length < 6 || digits.length > 15) next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    if (LEAD_ENDPOINT) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      try {
        const res = await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name,
            email,
            company,
            phone: `${country.dial} ${phone}`,
            page: window.location.href,
            source: "book-a-meeting-popup",
          }),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        setSending(false);
        setErrors({ form: "Something went wrong. Please try again." });
        return;
      } finally {
        clearTimeout(timer);
      }
    } else {
      console.warn("VITE_LEAD_ENDPOINT is not set: form data was NOT sent anywhere.");
    }
    window.location.href = THANK_YOU_URL;
  }

  if (!mounted || !visible) return null;

  const stagger = (i: number) => ({ animationDelay: `${120 + i * 70}ms` });
  const field = (err?: string) =>
    `w-full rounded-md border bg-background px-3 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-gold focus:shadow-[0_0_0_3px_rgb(245_190_1/25%)] ${
      err ? "border-destructive" : "border-navy/80 dark:border-white/30"
    }`;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div
        onClick={close}
        data-state={isOpen ? "open" : "closed"}
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-300"
      />
      <div
        data-state={isOpen ? "open" : "closed"}
        className="relative w-full max-w-[420px] sm:max-w-[500px] overflow-hidden rounded-2xl border bg-card p-6 text-card-foreground shadow-lift duration-300 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-6 sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-1 origin-left animate-[bm-bar_0.7s_0.15s_both_cubic-bezier(0.19,1,0.22,1)] bg-gradient-to-r from-gold via-gold-bright to-gold" />
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-all duration-300 hover:rotate-90 hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="book-modal-title"
          className="font-display text-xl font-bold text-navy sm:whitespace-nowrap sm:text-[1.0625rem]"
        >
          Get Qualified Meetings - Talk to Sales
        </h2>

        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
          <div className="bm-field" style={stagger(0)}>
            <input
              ref={firstRef}
              name="name"
              autoComplete="name"
              placeholder="Name"
              aria-label="Name"
              aria-invalid={!!errors.name}
              className={field(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="bm-field" style={stagger(1)}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your work email"
              aria-label="Work email"
              aria-invalid={!!errors.email}
              className={field(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="bm-field" style={stagger(2)}>
            <input
              name="company"
              autoComplete="organization"
              placeholder="Company Name"
              aria-label="Company name"
              aria-invalid={!!errors.company}
              className={field(errors.company)}
            />
            {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
          </div>
          <div className="bm-field" style={stagger(3)}>
            <div
              className={`flex overflow-hidden rounded-md border bg-background transition-[border-color,box-shadow] duration-200 focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgb(245_190_1/25%)] ${
                errors.phone ? "border-destructive" : "border-navy/80 dark:border-white/30"
              }`}
            >
              <div className="relative flex items-center gap-1.5 bg-muted px-2.5">
                <img
                  src={`https://flagcdn.com/w40/${country.iso}.png`}
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                <span className="text-sm">{country.dial}</span>
                <span className="text-[9px] text-muted-foreground">▼</span>
                <select
                  aria-label="Country code"
                  value={country.iso}
                  onChange={(e) =>
                    setCountry(COUNTRIES.find((c) => c.iso === e.target.value) ?? COUNTRIES[0]!)
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="phone"
                type="tel"
                autoComplete="tel-national"
                placeholder="Phone"
                aria-label="Phone"
                aria-invalid={!!errors.phone}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}

          <div className="bm-field" style={stagger(4)}>
            <button
              type="submit"
              disabled={sending}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-gold bg-gradient-to-b from-navy to-[#06529e] py-3 text-base font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[130%]" />
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="relative">{sending ? "Sending…" : "Submit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
