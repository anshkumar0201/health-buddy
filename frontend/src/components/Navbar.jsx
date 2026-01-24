import { useState, useRef, useEffect, useMemo } from "react";
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


const emergencyNumbers = [
  { label: "Ambulance Service", number: "108" },
  { label: "Health Helpline", number: "104" },
  { label: "Medical Emergency", number: "102" },
  { label: "National Emergency Number", number: "112" },
];

const languages = [
  // { code: "as", label: "অসমীয়া" },
  // { code: "bn", label: "বাংলা" },
  // { code: "dg", label: "डोगरी" },
  { code: "en", label: "English" },
  // { code: "gu", label: "ગુજરાતી" },
  { code: "hi", label: "हिन्दी" },
  // { code: "kc", label: "કચ્છી" },
  // { code: "kn", label: "ಕನ್ನಡ" },
  // { code: "ka", label: "کٲشُر" },
  // { code: "ko", label: "कोंकणी" },
  // { code: "mt", label: "मैथिली" },
  // { code: "mr", label: "मराठी" },
  // { code: "ne", label: "नेपाली" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  // { code: "pa", label: "ਪੰਜਾਬੀ" },
  // { code: "sa", label: "संस्कृतम्" },
  // { code: "sd", label: "सिंधी" },
  // { code: "ta", label: "தமிழ்" },
  // { code: "te", label: "తెలుగు" },
  // { code: "ur", label: "اردو" },
];


