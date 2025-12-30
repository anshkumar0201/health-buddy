import { useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";
import diseasesHub from "@/data/diseases1.json";

export default function DiseaseDetails() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const disease = diseasesHub.find((d) => d.name === decodedName);

  if (!disease) {
    return (
      <main className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">Disease not found</h1>
        <Link to="/diseases" className="text-blue-600 underline mt-4 block">
          Back to Diseases
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32 font-normal">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back */}
        <Link
          to="/diseases"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Diseases
        </Link>

        {/* Hero Image — render ONLY if image_url exists */}
        {disease.image_url && (
          <div className="w-full h-56 rounded-2xl overflow-hidden mb-8">
            <img
              src={disease.image_url}
              alt={disease.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category */}
        <span className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-semibold bg-black text-white">
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
            className="
      flex-1 flex items-center justify-center gap-2
      px-6 py-3 rounded-xl
      bg-blue-600 text-white font-medium
      hover:bg-blue-800 transition
    "
          >
            <Stethoscope className="w-4 h-4" />
            Take Assessment
          </Link>

          <Link
            to="/clinics"
            className="
      flex-1 flex items-center justify-center
      px-6 py-3 rounded-xl
      border bg-white text-center font-medium
      hover:bg-gray-200 transition
    "
          >
            Find Clinics
          </Link>
        </div>

        {/* Common Symptoms */}
        <SectionCard title="Common Symptoms" icon={<Info />}>
          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
            {disease.symptoms.map((s, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700"
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
            title="Causes"
            icon={<AlertTriangle className="text-orange-500" />}
          >
            <p className="text-sm text-gray-700">{disease.causes}</p>
          </SectionCard>
        )}

        {/* Risk Factors */}
        {disease.risk_factors?.length > 0 && (
          <SectionCard
            title="Risk Factors"
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
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-2 mb-4 text-green-700 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Prevention Tips
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
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-2 mb-2 text-red-700 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              When to Seek Medical Help
            </div>

            <p className="text-sm text-red-700">{disease.when_to_seek_help}</p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Reusable Section Card ---------- */
function SectionCard({ title, icon, children }) {
  return (
    <div className="mt-6 rounded-2xl border bg-white p-6">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
