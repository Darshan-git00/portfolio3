import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Mail, Linkedin } from "lucide-react";

interface Dot    { x: number; y: number; z: number; }
interface Orbit  { tilt: number; yaw: number; r: number; }
interface Ripple { x: number; y: number; t: number; }

function generateSphereDots(count: number): Dot[] {
  const dots: Dot[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    dots.push({ x: r * Math.cos(t), y, z: r * Math.sin(t) });
  }
  return dots;
}

function getColors(dark: boolean) {
  if (dark) {
    return {
      bgInner:    "rgba(120,40,0,0.45)",
      bgOuter:    "rgba(80,25,0,0.20)",
      haloInner:  "rgba(249,115,22,0.18)",
      haloOuter:  "rgba(249,115,22,0.06)",
      dot:        (a: number) => `rgba(249,115,22,${a})`,
      grid:       "rgba(249,115,22,0.12)",
      orbitFront: 0.28,
      orbitBack:  0.08,
      orbitRgb:   "249,115,22",
    };
  }
  return {
    bgInner:    "rgba(100,110,200,0.06)",
    bgOuter:    "rgba(80,90,180,0.02)",
    haloInner:  "rgba(99,102,241,0.10)",
    haloOuter:  "rgba(5, 9, 248, 0.03)",
    dot:        (a: number) => `rgba(80,90,200,${a * 0.55})`,
    grid:       "rgba(99,102,241,0.07)",
    orbitFront: 0.18,
    orbitBack:  0.05,
    orbitRgb:   "99,102,241",
  };
}

const RIPPLE_DURATION = 2000;
const RIPPLE_SPEED    = 160;
const RIPPLE_AMP      = 15;
const RIPPLE_WIDTH    = 90;
const RIPPLE_THROTTLE = 350;
const RIPPLE_EASE_IN  = 150;

