import { MapPin, Search, ExternalLink } from "lucide-react";

/* ---------------- Quick search config ---------------- */

const QUICK_SEARCHES = [
  { emoji: "🏥", label: "Hospitals Near Me", query: "Hospital" },
  { emoji: "🩺", label: "Clinics Near Me", query: "Clinic" },
  { emoji: "🏛️", label: "Government Hospitals", query: "Government hospital" },
  { emoji: "🏫", label: "Primary Health Centers", query: "Primary health center" },
  { emoji: "🚑", label: "24/7 Emergency", query: "Emergency hospital" },
  { emoji: "💊", label: "Pharmacies", query: "Pharmacy" },
  { emoji: "🔬", label: "Diagnostic Labs", query: "Diagnostic laboratory" },
  { emoji: "👁️", label: "Eye Clinics", query: "Eye clinic" },
  { emoji: "🦷", label: "Dental Clinics", query: "Dental clinic" },
  { emoji: "👶", label: "Maternity Hospitals", query: "Maternity hospital" },
];

export default function FindClinics() {
  const openMaps = (query) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      `${query} near me`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-4 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Find Nearby Clinics
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Search for healthcare facilities near your location using Google Maps
        </p>

        {/* Location Found */}
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-left max-w-2xl mx-auto">
          <p className="text-green-800 font-medium flex items-center gap-2">
            📍 Location Found
          </p>
          <p className="text-green-700 text-sm mt-1">
            Your location has been detected. Click any option below to find
            nearby facilities.
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
            Search All Healthcare Facilities Near Me
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>
        </div>

        {/* Quick Search */}
        <h2 className="mt-14 text-lg font-bold text-gray-900">
          Quick Search
        </h2>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {QUICK_SEARCHES.map((item) => (
            <QuickCard
              key={item.label}
              emoji={item.emoji}
              label={item.label}
              onClick={() => openMaps(item.query)}
            />
          ))}
        </div>

        {/* Emergency */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 text-left">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-4 text-lg">
            🚨 Emergency Services
          </div>

          <p className="text-red-700 text-sm mb-4">
            In case of emergency, call these helplines immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <EmergencyBadge label="108 – Ambulance" phone="108" />
            <EmergencyBadge label="104 – Health Helpline" phone="104" />
            <EmergencyBadge label="102 – Emergency" phone="102" />
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
            Find Emergency Hospital Near Me
          </button>
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
      {/* Emoji Icon */}
      <div
        className="
          text-4xl leading-none
          transition-transform duration-300
          group-hover:scale-110 group-hover:-translate-y-1
        "
      >
        {emoji}
      </div>

      {/* Label */}
      <span
        className="
          text-gray-700 text-center
          transition-colors duration-300
          group-hover:text-blue-600
        "
      >
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
      <span
        className="
          text-lg
          transition-transform duration-300
          group-hover:scale-110
        "
      >
        📞
      </span>
      {label}
    </a>
  );
}
