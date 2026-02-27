import resumeData from "@/data/resume.json";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border mt-24 bg-background">
      <div className="max-w-[780px] mx-auto px-6 py-10">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-1">
            <h2 className="font-heading text-3xl font-bold tracking-tight leading-snug text-foreground">
              Maybe this is the end of it.<br />
              byee
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
              I'm Tryna become a Developer · Bengaluru, India
            </p>
          </div>

          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-3"
          >
            <div className="w-[1.5px] h-3 bg-foreground/20" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              Open to work
            </span>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-muted-foreground/40">
            © {year} {resumeData.personal.name}
          </p>
          
          <div className="text-muted-foreground/20 text-xs tracking-[0.5em] font-mono">
            · · ·
          </div>

          <p className="text-[10px] font-mono italic text-muted-foreground/40">
            Designed with curiosity. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
