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

/* ---------- Locale-aware keyword helper ---------- */
const getLocaleSymptomKeywords = (t) => {
  const scores = t("SymptomAnalyzer.config.symptomScores", {
    returnObjects: true,
    defaultValue: {},
  });
  return Object.keys(scores);
};

/* ---------------- COMPONENT ---------------- */

export default function SymptomAnalyzer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ---------- SAFE i18n ACCESS ---------- */
  const config = t("SymptomAnalyzer.config", {
    returnObjects: true,
    defaultValue: {},
  });

  const MIN_CHARS = config.minCharCount ?? 30;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    status: "idle", // idle | invalid | done
  });

  const charCount = text.trim().length;

  /* ================== SCORING ENGINE ================== */
  const analyzeScore = ({
    input,
    symptomScores = {},
    confidence,
    thresholds,
  }) => {
    let score = 0;
    const breakdown = {};

    // ---- Keyword frequency scoring ----
    Object.entries(symptomScores).forEach(([keyword, value]) => {
      const occurrences = input.split(keyword).length - 1;
      if (occurrences > 0) {
        const keywordScore = occurrences * value;
        score += keywordScore;
        breakdown[keyword] = {
          occurrences,
          value,
          score: keywordScore,
        };
      }
    });

    // ---- Input richness bonus ----
    const wordCount = input.split(/\s+/).length;
    if (wordCount > 20) score += 2;
    if (wordCount > 35) score += 4;

    // ---- Confidence multiplier ----
    let confidenceMultiplier = 1;
    if (confidence === "strong") confidenceMultiplier = 1.3;
    if (confidence === "very_strong") confidenceMultiplier = 1.6;

    score = Math.round(score * confidenceMultiplier);

    // ---- Red flag override ----
    const redFlags = [
      "chest pain",
      "shortness of breath",
      "fainting",
      "blood",
      "unconscious",
    ];

    const hasRedFlag = redFlags.some((r) => input.includes(r));

    // ---- Urgency decision ----
    let urgency =
      score >= thresholds.high
        ? "high"
        : score >= thresholds.moderate
        ? "moderate"
        : "low";

    if (hasRedFlag) urgency = "high";

    return {
      score,
      urgency,
      breakdown,
      wordCount,
      confidence,
      hasRedFlag,
    };
  };

  /* ================== TELEMETRY ================== */
  const logTelemetry = (payload) => {
    try {
      // Local tuning (dev-friendly)
      const logs = JSON.parse(localStorage.getItem("symptomTelemetry") || "[]");
      logs.push({ ...payload, ts: Date.now() });
      localStorage.setItem("symptomTelemetry", JSON.stringify(logs));

      // Optional remote endpoint (commented by default)
      /*
    fetch("/api/telemetry/symptom-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    */
    } catch (e) {
      // silent fail – never break UX
    }
  };

  /* ---------- Robust Input Analysis ---------- */
  const analyzeInputQuality = (input) => {
    if (!input) return { valid: false };

    const text = input.toLowerCase().trim();
    const words = text.split(/\s+/);

    if (text.length < 12) return { valid: false };
    if (/^(.)\1{6,}$/.test(text)) return { valid: false };
    if (/^[^a-z0-9]+$/.test(text)) return { valid: false };

    const symptomKeywords = getLocaleSymptomKeywords(t);

    const severityWords = [
      "severe",
      "mild",
      "moderate",
      "sharp",
      "sudden",
      "continuous",
      "persistent",
      "intense",
    ];

    const durationWords = [
      "hour",
      "hours",
      "day",
      "days",
      "week",
      "weeks",
      "month",
      "months",
      "since",
      "for",
    ];

    const bodySignals = [
      "pain",
      "ache",
      "fever",
      "vomit",
      "nausea",
      "weak",
      "tired",
      "dizzy",
      "breath",
      "head",
      "chest",
      "stomach",
      "abdomen",
    ];

    const signals = {
      symptom: symptomKeywords.filter((k) => text.includes(k)).length,
      severity: severityWords.filter((w) => text.includes(w)).length,
      duration: durationWords.filter((w) => text.includes(w)).length,
      body: bodySignals.filter((w) => text.includes(w)).length,
    };

    const totalSignals =
      signals.symptom + signals.severity + signals.duration + signals.body;

    let confidence = "weak";
    if (signals.symptom >= 2 || totalSignals >= 3) confidence = "strong";
    if (signals.symptom >= 3 || totalSignals >= 5) confidence = "very_strong";

    return {
      valid: totalSignals >= 1 && words.length >= 3,
      confidence,
    };
  };

  /* ---------- ANALYZER ---------- */
  const analyzeSymptoms = () => {
    if (!text.trim() || charCount < MIN_CHARS) return;

    const quality = analyzeInputQuality(text);

    if (!quality.valid) {
      setResult({ status: "invalid" });
      return;
    }

    setLoading(true);
    setResult({ status: "loading" });

    setTimeout(() => {
      const input = text.toLowerCase();
      const thresholds = {
        high: config.urgencyThresholds?.high ?? 14,
        moderate: config.urgencyThresholds?.moderate ?? 7,

        
      };

      const analysis = analyzeScore({
        input,
        symptomScores: config.symptomScores ?? {},
        confidence: quality.confidence,
        thresholds,
        
      });

      // ---- TELEMETRY ----
      logTelemetry({
        score: analysis.score,
        urgency: analysis.urgency,
        confidence: analysis.confidence,
        wordCount: analysis.wordCount,
        hasRedFlag: analysis.hasRedFlag,
        breakdown: analysis.breakdown,
      });

      let urgencyLevel = analysis.urgency;

      if (analysis.hasRedFlag) {
        urgencyLevel = "high";
      }

      if (analysis.score >= thresholds.moderate - 1 && urgencyLevel === "low") {
        urgencyLevel = "moderate";
      }


      const urgencyData = t(`SymptomAnalyzer.urgency.${urgencyLevel}`, {
        returnObjects: true,
        defaultValue: {},
      });

      const conditions = t(`SymptomAnalyzer.conditions.${urgencyLevel}`, {
        returnObjects: true,
        defaultValue: [],
      });

      setResult({
        status: "done",
        urgency: urgencyLevel,
        label: urgencyData.label,
        description: urgencyData.description,
        advice: urgencyData.advice,
        color: urgencyData.color,
        conditions,
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

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          {t("SymptomAnalyzer.title")}
        </h1>

        <p className="text-center text-gray-600 mt-2 text-lg">
          {t("SymptomAnalyzer.subtitle")}
        </p>

        {/* Input */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-300 p-4 sm:p-6">
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder={t("SymptomAnalyzer.placeholder")}
            />

            {charCount >= MIN_CHARS && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 font-semibold cursor-pointer text-black hover:bg-gray-300 flex items-center justify-center"
                aria-label="Clear text"
              >
                ✕
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

          <p className="text-xs text-gray-500 mt-1">
            {t("SymptomAnalyzer.tip")}
          </p>

          <button
            onClick={analyzeSymptoms}
            disabled={loading || charCount < MIN_CHARS}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 cursor-pointer rounded-xl font-medium transition
              ${
                loading || charCount < MIN_CHARS
                  ? "bg-gray-100 cursor-not-allowed text-gray-400"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
          >
            {loading ? t("SymptomAnalyzer.loading") : t("SymptomAnalyzer.cta")}
            {!loading && <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* RESULTS */}
        {result.status === "invalid" && (
          <div className="mt-10 rounded-xl border border-yellow-400 bg-yellow-100 shadow-lg px-5 py-4 flex gap-3 text-yellow-700">
            <AlertCircle className="w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold text-lg">
                {t("SymptomAnalyzer.invalid.title")}
              </p>
              <p className="text-sm mt-1">
                {t("SymptomAnalyzer.invalid.message")}
              </p>
            </div>
          </div>
        )}

        {result.status === "done" && (
          <>
            {/* Urgency */}
            <div
              className={`mt-10 rounded-xl border px-5 py-4 flex gap-3
        ${
          result.color === "red"
            ? "bg-red-100 border-red-200 text-red-700 shadow-lg"
            : result.color === "yellow"
            ? "bg-yellow-100 border-yellow-400 text-yellow-700 shadow-lg"
            : "bg-green-100 border-green-400 text-green-700 shadow-lg"
        }`}
            >
              <AlertCircle className="w-6 h-6 mt-1" />
              <div>
                <p className="font-semibold text-lg">
                  {t("SymptomAnalyzer.urgencyLevel")}:{" "}
                  <strong>{result.label}</strong>
                </p>
                <p className="text-sm mt-1">{result.description}</p>
              </div>
            </div>

            {/* Immediate Advice */}
            {result.advice && (
              <div className="mt-6 rounded-xl border border-blue-300 bg-blue-100 shadow-lg px-5 py-4 flex gap-3">
                <Lightbulb className="w-6 h-6 text-blue-700 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800">
                    {t("SymptomAnalyzer.immediateAdvice")}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">{result.advice}</p>
                </div>
              </div>
            )}

            {/* Suggested Conditions */}
            <h3 className="mt-10 font-bold text-lg text-black">
              {t("SymptomAnalyzer.suggestedConditions")}
            </h3>

            <div className="mt-2 space-y-4">
              {result.conditions.map((c, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl border-gray-300 shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {c.description}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="inline-flex items-center gap-1.5 h-9 px-4 cursor-pointer rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 hover:shadow-md transition"
                  >
                    {t("SymptomAnalyzer.check")}
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 px-3 py-3 text-xs text-gray-600 bg-gray-100 flex items-center gap-2 rounded-xl shadow-md border">
              <Info size={14} />
              {t("SymptomAnalyzer.disclaimer")}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/symptom-checker")}
                className="flex-1 bg-black text-white cursor-pointer shadow-lg py-2.5 rounded-lg hover:bg-gray-800"
              >
                {t("SymptomAnalyzer.actions.symptomChecker")}
              </button>
              <button
                onClick={() => navigate("/clinics")}
                className="flex-1 border py-2.5 cursor-pointer shadow-lg rounded-lg hover:bg-gray-200"
              >
                {t("SymptomAnalyzer.actions.findClinics")}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
