// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom"; // 👉 Import useNavigate
import { LogOut } from "lucide-react"; // 👉 Import an icon for the button

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
  "Personal Info",
  "Medical Conditions",
  "Medications",
  "Allergies",
  "Surgeries",
  "Vitals",
  "Lifestyle",
  "Emergency Contact",
];

export default function Profile() {
  // 👉 Make sure your AuthContext provides a 'logout' function!
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate(); // 👉 Initialize the router
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("Personal Info");
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 👉 State for the modal

  // 👉 Handle the actual logout logic
  const handleConfirmLogout = async () => {
    try {
      // 👉 1. Route them to the public homepage FIRST
      navigate("/");

      // 👉 2. THEN destroy the session.
      // Because they are already on the homepage, the Protected Route can't kick them to /login!
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`min-h-screen pt-16 ${isDark ? "bg-[#0f172a]" : "bg-slate-50"}`}
      >
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-112px)] overflow-hidden">
          {/* =======================
              DESKTOP SIDEBAR
          ======================== */}
          <div
            className={`hidden md:flex flex-col w-64 border-r ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div className="flex-1 overflow-y-auto p-4 pr-2 min-h-0">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Anchored Log Out Section - UPDATED TO ADD GAP */}
            <div className="shrink-0 h-[60px] flex items-center px-4">
              {/* This inner div creates the line with a gap */}
              <div
                className={`w-full pt-4 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
              >
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center w-full px-3 py-2 rounded-lg cursor-pointer text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <div
            className={`md:hidden p-4 border-b flex items-center gap-3 shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"}`}
            >
              {TABS.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-red-500 dark:bg-red-900/50 rounded-lg hover:opacity-80 transition hover:bg-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div
                className={`max-w-4xl mx-auto rounded-2xl border p-4 md:p-6 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
              >
                <div
                  className={activeTab === "Personal Info" ? "block" : "hidden"}
                >
                  <PersonalInfoTab user={user} />
                </div>
                <div
                  className={
                    activeTab === "Medical Conditions" ? "block" : "hidden"
                  }
                >
                  <MedicalConditionsTab user={user} />
                </div>
                <div
                  className={activeTab === "Medications" ? "block" : "hidden"}
                >
                  <MedicationsTab user={user} />
                </div>
                <div className={activeTab === "Allergies" ? "block" : "hidden"}>
                  <AllergiesTab user={user} />
                </div>
                <div className={activeTab === "Surgeries" ? "block" : "hidden"}>
                  <SurgeriesTab user={user} />
                </div>
                <div className={activeTab === "Vitals" ? "block" : "hidden"}>
                  <VitalsTab user={user} />
                </div>
                <div className={activeTab === "Lifestyle" ? "block" : "hidden"}>
                  <LifestyleTab user={user} />
                </div>
                <div
                  className={
                    activeTab === "Emergency Contact" ? "block" : "hidden"
                  }
                >
                  <EmergencyContactTab user={user} />
                </div>
              </div>
            </div>

            {/* FIXED DISCLAIMER - SINGLE LINE ALIGNED TO LOG OUT */}
            <div className="shrink-0 h-[60px] flex items-center px-4 md:px-6">
              <div
                className={`w-full pt-4 border-t max-w-6xl mx-auto ${isDark ? "border-slate-800" : "border-slate-200"}`}
              >
                <p
                  className={`text-[7px] md:text-[10px] leading-tight text-justify opacity-60 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <span className="font-bold block mb-0.5 uppercase tracking-tighter text-[7px] md:text-[9px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className={`w-full max-w-sm p-6 rounded-2xl shadow-xl transform transition-all ${
              isDark
                ? "bg-slate-800 text-white border border-slate-700"
                : "bg-white text-slate-900"
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm opacity-80 mb-6">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors ${
                  isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
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
