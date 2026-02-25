import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ArrowUpRight, FileText, MapPin } from "lucide-react";
import LiveClock from "@/components/LiveClock";

const subtitle =
  "Started with Java, wandered into React, ended up enjoying both. I build things end-to-end and learn something new every sprint.";

function WordReveal() {
  const words = subtitle.split(" ");
  return (
    <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.12,
            delay: 0.12 + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function InteractiveName({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          whileHover={{ 
            y: -10, 
            rotate: Math.random() * 20 - 10,
            color: "var(--foreground)",
            transition: { duration: 0.2 }
          }}
          className="inline-block cursor-none"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative">
      <div className="flex items-start justify-between gap-0">
        <div className="space-y-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Hello! I'm
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
                className="w-[2px] h-4 bg-foreground/50"
              />
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-muted/30 rounded-full border border-border">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground">Bengaluru, IN</span>
                <span className="text-muted-foreground/30">•</span>
                <LiveClock />
              </div>
            </div>
            
            <h1
              className="text-4xl md:text-7xl font-medium tracking-tight leading-[0.9] font-heading shimmer-text"
              data-testid="text-hero-title"
            >
              <div style={{ fontFamily: "'Neue Montreal', syne" }}>
                <InteractiveName text="Darshan" />
              </div>
              <div
                className="text-muted-foreground italic mt-2"
                style={{ fontFamily: "'Neue Montreal', syne" }}
              >
                <InteractiveName text="Prabhakar." />
              </div>
            </h1>
          </motion.div>

          <WordReveal />

          <motion.div
            className="flex flex-wrap gap-6 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#projects"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
              data-testid="link-view-projects"
            >
              Explore work
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              animate={{ y: [0, -4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="group inline-flex items-center gap-2 text-lg font-medium hover:text-muted-foreground transition-colors"
              data-testid="link-view-resume"
            >
              Read resume
              <FileText className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>

        <img
          src="/images/darshan.png"
          alt="Darshan Prabhakar"
          className="w-60 h-75 object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
          style={{
            maskImage:
              "radial-gradient(circle at center, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        />
      </div>
    </section>
  );
}
