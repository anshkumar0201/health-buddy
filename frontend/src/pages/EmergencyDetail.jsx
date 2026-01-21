import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle, Phone } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ---------- Icons ---------- */

function AlertIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500 ${className}`}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function EmergencyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = t("Emergency.cards", { returnObjects: true }) || [];
  const card = cards.find((c) => c.id === slug);

  const details = t(`EmergencyDetails.${slug}`, {
    returnObjects: true,
    defaultValue: null,
  });

  if (process.env.NODE_ENV === "development") {
    if (!details || !details.steps?.length) {
      console.warn("Missing EmergencyDetails for:", slug);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!card || !details) {
    return (
      <main className="min-h-screen bg-slate-50 pt-10 px-4 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center dark:bg-[#1e293b]">
          <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 dark:text-white">
            {t("Emergency.comingSoon", "Emergency Guide Coming Soon")}
          </h2>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            {t(
              "Emergency.notAvailable",
              "This emergency guide is not available yet.",
            )}
          </p>
          <button
            onClick={() => navigate("/emergency")}
            className="text-blue-600 font-semibold dark:text-blue-400"
          >
            ← {t("Emergency.back", "Back to Emergency Guides")}
          </button>
        </div>
      </main>
    );
  }

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b
    // DARK MODE: Main background slate-950/900
    <main
      className="min-h-screen pt-10 pb-24 transition-colors duration-300
      bg-slate-50 
      dark:bg-slate-900"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/emergency")}
          className="flex items-center gap-2 text-sm cursor-pointer sm:text-lg font-semibold mb-4 hover:font-bold transition-colors duration-200
            text-gray-600 hover:text-black
            dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("EmergencyDetails.EmergencyUI.back")}
        </button>

        {/* Content Card */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden transition-colors duration-300
          bg-white 
          dark:bg-[#1e293b] dark:border dark:border-gray-700 dark:shadow-gray-700"
        >
          <div className="h-2 bg-orange-500" />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Urgency */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 ${
                card.urgency === "critical"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
              }`}
            >
              {t(`Emergency.urgency.${card.urgency}`, card.urgency)}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
              {card.title}
            </h1>
            <p className="mb-4 transition-colors duration-300 text-gray-500 dark:text-gray-400">
              {card.subtitle}
            </p>

            {/* Emergency Callout - DARK MODE: Transparent Red */}
            <div
              className="flex gap-3 rounded-lg p-4 mb-6 border transition-colors duration-300
              bg-red-50 border-red-200 
              dark:bg-red-900/20 dark:border-red-900"
            >
              <AlertTriangle className="w-5 h-5 mt-1 text-red-600 dark:text-red-500" />
              <p className="text-sm sm:text-base transition-colors duration-300 text-red-800 dark:text-red-200">
                <strong>{t("EmergencyDetails.EmergencyUI.callFirst")}</strong>
                <br />
                {t("EmergencyDetails.EmergencyUI.dial")} <strong>108</strong> /{" "}
                <strong>112</strong>
              </p>
            </div>

            {/* About */}
            <Section title={t("EmergencyDetails.EmergencyUI.about")}>
              {details.about}
            </Section>

            {/* Recognize */}
            <h3 className="text-xl font-semibold mt-8 mb-3 flex items-center gap-2 transition-colors duration-300 text-gray-900 dark:text-white">
              <AlertIcon />
              {t("EmergencyDetails.EmergencyUI.recognize", "How to Recognize")}
            </h3>

            <ul className="space-y-3">
              {details.recognize?.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 border p-3 rounded-xl transition-colors duration-300
                    bg-orange-50 border-orange-100 
                    dark:bg-orange-900/20 dark:border-orange-900 dark:text-gray-200"
                >
                  <AlertIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Steps - DARK MODE: Transparent Blue */}
            <div
              className="border-2 p-6 rounded-xl mt-8 transition-colors duration-300
              bg-blue-50 border-blue-200 
              dark:bg-blue-900/20 dark:border-blue-800"
            >
              <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 text-blue-900 dark:text-blue-200">
                ⚡{" "}
                {t(
                  "EmergencyDetails.EmergencyUI.steps",
                  "Immediate Action Steps",
                )}
              </h3>

              <ol className="space-y-3">
                {details.steps?.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 transition-colors duration-300 text-gray-900 dark:text-gray-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold dark:bg-blue-500">
                      {i + 1}
                    </div>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* DO / DON'T */}
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <Checklist
                title={t("EmergencyDetails.EmergencyUI.do", "DO")}
                items={details.dos}
                type="do"
              />
              <Checklist
                title={t("EmergencyDetails.EmergencyUI.dont", "DON'T")}
                items={details.donts}
                type="dont"
              />
            </div>

            {/* Helplines - DARK MODE: Transparent Red */}
            <div
              className="mt-8 border rounded-xl p-5 transition-colors duration-300
              bg-red-50 border-red-200 
              dark:bg-red-900/20 dark:border-red-900"
            >
              <p className="flex items-center gap-2 font-semibold mb-4 transition-colors duration-300 text-red-700 dark:text-red-400">
                <Phone className="w-5 h-5" />
                {t("Emergency.helplinesTitle", "Emergency Helplines")}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {["108", "104", "102", "112"].map((n) => (
                  <a
                    key={n}
                    href={`tel:${n}`}
                    className="rounded-2xl py-4 text-center font-extrabold transition active:scale-95
                      bg-red-600 text-white hover:bg-red-700
                      dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    <Phone className="mx-auto mb-1" />
                    {n}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2 transition-colors duration-300 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="transition-colors duration-300 text-gray-700 dark:text-gray-300">
        {children}
      </p>
    </div>
  );
}

function Checklist({ title, items = [], type }) {
  const Icon = type === "do" ? CheckCircle2 : XCircle;
  const colorClass =
    type === "do"
      ? "text-green-700 dark:text-green-400"
      : "text-red-700 dark:text-red-400";

  const iconClass =
    type === "do"
      ? "text-green-600 dark:text-green-500"
      : "text-red-600 dark:text-red-500";

  return (
    <div
      className="border rounded-xl p-4 transition-colors duration-300
      bg-gray-50 border-gray-200 
      dark:bg-slate-800 dark:border-gray-700"
    >
      <h4 className={`font-semibold mb-3 ${colorClass}`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 transition-colors duration-300 text-gray-700 dark:text-gray-300"
          >
            <Icon className={`w-5 h-5 ${iconClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
