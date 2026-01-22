import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HeroJourney() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 dark:opacity-90 transition-opacity duration-300" />

      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-sm mb-6 shadow-sm">
          ✨ {t("HeroJourney.badge")}
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-sm dark:text-gray-300">
          {t("HeroJourney.headingLine1")}
          <span className="block text-lime-300 mt-2 drop-shadow-md">
            {t("HeroJourney.headingLine2")}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl mx-auto text-lg text-white/90 font-medium">
          {t("HeroJourney.description")}
        </p>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/symptom-checker")}
            className="
              inline-flex items-center gap-2
              bg-white text-blue-600
              px-6 py-3 rounded-xl font-bold
              shadow-lg
              transition-all duration-300 ease-out
              hover:scale-110 hover:-translate-y-0.5
              hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)]
              active:scale-95 cursor-pointer
              dark:bg-gray-200 dark:shadow-gray-700
            "
          >
            <Activity className="w-5 h-5" />
            {t("HeroJourney.cta")}
          </button>
        </div>
      </div>

      {/* ✅ Seamless fade into REAL page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
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
