import { motion, useScroll, useTransform } from "framer-motion";
import resumeData from "@/data/resume.json";
import { useRef } from "react";

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
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
            The Profile
          </h2>
        </div>
        
        <div className="relative pl-8">
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-0 top-0 w-[1px] h-full bg-foreground/20"
          />
          <div className="space-y-6 text-xl md:text-2xl text-muted-foreground leading-relaxed" data-testid="text-about-summary">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-foreground">
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
        <div className="flex flex-wrap justify-center gap-6 max-w-[560px] mx-auto">
          {[
            { name: "Java", slug: "java " },
            { name: "SQL", slug: "mysql" },
            { name: "JavaScript", slug: "javascript" },
            { name: "HTML5", slug: "html5" },
            { name: "CSS3", slug: "css" },
            { name: "Spring Boot", slug: "springboot" },
            { name: "Spring MVC", slug: "spring" },
            { name: "Hibernate", slug: "hibernate" },
            { name: "REST APIs", slug: "fastapi" },
            { name: "React.js", slug: "react" },
            { name: "Docker", slug: "docker" },
            { name: "AWS", slug: "amazonaws" },
          ].map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-border bg-muted/40 group-hover:bg-muted group-hover:scale-110 transition-all duration-200">
                <img
                  src={`https://cdn.simpleicons.org/${skill.slug}`}
                  alt={skill.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
