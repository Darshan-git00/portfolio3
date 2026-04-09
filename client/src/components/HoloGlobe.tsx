"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
}

interface Ripple { x: number; y: number; t: number; }

export default function ParticleField() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const ripples    = useRef<Ripple[]>([]);
  const lastRipple = useRef<number>(0);

  // Visibility state — off by default, toggled by hero image click
  const [visible, setVisible] = useState(false);
  // Smooth opacity via ref so the draw loop can read it without re-renders
  const alphaRef   = useRef(0);   // current rendered opacity 0–1
  const targetRef  = useRef(0);   // target: 0 or 1

  // Keep targetRef in sync with visible state
  useEffect(() => {
    targetRef.current = visible ? 1 : 0;
  }, [visible]);

  // Listen for the custom event fired by the hero image
  useEffect(() => {
    const onToggle = () => setVisible(v => !v);
    window.addEventListener("particle-field-toggle", onToggle);
    return () => window.removeEventListener("particle-field-toggle", onToggle);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 120;
    const MOUSE_RADIUS   = 140;
    const MOUSE_STRENGTH = 0.018;
    const RETURN_SPEED   = 0.008;
    const DAMPING        = 0.96;
    const DRIFT_SPEED    = 0.12;
    const CONNECTION_DIST = 110;
    const MAX_CONNECTIONS = 3;

    let particles: Particle[] = [];

    const resize = () => {
      const dpr     = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const bx = Math.random() * W;
        const by = Math.random() * H;
        return {
          x: bx, y: by, baseX: bx, baseY: by,
          vx:      (Math.random() - 0.5) * DRIFT_SPEED,
          vy:      (Math.random() - 0.5) * DRIFT_SPEED,
          size:    0.8 + Math.random() * 1.4,
          opacity: 0.2 + Math.random() * 0.5,
          speed:   0.6 + Math.random() * 0.8,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      const now = performance.now();
      if (now - lastRipple.current > 120) {
        lastRipple.current = now;
        ripples.current.push({ x: mouseRef.current.x, y: mouseRef.current.y, t: now });
      }
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      const W    = canvas.offsetWidth;
      const H    = canvas.offsetHeight;
      const dark = document.documentElement.classList.contains("dark");
      const mx   = mouseRef.current.x;
      const my   = mouseRef.current.y;
      const now  = performance.now();

      // Smoothly interpolate canvas opacity toward target
      const target  = targetRef.current;
      const current = alphaRef.current;
      alphaRef.current = current + (target - current) * (target > current ? 0.05 : 0.03);

      // Skip drawing entirely when invisible
      if (alphaRef.current < 0.005) {
        ctx.clearRect(0, 0, W, H);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Expire old ripples
      ripples.current = ripples.current.filter(r => now - r.t < 2000);

      const dotColor     = dark ? "255,255,255" : "80,80,120";
      const lineColor    = dark ? "255,255,255" : "80,80,120";
      const attractColor = dark ? "180,185,255" : "99,102,241";

      ctx.clearRect(0, 0, W, H);

      // Apply overall fade via globalAlpha
      ctx.globalAlpha = alphaRef.current;

      particles.forEach((p, i) => {
        const dx   = mx - p.x;
        const dy   = my - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const t     = 1 - dist / MOUSE_RADIUS;
          const force = t * t * MOUSE_STRENGTH;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.vx += (p.baseX - p.x) * RETURN_SPEED;
        p.vy += (p.baseY - p.y) * RETURN_SPEED;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x  += p.vx;
        p.y  += p.vy;

        // Water ripple displacement
        for (const rip of ripples.current) {
          const age       = (now - rip.t) / 1000;
          const waveFront = age * 90;
          const dotDist   = Math.hypot(p.x - rip.x, p.y - rip.y);
          const diff      = dotDist - waveFront;
          if (Math.abs(diff) < 50) {
            const norm   = diff / (50 * 0.5);
            const wave   = Math.exp(-norm * norm);
            const easeIn = Math.min(1, (now - rip.t) / 100);
            const decay  = 1 - (age / 2) * (age / 2);
            const dirX   = dotDist > 0 ? (p.x - rip.x) / dotDist : 0;
            const dirY   = dotDist > 0 ? (p.y - rip.y) / dotDist : 0;
            p.x += dirX * wave * 10 * decay * easeIn;
            p.y += dirY * wave * 10 * decay * easeIn;
          }
        }

        p.baseX += (Math.random() - 0.5) * 0.15 * p.speed;
        p.baseY += (Math.random() - 0.5) * 0.15 * p.speed;
        if (p.baseX < 0)  p.baseX = W;
        if (p.baseX > W)  p.baseX = 0;
        if (p.baseY < 0)  p.baseY = H;
        if (p.baseY > H)  p.baseY = 0;

        const near    = dist < MOUSE_RADIUS;
        const glow    = near ? (1 - dist / MOUSE_RADIUS) : 0;
        const alpha   = Math.min(p.opacity + glow * 0.35, 0.95);
        const dotSize = p.size + glow * 0.9;
        const color   = near ? attractColor : dotColor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();

        // Connection lines
        let connections = 0;
        for (let j = i + 1; j < particles.length && connections < MAX_CONNECTIONS; j++) {
          const o  = particles[j];
          const ld = Math.hypot(p.x - o.x, p.y - o.y);
          if (ld < CONNECTION_DIST) {
            connections++;
            const la = (1 - ld / CONNECTION_DIST) * 0.15 * (dark ? 1 : 0.6);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(${lineColor},${la})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1; // reset
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",     resize);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        pointerEvents: "none",
        zIndex:        0,
      }}
      aria-hidden="true"
    />
  );
}
