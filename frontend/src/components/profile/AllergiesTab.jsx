// src/components/profile/AllergiesTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allergiesSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save, CheckCircle2, Loader2 } from "lucide-react"; // 👉 Added missing icons
import { useTheme } from "../../context/ThemeContext"; // 👉 Imported theme

export default function AllergiesTab({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);

  // 👉 NEW: States for Modal, Toast, and Loading status
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(allergiesSchema),
    mode: "onChange", // 👉 NEW: Triggers real-time validation
    defaultValues: {
      food: "",
      medicines: "",
      others: "",
    },
  });

  // Hydrate form with Database data
  useEffect(() => {
    // Simulated fetch from Firestore
    // e.g. fetched from doc(db, 'users', user.uid).allergies
    const fetchedDataFromDB = {
      food: ["Peanuts", "Shellfish"],
      medicines: ["Penicillin"],
      others: ["Dust Mites", "Pollen"],
    };

    // Convert the database arrays into comma-separated strings for the UI
    reset({
      ...getValues(),
      food: fetchedDataFromDB.food ? fetchedDataFromDB.food.join(", ") : "",
      medicines: fetchedDataFromDB.medicines
        ? fetchedDataFromDB.medicines.join(", ")
        : "",
      others: fetchedDataFromDB.others
        ? fetchedDataFromDB.others.join(", ")
        : "",
    });
  }, [reset, getValues]);

  // 👉 NEW: Intercept submit to show the modal
  const handlePreSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  // 👉 NEW: Async save function attached to the modal's confirmation button
  const confirmSave = async () => {
    setIsSaving(true); // Start the spinner

    try {
      // Helper function to convert comma string back to a clean array
      const cleanArrayString = (str) => {
        if (!str) return [];
        return str
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""); // Drops empty items if a user types ",,"
      };

      const firestorePayload = {
        food: cleanArrayString(pendingData.food),
        medicines: cleanArrayString(pendingData.medicines),
        others: cleanArrayString(pendingData.others),
      };

      console.log("Saving Allergies to Firestore:", firestorePayload);

      // 👉 Simulate 1.5 second network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close modal and turn off edit mode AFTER successful save
      setShowConfirmModal(false);
      setIsEditing(false);

      // Trigger the success toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false); // Stop the spinner
    }
  };

  const handleCancel = () => {
    reset(); // Safely reverts back to the established baseline
    setIsEditing(false);
  };

  // 👉 NEW: Check if there are active errors to disable the Save button
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <div>
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Allergies</h2>

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
            label="Food Allergies (comma separated)"
            placeholder="e.g. Peanuts, Shellfish, Dairy"
            {...register("food")}
            error={errors?.food}
            disabled={!isEditing}
          />

          <Input
            label="Medicine Allergies (comma separated)"
            placeholder="e.g. Penicillin, Aspirin, Ibuprofen"
            {...register("medicines")}
            error={errors?.medicines}
            disabled={!isEditing}
          />

          <Input
            label="Other Allergies (comma separated)"
            placeholder="e.g. Dust, Pollen, Latex"
            {...register("others")}
            error={errors?.others}
            disabled={!isEditing}
          />
        </div>

        {/* 👉 UPDATED: Save Button with disabled state */}
        {isEditing && (
          <button
            onClick={handleSubmit(handlePreSubmit)}
            disabled={hasErrors}
            className={`flex items-center mt-8 px-6 py-2 rounded-lg text-white transition-all ${
              hasErrors
                ? "bg-slate-400 cursor-not-allowed opacity-50 dark:bg-slate-600"
                : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 cursor-pointer"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        )}
      </div>

      {/* =======================
          CONFIRMATION MODAL
      ======================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className={`w-full max-w-sm p-6 rounded-2xl shadow-xl transform transition-all ${
              isDark
                ? "bg-slate-800 text-white border border-slate-700"
                : "bg-white text-slate-900"
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Save Changes?</h3>
            <p className="text-sm opacity-80 mb-6">
              Are you sure you want to update your Allergies?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                Cancel
              </button>

              <button
                onClick={confirmSave}
                disabled={isSaving}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Yes, Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================
          SUCCESS TOAST
      ======================== */}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-xl animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            Allergies saved successfully!
          </span>
        </div>
      )}
    </>
  );
}

/* =========================
INPUT COMPONENT
========================== */
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
        ${error ? "border-red-500 focus:border-red-500" : "border-slate-300 dark:border-slate-600 focus:border-blue-500"}
        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-gray-500" : ""}
        ${className}`}
        />

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  },
);
