import { useState } from "react";
import {
  MessageSquare,
  Info,
  Sparkles,
  Search,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- RULES (JSON-STYLE) ---------------- */

const SYMPTOM_RULES = {
  high: {
    label: "High",
    color: "red",
    keywords: ["fever", "vomiting", "confusion", "stiff neck", "severe"],
    description:
      "The combination of your symptoms may indicate a serious condition that requires prompt medical evaluation.",
    advice:
      "Monitor your symptoms closely. If they persist, worsen, or you develop new symptoms such as confusion or stiff neck, seek immediate medical attention.",
  },
  moderate: {
    label: "Moderate",
    color: "yellow",
    keywords: ["headache", "nausea", "fatigue", "body ache"],
    description:
      "Your symptoms suggest a condition that should be monitored and assessed.",
    advice:
      "Rest, stay hydrated, and consider consulting a healthcare professional if symptoms persist.",
  },
  low: {
    label: "Low",
    color: "green",
    keywords: ["cold", "cough", "runny nose", "sore throat"],
    description:
      "Your symptoms appear mild and are often manageable at home.",
    advice:
      "Continue monitoring your symptoms and follow general wellness practices.",
  },
};

const SUGGESTED_CONDITIONS = [
  {
    name: "Viral Infection (e.g., Influenza or COVID-19)",
    tag: "Infectious Diseases",
    description:
      "Common causes of headache and fever, especially during cold and flu season.",
  },
  {
    name: "Bacterial Sinusitis",
    tag: "Respiratory Conditions",
    description:
      "Headache combined with fever could indicate a sinus infection.",
  },
  {
    name: "Meningitis",
    tag: "Neurological Conditions",
    description:
      "Headache with fever can be symptoms of meningitis, requiring urgent care.",
  },
  {
    name: "Tension Headache",
    tag: "Headaches",
    description:
      "Stress-related headaches that may overlap with mild systemic symptoms.",
  },
  {
    name: "Cluster Headache",
    tag: "Headaches",
    description:
      "Severe headache pain that can sometimes be confused with other conditions.",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function SymptomAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const analyzeSymptoms = () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const input = text.toLowerCase();

      let level = "low";
      if (SYMPTOM_RULES.high.keywords.some(k => input.includes(k))) {
        level = "high";
      } else if (
        SYMPTOM_RULES.moderate.keywords.some(k => input.includes(k))
      ) {
        level = "moderate";
      }

      setResult(SYMPTOM_RULES[level]);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Symptom Analyzer
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Describe how you're feeling and we'll suggest which conditions to check
        </p>

        {/* How it works */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-blue-800 text-sm">
            <span className="font-medium block mb-1">How it works</span>
            Describe your symptoms in your own words. Our system analyzes them
            and suggests relevant health checks.
          </p>
        </div>

        {/* Input */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">
              Describe Your Symptoms
            </h2>
          </div>

          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            placeholder="Example: headache and fever since last 2 days"
          />

          <button
            onClick={analyzeSymptoms}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-medium transition-all hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze My Symptoms"}
            {!loading && <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <>
            {/* Urgency */}
            <div className={`mt-10 rounded-xl border px-5 py-4 flex gap-3
              ${
                result.color === "red"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : result.color === "yellow"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Urgency Level: {result.label}
                </p>
                <p className="text-sm mt-1">{result.description}</p>
              </div>
            </div>

            {/* Immediate Advice */}
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800">
                  Immediate Advice
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {result.advice}
                </p>
              </div>
            </div>

            {/* Suggested Conditions */}
            <h3 className="mt-10 font-bold text-lg text-gray-900">
              Suggested Conditions to Check
            </h3>

            <div className="mt-4 space-y-4">
              {SUGGESTED_CONDITIONS.map((c, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-5 shadow-sm flex justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {c.name}
                      <span className="ml-2 text-xs px-2 py-0.5 border rounded">
                        {c.tag}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {c.description}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="h-fit flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Check <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-500 flex items-center gap-2">
              <Info size={14} />
              This is not a diagnosis. Please consult a healthcare professional.
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/symptom-checker")}
                className="flex-1 bg-black text-white py-2.5 rounded-lg hover:bg-gray-900"
              >
                Go to Symptom Checker →
              </button>
              <button
                onClick={() => navigate("/clinics")}
                className="flex-1 border py-2.5 rounded-lg hover:bg-gray-100"
              >
                Find Nearby Clinics
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
