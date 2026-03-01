import SkeletonMedicalConditionsTab from "../skeletons/profile/SkeletonMedicalConditionsTab";
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalConditionsSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// 👉 NEW: Import Firestore methods
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function MedicalConditionsTab({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // initial skeleton
  const [isFetching, setIsFetching] = useState(false); // cancel reset loader

  // States for Modal, Toast, and Loading status
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
    resolver: zodResolver(medicalConditionsSchema),
    mode: "onChange",
    defaultValues: {
      conditions: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchMedicalConditions = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().medicalConditions || {};

          reset({
            ...getValues(),
            conditions: data.conditions ? data.conditions.join(", ") : "",
            notes: data.notes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching medical conditions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalConditions();
  }, [user?.uid]);

  const handlePreSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  // 👉 UPDATED: Save data directly to Firestore
  const confirmSave = async () => {
    setIsSaving(true);

    try {
      const cleanConditionsArray = pendingData.conditions
        ? pendingData.conditions
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
        : [];

      const firestorePayload = {
        conditions: cleanConditionsArray,
        notes: pendingData.notes,
      };

      console.log("Saving Medical Conditions to Firestore:", firestorePayload);

      const docRef = doc(db, "users", user.uid);
      // 👉 Merge true ensures we only update the medicalConditions object!
      await setDoc(
        docRef,
        { medicalConditions: firestorePayload },
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
      const data = docSnap.exists()
        ? docSnap.data().medicalConditions || {}
        : {};
      reset({
        conditions: data.conditions ? data.conditions.join(", ") : "",
        notes: data.notes || "",
      });
      setIsFetching(false);
      setIsEditing(false);
    });
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (loading) {
    return <SkeletonMedicalConditionsTab />;
  }

  return (
    <>
      <div className="animate-in fade-in duration-300">
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold tracking-tight ${isDark ? "text-gray-100" : "text-slate-800"}`}
          >
            Medical Conditions
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
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isFetching}
              className={`flex items-center px-4 py-2 text-sm rounded-xl font-semibold border transition-all duration-300 ${
                isDark
                  ? "bg-[#131314] text-[#C4C7C5] border-[#282A2C] hover:bg-[#282A2C] hover:text-gray-100"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              } ${isFetching ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              )}
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
              Are you sure you want to update your Medical Conditions?
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
            Medical Conditions saved successfully!
          </span>
        </div>
      )}
    </>
  );
}

/* =========================
INPUT & TEXTAREA COMPONENTS
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

const Textarea = forwardRef(
  (
    { label, placeholder, error, className = "", disabled, readOnly, ...props },
    ref,
  ) => {
    return (
      <div>
        <label className="text-sm font-medium opacity-80 mb-1.5 block">
          {label}
        </label>
        <textarea
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder || `Enter ${label}`}
          rows={4}
          {...props}
          className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all duration-300 resize-none custom-scrollbar
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
