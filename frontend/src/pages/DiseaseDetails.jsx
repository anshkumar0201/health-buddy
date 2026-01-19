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

  /* ---------------- Get disease (SAME PATTERN AS Diseases.jsx) ---------------- */
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
      <main className="min-h-[70vh] px-4 text-center justify-center flex flex-col items-center">
        <SearchX className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          {t("Diseases.noData.diseaseNotFound")}
        </h1>
        <p className="text-gray-600 max-w-md mb-6">
          {t("Diseases.noData.noDiseaseText")}
        </p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 underline mt-4 block text-lg font-semibold cursor-pointer"
          >
            {t("Diseases.backToDiseases")}
          </button>
          <button
            onClick={() => navigate("/symptom-checker")}
            className="text-blue-600 underline mt-4 block text-lg font-semibold cursor-pointer"
          >
            {t("Diseases.noData.checkSymptoms")}
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- Details page ---------------- */
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32 font-normal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg text-gray-500 cursor-pointer hover:text-black font-semibold hover:font-bold transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
          {t("Diseases.backToDiseases")}
        </button>

        <div className="border border-gray-200 rounded-2xl px-8 py-8 w-full bg-linear-to-r shadow-lg">
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
          <span className="inline-flex items-center mb-3 px-4 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-gray-900 to-gray-700 text-white shadow-sm">
            {disease.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {disease.name}
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-3xl mb-6">{disease.description}</p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              to="/symptom-checker"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-[0.97] transition-all duration-300 ease-out"
            >
              <Stethoscope className="w-4 h-4" />
              Take Assessment
            </Link>

            <Link
              to="/clinics"
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-[0.97] transition-all duration-200"
            >
              Find Clinics
            </Link>
          </div>

          {/* Common Symptoms */}
          <SectionCard title={t("Diseases.commonSymptoms")} icon={<Info />}>
            <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
              {disease.symptoms.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
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
              <p className="text-sm text-gray-700">{disease.causes}</p>
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
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Prevention Tips */}
          {disease.prevention_tips?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm hover:shadow-[0_10px_25px_-10px_rgba(34,197,94,0.35)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 text-green-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                {t("Diseases.preventionTips")}
              </div>

              <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
                {disease.prevention_tips.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to Seek Help */}
          {disease.when_to_seek_help && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm hover:shadow-[0_10px_25px_-10px_rgba(239,68,68,0.35)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-2 text-red-700 font-semibold">
                <AlertTriangle className="w-5 h-5" />
                {t("Diseases.seekHelp")}
              </div>

              <p className="text-sm text-red-700">
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
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
        <span className="text-blue-600">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
