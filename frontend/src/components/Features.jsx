import { useNavigate } from "react-router-dom";
import { Activity, BookOpen, Shield, MapPin, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

/* Icon mapping (React responsibility) */
const ICON_MAP = {
  symptomChecker: Activity,
  diseaseLibrary: BookOpen,
  preventionTips: Shield,
  findClinics: MapPin,
  emergencyGuide: AlertCircle,
};

/* Gradient mapping (UI responsibility) */
const GRADIENT_MAP = {
  symptomChecker: "from-blue-500 to-cyan-500",
  diseaseLibrary: "from-purple-500 to-pink-500",
  preventionTips: "from-green-500 to-emerald-500",
  findClinics: "from-orange-500 to-red-500",
  emergencyGuide: "from-red-500 to-rose-500",
};

export default function Features() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = t("Features.items", { returnObjects: true });

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("Features.sectionTitle")}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {t("Features.sectionDescription")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = ICON_MAP[feature.id];
            const gradient = GRADIENT_MAP[feature.id];

            return (
              <div
                key={index}
                className="
                  group bg-white rounded-2xl overflow-hidden
                  shadow-lg
                  transform transition-all duration-300 ease-out
                  hover:-translate-y-3 hover:shadow-3xl
                "
              >
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl mb-6
                      bg-gradient-to-br ${gradient}
                      flex items-center justify-center
                      shadow-md
                      transform transition-transform duration-300
                      group-hover:scale-110
                    `}
                  >
                    {Icon && (
                      <Icon className="w-7 h-7 text-white pointer-events-none" />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-600 flex-1">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(feature.path)}
                    className="
                      mt-6 w-full
                      bg-blue-600 text-white
                      py-2.5 rounded-lg font-medium
                      transition-all duration-300
                      hover:bg-blue-800
                      active:scale-95
                      cursor-pointer
                      select-none
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
