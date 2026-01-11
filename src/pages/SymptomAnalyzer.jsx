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
import { useTranslation } from "react-i18next";
import rules from "@/data/symptomRules.json";
import suggestedConditions from "@/data/suggestedConditions.json";

/* ---------------- COMPONENT ---------------- */

export default function SymptomAnalyzer() {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const charCount = text.trim().length;
  const MIN_CHARS = 30;

  /* ---------- Production-level input validation ---------- */
  const isMeaningfulInput = (input) => {
    const text = input.toLowerCase().trim();
    const words = text.split(/\s+/);

    if (words.length < 4) return false;

    const medicalKeywords = Object.keys(rules.symptomScores);

    const STOP_WORDS = new Set([
      "and",
      "or",
      "but",
      "since",
      "for",
      "from",
      "with",
      "without",
      "last",
      "days",
      "see",
      "feeling",
      "having",
      "pain",
      "problem",
      "is",
      "am",
      "are",
      "was",
      "were",
      "been",
      "to",
      "of",
      "in",
    ]);

    let medicalWordCount = 0;
    let unknownWordCount = 0;
    let meaningfulWordCount = 0;

    for (const word of words) {
      const clean = word.replace(/[^a-z]/gi, "");
      if (!clean) continue;

      if (medicalKeywords.some((k) => clean.includes(k))) {
        medicalWordCount++;
        meaningfulWordCount++;
        continue;
      }

      if (STOP_WORDS.has(clean)) continue;

      const hasVowel = /[aeiou]/i.test(clean);
      if (!hasVowel && clean.length > 4) {
        unknownWordCount++;
        continue;
      }

      meaningfulWordCount++;
    }

    const medicalRatio = medicalWordCount / words.length;
    const unknownRatio = unknownWordCount / words.length;

    if (medicalRatio < 0.25) return false;
    if (unknownRatio > 0.4) return false;
    if (meaningfulWordCount < 2) return false;

    return true;
  };

  const analyzeSymptoms = () => {
    if (!text.trim() || charCount < MIN_CHARS) return;

    if (!isMeaningfulInput(text.toLowerCase())) {
      setResult({
        isInvalidInput: true,
        color: "yellow",
        label: "Input unclear",
        description: "We couldn’t understand your symptoms clearly.",
        conditions: [],
      });
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const input = text.toLowerCase();
      let score = 0;

      Object.entries(rules.symptomScores).forEach(([keyword, value]) => {
        if (input.includes(keyword)) score += value;
      });

      const urgency =
        score >= rules.urgencyLevels.high.minScore
          ? "high"
          : score >= rules.urgencyLevels.moderate.minScore
          ? "moderate"
          : "low";

      setResult({
        ...rules.urgencyLevels[urgency],
        isInvalidInput: false,
        conditions: suggestedConditions[urgency],
      });

      setLoading(false);
    }, 1500);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !loading &&
      charCount >= MIN_CHARS
    ) {
      e.preventDefault();
      analyzeSymptoms();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("SymptomAnalyzer.title")}
        </h1>

        <p className="text-center text-gray-600 mt-2 text-lg">
          {t("SymptomAnalyzer.subtitle")}
        </p>

        {/* How it works */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-blue-800 text-sm">
            <span className="font-medium block mb-1">
              {t("SymptomAnalyzer.howItWorks.title")}
            </span>
            {t("SymptomAnalyzer.howItWorks.description")}
          </p>
        </div>

        {/* Input */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">
              {t("SymptomAnalyzer.inputTitle")}
            </h2>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none overflow-hidden transition"
              placeholder={t("SymptomAnalyzer.placeholder")}
            />

            {charCount >= MIN_CHARS && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                  setResult(null);
                }}
                className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <p
            className={`mt-1 text-xs ${
              charCount < MIN_CHARS ? "text-red-500" : "text-green-600"
            }`}
          >
            {charCount}/{MIN_CHARS} {t("SymptomAnalyzer.minChars")}
          </p>

          <button
            onClick={analyzeSymptoms}
            disabled={loading || charCount < MIN_CHARS}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
              ${
                loading || charCount < MIN_CHARS
                  ? "bg-gray-100 cursor-not-allowed text-gray-400"
                  : "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              }
            `}
          >
            {loading ? t("SymptomAnalyzer.loading") : t("SymptomAnalyzer.cta")}
            {!loading && <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <>
            {result.isInvalidInput ? (
              <div className="mt-10 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 flex gap-3 text-yellow-700">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Input unclear</p>
                  <p className="text-sm mt-1">
                    We couldn’t understand your symptoms clearly.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Urgency */}
                <div
                  className={`mt-10 rounded-xl border px-5 py-4 flex gap-3
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
                  {result.conditions.map((c, i) => (
                    <div
                      key={i}
                      className="
                        bg-white border rounded-xl
                        p-4 sm:p-5
                        shadow-sm
                        flex flex-col sm:flex-row sm:items-center sm:justify-between
                        gap-4
                        cursor-pointer
                        transition-all
                        hover:shadow-xl hover:border-blue-300
                      "
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {c.name}
                          </p>
                          <span className="text-xs px-2 py-0.5 border rounded bg-gray-200">
                            {c.tag}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {c.description}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/symptom-checker")}
                        className="
                          inline-flex items-center justify-center gap-1.5
                          h-9 min-w-[88px]
                          bg-blue-600 text-white
                          px-4 rounded-lg text-sm font-medium
                          cursor-pointer
                          transition
                          hover:bg-blue-700
                          active:scale-95
                        "
                      >
                        Check
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 text-xs text-gray-500 flex items-center gap-2">
                  <Info size={14} />
                  This is not a diagnosis. Please consult a healthcare
                  professional.
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="flex-1 bg-black text-white py-2.5 rounded-lg cursor-pointer hover:bg-gray-900 transition"
                  >
                    Go to Symptom Checker →
                  </button>
                  <button
                    onClick={() => navigate("/clinics")}
                    className="flex-1 border py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    Find Nearby Clinics
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
