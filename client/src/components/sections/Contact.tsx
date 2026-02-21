import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Mail, Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="scroll-m-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group p-[1px] rounded-2xl overflow-hidden bg-border/50">
          {/* Rotating Border Gradient */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,var(--foreground)_180deg,transparent_210deg,transparent_360deg)] opacity-10 animate-[rotateBorder_10s_linear_infinite] group-hover:opacity-20 transition-opacity" />
          
          <div className="relative border border-border rounded-2xl p-8 md:p-12 text-center md:text-left md:flex items-center justify-between gap-8 bg-card">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">Get in Touch</h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-contact-desc">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href={`mailto:${resumeData.personal.email}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                data-testid="link-contact-email"
              >
                <Mail className="h-4 w-4" />
                Say Hello
              </a>
              <a
                href={resumeData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 w-12 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
                data-testid="link-contact-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={resumeData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 w-12 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
                data-testid="link-contact-github"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
