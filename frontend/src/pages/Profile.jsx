// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("Personal Info");

  return (
    <div
      className={`min-h-screen pt-16 ${isDark ? "bg-[#0f172a]" : "bg-slate-50"}`}
    >
      <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`hidden md:flex flex-col w-64 border-r p-4 space-y-2 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer text-sm ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className={`max-w-4xl mx-auto rounded-2xl border p-6 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
          >
            {/* 👉 NEW: Instead of a switch statement, we render all components 
              and use Tailwind's `hidden` vs `block` to toggle visibility.
              This keeps all draft data safely in memory! 
            */}

            <div className={activeTab === "Personal Info" ? "block" : "hidden"}>
              <PersonalInfoTab user={user} />
            </div>

            <div
              className={
                activeTab === "Medical Conditions" ? "block" : "hidden"
              }
            >
              <MedicalConditionsTab user={user} />
            </div>

            <div className={activeTab === "Medications" ? "block" : "hidden"}>
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
              className={activeTab === "Emergency Contact" ? "block" : "hidden"}
            >
              <EmergencyContactTab user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
