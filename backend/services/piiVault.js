const crypto = require("crypto");

/* ======================================================
   🔒 ENTERPRISE-GRADE PII DETECTION
   ====================================================== */

const PII_PATTERNS = {
    EMAIL: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}\b/gi,
    PHONE: /\b(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}\b/g,
    CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
    SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
    AADHAAR: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
    PAN: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g
};

const vault = new Map();

/* ======================================================
   🔐 TOKENIZER
   ====================================================== */
function tokenize(value) {
    const token = `__PII_${crypto.randomUUID()}__`;
    vault.set(token, value);
    return token;
}

/* ======================================================
   🧼 SANITIZER (before Gemini)
   ====================================================== */
function sanitize(text) {
    if (!text) return { clean: text, hasPII: false };

    let clean = text;
    let found = false;

    for (const regex of Object.values(PII_PATTERNS)) {
        clean = clean.replace(regex, (match) => {
            found = true;
            return tokenize(match);
        });
    }

    return { clean, hasPII: found };
}

/* ======================================================
   🔄 RESTORE (after Gemini)
   ====================================================== */
function restore(text) {
    if (!text) return text;

    for (const [token, value] of vault.entries()) {
        text = text.replaceAll(token, value);
    }

    return text;
}

/* ======================================================
   🚫 OUTPUT GUARD (block model hallucinating PII)
   ====================================================== */
function outputHasPII(text) {
    if (!text) return false;
    return Object.values(PII_PATTERNS).some((r) => r.test(text));
}

module.exports = {
    sanitize,
    restore,
    outputHasPII
};
