import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ArrowRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="pt-12 md:pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
          Hi, I'm {resumeData.personal.name.split(' ')[0]}.<br />
          <span className="text-muted-foreground">{resumeData.personal.role}.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed" data-testid="text-hero-subtitle">
          I build clean, performant, and accessible digital experiences. Currently focused on modern web technologies and robust backend systems.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            data-testid="link-view-projects"
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors"
            data-testid="link-view-resume"
          >
            <FileText className="h-4 w-4" />
            Resume
          </a>
        </div>
      </motion.div>
    </section>
  );
}
