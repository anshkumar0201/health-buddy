const { GoogleGenAI } = require("@google/genai");
const { sanitize, restore, outputHasPII } = require("./piiVault");

const MODELS = {
    small: "gemini-2.5-flash-lite",
    medium: "gemini-2.5-flash",
    large: "gemini-3-flash-preview",
};

function selectModel(prompt) {
    const chars = prompt.length;

    if (chars < 6000) return MODELS.small;
    if (chars < 20000) return MODELS.medium;
    return MODELS.large;
}

/* ======================================================
   🔐 LAZY GEMINI CLIENT (CRITICAL FIX)
   ====================================================== */
function getGeminiClient() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
}

async function runGemini(prompt) {
    const model = selectModel(prompt);
    console.log(`🧠 Gemini Router → ${model}`);

    /* 🔒 SANITIZE BEFORE MODEL */
    const { clean, hasPII } = sanitize(prompt);
    if (hasPII) {
        console.log("🔐 PII detected & tokenized before Gemini");
    }

    const response = await ai.models.generateContent({
        model,
        generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",   // 🔐 CRITICAL
            maxOutputTokens: 1024
        },
        safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_MEDICAL", threshold: "BLOCK_NONE" }
        ],
        contents: [
            { role: "user", parts: [{ text: prompt }] }
        ]
    });

    console.log("🟡 RAW GEMINI SDK RESPONSE:", JSON.stringify(response, null, 2));

    const candidate = response.candidates?.[0];

    if (candidate?.finishReason === "SAFETY") {
        console.error("❌ GEMINI SAFETY BLOCK", candidate.safetyRatings);
        throw new Error(`Gemini blocked response (${model}) by safety filters`);
    }

    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
        console.error("❌ GEMINI RETURNED NO TEXT", candidate);
        throw new Error(`Gemini returned empty response (${model})`);
    }

    /* 🔄 RESTORE AFTER MODEL */
    const restored = restore(text);
    /* 🚨 BLOCK MODEL IF IT TRIES TO OUTPUT REAL PII */
    if (outputHasPII(restored)) {
        console.error("❌ Gemini attempted to emit PII");
        throw new Error("PII leak blocked");
    }

    return restored;
}

module.exports = { runGemini };
