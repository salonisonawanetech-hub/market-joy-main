import { useEffect, useRef } from "react";

/** Native canvas hero background: dotted curves fan from the left toward the photo,
 *  glowing gold/blue particles travel along them, the focus point follows the cursor.
 *  Transparent, DPR-safe, pauses off-screen / hidden tab, static for reduced-motion. */
export default function HeroBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = innerWidth < 768 ? 16 : 34;
    const lines = Array.from({ length: N }, (_, i) => ({
      k: i / (N - 1),
      ph: Math.random() * 6.28,
      gold: i % 4 === 0,
      t: Math.random(),
      sp: 0.0016 + Math.random() * 0.0022,
    }));
    const m = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, on: false };
    let w = 0,
      h = 0,
      time = 0,
      raf = 0,
      visible = true;

    const resize = () => {
      const r = cv.getBoundingClientRect(),
        d = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = w * d;
      cv.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      m.x = (e.clientX - r.left) / r.width;
      m.y = (e.clientY - r.top) / r.height;
      m.on = m.x >= 0 && m.x <= 1 && m.y >= 0 && m.y <= 1;
    };
    const bez = (
      t: number,
      a: [number, number],
      b: [number, number],
      c: [number, number],
      d: [number, number],
    ): [number, number] => {
      const u = 1 - t;
      return [
        u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
        u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
      ];
    };

    const frame = () => {
      raf = 0;
      if (!reduce) time += 0.012;
      m.sx += (m.x - m.sx) * 0.05;
      m.sy += (m.y - m.sy) * 0.05;
      ctx.clearRect(0, 0, w, h);

      const fx = w * (0.74 + (m.sx - 0.5) * 0.08),
        fy = h * (0.5 + (m.sy - 0.5) * 0.12);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(170,195,235,0.04)");
      grad.addColorStop(0.5, "rgba(170,195,235,0.22)");
      grad.addColorStop(1, "rgba(170,195,235,0.5)");

      if (m.on) {
        // soft cursor glow
        const g = ctx.createRadialGradient(m.x * w, m.y * h, 0, m.x * w, m.y * h, 190);
        g.addColorStop(0, "rgba(245,190,1,0.14)");
        g.addColorStop(1, "rgba(245,190,1,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "lighter";
      for (const l of lines) {
        const y0 = h * (-0.05 + 1.1 * l.k),
          ey = fy + (l.k - 0.5) * h * 0.42;
        const a: [number, number] = [-10, y0],
          d: [number, number] = [fx, ey];
        const b: [number, number] = [w * 0.34, y0 + Math.sin(time * 1.3 + l.ph) * 30];
        const c: [number, number] = [w * 0.58, ey + Math.cos(time * 1.1 + l.ph) * 30];

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);
        ctx.setLineDash([1.5, 7]);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = l.gold ? "rgba(245,190,1,0.32)" : grad;
        ctx.stroke();
        ctx.setLineDash([]);

        if (!reduce) l.t = (l.t + l.sp) % 1;
        for (let k = 7; k >= 0; k--) {
          // fading trail + glowing head
          const tt = l.t - k * 0.009;
          if (tt < 0) continue;
          const [x, y] = bez(tt, a, b, c, d);
          if (k === 0) {
            ctx.fillStyle = l.gold ? "rgba(251,214,3,0.18)" : "rgba(80,150,255,0.18)";
            ctx.beginPath();
            ctx.arc(x, y, 9, 0, 6.3);
            ctx.fill();
            ctx.fillStyle = l.gold ? "#fbd603" : "#9cc6ff";
            ctx.beginPath();
            ctx.arc(x, y, 2.4, 0, 6.3);
            ctx.fill();
          } else {
            ctx.fillStyle = l.gold
              ? `rgba(251,214,3,${0.35 - k * 0.04})`
              : `rgba(156,198,255,${0.35 - k * 0.04})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, 6.3);
            ctx.fill();
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    resize();
    frame();
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) start();
    });
    io.observe(cv);
    addEventListener("resize", resize);
    addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
