import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ArrowUpRight, FileText, MapPin } from "lucide-react";
import LiveClock from "@/components/LiveClock";
import { useState } from "react";

const subtitle =
  "Started with Java, wandered into React, ended up enjoying both. I build things end-to-end and learn something new every sprint.";

function WordReveal() {
  const words = subtitle.split(" ");
  return (
    <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.12,
            delay: 0.12 + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function InteractiveName({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          whileHover={{
            y: -10,
            rotate: Math.random() * 20 - 10,
            transition: { duration: 0.2 },
          }}
          className="inline-block cursor-none"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [particlesOn,     setParticlesOn]     = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [0, 300], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 240], [-12, 12]), { stiffness: 300, damping: 30 });
  const shadowX = useTransform(x, [0, 240], [15, -15]);
  const shadowY = useTransform(y, [0, 300], [15, -15]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    setIsHoveringPhoto(false);
    x.set(120);
    y.set(150);
  }

  function handlePhotoClick() {
    setParticlesOn(v => !v);
    window.dispatchEvent(new Event("particle-field-toggle"));
  }

  return (
    <section id="hero" className="relative">
      <div className="flex items-start justify-between gap-0">

        {/* ── Left: text ── */}
        <div className="space-y-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-Poppins text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Hello! I'm
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-[2px] h-4 bg-foreground/50"
              />
              <div className="flex items-center gap-2 ml-4">
                <MapPin className="h-3 w-3 text-[#fbbf24]" />
                <span className="text-[10px] tracking-[0.1em] text-[#fbbf24]/80" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  BENGALURU, INDIA
                </span>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1 text-[#fbbf24]/80" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  <LiveClock />
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"
                  />
                </div>
              </div>
            </div>

            <h1
              className="text-4xl md:text-7xl font-medium tracking-tight leading-[0.9] font-heading shimmer-text"
              data-testid="text-hero-title"
            >
              <div style={{ fontFamily: "'Poppins', syne" }}>
                <InteractiveName text="Darshan" />
              </div>
              <div className="text-muted-foreground italic mt-2" style={{ fontFamily: "'Poppins', syne" }}>
                <InteractiveName text="Prabhakar." />
              </div>
            </h1>
          </motion.div>

          <WordReveal />

          <motion.div
            className="flex flex-wrap gap-6 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#projects"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
              data-testid="link-view-projects"
            >
              Explore work
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
            <motion.a
              href="DarshanResume1P.pdf"
              target="_blank"
              rel="noopener noreferrer"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1.5 }}
              className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
              data-testid="link-view-resume"
            >
              resume
              <FileText className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* ── Right: photo ── */}
        <div
          className="relative group cursor-none"
          onMouseMove={handleMouse}
          onMouseEnter={() => setIsHoveringPhoto(true)}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "800px" }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 pointer-events-none z-[-1]"
              style={{
                boxShadow: useTransform(
                  [shadowX, shadowY],
                  ([sx, sy]) => `${sx}px ${sy}px 30px rgba(0,0,0,0.5)`
                ),
              }}
            />

            {/* Clickable hint ring — appears on hover, orange when active */}
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-none z-10"
              animate={{
                opacity:     isHoveringPhoto ? 1 : 0,
                boxShadow:   particlesOn
                  ? "inset 0 0 0 2px rgba(249,115,22,0.7), 0 0 20px rgba(249,115,22,0.25)"
                  : "inset 0 0 0 1.5px rgba(255,255,255,0.18)",
              }}
              transition={{ duration: 0.25 }}
            />

            {/* Small label hint at bottom of image */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              animate={{ opacity: isHoveringPhoto ? 1 : 0, y: isHoveringPhoto ? 0 : 4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[9px] font-mono tracking-[0.14em] uppercase px-2 py-1 rounded-full"
                style={{
                  background:  particlesOn ? "rgba(249,115,22,0.85)" : "rgba(0,0,0,0.45)",
                  color:       "#fff",
                  backdropFilter: "blur(4px)",
                }}
              >
                {particlesOn ? "smash again " : "smash "}
              </span>
            </motion.div>

            <motion.img
              src="/images/darshan.png"
              alt="Darshan Prabhakar"
              onClick={handlePhotoClick}
              animate={{ filter: isHoveringPhoto ? "grayscale(0%)" : "grayscale(100%)" }}
              transition={{ duration: 0.3 }}
              className="w-60 h-75 object-cover object-top cursor-pointer select-none"
              style={{
                maskImage:           "linear-gradient(to top, transparent 0%, black 25%, black 75%, black 100%), radial-gradient(ellipse at center, black 40%, transparent 85%)",
                WebkitMaskImage:     "linear-gradient(to top, transparent 0%, black 25%, black 75%, black 100%), radial-gradient(ellipse at center, black 40%, transparent 85%)",
                maskComposite:       "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}