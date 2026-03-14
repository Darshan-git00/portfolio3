import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Github,
  Linkedin,
  X,
  Mail,
  User,
  Calendar,
} from "lucide-react";
import resumeData from "@/data/resume.json";

const teams = [
  {
    name: "RCB",
    url: "public/images/rcb.png",
  },
  {
    name: "BFC",
    url: "public/images/bfc.png",
  },
  {
    name: "Manchester United",
    url: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  },
  {
    name: "Real Madrid",
    url: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  },
];

function CoverLetter() {
  return (
    <motion.div
      key="cover-letter"
      initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-40 overflow-y-auto bg-background"
    >
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 border-b border-border pb-8"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3"></p>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight font-heading">
            All  about  me
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-mono"></p>
        </motion.div>

        {/* Cover letter body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed text-justify tracking-[0.01em]"
        >
          <p>
                Hello, ಕುಶಲವೇ?<br /></p>
                <p> I'm engineering graduate in Computer Science who thrives at
                the intersection of technology, creativity, and curiosity.
              </p>
              <p>
                I'm the kind of person who finds patterns in code and meaning in stories. My
                bookshelf reflects that balance: titles like <span className="text-foreground font-medium">The Psychology of Money,
                 5 AM Club, The Happiness Advantage, MegaLiving,
                Ready Study Go, and Ikigai </span> keep me inspired to grow both
                personally and professionally.
              </p>
              <p>
                Sports are my reset button. Whether it's the fast reflexes of <span className="text-foreground font-medium">badminton </span>or the
                strategy and teamwork of <span className="text-foreground font-medium">football </span>, I love the way games mirror life pushing
                you to stay disciplined, adapt quickly, and celebrate every win, big or small.
              </p>
              <p>
                As a CS graduate, I've built projects with <span className="text-foreground font-medium">Java, Spring Boot, and React</span>, but
                what excites me most is solving problems end-to-end and creating systems that
                actually make a difference. I enjoy blending technical depth with design
                clarity, always aiming for solutions that feel both powerful and intuitive.
              </p>
              <p>
                At the core, I'm driven by resilience and curiosity(and that's how I built this portfolio). Whether I'm debugging a
                stubborn environment issue, learning a new skill at night, or chasing a
                shuttle across the court, I believe growth comes from staying grounded,
                embracing challenges, and finding joy in the process.
              </p>

              {/* New paragraph */}
              <p>
                The teams I follow aren’t just about matches or scorelines they carry stories, identity, and fire within them. <span className="text-foreground font-medium">RCB, Bengaluru FC, Manchester United, Real Madrid</span>   win or lose, they’re etched into my soul. Their highs, heartbreaks, and last‑minute magic have taught me more about passion, loyalty, and resilience than I ever imagined sport could.
              </p>

              {/* Club logos */}
              <div className="flex items-center gap-5 pt-2 pb-2 not-prose">
                {teams.map((team) => (
                  <div
                    key={team.name}
                    className="group relative flex flex-col items-center gap-2 cursor-none"
                    title={team.name}
                  >
                    {/* Glow ring on hover */}
                    <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-transparent group-hover:border-border transition-all duration-400">
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-md bg-foreground/5" />
                      <img
                        src={team.url}
                        alt={team.name}
                        className="w-9 h-9 object-contain transition-all duration-500 ease-out grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-md"
                      />
                    </div>
                    {/* Name tooltip below */}
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-300 whitespace-nowrap">
                      {team.name.split(" ").slice(-1)[0]}
                    </span>
                  </div>
                ))}
              </div>

          <p className="pt-4">
            Cheers,<br />
            <span className="text-foreground font-medium">{resumeData.personal.name}</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = coverOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [coverOpen]);

  return (
    <>
      <AnimatePresence>
        {coverOpen && <CoverLetter />}
      </AnimatePresence>

      <header className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center px-6">
        <div className="pointer-events-auto flex items-center gap-1 p-2.5 rounded-full bg-background/80 backdrop-blur-2xl border border-border shadow-2xl">

          {/* Profile / Cover Letter toggle */}
          <button
            onClick={() => setCoverOpen(!coverOpen)}
            className={`p-3 rounded-full transition-colors ${
              coverOpen
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
            aria-label={coverOpen ? "Close cover letter" : "View cover letter"}
          >
            <User className="h-5 w-5" />
          </button>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* Medium Link */}
          <a
            href="https://medium.com/me/stories?tab=posts-published"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Medium"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
          </a>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* Social Links */}
          <div className="flex items-center gap-1">
            <a
              href={resumeData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={resumeData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/darshandev175"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${resumeData.personal.email}`}
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://cal.com/darshandev/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Book a call"
            >
              <Calendar className="h-5 w-5" />
            </a>
          </div>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </header>
    </>
  );
}