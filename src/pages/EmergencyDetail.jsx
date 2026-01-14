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
      className={`w-4 h-4 sm:w-5 sm:h-5 text-red-600 ${className}`}
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
      <main className="min-h-screen bg-slate-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
          <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            {t("Emergency.comingSoon", "Emergency Guide Coming Soon")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(
              "Emergency.notAvailable",
              "This emergency guide is not available yet."
            )}
          </p>
          <button
            onClick={() => navigate("/emergency")}
            className="text-blue-600 font-semibold"
          >
            ← {t("Emergency.back", "Back to Emergency Guides")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-20 sm:pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/emergency")}
          className="flex items-center gap-2 text-sm cursor-pointer sm:text-lg font-semibold text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("EmergencyDetails.EmergencyUI.back")}
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-orange-500" />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Urgency */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 ${
                card.urgency === "critical"
                  ? "bg-red-100 text-red-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {t(`Emergency.urgency.${card.urgency}`, card.urgency)}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {card.title}
            </h1>
            <p className="text-gray-500 mb-4">{card.subtitle}</p>

            {/* Emergency Callout */}
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
              <p className="text-red-800 text-sm sm:text-base">
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
            <h3 className="text-xl font-semibold mt-8 mb-3 flex items-center gap-2">
              <AlertIcon />
              {t("EmergencyDetails.EmergencyUI.recognize", "How to Recognize")}
            </h3>

            <ul className="space-y-3">
              {details.recognize?.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 bg-orange-50 border border-orange-100 p-3 rounded-xl"
                >
                  <AlertIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Steps */}
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mt-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                ⚡{" "}
                {t(
                  "EmergencyDetails.EmergencyUI.steps",
                  "Immediate Action Steps"
                )}
              </h3>

              <ol className="space-y-3">
                {details.steps?.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
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

            {/* Helplines */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="flex items-center gap-2 font-semibold text-red-700 mb-4">
                <Phone className="w-5 h-5" />
                {t("Emergency.helplinesTitle", "Emergency Helplines")}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {["108", "104", "102", "112"].map((n) => (
                  <a
                    key={n}
                    href={`tel:${n}`}
                    className="bg-red-600 text-white rounded-2xl py-4 text-center font-extrabold hover:bg-red-700 active:scale-95 transition"
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
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}

function Checklist({ title, items = [], type }) {
  const Icon = type === "do" ? CheckCircle2 : XCircle;
  const color = type === "do" ? "green" : "red";

  return (
    <div className="bg-gray-50 border rounded-xl p-4">
      <h4 className={`text-${color}-700 font-semibold mb-3`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <Icon className={`w-5 h-5 text-${color}-600`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