function ContactGlobe() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const ripples    = useRef<Ripple[]>([]);
  const lastRipple = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots: Dot[] = generateSphereDots(800);
    const rotX = 0.2;
    const orbits: Orbit[] = [
      { tilt:  0.55, yaw: 0,   r: 1.38 },
      { tilt: -0.40, yaw: 1.1, r: 1.55 },
      { tilt:  1.05, yaw: 2.3, r: 1.46 },
    ];

    const resize = () => {
      const dpr     = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const now  = performance.now();
      if (now - lastRipple.current < RIPPLE_THROTTLE) return;
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const W    = canvas.offsetWidth;
      const H    = canvas.offsetHeight;
      if (mx < 0 || my < 0 || mx > W || my > H) return;
      const cx = W / 2;
      const cy = H / 2;
      const R  = Math.min(W, H) * 0.42;
      if (Math.hypot(mx - cx, my - cy) > R * 1.3) return;
      lastRipple.current = now;
      ripples.current.push({ x: mx, y: my, t: now });
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const W    = canvas.offsetWidth;
      const H    = canvas.offsetHeight;
      if (mx < 0 || my < 0 || mx > W || my > H) return;
      const cx = W / 2;
      const cy = H / 2;
      const R  = Math.min(W, H) * 0.42;
      if (Math.hypot(mx - cx, my - cy) > R * 1.3) return;
      ripples.current.push({ x: mx, y: my, t: performance.now() });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click",     onClick);

    const rot = (dx: number, dy: number, dz: number, ry: number, rx: number) => {
      const x1 =  dx * Math.cos(ry) + dz * Math.sin(ry);
      const z1 = -dx * Math.sin(ry) + dz * Math.cos(ry);
      const y2 =  dy * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 =  dy * Math.sin(rx) + z1 * Math.cos(rx);
      return { x: x1, y: y2, z: z2 };
    };

    const draw = (ts: number) => {
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;
      if (!W || !H) { rafRef.current = requestAnimationFrame(draw); return; }

      const cx   = W / 2;
      const cy   = H / 2;
      const R    = Math.min(W, H) * 0.42; // ← bigger globe
      const rotY = (ts * 0.0002) % (Math.PI * 2);
      const dark = document.documentElement.classList.contains("dark");
      const C    = getColors(dark);
      const now  = performance.now();

      ripples.current = ripples.current.filter((r: Ripple) => now - r.t < RIPPLE_DURATION);
      ctx.clearRect(0, 0, W, H);

      // Background glow
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
      bg.addColorStop(0,   C.bgInner);
      bg.addColorStop(0.5, C.bgOuter);
      bg.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();

      // Halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.25);
      halo.addColorStop(0,   C.haloInner);
      halo.addColorStop(0.5, C.haloOuter);
      halo.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();

      // ── No edge ring stroke — border removed ──

      // Sphere dots with ripple
      const projected = dots.map(d => {
        const p  = rot(d.x, d.y, d.z, rotY, rotX);
        let sx   = cx + p.x * R;
        let sy   = cy + p.y * R;
        for (const rip of ripples.current) {
          const age       = (now - rip.t) / 1000;
          const waveFront = age * RIPPLE_SPEED;
          const dotDist   = Math.hypot(sx - rip.x, sy - rip.y);
          const diff      = dotDist - waveFront;
          if (Math.abs(diff) < RIPPLE_WIDTH) {
            const norm   = diff / (RIPPLE_WIDTH * 0.45);
            const wave   = Math.exp(-norm * norm);
            const easeIn = Math.min(1, (now - rip.t) / RIPPLE_EASE_IN);
            const lifeT  = age / (RIPPLE_DURATION / 1000);
            const decay  = 1 - lifeT * lifeT * (3 - 2 * lifeT);
            const dirX   = dotDist > 0 ? (sx - rip.x) / dotDist : 0;
            const dirY   = dotDist > 0 ? (sy - rip.y) / dotDist : 0;
            sx += dirX * wave * RIPPLE_AMP * decay * easeIn;
            sy += dirY * wave * RIPPLE_AMP * decay * easeIn;
          }
        }
        return { sx, sy, depth: p.z };
      });

      projected.sort((a, b) => a.depth - b.depth);
      for (const p of projected) {
        if (p.depth < -0.05) continue;
        const norm  = (p.depth + 1) / 2;
        const alpha = 0.15 + norm * 0.75;
        const size  = 0.8 + norm * 1.0;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = C.dot(alpha); ctx.fill();
      }

      // Grid lines
      ctx.lineWidth = 0.35; ctx.strokeStyle = C.grid;
      for (let lat = -60; lat <= 60; lat += 30) {
        const phi2 = (90 - lat) * (Math.PI / 180);
        const yr   = Math.cos(phi2);
        ctx.beginPath(); let first = true;
        for (let lng = -180; lng <= 181; lng += 3) {
          const theta = (lng + 180) * (Math.PI / 180);
          const dx    = -Math.sin(phi2) * Math.cos(theta);
          const dz    =  Math.sin(phi2) * Math.sin(theta);
          const p     = rot(dx, yr, dz, rotY, rotX);
          if (p.z < 0) { first = true; continue; }
          first ? ctx.moveTo(cx + p.x * R, cy + p.y * R)
                : ctx.lineTo(cx + p.x * R, cy + p.y * R);
          first = false;
        }
        ctx.stroke();
      }

      // Orbit rings
      orbits.forEach(orbit => {
        const orR = R * orbit.r;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
          const ox  =  orR * Math.cos(a);
          const oy  =  orR * Math.sin(a) * Math.cos(orbit.tilt);
          const oz  =  orR * Math.sin(a) * Math.sin(orbit.tilt);
          const ox2 =  ox  * Math.cos(orbit.yaw) - oz * Math.sin(orbit.yaw);
          const oz2 =  ox  * Math.sin(orbit.yaw) + oz * Math.cos(orbit.yaw);
          const p   = rot(ox2 / R, oy / R, oz2 / R, rotY, rotX);
          const sx  = cx + p.x * R;
          const sy  = cy + p.y * R;
          const fa  = p.z > 0 ? C.orbitFront : C.orbitBack;
          if (a === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.strokeStyle = `rgba(${C.orbitRgb},${fa})`;
            ctx.lineWidth   = 0.7;
            ctx.lineTo(sx, sy);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sx, sy);
          }
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click",     onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
      }}
      aria-hidden="true"
    />
  );
}

// ─── Contact section ──────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-t border-b border-border"
      >
        {/* ── Top: content row ── */}
        <div className="py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-green-500" />
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                  Available for opportunities · Bengaluru
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Got an idea?{" "}
                <span className="text-muted-foreground italic font-medium">
                  Let's build it.
                </span>
              </h2>

              <p className="text-[12px] text-muted-foreground/60 italic">
                psst — I also play badminton 🏸
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <motion.a
                  href="https://mail.google.com/mail/?view=cm&to=darshanprabhakar66@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 px-5 py-[10px] rounded-full bg-foreground text-background text-[12px] font-mono tracking-[0.04em] hover:opacity-90 transition-opacity duration-200"
                  aria-label="Send me an email"
                >
                  <Mail className="w-[13px] h-[13px]" />
                  Send a mail
                </motion.a>

              <motion.a
                href={resumeData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 px-5 py-[10px] rounded-full border border-border text-muted-foreground text-[12px] font-mono tracking-[0.04em] hover:border-foreground/40 hover:text-foreground transition-all duration-200"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-[13px] h-[13px]" />
                LinkedIn
              </motion.a>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.06em]" />
            <span className="text-[10px] font-mono text-muted-foreground/40 italic">
              Response time: usually same day
            </span>
          </div>
        </div>

        {/* ── Bottom: globe ── */}
        <div className="relative overflow-hidden rounded-xl" style={{ height: 360 }}>
          <ContactGlobe />
        </div>

      </motion.div>
    </section>
  );
}