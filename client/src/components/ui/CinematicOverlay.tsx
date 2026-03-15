import { useEffect, useRef } from "react";

export default function CinematicOverlay() {
  // All state as refs — draw loop reads them synchronously every frame
  const activeRef  = useRef(false);   // particles on or off
  const phaseRef   = useRef<"idle" | "flash" | "settle">("idle");
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const vigRef     = useRef<HTMLDivElement>(null);
  const flashRef   = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const onToggle = () => {
      // Flip active
      activeRef.current = !activeRef.current;

      // Run phase sequence via timeouts — no state, pure refs
      phaseRef.current = "flash";
      setTimeout(() => { phaseRef.current = "settle"; }, 900);
      setTimeout(() => { phaseRef.current = "idle";   }, 2000);
    };

    window.addEventListener("particle-field-toggle", onToggle);
    return () => window.removeEventListener("particle-field-toggle", onToggle);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const vig    = vigRef.current;
    const flash  = flashRef.current;
    if (!canvas || !vig || !flash) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let grainOpacity = 0;
    let vigOpacity   = 0;

    const tick = () => {
      const phase  = phaseRef.current;
      const isOn   = activeRef.current;

      // ── Target grain opacity ──────────────────────────────────────
      const grainTarget =
        phase === "flash"  ? 0.10 :
        phase === "settle" ? (isOn ? 0.045 : 0.02) :
        isOn               ? 0.032 : 0;

      // ── Target vignette opacity ───────────────────────────────────
      const vigTarget =
        phase === "flash"  ? 0.65 :
        phase === "settle" ? 0.22 :
        isOn               ? 0.10 : 0;

      // ── Lerp grain ────────────────────────────────────────────────
      const grainSpeed = grainTarget > grainOpacity ? 0.07 : 0.03;
      grainOpacity    += (grainTarget - grainOpacity) * grainSpeed;

      // ── Lerp vignette ─────────────────────────────────────────────
      const vigSpeed = vigTarget > vigOpacity ? 0.10 : 0.025;
      vigOpacity    += (vigTarget - vigOpacity) * vigSpeed;

      // ── Draw grain ────────────────────────────────────────────────
      if (grainOpacity > 0.005) {
        const W = canvas.width;
        const H = canvas.height;
        const imageData = ctx.createImageData(W, H);
        const data      = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v      = Math.random() > 0.5 ? 220 : 30;
          data[i]      = v;
          data[i + 1]  = v;
          data[i + 2]  = v;
          data[i + 3]  = Math.random() * 255 * grainOpacity;
        }
        ctx.putImageData(imageData, 0, 0);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // ── Apply vignette opacity directly via style ─────────────────
      vig.style.opacity = String(vigOpacity);

      // ── Flash: brief white on first frame of flash ─────────────────
      flash.style.opacity = phase === "flash" && vigTarget === 0.65 ? "0.045" : "0";

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9998,
        pointerEvents: "none",
      }}
    >
      {/* Animated film grain */}
      <canvas
        ref={canvasRef}
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          mixBlendMode:  "overlay",
        }}
      />

      {/* Vignette — dark edges */}
      <div
        ref={vigRef}
        style={{
          position:   "absolute",
          inset:      0,
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)",
          opacity:    0,
        }}
      />

      {/* Shutter flash */}
      <div
        ref={flashRef}
        style={{
          position:   "absolute",
          inset:      0,
          background: "#fff",
          opacity:    0,
        }}
      />
    </div>
  );
}