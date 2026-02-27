import { MapPin, Search, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMemo } from "react";
import SkeletonFindClinics from "@/components/skeletons/SkeletonFindClinics";

/* ---------------- Quick search config ---------------- */

const QUICK_SEARCHES = [
  { key: "hospitals", emoji: "🏥", query: "Hospital" },
  { key: "clinics", emoji: "🩺", query: "Clinic" },
  { key: "govtHospitals", emoji: "🏛️", query: "Government hospital" },
  { key: "phc", emoji: "🏫", query: "Primary health center" },
  { key: "emergency247", emoji: "🚑", query: "Emergency hospital" },
  { key: "pharmacy", emoji: "💊", query: "Pharmacy" },
  { key: "labs", emoji: "🔬", query: "Diagnostic laboratory" },
  { key: "eye", emoji: "👁️", query: "Eye clinic" },
  { key: "dental", emoji: "🦷", query: "Dental clinic" },
  { key: "maternity", emoji: "👶", query: "Maternity hospital" },
];

export default function FindClinics() {
  const { t, ready } = useTranslation();

  const pageReveal = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.97 },
      show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }),
    [],
  );

  const floatPin = useMemo(
    () => ({
      animate: {
        y: [0, -6, 0],
        transition: {
          duration: 2.5,
          repeat: 3,
          ease: "easeInOut",
        },
      },
    }),
    [],
  );

  const gridStagger = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: 0.08 },
      },
    }),
    [],
  );

  const cardReveal = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }), []);

  const openMaps = (query) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      `${query} near me`,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!ready) return <SkeletonFindClinics />;

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b
    // DARK MODE: Main background slate-950/900
    <motion.main
      variants={pageReveal}
      initial="hidden"
      animate="show"
      className="min-h-screen pt-24 pb-32 transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 text-center overflow-hidden">
        {/* Icon */}
        <motion.div
          variants={floatPin}
          animate="animate"
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg transform-gpu will-change-transform">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("FindClinics.title")}
        </h1>

        <p className="mt-3 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-300">
          {t("FindClinics.subtitle")}
        </p>

        {/* Location Found - DARK MODE: Transparent green bg */}
        <div
          className="mt-8 rounded-xl border px-5 py-4 text-left max-w-2xl mx-auto transition-colors duration-300
          bg-green-50 border-green-200 
          dark:bg-green-900/30 dark:border-green-800"
        >
          <p className="font-medium flex items-center gap-2 transition-colors duration-300 text-green-800 dark:text-green-300">
            📍 {t("FindClinics.locationFound.title")}
          </p>
          <p className="text-sm mt-1 transition-colors duration-300 text-green-700 dark:text-green-400">
            {t("FindClinics.locationFound.description")}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => openMaps("Healthcare facilities")}
            className="
      flex items-center justify-center gap-3
      min-h-[56px]
      bg-blue-600 text-white px-6 py-3 rounded-xl
      font-medium shadow-xl cursor-pointer
      transition-all duration-300 transform-gpu will-change-transform
      hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-0.5
      dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-gray-300
    "
          >
            <Search className="w-5 h-5 shrink-0" />
            {t("FindClinics.primaryCTA")}
            <ExternalLink className="w-4 h-4 shrink-0 opacity-80" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-4 pt-4 pb-10 my-5">
          {/* Quick Search Heading */}
          <h2 className="mt-6 text-lg font-bold transition-colors duration-300 text-gray-900 dark:text-white">
            {t("FindClinics.quickSearch")}
          </h2>

          <motion.div
            variants={gridStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {QUICK_SEARCHES.map((item) => (
              <QuickCard
                key={item.key}
                emoji={item.emoji}
                label={t(`FindClinics.quick.${item.key}`)}
                onClick={() => openMaps(item.query)}
                motionVariants={cardReveal}
              />
            ))}
          </motion.div>

          {/* Emergency Section - DARK MODE: Transparent red bg */}
          <motion.div
            whileHover={{
              boxShadow: "0 0 25px rgba(220,38,38,0.35)",
            }}
            transition={{ duration: 0.3 }}
            className="mt-14 w-full sm:max-w-3xl sm:mx-auto rounded-2xl border p-6 text-left transition-colors duration-300
            bg-red-50 border-red-200 
            dark:bg-red-900/20 dark:border-red-800"
          >
            <div className="flex items-center gap-2 font-semibold mb-4 text-lg transition-colors duration-300 text-red-700 dark:text-red-400">
              🚨 {t("FindClinics.emergency.title")}
            </div>

            <p className="text-sm mb-4 transition-colors duration-300 text-red-700 dark:text-red-300">
              {t("FindClinics.emergency.description")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <EmergencyBadge
                label={t("FindClinics.emergency.ambulance")}
                phone="108"
              />
              <EmergencyBadge
                label={t("FindClinics.emergency.healthHelpline")}
                phone="104"
              />
              <EmergencyBadge
                label={t("FindClinics.emergency.emergency")}
                phone="102"
              />
            </div>

            <button
              onClick={() => openMaps("Emergency hospital")}
              className="
    w-full min-h-[52px]
    bg-red-600 text-white px-4 py-3 rounded-xl font-medium
    flex items-center justify-center gap-2 cursor-pointer
    transition-all duration-300
    hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5
    dark:hover:bg-red-500
  "
            >
              <MapPin className="w-4 h-4 shrink-0" />
              {t("FindClinics.emergency.findNearby")}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}

/* ---------- Small Components ---------- */

function QuickCard({ emoji, label, onClick, motionVariants }) {
  return (
    <motion.button
      variants={motionVariants}
      className="group rounded-2xl p-5 border
        flex flex-col items-center gap-3 text-sm font-medium
        transition-all duration-300 ease-out
        cursor-pointer transform-gpu will-change-transform
        hover:-translate-y-2 hover:scale-[1.05]
        focus:outline-none
        
        bg-white border-gray-200
        hover:border-blue-400 hover:shadow-[0_18px_40px_-12px_rgba(59,130,246,0.35)]
        
        dark:bg-[#1e293b] dark:border-gray-700 
        dark:hover:border-blue-400 dark:hover:shadow-[0_18px_40px_-12px_rgba(30,58,138,0.5)]
      "
      onClick={onClick}
    >
      <div className="text-4xl leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
        {emoji}
      </div>

      <span
        className="text-center transition-colors duration-300 
        text-gray-700 group-hover:text-blue-600
        dark:text-gray-300 dark:group-hover:text-blue-400"
      >
        {label}
      </span>
    </motion.button>
  );
}

function EmergencyBadge({ label, phone }) {
  return (
    <a
      href={`tel:${phone}`}
      className="
        group border rounded-xl py-3 px-2 text-sm font-semibold
        flex items-center justify-center gap-2 transform-gpu will-change-transform
        transition-all duration-300 ease-out
        cursor-pointer
        hover:-translate-y-1 hover:scale-[1.04]
        
        bg-white border-red-300 text-red-700
        hover:border-red-500 hover:text-red-600 hover:shadow-[0_14px_30px_-10px_rgba(220,38,38,0.45)]
        
        dark:bg-slate-800 dark:border-red-900 dark:text-red-400
        dark:hover:border-red-600 dark:hover:text-red-300 dark:hover:shadow-[0_14px_30px_-10px_rgba(153,27,27,0.5)]
      "
    >
      <span className="text-lg transition-transform duration-300 group-hover:scale-110">
        📞
      </span>
      {label}
    </a>
  );
}
