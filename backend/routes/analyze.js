const express = require("express");
const {
    analyzeSymptomsWithGemini,
} = require("../services/geminiService");

const router = express.Router();
const medicalTerms = require("../../frontend/shared/medical/medical-terms.json");

/* ======================================================
   INPUT VALIDATION (STRICT INVALID BLOCK)
   ====================================================== */
function isTextValidEnough(text, maxInvalidRatio = 0.4) {
    if (!text) return false;

    const cleaned = text
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .trim();

    const words = cleaned.split(/\s+/).filter(Boolean);

    // Too short to judge meaningfully
    if (words.length < 3) return false;

    let validWords = 0;
    let invalidWords = 0;

    for (const word of words) {
        // Ignore short connector words
        if (word.length < 3) continue;

        // Reject repeated-character garbage
        if (/^(.)\1{3,}$/.test(word)) {
            invalidWords++;
            continue;
        }

        // Reject random consonant clusters
        if (!/[aeiou]/.test(word)) {
            invalidWords++;
            continue;
        }

        validWords++;
    }

    const total = validWords + invalidWords;

    // Avoid NaN (0 / 0)
    if (total === 0) return false;

    return (invalidWords / total) < maxInvalidRatio;
}

/* ======================================================
   MEDICAL SEMANTIC GATES (BACKEND – TOLERANT)
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
            isCloseSymptom(w)
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


/* ======================================================
   ROUTE
   ====================================================== */
router.post("/", async (req, res) => {
    try {
        const { text, locale } = req.body;

        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: "Invalid input" });
        }

        if (text.trim().length < 10) {
            return res.status(400).json({
                error: "Input too short for analysis",
            });
        }

        // Soft clarity gate
        if (!isTextValidEnough(text, 0.4)) {
            return res.json({
                status: "needs_more_info",
                message:
                    "Please add more details such as pain severity, swelling, fever, or progression.",
            });
        }

        /* ======================================================
   🏥 MEDICAL MEANING GATES (BACKEND)
   ====================================================== */

        if (!hasMedicalSignal(text, 2)) {
            return res.json({
                status: "needs_more_info",
                message:
                    "Please describe specific symptoms, affected body parts, and duration.",
            });
        }

        if (!hasSymptomStructure(text)) {
            return res.json({
                status: "needs_more_info",
                message:
                    "Include symptom type, body location, and how long it has been occurring.",
            });
        }


        const result = await analyzeSymptomsWithGemini(
            text,
            locale || "en"
        );

        return res.json(result);
    } catch (err) {
        console.error("🔥 Analyze route error:", err);

        return res.status(500).json({
            error: "AI analysis failed",
        });
    }
});

module.exports = router;
