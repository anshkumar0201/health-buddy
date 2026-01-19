import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Phone,
  Zap,
  Droplet,
  Flame,
  HeartPulse,
  Brain,
  Wind,
} from "lucide-react";

/* ---------- Icons ---------- */

const ICONS = {
  droplet: Droplet,
  flame: Flame,
  brain: Brain,
  heart: HeartPulse,
  wind: Wind,
  zap: Zap,
};

/* ---------- Helplines ---------- */

const helplines = ["108", "104", "102", "112"];

/* ---------- Component ---------- */

export default function Emergency() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const emergencies = t("Emergency.cards", {
    returnObjects: true,
    defaultValue: [],
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("Emergency.title")}
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          {t("Emergency.subtitle")}
        </p>

        {/* Helplines */}
        <div className="mt-10 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t("Emergency.helplinesTitle")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {helplines.map((number) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="bg-red-600 text-white rounded-lg py-3 text-center
               shadow transition-all duration-300 cursor-pointer
               hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                <p className="text-lg font-bold">{number}</p>
                <p className="text-xs opacity-90">
                  {t(`Emergency.helplines.${number}`)}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(emergencies) &&
            emergencies.map((e) => {
              const Icon = ICONS[e.icon] || AlertCircle;

              return (
                <div
                  key={e.id}
                  onClick={() => navigate(`/emergency/${e.id}`)}
                  className="group bg-white rounded-2xl border border-gray-200
                           shadow-sm transition-all duration-300 cursor-pointer
                           hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="h-1 bg-red-600 w-full" />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-red-600" />
                        <h3 className="font-bold text-gray-900">{e.title}</h3>
                      </div>

                      <span className="text-xs px-2 py-0.5 rounded-2xl font-semibold bg-red-100 text-red-600">
                        {t(`Emergency.urgency.${e.urgency}`)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">{e.subtitle}</p>
                    <p className="text-sm text-gray-600 mb-6">
                      {e.description}
                    </p>

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        navigate(`/emergency/${e.id}`);
                      }}
                      className="w-full py-2 rounded-lg text-sm font-medium
                               border border-gray-200 transition-all cursor-pointer
                               group-hover:bg-red-600 group-hover:text-white"
                    >
                      {t("Emergency.viewGuide")}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
