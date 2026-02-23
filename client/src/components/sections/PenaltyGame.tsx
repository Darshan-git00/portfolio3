import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";

const DIRECTIONS = ["left", "center", "right"] as const;
type Direction = typeof DIRECTIONS[number];

interface Score {
  player: number;
  gk: number;
}

export default function PenaltyGame({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState<Score>({ player: 0, gk: 0 });
  const [ballPos, setBallPos] = useState<Direction | null>(null);
  const [gkPos, setGkPos] = useState<Direction | null>(null);
  const [result, setResult] = useState<"goal" | "saved" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [kicks, setKicks] = useState(0);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function shoot(direction: Direction) {
    if (isAnimating) return;
    setIsAnimating(true);
    setResult(null);

    const gkGuess = DIRECTIONS[Math.floor(Math.random() * 3)];
    setBallPos(direction);
    setGkPos(gkGuess);

    setTimeout(() => {
      if (gkGuess === direction) {
        setResult("saved");
        setScore(s => ({ ...s, gk: s.gk + 1 }));
      } else {
        setResult("goal");
        setScore(s => ({ ...s, player: s.player + 1 }));
      }
      setKicks(k => k + 1);
      setIsAnimating(false);
    }, 800);
  }

  function reset() {
    setScore({ player: 0, gk: 0 });
    setBallPos(null);
    setGkPos(null);
    setResult(null);
    setKicks(0);
  }

  const ballX = ballPos === "left" ? "20%" : ballPos === "right" ? "80%" : "50%";
  const gkX = gkPos === "left" ? "25%" : gkPos === "right" ? "75%" : "50%";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg mx-4 bg-background border border-border rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Penalty Shootout</span>
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-foreground font-bold">{score.player}</span>
              <span className="text-muted-foreground">—</span>
              <span className="text-foreground font-bold">{score.gk}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground relative z-10">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pitch */}
        <div className="relative bg-green-900 h-64 overflow-hidden">
          {/* Grass stripes */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`absolute top-0 bottom-0 ${i % 2 === 0 ? "bg-green-900" : "bg-green-800"}`}
              style={{ left: `${i * 12.5}%`, width: "12.5%" }} />
          ))}

          {/* Goal post */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white rounded" />
            <div className="absolute top-0 left-0 w-[3px] h-full bg-white rounded" />
            <div className="absolute top-0 right-0 w-[3px] h-full bg-white rounded" />
            {/* Net lines */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l border-white/20"
                style={{ left: `${(i + 1) * 14.28}%` }} />
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-white/20"
                style={{ top: `${(i + 1) * 20}%` }} />
            ))}
          </div>

          {/* GK */}
          <motion.div
            animate={{ left: gkPos ? gkX : "50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-8 -translate-x-1/2 text-2xl"
            style={{ left: "50%" }}
          >
            🧤
          </motion.div>

          {/* Ball */}
          <motion.div
            animate={{
              left: ballPos ? ballX : "50%",
              top: ballPos ? "20%" : "75%",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -translate-x-1/2 text-xl"
            style={{ left: "50%", top: "75%" }}
          >
            ⚽
          </motion.div>

          {/* Penalty spot */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />

          {/* Result flash */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center text-4xl font-heading font-bold ${result === "goal" ? "text-green-400" : "text-red-400"}`}
              >
                {result === "goal" ? "GOAL! 🎉" : "SAVED! 🧤"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-center">
            Pick your direction
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(["left", "center", "right"] as Direction[]).map((dir) => (
              <button
                key={dir}
                onClick={() => shoot(dir)}
                disabled={isAnimating}
                className="py-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {dir === "left" ? "← Left" : dir === "right" ? "Right →" : "Center"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/50 font-mono text-center">
            Kicks: {kicks} · You {score.player} — GK {score.gk}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
