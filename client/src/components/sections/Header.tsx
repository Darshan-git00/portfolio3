import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Github, Linkedin, X, Mail, User, Calendar } from "lucide-react";
import resumeData from "@/data/resume.json";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center px-6">
      <div className="pointer-events-auto flex items-center gap-1 p-2.5 rounded-full bg-background/80 backdrop-blur-2xl border border-border shadow-2xl">
        {/* Profile/About Toggle */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
           <User className="h-5 w-5 text-foreground" />
           <div className="w-9 h-5 bg-muted-foreground/20 rounded-full relative">
             <div className="absolute right-0 top-0 w-5 h-5 bg-foreground rounded-full" />
           </div>
        </div>

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
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
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
          <button className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
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
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
