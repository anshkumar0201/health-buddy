import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
  Stethoscope,
  SearchX,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DiseaseDetails() {
  const { name: id } = useParams();

  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ---------------- Get disease ---------------- */
  const disease = useMemo(() => {
    const items = t("Diseases.items", {
      returnObjects: true,
      defaultValue: {},
    });

    if (!items || !items[id]) return null;

    return {
      id,
      ...items[id],
    };
  }, [id, t]);

  /* ---------------- Not found ---------------- */
  if (!disease) {
    return (
      <main className="min-h-[70vh] px-4 text-center justify-center flex flex-col items-center dark:bg-slate-900">
        <SearchX className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          {t("Diseases.noData.diseaseNotFound")}
        </h1>
        <p className="text-gray-600 max-w-md mb-6 dark:text-gray-300">
          {t("Diseases.noData.noDiseaseText")}
        </p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 underline mt-4 block text-lg font-semibold cursor-pointer dark:text-blue-400"
          >
            {t("Diseases.backToDiseases")}
          </button>
          <button
            onClick={() => navigate("/symptom-checker")}
            className="text-blue-600 underline mt-4 block text-lg font-semibold cursor-pointer dark:text-blue-400"
          >
            {t("Diseases.noData.checkSymptoms")}
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- Details page ---------------- */
  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b
    // DARK MODE: Main background slate-950/900
    <main
      className="min-h-screen pt-10 pb-32 font-normal transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold transition-colors duration-200 mb-4 cursor-pointer
            text-gray-500 hover:text-black hover:font-bold
            dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
          {t("Diseases.backToDiseases")}
        </button>

        {/* Main Content Card */}
        <div
          className="rounded-2xl px-8 py-8 w-full shadow-lg border transition-colors duration-300
          bg-white border-gray-200
          dark:bg-[#1e293b] dark:border-gray-700"
        >
          {/* Hero Image */}
          {disease.image_url && (
            <div className="w-full h-56 rounded-2xl overflow-hidden mb-8 shadow-md hover:shadow-xl transition-all duration-300 ease-out">
              <img
                src={disease.image_url}
                alt={disease.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            </div>
          )}

          {/* Category */}
          <span className="inline-flex items-center mb-3 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-sm dark:from-blue-600 dark:to-blue-800">
            {disease.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-300 transition-colors duration-300">
            {disease.name}
          </h1>

          {/* Description - Dark mode text gray-300 */}
          <p className="max-w-3xl mb-6 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {disease.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              to="/symptom-checker"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-[0.97] transition-all duration-300 ease-out"
            >
              <Stethoscope className="w-4 h-4" />
              {t("Diseases.takeAssessment")}
            </Link>

            <Link
              to="/clinics"
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl border font-medium shadow-sm active:scale-[0.97] transition-all duration-200
                border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:shadow-md
                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
            >
              {t("Diseases.findClinics")}
            </Link>
          </div>

          {/* Common Symptoms */}
          <SectionCard title={t("Diseases.commonSymptoms")} icon={<Info />}>
            <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
              {disease.symptoms.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm transition-colors duration-200
                    text-gray-700 hover:text-gray-900
                    dark:text-gray-300 dark:hover:text-white"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {s}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Causes */}
          {disease.causes && (
            <SectionCard
              title={t("Diseases.causes")}
              icon={<AlertTriangle className="text-orange-500" />}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {disease.causes}
              </p>
            </SectionCard>
          )}

          {/* Risk Factors */}
          {disease.risk_factors?.length > 0 && (
            <SectionCard
              title={t("Diseases.riskFactors")}
              icon={<AlertTriangle className="text-red-500" />}
            >
              <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
                {disease.risk_factors.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Prevention Tips - DARK MODE: Transparent Green Bg */}
          {disease.prevention_tips?.length > 0 && (
            <div
              className="mt-6 rounded-2xl border p-6 shadow-sm transition-all duration-300
              bg-green-50 border-green-200 hover:shadow-[0_10px_25px_-10px_rgba(34,197,94,0.35)]
              dark:bg-green-900/20 dark:border-green-800"
            >
              <div className="flex items-center gap-2 mb-4 font-semibold text-green-700 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                {t("Diseases.preventionTips")}
              </div>

              <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
                {disease.prevention_tips.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to Seek Help - DARK MODE: Transparent Red Bg */}
          {disease.when_to_seek_help && (
            <div
              className="mt-6 rounded-2xl border p-6 shadow-sm transition-all duration-300
              bg-red-50 border-red-200 hover:shadow-[0_10px_25px_-10px_rgba(239,68,68,0.35)]
              dark:bg-red-900/20 dark:border-red-800"
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-red-700 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                {t("Diseases.seekHelp")}
              </div>

              <p className="text-sm text-red-700 dark:text-red-300">
                {disease.when_to_seek_help}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------- Reusable Section Card ---------- */
function SectionCard({ title, icon, children }) {
  return (
    <div
      className="mt-6 rounded-2xl border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out
      bg-white border-gray-200
      dark:bg-[#1e293b] dark:border-gray-700 dark:hover:shadow-gray-700/50"
    >
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900 dark:text-white">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}