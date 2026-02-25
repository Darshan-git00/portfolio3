import { motion } from "framer-motion";

export default function LoadingSplash({ onComplete }: { onComplete: () => void }) {
  const letters = "DARSHAN".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => onComplete()}
      className="fixed inset-0 z-[10000] bg-background flex items-center justify-center overflow-hidden"
    >
      <div className="flex gap-2">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: [100, 0, -20, 0],
              opacity: [0, 1, 1, 1]
            }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1,
              ease: "easeOut"
            }}
            className="text-6xl md:text-8xl font-heading font-bold tracking-tighter"
          >
            {char}
          </motion.span>
        ))}
      </div>
      
      {/* Dynamic line reveal */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
        className="absolute bottom-1/2 translate-y-16 w-32 h-[2px] bg-foreground origin-center"
      />
      
      {/* Final reveal sequence */}
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ delay: 2.2, duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
        className="absolute inset-0 bg-foreground z-10"
      />
    </motion.div>
  );
}
