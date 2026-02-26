import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function PremiumCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [cursorType, setCursorType] = useState<"default" | "hover" | "text">("default");
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button']")) {
        setCursorType("hover");
      } else if (target.closest("p, h1, h2, h3, h4, span, li")) {
        setCursorType("text");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      setRipples(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.slice(1)), 1000);
    };
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; } @media (max-width: 768px) { * { cursor: auto !important; } .premium-cursor-container { display: none; } }`;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.head.removeChild(style);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="premium-cursor-container fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute w-10 h-10 border border-foreground/30 rounded-full"
            style={{ left: ripple.x, top: ripple.y, x: "-50%", y: "-50%" }}
          />
        ))}
      </AnimatePresence>

      {/* Split Cursor Design */}
      <motion.div
        className="absolute"
        style={{ left: cursorX, top: cursorY, x: "-50%", y: "-50%" }}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Left Bracket */}
          <motion.div
            animate={{ 
              x: cursorType === "hover" ? -20 : -6,
              scale: isClicking ? 0.7 : 1,
              opacity: cursorType === "text" ? 0.2 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-1/2 w-[2px] h-3 bg-foreground"
            style={{ x: "-100%" }}
          />
          {/* Right Bracket */}
          <motion.div
            animate={{ 
              x: cursorType === "hover" ? 20 : 6,
              scale: isClicking ? 0.7 : 1,
              opacity: cursorType === "text" ? 0.2 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-1/2 w-[2px] h-3 bg-foreground"
            style={{ x: "0%" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
