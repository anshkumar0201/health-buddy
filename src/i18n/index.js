import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import as from "./locales/assamese.json";
import bn from "./locales/bengali.json";
import dg from "./locales/dogri.json";
import en from "./locales/english.json";
import gu from "./locales/gujarati.json";
import hi from "./locales/hindi.json";
import kc from "./locales/kachi.json";
import kn from "./locales/kannada.json";
import ka from "./locales/kashmiri.json";
import ko from "./locales/konkani.json";
import mt from "./locales/maithili.json";
import mr from "./locales/marathi.json";
import ne from "./locales/nepali.json";
import or from "./locales/odia.json";
import pa from "./locales/punjabi.json";
import sa from "./locales/sanskrit.json";
import sd from "./locales/sindhi.json";
import ta from "./locales/tamil.json";
import te from "./locales/telugu.json";
import ur from "./locales/urdu.json";



i18n.use(initReactI18next).init({
    resources: {
        
        as: { translation: as },
        bn: { translation: bn },
        dg: { translation: dg },
        en: { translation: en },
        gu: { translation: gu },
        hi: { translation: hi },
        kc: { translation: kc },
        kn: { translation: kn },
        ka: { translation: ka },
        ko: { translation: ko },
        mt: { translation: mt },
        mr: { translation: mr },
        ne: { translation: ne },
        or: { translation: or },
        pa: { translation: pa },
        sa: { translation: sa },
        sd: { translation: sd },
        ta: { translation: ta },
        te: { translation: te },
        ur: { translation: ur },
    },
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
