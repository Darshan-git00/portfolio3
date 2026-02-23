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
        <div className="flex items-baseline justify-between mb-12 border-b border-border pb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Experience
          </h2>
          <span className="text-xs font-mono text-muted-foreground/50">
            Self worked on
          </span>
        </div>

        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl border border-border bg-card p-8 overflow-hidden transition-all duration-300 hover:border-foreground/30 hover:bg-muted/30"
              data-testid={`card-experience-${index}`}
            >
              {/* Dot grid texture */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--foreground) 3px, transparent 3px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Giant index number */}
              {/* <span className="absolute -right-2 -bottom-6 text-[10rem] font-bold select-none pointer-events-none leading-none font-heading opacity-[0.04]">
                {String(index + 1).padStart(2, "0")}
              </span> */}

              {/* Left accent bar — grows on hover */}
              <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />

              {/* Bottom progress line — slides in on hover */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent transition-all duration-700 ease-out rounded-full" />

              <div className="relative space-y-5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
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
                  <span className="shrink-0 text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                    {exp.date}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-border via-border/50 to-transparent" />

                {/* Bullets */}
                <ul className="space-y-3">
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                      data-testid={`text-experience-${index}-bullet-${i}`}
                    >
                      <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-foreground/30" />
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
