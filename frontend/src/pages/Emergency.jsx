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
          <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("Emergency.title")}
        </h1>

        <p className="text-center mt-3 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-300">
          {t("Emergency.subtitle")}
        </p>

        {/* Helplines - DARK MODE: Transparent red bg */}
        <div
          className="mt-10 max-w-4xl mx-auto rounded-xl border p-5 transition-colors duration-300
          bg-red-50 border-red-200 
          dark:bg-red-900/20 dark:border-red-900"
        >
          <p className="text-sm font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 text-red-700 dark:text-red-400">
            <Phone className="w-4 h-4" />
            {t("Emergency.helplinesTitle")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {helplines.map((number) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="rounded-lg py-3 text-center
                shadow transition-all duration-300 cursor-pointer
                hover:-translate-y-0.5 hover:shadow-xl
                bg-red-600 text-white hover:bg-red-700
                dark:bg-red-700 dark:hover:bg-red-600"
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
                  className="group rounded-2xl border
                           shadow-sm transition-all duration-300 cursor-pointer
                           hover:shadow-xl hover:-translate-y-1 overflow-hidden
                           bg-white border-gray-200
                           dark:bg-[#1e293b] dark:border-gray-700 dark:hover:border-red-500/50 dark:hover:shadow-gray-800"
                >
                  <div className="h-1 bg-red-600 w-full" />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-red-600 dark:text-red-500" />
                        <h3 className="font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
                          {e.title}
                        </h3>
                      </div>

                      <span
                        className="text-xs px-2 py-0.5 rounded-2xl font-semibold 
                        bg-red-100 text-red-600
                        dark:bg-red-900/40 dark:text-red-300"
                      >
                        {t(`Emergency.urgency.${e.urgency}`)}
                      </span>
                    </div>

                    <p className="text-xs mb-2 transition-colors duration-300 text-gray-500 dark:text-gray-400">
                      {e.subtitle}
                    </p>
                    <p className="text-sm mb-6 transition-colors duration-300 text-gray-600 dark:text-gray-300">
                      {e.description}
                    </p>

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        navigate(`/emergency/${e.id}`);
                      }}
                      className="w-full py-2 rounded-lg text-sm font-medium
                               border transition-all cursor-pointer
                               border-gray-200 text-gray-900 
                               group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600
                               dark:border-gray-600 dark:text-gray-200
                               dark:group-hover:bg-red-600 dark:group-hover:text-white"
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
