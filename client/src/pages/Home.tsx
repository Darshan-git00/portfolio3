import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ThreadCursor from "@/components/ThreadCursor";
import SectionIndicator from "@/components/SectionIndicator";
import BirdIntro from "@/components/BirdIntro";
import SectionCounter from "@/components/SectionCounter";
import BackToTop from "@/components/BackToTop";
import LoadingSplash from "@/components/LoadingSplash";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import BasketballGame from "@/components/sections/BasketballGame";

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <BirdIntro onComplete={() => {}} />
      <AnimatePresence>
        {isLoading && <LoadingSplash onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className={`min-h-screen bg-background relative grain transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <ThreadCursor />
        <SectionIndicator />
        <SectionCounter />
        <BackToTop />
        
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-white z-[60] origin-left"
          style={{ scaleX }}
        />

        <Header onGameToggle={() => setShowGame((g) => !g)} gameOpen={showGame} />

        {showGame ? (
          <BasketballGame />
        ) : (
          <main className="max-w-[780px] mx-auto px-6 py-24 space-y-40">
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Contact />
          </main>
        )}

        {!showGame && <Footer />}

        {/* Background radial glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-white/5 blur-[100px]" />
        </div>
      </div>
    </>
  );
}
