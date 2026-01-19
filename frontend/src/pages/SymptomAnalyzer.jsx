import { useState, useEffect } from "react";
import {
  MessageSquare,
  Info,
  Sparkles,
  Search,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import medicalTerms from "../../shared/medical/medical-terms.json";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ======================================================
   FRONTEND INPUT CLARITY CHECK (HARD STOP)
   Blocks Gemini when invalid ≥ 20%
   ====================================================== */
function isTextClearEnough(text, maxInvalidRatio = 0.4) {
  if (!text) return false;

  // 🚫 Detect emojis explicitly
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const emojiCount = (text.match(emojiRegex) || []).length;

  const connectorWords = new Set([
    "on",
    "in",
    "at",
    "to",
    "of",
    "by",
    "for",
    "with",
    "and",
    "or",
  ]);

  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);

  if (words.length < 3) return false;

  let valid = 0;
  let invalid = emojiCount; // emojis are ALWAYS invalid

  for (const word of words) {
    if (connectorWords.has(word)) {
      valid++;
      continue;
    }

    if (word.length < 3) {
      invalid++;
      continue;
    }

    if (/^(.)\1{3,}$/.test(word)) {
      invalid++;
      continue;
    }

    if (!/[aeiou]/.test(word)) {
      invalid++;
      continue;
    }

    valid++;
  }

  const total = valid + invalid;
  const invalidRatio = invalid / total;

  console.log("🧪 Frontend validation:", {
    valid,
    invalid,
    invalidRatio,
  });

  return invalidRatio < maxInvalidRatio;
}

/* ======================================================
   MEDICAL SIGNAL CHECK (STRICT + TOLERANT)
   ====================================================== */
const MEDICAL_SETS = {
  symptoms: new Set(medicalTerms.symptoms),
  bodyParts: new Set(medicalTerms.bodyParts),
  severity: new Set(medicalTerms.severity),
  duration: new Set(medicalTerms.duration),
};

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/ae/g, "e")        // diarrhoea → diarrhea
    .replace(/oe/g, "e")
    .replace(/ph/g, "f")
    .replace(/(ness|ies|es|s)$/i, "")
    .replace(/[^a-z]/g, "");
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;

  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function isCloseSymptom(word) {
  for (const term of MEDICAL_SETS.symptoms) {
    if (levenshtein(word, term) <= 1) return true;
  }
  return false;
}

function hasMedicalSignal(text, minMatches = 2) {
  const words = tokenize(text);
  let matches = 0;

  for (const w of words) {
    if (
      MEDICAL_SETS.symptoms.has(w) ||
      MEDICAL_SETS.bodyParts.has(w) ||
      MEDICAL_SETS.severity.has(w) ||
      MEDICAL_SETS.duration.has(w) ||
      isCloseSymptom(w) // 👈 tolerant
    ) {
      matches++;
      if (matches >= minMatches) return true;
    }
  }
  return false;
}

function hasSymptomStructure(text) {
  let flags = {
    symptom: false,
    body: false,
    duration: false,
    severity: false,
  };

  for (const w of tokenize(text)) {
    if (MEDICAL_SETS.symptoms.has(w) || isCloseSymptom(w)) flags.symptom = true;
    if (MEDICAL_SETS.bodyParts.has(w)) flags.body = true;
    if (MEDICAL_SETS.duration.has(w)) flags.duration = true;
    if (MEDICAL_SETS.severity.has(w)) flags.severity = true;
  }

  return Object.values(flags).filter(Boolean).length >= 2;
}

function medicalDensity(text, minRatio = 0.08) {
  const words = tokenize(text);
  if (words.length < 10) return false;

  let medicalCount = 0;
  for (const w of words) {
    if (
      MEDICAL_SETS.symptoms.has(w) ||
      MEDICAL_SETS.bodyParts.has(w) ||
      MEDICAL_SETS.severity.has(w) ||
      MEDICAL_SETS.duration.has(w) ||
      isCloseSymptom(w)
    ) {
      medicalCount++;
    }
  }

  return medicalCount / words.length >= minRatio;
}

const META_PATTERNS = [
  /can you/i,
  /please analyze/i,
  /what is wrong/i,
  /help me/i,
  /doctor/i,
  /hi|hello/i,
];

