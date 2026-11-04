import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Top scroll-progress bar + floating back-to-top button. */
export function ScrollUi() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const d = document.documentElement;
      setP(d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
        <div className="h-full origin-left bg-gold" style={{ transform: `scaleX(${p})` }} />
      </div>
      <button
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-gold text-navy-deep shadow-gold transition-all duration-300 hover:-translate-y-1 ${p > 0.15 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
