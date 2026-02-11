import { useNavigate } from "react-router-dom";
import {
  Activity,
  Stethoscope,
  BookOpen,
  Shield,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SkeletonCard from "./skeletons/SkeletonCard";
import React from "react";

/* Icon mapping */
const ICON_MAP = {
  symptomAnalyzer: Activity,
  symptomChecker: Stethoscope,
  diseaseLibrary: BookOpen,
  preventionTips: Shield,
  findClinics: MapPin,
  emergencyGuide: AlertCircle,
};

/* Gradient mapping */
const GRADIENT_MAP = {
  symptomAnalyzer: "from-purple-300 to-violet-600",
  symptomChecker: "from-blue-500 to-cyan-500",
  diseaseLibrary: "from-purple-500 to-pink-500",
  preventionTips: "from-green-500 to-emerald-500",
  findClinics: "from-orange-500 to-red-500",
  emergencyGuide: "from-red-500 to-rose-500",
};

function Features() {
  const navigate = useNavigate();
  const { t, ready } = useTranslation();
  const features = t("Features.items", { returnObjects: true });

  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-300">
            {t("Features.sectionTitle")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {t("Features.sectionDescription")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Skeleton fallback */}
          {!ready
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : features.map((feature, index) => {
                const Icon = ICON_MAP[feature.id];
                const gradient = GRADIENT_MAP[feature.id];
                const handleClick = () => navigate(feature.path);
                return (
                  <div
                    key={index}
                    className="
                    group rounded-2xl overflow-hidden
                    shadow-lg
                    transform-gpu will-change-transform
                    transition-all duration-300 ease-out
                    hover:-translate-y-3 sm:hover:shadow-3xl
                    bg-white 
                    dark:bg-[#1e293b] dark:shadow-gray-900/50 
                  "
                  >
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                    <div className="p-8 flex flex-col h-full">
                      <div
                        className={`
                        w-14 h-14 rounded-2xl mb-6
                        bg-gradient-to-br ${gradient}
                        flex items-center justify-center
                        shadow-md
                        group-hover:scale-110 transition-transform
                        transform-gpu
                      `}
                      >
                        {Icon && <Icon className="w-7 h-7 text-white" />}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300">
                        {feature.title}
                      </h3>

                      <p className="mt-3 flex-1 text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>

                      <button
                        onClick={handleClick}
                        className="
                        mt-6 w-full py-2.5 rounded-lg font-medium
                        bg-blue-600 text-white hover:bg-blue-800
                        dark:bg-blue-700 dark:hover:bg-blue-500 cursor-pointer
                        transition active:scale-95 transform-gpu
                      "
                      >
                        {feature.action}
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Features);
