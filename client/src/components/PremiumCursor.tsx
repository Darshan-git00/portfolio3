import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useSpring, useMotionValue, useVelocity, useTransform, AnimatePresence } from "framer-motion";

export default function PremiumCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Velocity tracking for stretching
  const velX = useVelocity(mouseX);
  const velY = useVelocity(mouseY);

  const springConfig = { damping: 30, stiffness: 250, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [cursorType, setCursorType] = useState<"default" | "hover" | "text">("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const idleTimer = useRef<NodeJS.Timeout>();

  // Magnetic and target state
  const [magneticTarget, setMagneticTarget] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Calculate stretch and rotation based on velocity
  const stretch = useTransform(
    [velX, velY],
    ([vX, vY]) => {
      const speed = Math.sqrt(vX ** 2 + vY ** 2);
      return 1 + Math.min(speed / 1500, 0.5);
    }
  );

  const angle = useTransform(
    [velX, velY],
    ([vX, vY]) => Math.atan2(vY, vX) * (180 / Math.PI)
  );

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Idle management
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 2500);

      // Magnetic check
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role='button']");
      
      if (clickable) {
        const rect = clickable.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
        
        if (dist < 100) { // Magnet pull radius
          setMagneticTarget({ x: centerX, y: centerY, w: rect.width, h: rect.height });
          setCursorType("hover");
        } else {
          setMagneticTarget(null);
          setCursorType("default");
        }
      } else if (target.closest("p, h1, h2, h3, h4, span, li")) {
        setCursorType("text");
        setMagneticTarget(null);
      } else {
        setCursorType("default");
        setMagneticTarget(null);
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
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [mouseX, mouseY]);

  const targetX = magneticTarget ? magneticTarget.x : cursorX;
  const targetY = magneticTarget ? magneticTarget.y : cursorY;

  return (
    <div className="premium-cursor-container fixed inset-0 pointer-events-none z-[9999]">
      {/* Ripples */}
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

      {/* Trail Particles */}
      {[...Array(5)].map((_, i) => (
        <TrailingDot 
          key={i} 
          index={i} 
          mouseX={mouseX} 
          mouseY={mouseY} 
          cursorType={cursorType}
        />
      ))}

      {/* Main Cursor */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          left: targetX,
          top: targetY,
          x: "-50%",
          y: "-50%",
          rotate: angle,
        }}
      >
        <motion.div
          className="bg-foreground rounded-full"
          animate={{
            width: cursorType === "text" ? 2 : cursorType === "hover" ? 0 : 8,
            height: cursorType === "text" ? 24 : cursorType === "hover" ? 0 : 8,
            scale: isIdle ? [1, 1.2, 1] : isClicking ? 0.8 : 1,
            opacity: cursorType === "hover" ? 0 : 1
          }}
          style={{
            scaleX: cursorType === "default" ? stretch : 1,
          }}
          transition={isIdle ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 20 }}
        />
        
        {/* Magnetic Ring */}
        <motion.div
          className="absolute border border-foreground/40 rounded-full"
          animate={{
            width: cursorType === "hover" ? magneticTarget ? magneticTarget.w + 20 : 60 : 40,
            height: cursorType === "hover" ? magneticTarget ? magneticTarget.h + 10 : 60 : 40,
            opacity: cursorType === "hover" ? 1 : 0,
            borderRadius: cursorType === "hover" && magneticTarget ? "12px" : "999px"
          }}
        />
      </motion.div>
    </div>
  );
}

function TrailingDot({ index, mouseX, mouseY, cursorType }: any) {
  const springX = useSpring(mouseX, { stiffness: 150 - index * 20, damping: 25 + index * 2 });
  const springY = useSpring(mouseY, { stiffness: 150 - index * 20, damping: 25 + index * 2 });

  return (
    <motion.div
      className="absolute w-1 h-1 bg-foreground/20 rounded-full"
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        opacity: (1 - index * 0.2) * (cursorType === "default" ? 1 : 0),
        scale: 1 - index * 0.15
      }}
    />
  );
}
