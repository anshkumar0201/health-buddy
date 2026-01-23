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

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;

      const scrolledEnough = y > 1500;
      const nearBottom = y > max - 80;

      setShowTop(scrolledEnough);
      setShowBottom(scrolledEnough && !nearBottom);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


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
    const items = t("Diseases.items", {
      returnObjects: true,
      defaultValue: {},
    });

    return Object.entries(items).map(([id, data]) => ({
      id,
      ...data,
    }));
  }, [t]);

  /* ---------------- Category counts ---------------- */
  const categoryCounts = useMemo(() => {
    const counts = {};
    diseases.forEach((d) => {
      if (!d?.category) return;
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [diseases]);

  /* ---------------- Filtering ---------------- */
  const filteredDiseases = useMemo(() => {
    return diseases.filter(
      (d) =>
        (activeCategory === "all" || d.category === activeCategory) &&
        d.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [diseases, activeCategory, search]);

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("Diseases.title")}
        </h1>

        <p className="text-center mt-3 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-400">
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
              className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300
                bg-white border-gray-200 
                dark:bg-[#1e293b] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer flex items-center gap-2 transition border 
                    ${
                      activeCategory === key
                        ? "bg-black text-white dark:bg-gray-300 dark:text-black dark:border-gray-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-700"
                    }`}
                >
                  <span>{t(`Diseases.categories.${key}`)}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full 
                    ${
                      activeCategory === key
                        ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                        : "bg-gray-200 text-black dark:bg-slate-700 dark:text-gray-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredDiseases.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center px-4">
            <Search className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              No diseases found
            </h3>

            <p className="mt-2 text-sm max-w-md text-gray-600 dark:text-gray-400">
              We couldn’t find any diseases matching{" "}
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
      hover:bg-gray-700 hover:shadow-lg cursor-pointer
      active:scale-[0.98]
      transition-all duration-200
      dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-400
    "
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Disease Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {filteredDiseases.map((d) => (
            <div
              key={d.id}
              className="group rounded-2xl border p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl flex flex-col transition-all duration-300
                bg-white border-gray-200
                dark:bg-[#1e293b] dark:border-gray-700 dark:hover:border-blue-400 dark:hover:shadow-gray-700"
            >
              <div className="flex-1">
                <span
                  className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-semibold 
                  bg-black text-white 
                  dark:bg-blue-600 dark:text-white"
                >
                  {t(`Diseases.categories.${d.category}`)}
                </span>

                <h3 className="text-lg font-bold mb-2 transition-colors duration-300 text-gray-900 dark:text-gray-300">
                  {d.name}
                </h3>

                {/* Using text-gray-300 for reduced eye strain in dark mode */}
                <p className="text-sm mb-4 line-clamp-2 transition-colors duration-300 text-gray-600 dark:text-gray-300">
                  {d.description}
                </p>
              </div>

              <Link
                to={`/diseases/${d.id}`}
                onClick={() =>
                  sessionStorage.setItem("symptomScroll", window.scrollY)
                }
                className="mt-6 inline-flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition
                  hover:bg-gray-300 group-hover:text-blue-600
                  dark:text-gray-300 dark:hover:bg-slate-600 dark:group-hover:text-blue-400"
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
      {/* Mobile Scroll Helpers */}
      <div className="sm:hidden pointer-events-none">
        {showTop && (
          <div className="fixed top-17 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="
          pointer-events-auto
          w-10 h-10 rounded-full
          flex items-center justify-center
          backdrop-blur-md font-bold
          bg-white/25 dark:bg-black/25
          border border-white/20 dark:border-gray-700/40
          shadow-sm
          opacity-70 hover:opacity-100
          transition
        "
            >
              <span className="material-symbols-rounded text-base">
                keyboard_arrow_up
              </span>
            </button>
          </div>
        )}

        {showBottom && (
          <div className="fixed bottom-[5.2rem] left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
              className="
          pointer-events-auto
          w-10 h-10 rounded-full font-bold
          flex items-center justify-center
          backdrop-blur-md
          bg-white/25 dark:bg-black/25
          border border-white/20 dark:border-gray-700/40
          shadow-sm
          opacity-70 hover:opacity-100
          transition
        "
            >
              <span className="material-symbols-rounded text-base">
                keyboard_arrow_down
              </span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
