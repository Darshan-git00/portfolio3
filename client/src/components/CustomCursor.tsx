import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add global style to hide system cursor
    const style = document.createElement("style");
    style.innerHTML = `
      * { cursor: none !important; }
      @media (max-width: 768px) {
        * { cursor: auto !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.head.removeChild(style);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Glow */}
      <motion.div
        className="absolute w-12 h-12 border border-foreground/20 rounded-full"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.05)" : "transparent",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
      
      {/* Main Dot */}
      <motion.div
        className="absolute w-2 h-2 bg-foreground rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
      />

      {/* Trailing Dot for Hover State */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-foreground rounded-full"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 0.5 : 0,
        }}
      />
    </div>
  );
}
