import HeroJourney from "../components/HeroJourney";
import HeroStats from "../components/HeroStats";
import Features from "../components/Features";
import WhyChoose from "../components/WhyChoose";
import CTASection from "../components/CTASection";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.15 },
  },
};

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
      {/* Stats with scroll-trigger animation */}
      <section>
        <div
          className="
    relative
    -translate-y-[20%]
    sm:-translate-y-[90%]
    lg:-translate-y-[90%]

    -mb-[38%]
    sm:-mb-[15%]
    lg:-mb-[15%]
  "
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
          >
            <HeroStats />
          </motion.div>
        </div>
      </section>
      <section>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 0.7,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Features />
        </motion.div>
      </section>
      <section>
        <motion.div
          initial={{ opacity: 0, x: -120 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true, margin: "-120px" }}
        >
          <WhyChoose />
        </motion.div>
      </section>
      <section>
        <motion.div
          initial={{ opacity: 0, x: 120 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true, margin: "-120px" }}
        >
          <CTASection />
        </motion.div>
      </section>
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
          <div
            className="fixed left-1/2 -translate-x-1/2 z-40"
            style={{
              bottom: "calc(max(env(safe-area-inset-bottom), 1px) + 4.3rem)",
            }}
          >
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
