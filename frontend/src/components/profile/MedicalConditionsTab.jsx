// src/components/profile/MedicalConditionsTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalConditionsSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save } from "lucide-react";

export default function MedicalConditionsTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicalConditionsSchema),
    defaultValues: {
      conditions: "", // We will store this as a comma-separated string in the form
      notes: "",
    },
  });

  // 👉 Hydrate the form when user data loads (Simulating Firestore fetch for now)
  useEffect(() => {
    // Eventually, you will fetch the array from Firestore here.
    // For now, we simulate what it will look like when you pull ['Asthma', 'Diabetes'] from the DB.
    const fetchedDataFromDB = {
      conditions: ["Asthma", "High Blood Pressure"],
      notes: "Allergic to penicillin.",
    };

    reset({
      ...getValues(),
      // Convert the array FROM the database into a string FOR the input field
      conditions: fetchedDataFromDB.conditions
        ? fetchedDataFromDB.conditions.join(", ")
        : "",
      notes: fetchedDataFromDB.notes || "",
    });
  }, [reset, getValues]); // We'll add 'user' to dependency array when hooking up Firestore

  const onSubmit = (data) => {
    // 👉 Convert the string back into a clean array before saving to Firestore
    const cleanConditionsArray = data.conditions
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== ""); // Removes empty items if the user just typed commas

    const firestorePayload = {
      conditions: cleanConditionsArray,
      notes: data.notes,
    };

    console.log("Saving to Firestore:", firestorePayload);
    alert("Medical Conditions saved!");

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
        <h2 className="text-xl font-semibold">Medical Conditions</h2>

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
        <Input
          label="Existing Conditions (comma separated)"
          placeholder="e.g. Asthma, Diabetes, Hypertension"
          {...register("conditions")}
          error={errors?.conditions}
          disabled={!isEditing}
        />

        <Textarea
          label="Additional Notes"
          placeholder="Add any relevant medical history or notes here..."
          {...register("notes")}
          error={errors?.notes}
          disabled={!isEditing}
        />
      </div>

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center mt-8 px-6 cursor-pointer py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      )}
    </div>
  );
}

// Ensure your Input and Textarea components are available here!
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

const Textarea = forwardRef(
  ({ label, placeholder, error, className = "", disabled, ...props }, ref) => {
    return (
      <div>
        <label className="text-sm opacity-70">{label}</label>

        <textarea
          ref={ref}
          disabled={disabled}
          placeholder={placeholder || `Enter ${label}`}
          rows={4}
          {...props}
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