export default function Navbar() {
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const memoNavItems = useMemo(() => navItems, []);
  const memoLanguages = useMemo(() => languages, []);
  const memoEmergencyNumbers = useMemo(() => emergencyNumbers, []);


  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const showDarkUI = isDark;

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const mobileDropdownRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const [mobileEmergencyOpen, setMobileEmergencyOpen] = useState(false);
  const mobileEmergencyRef = useRef(null);
  const mobileEmergencyBtnRef = useRef(null);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  };

  //Desktop outside click only
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        desktopLangOpen &&
        buttonRef.current && // desktop button only
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setDesktopLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [desktopLangOpen]);

  // Mobile outside click only
  // useEffect(() => {
  //   function handleMobileClickOutside(e) {
  //     if (
  //       mobileLangOpen &&
  //       mobileButtonRef.current &&
  //       mobileDropdownRef.current &&
  //       !mobileDropdownRef.current.contains(e.target) &&
  //       !mobileButtonRef.current.contains(e.target)
  //     ) {
  //       setMobileLangOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleMobileClickOutside);
  //   return () =>
  //     document.removeEventListener("mousedown", handleMobileClickOutside);
  // }, [mobileLangOpen]);

  // //Mobile Outside only
  // useEffect(() => {
  //   function handleEmergencyClickOutside(e) {
  //     if (
  //       mobileEmergencyOpen &&
  //       mobileEmergencyBtnRef.current &&
  //       mobileEmergencyRef.current &&
  //       !mobileEmergencyRef.current.contains(e.target) &&
  //       !mobileEmergencyBtnRef.current.contains(e.target)
  //     ) {
  //       setMobileEmergencyOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleEmergencyClickOutside);
  //   return () =>
  //     document.removeEventListener("mousedown", handleEmergencyClickOutside);
  // }, [mobileEmergencyOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setDesktopLangOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`
    sticky top-0 z-50 h-16
    print-hide

    /* Desktop stays same */
    lg:backdrop-blur-md
    ${
      showDarkUI
        ? "lg:bg-slate-900/70 lg:border-b lg:border-white/10 lg:shadow-lg"
        : "lg:bg-white/70 lg:border-b lg:border-white/30 lg:shadow-lg"
    }

    /* Mobile M3 */
    ${
      showDarkUI
        ? "bg-[#121418] border-b border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
        : "bg-[#f8fafc] border-b border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
    }
  `}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-start lg:justify-between">
        {/* Logo */}
        <Link
          to="/"
          replace
          onClick={() => requestAnimationFrame(() => window.scrollTo(0, 0))}
          className="flex items-center gap-2 shrink-0"
        >
          <div
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #4F8CFF, #34D399)",
            }}
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
            <span className="text-xl sm:text-2xl font-bold">Qura</span>
            <span className="text-[10px] sm:text-sm">
              Your Health Companion
            </span>
          </div>
        </Link>

        <div className="flex-1 lg:hidden" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <div className="flex items-center gap-2">
            {memoNavItems.map((item) => {
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
              onClick={() => setDesktopLangOpen((v) => !v)}
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
              aria-expanded={desktopLangOpen}
            >
              {memoLanguages.find((l) => l.code === i18n.language)?.label ||
                "Language"}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${desktopLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            {desktopLangOpen && (
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
                  {memoLanguages.map((lang) => (
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
                hidden sm:flex
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

          {/* ********************************************************************************* */}

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center pr-3">
            {/* Right mobile group */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Mobile Language */}
              <button
                ref={mobileButtonRef}
                onClick={() => setMobileLangOpen((prev) => !prev)}
                onBlur={() => setMobileLangOpen(false)}
                className={`
    flex items-center gap-1
    px-1 py-1 rounded-lg
    text-xs font-semibold
    ${
      showDarkUI
        ? "bg-slate-900/90 border border-gray-500 shadow-amber-200 text-gray-300"
        : "bg-white text-gray-600 border border-gray-400 shadow-gray-700"
    }
  `}
              >
                {i18n.language.toUpperCase()}
                <span
                  className={`
      material-symbols-rounded text-sm
      transition-transform duration-300
      ${mobileLangOpen ? "rotate-180" : ""}
    `}
                >
                  expand_more
                </span>
              </button>

              <div className="lg:hidden relative flex items-center gap-1">
                {mobileLangOpen && (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    ref={mobileDropdownRef}
                    className={`
    absolute top-full right-0 mt-8 w-28
    rounded-xl
    z-[9999]
    
    border
    shadow-[0_8px_32px_rgba(0,0,0,0.25)]
    animate-fade-in
    transition-all duration-300
          ${
            isDark
              ? "bg-[#1a1f27] border-gray-400/25 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
              : "bg-white border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.7)]"
          }
        `}
                  >
                    {memoLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setMobileLangOpen(false);
                        }}
                        className={`
    w-full text-left px-4 py-2 text-sm
    transition-all duration-200
    flex items-center justify-between
    ${showDarkUI ? "text-gray-300 hover:bg-white/10" : "hover:bg-blue-100"}
    ${lang.code === i18n.language ? "font-semibold scale-[1.02]" : ""}
  `}
                      >
                        {lang.label}
                        {lang.code === i18n.language && (
                          <span className="material-symbols-rounded text-base">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="material-symbols-rounded text-xl font-light"
              >
                {showDarkUI ? "dark_mode" : "light_mode"}
              </button>

              {/* Mobile Emergency */}
              <div className="relative">
                <button
                  ref={mobileEmergencyBtnRef}
                  onClick={() => setMobileEmergencyOpen((v) => !v)}
                  onBlur={() => setMobileEmergencyOpen(false)}
                  className="material-symbols-rounded text-xl text-red-600 mx-2"
                >
                  phone
                </button>
                <div className="lg:hidden relative flex items-center gap-1">
                  {mobileEmergencyOpen && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      ref={mobileEmergencyRef}
                      className={`
    absolute top-full right-0 mt-8 w-48
    rounded-xl
    z-[9999]
    
    border
    shadow-[0_8px_32px_rgba(0,0,0,0.25)]
    animate-fade-in
    transition-all duration-300
          ${
            isDark
              ? "bg-[#1a1f27] border-gray-400/25 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
              : "bg-white border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.7)]"
          }
        `}
                    >
                      {memoEmergencyNumbers.map((item) => (
                        <button
                          key={item.number}
                          onClick={() => {
                            window.location.href = `tel:${item.number}`;
                            setMobileEmergencyOpen(false);
                          }}
                          className={`
            w-full text-left px-2 py-2 text-sm
            flex justify-between items-center
            transition-all
            ${
              showDarkUI
                ? "text-gray-200 hover:bg-white/15"
                : "hover:bg-white/40"
            }
          `}
                        >
                          {" "}
                          {item.label}
                          <span className="font-mono font-bold">
                            {item.number}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
