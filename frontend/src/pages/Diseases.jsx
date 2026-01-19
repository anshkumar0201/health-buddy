import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ---------------- Category order ---------------- */
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

export default function Diseases() {
  const { t } = useTranslation();

  useEffect(() => {
    const y = sessionStorage.getItem("symptomScroll");
    if (y) {
      setTimeout(() => {
        window.scrollTo(0, Number(y));
        sessionStorage.removeItem("symptomScroll");
      }, 0);
    }
  }, []);

  /* ---------------- State ---------------- */
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- Get diseases from i18n (SAME AS SymptomChecker) ---------------- */
  const diseases = useMemo(() => {
    const items = t("Diseases.items", {
      returnObjects: true,
      defaultValue: {},
    });

    return Object.entries(items).map(([id, data]) => ({
      id,
      ...data,
    }));
  }, [t]);

  /* ---------------- Category counts (NO lowercasing) ---------------- */
  const categoryCounts = useMemo(() => {
    const counts = {};
    diseases.forEach((d) => {
      if (!d?.category) return;
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [diseases]);

  /* ---------------- Filtering (MATCH SymptomChecker) ---------------- */
  const filteredDiseases = useMemo(() => {
    return diseases.filter(
      (d) =>
        (activeCategory === "all" || d.category === activeCategory) &&
        d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [diseases, activeCategory, search]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
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
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-3 sm:overflow-visible">
            {CATEGORY_ORDER.map((key) => {
              const count =
                key === "all" ? diseases.length : categoryCounts[key] || 0;

              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer flex items-center gap-2 transition border border-gray-300 ${
                    activeCategory === key
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 border hover:bg-gray-100"
                  }`}
                >
                  <span>{t(`Diseases.categories.${key}`)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-black">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Disease Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {filteredDiseases.map((d) => (
            <div
              key={d.id}
              className="group bg-white rounded-2xl border p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              <div className="flex-1">
                <span className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-semibold bg-black text-white">
                  {t(`Diseases.categories.${d.category}`)}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {d.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {d.description}
                </p>
              </div>

              <Link
                to={`/diseases/${d.id}`}
                onClick={() =>
                  sessionStorage.setItem("symptomScroll", window.scrollY)
                }
                className="mt-6 inline-flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 group-hover:text-blue-600 transition"
              >
                {t("Diseases.learnMore")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
