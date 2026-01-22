import { useState, useMemo, useEffect } from "react";
import { Activity, Search, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SymptomChecker() {
  const { t } = useTranslation();

  const categories = [
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

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const y = sessionStorage.getItem("symptomScroll");
    if (y) {
      setTimeout(() => {
        window.scrollTo(0, Number(y));
        sessionStorage.removeItem("symptomScroll");
      }, 0);
    }
  }, []);

  const diseases = useMemo(() => {
    const data = t("SymptomChecker.data", { returnObjects: true });
    return Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
  }, [t]);

  const filteredDiseases = diseases.filter(
    (d) =>
      (activeCategory === "all" || d.category === activeCategory) &&
      d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b (valid Tailwind class)
    // DARK MODE: Main background changes to dark slate
    <main
      className="min-h-screen pt-10 pb-32 transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("SymptomChecker.title")}
        </h1>

        <p className="text-center mt-3 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-400">
          {t("SymptomChecker.subtitle")}
        </p>

        {/* Notice - DARK MODE: Use semi-transparent blue background */}
        <div
          className="mt-8 max-w-3xl mx-auto rounded-xl border px-5 py-4 flex gap-3 transition-colors duration-300
          bg-blue-50 border-blue-200 
          dark:bg-blue-900/30 dark:border-blue-800"
        >
          <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" />
          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
            <span className="font-semibold block mb-1">
              {t("SymptomChecker.notice.title")}
            </span>
            {t("SymptomChecker.notice.description")}
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("SymptomChecker.searchPlaceholder")}
              className="w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 transition-colors duration-300
                border-gray-200 bg-white text-gray-900 placeholder-gray-500
                dark:bg-[#1e293b] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                title={t(`SymptomChecker.categories.${cat}`)} // full text on hover
                className={`whitespace-nowrap shrink-0
      px-4 py-2 rounded-xl cursor-pointer
      text-sm font-medium flex items-center
      transition-all duration-300
      max-w-[160px] sm:max-w-[200px]
      overflow-hidden text-ellipsis
      ${
        activeCategory === cat
          ? "bg-black text-white shadow-sm dark:bg-gray-300 dark:text-black"
          : "border hover:bg-gray-100 bg-white text-black border-gray-200 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-700"
      }`}
              >
                <span className="truncate block w-full text-center">
                  {t(`SymptomChecker.categories.${cat}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredDiseases.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center px-4">
            <Search className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              No conditions found
            </h3>

            <p className="mt-2 text-sm max-w-md text-gray-600 dark:text-gray-400">
              We couldn’t find any conditions matching{" "}
              <span className="font-medium text-gray-900 dark:text-gray-200">
                “{search}”
              </span>
              . Try a different keyword or select another category.
            </p>

            {(search || activeCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="
          mt-6 px-5 py-2.5 text-sm font-semibold rounded-lg
          bg-black text-white
          border border-gray-300
          shadow-md shadow-black/20
          hover:bg-gray-600 hover:shadow-lg
          active:scale-[0.98]
          transition-all duration-200
          cursor-pointer dark:bg-white dark:text-black dark:hover:bg-gray-400
        "
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {filteredDiseases.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDiseases.map((d) => (
              <div
                key={d.id}
                className="group rounded-2xl border p-6
                shadow-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:border-blue-500
                flex flex-col justify-between
                bg-white border-gray-200
                dark:bg-[#1e293b] dark:border-gray-700 dark:hover:border-blue-400 dark:hover:shadow-gray-700"
              >
                <div>
                  <span
                    className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-medium 
                  bg-black text-white 
                  dark:bg-blue-600 dark:text-gray-300"
                  >
                    {t(`SymptomChecker.categories.${d.category}`)}
                  </span>

                  <h3 className="text-lg font-bold mb-2 transition-colors duration-300 text-gray-900 dark:text-white">
                    {d.name}
                  </h3>

                  <p className="text-sm transition-colors duration-300 text-gray-600 dark:text-gray-400">
                    {d.description || t("SymptomChecker.noDescription")}
                  </p>
                </div>

                <Link
                  to={`/assessment/${d.id}`}
                  onClick={() => {
                    sessionStorage.setItem("symptomScroll", window.scrollY);
                  }}
                  className="mt-6 w-full py-3 rounded-xl text-center font-medium cursor-pointer transition-colors duration-300
                  bg-gray-300 text-black hover:bg-black hover:text-white
                  dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-blue-600"
                >
                  {t("SymptomChecker.startAssessment")} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
