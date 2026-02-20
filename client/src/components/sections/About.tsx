import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function About() {
  return (
    <section id="about" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-foreground">About</h2>
        <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed mb-8 text-lg" data-testid="text-about-summary">
          <p>{resumeData.personal.summary}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, i) => (
              <span 
                key={skill} 
                className="px-3 py-1 bg-muted border border-border rounded-full text-sm text-foreground"
                data-testid={`badge-skill-${i}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
