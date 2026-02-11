import { Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SkeletonCTASection from "./skeletons/SkeletionCTASection";
import React from "react";

function CTASection() {
  const navigate = useNavigate();
  const { t, ready } = useTranslation();

  if (!ready) return <SkeletonCTASection />;
  
  const handleClick = () => navigate("/symptom-checker");

  return (
    <section className="relative w-full overflow-hidden min-h-[380px]">
      {/* Gradient background 
          - Light: Bright Blue -> Green
          - Dark: Deep Blue -> Deep Green (Reduces eye strain while keeping color)
      */}
      <div
        className="absolute inset-0 transition-colors duration-300
        bg-gradient-to-r from-blue-600 via-teal-600 to-green-600
        dark:from-blue-950 dark:via-teal-950 dark:to-green-950 
        will-change-transform"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center text-white font-bold">
        {/* Icon */}
        <div className="flex justify-center mb-6 dark:text-gray-300">
          <Heart
            className="w-16 h-16 text-white pointer-events-none drop-shadow-md transform-gpu"
            strokeWidth={1.5}
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-sm dark:text-gray-300">
          {t("CTASection.title")}
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-lg text-white/90 font-medium">
          {t("CTASection.subtitle")}
        </p>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleClick}
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-xl font-bold
              shadow-lg transform-gpu will-change-transform
              transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-0.5
              active:scale-95 cursor-pointer
              
              bg-white text-blue-600 hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)]
              dark:bg-slate-200 dark:text-teal-600 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] dark:shadow-gray-700
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

export default React.memo(CTASection);

