import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "01 HERO" },
  { id: "about", label: "02 ABOUT" },
  { id: "experience", label: "03 EXPERIENCE" },
  { id: "projects", label: "04 PROJECTS" },
  { id: "contact", label: "05 CONTACT" },
];

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  const dotY = useSpring(activeSection * 40, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center pointer-events-none">
      {/* Vertical Line */}
      <div className="relative w-[1px] h-[180px] bg-foreground/15">
        {/* Animated Dot */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-foreground rounded-full"
          style={{ y: dotY }}
        />
      </div>

      {/* Labels */}
      <div className="ml-2 flex flex-col justify-between h-[180px] py-[2px]">
        {SECTIONS.map((section, i) => (
          <div
            key={section.id}
            className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
              activeSection === i ? "text-muted-foreground/80" : "text-muted-foreground/40"
            }`}
          >
            {section.label}
          </div>
        ))}
      </div>
    </div>
  );
}
