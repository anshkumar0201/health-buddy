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
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("SymptomChecker.title")}
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          {t("SymptomChecker.subtitle")}
        </p>

        {/* Notice */}
        <div className="mt-8 max-w-3xl mx-auto rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm leading-relaxed">
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
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
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
                className={`whitespace-nowrap shrink-0
                    px-4 py-2 rounded-xl cursor-pointer
                    text-sm font-medium flex items-center gap-2
                    transition ${
                      activeCategory === cat
                        ? "bg-black text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
              >
                {t(`SymptomChecker.categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((d) => (
            <div
              key={d.id}
              className="group bg-white rounded-2xl border p-6
                  shadow-sm
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-xl hover:border-blue-500
                  flex flex-col justify-between"
            >
              <div>
                <span className="inline-block mb-3 px-3 py-1 rounded-xl text-xs bg-black text-white">
                  {t(`SymptomChecker.categories.${d.category}`)}
                </span>

                <h3 className="text-lg font-bold mb-2">{d.name}</h3>

                <p className="text-sm text-gray-600">
                  {d.description || t("SymptomChecker.noDescription")}
                </p>
              </div>

              <Link
                to={`/assessment/${d.id}`}
                onClick={() => {
                  sessionStorage.setItem("symptomScroll", window.scrollY);
                }}
                className="mt-6 w-full py-3 rounded-xl text-center bg-gray-300 text-black group-hover:bg-black group-hover:text-white transition font-medium cursor-pointer"
              >
                {t("SymptomChecker.startAssessment")} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
