import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  const memoNavItems = useMemo(() => navItems, []);
  const memoLanguages = useMemo(() => languages, []);
  const memoEmergencyNumbers = useMemo(() => emergencyNumbers, []);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileEmergencyOpen, setMobileEmergencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const mobileEmergencyRef = useRef(null);
  const mobileEmergencyBtnRef = useRef(null);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const showDarkUI = isDark;

  /* =========================
     LANGUAGE CHANGE
  ========================== */
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  };

  /* =========================
     LOGOUT HANDLER
  ========================== */
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  /* =========================
     OUTSIDE CLICK HANDLERS
  ========================== */
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
      if (e.key === "Escape") {
        setDesktopLangOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* =========================
     PREVENT FLICKER
  ========================== */
  if (loading) return null;

  return (
    <header
      role="banner"
      data-testid="navbar"
      className={`
        fixed top-0 left-0 right-0 z-50 h-16
        print-hide transition-all duration-300
        lg:backdrop-blur-sm
        ${
          showDarkUI
            ? "lg:bg-slate-900/80 lg:border-b lg:border-white/10 lg:shadow-lg bg-[#121418] border-b border-white/5"
            : "lg:bg-white/80 lg:border-b lg:border-white/30 lg:shadow-lg bg-[#f8fafc] border-b border-black/5"
        }
      `}
    >
      <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* LOGO */}
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
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span
              className={`text-xl font-bold ${showDarkUI ? "text-white" : "text-slate-800"}`}
            >
              Rurivia.AI
            </span>
            <span
              className={`text-[10px] hidden sm:block ${showDarkUI ? "text-slate-200" : "text-slate-800"}`}
            >
              Health Companion
            </span>
          </div>
        </Link>

        <div className="flex-1 lg:hidden" />

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2">
          <div className="flex items-center gap-1 xl:gap-2">
            {memoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              const itemClasses = showDarkUI
                ? isActive
                  ? "bg-white/10 text-blue-300 border-white/5"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                : isActive
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium border border-transparent transition ${itemClasses}`}
                >
                  <Icon size={20} />
                  <span className="hidden xl:block truncate">
                    {t ? t(item.key) : item.key}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* LANGUAGE */}
          <div className="relative hidden sm:block">
            <button
              ref={buttonRef}
              onClick={() => setDesktopLangOpen((v) => !v)}
              className={`flex items-center gap-2 h-9 px-3 rounded-lg cursor-pointer border text-sm ${
                showDarkUI
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className="hidden xl:inline">
                {memoLanguages.find((l) => l.code === i18n.language)?.label}
              </span>
              <span className="xl:hidden">{i18n.language.toUpperCase()}</span>
              <ChevronDown size={14} />
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
                      ${showDarkUI ? "text-slate-200 hover:bg-slate-600" : "text-slate-800 hover:bg-slate-300"}
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
          {/* AUTH DESKTOP */}
          <div className="hidden sm:flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`h-9 px-4 flex items-center rounded-lg text-sm font-medium border ${
                    showDarkUI
                      ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="h-9 px-4 flex items-center rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden ${
                    showDarkUI
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border z-50 ${
                      showDarkUI
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* **************************************************************  */}
          {/* Mobile View*/}
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
    absolute top-full right-0 mt-4 w-48
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

              {/* Mobile Auth */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 mt-1"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : user?.displayName ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                      {user.displayName[0]}
                    </div>
                  ) : (
                    <span className="material-symbols-rounded text-2xl">
                      account_circle
                    </span>
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
    absolute top-full right-0 mt-4 w-28
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
                    {!user ? (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          Login
                        </Link>

                        <Link
                          to="/signup"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          Sign Up
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
