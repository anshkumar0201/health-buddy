import { useState, useEffect, useMemo } from "react";
import {
  Activity,
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
import { motion } from "framer-motion";
// Assuming you have a shared file for terms. If not, ensure this import is correct or mock it.
import medicalTerms from "../../shared/medical/medical-terms.json";
import SkeletonSymptomAnalyzer from "@/components/skeletons/SkeletonSymptomAnalyzer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ======================================================
   HELPER FUNCTIONS (Validation & Medical Checks)
   ====================================================== */
function isTextClearEnough(text, maxInvalidRatio = 0.4) {
  if (!text) return false;
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
  let invalid = emojiCount;
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
  return invalid / (valid + invalid) < maxInvalidRatio;
}

const MEDICAL_SETS = {
  symptoms: new Set(medicalTerms.symptoms),
  bodyParts: new Set(medicalTerms.bodyParts),
  severity: new Set(medicalTerms.severity),
  duration: new Set(medicalTerms.duration),
};

const MEDICAL_PHRASES = [
  "shortness of breath",
  "chest pain",
  "lower back",
  "high fever",
  "heart rate",
  "blood pressure",
  "loss of appetite",
  "weight loss",
  "blurred vision",
  "ringing in ear",
  "difficulty swallowing",
  "burning urination",
  "severe headache",
];

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/ae/g, "e")
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
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
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
  const lower = text.toLowerCase();

  // Phrase-level match first (huge win)
  for (const p of MEDICAL_PHRASES) {
    if (lower.includes(p)) return true;
  }

  // Then fallback to word-level logic
  const words = tokenize(text);
  let matches = 0;

  for (const w of words) {
    if (
      MEDICAL_SETS.symptoms.has(w) ||
      MEDICAL_SETS.bodyParts.has(w) ||
      MEDICAL_SETS.severity.has(w) ||
      MEDICAL_SETS.duration.has(w) ||
      isCloseSymptom(w)
    ) {
      matches++;
      if (matches >= minMatches) return true;
    }
  }
  return false;
}

