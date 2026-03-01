import SkeletonProfile from "../components/skeletons/profile/SkeletonProfile";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LogOut,
  User,
  Stethoscope,
  Pill,
  ShieldAlert,
  Scissors,
  Activity,
  Dumbbell,
  PhoneCall,
  ChevronDown, // 👉 ADDED for dropdown indicator
  Check, // 👉 ADDED for selected state
} from "lucide-react";

// Import all isolated tab components
import PersonalInfoTab from "../components/profile/PersonalInfoTab";
import MedicalConditionsTab from "../components/profile/MedicalConditionsTab";
import MedicationsTab from "../components/profile/MedicationsTab";
import AllergiesTab from "../components/profile/AllergiesTab";
import SurgeriesTab from "../components/profile/SurgeriesTab";
import VitalsTab from "../components/profile/VitalsTab";
import LifestyleTab from "../components/profile/LifestyleTab";
import EmergencyContactTab from "../components/profile/EmergencyContactTab";

const TABS = [
  { name: "Personal Info", icon: User },
  { name: "Medical Conditions", icon: Stethoscope },
  { name: "Medications", icon: Pill },
  { name: "Allergies", icon: ShieldAlert },
  { name: "Surgeries", icon: Scissors },
  { name: "Vitals", icon: Activity },
  { name: "Lifestyle", icon: Dumbbell },
  { name: "Emergency Contact", icon: PhoneCall },
];

