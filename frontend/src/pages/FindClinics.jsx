import { MapPin, Search, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const openMaps = (query) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      `${query} near me`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-4 text-center overflow-hidden">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {t("FindClinics.title")}
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          {t("FindClinics.subtitle")}
        </p>

        {/* Location Found */}
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-left max-w-2xl mx-auto">
          <p className="text-green-800 font-medium flex items-center gap-2">
            📍 {t("FindClinics.locationFound.title")}
          </p>
          <p className="text-green-700 text-sm mt-1">
            {t("FindClinics.locationFound.description")}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-8">
          <button
            onClick={() => openMaps("Healthcare facilities")}
            className="
              inline-flex items-center gap-3
              bg-blue-600 text-white px-8 py-4 rounded-xl
              font-medium shadow-xl cursor-pointer
              transition-all duration-300
              hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-0.5
            "
          >
            <Search className="w-5 h-5" />
            {t("FindClinics.primaryCTA")}
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-4 pt-4 pb-10 my-5">
          {/* Quick Search */}
          <h2 className="mt-6 text-lg font-bold text-gray-900">
            {t("FindClinics.quickSearch")}
          </h2>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {QUICK_SEARCHES.map((item) => (
              <QuickCard
                key={item.key}
                emoji={item.emoji}
                label={t(`FindClinics.quick.${item.key}`)}
                onClick={() => openMaps(item.query)}
              />
            ))}
          </div>

          {/* Emergency */}
          <div className="mt-14 max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 text-left">
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-4 text-lg">
              🚨 {t("FindClinics.emergency.title")}
            </div>

            <p className="text-red-700 text-sm mb-4">
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
              w-full bg-red-600 text-white py-3 rounded-xl font-medium
              flex items-center justify-center gap-2 cursor-pointer
              transition-all duration-300
              hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5
            "
            >
              <MapPin className="w-4 h-4" />
              {t("FindClinics.emergency.findNearby")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small Components ---------- */

function QuickCard({ emoji, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group bg-white border border-gray-200 rounded-2xl p-5
        flex flex-col items-center gap-3 text-sm font-medium
        transition-all duration-300 ease-out
        cursor-pointer
        hover:-translate-y-2 hover:scale-[1.05]
        hover:border-blue-400
        hover:shadow-[0_18px_40px_-12px_rgba(59,130,246,0.35)]
        focus:outline-none
      "
    >
      <div className="text-4xl leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
        {emoji}
      </div>

      <span className="text-gray-700 text-center transition-colors duration-300 group-hover:text-blue-600">
        {label}
      </span>
    </button>
  );
}

function EmergencyBadge({ label, phone }) {
  return (
    <a
      href={`tel:${phone}`}
      className="
        group bg-white border border-red-300 text-red-700
        rounded-xl py-3 px-4 text-sm font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.04]
        hover:border-red-500 hover:text-red-600
        hover:shadow-[0_14px_30px_-10px_rgba(220,38,38,0.45)]
        cursor-pointer
      "
    >
      <span className="text-lg transition-transform duration-300 group-hover:scale-110">
        📞
      </span>
      {label}
    </a>
  );
}
