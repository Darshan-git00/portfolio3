import resumeData from "@/data/resume.json";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Big faint name in background */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[8rem] md:text-[12rem] font-bold font-heading whitespace-nowrap opacity-[0.03] tracking-tighter">
          {resumeData.personal.name} */}
      {/* </span>
      </div> */}

      <div className="relative max-w-[780px] mx-auto px-6 py-12">
        {/* Top row — name + status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <p className="text-2xl font-heading font-bold tracking-tight">
              Maybe this is the end of it. <br></br>byee
            </p>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
              I'm Tryna become a Developer · Bengaluru, India
            </p>
          </div>

          {/* Availability badge */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-4 py-2"
          >
            {/* <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            Available for opportunities */}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-border via-border/30 to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
          <p data-testid="text-footer-copyright">
            © {year} {resumeData.personal.name}.
          </p>
          <p className="italic opacity-60">
            Designed with curiosity. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
