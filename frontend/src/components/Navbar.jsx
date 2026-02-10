import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "or", label: "ଓଡ଼ିଆ" },
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        desktopLangOpen &&
        buttonRef.current &&
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

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setDesktopLangOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      role="banner"
      data-testid="navbar"
      className={`
        fixed top-0 left-0 right-0 z-50 h-16
        print-hide transition-all duration-300
        /* Glassmorphism for Desktop */
        lg:backdrop-blur-sm
        ${
          showDarkUI
            ? "lg:bg-slate-900/80 lg:border-b lg:border-white/10 lg:shadow-lg bg-[#121418] border-b border-white/5"
            : "lg:bg-white/80 lg:border-b lg:border-white/30 lg:shadow-lg bg-[#f8fafc] border-b border-black/5"
        }
      `}
    >
      {/* FLUID CONTAINER 
          - gap-4: ensures elements never touch.
          - justify-between: pushes Logo Left, Nav Center, Controls Right.
      */}
      <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* --- LEFT: LOGO --- 
            shrink-0: Ensures logo NEVER shrinks, even on extreme zoom.
        */}
        <Link
          to="/"
          replace
          aria-label="App Logo"
          className="flex items-center gap-2 shrink-0 select-none"
          onClick={() => requestAnimationFrame(() => window.scrollTo(0, 0))}
        >
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-xl border border-gray-300"
            style={{ background: "linear-gradient(135deg, #4F8CFF, #34D399)" }}
          >
            <img
                src="/app_logo.png"
                alt="Rurivia AI Logo"
                className="w-full h-full object-contain "
                draggable={false}
            />
          </div>
          <div className="flex flex-col leading-tight">
            {/* Text size automatically adjusts or hides on very small mobile screens via CSS if needed, but here we keep it simple */}
            <span
              className={`text-xl font-bold tracking-tight ${showDarkUI ? "text-white" : "text-slate-800"}`}
            >
              Rurivia.AI
            </span>
            <span
              className={`text-[10px] font-semibold hidden sm:block ${showDarkUI ? "text-slate-200" : "text-slate-800"}`}
            >
              Health Companion
            </span>
          </div>
        </Link>

        {/* --- MOBILE SPACER --- */}
        <div className="flex-1 lg:hidden" />

        {/* --- CENTER: DESKTOP NAV --- 
            - flex-1: Takes available space.
            - min-w-0: Critical! Allows the flex child to shrink below its content size if needed.
        */}
        <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2">
          <div className="flex items-center gap-1 xl:gap-2">
            {memoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              const baseClasses = `
                flex items-center justify-center gap-2
                h-10 px-3 rounded-lg
                text-sm font-medium whitespace-nowrap
                transition-all duration-200 ease-out
                border border-transparent
              `;

              let itemClasses = "";
              if (showDarkUI) {
                // FIXED: Standard dark hover (slate-800) for items
                itemClasses = isActive
                  ? "bg-white/10 text-blue-300 border-white/5"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200";
              } else {
                itemClasses = isActive
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
              }

              return (
                <Link
                  key={item.key}
                  to={item.path}
                  title={t(item.key)} // Tooltip ensures usability when text is hidden
                  className={`${baseClasses} ${itemClasses}`}
                >
                  <Icon size={20} className="shrink-0" />

                  {/* --- THE MAGIC FIX ---
                      hidden xl:block:
                      1. On Laptops/Tablets (lg): Text is HIDDEN (Icon Only).
                      2. On Large Screens (xl): Text is SHOWN.
                      3. On Zoom In: Browser width shrinks effectively -> Nav auto-switches to Icon Only mode.
                  */}
                  <span className="hidden xl:block max-w-[120px] truncate">
                    {t(item.key)}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* --- RIGHT: CONTROLS --- 
            shrink-0: Ensures these buttons never get crushed.
        */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Language */}
          <div className="relative hidden sm:block">
            <button
              ref={buttonRef}
              onClick={() => setDesktopLangOpen((v) => !v)}
              className={`
                flex items-center gap-2
                h-9 px-3
                text-sm font-medium
                rounded-lg border
                transition-all duration-200 cursor-pointer
                ${
                  showDarkUI
                    ? /* FIX: hover:bg-slate-700 is distinct and visible in dark mode. 
                       Removed 'hover:bg-white' to prevent blinding contrast issues. */
                      "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-500 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300"
                }
              `}
            >
              {/* Responsive Text: Hides label on smaller laptops, shows code */}
              <span className="hidden xl:inline truncate max-w-[80px]">
                {memoLanguages.find((l) => l.code === i18n.language)?.label ||
                  "Lang"}
              </span>
              <span className="xl:hidden">{i18n.language.toUpperCase()}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${desktopLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            {desktopLangOpen && (
              <div
                ref={dropdownRef}
                className={`
                  absolute right-0 mt-2 w-40
                  border rounded-xl shadow-xl z-50 overflow-hidden cursor-pointer
                  ${showDarkUI ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}
                `}
              >
                {memoLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      w-full text-left px-4 py-2 text-sm hover:opacity-80 cursor-pointer
                      ${showDarkUI ? "text-slate-200 hover:bg-slate-600" : "text-slate-800 hover:bg-slate-200"}
                    `}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              relative w-9 h-9 hidden sm:flex
              items-center justify-center
              rounded-lg border cursor-pointer 
              transition-colors
              ${
                showDarkUI
                  ? "bg-slate-800 border-slate-700 text-indigo-500 hover:bg-blue-400 hover:text-indigo-300"
                  : "bg-white border-slate-200 text-yellow-400 hover:text-slate-600 hover:bg-amber-100"
              }
            `}
          >
            <Sun
              size={18}
              className={`absolute transition-all ${showDarkUI ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
            />
            <Moon
              size={18}
              className={`absolute transition-all ${showDarkUI ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            />
          </button>

          {/* ********************************************************************************* */}

          {/* --- MOBILE DRAWER TOGGLE --- */}
          <div className="lg:hidden flex items-center gap-3">
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
                  className="material-symbols-rounded text-xl text-red-600 mx-2 my-1.5"
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
