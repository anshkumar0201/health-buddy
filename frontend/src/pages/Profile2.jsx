import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { profileSchema } from "../schemas/profileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const GENDER_OPTIONS = [
    "Male",
    "Female",
    "Non-binary",
    "Intersex",
    "Prefer not to say",
    "Other",
  ];

  const SMOKING_OPTIONS = [
    "Never",
    "Former smoker",
    "Occasional",
    "Daily",
    "Prefer not to say",
  ];

  const RELATION_OPTIONS = [
    "Spouse",
    "Parent",
    "Child",
    "Sibling",
    "Friend",
    "Relative",
    "Caregiver",
    "Partner",
    "Other",
  ];

  /* =========================
PROFILE STATE
========================== */

  const [profile, setProfile] = useState({
    personalInfo: {
      name: user?.displayName || "",
      email: user?.email || "",
      age: 0,
      gender: "",
      bloodGroup: "",
      height: 0,
      weight: 0,
    },
    medicalConditions: {
      conditions: [""],
      notes: "",
    },
    medications: [{ medName: "", dosage: "", frequency: "" }],
    allergies: {
      food: [""],
      medicines: [""],
      others: [""],
    },
    surgeries: [
      {
        surgeryName: "",
        year: 0,
        hospital: "",
      },
    ],
    vitals: {
      bloodPressure: "",
      bloodSugar: 0,
      heartRate: 0,
      oxygenLevel: 0,
      lastUpdated: "",
    },
    lifestyle: {
      smoking: "",
      alcohol: "",
      exercise: "",
      sleepHours: 0,
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
      alternateNumber: "",
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
    setProfile((prev) => {
      // 1. Create a shallow copy of the medications array
      const updatedMedications = [...prev.medications];

      // 2. Create a shallow copy of the specific medication object, updating the changed field
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };

      return {
        ...prev,
        medications: updatedMedications,
      };
    });
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

  const handleSurgeryChange = (index, field, value) => {
    setProfile((prev) => {
      // 1. Create a shallow copy of the surgeries array
      const updatedSurgeries = [...prev.surgeries];
      // 2. Create a shallow copy of the specific surgery object being edited, and update the field
      updatedSurgeries[index] = {
        ...updatedSurgeries[index],
        [field]: value,
      };

      return {
        ...prev,
        surgeries: updatedSurgeries,
      };
    });
  };

  const addSurgery = () => {
    setProfile((prev) => ({
      ...prev,
      surgeries: [
        ...prev.surgeries,
        // Ensure this perfectly matches your initial state structure
        { surgeryName: "", year: 0, hospital: "" },
      ],
    }));
  };

  const removeSurgery = (index) => {
    setProfile((prev) => ({
      ...prev,
      surgeries: prev.surgeries.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    try {
      const validatedData = profileSchema.parse(profile);

      console.log("VALID:", validatedData);

      alert("Profile saved successfully");

      // Later → Firestore save here
    } catch (error) {
      console.error(error.errors);

      alert(error.errors?.[0]?.message || "Invalid data");
    }
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
              value={profile.personalInfo.name}
              onChange={(e) =>
                updateSection("personalInfo", "name", e.target.value)
              }
            />
            <Input label="Email" value={profile.personalInfo.email} disabled />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                type="number"
                value={profile.personalInfo.age}
                onChange={(e) =>
                  updateSection("personalInfo", "age", Number(e.target.value))
                }
              />
              <Select
                label="Gender"
                value={profile.personalInfo.gender}
                options={GENDER_OPTIONS}
                onChange={(e) =>
                  updateSection("personalInfo", "gender", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Height (cm)"
                type="number"
                value={profile.personalInfo.height}
                onChange={(e) =>
                  updateSection(
                    "personalInfo",
                    "height",
                    Number(e.target.value),
                  )
                }
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={profile.personalInfo.weight}
                onChange={(e) =>
                  updateSection(
                    "personalInfo",
                    "weight",
                    Number(e.target.value),
                  )
                }
              />
            </div>

            <Input
              label="Blood Group"
              value={profile.personalInfo.bloodGroup}
              onChange={(e) =>
                updateSection("personalInfo", "bloodGroup", e.target.value)
              }
            />
          </div>
        );

      case "Medical Conditions":
        return (
          <div className="space-y-3">
            {/* Treating conditions as a comma-separated string for easy editing */}
            <Input
              label="Existing Conditions (comma separated)"
              value={profile.medicalConditions.conditions.join(", ")}
              onChange={(e) =>
                updateSection(
                  "medicalConditions",
                  "conditions",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
            <Textarea
              label="Additional Notes"
              value={profile.medicalConditions.notes}
              onChange={(e) =>
                updateSection("medicalConditions", "notes", e.target.value)
              }
            />
          </div>
        );

      case "Medications":
        return (
          <div className="space-y-4">
            {profile.medications.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <Input
                  label="Medicine"
                  value={med.medName}
                  onChange={(e) =>
                    handleMedicationChange(index, "medName", e.target.value)
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Dose"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicationChange(index, "dosage", e.target.value)
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

            <button
              onClick={addMedication}
              className="text-blue-500 text-sm cursor-pointer"
            >
              + Add Medication
            </button>
          </div>
        );

      case "Allergies":
        return (
          <div className="space-y-3">
            <Input
              label="Food Allergies (comma separated)"
              value={profile.allergies.food.join(", ")}
              onChange={(e) =>
                updateSection(
                  "allergies",
                  "food",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
            <Input
              label="Medicine Allergies (comma separated)"
              value={profile.allergies.medicines.join(", ")}
              onChange={(e) =>
                updateSection(
                  "allergies",
                  "medicines",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
            <Input
              label="Other Allergies (comma separated)"
              value={profile.allergies.others.join(", ")}
              onChange={(e) =>
                updateSection(
                  "allergies",
                  "others",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
          </div>
        );

      case "Surgeries":
        return (
          <div className="space-y-4">
            {profile.surgeries.map((surgery, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <Input
                  label="Surgery Name"
                  value={surgery.surgeryName}
                  onChange={(e) =>
                    handleSurgeryChange(index, "surgeryName", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Year"
                    type="number"
                    value={surgery.year}
                    onChange={(e) =>
                      handleSurgeryChange(index, "year", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Hospital"
                    value={surgery.hospital}
                    onChange={(e) =>
                      handleSurgeryChange(index, "hospital", e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => removeSurgery(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={addSurgery}
              className="text-blue-500 text-sm cursor-pointer"
            >
              + Add Surgery
            </button>
          </div>
        );

      case "Vitals":
        return (
          <div className="space-y-3">
            <Input
              label="Blood Pressure"
              value={profile.vitals.bloodPressure}
              onChange={(e) =>
                updateSection("vitals", "bloodPressure", e.target.value)
              }
            />
            <Input
              label="Blood Sugar"
              type="number"
              value={profile.vitals.bloodSugar}
              onChange={(e) =>
                updateSection("vitals", "bloodSugar", Number(e.target.value))
              }
            />
            <Input
              label="Heart Rate"
              type="number"
              value={profile.vitals.heartRate}
              onChange={(e) =>
                updateSection("vitals", "heartRate", Number(e.target.value))
              }
            />
            <Input
              label="Oxygen Level (%)"
              type="number"
              value={profile.vitals.oxygenLevel}
              onChange={(e) =>
                updateSection("vitals", "oxygenLevel", Number(e.target.value))
              }
            />
            <Input
              label="Last Updated"
              type="date"
              value={profile.vitals.lastUpdated}
              onChange={(e) =>
                updateSection("vitals", "lastUpdated", e.target.value)
              }
            />
          </div>
        );

      case "Lifestyle":
        return (
          <div className="space-y-3">
            <Select
              label="Smoking"
              value={profile.lifestyle.smoking}
              options={SMOKING_OPTIONS}
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
              type="number"
              value={profile.lifestyle.sleepHours}
              onChange={(e) =>
                updateSection("lifestyle", "sleepHours", Number(e.target.value))
              }
            />
          </div>
        );

      case "Emergency Contact":
        return (
          <div className="space-y-3">
            <Input
              label="Contact Name"
              value={profile.emergencyContact.name}
              onChange={(e) =>
                updateSection("emergencyContact", "name", e.target.value)
              }
            />
            <Select
              label="Relation"
              value={profile.emergencyContact.relation}
              options={RELATION_OPTIONS}
              onChange={(e) =>
                updateSection("emergencyContact", "relation", e.target.value)
              }
            />
            <Input
              label="Phone"
              value={profile.emergencyContact.phone}
              onChange={(e) =>
                updateSection("emergencyContact", "phone", e.target.value)
              }
            />
            <Input
              label="Alternate Number"
              value={profile.emergencyContact.alternateNumber}
              onChange={(e) =>
                updateSection(
                  "emergencyContact",
                  "alternateNumber",
                  e.target.value,
                )
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

function Select({ label, options = [], ...props }) {
  return (
    <div>
      <label className="text-sm opacity-70">{label}</label>
      <select
        {...props}
        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none bg-transparent"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
