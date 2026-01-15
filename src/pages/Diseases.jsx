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
  const { t, i18n } = useTranslation();

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

  /* ---------------- Get diseases from i18n ---------------- */
  const diseases = useMemo(() => {
    const lang = i18n.language;
    const namespaces = i18n.options.ns || [];
    const ns = Array.isArray(namespaces) ? namespaces[0] : namespaces;

    const items = i18n.store.data?.[lang]?.[ns]?.Diseases?.items;
    if (!items || typeof items !== "object") return [];

    return Object.values(items);
  }, [i18n.language]);

  /* ---------------- Category counts ---------------- */
  const categoryCounts = useMemo(() => {
    const counts = {};
    diseases.forEach((d) => {
      if (!d?.category) return;
      const key = d.category.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [diseases]);

  /* ---------------- Filtering ---------------- */
  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) => {
      if (!d?.name || !d?.category) return false;

      const category = d.category.toLowerCase();
      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [diseases, activeCategory, search]);

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
          <div className="flex gap-2 overflow-x-auto pb-2  -mx-4 px-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-3 sm:overflow-visible">
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
              key={d.name}
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

              {/* ✅ FIXED LINK */}
              <Link
                to={`/diseases/${encodeURIComponent(d.name)}`}
                onClick={() =>
                  sessionStorage.setItem("symptomScroll", window.scrollY)
                }
                className="mt-6 inline-flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 group-hover:text-blue-600"
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
