import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
// 1. IMPORT THE HOOK
import { useTheme } from "../context/ThemeContext";
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
  { code: "as", label: "অসমীয়া" },
  { code: "bn", label: "বাংলা" },
  { code: "dg", label: "डोगरी" },
  { code: "en", label: "English" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "hi", label: "हिन्दी" },
  { code: "kc", label: "કચ્છી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ka", label: "کٲشُر" },
  { code: "ko", label: "कोंकणी" },
  { code: "mt", label: "मैथिली" },
  { code: "mr", label: "मराठी" },
  { code: "ne", label: "नेपाली" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "sd", label: "सिंधी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ur", label: "اردو" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // 2. USE THE CONTEXT (Replaces all local state & cookie logic)
  const { theme, toggleTheme } = useTheme();

  // 3. Derive UI state from Context
  const isDark = theme === "dark";
  const showDarkUI = isDark;

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

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

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setLangOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50
        backdrop-blur-md
        transition-colors duration-300 ease-in-out
        print-hide
        ${
          showDarkUI
            ? "bg-slate-900/70 border-b border-white/10 shadow-lg"
            : "bg-white/70 border-b border-white/30 shadow-lg"
        }
      `}
    >
      <div className="w-full px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          replace
          onClick={() => window.scrollTo({ top: 0 })}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 outline-none focus:outline-none"
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
            <span
              className={`text-2xl font-bold ${showDarkUI ? "text-blue-400" : "text-blue-600"}`}
            >
              Qura
            </span>
            <span
              className={`text-sm ${showDarkUI ? "text-gray-200" : "text-gray-600"}`}
            >
              Your Health Companion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              const baseClasses = `
                flex items-center gap-2
                h-10 px-3 xl:px-4
                rounded-lg
                text-sm whitespace-nowrap
                transition-all duration-300 ease-in-out
                border
                outline-none focus:outline-none
              `;

              let itemClasses = "";

              if (showDarkUI) {
                if (isActive) {
                  itemClasses =
                    "bg-white/15 text-blue-200 font-semibold border-white/10 shadow-sm";
                } else {
                  itemClasses =
                    "text-gray-300 border-transparent hover:bg-white/10 hover:text-white font-medium";
                }
              } else {
                if (isActive) {
                  itemClasses =
                    "bg-blue-100 text-blue-600 font-semibold border-blue-100";
                } else {
                  itemClasses =
                    "text-gray-600 border-transparent hover:bg-gray-200 font-medium";
                }
              }

              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`${baseClasses} ${itemClasses}`}
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
              className={`
                flex items-center gap-2
                h-10 px-4 cursor-pointer
                text-sm font-medium
                rounded-lg shadow-md
                transition-all duration-300
                active:scale-[0.97]
                ${
                  showDarkUI
                    ? "bg-white/10 border border-white/20 text-gray-100 hover:bg-white/20"
                    : "bg-white border border-gray-400 hover:bg-gray-100 hover:shadow-lg"
                }
              `}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              {languages.find((l) => l.code === i18n.language)?.label ||
                "Language"}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div
                ref={dropdownRef}
                className={`
                  absolute right-0 mt-2 w-44
                  border rounded-xl shadow-lg z-50 overflow-hidden backdrop-blur-xl
                  transition-all duration-300
                  ${showDarkUI ? "bg-slate-900/90 border-white/10" : "bg-white border-gray-200"}
                `}
              >
                <div
                  className={`
                    max-h-80 overflow-y-auto pr-1
                    scrollbar-thin scrollbar-track-transparent
                    ${showDarkUI ? "scrollbar-thumb-gray-600" : "scrollbar-thumb-gray-300"}
                  `}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`
                        w-full text-left
                        px-4 py-2 text-sm cursor-pointer
                        transition-colors duration-200
                        ${
                          showDarkUI
                            ? "text-gray-200 hover:bg-white/10 active:bg-white/20"
                            : "hover:bg-blue-200 active:bg-blue-100"
                        }
                        ${
                          lang.code === i18n.language
                            ? showDarkUI
                              ? "bg-white/15 text-white font-semibold"
                              : "bg-blue-100 font-semibold"
                            : ""
                        }
                      `}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {
            <button
              onClick={toggleTheme} // 4. CALL THE CONTEXT FUNCTION
              aria-label="Toggle dark mode"
              className={`
                relative w-10 h-10 cursor-pointer
                flex items-center justify-center
                rounded-lg shadow-md
                transition-all duration-300
                active:scale-90
                ${
                  showDarkUI
                    ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                    : "bg-white hover:bg-gray-100 border border-gray-400"
                }
              `}
            >
              <Sun
                className={`
                  absolute w-5 h-5 text-yellow-500
                  transition-all duration-500 ease-in-out
                  ${showDarkUI ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}
                `}
              />
              <Moon
                className={`
                  absolute w-5 h-5 text-white
                  transition-all duration-500 ease-in-out
                  ${showDarkUI ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}
                `}
              />
            </button>
          }

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${showDarkUI ? "text-white" : "text-gray-800"}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
