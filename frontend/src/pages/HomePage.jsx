import HeroJourney from "../components/HeroJourney"
import HeroStats from "../components/HeroStats"
import Features from "../components/Features"
import WhyChoose from "../components/WhyChoose"
import CTASection from "../components/CTASection"
import { useState, useEffect } from "react";

export default function HomePage() {
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        const y = window.scrollY;
        const max = document.body.scrollHeight - window.innerHeight;

        const scrolledEnough = y > 1500;
        const nearBottom = y > max - 80;

        setShowTop(scrolledEnough);
        setShowBottom(scrolledEnough && !nearBottom);
      };

      window.addEventListener("scroll", onScroll);
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
      <div className="relative">
        <HeroJourney />
        <HeroStats />
        <Features />
        <WhyChoose />
        <CTASection />
        {/* Mobile Scroll Helpers */}
        <div className="sm:hidden pointer-events-none">
          {showTop && (
            <div className="fixed top-17 left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="
          pointer-events-auto
          w-10 h-10 rounded-full
          flex items-center justify-center
          backdrop-blur-md font-bold
          bg-white/25 dark:bg-black/25
          border border-white/20 dark:border-gray-700/40
          shadow-sm
          opacity-70 hover:opacity-100
          transition
        "
              >
                <span className="material-symbols-rounded text-base">
                  keyboard_arrow_up
                </span>
              </button>
            </div>
          )}

          {showBottom && (
            <div className="fixed bottom-[5.2rem] left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
                className="
          pointer-events-auto
          w-10 h-10 rounded-full font-bold
          flex items-center justify-center
          backdrop-blur-md
          bg-white/25 dark:bg-black/25
          border border-white/20 dark:border-gray-700/40
          shadow-sm
          opacity-70 hover:opacity-100
          transition
        "
              >
                <span className="material-symbols-rounded text-base">
                  keyboard_arrow_down
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
}
