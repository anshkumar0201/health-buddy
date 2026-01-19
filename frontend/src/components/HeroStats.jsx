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
                className="bg-white rounded-2xl shadow-lg px-6 py-8 text-center hover:shadow-2xl transition-shadow"
              >
                {Icon && (
                  <Icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                )}

                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>

                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
