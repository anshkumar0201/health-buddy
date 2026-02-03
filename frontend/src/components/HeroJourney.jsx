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
      className="relative w-full min-h-[100svh] overflow-hidden isolate"
    >
      {/* TRANSFORMED VISUAL LAYER ONLY */}
      <motion.div
        style={{ y, scale }}
        aria-hidden="true"
        data-testid="hero-visual-layer"
        className="absolute inset-0"
      >
        {/* LIVING BACKDROP */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <motion.div
            animate={!shouldReduceMotion ? { rotate: 360 } : undefined}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute w-[1200px] h-[1200px]
                       bg-gradient-to-r from-blue-500/40
                       via-cyan-400/40 to-emerald-400/40
                       blur-[140px] rounded-full
                       will-change-transform
                       top-[-500px] left-[-400px]"
            data-testid="hero-gradient-1"
          />

          <motion.div
            animate={!shouldReduceMotion ? { rotate: -360 } : undefined}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            className="absolute w-[1000px] h-[1000px]
                       bg-gradient-to-r from-indigo-500/30
                       via-fuchsia-400/30 to-pink-400/30
                       blur-[160px] rounded-full
                       will-change-transform
                       bottom-[-400px] right-[-300px]"
            data-testid="hero-gradient-2"
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
          src="/src/assets/heroJourney5.png"
          alt={t(
            "HeroJourney.imageAlt",
            "Medical diagnostic technology device",
          )}
          data-testid="hero-image"
          className="absolute top-0 right-0 h-full w-full object-cover
                     object-[70%_50%] sm:object-[50%_50%]
                     pointer-events-none select-none"
        />
      </motion.div>

      {/* STATIC CONTENT LAYER */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-6 py-24 lg:py-28 text-center text-gray-200"
        data-testid="hero-content"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          data-testid="hero-badge"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold
                     bg-white/20 backdrop-blur-sm border border-gray-300
                     text-sm mb-6 shadow-sm"
        >
          ✨ {t("HeroJourney.badge")}
        </motion.div>

        <motion.h1
          id="hero-heading"
          data-testid="hero-heading"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          {t("HeroJourney.headingLine1")}
          <span
            className="block text-green-500 mt-2"
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
          className="mt-6 max-w-3xl mx-auto text-lg font-medium"
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
          className="mt-10 flex justify-center"
          data-testid="hero-cta-container"
        >
          <motion.button
            type="button"
            aria-label={t("HeroJourney.ctaAria", "Open symptom checker")}
            data-testid="hero-cta-button"
            whileHover={{
              y: -6,
              scale: 1.08,
              boxShadow: "0 30px 60px rgba(37,99,235,0.4)",
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/symptom-checker")}
            className="
              inline-flex items-center gap-2
              bg-white text-blue-600 border border-gray-400
              px-7 py-2 rounded-xl font-bold cursor-pointer hover:bg-green-500 hover:text-white
              shadow-2xl
            "
          >
            <Activity
              className="w-5 h-5"
              aria-hidden="true"
              data-testid="hero-cta-icon"
            />
            <span data-testid="hero-cta-text">{t("HeroJourney.cta")}</span>
          </motion.button>
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
