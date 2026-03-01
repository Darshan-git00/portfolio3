import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BirdIntro({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFlying(true), 1500);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2400);
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-background pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={isFlying ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.1 }}
    >
      {/* Turbulence filter for the ripple reveal */}
      <svg className="absolute inset-0 w-full h-full opacity-0 pointer-events-none">
        <filter id="ripple">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={isFlying ? 0 : 80} />
        </filter>
      </svg>

      <div className="relative w-full h-full" style={{ filter: isFlying ? "url(#ripple)" : "none" }}>
        <motion.div
          className="absolute bottom-12 left-12 w-[70px] h-[70px]"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={isFlying ? {
            x: "100vw",
            y: "-100vh",
            transition: { 
              x: { duration: 0.9, ease: [0.45, 0, 0.55, 1] },
              y: { duration: 0.9, ease: [0.12, 0, 0.39, 0] }
            }
          } : {
            scale: [1, 1.03, 1],
            transition: { duration: 1, repeat: Infinity }
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-foreground" strokeWidth="1.2">
            {/* Round body */}
            <circle cx="50" cy="50" r="20" />
            {/* Beak */}
            <path d="M30 50 L20 48 L30 46" />
            {/* Tail */}
            <path d="M70 50 L85 45 L85 55 Z" />
            {/* Wings - animated flapping */}
            <motion.path
              animate={isFlying ? {
                d: [
                  "M50 35 L30 20 L50 35", // Wings up
                  "M50 35 L30 50 L50 35"  // Wings down
                ]
              } : { d: "M50 35 L30 25 L50 35" }}
              transition={isFlying ? { duration: 0.15, repeat: Infinity, repeatType: "reverse" } : {}}
            />
            {/* Legs */}
            <path d="M45 70 L45 80" />
            <path d="M55 70 L55 80" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
