import { useEffect, useRef } from "react";

export default function ThreadCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const points = useRef<{ x: number; y: number }[]>(Array.from({ length: 20 }, () => ({ x: 0, y: 0 })));
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const twangStartTime = useRef<number>(0);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      const target = e.target as HTMLElement;
      const isHoverable = target.closest("a, button, [role='button']");
      if (dotRef.current) {
        dotRef.current.style.width = isHoverable ? "11px" : "7px";
        dotRef.current.style.height = isHoverable ? "11px" : "7px";
      }
    };

    const handleMouseDown = () => {
      twangStartTime.current = performance.now();
    };

    const animate = (time: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 10%)";
      
      if (dotRef.current) dotRef.current.style.backgroundColor = color;
      if (pathRef.current) pathRef.current.style.stroke = color;

      // First point follows cursor
      points.current[0].x = mousePos.current.x;
      points.current[0].y = mousePos.current.y;

      // Twang effect
      const twangElapsed = time - twangStartTime.current;
      const isTwanging = twangElapsed < 500;
      const twangFactor = isTwanging ? Math.sin(twangElapsed * 0.05) * Math.exp(-twangElapsed * 0.01) * 15 : 0;

      for (let i = 1; i < points.current.length; i++) {
        const p = points.current[i];
        const prev = points.current[i - 1];
        
        // Follow with delay
        p.x += (prev.x - p.x) * 0.15;
        p.y += (prev.y - p.y) * 0.15;

        // Apply lateral twang
        if (isTwanging) {
          const lateralOffset = Math.sin(i * 0.5) * twangFactor;
          p.x += lateralOffset;
          p.y += lateralOffset;
        }
      }

      // Update path
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
      <div
        ref={dotRef}
        className="fixed pointer-events-none rounded-full transition-[width,height] duration-150 ease-out"
        style={{
          width: "7px",
          height: "7px",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
        }}
      />
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
