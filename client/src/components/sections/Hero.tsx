import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ArrowUpRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Available for opportunities
          </span>
          <h1 className="text-5xl md:text-8xl font-medium tracking-tight leading-[0.9] font-heading" data-testid="text-hero-title">
            <span className="font-sans">Darshan</span> <br />
            <span className="text-muted-foreground italic font-sans">Prabhakar.</span>
          </h1>
        </motion.div>

        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          data-testid="text-hero-subtitle"
        >
          A software engineer crafting high-performance digital systems and refined user interfaces.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
            data-testid="link-view-projects"
          >
            Explore work
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
            data-testid="link-view-resume"
          >
            Read resume
            <FileText className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
