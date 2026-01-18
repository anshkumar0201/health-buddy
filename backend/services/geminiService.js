const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ======================================================
   PROMPT (STRICT, RULE-ALIGNED)
   ====================================================== */
function buildPrompt(text, locale = "en") {
  return `
You are a medical symptom analysis engine used inside a health application.

IMPORTANT LANGUAGE RULE:
- The output language for ALL user-facing text MUST be "${locale}"
- User-facing text includes:
  - urgency.*.description
  - urgency.*.advice
  - conditions.*[].name
  - conditions.*[].description
  - urgency labels ("High Urgency", "Moderate Urgency", "Low Urgency")
- DO NOT translate or change:
  - JSON keys
  - config keys or values unless explicitly allowed

If the locale is not English, write the text naturally in that language.
Use simple, clear, non-technical language suitable for patients.

More language references:
  - en for English(default)
  - hi for Hindi
  - as for assamese
  - bn for bengali
  - dg for dogri
  - en for english
  - gu for gujarati
  - hi for hindi
  - kc for kachi
  - kn for kannada
  - ka for kashmiri
  - ko for konkani
  - mt for maithili
  - mr for marathi
  - ne for nepali
  - or for odia
  - pa for punjabi
  - sa for sanskrit
  - sd for sindhi
  - ta for tamil
  - te for telugu
  - ur for urdu

Your task:
Based on the user's symptom description, return a FULL symptom analysis
object that strictly follows the schema and rules below.

CRITICAL RULES (MANDATORY):
- Return ONLY valid JSON
- Do NOT include markdown, comments, or explanations
- Do NOT remove, rename, or add any keys
- You may ONLY change VALUES where explicitly allowed
- Keep language simple, clear, and non-technical
- This is NOT a diagnosis

WHAT YOU MAY CHANGE:

CONFIG
- config.minCharCount → MUST remain 30
- config.symptomScores → you may:
  - reuse existing keys
  - add new symptom keys
  - adjust numeric values based on user text
- config.urgencyThresholds:
  - keys MUST remain "high" and "moderate"
  - values may change slightly but must stay close to typical ranges

URGENCY
- urgency.high / moderate / low:
  - color → DO NOT change
  - label → DO NOT change
  - description → you MAY change based on user text
  - advice → you MAY change based on user text

CONDITIONS
- conditions.high / moderate / low:
  - keys MUST remain exactly the same
  - arrays may grow or shrink based on user text
  - you may decide condition name, tag, and description
  - minimum three conditions per urgency level
  - condition names MUST be relevant to user symptoms

REQUIRED JSON SCHEMA (DO NOT CHANGE STRUCTURE):

{
  "config": {
    "minCharCount": 30,
    "symptomScores": {
      "chest pain": 10,
      "shortness of breath": 8,
      "breathing difficulty": 8,
      "fever": 5,
      "high fever": 7,
      "headache": 3,
      "dizziness": 4,
      "vomiting": 4,
      "nausea": 3,
      "abdominal pain": 5,
      "weakness": 3,
      "fatigue": 2
    },
    "urgencyThresholds": {
      "high": 20,
      "moderate": 10
    }
  },
  "urgency": {
    "high": {
      "color": "red",
      "label": "High Urgency",
      "description": "string",
      "advice": "string"
    },
    "moderate": {
      "color": "yellow",
      "label": "Moderate Urgency",
      "description": "string",
      "advice": "string"
    },
    "low": {
      "color": "green",
      "label": "Low Urgency",
      "description": "string",
      "advice": "string"
    }
  },
  "conditions": {
    "high": [
      { "name": "string", "tag": "string", "description": "string" }
    ],
    "moderate": [
      { "name": "string", "tag": "string", "description": "string" }
    ],
    "low": [
      { "name": "string", "tag": "string", "description": "string" }
    ]
  }
}

USER SYMPTOMS (${locale}):
"${text}"

Return ONLY the JSON.
`;
}

/* ======================================================
   INTERNAL GEMINI CALL (JSON-ENFORCED)
   ====================================================== */
async function callGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text;
}

function extractJson(text) {
  if (!text || typeof text !== "string") return null;

  // Remove BOM and trim
  const cleaned = text.replace(/^\uFEFF/, "").trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) return null;

  return cleaned.slice(firstBrace, lastBrace + 1);
}


/* ======================================================
   MAIN GEMINI CALL
   ====================================================== */
async function analyzeSymptomsWithGemini(text, locale = "en") {
  // ---- helper to parse safely ----
  const parseGeminiJson = (rawText) => {
    const extracted = extractJson(rawText);

    if (!extracted) {
      throw new Error("Could not extract JSON");
    }

    return JSON.parse(extracted);
  };

  let rawText;
  let parsed;

  // -------- FIRST ATTEMPT --------
  try {
    rawText = await callGemini(buildPrompt(text, locale));
    parsed = parseGeminiJson(rawText);
  } catch (err) {
    console.warn("⚠️ Gemini JSON parse failed, retrying once...");
  }

  // -------- ONE RETRY (STRICTER) --------
  if (!parsed) {
    try {
      rawText = await callGemini(
        buildPrompt(text, locale) +
        "\n\nREMINDER: Output MUST be valid JSON ONLY. No prose."
      );

      parsed = parseGeminiJson(rawText);
    } catch (err) {
      console.error("❌ Gemini returned invalid JSON twice");
      throw new Error("Gemini returned invalid JSON");
    }
  }

  // -------- SCHEMA VALIDATION --------
  if (!validateAnalyzerSchema(parsed)) {
    throw new Error("Gemini response failed schema validation");
  }

  return enforceInvariants(parsed);
}


/* ======================================================
   SCHEMA VALIDATION (STRUCTURE ONLY)
   ====================================================== */
function validateAnalyzerSchema(data) {
  if (!data || typeof data !== "object") return false;
  if (!data.config || !data.urgency || !data.conditions) return false;

  if (data.config.minCharCount !== 30) return false;
  if (typeof data.config.symptomScores !== "object") return false;

  if (
    typeof data.config.urgencyThresholds?.high !== "number" ||
    typeof data.config.urgencyThresholds?.moderate !== "number"
  ) {
    return false;
  }

  for (const level of ["high", "moderate", "low"]) {
    if (!data.urgency[level]) return false;
    if (!Array.isArray(data.conditions[level])) return false;
  }

  return true;
}

/* ======================================================
   INVARIANT ENFORCEMENT (HARD LOCKS)
   ====================================================== */
function enforceInvariants(aiData) {
  aiData.config.minCharCount = 30;

  aiData.urgency.high.color = "red";
  aiData.urgency.high.label = "High Urgency";

  aiData.urgency.moderate.color = "yellow";
  aiData.urgency.moderate.label = "Moderate Urgency";

  aiData.urgency.low.color = "green";
  aiData.urgency.low.label = "Low Urgency";

  return aiData;
}

/* ======================================================
   EXPORT
   ====================================================== */
module.exports = {
  analyzeSymptomsWithGemini
};
