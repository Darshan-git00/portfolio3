import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function About() {
  return (
    <section id="about" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-12"
      >
        <div className="md:col-span-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-white/10 pb-4 mb-8">
            The Profile
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, i) => (
              <span 
                key={skill} 
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-white/5 text-muted-foreground hover:border-white/20 transition-colors"
                data-testid={`badge-skill-${i}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-8">
          <div className="space-y-6 text-xl md:text-2xl text-muted-foreground leading-relaxed" data-testid="text-about-summary">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-white">
              {resumeData.personal.summary}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
