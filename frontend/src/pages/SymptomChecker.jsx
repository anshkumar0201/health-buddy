import { useState, useMemo, useEffect } from "react";
import { Stethoscope, Search, Info, Lock, X } from "lucide-react"; // 👉 Added Lock and X
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonSymptomChecker from "@/components/skeletons/SkeletonSymptomChecker";
import { useAuth } from "../context/AuthContext";

export default function SymptomChecker() {
  const { t, ready, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.body.scrollHeight - window.innerHeight;

          const scrolledEnough = y > 1500;
          const nearBottom = y > max - 80;

          setShowTop((prev) =>
            prev !== scrolledEnough ? scrolledEnough : prev,
          );
          setShowBottom((prev) =>
            prev !== (scrolledEnough && !nearBottom)
              ? scrolledEnough && !nearBottom
              : prev,
          );

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150);

    return () => clearTimeout(id);
  }, [search]);

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

  const isDesktop = useMemo(() => window.innerWidth > 640, []);

  const filteredDiseases = useMemo(() => {
    const lowerSearch = debouncedSearch.toLowerCase();

    return diseases.filter(
      (d) =>
        (activeCategory === "all" || d.category === activeCategory) &&
        d.name.toLowerCase().includes(lowerSearch),
    );
  }, [diseases, activeCategory, debouncedSearch]);

  // 👉 NEW: If not logged in, only show the first 3 items!
  const displayedDiseases = user
    ? filteredDiseases
    : filteredDiseases.slice(0, 3);

  if (!ready) return <SkeletonSymptomChecker />;

  const grid = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b (valid Tailwind class)
    // DARK MODE: Main background changes to dark slate
    <>
      <motion.main
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen pt-24 pb-32 transition-colors duration-300
    bg-gradient-to-b from-slate-50 to-white
    dark:from-slate-950 dark:to-slate-900"
      >
        <div
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
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
          <motion.div
            className="mt-8 max-w-3xl mx-auto rounded-xl border px-5 py-4 flex gap-3 transition-colors duration-300
          bg-blue-50 border-blue-200
          dark:bg-blue-900/30 dark:border-blue-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" />
            <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
              <span className="font-semibold block mb-1">
                {t("SymptomChecker.notice.title")}
              </span>
              {t("SymptomChecker.notice.description")}
            </p>
          </motion.div>

          {/* {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-3xl mx-auto rounded-2xl bg-indigo-600 p-1 shadow-lg shadow-indigo-500/20"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[14px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                    <Lock size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Log in to unlock full search, categories, and medical
                    assessments.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="whitespace-nowrap px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Log In Now
                </button>
              </div>
            </motion.div>
          )} */}

          {/* 👉 WRAPPER: Disable and Fade Search, Categories, and Cards if not logged in */}
          <div
            className={`transition-all duration-500 ${!user ? "opacity-40 pointer-events-none select-none grayscale-[20%]" : ""}`}
          >
            {/* Search */}
            <motion.div
              className="mt-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
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
            </motion.div>

            {/* Categories */}
            <motion.div
              className="mt-8"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="
              flex gap-2 overflow-x-auto pb-2
              -mx-4 px-4
              sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
              sm:gap-3 sm:overflow-visible
            "
              >
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={isDesktop ? { scale: 1.07 } : undefined}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
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
                  </motion.button>
                ))}
              </div>
            </motion.div>
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
          {displayedDiseases.length > 0 && (
            <motion.div
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              // 👉 UNCOMMENTED: Now the grid variable is used for the stagger effect!
              variants={grid}
              initial="hidden"
              animate="show"
              viewport={{ once: true }}
            >
              <AnimatePresence mode="popLayout">
                {/* 👉 MAKE SURE displayedDiseases is used here instead of filteredDiseases */}
                {displayedDiseases.map((d) => (
                  <motion.div
                    layout="position"
                    key={d.id}
                    variants={card}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="group rounded-2xl border p-6
                  shadow-sm transform-gpu will-change-transform
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

                      <p className="text-sm transition-colors duration-300 text-gray-600 dark:text-gray-400 line-clamp-3">
                        {d.description || t("SymptomChecker.noDescription")}
                      </p>
                    </div>

                    {user ? (
                      <Link
                        to={`/assessment/${d.id}`}
                        onClick={() => {
                          sessionStorage.setItem(
                            "symptomScroll",
                            window.scrollY,
                          );
                        }}
                        className="group relative mt-6 w-full flex items-center  justify-center py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300
                        bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-200"
                      >
                        {/* Sliding Background */}
                        <div className="absolute inset-y-0 left-0 w-0 bg-black dark:bg-blue-600 transition-all duration-400 ease-out group-hover:w-full"></div>

                        {/* Text (Stays above the sliding background) */}
                        <span className="relative z-10 flex items-center group-hover:text-white transition-colors duration-300">
                          {t("SymptomChecker.startAssessment")}
                          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="group relative mt-6 w-full flex items-center cursor-pointer justify-center py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300
                        bg-gray-50 border border-gray-200 text-gray-600 
                        dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-400"
                      >
                        {/* Muted Sliding Background for Locked State */}
                        <div className="absolute inset-y-0 left-0 w-0 bg-gray-200 dark:bg-slate-700 transition-all duration-400 ease-out group-hover:w-full"></div>

                        {/* Text */}
                        <span className="relative z-10 flex items-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          <Lock className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                          {t("SymptomChecker.startAssessment")}
                        </span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 👉 NEW: Banner indicating hidden cards for unauthenticated users */}
          {!user && filteredDiseases.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 max-w-4xl mx-auto rounded-3xl border border-dashed border-blue-200 bg-gradient-to-b from-blue-50/50 to-blue-100/30 dark:from-blue-900/10 dark:to-[#0f172a] dark:border-blue-900/50 p-8 text-center shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400"></div>

              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Unlock More Assessments
              </h3>

              <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8 text-base leading-relaxed">
                Log in to access our complete library of highly-detailed,
                AI-driven symptom assessments. Personalized to your medical
                history and vitals.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center mx-auto"
              >
                Log In to Unlock Everything
              </button>
            </motion.div>
          )}
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
            <div
              className="fixed left-1/2 -translate-x-1/2 z-40"
              style={{
                bottom: "calc(max(env(safe-area-inset-bottom), 1px) + 4.3rem)",
              }}
            >
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
          backdrop-blur-md mb-1
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
      </motion.main>

      {/* 👉 NEW: Authentication Request Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Lock size={20} />
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Authentication Required
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                You must be logged in to begin an AI health assessment. This
                ensures your medical profile data is securely applied to give
                you highly accurate results.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 border rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
