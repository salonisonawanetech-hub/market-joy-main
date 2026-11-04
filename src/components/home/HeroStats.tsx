import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { TrendingUp, UserCheck, Check } from "lucide-react";
import { CountUp } from "./CountUp";
import { FxIcon } from "./FxIcon";

const ROLES = [
  "VP of Sales",
  "Chief Revenue Officer",
  "Head of Operations",
  "Director of IT",
  "Founder & CEO",
];
const LINE = "M0 54 L28 48 L56 51 L86 36 L116 40 L146 20 L200 6";

export function HeroStats() {
  const wrap = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = wrap.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onLeave = () => {
    wrap.current?.style.setProperty("--px", "0");
    wrap.current?.style.setProperty("--py", "0");
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative h-full min-h-[430px]"
    >
      {/* 1 — Qualified meetings: a month of calendar days that light up one by one */}
      <div className="hero-par absolute right-0 top-2" style={{ "--d": 16 } as CSSProperties}>
        <div className="float-a w-[17rem] rounded-xl bg-card p-4 text-card-foreground shadow-lift">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Qualified Meetings
              <br />
              This Month
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-4xl font-extrabold">
                <CountUp to={828} immediate duration={1200} />
              </p>
              <p className="mt-1 inline-flex items-center gap-1 rounded bg-success/15 px-1.5 py-0.5 text-xs font-bold text-success">
                <FxIcon icon={TrendingUp} className="h-3 w-3" />
                <CountUp to={46} suffix="%" immediate duration={1200} />
              </p>
            </div>
            <div
              className="grid grid-cols-7 gap-[3px]"
              aria-label="Meetings booked this month"
              role="img"
            >
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="cal-cell h-3 w-3 rounded-[3px]"
                  style={{ "--i": i } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2 — Pipeline growth: area chart with a dot riding the line */}
      <div className="hero-par absolute right-6 top-[44%]" style={{ "--d": 26 } as CSSProperties}>
        <div className="float-b w-[17rem] rounded-xl bg-card p-4 text-card-foreground shadow-lift">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Pipeline Growth</p>
            <span className="font-display text-[11px] font-bold text-muted-foreground">
              Last 6 months
            </span>
          </div>
          <p className="mt-1 inline-flex items-center gap-1 font-display text-2xl font-extrabold text-success">
            <FxIcon icon={TrendingUp} className="h-5 w-5" />
            <CountUp to={65} suffix="%" immediate duration={1200} />
          </p>
          <svg
            viewBox="0 0 200 64"
            className="mt-1 h-14 w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pg-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f5be01" stopOpacity=".38" />
                <stop offset="1" stopColor="#f5be01" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[16, 32, 48].map((y) => (
              <line
                key={y}
                x1="0"
                x2="200"
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity=".08"
                strokeDasharray="3 4"
              />
            ))}
            <path className="area-in" d={`${LINE} L200 64 L0 64 Z`} fill="url(#pg-fill)" />
            <path
              className="draw-line"
              d={LINE}
              fill="none"
              stroke="#f5be01"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g className="dot-in">
              <circle r="9" fill="#f5be01" opacity=".25" className="dot-halo" />
              <circle r="4.5" fill="#f5be01" stroke="#fff" strokeWidth="2" />
              <animateMotion
                dur="5s"
                begin="2.4s"
                repeatCount="indefinite"
                path={LINE}
                keyPoints="0;1;1"
                keyTimes="0;0.7;1"
                calcMode="linear"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* 3 — Decision makers: a tiny network that connects to a new role every couple of seconds */}
      <div className="hero-par absolute bottom-0 left-0" style={{ "--d": 38 } as CSSProperties}>
        <div className="float-c flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-card-foreground shadow-lift">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 56 56" className="h-full w-full" aria-hidden="true">
              {[
                [8, 10],
                [48, 12],
                [46, 46],
                [10, 46],
              ].map(([x, y], i) => (
                <line
                  key={i}
                  x1="28"
                  y1="28"
                  x2={x}
                  y2={y}
                  stroke="#f5be01"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  className="net-line"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}
              {[
                [8, 10],
                [48, 12],
                [46, 46],
                [10, 46],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.2"
                  fill="#06529e"
                  className="net-node"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}
            </svg>
            <span className="pulse-ring absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold/30">
              <FxIcon icon={UserCheck} className="h-4 w-4 text-navy" />
            </span>
          </div>
          <div className="min-w-[10.5rem]">
            <p className="text-sm font-bold leading-tight">
              Connect with
              <br />
              Decision-Makers
            </p>
            <p
              key={role}
              className="role-pop mt-1.5 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success"
              aria-live="polite"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
              {ROLES[role]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
