import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Activity,
  Stethoscope,
  BookOpen,
  Shield,
  MapPin,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { key: "Navbar.home", icon: Home, path: "/" },
  { key: "Navbar.symptomAnalyzer", icon: Activity, path: "/symptom-analyzer" },
  { key: "Navbar.symptomChecker", icon: Stethoscope, path: "/symptom-checker" },
  { key: "Navbar.diseases", icon: BookOpen, path: "/diseases" },
  { key: "Navbar.prevention", icon: Shield, path: "/prevention" },
  { key: "Navbar.findClinics", icon: MapPin, path: "/clinics" },
  { key: "Navbar.emergency", icon: AlertCircle, path: "/emergency" },
];

const languages = [
  { code: "as", label: "অসমীয়া" }, // Assamese
  { code: "bn", label: "বাংলা" }, // Bengali
  { code: "dg", label: "डोगरी" }, // Dogri
  { code: "en", label: "English" }, // English
  { code: "gu", label: "ગુજરાતી" }, // Gujarati
  { code: "hi", label: "हिन्दी" }, // Hindi
  { code: "kc", label: "કચ્છી" }, // Kachi
  { code: "kn", label: "ಕನ್ನಡ" }, // Kannada
  { code: "ka", label: "کٲشُر" }, // Kashmiri
  { code: "ko", label: "कोंकणी" }, // Konkani
  { code: "mt", label: "मैथिली" }, // Maithili
  { code: "mr", label: "मराठी" }, // Marathi
  { code: "ne", label: "नेपाली" }, // Nepali
  { code: "or", label: "ଓଡ଼ିଆ" }, // Odia
  { code: "pa", label: "ਪੰਜਾਬੀ" }, // Punjabi
  { code: "sa", label: "संस्कृतम्" }, // Sanskrit
  { code: "sd", label: "सिंधी" }, // Sindhi (Devanagari)
  { code: "ta", label: "தமிழ்" }, // Tamil
  { code: "te", label: "తెలుగు" }, // Telugu
  { code: "ur", label: "اردو" }, // Urdu
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        langOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  /* Close dropdown on ESC */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setLangOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className="
      sticky top-0 z-50
      bg-white/70 backdrop-blur-md
      supports-backdrop-filter:bg-white/60
      border-b border-white/30 shadow-lg
      transition-colors duration-300
      print-hide
    "
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          replace
          onClick={() => window.scrollTo({ top: 0 })}
          className="flex items-center gap-3 whitespace-nowrap shrink-0"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4F8CFF, #34D399)" }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6c-1.9-1.7-4.9-1.4-6.6.6L12 7.4l-2.2-2.2c-1.7-2-4.7-2.3-6.6-.6-2.1 1.9-2.2 5.1-.3 7.1l8.1 8.1 8.1-8.1c1.9-2 1.8-5.2-.3-7.1z" />
            </svg>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-blue-600">HealthBuddy</span>
            <span className="text-sm text-gray-600">Your Health Companion</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="mx-4 hidden lg:flex">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`
                    flex items-center gap-2
                    h-10 px-4
                    rounded-lg
                    text-sm whitespace-nowrap
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon size={16} className="shrink-0" />
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative hidden sm:block">
            <button
              ref={buttonRef}
              onClick={() => setLangOpen((v) => !v)}
              className="
                flex items-center gap-2
                h-10 px-4 cursor-pointer
                text-sm font-medium
                bg-white
                border border-gray-400
                rounded-lg
                shadow-md
                transition-all
                hover:bg-gray-100 hover:shadow-lg
                active:scale-[0.97]
              "
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              {languages.find((l) => l.code === i18n.language)?.label ||
                "Language"}
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langOpen && (
              <div
                ref={dropdownRef}
                className="
      absolute right-0 mt-2 w-44
      bg-white border border-gray-200
      rounded-xl shadow-lg
      z-50
      overflow-hidden
    "
              >
                <div
                  className="
        max-h-80 overflow-y-auto pr-1
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
      "
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`
            w-full text-left
            px-4 py-2 text-sm cursor-pointer
            transition-colors
            hover:bg-blue-200 active:bg-blue-100
            ${lang.code === i18n.language ? "bg-blue-100 font-semibold" : ""}
          `}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsDark((v) => !v)}
            aria-label="Toggle dark mode"
            className={`
    relative mx-4 w-10 h-10 cursor-pointer
    flex items-center justify-center
    rounded-lg
    border border-gray-400
    shadow-md
    transition-all duration-300
    active:scale-90

    ${
      isDark
        ? "bg-[#202123] hover:bg-[#243447] border-[#2E3B4E]"
        : "bg-white hover:bg-gray-100 border-gray-400"
    }
    }
  `}
          >
            {/* Sun */}
            <Sun
              className={`
      absolute w-6 h-6 text-yellow-700
      transition-all duration-500 ease-in-out
      ${
        isDark
          ? "opacity-0 rotate-90 scale-0"
          : "opacity-100 rotate-0 scale-100"
      }
    `}
            />

            {/* Moon */}
            <Moon
              className={`
      absolute w-6 h-6 text-gray-300
      transition-all duration-500 ease-in-out
      ${
        isDark
          ? "opacity-100 rotate-0 scale-100"
          : "opacity-0 -rotate-90 scale-0"
      }
    `}
            />
          </button>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
