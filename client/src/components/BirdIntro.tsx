import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

export default function BirdIntro({ onComplete }: { onComplete: () => void }) {
  const [isDone, setIsDone] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [birdSit, setBirdSit] = useState<any>(null);
  const [birdFly, setBirdFly] = useState<any>(null);

  useEffect(() => {
    // Attempt to load Lottie JSONs from public folder
    const loadAnimations = async () => {
      try {
        const [sitRes, flyRes] = await Promise.all([
          fetch("/bird-sit.json"),
          fetch("/bird-fly.json")
        ]);
        
        if (sitRes.ok) setBirdSit(await sitRes.json());
        if (flyRes.ok) setBirdFly(await flyRes.json());
      } catch (err) {
        console.error("Lottie load error:", err);
      }
    };
    
    loadAnimations();

    const t1 = setTimeout(() => setIsFlying(true), 3000);
    const t2 = setTimeout(() => {
      setIsDone(true);
      onComplete();
      document.dispatchEvent(new MouseEvent("mousemove", { 
        clientX: window.innerWidth / 2, 
        clientY: window.innerHeight / 2 
      }));
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      animate={isFlying ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
      style={{ pointerEvents: isFlying ? "none" : "all" }}
    >
      <div className="relative w-full h-full">
        <motion.div
          className="absolute bottom-16 left-16"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={isFlying ? {
            x: "110vw",
            y: "-110vh",
            scale: 0.3,
          } : {
            scale: 1
          }}
          transition={{ 
            duration: 3.5, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          {birdSit || birdFly ? (
            <Lottie
              animationData={isFlying ? (birdFly || birdSit) : birdSit}
              loop={true}
              style={{ width: 180, height: 180 }}
            />
          ) : (
            <div className="w-[180px] h-[180px] flex items-center justify-center">
               <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
