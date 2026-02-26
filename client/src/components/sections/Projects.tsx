import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ExternalLink, Github } from "lucide-react";
import { useRef, useState } from "react";

function TickerDate({ date }: { date: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = date.split("");

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex gap-[1px]"
    >
      {characters.map((char, i) => (
        <div key={i} className="relative h-5 w-3 overflow-hidden bg-muted/50 rounded-sm">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={isHovered ? "hovered" : "normal"}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: i * 0.05,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-muted-foreground uppercase"
              style={{ backfaceVisibility: "hidden" }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative"
      data-testid={`card-project-${index}`}
    >
      <div className="absolute -top-12 -left-8 text-[8rem] font-heading font-bold opacity-[0.03] select-none pointer-events-none">
        0{index + 1}
      </div>

      <div className="md:col-span-12 space-y-6 relative z-10">
        <motion.div style={{ y: y1 }} className="space-y-4">
          <TickerDate date={project.date} />
          <h3 className="text-3xl font-medium tracking-tight font-sans">
            {project.title}
          </h3>
        </motion.div>

        <motion.p
          style={{ y: y2 }}
          className="text-muted-foreground leading-relaxed text-justify text-sm"
          data-testid={`text-project-desc-${index}`}
        >
          {project.description}
        </motion.p>

        <motion.div style={{ y: y3 }} className="flex flex-wrap gap-2 pt-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono uppercase tracking-wider border border-white/10 px-2 py-1 rounded-full text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        <div className="flex gap-6 pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
            data-testid={`link-project-github-${index}`}
          >
            <Github className="h-5 w-5" /> Source
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-baseline justify-between mb-12 border-b border-white/10 pb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Projects
          </h2>
        </div>

        <div className="space-y-32">
          {resumeData.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
