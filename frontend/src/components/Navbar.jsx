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
  LogOut,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Globe,
  Check,
  LogIn,
  UserPlus,
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
  // const [mobileLangOpen, setMobileLangOpen] = useState(false);
  // const [mobileEmergencyOpen, setMobileEmergencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState("main");

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // const mobileDropdownRef = useRef(null);
  // const mobileButtonRef = useRef(null);
  // const mobileEmergencyRef = useRef(null);
  // const mobileEmergencyBtnRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMoreRef = useRef(null);

  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const showDarkUI = isDark;

  const currentLang = (i18n.language || "en").split("-")[0];

  /* =========================
     LANGUAGE CHANGE
  ========================== */
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setDesktopLangOpen(false);
    // setMobileLangOpen(false);
  };

  /* =========================
     LOGOUT HANDLER
  ========================== */
  const handleLogout = () => {
    setUserMenuOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMoreOpen(false);
  }, [location.pathname]);

  /* =========================
     OUTSIDE CLICK HANDLERS
  ========================== */
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }

      if (mobileMoreRef.current && !mobileMoreRef.current.contains(e.target)) {
        setMobileMoreOpen(false);
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
        setMobileMoreOpen(false); // 👉 ADDED
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
    <>
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
              style={{
                background: "linear-gradient(135deg, #4F8CFF, #34D399)",
              }}
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
          <div
            ref={userMenuRef}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
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
                <span>{currentLang.toUpperCase()}</span>
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
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen((v) => !v);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center cursor-pointer justify-center border overflow-hidden ${
                      showDarkUI
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {user?.photoURL && !imgError ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                        {(
                          user?.displayName?.[0] ||
                          user?.email?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-xl border z-50 ${
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
                        className="w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
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
              {/* Added relative here so the dropdown can overlay BOTH buttons */}
              <div
                className="flex items-center gap-3 sm:gap-3 ml-auto relative"
                ref={mobileMoreRef}
              >
                {/* Mobile Auth Button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen((v) => !v);
                      setMobileMoreOpen(false);
                    }}
                    className="flex items-center justify-center w-8 h-8 mt-0.5 border border-transparent rounded-full"
                  >
                    {user?.photoURL && !imgError ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                    ) : user?.displayName || user?.email ? (
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                        {(
                          user?.displayName?.[0] ||
                          user?.email?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </div>
                    ) : (
                      <span
                        className={`material-symbols-rounded text-3xl ${showDarkUI ? "text-gray-300" : "text-gray-600"}`}
                      >
                        account_circle
                      </span>
                    )}
                  </button>

                  {/* Legacy Auth Dropdown (only visible if More is closed) */}
                  {userMenuOpen && !mobileMoreOpen && (
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`
                  absolute top-[-8px] right-[-4px] w-48 rounded-2xl z-[9999] border 
                  shadow-[0_8px_32px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-200 flex flex-col p-1.5 gap-1 
                  ${showDarkUI ? "bg-[#1a1f27] border-gray-600 shadow-[0_8px_24px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.15)]"}
                `}
                    >
                      {!user ? (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                          >
                            <LogIn size={18} />
                            Login
                          </Link>
                          <div
                            className={`h-px w-full ${showDarkUI ? "bg-gray-700" : "bg-gray-200"}`}
                          />
                          <Link
                            to="/signup"
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                          >
                            <UserPlus size={18} />
                            Sign Up
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                          >
                            <User size={18} />
                            Profile
                          </Link>
                          <div
                            className={`h-px w-full my-1 ${showDarkUI ? "bg-gray-700" : "bg-gray-200"}`}
                          />
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm font-medium ${showDarkUI ? "hover:bg-white/10 text-red-400" : "hover:bg-red-50 text-red-600"}`}
                          >
                            <LogOut size={18} />
                            Logout
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile 3-Dots Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuView("main"); // Always start on main view
                    setMobileMoreOpen((v) => !v);
                    setUserMenuOpen(false);
                  }}
                  className={`p-1 flex items-center justify-center rounded-lg transition-colors mt-0.5 ${
                    showDarkUI
                      ? "text-gray-300 hover:bg-slate-800"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <MoreVertical size={24} />
                </button>

                {/* Telegram-Style Overlay Menu */}
                {mobileMoreOpen && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`
                  absolute top-[-8px] right-[-6px] w-64 rounded-2xl z-[9999] border 
                  shadow-[0_8px_32px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-200 flex flex-col p-1.5 gap-1 
                  ${showDarkUI ? "bg-[#1a1f27] border-gray-600 shadow-[0_8px_24px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.15)]"}
                `}
                  >
                    {/* =====================
                      VIEW 1: MAIN MENU 
                      ===================== */}
                    {mobileMenuView === "main" && (
                      <>
                        {/* Theme Toggle */}
                        <button
                          onClick={toggleTheme}
                          className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                          <span className="flex items-center gap-3">
                            {showDarkUI ? (
                              <Moon size={18} />
                            ) : (
                              <Sun size={18} />
                            )}
                            Theme
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${showDarkUI ? "bg-black/40 text-gray-300" : "bg-gray-200 text-gray-600"}`}
                          >
                            {showDarkUI ? "Dark" : "Light"}
                          </span>
                        </button>

                        {/* Language Switcher Button */}
                        <button
                          onClick={() => setMobileMenuView("lang")}
                          className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                          <span className="flex items-center gap-3">
                            <Globe size={18} />
                            Language
                          </span>
                          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold opacity-70">
                            {currentLang}{" "}
                            <ChevronRight size={16} className="mt-px" />
                          </span>
                        </button>

                        <div
                          className={`h-px w-full my-1 ${showDarkUI ? "bg-gray-700" : "bg-gray-200"}`}
                        />

                        {/* Emergency Contacts */}
                        <div className="px-3 py-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest opacity-70 text-red-500`}
                          >
                            Emergency Helplines
                          </span>
                          <div className="mt-2 flex flex-col gap-1">
                            {memoEmergencyNumbers.map((item) => (
                              <button
                                key={item.number}
                                onClick={() => {
                                  window.location.href = `tel:${item.number}`;
                                  setMobileMoreOpen(false);
                                }}
                                className={`text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex justify-between items-center ${showDarkUI ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                              >
                                <span className="truncate mr-2 font-medium">
                                  {item.label}
                                </span>
                                <span
                                  className={`font-mono font-bold px-1.5 py-0.5 rounded text-xs tracking-wide ${showDarkUI ? "bg-red-500/20" : "bg-red-500/10"}`}
                                >
                                  {item.number}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* =====================
                      VIEW 2: LANGUAGE SUB-MENU 
                      ===================== */}
                    {mobileMenuView === "lang" && (
                      <div className="flex flex-col animate-in slide-in-from-right-4 duration-200">
                        {/* Sub-menu Header */}
                        <div className="flex items-center gap-2 px-2 py-2 mb-1">
                          <button
                            onClick={() => setMobileMenuView("main")}
                            className={`flex gap-3 p-1.5 rounded-lg transition-colors ${showDarkUI ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                          >
                            <ChevronLeft size={20} />

                            <span
                              className={`font-semibold text-sm ${showDarkUI ? "text-gray-100" : "text-gray-800"}`}
                            >
                              Select Language
                            </span>
                          </button>
                        </div>

                        <div
                          className={`h-px w-full mb-1.5 ${showDarkUI ? "bg-gray-700" : "bg-gray-200"}`}
                        />

                        {/* Language List */}
                        <div className="flex flex-col gap-0.5 px-1 pb-1">
                          {memoLanguages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                changeLanguage(lang.code);
                                setMobileMoreOpen(false); // Close entire menu after selection
                              }}
                              className={`text-left px-3 py-3 rounded-xl text-sm transition-colors flex justify-between items-center cursor-pointer ${
                                lang.code === currentLang // 👉 THE FIX: Compare to currentLang, not raw i18n.language
                                  ? showDarkUI
                                    ? "bg-blue-500/20 text-blue-400 font-semibold"
                                    : "bg-blue-50 text-blue-600 font-semibold"
                                  : showDarkUI
                                    ? "text-gray-300 hover:bg-white/10"
                                    : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {lang.label}
                              {lang.code === currentLang && ( // 👉 THE FIX
                                <Check
                                  size={18}
                                  strokeWidth={2.5}
                                  className="animate-in zoom-in duration-200"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* =======================
          LOGOUT CONFIRMATION MODAL
      ======================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform transition-all scale-100 ${
              isDark
                ? "bg-[#1E1F20] text-[#E3E3E3] border border-[#282A2C]"
                : "bg-white text-slate-900"
            }`}
          >
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <LogOut className="w-5 h-5 mr-2 text-red-500" />
              Confirm Logout
            </h3>
            <p
              className={`text-sm mb-6 leading-relaxed ${isDark ? "text-[#C4C7C5]" : "opacity-80"}`}
            >
              Are you sure you want to log out of your account? You will need to
              sign in again to access your profile.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2.5 text-sm font-semibold cursor-pointer rounded-xl transition-colors ${
                  isDark
                    ? "hover:bg-[#282A2C] bg-[#131314] text-[#E3E3E3]"
                    : "hover:bg-slate-100 bg-white"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2.5 text-sm font-semibold cursor-pointer rounded-xl bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
