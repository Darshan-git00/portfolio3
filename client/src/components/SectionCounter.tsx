import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SectionCounter() {
  const [activeSection, setActiveSection] = useState(1);
  const sections = ["hero", "about", "experience", "projects", "contact"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index + 1);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[60] hidden xl:flex flex-col items-center gap-4">
      <div className="text-[10px] font-mono text-muted-foreground rotate-90 mb-4 tracking-widest uppercase">
        Scroll
      </div>
      <div className="flex flex-col gap-8">
        {sections.map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            {activeSection === i + 1 && (
              <motion.div
                layoutId="active-dot"
                className="absolute -inset-2 border border-foreground/20 rounded-full"
              />
            )}
            <span className={`text-[10px] font-mono transition-colors duration-300 ${activeSection === i + 1 ? 'text-foreground' : 'text-muted-foreground/30'}`}>
              0{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
