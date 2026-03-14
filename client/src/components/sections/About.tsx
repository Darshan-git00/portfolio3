import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import resumeData from "@/data/resume.json";

const skillCategories = [
  {
    label: "Frontend",
    skills: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "Shadcn UI", slug: "shadcnui" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Spring Boot", slug: "springboot" },
      { name: "Spring MVC", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
      { name: "Hibernate", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-plain.svg" },
      { name: "REST APIs", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    ],
  },
  {
    label: "Database",
    skills: [
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    ],
  },
  {
    label: "Infra & Tools",
    skills: [
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Postman", slug: "postman" },
    ],
  },
];

const allSkills = skillCategories.flatMap(c => c.skills);
const reelSkills = [...allSkills, ...allSkills, ...allSkills];

// ─── Reel icon — bigger container, name always visible below ─────────────────
function ReelIcon({ skill }: { skill: any }) {
  const src = skill.icon ?? `https://cdn.simpleicons.org/${skill.slug}`;

  return (
    <div className="flex flex-col items-center gap-[10px] group cursor-default select-none">
      {/* Icon box — increased from w-12/h-12 to w-16/h-16, icon from w-6/h-6 to w-9/h-9 */}
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl border border-border bg-background/60 backdrop-blur-sm group-hover:border-foreground/40 group-hover:bg-muted/40 transition-all duration-300">
        <img
          src={src}
          alt={skill.name}
          className="w-9 h-9 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      {/* Name always shown, not just on hover — subtle but readable */}
      <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-200 whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );
}

// ─── Grid icon (View All panel) ───────────────────────────────────────────────
function GridIcon({ skill }: { skill: any }) {
  const src = skill.icon ?? `https://cdn.simpleicons.org/${(skill as any).slug}`;

  return (
    <div className="group flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-border hover:bg-muted/20 transition-all duration-200">
      <div className="w-5 h-5 shrink-0">
        <img
          src={src}
          alt={skill.name}
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        {skill.name}
      </span>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function About() {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="about" className="scroll-m-24 space-y-24" ref={containerRef}>

      {/* ── Bio ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-8 relative"
      >
        <div>
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4 mb-8 inline-block">
            Profile
          </h2>
        </div>
        <div className="relative pl-8">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-0 top-0 w-[1px] h-full bg-foreground/20"
          />
          <div
            className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl"
            data-testid="text-about-summary"
          >
            <p className=" text-justify">
              {resumeData.personal.summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Skills ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Technologies
        </h2>

        {/* ── Infinite reel ── */}
        <div className="w-full overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/*
            Pause on hover — group class on wrapper, animation-play-state via CSS var trick.
            Slightly slower (30s) to let the bigger icons breathe.
          */}
          <div className="group/reel">
            <motion.div
              className="flex gap-10 w-max py-6 px-4"
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              // Pause on hover via framer whileHover won't work on the reel itself,
              // so we use a transition that keeps running — users can interact per icon.
            >
              {reelSkills.map((skill, i) => (
                <ReelIcon key={i} skill={skill} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── View All button ── */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border px-4 py-2 rounded-full hover:border-foreground/50"
        >
          {open ? "Hide" : "View All Skills"}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ↓
          </motion.span>
        </button>

        {/* ── Expanded categorised grid ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.2, 1] }}
              className="w-full overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-border">
                {skillCategories.map((cat) => (
                  <div key={cat.label} className="space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border pb-2">
                      {cat.label}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {cat.skills.map((skill, i) => (
                        <GridIcon key={i} skill={skill} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </section>
  );
}