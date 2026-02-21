import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ExternalLink, Github } from "lucide-react";

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
          <span className="text-xs font-mono text-muted-foreground/50">
            01 — 02
          </span>
        </div>

        <div className="space-y-32">
          {resumeData.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              data-testid={`card-project-${index}`}
            >
              <div className="md:col-span-7 aspect-[16/10] overflow-hidden rounded-sm bg-accent/50 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  data-testid={`img-project-${index}`}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {project.date}
                  </span>
                  <h3 className="text-3xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                </div>

                <p
                  className="text-muted-foreground leading-relaxed"
                  data-testid={`text-project-desc-${index}`}
                >
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono uppercase tracking-wider border border-white/10 px-2 py-1 rounded-full text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 pt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
                    data-testid={`link-project-github-${index}`}
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
                    data-testid={`link-project-demo-${index}`}
                  >
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
