import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="experience" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-baseline justify-between mb-12 border-b border-border pb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Experience
          </h2>
          <span className="text-xs font-mono text-muted-foreground/50">
            {resumeData.experience.length} roles
          </span>
        </div>

        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => {
            const isOpen = expanded === index;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/20"
                data-testid={`card-experience-${index}`}
              >
                {/* Dot pattern bg */}
                <div
                  className="absolute inset-0 opacity-[0.025] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, var(--foreground) 3px, transparent 3px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Left accent bar */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />

                {/* Bottom wipe line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent transition-all duration-700 ease-out rounded-full" />

                {/* Header row — always visible, clickable */}
                <button
                  className="w-full text-left px-8 py-6 relative"
                  onClick={() => setExpanded(isOpen ? null : index)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold tracking-tight font-sans leading-tight group-hover:translate-x-1 transition-transform duration-300">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-foreground/20">·</span>
                        <span className="italic">{exp.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">
                        {exp.date}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-muted-foreground/50 text-xs"
                      >
                        ↓
                      </motion.span>
                    </div>
                  </div>
                </button>

                {/* Expandable bullets */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 relative">
                        <div className="h-[1px] bg-gradient-to-r from-border via-border/50 to-transparent mb-5" />
                        <ul className="space-y-3">
                          {exp.bullets.map((bullet, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                              data-testid={`text-experience-${index}-bullet-${i}`}
                            >
                              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-foreground/30" />
                              <span>{bullet}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}