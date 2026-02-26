import resumeData from "@/data/resume.json";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#050505] pt-32 pb-16 overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-[780px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-heading font-bold tracking-tighter leading-none"
            >
              Let's build <br />
              something <span className="text-muted-foreground italic font-serif">extraordinary</span>.
            </motion.h2>
            
            <div className="flex gap-4">
              <a href={`mailto:${resumeData.personal.email}`} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium transition-transform hover:scale-105 active:scale-95">
                Get in touch
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Socials</p>
                <div className="flex flex-col gap-2">
                  <a href={resumeData.personal.github} target="_blank" rel="noopener" className="text-sm hover:text-muted-foreground transition-colors">GitHub</a>
                  <a href={resumeData.personal.linkedin} target="_blank" rel="noopener" className="text-sm hover:text-muted-foreground transition-colors">LinkedIn</a>
                  <a href="#" className="text-sm hover:text-muted-foreground transition-colors">Medium</a>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <p className="text-sm">Bengaluru, India</p>
                <p className="text-sm text-muted-foreground">Available worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-foreground/20 to-foreground/5 flex items-center justify-center text-[10px] font-bold">
              DP
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              © {year} {resumeData.personal.name}
            </p>
          </div>
          
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">
            Crafted with React & Framer Motion
          </p>
        </div>
      </div>

      {/* Large background text */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.02]">
        <h2 className="text-[30vw] font-black font-heading leading-none tracking-tighter">
          DARSHAN
        </h2>
      </div>
    </footer>
  );
}
