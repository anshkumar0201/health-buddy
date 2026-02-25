import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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

  /* =========================
PROFILE STATE
========================== */

  const [profile, setProfile] = useState({
    personal: {
      name: user?.displayName || "",
      email: user?.email || "",
      age: "",
      gender: "",
      bloodGroup: "",
      height: "",
      weight: "",
    },
    conditions: "",
    allergies: "",
    surgeries: "",
    medications: [{ name: "", dose: "", frequency: "" }],
    vitals: {
      bp: "",
      sugar: "",
      heartRate: "",
    },
    lifestyle: {
      smoking: "",
      alcohol: "",
      exercise: "",
      sleep: "",
    },
    emergency: {
      name: "",
      relation: "",
      phone: "",
    },
  });

  /* =========================
HANDLERS
========================== */

  const updateSection = (section, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...profile.medications];
    updated[index][field] = value;

    setProfile((prev) => ({
      ...prev,
      medications: updated,
    }));
  };

  const addMedication = () => {
    setProfile((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dose: "", frequency: "" }],
    }));
  };

  const removeMedication = (index) => {
    setProfile((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log(profile);
    alert("Profile saved (Firestore later)");
  };

  /* =========================
TAB CONTENT RENDERER
========================== */

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Info":
        return (
          <div className="space-y-3">
            <Input
              label="Full Name"
              value={profile.personal.name}
              onChange={(e) =>
                updateSection("personal", "name", e.target.value)
              }
            />

            <Input label="Email" value={profile.personal.email} disabled />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                value={profile.personal.age}
                onChange={(e) =>
                  updateSection("personal", "age", e.target.value)
                }
              />
              <Input
                label="Gender"
                value={profile.personal.gender}
                onChange={(e) =>
                  updateSection("personal", "gender", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Height (cm)"
                value={profile.personal.height}
                onChange={(e) =>
                  updateSection("personal", "height", e.target.value)
                }
              />
              <Input
                label="Weight (kg)"
                value={profile.personal.weight}
                onChange={(e) =>
                  updateSection("personal", "weight", e.target.value)
                }
              />
            </div>

            <Input
              label="Blood Group"
              value={profile.personal.bloodGroup}
              onChange={(e) =>
                updateSection("personal", "bloodGroup", e.target.value)
              }
            />
          </div>
        );

      case "Medical Conditions":
        return (
          <Textarea
            label="Existing Conditions"
            value={profile.conditions}
            onChange={(e) =>
              setProfile({ ...profile, conditions: e.target.value })
            }
          />
        );

      case "Medications":
        return (
          <div className="space-y-4">
            {profile.medications.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <Input
                  label="Medicine"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Dose"
                    value={med.dose}
                    onChange={(e) =>
                      handleMedicationChange(index, "dose", e.target.value)
                    }
                  />
                  <Input
                    label="Frequency"
                    value={med.frequency}
                    onChange={(e) =>
                      handleMedicationChange(index, "frequency", e.target.value)
                    }
                  />
                </div>

                <button
                  onClick={() => removeMedication(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button onClick={addMedication} className="text-blue-500 text-sm">
              + Add Medication
            </button>
          </div>
        );

      case "Allergies":
        return (
          <Textarea
            label="Allergies"
            value={profile.allergies}
            onChange={(e) =>
              setProfile({ ...profile, allergies: e.target.value })
            }
          />
        );

      case "Surgeries":
        return (
          <Textarea
            label="Past Surgeries"
            value={profile.surgeries}
            onChange={(e) =>
              setProfile({ ...profile, surgeries: e.target.value })
            }
          />
        );

      case "Vitals":
        return (
          <div className="space-y-3">
            <Input
              label="Blood Pressure"
              value={profile.vitals.bp}
              onChange={(e) => updateSection("vitals", "bp", e.target.value)}
            />
            <Input
              label="Blood Sugar"
              value={profile.vitals.sugar}
              onChange={(e) => updateSection("vitals", "sugar", e.target.value)}
            />
            <Input
              label="Heart Rate"
              value={profile.vitals.heartRate}
              onChange={(e) =>
                updateSection("vitals", "heartRate", e.target.value)
              }
            />
          </div>
        );

      case "Lifestyle":
        return (
          <div className="space-y-3">
            <Input
              label="Smoking"
              value={profile.lifestyle.smoking}
              onChange={(e) =>
                updateSection("lifestyle", "smoking", e.target.value)
              }
            />
            <Input
              label="Alcohol"
              value={profile.lifestyle.alcohol}
              onChange={(e) =>
                updateSection("lifestyle", "alcohol", e.target.value)
              }
            />
            <Input
              label="Exercise"
              value={profile.lifestyle.exercise}
              onChange={(e) =>
                updateSection("lifestyle", "exercise", e.target.value)
              }
            />
            <Input
              label="Sleep Hours"
              value={profile.lifestyle.sleep}
              onChange={(e) =>
                updateSection("lifestyle", "sleep", e.target.value)
              }
            />
          </div>
        );

      case "Emergency Contact":
        return (
          <div className="space-y-3">
            <Input
              label="Contact Name"
              value={profile.emergency.name}
              onChange={(e) =>
                updateSection("emergency", "name", e.target.value)
              }
            />
            <Input
              label="Relation"
              value={profile.emergency.relation}
              onChange={(e) =>
                updateSection("emergency", "relation", e.target.value)
              }
            />
            <Input
              label="Phone"
              value={profile.emergency.phone}
              onChange={(e) =>
                updateSection("emergency", "phone", e.target.value)
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  /* =========================
UI
========================== */

  return (
    <div
      className={`min-h-screen pt-16 ${
        isDark ? "bg-[#0f172a]" : "bg-slate-50"
      }`}
    >
      <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`
      hidden md:flex
      flex-col
      w-64 lg:w-72
      border-r
      p-4
      space-y-2
      overflow-y-auto
      ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}
    `}
        >
          <h2 className="text-lg font-semibold mb-2">Profile</h2>

          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
          w-full text-left px-3 py-2 rounded-lg text-sm transition
          ${
            activeTab === tab
              ? "bg-blue-500 text-white"
              : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }
        `}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* MOBILE TAB SELECTOR */}
        <div className="md:hidden w-full border-b p-3">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border"
          >
            {TABS.map((tab) => (
              <option key={tab}>{tab}</option>
            ))}
          </select>
        </div>
        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div
            className={`
        w-full max-w-5xl mx-auto
        rounded-2xl
        shadow-sm
        border
        p-6 sm:p-8
        ${
          isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
        }
      `}
          >
            <h2 className="text-xl font-semibold mb-6">{activeTab}</h2>

            {renderContent()}

            <button
              onClick={handleSave}
              className="mt-8 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-emerald-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
INPUT COMPONENTS
========================== */

function Input({ label, ...props }) {
  return (
    <div>
      {" "}
      <label className="text-sm opacity-70">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none bg-transparent"
      />{" "}
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      {" "}
      <label className="text-sm opacity-70">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none bg-transparent"
      />{" "}
    </div>
  );
}
