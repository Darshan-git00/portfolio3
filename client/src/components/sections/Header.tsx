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
  { name: "RCB", url: "/images/rcb.png" },
  { name: "BFC", url: "/images/bfc.png" },
  { name: "Manchester United", url: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  { name: "Real Madrid", url: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
];

// Reusable animated icon button — scale + rotate on hover, indigo glow ring, tooltip
function NavBtn({
  href,
  onClick,
  label,
  active,
  children,
  external,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
  external?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base =
    "relative flex items-center justify-center p-3 rounded-full transition-colors duration-150 cursor-pointer outline-none " +
    (active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:text-foreground");

  const inner = (
    <>
      {/* Indigo glow ring — animates in on hover */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={hovered && !active
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.7 }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          border: "1.5px solid rgba(99,102,241,0.65)",
          boxShadow: "0 0 10px rgba(99,102,241,0.30), inset 0 0 6px rgba(99,102,241,0.10)",
        }}
      />

      {/* Background muted pill */}
      {!active && (
        <motion.span
          className="absolute inset-0 rounded-full bg-muted"
          animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
        />
      )}

      {/* Tooltip — slides up from icon */}
      <motion.span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[9px] font-mono tracking-wide whitespace-nowrap bg-foreground text-background"
        animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.15, delay: hovered ? 0.18 : 0 }}
      >
        {label}
      </motion.span>

      {/* Icon — scale + rotate */}
      <motion.span
        className="relative z-10 flex items-center justify-center"
        animate={hovered
          ? { scale: 1.18, rotate: 6 }
          : { scale: 1,    rotate: 0 }
        }
        whileTap={{ scale: 0.88, rotate: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={label}
        className={base}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed text-justify tracking-[0.01em]"
        >
          <p>Hello, ಕುಶಲವೇ?<br /></p>
          <p>I'm engineering graduate in Computer Science who thrives at the intersection of technology, creativity, and curiosity.</p>
          <p>
            I'm the kind of person who finds patterns in code and meaning in stories. My bookshelf reflects that balance: titles like{" "}
            <span className="text-foreground font-medium">The Psychology of Money, 5 AM Club, The Happiness Advantage, MegaLiving, Ready Study Go, and Ikigai</span>{" "}
            keep me inspired to grow both personally and professionally.
          </p>
          <p>
            Sports are my reset button. Whether it's the fast reflexes of{" "}
            <span className="text-foreground font-medium">badminton</span> or the strategy and teamwork of{" "}
            <span className="text-foreground font-medium">football</span>, I love the way games mirror life — pushing you to stay disciplined, adapt quickly, and celebrate every win, big or small.
          </p>
          <p>
            As a CS graduate, I've built projects with{" "}
            <span className="text-foreground font-medium">Java, Spring Boot, and React</span>,
            but what excites me most is solving problems end-to-end and creating systems that actually make a difference. I enjoy blending technical depth with design clarity, always aiming for solutions that feel both powerful and intuitive.
          </p>
          <p>
            At the core, I'm driven by resilience and curiosity (and that's how I built this portfolio). Whether I'm debugging a stubborn environment issue, learning a new skill at night, or chasing a shuttle across the court, I believe growth comes from staying grounded, embracing challenges, and finding joy in the process.
          </p>
          <p>
            The teams I follow aren't just about matches or scorelines — they carry stories, identity, and fire within them.{" "}
            <span className="text-foreground font-medium">Royal Challengers Bengaluru, Bengaluru FC, Manchester United, Real Madrid</span>{" "}
            win or lose, they're etched into my soul. Their highs, heartbreaks, and last-minute magic have taught me more about passion, loyalty, and resilience than I ever imagined sport could.
          </p>

          <div className="flex items-center gap-5 pt-2 pb-2 not-prose">
            {teams.map((team) => (
              <div key={team.name} className="group relative flex flex-col items-center gap-2 cursor-none" title={team.name}>
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
  const [mounted, setMounted]     = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = coverOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [coverOpen]);

  const handleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    const ring = document.createElement("div");
    ring.style.cssText = `
      position:fixed;top:50%;left:50%;width:0;height:0;border-radius:50%;
      transform:translate(-50%,-50%);pointer-events:none;z-index:99999;
      border:2px solid ${next==="dark"?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.25)"};
      box-shadow:0 0 24px 4px ${next==="dark"?"rgba(200,210,255,0.3)":"rgba(100,100,200,0.2)"};
      animation:ring-expand 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1900);
    if (!document.startViewTransition) { setTheme(next); return; }
    document.startViewTransition(() => { setTheme(next); });
  };

  return (
    <>
      <AnimatePresence>{coverOpen && <CoverLetter />}</AnimatePresence>

      <header className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center px-6">
        <div className="pointer-events-auto flex items-center gap-1 p-2.5 rounded-full bg-background/80 backdrop-blur-2xl border border-border shadow-2xl">

          {/* Profile */}
          <NavBtn label="About me" onClick={() => setCoverOpen(!coverOpen)} active={coverOpen}>
            <User className="h-5 w-5" />
          </NavBtn>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* YouTube */}
          <NavBtn href="https://www.youtube.com/@FailForwardLab" label="YouTube" external>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </NavBtn>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* Social links */}
          <NavBtn href={resumeData.personal.github} label="GitHub" external>
            <Github className="h-5 w-5" />
          </NavBtn>
          <NavBtn href={resumeData.personal.linkedin} label="LinkedIn" external>
            <Linkedin className="h-5 w-5" />
          </NavBtn>
          <NavBtn href="https://x.com/darshandev175" label="X / Twitter" external>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </NavBtn>
          <NavBtn href="https://mail.google.com/mail/?view=cm&to=darshanprabhakar66@gmail.com" label="Email" external>
            <Mail className="h-5 w-5" />
          </NavBtn>
          <NavBtn href="https://cal.com/darshandev/15min" label="Book a call" external>
            <Calendar className="h-5 w-5" />
          </NavBtn>

          <div className="w-[1px] h-5 bg-border mx-2" />

          {/* Theme toggle */}
          {mounted && (
            <NavBtn label={theme === "dark" ? "Light mode" : "Dark mode"} onClick={handleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </NavBtn>
          )}
        </div>
      </header>
    </>
  );
}