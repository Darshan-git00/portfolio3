import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-background pt-24 pb-12 overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background grain texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain" />

      <div className="relative max-w-[780px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold tracking-tight leading-tight">
              Maybe this is the end of it. <br />
              byee
            </h2>
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-[1px] bg-muted-foreground/50" />
                Tryna become a Developer
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-[1px] bg-muted-foreground/50" />
                Bengaluru, India
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">Connect</p>
                <div className="flex gap-4">
                  <a href="#" className="text-sm hover:text-foreground transition-colors">GitHub</a>
                  <a href="#" className="text-sm hover:text-foreground transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Row */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
          <p>© {year} • All rights reserved</p>
          <p className="italic">Crafted with care</p>
        </div>
      </div>
    </footer>
  );
}
