"use client";

import { useEffect, useRef } from "react";

interface Dot { lat: number; lng: number; }
interface OrbitRing { tilt: number; yaw: number; speed: number; radius: number; dotAngle: number; }

function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  ];
}

function project(x: number, y: number, z: number, rotY: number, rotX: number, cx: number, cy: number) {
  const x1 =  x * Math.cos(rotY) + z * Math.sin(rotY);
  const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
  const y2 =  y * Math.cos(rotX) - z1 * Math.sin(rotX);
  const z2 =  y * Math.sin(rotX) + z1 * Math.cos(rotX);
  return { sx: cx + x1, sy: cy + y2, depth: z2 };
}

function generateLandDots(): Dot[] {
  const regions = [
    { latMin: 25,  latMax: 70,  lngMin: -140, lngMax: -60  },
    { latMin: -55, latMax: 12,  lngMin: -80,  lngMax: -35  },
    { latMin: 35,  latMax: 70,  lngMin: -10,  lngMax: 40   },
    { latMin: -35, latMax: 37,  lngMin: -18,  lngMax: 52   },
    { latMin: 10,  latMax: 75,  lngMin: 40,   lngMax: 145  },
    { latMin: -10, latMax: 25,  lngMin: 95,   lngMax: 140  },
    { latMin: -40, latMax: -10, lngMin: 114,  lngMax: 154  },
    { latMin: 30,  latMax: 46,  lngMin: 128,  lngMax: 146  },
    { latMin: 8,   latMax: 36,  lngMin: 68,   lngMax: 97   },
    { latMin: 60,  latMax: 84,  lngMin: -55,  lngMax: -18  },
  ];
  const dots: Dot[] = [];
  for (let lat = -85; lat <= 85; lat += 4) {
    for (let lng = -180; lng <= 180; lng += 4) {
      if (regions.some(r => lat >= r.latMin && lat <= r.latMax && lng >= r.lngMin && lng <= r.lngMax)) {
        dots.push({ lat: lat + (Math.random() - 0.5) * 1.5, lng: lng + (Math.random() - 0.5) * 1.5 });
      }
    }
  }
  return dots;
}

