import {
  MapPin,
  Search,
  Hospital,
  Stethoscope,
  Building2,
  Ambulance,
  Pill,
  Microscope,
  Eye,
  Tooth,
  Baby,
  AlertTriangle,
} from "lucide-react";

export default function FindClinics() {
  const openMaps = (query) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      query + " near me"
    )}`;
    window.open(url, "_blank");
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
          <p className="text-green-800 text-sm font-medium">
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
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl
            font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition"
          >
            <Search className="w-5 h-5" />
            Search All Healthcare Facilities Near Me
          </button>
        </div>

        {/* Quick Search */}
        <h2 className="mt-14 text-lg font-semibold text-gray-900">
          Quick Search
        </h2>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QuickCard
            icon={<Hospital />}
            label="Hospitals Near Me"
            onClick={() => openMaps("Hospitals")}
          />
          <QuickCard
            icon={<Stethoscope />}
            label="Clinics Near Me"
            onClick={() => openMaps("Clinics")}
          />
          <QuickCard
            icon={<Building2 />}
            label="Government Hospitals"
            onClick={() => openMaps("Government hospital")}
          />
          <QuickCard
            icon={<Building2 />}
            label="Primary Health Centers"
            onClick={() => openMaps("Primary health center")}
          />
          <QuickCard
            icon={<Ambulance />}
            label="24/7 Emergency"
            onClick={() => openMaps("Emergency hospital")}
          />
          <QuickCard
            icon={<Pill />}
            label="Pharmacies"
            onClick={() => openMaps("Pharmacy")}
          />
          <QuickCard
            icon={<Microscope />}
            label="Diagnostic Labs"
            onClick={() => openMaps("Diagnostic laboratory")}
          />
          <QuickCard
            icon={<Eye />}
            label="Eye Clinics"
            onClick={() => openMaps("Eye clinic")}
          />
          <QuickCard
            icon={<Tooth />}
            label="Dental Clinics"
            onClick={() => openMaps("Dental clinic")}
          />
          <QuickCard
            icon={<Baby />}
            label="Maternity Hospitals"
            onClick={() => openMaps("Maternity hospital")}
          />
        </div>

        {/* Emergency */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 text-left">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-4">
            <AlertTriangle className="w-5 h-5" />
            Emergency Services
          </div>

          <p className="text-red-700 text-sm mb-4">
            In case of emergency, call these helplines immediately:
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <EmergencyBadge label="108 - Ambulance" />
            <EmergencyBadge label="104 - Health Helpline" />
            <EmergencyBadge label="102 - Emergency" />
          </div>

          <button
            onClick={() => openMaps("Emergency hospital")}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium
            hover:bg-red-700 transition"
          >
            Find Emergency Hospital Near Me
          </button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small Components ---------- */

function QuickCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border rounded-xl p-4 text-sm font-medium
      flex flex-col items-center gap-2
      hover:shadow-md hover:border-blue-400 transition cursor-pointer"
    >
      <div className="text-xl">{icon}</div>
      {label}
    </button>
  );
}

function EmergencyBadge({ label }) {
  return (
    <span className="px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm bg-white">
      📞 {label}
    </span>
  );
}
