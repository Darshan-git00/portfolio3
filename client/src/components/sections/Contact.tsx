import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Mail, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-t border-b border-border py-10 md:py-12"
      >
        {/* ── Main row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

          {/* Left — headline + availability */}
          <div className="space-y-2">
            {/* Availability signal */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-green-500" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                Available for opportunities · Bengaluru
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
              Got an idea?{" "}
              <span className="text-muted-foreground italic font-medium">
                Let's build it.
              </span>
            </h2>

            {/* Playful sub line */}
            <p className="text-[12px] text-muted-foreground/60 italic">
              psst — I also play badminton 🏸
            </p>
          </div>

          {/* Right — CTA buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Primary — filled pill */}
            <motion.a
              href={`mailto:${resumeData.personal.email}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 px-5 py-[10px] rounded-full bg-foreground text-background text-[12px] font-mono tracking-[0.04em] hover:opacity-90 transition-opacity duration-200"
              aria-label="Send me an email"
            >
              <Mail className="w-[13px] h-[13px]" />
              Send a mail
            </motion.a>

            {/* Secondary — ghost pill */}
            <motion.a
              href={resumeData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 px-5 py-[10px] rounded-full border border-border text-muted-foreground text-[12px] font-mono tracking-[0.04em] hover:border-foreground/40 hover:text-foreground transition-all duration-200"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="w-[13px] h-[13px]" />
              LinkedIn
            </motion.a>
          </div>
        </div>

        {/* ── Footer row ── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.06em]">
            
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/40 italic">
            Response time: usually same day
          </span>
        </div>
      </motion.div>
    </section>
  );
}