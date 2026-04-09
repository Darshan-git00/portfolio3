"use client";

import { useEffect, useRef, useState } from "react";

// --- Configuration ---
const CONFIG = {
  grid: {
    spacing: 60,
    opacity: 0.1, // Fixed grid opacity
  },
  particles: {
    count: 150,
    baseSize: 1.8,
    maxSize: 4.5, // Glimmer size
    baseOpacity: 0.25,
    maxOpacity: 0.8,
    baseSpeed: 0.8,
    mouseAttract: 0.08,
  },
  streams: {
    curveVariance: 120, // How much streams weave
    count: 6, // Major pathways
    width: 2.5,
    segmentLength: 400,
  }
};

interface Particle {
  id: number;
  t: number; // Normalized time along stream [0,1]
  speed: number;
  glimmer: boolean;
  baseT: number; // Where it started
  streamIndex: number; // Which Bézier path it follows
  currentX: number;
  currentY: number;
}

export default function AlgorithmicFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Use state to make the canvas visible only when ready
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let particles: Particle[] = [];
    const bezierPaths: Array<[number, number][]> = [];

    // --- Core Functions ---

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = window.innerWidth;
      H = window.innerHeight;
      initPaths();
      initParticles();
      if (!isReady) setIsReady(true);
    };

    // Define unique Bézier curve paths for streams
    const initPaths = () => {
      bezierPaths.length = 0;
      for (let i = 0; i < CONFIG.streams.count; i++) {
        // Simple 3-point Bézier flow: Left to Right
        const path: [number, number][] = [
          [0, H / 2 + (Math.random() - 0.5) * H * 0.6], // Start (off-screen)
          [W / 2 + (Math.random() - 0.5) * CONFIG.streams.curveVariance, H / 2], // Middle
          [W, H / 2 + (Math.random() - 0.5) * H * 0.6], // End (off-screen)
        ];
        bezierPaths.push(path);
      }
    };

    const getPointOnPath = (t: number, path: [number, number][]) => {
      const u = 1 - t;
      const t2 = t * t;
      const u2 = u * u;
      
      const [p0, p1, p2] = path;
      const x = u2 * p0[0] + 2 * u * t * p1[0] + t2 * p2[0];
      const y = u2 * p0[1] + 2 * u * t * p1[1] + t2 * p2[1];
      return { x, y };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < CONFIG.particles.count; i++) {
        const streamIdx = Math.floor(Math.random() * CONFIG.streams.count);
        particles.push({
          id: i,
          baseT: Math.random(), // Random starting point on curve
          t: Math.random(),
          speed: (CONFIG.particles.baseSpeed + Math.random() * 0.4) / 1000,
          glimmer: Math.random() < 0.2, // Small % glimmer
          streamIndex: streamIdx,
          currentX: 0,
          currentY: 0,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    // --- Draw Loop ---
    const draw = (t: number) => {
      timeRef.current = t / 1000; // Time in seconds
      ctx.clearRect(0, 0, W, H);
      
      const dark = document.documentElement.classList.contains("dark");
      const baseColor = dark ? "255, 255, 255" : "30, 40, 60";
      const streamColor = dark ? "80, 180, 255" : "90, 100, 241"; // Dynamic stream color

      // 1. Draw Fixed Grid Blueprint
      ctx.save();
      ctx.strokeStyle = `rgba(${baseColor}, ${CONFIG.grid.opacity})`;
      ctx.lineWidth = 0.5;
      
      const gridOffset = W * 0.05; // Make the grid feel less rigid
      for (let x = -gridOffset; x < W + gridOffset; x += CONFIG.grid.spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -gridOffset; y < H + gridOffset; y += CONFIG.grid.spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Stream Pathways (Ghost lines)
      ctx.save();
      ctx.strokeStyle = `rgba(${streamColor}, 0.08)`;
      ctx.lineWidth = CONFIG.streams.width;
      ctx.lineCap = "round";
      bezierPaths.forEach(path => {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const pt = getPointOnPath(i / 100, path);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });
      ctx.restore();

      // 3. Draw Particles
      particles.forEach((p, i) => {
        p.t = (p.baseT + timeRef.current * p.speed) % 1; // Normalize t and loop
        const path = bezierPaths[p.streamIndex];
        const pt = getPointOnPath(p.t, path);
        p.currentX = pt.x;
        p.currentY = pt.y;

        // Mouse interaction: particles slightly attracted to mouse
        const dx = mouseRef.current.x - p.currentX;
        const dy = mouseRef.current.y - p.currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.currentX += dx * CONFIG.particles.mouseAttract * (1 - dist / 150);
          p.currentY += dy * CONFIG.particles.mouseAttract * (1 - dist / 150);
        }

        // Draw the Particle
        ctx.beginPath();
        const baseSize = CONFIG.particles.baseSize;
        const size = p.glimmer ? baseSize * (1 + 0.3 * Math.sin(timeRef.current * 4 + i)) : baseSize;
        const opacity = p.glimmer ? CONFIG.particles.baseOpacity * (1 + 0.5 * Math.sin(timeRef.current * 4 + i)) : CONFIG.particles.baseOpacity;
        
        ctx.arc(p.currentX, p.currentY, size, 0, Math.PI * 2);
        
        // Active Glimmer Color
        const color = p.glimmer ? `rgba(${streamColor}, ${opacity + 0.1})` : `rgba(${baseColor}, ${opacity})`;
        ctx.fillStyle = color;
        ctx.fill();

        // 4. Subtle Inter-particle Connections (Active Glimmer only)
        if (p.glimmer) {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            if (!other.glimmer || other.streamIndex !== p.streamIndex) continue; // Only same stream connection
            
            const dx = other.currentX - p.currentX;
            const dy = other.currentY - p.currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) { // Max connection dist
              ctx.beginPath();
              ctx.moveTo(p.currentX, p.currentY);
              ctx.lineTo(other.currentX, other.currentY);
              ctx.strokeStyle = `rgba(${streamColor}, 0.04)`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    // --- Init ---
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isReady]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1, // Ensure it's in the extreme background
        opacity: isReady ? 1 : 0, // Fade-in when ready
        transition: "opacity 0.6s ease",
        background: "transparent", // Use container background or radial gradient
      }}
      aria-hidden="true"
    />
  );
}
