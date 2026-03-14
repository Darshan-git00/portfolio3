import resumeData from "@/data/resume.json";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24 bg-background">
      <div className="max-w-[780px] mx-auto px-6 py-12 text-center">

        {/* Eyebrow */}
        <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-muted-foreground/50 mb-4">
          Bengaluru, India
        </p>

<motion.span
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="text-[11px] font-mono italic text-muted-foreground/50 tracking-wide pb-1"
          >
            
          </motion.span>
        {/* Name + byee */}
        <div className="flex items-baseline justify-center gap-3 mb-3">
          <h2 className="text-[40px] md:text-[52px] font-bold tracking-[-0.03em] leading-none text-foreground">
            Darshan 
          </h2>
          
        </div>

        {/* Tagline */}
        <p className="text-[13px] text-muted-foreground/60 italic leading-relaxed max-w-sm mx-auto mb-10">
          Life's too short to edit your brilliance <br />
          write it bold, live it loud.
        </p>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
          <span className="text-[15px] font-mono text-muted-foreground/35">
            © {year} {resumeData.personal.name}
          </span>
          <span className="hidden md:block text-muted-foreground/20 text-[10px]">·</span>
          <span className="text-[20px] font-Poppins text-muted-foreground/35">
            Designed with curiosity. Crafted with care.
          </span>
        </div>

      </div>
    </footer>
  );
}