export default function Profile() {
  const { user, logout, authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "Personal Info";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 👉 ADDED: State and Ref for Mobile Custom Dropdown
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);

  const handleConfirmLogout = async () => {
    try {
      navigate("/");
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // 👉 ADDED: Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (authLoading || !user?.uid) {
    return <SkeletonProfile activeTab={activeTab} />;
  }

  const ActiveIcon = TABS.find((t) => t.name === activeTab)?.icon || User;

  return (
    <>
      <div
        className={`min-h-screen pt-16 transition-colors duration-300 ${
          isDark ? "bg-[#131314]" : "bg-slate-50"
        }`}
      >
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-112px)] overflow-hidden">
          {/* =======================
              DESKTOP SIDEBAR (Untouched)
          ======================== */}
          <div
            className={`hidden md:flex flex-col w-72 border-r ${
              isDark
                ? "bg-[#131314] border-[#282A2C]"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex-1 overflow-y-auto p-5 pr-3 min-h-0 custom-scrollbar">
              <h2
                className={`text-xl font-bold mb-6 pl-2 tracking-tight ${isDark ? "text-gray-100" : "text-slate-800"}`}
              >
                My Profile
              </h2>

              <div className="space-y-1.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;

                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                          : isDark
                            ? "text-[#C4C7C5] hover:bg-[#1E1F20] hover:text-gray-100"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 transition-colors ${
                          isActive
                            ? "text-white"
                            : isDark
                              ? "text-[#C4C7C5]"
                              : "text-slate-400"
                        }`}
                      />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anchored Log Out Section */}
            <div className="shrink-0 h-[76px] flex items-center px-5">
              <div
                className={`w-full pt-4 border-t ${isDark ? "border-[#282A2C]" : "border-slate-200"}`}
              >
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className={`flex items-center justify-center w-full px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-300 group ${
                    isDark
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-red-500 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* =======================
              MOBILE NAVIGATION (Fully Redesigned)
          ======================== */}
          <div
            className={`md:hidden p-4 border-b flex items-center shrink-0 shadow-sm z-20 relative ${
              isDark
                ? "bg-[#131314] border-[#282A2C]"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Custom Dropdown Trigger */}
            <div className="relative w-full" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border outline-none font-medium transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "bg-[#1E1F20] border-[#282A2C] text-[#E3E3E3] hover:border-slate-600"
                    : "bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400"
                } ${mobileDropdownOpen ? (isDark ? "ring-2 ring-blue-500/20 border-blue-500" : "ring-2 ring-blue-500/20 border-blue-500") : ""}`}
              >
                <div className="flex items-center gap-3">
                  <ActiveIcon
                    className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-500"}`}
                  />
                  <span className="text-[15px]">{activeTab}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 opacity-60 transition-transform duration-300 ${mobileDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Custom Dropdown Menu */}
              {mobileDropdownOpen && (
                <div
                  className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
                    isDark
                      ? "bg-[#1E1F20] border-[#282A2C] shadow-black/40"
                      : "bg-white border-slate-200 shadow-slate-200/50"
                  }`}
                >
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col p-1.5 gap-1">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isSelected = activeTab === tab.name;
                      return (
                        <button
                          key={tab.name}
                          onClick={() => {
                            setActiveTab(tab.name);
                            setMobileDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-3.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? isDark
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-blue-50 text-blue-600"
                              : isDark
                                ? "text-[#C4C7C5] hover:bg-[#282A2C] hover:text-gray-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 ${isSelected ? "" : "opacity-70"}`}
                            />
                            {tab.name}
                          </div>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =======================
              MAIN CONTENT AREA
          ======================== */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div
                className={`max-w-4xl mx-auto rounded-2xl border p-5 md:p-8 transition-colors duration-300 ${
                  isDark
                    ? "bg-[#1E1F20] border-[#282A2C] shadow-lg shadow-black/20"
                    : "bg-white border-slate-200/80 shadow-sm"
                }`}
              >
                <div className="w-full max-w-3xl mx-auto transition-all duration-300">
                  <div
                    className={
                      activeTab === "Personal Info"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <PersonalInfoTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Medical Conditions"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <MedicalConditionsTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Medications"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <MedicationsTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Allergies"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <AllergiesTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Surgeries"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <SurgeriesTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Vitals"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <VitalsTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Lifestyle"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <LifestyleTab user={user} />
                  </div>
                  <div
                    className={
                      activeTab === "Emergency Contact"
                        ? "block animate-in fade-in zoom-in-95 duration-200"
                        : "hidden"
                    }
                  >
                    <EmergencyContactTab user={user} />
                  </div>
                </div>
              </div>

              {/* =======================
                  MOBILE FOOTER (Disclaimer & Logout)
              ======================== */}
              <div className="md:hidden mt-8 mb-6 max-w-4xl mx-auto">
                <p
                  className={`text-[10px] leading-tight text-justify opacity-60 mb-8 px-1 ${isDark ? "text-[#C4C7C5]" : "text-slate-500"}`}
                >
                  <span className="font-bold block mb-1 uppercase tracking-tighter text-[11px]">
                    * Medical Disclaimer & Data Usage
                  </span>
                  The information provided in your profile is utilized solely to
                  enhance the relevance and precision of AI-generated insights.
                  <strong>
                    {" "}
                    This platform does not provide medical diagnoses, clinical
                    advice, or treatment protocols.
                  </strong>
                  &nbsp;Rurivia.AI is an assistive tool and is not a substitute
                  for professional medical judgment, diagnosis, or treatment.
                </p>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className={`w-full flex items-center justify-center px-4 py-4 rounded-xl cursor-pointer text-sm font-bold tracking-wide transition-all duration-300 ${
                    isDark
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      : "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                  }`}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Log Out Securely
                </button>
              </div>
            </div>

            {/* FIXED DESKTOP DISCLAIMER (Hidden on Mobile) */}
            <div className="hidden md:flex shrink-0 py-5 items-center px-4 md:px-8 border-t border-transparent">
              <div
                className={`w-full pt-4 border-t max-w-6xl mx-auto ${
                  isDark ? "border-[#282A2C]" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-[10px] leading-tight text-justify opacity-60 ${isDark ? "text-[#C4C7C5]" : "text-slate-500"}`}
                >
                  <span className="font-bold block mb-0.5 uppercase tracking-tighter text-[9px]">
                    * Medical Disclaimer & Data Usage
                  </span>
                  The information provided in your profile is utilized solely to
                  enhance the relevance and precision of AI-generated insights.
                  <strong>
                    {" "}
                    This platform does not provide medical diagnoses, clinical
                    advice, or treatment protocols.
                  </strong>
                  &nbsp;Rurivia.AI is an assistive tool and is not a substitute
                  for professional medical judgment, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
