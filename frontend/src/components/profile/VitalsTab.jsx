// src/components/profile/VitalsTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vitalsSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save } from "lucide-react";

export default function VitalsTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      bloodPressure: "",
      bloodSugar: "",
      heartRate: "",
      oxygenLevel: "",
      lastUpdated: "",
    },
  });

  // Hydrate form with Database data
  useEffect(() => {
    // Simulated fetch from Firestore
    // e.g., fetched from doc(db, 'users', user.uid).vitals
    const fetchedDataFromDB = {
      bloodPressure: "120/80",
      bloodSugar: 95,
      heartRate: 72,
      oxygenLevel: 98,
      lastUpdated: "2026-02-25", // YYYY-MM-DD format works best for type="date"
    };

    reset({
      ...getValues(),
      bloodPressure: fetchedDataFromDB.bloodPressure || "",
      bloodSugar: fetchedDataFromDB.bloodSugar || "",
      heartRate: fetchedDataFromDB.heartRate || "",
      oxygenLevel: fetchedDataFromDB.oxygenLevel || "",
      lastUpdated: fetchedDataFromDB.lastUpdated || "",
    });
  }, [reset, getValues]);

  const onSubmit = (data) => {
    // We update the 'lastUpdated' to today's date automatically upon saving
    const today = new Date().toISOString().split("T")[0]; // Outputs "YYYY-MM-DD"

    const firestorePayload = {
      ...data,
      lastUpdated: today, // Force the update timestamp
    };

    console.log("Saving to Firestore:", firestorePayload);

    // Reset the form baseline with the newly injected date so the UI updates instantly
    reset({ ...data, lastUpdated: today });

    alert("Vitals saved!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(); // Safely reverts back to the established baseline
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Current Vitals</h2>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 cursor-pointer text-sm rounded-lg bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 font-medium hover:bg-blue-200 transition"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Section
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center px-4 py-2 cursor-pointer text-sm rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Blood Pressure (mmHg)"
            placeholder="e.g. 120/80"
            {...register("bloodPressure")}
            error={errors?.bloodPressure}
            disabled={!isEditing}
          />

          <Input
            label="Blood Sugar (mg/dL)"
            type="number"
            placeholder="e.g. 95"
            {...register("bloodSugar", { valueAsNumber: true })}
            error={errors?.bloodSugar}
            disabled={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            placeholder="e.g. 72"
            {...register("heartRate", { valueAsNumber: true })}
            error={errors?.heartRate}
            disabled={!isEditing}
          />

          <Input
            label="Oxygen Level (%)"
            type="number"
            placeholder="e.g. 98"
            {...register("oxygenLevel", { valueAsNumber: true })}
            error={errors?.oxygenLevel}
            disabled={!isEditing}
          />
        </div>

        {/* Read-only field showing when it was last updated */}
        <div className="pt-2">
          <Input
            label="Last Updated Date"
            type="date"
            {...register("lastUpdated")}
            error={errors?.lastUpdated}
            disabled={true} // Always disabled, updated automatically on save
            className="opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
          />
          <p className="text-xs text-slate-500 mt-1 ml-1">
            *Date is updated automatically when you save changes.
          </p>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center mt-8 px-6 py-2 cursor-pointer rounded-lg text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      )}
    </div>
  );
}

// Ensure your Input component is available in this file or imported!
const Input = forwardRef(
  (
    { label, placeholder, error, type, className = "", disabled, ...props },
    ref,
  ) => {
    return (
      <div>
        <label className="text-sm opacity-70">{label}</label>

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          placeholder={placeholder || `Enter ${label}`}
          {...props}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) => {
            if (type === "number" && (e.key === "-" || e.key === "e")) {
              e.preventDefault();
            }
          }}
          className={`w-full mt-1 px-3 py-2 rounded-lg border outline-none bg-transparent placeholder:text-gray-400 transition-colors
        ${error ? "border-red-500" : "border-slate-300 dark:border-slate-600"}
        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-gray-500" : "focus:border-blue-500"}
        ${className}`}
        />

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  },
);