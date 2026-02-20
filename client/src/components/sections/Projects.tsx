import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="scroll-m-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-8 tracking-tight text-foreground">Selected Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resumeData.projects.map((project, index) => (
            <div 
              key={project.id} 
              className="group border border-border bg-card rounded-xl overflow-hidden hover:border-foreground/30 transition-colors"
              data-testid={`card-project-${index}`}
            >
              <div className="aspect-video overflow-hidden bg-muted relative border-b border-border">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-testid={`img-project-${index}`}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex gap-2 shrink-0 mt-1">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-project-github-${index}`}>
                      <Github className="h-5 w-5" />
                    </a>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-project-demo-${index}`}>
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3" data-testid={`text-project-desc-${index}`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
