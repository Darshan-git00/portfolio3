import { useEffect, useRef } from "react";

export default function ThreadCursor() {
  const dotRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const points = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 20 }, () => ({ x: 0, y: 0 })),
  );
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const twangStartTime = useRef<number>(0);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    // Hide cursor on every element, not just body
    const styleEl = document.createElement("style");
    styleEl.id = "hide-cursor-style";
    styleEl.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isHoverable = target.closest("a, button, [role='button']");
      if (dotRef.current) {
        dotRef.current.style.scale = isHoverable ? "1.5" : "1";
        dotRef.current.style.opacity = isHoverable ? "1" : "0.85";
      }
    };

    const handleMouseDown = () => {
      twangStartTime.current = performance.now();
    };

    const animate = (time: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "hsl(0, 0%, 92%)" : "hsl(0, 0%, 8%)";

      const dx = mousePos.current.x - prevMousePos.current.x;
      const dy = mousePos.current.y - prevMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Smoothly update angle only when moving
      if (speed > 0.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        // Smooth angle interpolation to avoid snapping
        let diff = targetAngle - angleRef.current;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        angleRef.current += diff * 0.2;
      }

      if (dotRef.current) {
        dotRef.current.style.left = `${mousePos.current.x}px`;
        dotRef.current.style.top = `${mousePos.current.y}px`;
        dotRef.current.style.stroke = color;
        dotRef.current.style.transform = `translate(-50%, -50%) rotate(${angleRef.current}deg)`;
      }

      if (pathRef.current) {
        pathRef.current.style.stroke = color;
      }

      prevMousePos.current = { ...mousePos.current };

      // Thread physics
      points.current[0].x = mousePos.current.x;
      points.current[0].y = mousePos.current.y;

      const twangElapsed = time - twangStartTime.current;
      const isTwanging = twangElapsed < 500;
      const twangFactor = isTwanging
        ? Math.sin(twangElapsed * 0.05) * Math.exp(-twangElapsed * 0.01) * 15
        : 0;

      for (let i = 1; i < points.current.length; i++) {
        const p = points.current[i];
        const prev = points.current[i - 1];

        p.x += (prev.x - p.x) * 0.13;
        p.y += (prev.y - p.y) * 0.13;

        if (isTwanging) {
          const lateralOffset = Math.sin(i * 0.5) * twangFactor;
          p.x += lateralOffset;
          p.y += lateralOffset;
        }
      }

      if (pathRef.current) {
        const d =
          `M ${points.current[0].x} ${points.current[0].y} ` +
          points.current
            .slice(1)
            .map((p) => `L ${p.x} ${p.y}`)
            .join(" ");
        pathRef.current.setAttribute("d", d);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      const el = document.getElementById("hide-cursor-style");
      if (el) el.remove();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Kite cursor — redesigned with inner cross detail */}
      <svg
        ref={dotRef}
        className="fixed pointer-events-none"
        width="16"
        height="22"
        viewBox="0 0 16 22"
        style={{
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          fill: "transparent",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transition: "scale 150ms ease-out, opacity 150ms ease-out",
        }}
      >
        {/* Outer kite shape — sharper top, rounder bottom */}
        <path d="M8 0 L15 9 L8 22 L1 9 Z" strokeWidth="1.2" />
        {/* Horizontal spine */}
        <line
          x1="1"
          y1="9"
          x2="15"
          y2="9"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        {/* Vertical spine */}
        <line
          x1="8"
          y1="0"
          x2="8"
          y2="22"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        {/* Small center dot */}
        <circle
          cx="8"
          cy="9"
          r="1.2"
          strokeWidth="0"
          style={{ fill: "currentColor" }}
        />
      </svg>

      {/* Thread trail */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 99998 }}
      >
        <path
          ref={pathRef}
          fill="none"
          strokeWidth="0.8"
          strokeOpacity="0.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
