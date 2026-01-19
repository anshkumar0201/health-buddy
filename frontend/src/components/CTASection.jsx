import { Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center text-white font-bold">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Heart
            className="w-16 h-16 text-white pointer-events-none"
            strokeWidth={1.5}
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold">
          {t("CTASection.title")}
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-lg text-white/90">{t("CTASection.subtitle")}</p>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/symptom-checker")}
            className="
              inline-flex items-center gap-2
              bg-white text-blue-600
              px-6 py-3 rounded-xl font-bold
              shadow-lg
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-0.5
              hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)]
              active:scale-95
              cursor-pointer
            "
          >
            <Activity className="w-5 h-5 pointer-events-none" />
            {t("CTASection.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
