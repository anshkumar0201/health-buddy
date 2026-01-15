import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Apple,
  Activity,
  Heart,
  Droplet,
  Moon,
  Sun,
  CheckCircle,
} from "lucide-react";

const GENERAL_CARD_ICONS = {
  nutrition: <Apple />,
  physicalActivity: <Activity />,
  mentalHealth: <Heart />,
  hygiene: <Droplet />,
  sleep: <Moon />,
  sun: <Sun />,
};

const GENERAL_CARD_COLORS = {
  nutrition: "bg-green-500",
  physicalActivity: "bg-blue-500",
  mentalHealth: "bg-pink-500",
  hygiene: "bg-cyan-500",
  sleep: "bg-purple-500",
  sun: "bg-orange-500",
};

export default function Prevention() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");

  const diseaseCategories =
    t("Prevention.disease.categories", { returnObjects: true }) || {};


  // OPTIONAL sanity log (remove later)
  console.log("Disease categories:", diseaseCategories);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("Prevention.title")}
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          {t("Prevention.subtitle")}
        </p>

        {/* Tabs */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="relative bg-gray-200 rounded-xl p-1 flex overflow-hidden">
            <div
              className="
                absolute inset-y-1
                left-1
                w-[calc(50%-4px)]
                bg-white rounded-lg shadow
                transition-transform duration-300
              "
              style={{
                transform:
                  activeTab === "general"
                    ? "translateX(0)"
                    : "translateX(100%)",
              }}
            />

            <button
              onClick={() => setActiveTab("general")}
              className={`relative z-10 w-1/2 py-3 text-sm font-medium cursor-pointer transition
                ${
                  activeTab === "general"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {t("Prevention.tabs.general")}
            </button>

            <button
              onClick={() => setActiveTab("disease")}
              className={`relative z-10 w-1/2 py-3 text-sm font-medium cursor-pointer transition
                ${
                  activeTab === "disease"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {t("Prevention.tabs.disease")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-12">
          {activeTab === "general" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {Object.entries(
                t("Prevention.generalCardsData", {
                  returnObjects: true,
                  defaultValue: {},
                })
              ).map(([key, card]) => (
                <Card
                  key={key}
                  icon={GENERAL_CARD_ICONS[key]}
                  title={card.title}
                  color={GENERAL_CARD_COLORS[key]}
                  tips={Array.isArray(card.tips) ? card.tips : []}
                />
              ))}
            </div>
          )}

          {activeTab === "disease" && (
            <div className="animate-fade-in space-y-14">
              {Object.entries(diseaseCategories).map(
                ([categoryKey, category]) => (
                  <section key={categoryKey}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      {category.title}
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(category.items || {}).map(
                        ([diseaseKey, disease]) => (
                          <div
                            key={diseaseKey}
                            className="
                    bg-white rounded-2xl border border-gray-200 p-6
                    shadow-sm transition-all duration-300
                    hover:shadow-xl hover:border-green-300 hover:-translate-y-1
                  "
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-gray-900">
                                {disease.name}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-2xl bg-gray-200 text-gray-600 font-bold">
                                {category.title}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                              {disease.description}
                            </p>

                            {Array.isArray(disease.prevention_tips) &&
                              disease.prevention_tips.length > 0 && (
                                <>
                                  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    {t("Prevention.disease.preventionTips")}
                                  </p>

                                  <ul className="space-y-2 text-sm text-gray-700">
                                    {disease.prevention_tips
                                      .slice(0, 5)
                                      .map((tip, idx) => (
                                        <li
                                          key={idx}
                                          className="flex gap-2 items-start"
                                        >
                                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                  </ul>

                                  {disease.prevention_tips.length > 5 && (
                                    <p className="mt-2 text-xs text-gray-500 italic">
                                      {t("Prevention.disease.moreTips", {
                                        count:
                                          disease.prevention_tips.length - 5,
                                      })}
                                    </p>
                                  )}
                                </>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------- Card ---------- */

function Card({ icon, title, tips = [], color }) {
  const safeTips = Array.isArray(tips) ? tips : [];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-6
        shadow-sm
        transition-all duration-300
        hover:shadow-xl
        hover:border-blue-500
        hover:-translate-y-1"
    >
      <div
        className={`w-10 h-10 rounded-xl ${color}
          flex items-center justify-center text-white mb-4`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>

      <ul className="space-y-4 text-sm text-gray-600">
        {safeTips.map((tip, i) => (
          <li key={i} className="flex gap-2 items-start">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
