'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AI_BRANDS, logoUrl, fallbackLogoUrl, type AIBrand } from '@/data/ai-brands';

interface Star extends AIBrand {
  phi: number;
  theta: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  hue: number;
}

const LOGO_SIZE = 40;
const HALF = LOGO_SIZE / 2;
const CONNECT_DISTANCE = 160;
const PULSE_COUNT = 6;

export function ToolsConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const yawRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const positionsRef = useRef<{ x: number; y: number; depth: number; visible: boolean }[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);

  const stars = useMemo<Star[]>(() => {
    const subset = AI_BRANDS.slice();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return subset.map((brand, i) => {
      const y = 1 - (i / (subset.length - 1)) * 2;
      const theta = Math.acos(y);
      const phi = goldenAngle * i;
      return { ...brand, phi, theta };
    });
  }, []);

  // Initialize pulses (random pairs)
  if (pulsesRef.current.length === 0 && stars.length > 1) {
    pulsesRef.current = Array.from({ length: PULSE_COUNT }, () => ({
      fromIdx: Math.floor(Math.random() * stars.length),
      toIdx: Math.floor(Math.random() * stars.length),
      t: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      hue: Math.random(),
    }));
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(container);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          visibleRef.current = entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(container);
    }

    const tick = (now: number) => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 1000, 0.05) : 0;
      lastTimeRef.current = now;

      yawRef.current += dt * 0.18;

      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const sphereR = Math.min(rect.width, rect.height) * 0.45;

      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;

      const yaw = yawRef.current + mx * 1.0;
      const pitch = my * 0.6;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // Compute positions
      if (positionsRef.current.length !== stars.length) {
        positionsRef.current = stars.map(() => ({ x: 0, y: 0, depth: 0, visible: true }));
      }
      const positions = positionsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = Math.sin(s.theta) * Math.cos(s.phi);
        const sy = Math.cos(s.theta);
        const sz = Math.sin(s.theta) * Math.sin(s.phi);
        let x = sx * cosY + sz * sinY;
        let z = -sx * sinY + sz * cosY;
        let y = sy;
        const ny = y * cosP - z * sinP;
        const nz = y * sinP + z * cosP;
        y = ny;
        z = nz;

        const px = cx + x * sphereR;
        const py = cy + y * sphereR;
        const depth = (z + 1) / 2;

        positions[i].x = px;
        positions[i].y = py;
        positions[i].depth = depth;
        positions[i].visible = true;
      }

      // Update DOM logos
      const children = container.querySelectorAll<HTMLDivElement>('[data-star]');
      for (let i = 0; i < stars.length; i++) {
        const el = children[i];
        if (!el) continue;
        const p = positions[i];
        const scale = 0.45 + p.depth * 0.7;
        const opacity = 0.25 + p.depth * 0.75;
        const blur = (1 - p.depth) * 1.5;

        // Mouse repulsion
        let ox = 0;
        let oy = 0;
        if (mouseRef.current.active) {
          const mxPx = mouseRef.current.x * rect.width;
          const myPx = mouseRef.current.y * rect.height;
          const dx = p.x - mxPx;
          const dy = p.y - myPx;
          const d = Math.hypot(dx, dy);
          const radius = 110;
          if (d < radius) {
            const force = (1 - d / radius) * 22;
            ox = (dx / (d || 1)) * force;
            oy = (dy / (d || 1)) * force;
          }
        }

        el.style.transform = `translate3d(${p.x + ox - HALF}px, ${p.y + oy - HALF}px, 0) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : '';
        el.style.zIndex = String(Math.floor(p.depth * 100));
      }

      // ── Draw connections + pulses on canvas ───────────────────────────
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Lines between nearby stars (only front-facing for visual clarity)
      ctx.lineCap = 'round';
      for (let i = 0; i < positions.length; i++) {
        const a = positions[i];
        if (a.depth < 0.45) continue;
        for (let j = i + 1; j < positions.length; j++) {
          const b = positions[j];
          if (b.depth < 0.45) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < CONNECT_DISTANCE && d > 30) {
            const closeness = 1 - d / CONNECT_DISTANCE;
            const op = closeness * Math.min(a.depth, b.depth) * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 184, 150, ${op.toFixed(3)})`;
            ctx.lineWidth = 0.6 + closeness * 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Animated pulses traveling between random pairs
      for (const pulse of pulsesRef.current) {
        const a = positions[pulse.fromIdx];
        const b = positions[pulse.toIdx];
        if (!a || !b) continue;

        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          // Pick a new visible target pair
          const newFrom = pulse.toIdx;
          let attempts = 0;
          let newTo = Math.floor(Math.random() * stars.length);
          while (attempts < 8 && (newTo === newFrom || positions[newTo].depth < 0.4)) {
            newTo = Math.floor(Math.random() * stars.length);
            attempts++;
          }
          pulse.fromIdx = newFrom;
          pulse.toIdx = newTo;
          pulse.t = 0;
          pulse.speed = 0.25 + Math.random() * 0.45;
          pulse.hue = Math.random();
          continue;
        }

        // Fade in/out at the edges of travel
        const fade = pulse.t < 0.1 ? pulse.t * 10 : pulse.t > 0.9 ? (1 - pulse.t) * 10 : 1;

        // Interpolate
        const px = a.x + (b.x - a.x) * pulse.t;
        const py = a.y + (b.y - a.y) * pulse.t;

        // Trail (3 small fading dots behind)
        for (let k = 0; k < 4; k++) {
          const tt = Math.max(0, pulse.t - k * 0.04);
          const tx = a.x + (b.x - a.x) * tt;
          const ty = a.y + (b.y - a.y) * tt;
          const trailFade = (1 - k / 4) * fade;
          ctx.beginPath();
          ctx.fillStyle = `rgba(212, 184, 150, ${(0.85 * trailFade).toFixed(3)})`;
          ctx.arc(tx, ty, 1.6 * (1 - k * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }

        // Main pulse with glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, `rgba(255, 230, 160, ${(0.95 * fade).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(212, 184, 150, ${(0.5 * fade).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(212, 184, 150, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 240, 200, ${fade.toFixed(3)})`;
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (io) io.disconnect();
      ro.disconnect();
    };
  }, [stars]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = (e.clientX - rect.left) / rect.width;
    mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    mouseRef.current.active = true;
  }
  function onMouseLeave() {
    mouseRef.current.active = false;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />

      {stars.map((s) => (
        <div
          key={s.domain}
          data-star=""
          className="absolute top-0 left-0 rounded-full bg-white border border-white/30 overflow-hidden flex items-center justify-center will-change-transform shadow-[0_4px_18px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212, 184, 150,0.1)]"
          style={{
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            transition: 'opacity 0.4s ease, filter 0.4s ease',
          }}
          title={s.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl(s.domain)}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-1"
            data-fallback-step="0"
            onError={(ev) => {
              const img = ev.currentTarget as HTMLImageElement;
              const step = parseInt(img.dataset.fallbackStep || '0', 10);
              if (step === 0) {
                img.dataset.fallbackStep = '1';
                img.src = fallbackLogoUrl(s.domain);
              } else {
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent) {
                  parent.style.background =
                    'linear-gradient(135deg, #D4B896 0%, #A89570 100%)';
                  parent.innerHTML = `<span style="font-family:var(--font-display);color:#0A0A0B;font-weight:600;font-size:1.1rem;">${s.name.charAt(0)}</span>`;
                }
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
