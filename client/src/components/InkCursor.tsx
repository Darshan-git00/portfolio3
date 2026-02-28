import { useEffect, useRef } from "react";

export default function InkCursor() {
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const createSplatter = (x: number, y: number, isBurst = false, burstOffset = { x: 0, y: 0 }) => {
      const splatter = document.createElement("div");
      
      // Calculate velocity for size
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let size: number;
      if (isBurst) {
        size = 10 + Math.random() * 12;
      } else {
        if (distance < 5) size = 4 + Math.random() * 2;
        else if (distance < 15) size = 8 + Math.random() * 6;
        else size = 16 + Math.random() * 8;
      }

      // Detect dark mode
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "hsl(0, 0%, 85%)" : "hsl(0, 0%, 15%)";
      
      // Random irregular shape
      const r1 = 50 + Math.random() * 20;
      const r2 = 30 + Math.random() * 20;
      const r3 = 60 + Math.random() * 20;
      const r4 = 20 + Math.random() * 20;
      const r5 = 40 + Math.random() * 20;
      const r6 = 50 + Math.random() * 20;
      const borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${40}% ${70}%`;

      splatter.style.position = "fixed";
      splatter.style.left = `${x + (isBurst ? burstOffset.x : 0)}px`;
      splatter.style.top = `${y + (isBurst ? burstOffset.y : 0)}px`;
      splatter.style.width = `${size}px`;
      splatter.style.height = `${size}px`;
      splatter.style.backgroundColor = color;
      splatter.style.borderRadius = borderRadius;
      splatter.style.pointerEvents = "none";
      splatter.style.zIndex = "9999";
      splatter.style.transform = "translate(-50%, -50%)";
      splatter.style.opacity = "1";
      splatter.style.transition = `opacity ${isBurst ? "600ms" : "800ms"} ease-out`;

      document.body.appendChild(splatter);

      // Trigger fade
      requestAnimationFrame(() => {
        splatter.style.opacity = "0";
      });

      const cleanup = () => {
        if (splatter.parentNode) {
          document.body.removeChild(splatter);
        }
      };

      splatter.addEventListener("transitionend", cleanup, { once: true });
      // Fallback cleanup
      setTimeout(cleanup, isBurst ? 700 : 900);
    };

    const handleMouseMove = (e: MouseEvent) => {
      createSplatter(e.clientX, e.clientY);
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const burstCount = 10 + Math.floor(Math.random() * 5);
      for (let i = 0; i < burstCount; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        createSplatter(e.clientX, e.clientY, true, { x: offsetX, y: offsetY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null;
}
