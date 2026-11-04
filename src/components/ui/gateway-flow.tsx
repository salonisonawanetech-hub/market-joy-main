"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

type FlowMode = "dark" | "light";

export type GatewayFlowProps = {
  mode?: FlowMode;
  speed?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  burstOnClick?: boolean;
  className?: string;
  style?: CSSProperties;
};

const PALETTE = {
  navy: "#193058",
  gold: "#F5BE01",
  goldBright: "#FBD603",
  blue: "#06529E",
  gray: "#E7E7E9",
  white: "#FFFFFF",
} as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function buildSource(mode: FlowMode, density: number, strokeWidth: number) {
  const dark = mode === "dark";
  const bg = dark ? PALETTE.navy : PALETTE.white;
  const lineLeft = dark ? "rgba(231,231,233,0.55)" : "rgba(25,48,88,0.28)";
  const lineRight = dark ? "rgba(6,82,158,1)" : "rgba(6,82,158,0.45)";
  const dotA = dark ? PALETTE.goldBright : PALETTE.blue;
  const dotB = dark ? PALETTE.gold : PALETTE.navy;
  const paths = Math.max(12, Math.round(80 * density));

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>html,body{margin:0;height:100%;overflow:hidden;background:${bg}}canvas{position:fixed;inset:0;width:100%;height:100%}</style></head>
<body><canvas id="flow-canvas"></canvas>
<script>
(function(){
  var C={speed:1};
  var canvas=document.getElementById('flow-canvas'),ctx=canvas.getContext('2d');
  var width,height,explosions=[],paths=[],N=${paths};
  function resize(){
    var dpr=window.devicePixelRatio||1;
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=width*dpr;canvas.height=height*dpr;ctx.scale(dpr,dpr);
    paths.forEach(function(p,i){p.startY=(i/N)*height*1.4-height*0.2;});
  }
  for(var i=0;i<N;i++){
    paths.push({isLeft:i%2===0,startY:0,color:i%3===0?'${dotB}':'${dotA}',
      particles:[{t:Math.random(),speed:0.0015+Math.random()*0.002}]});
  }
  window.addEventListener('resize',resize);resize();
  window.addEventListener('message',function(e){
    var d=e.data;if(!d)return;
    if(d.type==='gf-controls'&&typeof d.speed==='number')C.speed=d.speed;
    if(d.type==='gf-burst')explosions.push({x:d.x*width,y:d.y*height,radius:0,life:1});
  });
  function bez(t,a,b,c,d){var u=1-t;return{
    x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,
    y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};}
  function render(){
    ctx.clearRect(0,0,width,height);
    var cx=width/2,cy=height/2;
    explosions.forEach(function(x){x.radius+=15;x.life-=0.015;});
    explosions=explosions.filter(function(x){return x.life>0;});
    paths.forEach(function(path){
      var L=path.isLeft;
      var p0={x:L?0:width,y:path.startY},p1={x:L?cx*0.5:width-cx*0.5,y:path.startY},
          p2={x:L?cx*0.8:width-cx*0.8,y:cy},p3={x:cx,y:cy};
      ctx.beginPath();ctx.moveTo(p0.x,p0.y);
      ctx.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
      ctx.strokeStyle=L?'${lineLeft}':'${lineRight}';
      ctx.lineWidth=${Number((1.8 * strokeWidth).toFixed(2))};
      ctx.setLineDash([2,5]);ctx.stroke();ctx.setLineDash([]);
      path.particles.forEach(function(p){
        p.t+=p.speed*C.speed;
        if(p.t>1){p.t=0;path.startY+=(Math.random()-0.5)*10;}
        var pos=bez(p.t,p0,p1,p2,p3),dx=0,dy=0;
        explosions.forEach(function(e){
          var ex=pos.x-e.x,ey=pos.y-e.y,d=Math.hypot(ex,ey);
          if(d<e.radius+120&&d>e.radius-120){
            var f=(1-Math.abs(d-e.radius)/120)*e.life;
            dx+=(ex/d)*f*80;dy+=(ey/d)*f*80;}
        });
        ctx.fillStyle=path.color;
        for(var k=6;k>=1;k--){
          var tp=p.t-k*0.007;if(tp<0)continue;
          var q=bez(tp,p0,p1,p2,p3);
          ctx.globalAlpha=(1-k/7)*0.5;
          ctx.fillRect(q.x+dx-2,q.y+dy-2,4,4);
        }
        ctx.globalAlpha=1;
        ctx.shadowColor=path.color;ctx.shadowBlur=${dark ? 14 : 0};
        ctx.fillRect(pos.x+dx-2.5,pos.y+dy-2.5,5,5);
        ctx.shadowBlur=0;
      });
    });
    requestAnimationFrame(render);
  }
  render();
})();
</script></body></html>`;
}

export default function GatewayFlow({
  mode = "dark",
  speed = 1,
  density = 1,
  strokeWidth = 1,
  opacity = 1,
  burstOnClick = true,
  className,
  style,
}: GatewayFlowProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const safeSpeed = clamp(speed, 0, 3);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeStroke = clamp(strokeWidth, 0.25, 8);

  const srcDoc = useMemo(
    () => buildSource(mode, safeDensity, safeStroke),
    [mode, safeDensity, safeStroke],
  );

  useEffect(() => {
    ref.current?.contentWindow?.postMessage({ type: "gf-controls", speed: safeSpeed }, "*");
  }, [safeSpeed, srcDoc]);

  useEffect(() => {
    if (!burstOnClick) return;
    const onClick = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        return;
      el.contentWindow?.postMessage(
        { type: "gf-burst", x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height },
        "*",
      );
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [burstOnClick]);

  return (
    <iframe
      ref={ref}
      title="Animated background"
      aria-hidden="true"
      tabIndex={-1}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        pointerEvents: "none",
        background: mode === "dark" ? PALETTE.navy : PALETTE.white,
        opacity: clamp(opacity, 0.05, 1),
        ...style,
      }}
    />
  );
}
