import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vitalsSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import SkeletonVitalsTab from "../skeletons/profile/SkeletonVitalsTab";

// 👉 NEW: Helper function to ensure consistent DD-MM-YYYY formatting
const formatToDDMMYYYY = (dateString) => {
  if (!dateString) return "";

  // If it's already in DD-MM-YYYY, just return it
  if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
    return dateString;
  }

  // If it's an old record in YYYY-MM-DD format, convert it
  if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  return dateString; // fallback
};

export default function VitalsTab({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

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
    resolver: zodResolver(vitalsSchema),
    mode: "onChange",
    defaultValues: {
      bloodPressure: "",
      bloodSugar: "",
      heartRate: "",
      oxygenLevel: "",
      lastUpdated: "",
    },
  });

  useEffect(() => {
    const fetchVitals = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().vitals || {};

          reset({
            ...getValues(),
            bloodPressure: data.bloodPressure || "",
            bloodSugar: data.bloodSugar || "",
            heartRate: data.heartRate || "",
            oxygenLevel: data.oxygenLevel || "",
            // 👉 UPDATED: Format date to DD-MM-YYYY on fetch
            lastUpdated: formatToDDMMYYYY(data.lastUpdated),
          });
        }
      } catch (error) {
        console.error("Error fetching vitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [user?.uid, reset, getValues]);

  const handlePreSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setIsSaving(true);

    try {
      // 👉 UPDATED: Generate today's date directly in DD-MM-YYYY format
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const formattedToday = `${day}-${month}-${year}`;

      const firestorePayload = {
        ...pendingData,
        lastUpdated: formattedToday, // Save as DD-MM-YYYY directly in DB!
      };

      console.log("Saving Vitals to Firestore:", firestorePayload);

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { vitals: firestorePayload }, { merge: true });

      reset(firestorePayload);

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

  const handleCancel = () => {
    setIsFetching(true);
    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
      const data = docSnap.exists() ? docSnap.data().vitals || {} : {};
      reset({
        bloodPressure: data.bloodPressure || "",
        bloodSugar: data.bloodSugar || "",
        heartRate: data.heartRate || "",
        oxygenLevel: data.oxygenLevel || "",
        // 👉 UPDATED: Ensure format remains correct if they cancel changes
        lastUpdated: formatToDDMMYYYY(data.lastUpdated),
      });
      setIsFetching(false);
      setIsEditing(false);
    });
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (loading) {
    return <SkeletonVitalsTab />;
  }

  return (
    <>
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold tracking-tight ${isDark ? "text-gray-100" : "text-slate-800"}`}
          >
            Current Vitals
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

          <div className="pt-2 relative">
            <Input
              label="Last Updated Date"
              type="text" // 👉 THE FIX: Changed from 'date' to 'text' to kill the mobile calendar chevron icon
              {...register("lastUpdated")}
              error={errors?.lastUpdated}
              readOnly={true}
              placeholder="" // 👉 THE FIX: Keeps field completely blank if there's no data
              className={`opacity-80 cursor-not-allowed ${isDark ? "bg-[#131314]" : "bg-slate-50"}`}
            />
            <p
              className={`absolute -bottom-5 left-1 text-[10px] md:text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              *Date is updated automatically when you save changes.
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            onClick={handleSubmit(handlePreSubmit)}
            disabled={hasErrors}
            className={`flex items-center mt-10 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
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
              Are you sure you want to update your Vitals?
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

      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">
            Vitals saved successfully!
          </span>
        </div>
      )}
    </>
  );
}

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
