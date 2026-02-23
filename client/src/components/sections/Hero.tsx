import { motion } from "framer-motion";
import resumeData from "@/data/resume.json";
import { ArrowUpRight, FileText } from "lucide-react";

const subtitle =
  "Mixing football passion with badminton precision, I play hard, laugh louder, and keep the rally going on and off the field.";

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

export default function Hero() {
  return (
    <section id="hero" className="relative">
      <div className="flex items-start justify-between gap-0">
        {/* Left — Text content */}
        <div className="space-y-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Hello! I'm
            </span>
            <h1
              className="text-4xl md:text-7xl font-medium tracking-tight leading-[0.9] font-heading shimmer-text"
              data-testid="text-hero-title"
            >
              <span style={{ fontFamily: "'Neue Montreal', syne" }}>
                Darshan
              </span>
              <br />
              <span
                className="text-muted-foreground italic"
                style={{ fontFamily: "'Neue Montreal', syne" }}
              >
                Prabhakar.
              </span>
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

        {/* Photo */}
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
