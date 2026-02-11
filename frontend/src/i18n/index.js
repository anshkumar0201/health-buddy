import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        lng: localStorage.getItem("lang") || "en",

        supportedLngs: [
            "as", "bn", "dg", "en", "gu", "hi", "kc", "kn",
            "ka", "ko", "mt", "mr", "ne", "or", "pa",
            "sa", "sd", "ta", "te", "ur"
        ],

        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: true,
        },
    });

export default i18n;
