import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import resumeData from "@/data/resume.json";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 backdrop-blur-xl bg-background/50 border-b border-border' : 'py-8'}`}>
      <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
        <motion.a 
          href="#" 
          className="text-lg font-medium tracking-tighter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-testid="link-home"
        >
          {resumeData.personal.name.split(' ')[0]}<span className="text-muted-foreground">.</span>
        </motion.a>

        <div className="flex items-center gap-8 md:gap-12">
          <nav className="hidden md:flex gap-12">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors relative group"
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Toggle theme"
                data-testid="button-theme-toggle"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              <div className={`w-6 h-[1px] bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-[1px] bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-[1px] bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-background z-40 md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-4xl font-medium tracking-tight"
                onClick={() => setIsOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
