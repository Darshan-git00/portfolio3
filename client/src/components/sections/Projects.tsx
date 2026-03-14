"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";
import resumeData from "@/data/resume.json";

interface Project {
  id: string | number;
  title: string;
  description: string;
  technologies: string[];
  date: string;
  github: string;
}

// ─── Slot per layer ───────────────────────────────────────────────────────────
function getSlot(layer: number) {
  const slots = [
    { y: 0,  rotate:  0,    scale: 1,    zIndex: 30 },
    { y: 20, rotate:  4.5,  scale: 0.97, zIndex: 20 },
    { y: 38, rotate: -4,    scale: 0.94, zIndex: 10 },
    { y: 54, rotate:  3,    scale: 0.91, zIndex: 5  },
  ] as const;
  return slots[Math.min(layer, slots.length - 1)];
}

export default function Projects() {
  const projects: Project[] = resumeData.projects;
  const total = projects.length;

  const [order, setOrder]       = useState<number[]>(() => projects.map((_, i) => i));
  const [pulledBack, setPulledBack] = useState<number | null>(null);
  const busy   = useRef(false);
  const touchX = useRef(0);

  const bringToFront = useCallback((projectIdx: number) => {
    if (busy.current || order.indexOf(projectIdx) === 0) return;
    busy.current = true;
    setPulledBack(projectIdx);
    setTimeout(() => {
      setPulledBack(null);
      setOrder(prev => [projectIdx, ...prev.filter(i => i !== projectIdx)]);
      setTimeout(() => { busy.current = false; }, 750);
    }, 160);
  }, [order]);

  const next = useCallback(() => { if (order.length > 1) bringToFront(order[1]); }, [order, bringToFront]);
  const prev = useCallback(() => { if (order.length > 1) bringToFront(order[order.length - 1]); }, [order, bringToFront]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const frontIdx = order[0];

  // Card dimensions — wider + taller
  const CARD_W  = 600; // px, used as maxWidth
  const CARD_H  = 300; // px
  const STUB_H  = 72;  // height of the bottom stub (tear line + tags)
  const NOTCH_R = 9;   // notch radius (half of width/height)

  // Container needs room for front card + peeking backs
  const peekTotal = Math.min(total - 1, 3) * 20;
  const containerH = CARD_H + peekTotal + 16;

  return (
    <section id="projects" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <div className="flex items-baseline justify-between mb-12 border-b border-border pb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Selected Projects
          </h2>
          <span className="text-xs font-mono text-muted-foreground/50">{total} builds</span>
        </div>

        {/* Stack */}
        <div
          className="relative w-full"
          style={{ height: containerH }}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -40) next();
            if (dx >  40) prev();
          }}
        >
          {/* Render back-to-front so front card paints on top */}
          {[...order].reverse().map((projectIdx) => {
            const layer    = order.indexOf(projectIdx);
            const project  = projects[projectIdx];
            const slot     = getSlot(layer);
            const isFront  = layer === 0;
            const isPulled = pulledBack === projectIdx;

            // Pull-back: kick slightly down + more tilt before flying front
            const animY      = isPulled ? slot.y + 10        : slot.y;
            const animRotate = isPulled ? slot.rotate * 1.6   : slot.rotate;
            const animScale  = isPulled ? slot.scale - 0.02   : slot.scale;

            return (
              <motion.div
                key={projectIdx}
                animate={{ y: animY, rotate: animRotate, scale: animScale }}
                transition={
                  isPulled
                    ? { duration: 0.16, ease: [0.4, 0, 1, 1] }
                    : {
                        type:      "spring",
                        stiffness: isFront ? 240 : 220,
                        damping:   isFront ? 28  : 26,
                        mass:      1.1,
                        delay:     isFront ? 0.05 : 0,
                      }
                }
                style={{
                  position:        "absolute",
                  top:             0,
                  left:            "50%",
                  translateX:      "-50%",
                  width:           "100%",
                  maxWidth:        CARD_W,
                  height:          CARD_H,
                  zIndex:          slot.zIndex,
                  cursor:          isFront ? "default" : "pointer",
                  transformOrigin: "center bottom",
                }}
                className={!isFront ? "group" : ""}
                onClick={!isFront ? () => bringToFront(projectIdx) : undefined}
              >
                {/* ── Ticket shell ── */}
                <div
                  className="relative w-full h-full flex flex-col rounded-[18px] border border-border bg-card overflow-visible transition-[border-color,box-shadow] duration-300"
                  style={{
                    boxShadow: isFront
                      ? "0 8px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* ── Notch left — sits exactly on the tear line ── */}
                  <div
                    className="absolute bg-background border border-border rounded-full z-20 pointer-events-none"
                    style={{
                      width:  NOTCH_R * 2,
                      height: NOTCH_R * 2,
                      left:   -(NOTCH_R),
                      // position from bottom: stub height, centred on the dashed line
                      bottom: STUB_H - NOTCH_R,
                    }}
                  />
                  {/* ── Notch right ── */}
                  <div
                    className="absolute bg-background border border-border rounded-full z-20 pointer-events-none"
                    style={{
                      width:  NOTCH_R * 2,
                      height: NOTCH_R * 2,
                      right:  -(NOTCH_R),
                      bottom: STUB_H - NOTCH_R,
                    }}
                  />

                  {/* ── Top body: number + title + description ── */}
                  <div
                    className="flex-1 px-7 pt-6 pb-4 overflow-hidden flex flex-col gap-2"
                    style={{ minHeight: 0 }}
                  >
                    {/* Row: index + github */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-[0.16em] text-muted-foreground/50 uppercase">
                        {String(projectIdx + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}&nbsp;·&nbsp;{project.date}
                      </span>
                      {isFront && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-150"
                        >
                          <Github className="w-[12px] h-[12px]" />
                        </a>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="font-semibold text-foreground leading-snug tracking-[-0.02em]"
                      style={{ fontSize: isFront ? 18 : 16 }}
                    >
                      {project.title}
                    </h3>

                    {/* Description — only on front card */}
                    {isFront && (
                      <p
                        className="text-[13px] text-muted-foreground leading-[1.65] overflow-hidden"
                        style={{
                          display:           "-webkit-box",
                          WebkitLineClamp:   3,
                          WebkitBoxOrient:   "vertical",
                        } as React.CSSProperties}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* ── Tear line ── */}
                  <div
                    className="absolute left-5 right-5 border-t border-dashed border-border/70 pointer-events-none"
                    style={{ bottom: STUB_H }}
                  />

                  {/* ── Stub: tags ── */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-7 flex flex-wrap items-center gap-[6px] rounded-b-[18px]"
                    style={{ height: STUB_H, paddingTop: 16, paddingBottom: 16 }}
                  >
                    {project.technologies.slice(0, isFront ? 5 : 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-[9px] py-[4px] rounded-[4px] bg-muted text-muted-foreground border border-border/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-5">
          {/* Dots */}
          <div className="flex gap-[7px] items-center">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => bringToFront(i)}
                aria-label={`Go to project ${i + 1}`}
                style={{ padding: 0, border: "none", background: "none", cursor: "pointer" }}
                className={`h-[4px] rounded-full transition-all duration-300 ${
                  i === frontIdx
                    ? "w-5 bg-foreground/70"
                    : "w-[4px] bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Meta row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={frontIdx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-4 flex items-center justify-between gap-4"
          >
            <span className="text-[10px] font-mono text-muted-foreground/35 shrink-0">
              {String(frontIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="text-[13px] font-medium text-muted-foreground/55 truncate text-center flex-1">
              {projects[frontIdx].title}
            </span>
            <a
              href={projects[frontIdx].github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors flex items-center gap-1 shrink-0"
            >
              <Github className="w-3 h-3" />
              github
            </a>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}