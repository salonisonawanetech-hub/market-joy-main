"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  ph: number;
  gold: boolean;
};

type Props = {
  className?: string;
  /** Fixed particle count. Default scales with the section size (24–70). */
  count?: number;
  linkDistance?: number;
  grabDistance?: number;
};

const BLUE = "156,198,255";
const GOLD = "251,214,3";

export default function ParticlesBg({
  className = "",
  count,
  linkDistance = 130,
  grabDistance = 170,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    const parts: Particle[] = [];
    let w = 0,
      h = 0,
      t = 0,
      raf = 0,
      visible = true;

    const target = () => count ?? Math.round(Math.min(70, Math.max(24, (w * h) / 16000)));
    const make = (x = Math.random() * w, y = Math.random() * h): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 1.8,
      a: 0.25 + Math.random() * 0.4,
      ph: Math.random() * 6.28,
      gold: Math.random() < 0.18,
    });

    const resize = () => {
      const r = cv.getBoundingClientRect(),
        d = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      parts.length = 0;
      for (let i = 0; i < target(); i++) parts.push(make());
      if (reduce) frame();
    };

    const inside = (e: PointerEvent | MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left,
        y = e.clientY - r.top;
      return { x, y, ok: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
    };
    const onMove = (e: PointerEvent) => {
      const p = inside(e);
      mouse.x = p.ok ? p.x : -9999;
      mouse.y = p.ok ? p.y : -9999;
    };
    const onClick = (e: MouseEvent) => {
      const p = inside(e);
      if (!p.ok) return;
      for (let i = 0; i < 3; i++) parts.push(make(p.x, p.y));
      while (parts.length > target() + 12) parts.shift();
    };

    function frame() {
      raf = 0;
      if (!reduce) t += 0.02;
      ctx!.clearRect(0, 0, w, h);

      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }

      ctx!.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i]!;
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > linkDistance) continue;
          ctx!.strokeStyle = `rgba(${BLUE},${(1 - d / linkDistance) * 0.2})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < grabDistance) {
          ctx!.strokeStyle = `rgba(${GOLD},${(1 - dm / grabDistance) * 0.55})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      for (const p of parts) {
        const tw = reduce ? 1 : 0.75 + 0.25 * Math.sin(t + p.ph);
        ctx!.fillStyle = `rgba(${p.gold ? GOLD : BLUE},${p.a * tw})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    if (!reduce) start();
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) start();
    });
    io.observe(cv);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    addEventListener("pointermove", onMove);
    addEventListener("click", onClick);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", start);
    };
  }, [count, linkDistance, grabDistance]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
