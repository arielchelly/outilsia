'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────
// Custom fragment shader — "Signal flow" (TopOutils.IA theme).
// Soft horizontal ribbons of light flowing across a near-black field —
// reads as "signal extracted from the noise" (which is exactly what the
// site does: filter 62 IA tools to surface the best ones). No meteors.
// Palette stays in the site's restrained sand-on-black register.
// ─────────────────────────────────────────────────────────
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 touch;
uniform int pointerCount;

#define FC gl_FragCoord.xy
#define T  time
#define R  resolution
#define MN min(R.x, R.y)

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(void) {
  vec2 uv = (FC - 0.5 * R) / MN;

  // Slight cursor influence — moves the field gently towards the pointer.
  vec2 mouse = (touch / R - 0.5) * vec2(1.0, -1.0);
  uv += mouse * 0.08;

  // Domain warp for organic flow
  vec2 q = uv + 0.30 * vec2(fbm(uv + 0.05 * T),
                            fbm(uv + vec2(5.2, 1.3) - 0.04 * T));
  vec2 r = q + 0.45 * vec2(fbm(q + vec2(1.7, 9.2) + 0.07 * T),
                            fbm(q + vec2(8.3, 2.8) + 0.06 * T));

  // Build 6 horizontal "signal ribbons" at varying heights and phases
  float ribbons = 0.0;
  for (float i = 0.0; i < 6.0; i++) {
    float phase = i * 1.7;
    float y = uv.y
            + 0.18 * sin(uv.x * 2.4 + T * 0.32 + phase)
            + 0.06 * fbm(uv * 2.6 + T * 0.10);
    // Centre ribbon i at offset (i - 2.5) * 0.18
    float band = exp(-pow(y * 7.2 + (i - 2.5) * 1.2, 2.0));
    // Soft brightness pulse per ribbon
    ribbons += band * (0.55 + 0.45 * sin(T * 0.6 + i * 1.3));
  }

  // Underlying haze texture
  float field = fbm(r * 1.6);

  // Site palette
  vec3 bg   = vec3(0.040, 0.040, 0.043);  // #0A0A0B
  vec3 sand = vec3(0.831, 0.722, 0.588);  // #D4B896
  vec3 cream = vec3(0.961, 0.918, 0.851); // #F5EAD9 (slight warm cream)

  vec3 col = bg
           + ribbons * 0.22 * sand
           + ribbons * ribbons * 0.10 * cream
           + field   * 0.035 * sand;

  // Subtle vignette
  float vig = 1.0 - 0.32 * length(uv);
  col *= clamp(vig, 0.6, 1.0);

  // Touch ripple — brightens slightly when user holds the pointer down
  if (pointerCount > 0) {
    vec2 tm = (touch / R - 0.5) * vec2(1.0, -1.0) * vec2(R.x / R.y, 1.0);
    float d = length(uv - tm);
    col += 0.10 * sand * exp(-d * 6.0);
  }

  O = vec4(col, 1.0);
}`;

// ─────────────────────────────────────────────────────────
// Component props
// ─────────────────────────────────────────────────────────
export interface AnimatedShaderHeroProps {
  trustBadge?: { text: string; dotColor?: string };
  headline: { line1: string; line2: string };
  subtitle: string;
  buttons?: {
    primary?: { text: string; href?: string; onClick?: () => void };
    secondary?: { text: string; href?: string; onClick?: () => void };
  };
  className?: string;
}

// ─────────────────────────────────────────────────────────
// Internal: WebGL renderer + pointer handler (no React state in here —
// this is a one-time imperative setup tied to the canvas lifecycle).
// ─────────────────────────────────────────────────────────
const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

class ShaderRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private uniforms: {
    resolution?: WebGLUniformLocation | null;
    time?: WebGLUniformLocation | null;
    touch?: WebGLUniformLocation | null;
    pointerCount?: WebGLUniformLocation | null;
  } = {};
  private scale = 1;
  private mouseCoords = [0, 0];
  private nbrOfPointers = 0;

  constructor(private canvas: HTMLCanvasElement, scale: number) {
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;
    this.scale = scale;
    gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!this.vs || !this.fs) return;
    this.compile(this.vs, VERTEX_SHADER);
    this.compile(this.fs, FRAGMENT_SHADER);
    this.program = gl.createProgram();
    if (!this.program) return;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
  }

  init() {
    const gl = this.gl;
    if (!this.program) return;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    this.uniforms.resolution = gl.getUniformLocation(this.program, 'resolution');
    this.uniforms.time = gl.getUniformLocation(this.program, 'time');
    this.uniforms.touch = gl.getUniformLocation(this.program, 'touch');
    this.uniforms.pointerCount = gl.getUniformLocation(this.program, 'pointerCount');
  }

  private compile(shader: WebGLShader, src: string) {
    const gl = this.gl;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Fail soft — render fallback bg.
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    }
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }

  setPointer(coords: [number, number], count: number) {
    this.mouseCoords = coords;
    this.nbrOfPointers = count;
  }

  render(now = 0) {
    const gl = this.gl;
    if (!this.program) return;
    gl.clearColor(0.04, 0.04, 0.043, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    if (this.buffer) gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    if (this.uniforms.resolution) gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    if (this.uniforms.time) gl.uniform1f(this.uniforms.time, now * 1e-3);
    if (this.uniforms.touch) gl.uniform2f(this.uniforms.touch, this.mouseCoords[0], this.mouseCoords[1]);
    if (this.uniforms.pointerCount) gl.uniform1i(this.uniforms.pointerCount, this.nbrOfPointers);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    const gl = this.gl;
    if (this.program) {
      if (this.vs) gl.deleteShader(this.vs);
      if (this.fs) gl.deleteShader(this.fs);
      gl.deleteProgram(this.program);
    }
  }
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export function AnimatedShaderHero({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = '',
}: AnimatedShaderHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<ShaderRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: ShaderRenderer;
    try {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      renderer = new ShaderRenderer(canvas, dpr);
      renderer.setup();
      renderer.init();
    } catch (e) {
      console.warn('Shader hero unavailable:', e);
      return;
    }
    rendererRef.current = renderer;

    let mouse: [number, number] = [0, 0];
    let pointerCount = 0;

    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      renderer.updateScale(dpr);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      mouse = [(e.clientX - rect.left) * dpr, (rect.height - (e.clientY - rect.top)) * dpr];
      renderer.setPointer(mouse, pointerCount);
    };
    const onPointerDown = () => { pointerCount = 1; renderer.setPointer(mouse, pointerCount); };
    const onPointerUp   = () => { pointerCount = 0; renderer.setPointer(mouse, pointerCount); };

    resize();
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('resize', resize);

    const loop = (now: number) => {
      renderer.render(now);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', resize);
      renderer.destroy();
    };
  }, []);

  return (
    <section
      className={`relative w-full min-h-[calc(100vh-72px)] overflow-hidden bg-void ${className}`}
      aria-label="Hero"
    >
      <style>{`
        @keyframes shader-fade-down { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shader-fade-up   { from { opacity: 0; transform: translateY(20px);  } to { opacity: 1; transform: translateY(0); } }
        .shader-anim-down { animation: shader-fade-down .7s cubic-bezier(.16,1,.3,1) both; }
        .shader-anim-up   { animation: shader-fade-up   .85s cubic-bezier(.16,1,.3,1) both; }
        .shader-delay-2 { animation-delay: .2s; }
        .shader-delay-3 { animation-delay: .35s; }
        .shader-delay-4 { animation-delay: .55s; }
        .shader-delay-5 { animation-delay: .75s; }
      `}</style>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Subtle dark vignette to give text room to breathe */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,11,0.35) 60%, rgba(10,10,11,0.85) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-6 py-16 text-center">
        {trustBadge && (
          <div className="mb-8 shader-anim-down">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-elevated/40 backdrop-blur-md border border-white/10 rounded-full text-[0.78rem] text-muted-foreground">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold"
                style={{ boxShadow: `0 0 10px ${trustBadge.dotColor ?? 'var(--gold)'}` }}
              />
              {trustBadge.text}
            </span>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-2">
          <h1 className="font-display tracking-[-0.025em] text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02]">
            <span className="block text-foreground shader-anim-up shader-delay-2">{headline.line1}</span>
            <span className="block italic text-gold shader-anim-up shader-delay-3">{headline.line2}</span>
          </h1>
        </div>

        <p className="mt-6 max-w-2xl text-muted-foreground text-[1.05rem] md:text-[1.15rem] leading-relaxed shader-anim-up shader-delay-4">
          {subtitle}
        </p>

        {buttons && (
          <div className="mt-10 flex flex-col sm:flex-row gap-3 shader-anim-up shader-delay-5">
            {buttons.primary && (
              <ShaderButton variant="primary" href={buttons.primary.href} onClick={buttons.primary.onClick}>
                {buttons.primary.text} <span aria-hidden="true">→</span>
              </ShaderButton>
            )}
            {buttons.secondary && (
              <ShaderButton variant="ghost" href={buttons.secondary.href} onClick={buttons.secondary.onClick}>
                {buttons.secondary.text}
              </ShaderButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ShaderButton({
  variant,
  href,
  onClick,
  children,
}: {
  variant: 'primary' | 'ghost';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const cls =
    variant === 'primary'
      ? 'inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-gold to-gold-deep text-void font-semibold text-[0.95rem] shadow-[0_4px_24px_rgba(212,184,150,0.20)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,184,150,0.32)] transition-all duration-300'
      : 'inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-foreground hover:border-gold hover:text-gold hover:bg-[rgba(212,184,150,0.08)] backdrop-blur-sm font-medium text-[0.95rem] transition-all duration-300';
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export default AnimatedShaderHero;
