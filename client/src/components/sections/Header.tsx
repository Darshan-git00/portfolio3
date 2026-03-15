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
    url: "/images/rcb.png",          // ← fixed: public/ prefix removed (Next.js public folder)
  },
  {
    name: "BFC",
    url: "/images/bfc.png",          // ← fixed
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
            All about me
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
            Hello, ಕುಶಲವೇ?<br />
          </p>
          <p>
            I'm engineering graduate in Computer Science who thrives at
            the intersection of technology, creativity, and curiosity.
          </p>
          <p>
            I'm the kind of person who finds patterns in code and meaning in stories. My
            bookshelf reflects that balance: titles like{" "}
            <span className="text-foreground font-medium">
              The Psychology of Money, 5 AM Club, The Happiness Advantage,
              MegaLiving, Ready Study Go, and Ikigai
            </span>{" "}
            keep me inspired to grow both personally and professionally.
          </p>
          <p>
            Sports are my reset button. Whether it's the fast reflexes of{" "}
            <span className="text-foreground font-medium">badminton</span> or the
            strategy and teamwork of{" "}
            <span className="text-foreground font-medium">football</span>, I love the way
            games mirror life — pushing you to stay disciplined, adapt quickly, and
            celebrate every win, big or small.
          </p>
          <p>
            As a CS graduate, I've built projects with{" "}
            <span className="text-foreground font-medium">Java, Spring Boot, and React</span>,
            but what excites me most is solving problems end-to-end and creating systems
            that actually make a difference. I enjoy blending technical depth with design
            clarity, always aiming for solutions that feel both powerful and intuitive.
          </p>
          <p>
            At the core, I'm driven by resilience and curiosity (and that's how I built
            this portfolio). Whether I'm debugging a stubborn environment issue, learning
            a new skill at night, or chasing a shuttle across the court, I believe growth
            comes from staying grounded, embracing challenges, and finding joy in the
            process.
          </p>

          {/* New paragraph */}
          <p>
            The teams I follow aren’t just about matches or scorelines — they carry
            stories, identity, and fire within them.{" "}
            <span className="text-foreground font-medium">
              RCB, Bengaluru FC, Manchester United, Real Madrid
            </span>{" "}
            win or lose, they’re etched into my soul. Their highs, heartbreaks, and
            last-minute magic have taught me more about passion, loyalty, and resilience
            than I ever imagined sport could.
          </p>

          {/* Club logos */}
          <div className="flex items-center gap-5 pt-2 pb-2 not-prose">
            {teams.map((team) => (
              <div
                key={team.name}
                className="group relative flex flex-col items-center gap-2 cursor-none"
                title={team.name}
              >
                <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-transparent group-hover:border-border transition-all duration-400">
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-md bg-foreground/5" />
                  <img
                    src={team.url}
                    alt={team.name}
                    className="w-9 h-9 object-contain transition-all duration-500 ease-out grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-md"
                  />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-300 whitespace-nowrap">
                  {team.name.split(" ").slice(-1)[0]}
                </span>
              </div>
            ))}
          </div>

          <p className="pt-4">
            Cheers,<br />
            <span className="text-foreground font-medium">Darshan.</span>
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
    return () => {
      document.body.style.overflow = "";
    };
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

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@FailForwardLab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
              aria-label="X / Twitter"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
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

          {/* Theme Toggle — FIXED */}
          {mounted && (
            <button
              onClick={() => {
                const next = theme === "dark" ? "light" : "dark";

                // Ring animation (same as before)
                const ring = document.createElement("div");
                ring.style.cssText = `
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  pointer-events: none;
                  z-index: 99999;
                  border: 2px solid ${next === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.25)"};
                  box-shadow: 0 0 24px 4px ${next === "dark" ? "rgba(200,210,255,0.3)" : "rgba(100,100,200,0.2)"};
                  animation: ring-expand 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
                `;
                document.body.appendChild(ring);
                setTimeout(() => ring.remove(), 1900);

                if (!document.startViewTransition) {
                  setTheme(next);
                  return;
                }

                document.startViewTransition(() => {
                  setTheme(next);
                });
              }}
              aria-label="Toggle theme"
              className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
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