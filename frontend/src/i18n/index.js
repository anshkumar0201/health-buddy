import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",

        // allow detector to choose language (faster + non-blocking)
        lng: undefined,

        supportedLngs: [
            "as", "bn", "dg", "en", "gu", "hi", "kc", "kn",
            "ka", "ko", "mt", "mr", "ne", "or", "pa",
            "sa", "sd", "ta", "te", "ur"
        ],

        // prevents en-US → en double requests
        load: "languageOnly",

        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },

        detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

export default i18n;