export default function HoloGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = generateLandDots();
    const rotX = 0.25;
    const orbits: OrbitRing[] = [
      { tilt: 0.6,  yaw: 0,   speed: 0.4,  radius: 1.35, dotAngle: 0   },
      { tilt: -0.4, yaw: 1.1, speed: 0.25, radius: 1.55, dotAngle: 2.1 },
      { tilt: 1.1,  yaw: 2.3, speed: 0.18, radius: 1.45, dotAngle: 4.2 },
    ];

    const resize = () => {
      const dpr     = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;
      if (!W || !H) { rafRef.current = requestAnimationFrame(draw); return; }

      const cx   = W / 2;
      const cy   = H / 2;
      const R    = Math.min(W, H) * 0.32;
      const rotY = (ts * 0.00018) % (Math.PI * 2);

      ctx.clearRect(0, 0, W, H);

      // Outer halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.2);
      halo.addColorStop(0,   "rgba(0,210,220,0.10)");
      halo.addColorStop(0.5, "rgba(0,180,210,0.04)");
      halo.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();

      // Globe glow
      const glow = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
      glow.addColorStop(0,   "rgba(0,100,160,0.18)");
      glow.addColorStop(0.6, "rgba(0,60,100,0.08)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();

      // Globe edge ring
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,200,220,0.35)";
      ctx.lineWidth = 1.2; ctx.stroke();

      // Grid lines
      ctx.lineWidth = 0.4; ctx.strokeStyle = "rgba(0,180,210,0.12)";
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const [x, y, z] = latLngToXYZ(lat, lng, R);
          const p = project(x, y, z, rotY, rotX, cx, cy);
          if (p.depth < 0) { first = true; continue; }
          first ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy); first = false;
        }
        ctx.stroke();
      }
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath(); let first = true;
        for (let lat = -85; lat <= 85; lat += 3) {
          const [x, y, z] = latLngToXYZ(lat, lng, R);
          const p = project(x, y, z, rotY, rotX, cx, cy);
          if (p.depth < 0) { first = true; continue; }
          first ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy); first = false;
        }
        ctx.stroke();
      }

      // Land dots
      for (const dot of dots) {
        const [x, y, z] = latLngToXYZ(dot.lat, dot.lng, R);
        const p = project(x, y, z, rotY, rotX, cx, cy);
        if (p.depth < 0) continue;
        const alpha = Math.max(0, Math.min(1, (p.depth / R) * 2.5));
        ctx.beginPath(); ctx.arc(p.sx, p.sy, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,220,240,${alpha * 0.75})`; ctx.fill();
      }

      // Orbit rings + satellites
      orbits.forEach((orbit, oi) => {
        orbit.dotAngle += 0.004 * orbit.speed * (1 + oi * 0.3);
        const orR = R * orbit.radius;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.04) {
          const ox = orR * Math.cos(a);
          const oy = orR * Math.sin(a) * Math.cos(orbit.tilt);
          const oz = orR * Math.sin(a) * Math.sin(orbit.tilt);
          const ox2 = ox * Math.cos(orbit.yaw) - oz * Math.sin(orbit.yaw);
          const oz2 = ox * Math.sin(orbit.yaw) + oz * Math.cos(orbit.yaw);
          const p = project(ox2, oy, oz2, rotY, rotX, cx, cy);
          a === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,200,220,0.18)"; ctx.lineWidth = 0.8; ctx.stroke();

        const sa   = orbit.dotAngle;
        const sox  = orR * Math.cos(sa);
        const soy  = orR * Math.sin(sa) * Math.cos(orbit.tilt);
        const soz  = orR * Math.sin(sa) * Math.sin(orbit.tilt);
        const sox2 = sox * Math.cos(orbit.yaw) - soz * Math.sin(orbit.yaw);
        const soz2 = sox * Math.sin(orbit.yaw) + soz * Math.cos(orbit.yaw);
        const sp   = project(sox2, soy, soz2, rotY, rotX, cx, cy);

        const sg = ctx.createRadialGradient(sp.sx, sp.sy, 0, sp.sx, sp.sy, 10);
        sg.addColorStop(0,   "rgba(180,240,255,0.9)");
        sg.addColorStop(0.4, "rgba(0,200,240,0.4)");
        sg.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(sp.sx, sp.sy, 10, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();
        ctx.beginPath(); ctx.arc(sp.sx, sp.sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,245,255,0.95)"; ctx.fill();
      });

      // HUD labels
      ctx.font = "10px monospace"; ctx.fillStyle = "rgba(0,200,220,0.45)";
      ctx.fillText("MTLB-s::2",    14,      22      );
      ctx.fillText("971:991-REL",  14,      H - 14  );
      ctx.fillText("REL0198::SEC1",W - 120, 22      );
      ctx.fillText("INT-019DPT",   W - 100, H * 0.48);

      // Crosshairs
      [[ cx, cy + R * 0.55 ], [ cx - R * 0.55, cy ]].forEach(([x, y]) => {
        ctx.strokeStyle = "rgba(0,200,220,0.3)"; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y);
        ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
        ctx.stroke();
      });

      // Progress bar
      const bx = W - 110, by = H - 18;
      ctx.fillStyle = "rgba(0,180,210,0.25)"; ctx.fillRect(bx, by, 90, 5);
      ctx.fillStyle = "rgba(0,210,240,0.7)";  ctx.fillRect(bx, by, 55, 5);
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = "rgba(0,0,20,0.9)";
        ctx.fillRect(bx + 18 + b * 18, by, 3, 5);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []); // ← empty deps — runs once, no theme dependency at all

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        pointerEvents: "none",
        zIndex:        0,
        opacity:       1,
      }}
      aria-hidden="true"
    />
  );
}