function isMetaInput(text) {
  return META_PATTERNS.some((r) => r.test(text));
}

/* ======================================================
   COMPONENT
   ====================================================== */
export default function SymptomAnalyzer() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const fallbackConfig = t("SymptomAnalyzer.config", {
    returnObjects: true,
    defaultValue: {},
  });

  const MIN_CHARS = fallbackConfig.minCharCount ?? 30;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    status: "idle", // idle | loading | invalid | done
  });

  const charCount = text.trim().length;

  /* ======================================================
     MAIN ANALYZER (STRICT FRONTEND BLOCK)
     ====================================================== */
  const analyzeSymptoms = async () => {
    if (!text.trim() || charCount < MIN_CHARS) {
      setResult({ status: "invalid" });
      return;
    }

    // ⛔ HARD FRONTEND STOP — NO GEMINI
    if (!isTextClearEnough(text, 0.4)) {
      setResult({ status: "invalid" });
      return;
    }

    // 🏥 MEDICAL SIGNAL HARD STOP
    if (!hasMedicalSignal(text, 2)) {
      setResult({ status: "invalid" });
      return;
    }

    if (!hasSymptomStructure(text)) {
      setResult({ status: "invalid" });
      return;
    }

    if (!medicalDensity(text, 0.08)) {
      setResult({ status: "invalid" });
      return;
    }

    if (isMetaInput(text)) {
      setResult({ status: "invalid" });
      return;
    }

    // ✅ ONLY NOW start loading + API
    setLoading(true);
    setResult({ status: "loading" });

    try {
      const response = await fetch(`${API_BASE}/api/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          locale: i18n.language,
        }),
      });

      if (!response.ok) {
        throw new Error("AI analysis failed");
      }

      const aiData = await response.json();

      const input = text.toLowerCase();
      const scores = aiData.config?.symptomScores || {};
      const thresholds = aiData.config?.urgencyThresholds || {
        high: 20,
        moderate: 10,
      };

      let score = 0;
      Object.entries(scores).forEach(([keyword, value]) => {
        const occurrences = input.split(keyword).length - 1;
        if (occurrences > 0) score += occurrences * value;
      });

      let urgencyLevel =
        score >= thresholds.high
          ? "high"
          : score >= thresholds.moderate
            ? "moderate"
            : "low";

      const urgencyData = aiData.urgency[urgencyLevel];
      const conditions = aiData.conditions[urgencyLevel] || [];

      setResult({
        status: "done",
        urgency: urgencyLevel,
        label: urgencyData.label,
        description: urgencyData.description,
        advice: urgencyData.advice,
        color: urgencyData.color,
        conditions,
      });
    } catch (error) {
      console.error(error);
      setResult({ status: "invalid" });
    } finally {
      setLoading(false);
    }
  };;

  /* ---------- INPUT HANDLERS ---------- */
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

  const shouldShowInvalid =
    charCount >= MIN_CHARS &&
    !loading &&
    !isTextClearEnough(text, 0.4) &&
    result.status !== "done";

  // Restore state on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("symptomAnalyzerState");
    if (saved) {
      const parsed = JSON.parse(saved);
      setText(parsed.text || "");
      setResult(parsed.result || { status: "idle" });
    }
  }, []);

  // Persist state on change
  useEffect(() => {
    sessionStorage.setItem(
      "symptomAnalyzerState",
      JSON.stringify({ text, result })
    );
  }, [text, result]);

  const clearAnalyzerState = () => {
    sessionStorage.removeItem("symptomAnalyzerState");
    setText("");
    setResult({ status: "idle" });
  };

  console.log("Current language:", i18n.language);

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
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
              rows={4}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              className="resize-y w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder={t("SymptomAnalyzer.placeholder")}
            />

            {charCount >= MIN_CHARS && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                }}
                className="absolute top-2 right-5 w-6 h-6 rounded-full bg-purple-500 font-semibold cursor-pointer text-black hover:bg-gray-300 flex items-center justify-center"
                aria-label="Clear text"
              >
                ✕
              </button>
            )}
            {/* Powered by Google Gemini */}
            <div
              className="pointer-events-none absolute bottom-2 right-5 flex items-center gap-1.5 text-gray-400 text-xs px-2 py-1"
              aria-label="Powered by Google Gemini"
            >
              <span>Powered by Google Gemini</span>
            </div>
          </div>

          <p
            className={`mt-1 text-xs ${
              charCount < MIN_CHARS ? "text-red-500" : "text-green-600"
            }`}
          >
            {charCount}/{MIN_CHARS} {t("SymptomAnalyzer.minChars")}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Lightbulb className="h-3 w-3" />
            {t("SymptomAnalyzer.tip")}
          </p>

          <button
            onClick={analyzeSymptoms}
            disabled={loading || charCount < MIN_CHARS}
            className={`mt-6 w-full flex cursor-pointer items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
              loading || charCount < MIN_CHARS
                ? "bg-gray-100 cursor-not-allowed text-gray-400"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <span>{t("SymptomAnalyzer.loading")}</span>
                <span className="relative flex h-4 w-4">
                  {/* Outer pulse (soft Gemini glow) */}
                  <span
                    className="absolute inline-flex h-full w-full rounded-full 
                   bg-linear-to-r from-blue-400 via-purple-400 to-pink-400
                   opacity-70 animate-ping"
                  ></span>

                  {/* Inner core */}
                  <span
                    className="relative inline-flex h-4 w-4 rounded-full 
                   bg-linear-to-br from-blue-500 via-purple-500 to-pink-500"
                  ></span>
                </span>
              </>
            ) : (
              <>
                <span>{t("SymptomAnalyzer.cta")}</span>
                <Search className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* INVALID */}
        {(result.status === "invalid" || shouldShowInvalid) && (
          <>
            <div className="mt-10 rounded-xl border border-yellow-400 bg-yellow-100 px-5 py-4 flex gap-3 text-yellow-700 shadow-lg">
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
            <div className="mt-4 flex text-center">
              <button
                onClick={clearAnalyzerState}
                className="flex-1 inline-flex justify-center bg-gray-500 text-white items-center border py-2.5 cursor-pointer shadow-lg rounded-xl hover:bg-gray-200 hover:text-black"
              >
                {t("SymptomAnalyzer.reset")}
              </button>
            </div>
          </>
        )}

        {/* DONE */}
        {result.status === "done" && (
          <>
            {/* Urgency */}
            <div
              className={`mt-10 rounded-xl border px-5 py-4 flex gap-3 shadow-lg ${
                result.color === "red"
                  ? "bg-red-100 border-red-200 text-red-700"
                  : result.color === "yellow"
                    ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                    : "bg-green-100 border-green-400 text-green-700"
              }`}
            >
              <AlertCircle className="w-6 h-6 mt-1" />
              <div>
                <p className="font-semibold text-lg">
                  {t("SymptomAnalyzer.urgencyLevel")}:{" "}
                  <strong>
                    {t(`SymptomAnalyzer.urgency.${result.urgency}.label`)}
                  </strong>
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

            {/* Conditions */}
            <h3 className="mt-10 font-bold text-lg text-black">
              {t("SymptomAnalyzer.suggestedConditions")}
            </h3>

            <div className="mt-2 space-y-4">
              {result.conditions.map((c, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl border-gray-300 shadow-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {c.description}
                    </p>
                  </div>

                  <button
                    onClick={() => window.open("/symptom-checker", "_blank")}
                    className="inline-flex items-center cursor-pointer gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
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
                onClick={() => window.open("/symptom-checker", "_blank")}
                className="flex-1 bg-black text-white cursor-pointer shadow-lg py-2.5 rounded-xl hover:bg-gray-800"
              >
                {t("SymptomAnalyzer.actions.symptomChecker")}
              </button>
              <button
                onClick={() => window.open("/clinics", "_blank")}
                className="flex-1 inline-flex justify-center items-center border py-2.5 cursor-pointer shadow-lg rounded-xl hover:bg-gray-200"
              >
                {t("SymptomAnalyzer.actions.findClinics")}
                <ExternalLink className="w-4 h-4 mx-2 opacity-80" />
              </button>
            </div>

            <div className="mt-4 flex text-center">
              <button
                onClick={clearAnalyzerState}
                className="flex-1 inline-flex justify-center bg-gray-500 text-white items-center border py-2.5 cursor-pointer shadow-lg rounded-xl hover:bg-gray-200 hover:text-black"
              >
                {t("SymptomAnalyzer.reset")}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
