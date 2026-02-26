import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import resumeData from "@/data/resume.json";

const skills = [
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "SQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  { name: "Spring Boot", slug: "springboot" },
  {
    name: "Spring MVC",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Hibernate",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-plain.svg",
  },
  {
    name: "REST APIs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  {
    name: "React.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
];

export default function About() {
  const containerRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="about" className="scroll-m-24 space-y-24" ref={containerRef}>
      {/* Bio Section */}
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
            className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2x"
            data-testid="text-about-summary"
          >
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-foreground text-justify">
              {resumeData.personal.summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Technologies
        </h2>

        <div className="relative flex flex-wrap justify-center gap-6 max-w-[600px] mx-auto p-8 bg-muted/5 rounded-3xl border border-border/50">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              className="relative"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative z-10 w-16 h-16 flex flex-col items-center justify-center gap-2 group cursor-none"
              >
                <div className="relative w-12 h-12 flex items-center justify-center rounded-xl border border-border bg-background/50 backdrop-blur-sm group-hover:border-foreground/50 transition-all duration-300">
                  <img
                    src={
                      skill.icon ?? `https://cdn.simpleicons.org/${skill.slug}`
                    }
                    alt={skill.name}
                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* Skill Glow */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        layoutId="skill-glow"
                        className="absolute inset-[-4px] rounded-xl bg-foreground/5 blur-md -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <motion.span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-6 whitespace-nowrap">
                  {skill.name}
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
