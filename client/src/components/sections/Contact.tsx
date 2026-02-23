import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Mail, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-card border border-border rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--foreground) 3px, transparent 3px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Glowing top border */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left – message */}
          <div className="space-y-4 text-center md:text-left max-w-lg">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Bengaluru → World
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              Got an idea?
              <br />
              <span className="text-muted-foreground italic">
                Let's build it.
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground/70 italic pt-2"
            >
              (psst… Wanna catch up? How about a badminton game!!! )
            </motion.p>
          </div>

          {/* Right – small icon links only */}
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${resumeData.personal.email}`}
              title="Send me an email"
              className="p-3 rounded-xl border border-border hover:border-foreground/40 hover:bg-muted/30 transition-all duration-300 group"
              aria-label="Email"
            >
              <Mail className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>

            <a
              href={resumeData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="Connect on LinkedIn"
              className="p-3 rounded-xl border border-border hover:border-foreground/40 hover:bg-muted/30 transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
