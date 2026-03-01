import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BirdIntro({ onComplete }: { onComplete: () => void }) {
  const [isDone, setIsDone] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsFlying(true);
    }, 1500);
    
    const t2 = setTimeout(() => {
      setIsDone(true);
      onComplete();
      document.body.style.cursor = "";
      document.dispatchEvent(new MouseEvent("mousemove", { 
        clientX: window.innerWidth / 2, 
        clientY: window.innerHeight / 2 
      }));
    }, 4000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.cursor = "";
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-background flex items-center justify-center overflow-hidden"
      style={{ pointerEvents: isDone ? "none" : "all" }}
      initial={{ opacity: 1 }}
      animate={isFlying ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative w-full h-full">
        <motion.div
          className="absolute bottom-12 left-12"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={isFlying ? {
            x: "100vw",
            y: "-100vh",
            transition: { 
              duration: 2.0,
              ease: "easeInOut"
            }
          } : {
            scale: [1, 1.03, 1],
            transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="80" height="48" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Body */}
            <ellipse cx="50" cy="38" rx="18" ry="11" />
            {/* Head */}
            <circle cx="72" cy="28" r="9" />
            {/* Beak */}
            <path d="M80 26 L92 24 L80 30" fill="var(--foreground)" />
            {/* Tail */}
            <path d="M32 38 Q18 30 12 42 Q20 36 32 44" />
            {/* Wing - animated flapping */}
            <motion.path
              d="M38 32 Q50 18 65 28"
              animate={isFlying ? {
                d: [
                  "M38 32 Q50 5 65 28", // Wings up
                  "M38 32 Q50 45 65 28"  // Wings down
                ]
              } : { d: "M38 32 Q50 18 65 28" }}
              transition={isFlying ? { duration: 0.2, repeat: Infinity, repeatType: "reverse" } : {}}
            />
            {/* Eye */}
            <circle cx="75" cy="27" r="1.5" fill="var(--foreground)" />
            {/* Legs */}
            <line x1="52" y1="49" x2="48" y2="58" />
            <line x1="48" y1="58" x2="44" y2="58" />
            <line x1="48" y1="58" x2="50" y2="62" />
            <line x1="60" y1="49" x2="56" y2="58" />
            <line x1="56" y1="58" x2="52" y2="58" />
            <line x1="56" y1="58" x2="58" y2="62" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
