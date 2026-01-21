import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Check,
  Heart,
  Info,
  ArrowLeft,
  ArrowRight,
  Download,
  Stethoscope,
} from "lucide-react";

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const assessment = i18n.getResource(
    i18n.language,
    "translation",
    `assessments.data.${location.state.disease}`,
  );

  if (!location.state) {
    navigate("/symptom-checker", { replace: true });
    return null;
  }

  const {
    title,
    score = 0,
    maxScore = 1,
    thresholds = { low: 0, moderate: 0, high: Infinity },
    recommendations = { low: [], moderate: [], high: [] },
    criticalHit = false,
  } = location.state;

  /* ---------- ROBUST RISK LOGIC ---------- */
  const percentage = Math.round((score / maxScore) * 100);

  let riskKey = "low";
  let theme = "green";

  if (criticalHit) {
    riskKey = "high";
    theme = "red";
  } else if (score >= thresholds.high || percentage >= 70) {
    riskKey = "high";
    theme = "red";
  } else if (score >= thresholds.moderate || percentage >= 40) {
    riskKey = "moderate";
    theme = "yellow";
  }

  const showEmergencyBanner = criticalHit || riskKey === "high";

  /* UPDATED THEMES FOR DARK MODE:
     - Light Mode: Uses pastel backgrounds (e.g., bg-green-200)
     - Dark Mode: Uses transparent dark backgrounds (e.g., dark:bg-green-900/30) 
       to avoid "neon" eyesores.
  */
  const themes = {
    green: {
      bg: "bg-green-200 dark:bg-green-900/30",
      border: "border-green-300 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      badge:
        "bg-green-300 text-green-900 dark:bg-green-800 dark:text-green-100",
      icon: "text-green-700 dark:text-green-400",
    },
    yellow: {
      bg: "bg-yellow-200 dark:bg-yellow-900/30",
      border: "border-yellow-300 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-200",
      badge:
        "bg-yellow-300 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100",
      icon: "text-yellow-700 dark:text-yellow-400",
    },
    red: {
      bg: "bg-red-200 dark:bg-red-900/30",
      border: "border-red-300 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      badge: "bg-red-300 text-red-900 dark:bg-red-800 dark:text-red-100",
      icon: "text-red-700 dark:text-red-400",
    },
  };

  const themeStyles = themes[theme];
  const advice = assessment?.recommendations?.[riskKey] || [];
  const rawNextSteps = t(
    `AssessmentResult.nextSteps.${criticalHit ? "emergency" : riskKey}`,
    { returnObjects: true },
  );

  const nextSteps = Array.isArray(rawNextSteps) ? rawNextSteps : [];

  return (
    // DARK MODE: Main background transitions
    <main
      className="min-h-screen pt-10 pb-32 transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-6xl mx-auto px-4 print-area">
        {/* Home Button */}
        <button
          onClick={() => navigate("/symptom-checker")}
          className="flex items-center gap-2 text-lg font-semibold transition mb-4 cursor-pointer
            text-gray-500 hover:text-black hover:font-bold
            dark:text-gray-400 dark:hover:text-white"
          aria-label="Go to Home"
        >
          <Stethoscope className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          {t("AssessmentResult.backToSymptomChecker")}
        </button>

        {/* Main Card Container */}
        <div
          className="rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-300
          bg-white border-gray-200
          dark:bg-[#1e293b] dark:border-gray-700 dark:shadow-gray-800"
        >
          {/* Header (Dynamic Color) */}
          <div
            className={`${themeStyles.bg} border-b ${themeStyles.border} p-4 sm:p-6 flex items-start justify-between gap-4 transition-colors duration-300`}
          >
            <div className="min-w-0">
              {/* Force dark text in header for light mode, light text for dark mode handled by themeStyles if needed, 
                  but usually headers in colored boxes need specific contrast. 
                  Here we use gray-900/white for the Title to ensure readability. */}
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl leading-snug wrap-break-word transition-colors duration-300 text-gray-900 dark:text-gray-300">
                {assessment?.title} {t("AssessmentResult.assessment")}
              </h1>
              <p className="text-sm mt-1 transition-colors duration-300 text-gray-700 dark:text-gray-300">
                {t("AssessmentResult.completedOn")}{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <Check
              className={`w-10 font-bold h-10 shrink-0 ${themeStyles.icon}`}
            />
          </div>

          {/* 🚨 Emergency Banner */}
          {showEmergencyBanner && (
            <div
              className="mx-2 sm:mx-6 mt-6 rounded-2xl border p-5 flex gap-4 transition-colors duration-300
              bg-red-50 border-red-300 
              dark:bg-red-900/20 dark:border-red-800"
            >
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base mb-1 transition-colors duration-300 text-red-700 dark:text-red-300">
                  {criticalHit
                    ? t("AssessmentResult.emergency.title")
                    : t(
                        "AssessmentResult.highRisk.title",
                        "High Risk Detected",
                      )}
                </h3>

                <p className="text-sm leading-relaxed transition-colors duration-300 text-red-700 dark:text-red-200">
                  {criticalHit
                    ? t("AssessmentResult.emergency.message")
                    : t(
                        "AssessmentResult.highRisk.message",
                        "Your responses indicate a high health risk. Prompt medical consultation is strongly advised.",
                      )}
                </p>
              </div>
            </div>
          )}

          {/* Risk Card */}
          <div
            className={`m-6 p-6 rounded-xl border transition-colors duration-300 ${themeStyles.border} ${themeStyles.bg}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
                  {t("AssessmentResult.riskAssessment")}
                </h2>
                <p className={`${themeStyles.text} text-sm font-medium`}>
                  {t("AssessmentResult.score")} {score}/{maxScore} ({percentage}
                  %)
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${themeStyles.badge}`}
              >
                {t(`AssessmentResult.riskLevels.${riskKey}`)}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="px-10 mt-8">
            <h3 className="font-bold text-lg flex items-center gap-2 transition-colors duration-300 text-gray-900 dark:text-white">
              <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {t("AssessmentResult.recommendations")}
            </h3>

            <ul className="mt-4 space-y-3">
              {advice.length > 0 ? (
                advice.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <Check className="w-4 h-4 mt-1 text-green-600 dark:text-green-400" />
                    <span className="text-sm transition-colors duration-300 text-gray-700 dark:text-gray-300">
                      {rec}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm transition-colors duration-300 text-gray-600 dark:text-gray-400">
                  {t("AssessmentResult.generalAdvice")}
                </li>
              )}
            </ul>
          </div>

          {/* Next Steps - DARK MODE: Transparent Blue */}
          <div
            className="m-6 p-5 rounded-xl border transition-colors duration-300
            bg-blue-50 border-blue-200 
            dark:bg-blue-900/20 dark:border-blue-800"
          >
            <div className="flex gap-3 mb-3">
              <Info className="w-5 h-5 mt-1 shrink-0 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold transition-colors duration-300 text-blue-800 dark:text-blue-200">
                {t("AssessmentResult.nextStepsTitle", "Next Steps")}
              </h3>
            </div>

            <ul className="space-y-3 pl-8">
              {nextSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start text-sm transition-colors duration-300 text-blue-700 dark:text-blue-100"
                >
                  <span className="mt-0.5 w-5 h-5 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center mt-6 px-10 transition-colors duration-300 text-gray-500 dark:text-gray-400">
            {t("AssessmentResult.disclaimer")}
          </p>

          {/* Actions */}
          <div className="grid sm:grid-cols-3 gap-4 px-8 mt-6 mb-8">
            <button
              onClick={() => navigate("/symptom-checker")}
              className="rounded-xl border py-3 cursor-pointer font-semibold transition-colors duration-300
                border-gray-200 text-gray-700 hover:bg-gray-50
                dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              {t("AssessmentResult.actions.newAssessment")}
            </button>

            <button
              onClick={() => window.print()}
              className="rounded-xl border cursor-pointer py-3 font-semibold transition-colors duration-300
                border-gray-200 text-gray-700 hover:bg-gray-50
                dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              {t("AssessmentResult.actions.download")}
              <Download className="inline w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => navigate("/clinics")}
              className="rounded-xl py-3 font-semibold cursor-pointer transition-colors duration-300
                bg-black text-white hover:bg-gray-900
                dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t("AssessmentResult.actions.findClinics")}
              <ArrowRight className="inline w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
