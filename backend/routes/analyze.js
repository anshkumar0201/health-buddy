const express = require("express");
const {
    analyzeSymptomsWithGemini,
} = require("../services/geminiService");

const router = express.Router();
const medicalTerms = require("../../shared/medical/medical-terms.json");

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
   MEDICAL SEMANTIC GATES (BACKEND)
   ====================================================== */

const MEDICAL_SETS = {
    symptoms: new Set(medicalTerms.symptoms),
    bodyParts: new Set(medicalTerms.bodyParts),
    severity: new Set(medicalTerms.severity),
    duration: new Set(medicalTerms.duration),
};

function hasMedicalSignal(text, minMatches = 2) {
    const words = text
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/);

    let matches = 0;
    for (const w of words) {
        if (
            MEDICAL_SETS.symptoms.has(w) ||
            MEDICAL_SETS.bodyParts.has(w) ||
            MEDICAL_SETS.severity.has(w) ||
            MEDICAL_SETS.duration.has(w)
        ) {
            matches++;
            if (matches >= minMatches) return true;
        }

    }
    return false;
}

function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function hasSymptomStructure(text) {
    let flags = {
        symptom: false,
        body: false,
        duration: false,
        severity: false,
    };

    for (const word of tokenize(text)) {
        if (MEDICAL_SETS.symptoms.has(word)) flags.symptom = true;
        if (MEDICAL_SETS.bodyParts.has(word)) flags.body = true;
        if (MEDICAL_SETS.duration.has(word)) flags.duration = true;
        if (MEDICAL_SETS.severity.has(word)) flags.severity = true;
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
