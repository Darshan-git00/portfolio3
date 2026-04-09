"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export default function HoloGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  useEffect(() => {
    const onToggle = () => setVisible((v) => !v);
    window.addEventListener("particle-field-toggle", onToggle);
    return () => window.removeEventListener("particle-field-toggle", onToggle);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [];
    const DOT_COUNT = 800;
    const GLOBE_RADIUS = 200;
    let raf: number;

    const initGlobe = () => {
      points = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        // Fibonacci sphere distribution for even spacing
        const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
        const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;

        const x = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
        const y = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
        const z = GLOBE_RADIUS * Math.cos(phi);

        points.push({ x, y, z, baseX: x, baseY: y, baseZ: z });
      }
    };

    const project = (p: Point, width: number, height: number, rotX: number, rotY: number) => {
      // Rotate around Y axis
      let x = p.baseX * Math.cos(rotY) - p.baseZ * Math.sin(rotY);
      let z = p.baseX * Math.sin(rotY) + p.baseZ * Math.cos(rotY);
      // Rotate around X axis
      let y = p.baseY * Math.cos(rotX) - z * Math.sin(rotX);
      z = p.baseY * Math.sin(rotX) + z * Math.cos(rotX);

      // Perspective projection
      const perspective = 600 / (600 - z);
      return {
        x: x * perspective + width / 2,
        y: y * perspective + height / 2,
        scale: perspective,
        alpha: (z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS) // Depth fading
      };
    };

    const draw = () => {
      const W = canvas.width / devicePixelRatio;
      const H = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, W, H);

      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }

      rotationRef.current.y += 0.003; // Constant slow rotation

      const dark = document.documentElement.classList.contains("dark");
      const primaryColor = dark ? "100, 200, 255" : "0, 100, 255";

      // Draw Connection Lines (Optional - for that "Mesh" look)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${primaryColor}, 0.1)`;
      ctx.lineWidth = 0.5;
      
      points.forEach((p, i) => {
        const proj = project(p, W, H, rotationRef.current.x, rotationRef.current.y);
        
        // Only draw points on the "front" half for clarity, or use alpha for back
        if (proj.scale > 0.8) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 1.2 * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${primaryColor}, ${proj.alpha * 0.8})`;
          ctx.fill();
        }
      });

      // Add "Scanning" Cones (The triangles in your image)
      const time = Date.now() * 0.001;
      ctx.save();
      ctx.translate(W / 2, H / 2);
      for(let i=0; i<3; i++) {
        ctx.rotate(time * 0.2 + i);
        const gradient = ctx.createLinearGradient(0, 0, GLOBE_RADIUS * 1.5, 0);
        gradient.addColorStop(0, `rgba(${primaryColor}, 0.2)`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(GLOBE_RADIUS * 1.8, -30);
        ctx.lineTo(GLOBE_RADIUS * 1.8, 30);
        ctx.fill();
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGlobe();
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

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
        zIndex: 0,
        filter: "blur(0.5px)", // Gives it a slight glow
      }}
    />
  );
}
