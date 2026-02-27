// src/components/profile/MedicationsTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicationsSchema } from "../../schemas/profileSchema";
import {
  Pencil,
  X,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// 👉 NEW: Import Firestore methods
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function MedicationsTab({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // 👉 NEW: Loading state

  // States for Modal, Toast, and Loading status
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicationsSchema),
    mode: "onChange",
    defaultValues: {
      medications: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  // 👉 UPDATED: Fetch data from Firestore on mount
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedMeds = docSnap.data().medications || [];

          reset({
            ...getValues(),
            medications: fetchedMeds,
          });
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMedications();
  }, [user, reset, getValues]);

  const handlePreSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  // 👉 UPDATED: Save data directly to Firestore
  const confirmSave = async () => {
    setIsSaving(true);

    try {
      console.log("Saving Medications to Firestore:", pendingData.medications);

      const docRef = doc(db, "users", user.uid);
      // 👉 Merge true ensures we only update the medications array!
      await setDoc(
        docRef,
        { medications: pendingData.medications },
        { merge: true },
      );

      setShowConfirmModal(false);
      setIsEditing(false);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // 👉 UPDATED: Cancel resets to DB values
  const handleCancel = () => {
    setIsFetching(true);
    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
      const fetchedMeds = docSnap.exists()
        ? docSnap.data().medications || []
        : [];
      reset({
        medications: fetchedMeds,
      });
      setIsFetching(false);
      setIsEditing(false);
    });
  };

  const handleAddMedication = () => {
    append({ medName: "", dosage: "", frequency: "" });
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2
          className={`w-8 h-8 animate-spin ${isDark ? "text-blue-400" : "text-blue-500"}`}
        />
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in duration-300">
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold tracking-tight ${isDark ? "text-gray-100" : "text-slate-800"}`}
          >
            Medications
          </h2>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-xl font-semibold transition-all duration-300 ${
                isDark
                  ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Section
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className={`flex items-center px-4 py-2 cursor-pointer text-sm rounded-xl font-semibold border transition-all duration-300 ${
                isDark
                  ? "bg-[#131314] text-[#C4C7C5] border-[#282A2C] hover:bg-[#282A2C] hover:text-gray-100"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
        </div>

        {/* Dynamic List of Medications */}
        <div className="space-y-5">
          {fields.length === 0 && !isEditing && (
            <p className="text-sm opacity-60">No medications listed.</p>
          )}

          {fields.map((item, index) => (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 space-y-4 relative transition-colors duration-300 ${
                isDark
                  ? "border-[#282A2C] bg-[#131314]/50"
                  : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <Input
                label="Medicine Name"
                placeholder="e.g. Lisinopril"
                {...register(`medications.${index}.medName`)}
                error={errors?.medications?.[index]?.medName}
                disabled={!isEditing}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Dosage"
                  placeholder="e.g. 10mg"
                  {...register(`medications.${index}.dosage`)}
                  error={errors?.medications?.[index]?.dosage}
                  disabled={!isEditing}
                />
                <Input
                  label="Frequency"
                  placeholder="e.g. Twice daily"
                  {...register(`medications.${index}.frequency`)}
                  error={errors?.medications?.[index]?.frequency}
                  disabled={!isEditing}
                />
              </div>

              {/* Remove Row Button */}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={`absolute -top-3 -right-3 p-1.5 rounded-full shadow-sm transition cursor-pointer hover:scale-110 ${
                    isDark
                      ? "bg-[#1E1F20] text-red-400 border border-[#282A2C] hover:bg-red-500/10"
                      : "bg-white text-red-500 border border-slate-200 hover:bg-red-50"
                  }`}
                  title="Remove Medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Add Row Button */}
          {isEditing && (
            <button
              type="button"
              onClick={handleAddMedication}
              className={`flex items-center text-sm font-semibold mt-2 transition-all cursor-pointer ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Medication
            </button>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSubmit(handlePreSubmit)}
            disabled={hasErrors}
            className={`flex items-center mt-8 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              hasErrors
                ? isDark
                  ? "bg-[#131314] text-[#C4C7C5] border border-[#282A2C] cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform transition-all ${
              isDark
                ? "bg-[#1E1F20] text-[#E3E3E3] border border-[#282A2C]"
                : "bg-white text-slate-900"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Save Changes?</h3>
            <p
              className={`text-sm mb-6 leading-relaxed ${isDark ? "text-[#C4C7C5]" : "opacity-80"}`}
            >
              Are you sure you want to update your Medications?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors ${
                  isDark
                    ? "bg-[#131314] text-[#E3E3E3] border-[#282A2C] hover:bg-[#282A2C]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                Cancel
              </button>

              <button
                onClick={confirmSave}
                disabled={isSaving}
                className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
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
        <div className="fixed bottom-24 right-6 z-50 flex items-center bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">
            Medications saved successfully!
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
    {
      label,
      placeholder,
      error,
      type,
      className = "",
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        <label className="text-sm font-medium opacity-80 mb-1.5 block">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder || `Enter ${label}`}
          {...props}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(e) => {
            if (type === "number" && (e.key === "-" || e.key === "e")) {
              e.preventDefault();
            }
          }}
          className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all duration-300
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 dark:border-[#282A2C] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        }
        ${
          disabled || readOnly
            ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-[#131314] text-slate-500 dark:text-[#C4C7C5]"
            : "bg-slate-50 dark:bg-[#131314] text-slate-900 dark:text-[#E3E3E3] hover:border-slate-300 dark:hover:border-slate-600"
        }
        ${className}`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);
