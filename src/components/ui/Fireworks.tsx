import { useEffect, useRef } from "react";

const PALETTES: string[][] = [
  ["#e02929", "#ff4444", "#ff8888"],
  ["#ffffff", "#ffeeee", "#ffffff"],
  ["#e02929", "#ffffff", "#ff6666"],
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; decay: number;
  color: string; radius: number;
}

interface Rocket {
  x: number; y: number;
  vx: number; vy: number;
  targetX: number; targetY: number;
  palette: string[];
  trail: { x: number; y: number; a: number }[];
}

const W = 220;
const H = 200;

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W;
    canvas.height = H;

    let animId: number;
    const rockets: Rocket[] = [];
    let particles: Particle[] = [];
    let lastLaunch = 0;

    function launch() {
      const sx = rand(0, W * 0.25);
      const sy = rand(H * 0.75, H);
      const tx = rand(W * 0.55, W * 0.95);
      const ty = rand(H * 0.05, H * 0.42);

      const dist = Math.hypot(tx - sx, ty - sy);
      const speed = rand(1.0, 1.6);
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];

      rockets.push({
        x: sx, y: sy,
        vx: ((tx - sx) / dist) * speed,
        vy: ((ty - sy) / dist) * speed,
        targetX: tx, targetY: ty,
        palette,
        trail: [],
      });
    }

    function explode(x: number, y: number, palette: string[]) {
      const count = 55 + Math.floor(rand(0, 35));
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.15, 0.15);
        const speed = rand(0.3, 1.6);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: rand(0.006, 0.013),
          color: palette[Math.floor(Math.random() * palette.length)],
          radius: rand(0.8, 2.2),
        });
      }
    }

    function loop(ts: number) {
      animId = requestAnimationFrame(loop);

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      if (ts - lastLaunch > rand(1400, 2800)) {
        launch();
        lastLaunch = ts;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, a: 0.9 });
        r.x += r.vx;
        r.y += r.vy;

        for (let j = r.trail.length - 1; j >= 0; j--) {
          const t = r.trail[j];
          t.a -= 0.055;
          if (t.a <= 0) { r.trail.splice(j, 1); continue; }
          ctx.globalAlpha = t.a;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(r.targetX - r.x, r.targetY - r.y) < 3.5) {
          explode(r.x, r.y, r.palette);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.018;
        p.vx *= 0.988;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 60,
        right: 0,
        width: W,
        height: H,
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}
