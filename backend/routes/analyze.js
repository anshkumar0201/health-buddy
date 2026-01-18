const express = require("express");
const {
    analyzeSymptomsWithGemini,
} = require("../services/geminiService");

const router = express.Router();

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
