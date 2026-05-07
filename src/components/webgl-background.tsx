'use client';

/**
 * WebGL gold flow background — runs a single full-screen fragment shader.
 * Pure WebGL1, no dependencies. Pauses when off-screen / when user prefers
 * reduced motion. Sized at 0.6× DPR for performance — the effect is so soft
 * the lower res is invisible. Falls back to a CSS gradient if WebGL isn't
 * available (older mobile, Safari fallback).
 */

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Flowing gold mesh: layered FBM noise warps a soft radial gradient. The
// amber-700 + amber-500 pair matches the site palette. Output is alpha-
// premultiplied so the canvas blends additively over the cream page bg.
const FRAG = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Stone-50 base (linearized). Output is rendered with low alpha and the
// canvas sits behind page content, so this is mostly the "missing" colour.
const vec3 BASE = vec3(0.980, 0.980, 0.973);
const vec3 GOLD = vec3(0.792, 0.541, 0.016);   // #CA8A04
const vec3 GOLD_BRIGHT = vec3(0.918, 0.702, 0.031); // #EAB308
const vec3 GOLD_DEEP = vec3(0.631, 0.384, 0.027);   // #A16207

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

  // Slow flowing warp
  float t = u_time * 0.04;
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 5.2));
  float n = fbm(p * 2.0 + q * 1.8 + t * 0.5);

  // Three soft "blobs" that drift — gives the 3D sense of depth
  float blob1 = exp(-4.0 * length(p - vec2(sin(t * 1.6) * 0.45, cos(t * 1.3) * 0.35)));
  float blob2 = exp(-4.5 * length(p - vec2(cos(t * 1.1 + 2.0) * 0.55, sin(t * 1.7 + 1.0) * 0.45)));
  float blob3 = exp(-5.0 * length(p - vec2(sin(t * 0.9 + 4.0) * 0.35, cos(t * 1.5 + 3.0) * 0.40)));

  // Mouse interaction — soft repulsion / highlight near cursor
  vec2 mp = (u_mouse / u_resolution.xy - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float mouseGlow = exp(-6.0 * length(p - mp)) * 0.35;

  float intensity = (blob1 * 0.55 + blob2 * 0.45 + blob3 * 0.40 + mouseGlow) * (0.55 + n * 0.55);

  vec3 col = mix(GOLD_DEEP, GOLD_BRIGHT, n);
  col = mix(col, GOLD, q.x);

  // Premultiplied alpha — keeps gold tone clean over the cream page bg.
  // Strong cap so the background never overpowers content (≤ 0.18 alpha).
  float alpha = clamp(intensity * 0.55, 0.0, 0.18);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const mouseRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Honour user preference — show the static fallback gradient instead.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      canvas.style.background =
        'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(202,138,4,0.10), transparent 60%)';
      return;
    }

    const gl =
      (canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }) ||
        canvas.getContext('experimental-webgl', { alpha: true })) as WebGLRenderingContext | null;
    if (!gl) {
      canvas.style.background =
        'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(202,138,4,0.10), transparent 60%)';
      return;
    }

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full-screen triangle (3 verts is faster than a quad)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      // 0.6× DPR — the gradient is so soft the lower res is invisible
      // and the perf gain is meaningful on retina displays.
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.6;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function onMouseMove(e: MouseEvent) {
      const dpr = (canvas!.width / window.innerWidth);
      mouseRef.current = [e.clientX * dpr, (window.innerHeight - e.clientY) * dpr];
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const start = performance.now();
    function render() {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }
      const t = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

    // Pause when tab hidden — saves battery
    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
