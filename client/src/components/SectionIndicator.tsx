import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "hero",       label: "01 Intro"      },
  { id: "about",      label: "02 About"      },
  { id: "experience", label: "03 Experience" },
  { id: "projects",   label: "04 Projects"   },
  { id: "contact",    label: "05 Contact"    },
];

const TRACK_H     = 200;
const DOT_SPACING = TRACK_H / (SECTIONS.length - 1); // 50px

export default function SectionIndicator() {
  const [active, setActive] = useState(0);

  const fillH = useSpring(0, { stiffness: 220, damping: 28 });
  useEffect(() => { fillH.set(active * DOT_SPACING); }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (i !== -1) setActive(i);
          }
        });
      },
      { threshold: 0.45 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed left-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-4">

      {/* Track + dots */}
      <div className="relative" style={{ width: 8, height: TRACK_H }}>

        {/* Background track */}
        <div
          className="absolute rounded-full bg-foreground/[0.12]"
          style={{ width: 1, left: 3.5, top: 0, height: TRACK_H }}
        />

        {/* Animated fill */}
        <motion.div
          className="absolute rounded-full bg-foreground/50"
          style={{ width: 1, left: 3.5, top: 0, height: fillH }}
        />

        {/* Dots */}
        {SECTIONS.map((_, i) => {
          const isActive = i === active;
          return (
            <span
              key={i}
              className="absolute"
              style={{ top: i * DOT_SPACING - 4, left: 0, width: 8, height: 8 }}
            >
              {/* Ring */}
              <motion.span
                className="absolute rounded-full border border-foreground/30 pointer-events-none"
                style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                animate={isActive
                  ? { opacity: 1, width: 14, height: 14 }
                  : { opacity: 0, width: 14, height: 14 }
                }
                transition={{ duration: 0.22, ease: "easeOut" }}
              />
              {/* Dot */}
              <motion.span
                className="absolute rounded-full pointer-events-none"
                style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                animate={{
                  width:           isActive ? 6 : 4,
                  height:          isActive ? 6 : 4,
                  backgroundColor: isActive
                    ? "hsl(var(--foreground))"
                    : "hsl(var(--foreground) / 0.28)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </span>
          );
        })}
      </div>

      {/* Labels column — always visible, opacity driven by active state */}
      <div className="flex flex-col justify-between" style={{ height: TRACK_H }}>
        {SECTIONS.map((section, i) => {
          const isActive = i === active;
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              animate={{ opacity: isActive ? 1 : 0.28 }}
              whileHover={{ opacity: isActive ? 1 : 0.6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`text-[10px] font-mono uppercase tracking-[0.18em] text-left text-foreground transition-none ${
                isActive ? "font-medium" : "font-normal"
              }`}
            >
              {section.label}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}