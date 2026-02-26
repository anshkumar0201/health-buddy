import SkeletonProfile from "../components/skeletons/profile/SkeletonProfile";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
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
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("Personal Info");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      navigate("/");
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {/* 👉 UPDATED: Gemini exact background hex (#131314) */}
      <div
        className={`min-h-screen pt-16 transition-colors duration-300 ${
          isDark ? "bg-[#131314]" : "bg-slate-50"
        }`}
      >
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-112px)] overflow-hidden">
          {/* =======================
              DESKTOP SIDEBAR
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
              MOBILE NAVIGATION
          ======================== */}
          <div
            className={`md:hidden p-4 border-b flex items-center gap-3 shrink-0 shadow-sm z-10 ${
              isDark
                ? "bg-[#131314] border-[#282A2C]"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-3 pointer-events-none flex items-center justify-center">
                {(() => {
                  const ActiveIcon =
                    TABS.find((t) => t.name === activeTab)?.icon || User;
                  return (
                    <ActiveIcon
                      className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-500"}`}
                    />
                  );
                })()}
              </div>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none font-medium appearance-none transition-colors ${
                  isDark
                    ? "bg-[#1E1F20] border-[#282A2C] text-[#E3E3E3] focus:border-blue-500"
                    : "bg-slate-50 border-slate-300 focus:border-blue-500"
                }`}
              >
                {TABS.map((tab) => (
                  <option key={tab.name} value={tab.name}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`p-2.5 rounded-xl transition-all ${
                isDark
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-red-500 bg-red-50 hover:bg-red-100"
              }`}
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* =======================
              MAIN CONTENT AREA
          ======================== */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {/* 👉 UPDATED: Elevated Gemini Card Color (#1E1F20) */}
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
            </div>

            {/* FIXED DISCLAIMER */}
            <div className="shrink-0 h-[76px] flex items-center px-4 md:px-8">
              <div
                className={`w-full pt-4 border-t max-w-6xl mx-auto ${
                  isDark ? "border-[#282A2C]" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-[8px] md:text-[10px] leading-tight text-justify opacity-60 ${isDark ? "text-[#C4C7C5]" : "text-slate-500"}`}
                >
                  <span className="font-bold block mb-0.5 uppercase tracking-tighter text-[8px] md:text-[9px]">
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
