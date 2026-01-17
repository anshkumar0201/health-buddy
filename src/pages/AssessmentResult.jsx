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
  const { t } = useTranslation();

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

  const themes = {
    green: {
      bg: "bg-green-200",
      border: "border-green-300",
      text: "text-green-700",
      badge: "bg-green-300 text-green-900",
      icon: "text-green-700",
    },
    yellow: {
      bg: "bg-yellow-200",
      border: "border-yellow-300",
      text: "text-yellow-700",
      badge: "bg-yellow-300 text-yellow-900",
      icon: "text-yellow-700",
    },
    red: {
      bg: "bg-red-200",
      border: "border-red-300",
      text: "text-red-700",
      badge: "bg-red-300 text-red-900",
      icon: "text-red-700",
    },
  };

  const themeStyles = themes[theme];
  const advice = recommendations[riskKey] || [];
  const rawNextSteps = t(
    `AssessmentResult.nextSteps.${criticalHit ? "emergency" : riskKey}`,
    { returnObjects: true }
  );

  const nextSteps = Array.isArray(rawNextSteps) ? rawNextSteps : [];


  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-4xl mx-auto px-4 print-area">
        {/* Home Button */}
        <button
          onClick={() => navigate("/symptom-checker")}
          className="flex items-center gap-2 text-lg text-gray-500
            hover:text-gray-950 font-semibold transition mb-6 cursor-pointer"
          aria-label="Go to Home"
        >
          <Stethoscope className="w-6 h-6 text-gray-700" />
          {t("AssessmentResult.backToSymptomChecker")}
        </button>

        <div className="bg-white rounded-2xl border overflow-hidden shadow-2xl">
          {/* Header */}
          <div
            className={`${themeStyles.bg} border ${themeStyles.border} p-4 sm:p-6 flex items-start justify-between gap-4`}
          >
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-snug wrap-break-word">
                {title} {t("AssessmentResult.assessment")}
              </h1>
              <p className="text-sm text-gray-700 mt-1">
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
            <div className="mx-2 sm:mx-6 mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 flex gap-4">
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-red-600"
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
                <h3 className="font-bold text-red-700 text-sm sm:text-base mb-1">
                  {criticalHit
                    ? t("AssessmentResult.emergency.title")
                    : t(
                        "AssessmentResult.highRisk.title",
                        "High Risk Detected"
                      )}
                </h3>

                <p className="text-sm text-red-700 leading-relaxed">
                  {criticalHit
                    ? t("AssessmentResult.emergency.message")
                    : t(
                        "AssessmentResult.highRisk.message",
                        "Your responses indicate a high health risk. Prompt medical consultation is strongly advised."
                      )}
                </p>
              </div>
            </div>
          )}

          {/* Risk Card */}
          <div
            className={`m-6 p-6 rounded-xl border ${themeStyles.border} ${themeStyles.bg}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold">
                  {t("AssessmentResult.riskAssessment")}
                </h2>
                <p className={`${themeStyles.text} text-sm`}>
                  {t("AssessmentResult.score")} {score}/{maxScore} ({percentage}
                  %)
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg font-bold ${themeStyles.badge}`}
              >
                {t(`AssessmentResult.riskLevels.${riskKey}`)}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="px-10 mt-8">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              {t("AssessmentResult.recommendations")}
            </h3>

            <ul className="mt-4 space-y-3">
              {advice.length > 0 ? (
                advice.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <Check className="w-4 h-4 text-green-600 mt-1" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-600">
                  {t("AssessmentResult.generalAdvice")}
                </li>
              )}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="m-6 p-5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex gap-3 mb-3">
              <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
              <h3 className="font-semibold text-blue-800">
                {t("AssessmentResult.nextStepsTitle", "Next Steps")}
              </h3>
            </div>

            <ul className="space-y-3 pl-8">
              {nextSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start text-sm text-blue-700"
                >
                  <span className="mt-0.5 w-5 h-5 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-blue-600" />
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-gray-500 mt-6 px-10">
            {t("AssessmentResult.disclaimer")}
          </p>

          {/* Actions */}
          <div className="grid sm:grid-cols-3 gap-4 px-8 mt-6 mb-8">
            <button
              onClick={() => navigate("/symptom-checker")}
              className="rounded-xl border py-3 cursor-pointer font-semibold"
            >
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              {t("AssessmentResult.actions.newAssessment")}
            </button>

            <button
              onClick={() => window.print()}
              className="rounded-xl border  cursor-pointer  py-3 font-semibold"
            >
              {t("AssessmentResult.actions.download")}
              <Download className="inline w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => navigate("/clinics")}
              className="rounded-xl bg-black text-white py-3 font-semibold cursor-pointer"
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
