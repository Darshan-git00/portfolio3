import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#050505] py-24 overflow-hidden border-t border-white/5">
      {/* Background grain texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain" />
      
      {/* Decorative accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      <div className="relative max-w-[780px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-heading font-bold tracking-tighter leading-[0.9]">
                Maybe this is <br />
                the end of it. <br />
                <span className="text-muted-foreground/40 italic font-serif">byee</span>
              </h2>
            </motion.div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground/50 transition-colors" />
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/60">Tryna become a Developer</p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground/50 transition-colors" />
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/60">Bengaluru, India</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between pt-4">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">Navigation</p>
                <div className="grid grid-cols-2 gap-4">
                  <a href="#hero" className="text-sm hover:text-muted-foreground transition-colors font-medium">Home</a>
                  <a href="#about" className="text-sm hover:text-muted-foreground transition-colors font-medium">About</a>
                  <a href="#experience" className="text-sm hover:text-muted-foreground transition-colors font-medium">Experience</a>
                  <a href="#projects" className="text-sm hover:text-muted-foreground transition-colors font-medium">Work</a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">Connect</p>
                <div className="flex gap-6">
                  <a href={resumeData.personal.github} target="_blank" rel="noopener" className="p-2 border border-white/5 rounded-full hover:bg-white/5 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href={resumeData.personal.linkedin} target="_blank" rel="noopener" className="p-2 border border-white/5 rounded-full hover:bg-white/5 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${resumeData.personal.email}`} className="p-2 border border-white/5 rounded-full hover:bg-white/5 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Row */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/20">
          <div className="flex items-center gap-4">
            <span>© {year}</span>
            <div className="w-8 h-px bg-white/5" />
            <span className="tracking-widest italic">Crafted with care</span>
          </div>
          <p className="hover:text-muted-foreground/40 transition-colors cursor-default">All rights reserved</p>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-foreground/[0.02] to-transparent pointer-events-none" />
    </footer>
  );
}
