import { useEffect, useRef } from "react";

export default function ThreadCursor() {
  const dotRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const points = useRef<{ x: number; y: number }[]>(Array.from({ length: 20 }, () => ({ x: 0, y: 0 })));
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const twangStartTime = useRef<number>(0);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target as HTMLElement;
      const isHoverable = target.closest("a, button, [role='button']");
      if (dotRef.current) {
        dotRef.current.style.scale = isHoverable ? "1.4" : "1";
      }
    };

    const handleMouseDown = () => {
      twangStartTime.current = performance.now();
    };

    const animate = (time: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 10%)";
      
      if (dotRef.current) {
        dotRef.current.style.left = `${mousePos.current.x}px`;
        dotRef.current.style.top = `${mousePos.current.y}px`;
        dotRef.current.style.stroke = color;

        // Rotation calculation
        const dx = mousePos.current.x - prevMousePos.current.x;
        const dy = mousePos.current.y - prevMousePos.current.y;
        
        // Only update angle if moving
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 because top point leads
          dotRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        } else {
          dotRef.current.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        }
      }
      
      if (pathRef.current) pathRef.current.style.stroke = color;

      // Update previous pos
      prevMousePos.current = { ...mousePos.current };

      // Thread points physics
      points.current[0].x = mousePos.current.x;
      points.current[0].y = mousePos.current.y;

      const twangElapsed = time - twangStartTime.current;
      const isTwanging = twangElapsed < 500;
      const twangFactor = isTwanging ? Math.sin(twangElapsed * 0.05) * Math.exp(-twangElapsed * 0.01) * 15 : 0;

      for (let i = 1; i < points.current.length; i++) {
        const p = points.current[i];
        const prev = points.current[i - 1];
        
        p.x += (prev.x - p.x) * 0.15;
        p.y += (prev.y - p.y) * 0.15;

        if (isTwanging) {
          const lateralOffset = Math.sin(i * 0.5) * twangFactor;
          p.x += lateralOffset;
          p.y += lateralOffset;
        }
      }

      if (pathRef.current) {
        const d = `M ${points.current[0].x} ${points.current[0].y} ` + 
                  points.current.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
        pathRef.current.setAttribute("d", d);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <svg
        ref={dotRef}
        className="fixed pointer-events-none transition-[scale] duration-150 ease-out"
        width="12"
        height="18"
        viewBox="0 0 12 18"
        style={{
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          fill: "transparent",
          strokeWidth: "1.2px",
        }}
      >
        <path d="M6 0 L12 10 L6 18 L0 10 Z" />
      </svg>
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 99998 }}
      >
        <path
          ref={pathRef}
          fill="none"
          strokeWidth="1"
          strokeOpacity="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
