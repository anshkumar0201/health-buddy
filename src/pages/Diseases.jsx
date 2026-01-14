import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import diseasesHub from "@/data/diseasesHub.json";

/* ---------------- Category → Key mapping ---------------- */
/* DO NOT localize diseases1.json values directly */
const CATEGORY_KEY_MAP = {
  Cardiovascular: "cardiovascular",
  Respiratory: "respiratory",
  Metabolic: "metabolic",
  Musculoskeletal: "musculoskeletal",
  Neurological: "neurological",
  Infectious: "infectious",
  "Mental Health": "mentalHealth",
  Digestive: "digestive",
  Skin: "skin",
  Eye: "eye",
  Other: "other",
};

const CATEGORY_ORDER = [
  "all",
  "cardiovascular",
  "respiratory",
  "metabolic",
  "musculoskeletal",
  "neurological",
  "infectious",
  "mentalHealth",
  "digestive",
  "skin",
  "eye",
  "other",
];

if (!Array.isArray(diseasesHub)) {
  throw new Error("diseases1.json must export an array");
}

export default function Diseases() {
  const { t } = useTranslation();

  /* 🔒 Store ONLY stable keys in state */
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- Category counts ---------------- */
  const categoryCounts = useMemo(() => {
    const counts = {};
    diseasesHub.forEach((d) => {
      const key = CATEGORY_KEY_MAP[d.category];
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, []);

  /* ---------------- Filtering ---------------- */
  const filteredDiseases = diseasesHub.filter((d) => {
    const categoryKey = CATEGORY_KEY_MAP[d.category];

    const matchesCategory =
      activeCategory === "all" || categoryKey === activeCategory;

    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("Diseases.title")}
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          {t("Diseases.subtitle")}
        </p>

        {/* Search */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Diseases.searchPlaceholder")}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <div
            className="
              flex gap-2 overflow-x-auto pb-2
              -mx-4 px-4
              sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
              sm:gap-3 sm:overflow-visible
            "
          >
            {CATEGORY_ORDER.map((key) => {
              const count =
                key === "all" ? diseasesHub.length : categoryCounts[key] || 0;

              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`
                    whitespace-nowrap shrink-0
                    px-4 py-2 rounded-xl cursor-pointer
                    text-sm font-medium flex items-center gap-2
                    transition
                    ${
                      activeCategory === key
                        ? "bg-black text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  <span>{t(`Diseases.categories.${key}`)}</span>
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${
                        activeCategory === key
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Disease Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((d, i) => {
            const categoryKey = CATEGORY_KEY_MAP[d.category];

            return (
              <div
                key={i}
                className="
                  group bg-white rounded-2xl border p-6
                  shadow-sm
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-xl hover:border-blue-500
                  flex flex-col justify-between
                "
              >
                <div>
                  {/* Category */}
                  <span className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-semibold bg-black text-white">
                    {t(`Diseases.categories.${categoryKey}`)}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {d.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{d.description}</p>

                  {/* Symptoms */}
                  {d.symptoms?.length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {t("Diseases.commonSymptoms")}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {d.symptoms.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700"
                          >
                            {s}
                          </span>
                        ))}

                        {d.symptoms.length > 3 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-200 text-gray-700">
                            +{d.symptoms.length - 3} {t("Diseases.more")}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Learn More */}
                <Link
                  to={`/diseases/${encodeURIComponent(d.name)}`}
                  className="
                    mt-6 inline-flex items-center justify-between
                    w-full px-4 py-2 rounded-lg
                    text-sm font-medium text-gray-900
                    transition-all
                    group-hover:bg-gray-200 group-hover:text-blue-600
                  "
                >
                  <span>{t("Diseases.learnMore")}</span>
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
