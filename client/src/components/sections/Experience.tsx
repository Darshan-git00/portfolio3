import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function Experience() {
  return (
    <section id="experience" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-8 tracking-tight text-foreground">Experience</h2>
        <div className="space-y-12">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="relative" data-testid={`card-experience-${index}`}>
              <div className="md:grid md:grid-cols-4 md:gap-8 items-baseline">
                <div className="md:col-span-1 mb-2 md:mb-0">
                  <span className="text-sm font-mono text-muted-foreground block md:mt-1">{exp.date}</span>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                  <div className="text-muted-foreground mb-4">{exp.company} &mdash; {exp.location}</div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-outside ml-4 marker:text-border">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} data-testid={`text-experience-${index}-bullet-${i}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
