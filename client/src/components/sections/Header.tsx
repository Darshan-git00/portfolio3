import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Github, Linkedin, X, Mail, QrCode, User, Calendar } from "lucide-react";
import resumeData from "@/data/resume.json";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center px-6">
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-background/80 backdrop-blur-2xl border border-border shadow-2xl">
        {/* Profile/About Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
           <User className="h-4 w-4 text-foreground" />
           <div className="w-8 h-4 bg-muted-foreground/20 rounded-full relative">
             <div className="absolute right-0 top-0 w-4 h-4 bg-foreground rounded-full" />
           </div>
        </div>

        <div className="w-[1px] h-4 bg-border mx-2" />

        {/* QR Code Icon */}
        <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <QrCode className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-4 bg-border mx-2" />

        {/* Social Links */}
        <div className="flex items-center gap-1">
          <a 
            href={resumeData.personal.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a 
            href={resumeData.personal.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
          <a 
            href={`mailto:${resumeData.personal.email}`}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-border mx-2" />

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
      </div>
    </header>
  );
}
