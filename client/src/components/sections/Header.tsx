import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import resumeData from "@/data/resume.json";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
        <motion.a 
          href="#" 
          className="text-lg font-medium tracking-tighter mix-blend-difference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-testid="link-home"
        >
          {resumeData.personal.name.split(' ')[0]}<span className="text-muted-foreground">.</span>
        </motion.a>

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
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          <div className={`w-6 h-[1px] bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-[1px] bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-[1px] bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-40 md:hidden flex flex-col items-center justify-center gap-8"
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
