import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function About() {
  const scrollSkills = [...resumeData.skills, ...resumeData.skills, ...resumeData.skills];

  return (
    <section id="about" className="scroll-m-24 space-y-24">
      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-12"
      >
        <div className="md:col-span-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4 mb-8">
            The Profile
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.slice(0, 8).map((skill, i) => (
              <span 
                key={skill} 
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-border text-muted-foreground"
                data-testid={`badge-skill-static-${i}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-8">
          <div className="space-y-6 text-xl md:text-2xl text-muted-foreground leading-relaxed" data-testid="text-about-summary">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-foreground">
              {resumeData.personal.summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Marquee Skills Section */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-border py-8 bg-muted/30">
        <div className="flex animate-scroll whitespace-nowrap">
          {scrollSkills.map((skill, i) => (
            <div 
              key={`${skill}-${i}`}
              className="mx-12 text-4xl md:text-6xl font-medium tracking-tighter text-foreground/20 hover:text-foreground transition-colors cursor-default"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
