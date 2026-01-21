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

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b
    // DARK MODE: Main background slate-950/900
    <main
      className="min-h-screen pt-10 pb-32 transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("Prevention.title")}
        </h1>

        <p className="text-center mt-3 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-300">
          {t("Prevention.subtitle")}
        </p>

        {/* Tabs */}
        <div className="mt-10 max-w-3xl mx-auto">
          {/* Tab Container: Gray-200 (Light) -> Slate-800 (Dark) */}
          <div className="relative rounded-xl p-1 flex overflow-hidden transition-colors duration-300 bg-gray-200 dark:bg-slate-800">
            {/* Sliding Indicator: White (Light) -> Slate-600 (Dark) */}
            <div
              className="
                absolute inset-y-1 left-1 w-[calc(50%-4px)]
                rounded-lg shadow transition-all duration-300
                bg-white dark:bg-slate-300
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
              className={`relative z-10 w-1/2 py-3 text-sm font-medium cursor-pointer transition-colors duration-300
                ${
                  activeTab === "general"
                    ? "text-gray-900 dark:text-black"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                }
              `}
            >
              {t("Prevention.tabs.general")}
            </button>

            <button
              onClick={() => setActiveTab("disease")}
              className={`relative z-10 w-1/2 py-3 text-sm font-medium cursor-pointer transition-colors duration-300
                ${
                  activeTab === "disease"
                    ? "text-gray-900 dark:text-black"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
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
                }),
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
                    <h2 className="text-xl font-bold mb-6 transition-colors duration-300 text-gray-900 dark:text-gray-300">
                      {category.title}
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(category.items || {}).map(
                        ([diseaseKey, disease]) => (
                          <div
                            key={diseaseKey}
                            /* ADDED: dark:hover:shadow-gray-700 */
                            className="
                              rounded-2xl border p-6
                              shadow-sm transition-all duration-300
                              hover:shadow-xl hover:-translate-y-1
                              bg-white border-gray-200
                              dark:bg-[#1e293b] dark:border-gray-700 dark:hover:border-green-500 dark:hover:shadow-gray-700
                            "
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
                                {disease.name}
                              </h3>
                              <span
                                className="text-xs px-2 py-0.5 rounded-2xl font-bold
                                bg-gray-200 text-gray-600
                                dark:bg-slate-700 dark:text-gray-300"
                              >
                                {category.title}
                              </span>
                            </div>

                            <p className="text-sm mb-4 transition-colors duration-300 text-gray-600 dark:text-gray-300">
                              {disease.description}
                            </p>

                            {Array.isArray(disease.prevention_tips) &&
                              disease.prevention_tips.length > 0 && (
                                <>
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors duration-300 text-gray-800 dark:text-gray-200">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    {t("Prevention.disease.preventionTips")}
                                  </p>

                                  <ul className="space-y-2 text-sm transition-colors duration-300 text-gray-700 dark:text-gray-300">
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
                                    <p className="mt-2 text-xs italic transition-colors duration-300 text-gray-500 dark:text-gray-400">
                                      {t("Prevention.disease.moreTips", {
                                        count:
                                          disease.prevention_tips.length - 5,
                                      })}
                                    </p>
                                  )}
                                </>
                              )}
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                ),
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
      /* ADDED: dark:hover:shadow-gray-700 */
      className="rounded-2xl border p-6
        shadow-sm
        transition-all duration-300
        hover:shadow-xl
        hover:-translate-y-1
        bg-white border-gray-200 hover:border-blue-500
        dark:bg-[#1e293b] dark:border-gray-700 dark:hover:border-blue-400 dark:hover:shadow-gray-700"
    >
      <div
        className={`w-10 h-10 rounded-xl ${color}
          flex items-center justify-center text-white mb-4 shadow-md`}
      >
        {icon}
      </div>

      <h3 className="font-semibold mb-4 transition-colors duration-300 text-gray-900 dark:text-gray-300">
        {title}
      </h3>

      <ul className="space-y-4 text-sm transition-colors duration-300 text-gray-600 dark:text-gray-300">
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
