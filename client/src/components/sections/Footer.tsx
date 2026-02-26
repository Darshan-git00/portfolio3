import resumeData from "@/data/resume.json";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t-[8px] border-foreground/10 overflow-hidden bg-background mt-20">
      {/* Thick gradient border top */}
      <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-foreground/40 via-foreground/10 to-transparent" />
      
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.02]">
        <span className="text-[20vw] font-bold font-heading whitespace-nowrap tracking-tighter">
          DP
        </span>
      </div>

      <div className="relative max-w-[780px] mx-auto px-6 py-20">
        {/* Top row — name + status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-heading font-bold tracking-tight leading-none">
              Maybe this is the end of it. <br />byee
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-[1px] bg-muted-foreground" />
                Tryna become a Developer
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-[1px] bg-muted-foreground" />
                Bengaluru, India
              </p>
            </div>
          </div>

          {/* Availability badge */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-foreground/10 rounded-sm px-6 py-3 bg-muted/10"
          >
            <span className="w-1 h-1 rounded-full bg-foreground/40" />
            System Active
          </motion.div>
        </div>

        {/* Decorative divider with terminal feel */}
        <div className="relative h-[1px] w-full bg-foreground/10 mb-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 border border-foreground/10 -ml-2 bg-background rotate-45" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border border-foreground/10 -mr-2 bg-background rotate-45" />
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/50">
          <div className="flex items-center gap-4">
            <span className="opacity-30">© {year}</span>
            <span className="w-4 h-[1px] bg-foreground/20" />
            <span>{resumeData.personal.name}</span>
          </div>
          <p className="italic">
            TERMINAL_FOOTER_v1.0.0
          </p>
          <p className="opacity-60">
            Crafted with care.
          </p>
        </div>
      </div>
    </section>
  );
}
