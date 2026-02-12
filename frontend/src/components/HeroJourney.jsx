import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function HeroJourney() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -180]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.18]);

  return (
    <section
      role="banner"
      aria-labelledby="hero-heading"
      data-testid="hero-section"
      className="
        relative w-full overflow-hidden isolate
        /* FLUID HEIGHT: Grows with content, ensures nothing gets cut off */
        min-h-[100svh] lg:min-h-[85svh]
        flex flex-col justify-center
      "
    >
      {/* TRANSFORMED VISUAL LAYER ONLY */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : y,
          scale: shouldReduceMotion ? 1 : scale,
          willChange: "transform",
        }}
        aria-hidden="true"
        data-testid="hero-visual-layer"
        className="absolute inset-0 -z-10"
      >
        {/* LIVING BACKDROP */}
        <div className="absolute inset-0" aria-hidden="true">
          <motion.div
            animate={!shouldReduceMotion ? { rotate: 360 } : undefined}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            data-testid="hero-gradient-1"
            className="absolute w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px]
                       bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-emerald-400/30
                       blur-[100px] lg:blur-[140px] rounded-full will-change-transform
                       top-[-400px] left-[-200px] lg:top-[-500px] lg:left-[-400px]"
          />

          <motion.div
            animate={!shouldReduceMotion ? { rotate: -360 } : undefined}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            data-testid="hero-gradient-2"
            className="absolute w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px]
                       bg-gradient-to-r from-indigo-500/20 via-fuchsia-400/20 to-pink-400/20
                       blur-[120px] lg:blur-[160px] rounded-full
                       bottom-[-200px] right-[-100px] lg:bottom-[-400px] lg:right-[-300px]"
          />

          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/noise.png')",
            }}
            data-testid="hero-noise-texture"
          />
        </div>

        {/* HERO IMAGE */}
        <img
          src="/images/heroJourney6.avif"
          loading="lazy"
          decoding="async"
          alt={t(
            "HeroJourney.imageAlt",
            "Medical diagnostic technology device",
          )}
          data-testid="hero-image"
          className="absolute top-0 right-0 h-full w-full object-cover
                     object-[70%_50%] sm:object-[50%_50%]
                     pointer-events-none select-none opacity-90"
        />
      </motion.div>

      {/* STATIC CONTENT LAYER */}
      <div
        className="
          relative z-10 w-full max-w-7xl mx-auto 
          px-4 sm:px-6 lg:px-8 
          text-center text-gray-100
          
          /* FLUID PADDING:
             - pt-32: Clears the navbar on mobile.
             - lg:pt-20: Centers nicely on desktop.
             - pb-20: Ensures content never touches the bottom edge (or stats cards).
          */
          pt-24 pb-16 lg:pt-20 lg:pb-20
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          data-testid="hero-badge"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                     bg-white/10 backdrop-blur-md border border-white/20
                     text-xs sm:text-sm font-medium mb-8 shadow-lg mx-auto"
        >
          ✨ {t("HeroJourney.badge")}
        </motion.div>

        <motion.h1
          id="hero-heading"
          data-testid="hero-heading"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
            font-bold leading-[1.1] tracking-tight
            drop-shadow-sm"
        >
          {t("HeroJourney.headingLine1")}
          <span
            className="block text-emerald-400 mt-2 filter drop-shadow-lg"
            data-testid="hero-heading-highlight"
          >
            {t("HeroJourney.headingLine2")}
          </span>
        </motion.h1>

        <motion.p
          data-testid="hero-description"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-200 font-medium leading-relaxed"
        >
          {t("HeroJourney.description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1,
            type: "spring",
            stiffness: 140,
            damping: 12,
          }}
          className="mt-7 flex justify-center"
          data-testid="hero-cta-container"
        >
          <button
            type="button"
            aria-label={t("HeroJourney.ctaAria", "Open symptom checker")}
            data-testid="hero-cta-button"
            onClick={() => navigate("/symptom-checker")}
            className="
              group relative inline-flex items-center gap-3
              px-8 py-4 rounded-2xl
              bg-white text-blue-600 
              font-bold text-lg
              shadow-xl shadow-blue-900/20 cursor-pointer
              hover:shadow-2xl hover:bg-emerald-300 hover:text-gray-700 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            <Activity className="w-6 h-6 transition-transform group-hover:rotate-12" />
            <span data-testid="hero-cta-text">{t("HeroJourney.cta")}</span>
          </button>
        </motion.div>
      </div>

      {/* BOTTOM FADE */}
      <div
        aria-hidden="true"
        data-testid="hero-bottom-fade"
        className="absolute bottom-0 left-0 right-0 h-70 pointer-events-none
             bg-gradient-to-t
             from-black/30 via-black/10 to-transparent
             dark:from-black/50 dark:via-black/20"
        style={{
          backgroundImage: `
            linear-gradient(
              to top,
              var(--page-bg) 0%,
              color-mix(in srgb, var(--page-bg) 85%, transparent) 40%,
              transparent 100%
            )
          `,
        }}
      />
    </section>
  );
}
