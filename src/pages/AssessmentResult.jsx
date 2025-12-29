import { useLocation, useNavigate } from "react-router-dom";
import { Check, Heart, AlertTriangle } from "lucide-react";

export default function AssessmentResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/symptom-checker");
    return null;
  }

  const { disease, score } = state;

  const risk =
    score >= 30
      ? { label: "HIGH RISK", color: "red", bg: "red-50", border: "red-300" }
      : score >= 15
      ? { label: "MODERATE RISK", color: "yellow", bg: "yellow-50", border: "yellow-300" }
      : { label: "LOW RISK", color: "green", bg: "green-50", border: "green-300" };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">

          {/* Header */}
          <div className={`p-6 bg-${risk.bg}`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{disease} Assessment</h1>
                <p className="text-sm text-gray-600">
                  Completed on {new Date().toLocaleDateString()}
                </p>
              </div>
              <Check className={`w-8 h-8 text-${risk.color}-600`} />
            </div>
          </div>

          {/* Risk Card */}
          <div className={`m-6 rounded-xl border border-${risk.border} bg-${risk.bg} p-5`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Risk Assessment</p>
                <p className="text-sm">Score: {score} points</p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg font-bold text-${risk.color}-700 border border-${risk.border}`}
              >
                {risk.label}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="px-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              Recommendations
            </h2>

            <ul className="space-y-2 text-sm">
              {risk.label === "HIGH RISK" && (
                <>
                  <li>✔ Consult a healthcare professional immediately</li>
                  <li>✔ Visit the nearest clinic or emergency helpline</li>
                </>
              )}

              {risk.label === "MODERATE RISK" && (
                <>
                  <li>✔ Schedule a doctor appointment</li>
                  <li>✔ Monitor symptoms closely</li>
                </>
              )}

              {risk.label === "LOW RISK" && (
                <>
                  <li>✔ Maintain a healthy lifestyle</li>
                  <li>✔ Follow prevention tips</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-6 flex gap-4">
            <button
              onClick={() => navigate("/symptom-checker")}
              className="flex-1 border rounded-xl py-3"
            >
              ← New Assessment
            </button>

            <button
              onClick={() => navigate("/clinics")}
              className="flex-1 bg-black text-white rounded-xl py-3"
            >
              Find Nearby Clinics →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