function hasSymptomStructure(text) {
  let flags = { symptom: false, body: false, duration: false, severity: false };
  for (const w of tokenize(text)) {
    if (MEDICAL_SETS.symptoms.has(w) || isCloseSymptom(w)) flags.symptom = true;
    if (MEDICAL_SETS.bodyParts.has(w)) flags.body = true;
    if (MEDICAL_SETS.duration.has(w)) flags.duration = true;
    if (MEDICAL_SETS.severity.has(w)) flags.severity = true;
  }
  return Object.values(flags).filter(Boolean).length >= 2;
}
function medicalDensity(text, minRatio = 0.03) {
  const words = tokenize(text);
  if (words.length < 5) return false;
  let medicalCount = 0;
  for (const w of words) {
    if (
      MEDICAL_SETS.symptoms.has(w) ||
      MEDICAL_SETS.bodyParts.has(w) ||
      MEDICAL_SETS.severity.has(w) ||
      MEDICAL_SETS.duration.has(w) ||
      isCloseSymptom(w)
    )
      medicalCount++;
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
  const { t, i18n, ready } = useTranslation();
  // const navigate = useNavigate();
  const fallbackConfig = useMemo(() => {
    return t("SymptomAnalyzer.config", {
      returnObjects: true,
      defaultValue: {},
    });
  }, [t]);

  const MIN_CHARS = fallbackConfig.minCharCount ?? 30;
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ status: "idle" });
  const charCount = text.trim().length;

  /* ---------------- Motion presets ---------------- */

  const pageReveal = {
    hidden: { opacity: 0, scale: 0.98 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatBrain = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseCTA = {
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const fail = (reason) => {
    console.warn("SYMPTOM ANALYZER BLOCKED:", reason);
    console.warn("Please enter valid input. Current USER INPUT:", text);
    setResult({ status: "invalid", reason });
    return false;
  };

  const analyzeSymptoms = async () => {
    if (!text.trim() || charCount < MIN_CHARS) {
      return fail("Character count is less than minimum");
    }
    if (!isTextClearEnough(text, 0.4)) {
      return fail("Text not clear enough");
    }
    if (!hasMedicalSignal(text, 2)) {
      return fail("No medical signal detected");
    }
    if (!hasSymptomStructure(text)) {
      return fail("No symptom structure");
    }
    if (!medicalDensity(text, 0.08)) {
      return fail("Medical density too low");
    }
    if (isMetaInput(text)) {
      return fail("Meta / conversational input");
    }

    setLoading(true);
    setResult({ status: "loading" });

    try {
      const response = await fetch(`${API_BASE}/api/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale: i18n.language }),
      });
      if (!response.ok) throw new Error("AI analysis failed");
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

  const shouldShowInvalid = useMemo(() => {
    return (
      charCount >= MIN_CHARS &&
      !loading &&
      !isTextClearEnough(text, 0.4) &&
      result.status !== "done"
    );
  }, [charCount, loading, text, result.status]);

  useEffect(() => {
    const saved = sessionStorage.getItem("symptomAnalyzerState");
    if (saved) {
      const parsed = JSON.parse(saved);
      setText(parsed.text || "");
      setResult(parsed.result || { status: "idle" });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "symptomAnalyzerState",
      JSON.stringify({ text, result }),
    );
  }, [text, result]);

  const clearAnalyzerState = () => {
    sessionStorage.removeItem("symptomAnalyzerState");
    setText("");
    setResult({ status: "idle" });
  };

  const doneContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const doneItem = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const softPop = {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  if (!ready) return <SkeletonSymptomAnalyzer />;

  return (
    // FIX: Changed bg-linear-to-b (invalid) to bg-gradient-to-b (valid)
    <motion.main
      variants={pageReveal}
      initial="hidden"
      animate="show"
      className="min-h-screen pt-24 pb-32 transition-colors duration-300 
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={floatBrain}
          animate="animate"
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center transition-colors duration-300 text-gray-900 dark:text-gray-300">
          {t("SymptomAnalyzer.title")}
        </h1>

        <p className="text-center mt-2 text-lg transition-colors duration-300 text-gray-600 dark:text-gray-400">
          {t("SymptomAnalyzer.subtitle")}
        </p>

        {/* Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-2xl shadow-lg border p-4 sm:p-6 transition-colors duration-300 
          bg-white border-gray-300 
          dark:bg-[#1e293b] dark:border-gray-700 dark:shadow-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold transition-colors duration-300 text-gray-900 dark:text-gray-100">
              {t("SymptomAnalyzer.inputTitle")}
            </h2>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              className="resize-y w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-300
                bg-white border-gray-200 text-gray-900 placeholder-gray-500
                dark:bg-[#0f172a] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              placeholder={t("SymptomAnalyzer.placeholder")}
            />

            {charCount >= MIN_CHARS && (
              <button
                type="button"
                onClick={() => setText("")}
                className="absolute top-2 right-5 w-6 h-6 rounded-full bg-purple-500/20 font-semibold cursor-pointer text-black hover:bg-gray-300 flex items-center justify-center z-10"
                aria-label="Clear text"
              >
                ✕
              </button>
            )}

            <div className="pointer-events-none absolute bottom-2 right-5 flex items-center gap-1.5 text-gray-400 text-xs px-2 py-1">
              <span>Powered by Google Gemini</span>
            </div>
          </div>

          <p
            className={`mt-1 text-xs ${charCount < MIN_CHARS ? "text-red-500" : "text-green-600 dark:text-green-400"}`}
          >
            {charCount}/{MIN_CHARS} {t("SymptomAnalyzer.minChars")}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Lightbulb className="h-3 w-3" />
            {t("SymptomAnalyzer.tip")}
          </p>

          <motion.button
            variants={pulseCTA}
            animate={charCount >= MIN_CHARS && !loading ? "animate" : undefined}
            onClick={analyzeSymptoms}
            disabled={loading || charCount < MIN_CHARS}
            className={`mt-6 w-full flex cursor-pointer items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
              loading || charCount < MIN_CHARS
                ? "bg-gray-100 cursor-not-allowed text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <span>{t("SymptomAnalyzer.loading")}</span>
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70 animate-ping"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></span>
                </span>
              </>
            ) : (
              <>
                <span>{t("SymptomAnalyzer.cta")}</span>
                <Search className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* INVALID STATE */}
        {(result.status === "invalid" || shouldShowInvalid) && (
          <>
            <div
              className="mt-10 rounded-xl border px-5 py-4 flex gap-3 shadow-lg transition-colors duration-300
              bg-yellow-100 border-yellow-400 text-yellow-700
              dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-200"
            >
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
                className="flex-1 inline-flex justify-center items-center border py-2.5 cursor-pointer shadow-lg rounded-xl transition-colors duration-300
                  bg-gray-500 text-white hover:bg-gray-200 hover:text-black
                  dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {t("SymptomAnalyzer.reset")}
              </button>
            </div>
          </>
        )}

        {/* DONE STATE */}
        {result.status === "done" && (
          <motion.div variants={doneContainer} initial="hidden" animate="show">
            <motion.div variants={doneItem}>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(99,102,241,0)",
                    "0 0 18px rgba(99,102,241,0.25)",
                    "0 0 0 rgba(99,102,241,0)",
                  ],
                }}
                transition={{ duration: 1.6 }}
                className={`mt-10 rounded-xl border px-5 py-4 flex gap-3 shadow-lg transition-colors duration-300 ${
                  result.color === "red"
                    ? "bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200"
                    : result.color === "yellow"
                      ? "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200"
                      : "bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200"
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
              </motion.div>
            </motion.div>
            {result.advice && (
              <motion.div variants={doneItem}>
                <div
                  className="mt-6 rounded-xl border shadow-lg px-5 py-4 flex gap-3 transition-colors duration-300
                bg-blue-100 border-blue-300 
                dark:bg-blue-900/30 dark:border-blue-800"
                >
                  <Lightbulb className="w-6 h-6 mt-0.5 text-blue-700 dark:text-blue-300" />
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200">
                      {t("SymptomAnalyzer.immediateAdvice")}
                    </p>
                    <p className="text-sm mt-1 text-blue-700 dark:text-blue-100">
                      {result.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <h3 className="mt-10 font-bold text-lg transition-colors duration-300 text-black dark:text-white">
              {t("SymptomAnalyzer.suggestedConditions")}
            </h3>

            <div className="mt-2 space-y-4">
              {result.conditions.map((c, i) => (
                <motion.div key={i} variants={doneItem}>
                  <div
                    className="border rounded-xl shadow-lg p-4 flex justify-between items-center transition-colors duration-300
                  bg-white border-gray-300
                  dark:bg-[#1e293b] dark:border-gray-700"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {c.name}
                      </p>
                      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
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
                </motion.div>
              ))}
            </div>

            <div
              className="mt-6 px-3 py-3 text-xs flex items-center gap-2 rounded-xl shadow-md border transition-colors duration-300
              bg-gray-100 text-gray-600
              dark:bg-slate-800 dark:text-gray-400 dark:border-gray-700"
            >
              <Info size={14} />
              {t("SymptomAnalyzer.disclaimer")}
            </div>

            <motion.div variants={softPop} className="mt-6 flex gap-4">
              <button
                onClick={() => window.open("/symptom-checker", "_blank")}
                className="flex-1 cursor-pointer shadow-lg py-2.5 rounded-xl transition-colors duration-300
                  bg-black text-white hover:bg-gray-800
                  dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {t("SymptomAnalyzer.actions.symptomChecker")}
              </button>
              <button
                onClick={() => window.open("/clinics", "_blank")}
                className="flex-1 inline-flex justify-center items-center border py-2.5 cursor-pointer shadow-lg rounded-xl transition-colors duration-300
                  hover:bg-gray-200
                  dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
              >
                {t("SymptomAnalyzer.actions.findClinics")}
                <ExternalLink className="w-4 h-4 mx-2 opacity-80" />
              </button>
            </motion.div>

            <div className="mt-4 flex text-center">
              <button
                onClick={clearAnalyzerState}
                className="flex-1 inline-flex justify-center items-center border py-2.5 cursor-pointer shadow-lg rounded-xl transition-colors duration-300
                  bg-gray-500 text-white hover:bg-gray-200 hover:text-black
                  dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {t("SymptomAnalyzer.reset")}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
