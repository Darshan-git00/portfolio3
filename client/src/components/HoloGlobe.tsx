"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
  x: number; y: number; z: number;
  baseX: number; baseY: number; baseZ: number;
}

interface Satellite {
  phi: number;
  theta: number;
  distance: number;
  speed: number;
  id: string;
}

export default function CyberGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const rotationRef = useRef({ x: 0.2, y: 0 }); // Slight tilt for better 3D feel

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

    const DOT_COUNT = 1000;
    const GLOBE_RADIUS = 180;
    let points: Point[] = [];
    let satellites: Satellite[] = [
      { phi: 1, theta: 0, distance: 240, speed: 0.01, id: "MTLB-S::2" },
      { phi: -0.5, theta: 2, distance: 260, speed: -0.008, id: "IRDEN-19D" },
      { phi: 0.2, theta: 4, distance: 220, speed: 0.015, id: "INT-019DPT" }
    ];

    const initGlobe = () => {
      points = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
        const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
        points.push({
          x: 0, y: 0, z: 0,
          baseX: GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi),
          baseY: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
          baseZ: GLOBE_RADIUS * Math.cos(phi)
        });
      }
    };

    const project = (x: number, y: number, z: number, W: number, H: number) => {
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // Y-Axis Rotation
      let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
      // X-Axis Rotation (Tilt)
      let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

      const perspective = 800 / (800 - z2);
      return {
        px: x1 * perspective + W / 2,
        py: y2 * perspective + H / 2,
        pz: z2,
        scale: perspective
      };
    };

    const draw = () => {
      const W = canvas.width / devicePixelRatio;
      const H = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, W, H);
      if (!visible) { requestAnimationFrame(draw); return; }

      rotationRef.current.y += 0.002;
      const dark = document.documentElement.classList.contains("dark");
      const cyan = dark ? "0, 210, 255" : "0, 80, 150";

      // 1. Draw Globe Dots
      points.forEach(p => {
        const proj = project(p.baseX, p.baseY, p.baseZ, W, H);
        if (proj.pz > -50) { // Simple back-face culling
          const opacity = Math.max(0, (proj.pz + GLOBE_RADIUS) / (2 * GLOBE_RADIUS));
          ctx.fillStyle = `rgba(${cyan}, ${opacity * 0.6})`;
          ctx.fillRect(proj.px, proj.py, 1.5 * proj.scale, 1.5 * proj.scale);
        }
      });

      // 2. Draw Satellites & Scanning Beams
      satellites.forEach(s => {
        s.theta += s.speed;
        const sx = s.distance * Math.cos(s.theta) * Math.sin(s.phi);
        const sy = s.distance * Math.sin(s.theta) * Math.sin(s.phi);
        const sz = s.distance * Math.cos(s.phi);
        const proj = project(sx, sy, sz, W, H);

        if (proj.pz > -100) {
          // Satellite Icon
          ctx.strokeStyle = `rgba(${cyan}, 0.8)`;
          ctx.lineWidth = 2;
          ctx.strokeRect(proj.px - 3, proj.py - 3, 6, 6);
          
          // Label
          ctx.font = "10px monospace";
          ctx.fillStyle = `rgba(${cyan}, 0.8)`;
          ctx.fillText(s.id, proj.px + 10, proj.py);

          // Scanning Beam (Triangle)
          const grad = ctx.createRadialGradient(proj.px, proj.py, 0, proj.px, proj.py, 150);
          grad.addColorStop(0, `rgba(${cyan}, 0.2)`);
          grad.addColorStop(1, "transparent");
          
          ctx.beginPath();
          ctx.moveTo(proj.px, proj.py);
          ctx.lineTo(W / 2 + (proj.px - W / 2) * 0.5, H / 2 + (proj.py - H / 2) * 0.5 + 40);
          ctx.lineTo(W / 2 + (proj.px - W / 2) * 0.5, H / 2 + (proj.py - H / 2) * 0.5 - 40);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // 3. Draw UI Circles (The "HUD" rings)
      ctx.strokeStyle = `rgba(${cyan}, 0.1)`;
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, GLOBE_RADIUS + 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      requestAnimationFrame(draw);
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
    return () => window.removeEventListener("resize", resize);
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: "radial-gradient(circle at center, rgba(0,20,40,0.2) 0%, transparent 70%)"
      }}
    />
  );
}
