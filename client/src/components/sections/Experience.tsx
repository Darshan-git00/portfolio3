import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function Experience() {
  return (
    <section id="experience" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-baseline justify-between mb-12 border-b border-white/10 pb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">Experience</h2>
          <span className="text-xs font-mono text-muted-foreground/50">2024 — Present</span>
        </div>

        <div className="space-y-16">
          {resumeData.experience.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 border-l border-white/5 group" 
              data-testid={`card-experience-${index}`}
            >
              <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-white group-hover:h-full transition-all duration-700 ease-out" />
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-2xl font-medium tracking-tight">{exp.title}</h3>
                  <span className="text-sm font-mono text-muted-foreground">{exp.date}</span>
                </div>
                
                <div className="text-muted-foreground font-medium text-lg italic">
                  {exp.company} &mdash; {exp.location}
                </div>
                
                <ul className="grid grid-cols-1 md:grid-cols-1 gap-4 text-muted-foreground leading-relaxed max-w-2xl">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-4" data-testid={`text-experience-${index}-bullet-${i}`}>
                      <span className="text-white/20 mt-1.5 shrink-0">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
