import { BookOpen, Shield, Users, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICON_MAP = {
  diseases: BookOpen,
  healthTips: Shield,
  languages: Users,
  emergency: AlertCircle,
};

export default function HeroStats() {
  const { t } = useTranslation();

  const stats = t("HeroStats.items", { returnObjects: true });

  return (
    <section className="relative z-20 -mt-14 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = ICON_MAP[stat.id];

            return (
              <div
                key={index}
                className="
                  rounded-2xl shadow-lg px-6 py-8 text-center 
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  bg-white 
                  dark:bg-[#242930] dark:border dark:border-slate-800 dark:shadow-black/40  dark:text-gray-300
                "
              >
                {Icon && (
                  <Icon
                    className="w-8 h-8 mx-auto mb-4 transition-colors duration-300
                    text-blue-600 
                    dark:text-blue-400"
                  />
                )}

                <div
                  className="text-3xl font-bold transition-colors duration-300
                  text-gray-900 
                  dark:text-white"
                >
                  {stat.value}
                </div>

                <div
                  className="mt-2 text-sm transition-colors duration-300
                  text-gray-600 
                  dark:text-gray-400"
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
