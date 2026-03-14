import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

interface BirdConfig {
  width: number;
  height: number;
  top: string;
  initialX: number;
  flyDuration: number;
  flyDelay: number;
  enterDelay: number;
  type: "sit" | "fly";
}

// Pixel dissolve grid — left to right
function PixelGrid({ dissolving }: { dissolving: boolean }) {
  const blockSize = 24;
  const cols = Math.ceil(window.innerWidth / blockSize);
  const rows = Math.ceil(window.innerHeight / blockSize);
  const delays = useRef<number[]>([]);

  if (delays.current.length === 0) {
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        delays.current.push((c / cols) * 6000 + Math.random() * 400);
      }
    }
  }

  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "100%",
      display: "flex", flexWrap: "wrap",
      overflow: "hidden",
    }}>
      {delays.current.map((delay, i) => (
        <div
          key={i}
          style={{
            width: blockSize,
            height: blockSize,
            flexShrink: 0,
            backgroundColor: "var(--background)",
            opacity: dissolving ? 0 : 1,
            transition: dissolving ? `opacity 500ms ease ${delay}ms` : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function BirdIntro() {
  const [phase, setPhase] = useState<"loading" | "sitting" | "flying" | "done">("loading");
  const [birdSit, setBirdSit] = useState<any>(null);
  const [birdFly, setBirdFly] = useState<any>(null);
  const [loadingAnim, setLoadingAnim] = useState<any>(null);
  const loadStartTime = useRef<number>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const birds: BirdConfig[] = [
    { width: 180, height: 180, top: "35%", initialX: -200, flyDuration: 8.0, flyDelay: 0, enterDelay: 0, type: "sit" },
    { width: 120, height: 120, top: "28%", initialX: -220, flyDuration: 8.8, flyDelay: 0.3, enterDelay: 0.15, type: "sit" },
    { width: 360, height: 360, top: "15%", initialX: -150, flyDuration: 8.5, flyDelay: 0.2, enterDelay: 0.1, type: "fly" },
    { width: 360, height: 360, top: "25%", initialX: -100, flyDuration: 9.0, flyDelay: 0.4, enterDelay: 0.2, type: "fly" },
    { width: 360, height: 360, top: "45%", initialX: -80, flyDuration: 9.5, flyDelay: 0.6, enterDelay: 0.3, type: "fly" },
    { width: 360, height: 360, top: "8%", initialX: -60, flyDuration: 10.0, flyDelay: 0.8, enterDelay: 0.4, type: "fly" },
  ];

  useEffect(() => {
    loadStartTime.current = Date.now();

    const loadAll = async () => {
      try {
        const [loadRes, sitRes, flyRes] = await Promise.all([
          fetch("/Loading.json"),
          fetch("/bird-sit.json"),
          fetch("/bird-fly.json"),
        ]);

        const [loadData, sitData, flyData] = await Promise.all([
          loadRes.ok ? loadRes.json() : null,
          sitRes.ok ? sitRes.json() : null,
          flyRes.ok ? flyRes.json() : null,
        ]);

        setLoadingAnim(loadData);
        setBirdSit(sitData);
        setBirdFly(flyData);

        const elapsed = Date.now() - loadStartTime.current;
        const remaining = Math.max(0, 4000 - elapsed);

        const t1 = setTimeout(() => {
          setPhase("sitting");

          const t2 = setTimeout(() => {
            setPhase("flying");

            const t3 = setTimeout(() => {
              setPhase("done");
              document.dispatchEvent(
                new MouseEvent("mousemove", {
                  clientX: window.innerWidth / 2,
                  clientY: window.innerHeight / 2,
                })
              );
            }, 10500);

            timers.current.push(t3);
          }, 1000);

          timers.current.push(t2);
        }, remaining);

        timers.current.push(t1);
      } catch (err) {
        console.error("Failed to load animations:", err);
        setPhase("done");
      }
    };

    loadAll();

    const safety = setTimeout(() => setPhase("done"), 30000);
    timers.current.push(safety);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const isFlying = phase === "flying";
  const showBirds = phase === "sitting" || phase === "flying";
  const showLoading = phase === "loading";

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 99999 }}
    >
      {/* PIXEL DISSOLVE: left to right as birds fly */}
      <PixelGrid dissolving={isFlying} />

      {/* BIRDS: Above pixel grid */}
      <AnimatePresence>
        {showBirds && (
          <motion.div
            className="absolute inset-0"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {birds.map((bird, index) => {
              const animData = bird.type === "sit" ? birdSit : birdFly;
              if (!animData) return null;

              return (
                <motion.div
                  key={index}
                  className="absolute left-0"
                  style={{ top: bird.top }}
                  initial={{ x: bird.initialX, opacity: 0 }}
                  animate={{
                    x: isFlying ? "130vw" : 0,
                    opacity: 1,
                  }}
                  transition={{
                    x: isFlying
                      ? { duration: bird.flyDuration, delay: bird.flyDelay, ease: [0.25, 0.1, 0.2, 1] }
                      : { duration: 0.8, delay: bird.enterDelay, ease: "easeOut" },
                    opacity: { duration: 0.5, delay: bird.enterDelay },
                  }}
                >
                  <Lottie
                    animationData={animData}
                    loop={true}
                    style={{ width: bird.width, height: bird.height }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING: Highest layer */}
      <AnimatePresence>
        {showLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "var(--background)", zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loadingAnim ? (
              <Lottie animationData={loadingAnim} loop={true} style={{ width: 220, height: 220 }} />
            ) : (
              <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}