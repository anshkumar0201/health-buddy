// src/components/profile/PersonalInfoTab.jsx
import { useState, useEffect, forwardRef, useRef } from "react"; // 👉 Added useRef
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "../../schemas/profileSchema";
import { useAuth } from "../../context/AuthContext";
import {
  Pencil,
  X,
  Save,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import SkeletonPersonalInfoTab from "../skeletons/profile/SkeletonPersonalInfoTab";

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Intersex",
  "Prefer not to say",
  "Other",
];

export default function PersonalInfoTab({ user }) {
  const { authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // States for the Modal, Toast, and Loading status
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch, // 👉 NEW: Added watch to read the current dropdown value
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      age: "",
      gender: "",
      bloodGroup: "",
      height: "",
      weight: "",
    },
  });

  useEffect(() => {
    if (!user?.uid) return;

    const fetchPersonalInfo = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().personalInfo || {};

          reset({
            ...getValues(),
            name: data.name || user.displayName || "",
            email: user.email || "",
            age: data.age || "",
            gender: data.gender || "",
            bloodGroup: data.bloodGroup || "",
            height: data.height || "",
            weight: data.weight || "",
          });
        } else {
          reset({
            ...getValues(),
            name: user.displayName || "",
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [user?.uid, user?.email, user?.displayName]);

  const handlePreSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setIsSaving(true);

    try {
      const docRef = doc(db, "users", user.uid);

      // We use { merge: true } so we don't overwrite other profile tabs like medications or allergies!
      await setDoc(docRef, { personalInfo: pendingData }, { merge: true });

      setShowConfirmModal(false);
      setIsEditing(false);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save changes to Firestore:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // A quick hack to force reset to the last fetched values if they canceled edits
    setIsFetching(true);
    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
      const data = docSnap.exists() ? docSnap.data().personalInfo || {} : {};
      reset({
        name: data.name || user.displayName || "",
        email: user.email || "",
        age: data.age || "",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        height: data.height || "",
        weight: data.weight || "",
      });
      setIsFetching(false);
      setIsEditing(false);
    });
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (authLoading || !user?.uid || loading) {
    return <SkeletonPersonalInfoTab />;
  }

  return (
    <>
      <div>
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold tracking-tight ${isDark ? "text-gray-100" : "text-slate-800"}`}
          >
            Personal Info
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
            label="Full Name"
            {...register("name")}
            error={errors?.name}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            {...register("email")}
            error={errors?.email}
            readOnly={true}
            className={isDark ? "bg-[#131314]" : "bg-slate-50"}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              error={errors?.age}
              disabled={!isEditing}
            />

            {/* 👉 UPDATED: Using the new CustomSelect component */}
            <CustomSelect
              label="Gender"
              options={GENDER_OPTIONS}
              value={watch("gender")}
              onChange={(val) =>
                setValue("gender", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={errors?.gender}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height (cm)"
              type="number"
              {...register("height", { valueAsNumber: true })}
              error={errors?.height}
              disabled={!isEditing}
            />
            <Input
              label="Weight (kg)"
              type="number"
              {...register("weight", { valueAsNumber: true })}
              error={errors?.weight}
              disabled={!isEditing}
            />
          </div>

          <Input
            label="Blood Group"
            {...register("bloodGroup")}
            error={errors?.bloodGroup}
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
              Are you sure you want to update your Personal Information?
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
            Personal Info saved successfully!
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

/* =========================
👉 NEW: CUSTOM SELECT COMPONENT
========================== */
const CustomSelect = ({
  label,
  placeholder,
  options = [],
  error,
  disabled,
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="text-sm font-medium opacity-80 mb-1.5 block">
        {label}
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border outline-none transition-all duration-300 select-none
        ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-[#131314] text-slate-500 dark:text-[#C4C7C5]"
            : "cursor-pointer bg-slate-50 dark:bg-[#131314] hover:border-slate-300 dark:hover:border-slate-600"
        }
        ${
          error
            ? "border-red-500 ring-2 ring-red-500/20"
            : isOpen
              ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500"
              : "border-slate-200 dark:border-[#282A2C]"
        }
        ${className}`}
      >
        <span
          className={`${!value ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-[#E3E3E3]"}`}
        >
          {value || placeholder || `Select ${label}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 py-1.5 rounded-xl border border-slate-200 dark:border-[#282A2C] bg-white dark:bg-[#1E1F20] shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors
                ${
                  value === opt
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-700 dark:text-[#C4C7C5] hover:bg-slate-50 dark:hover:bg-[#282A2C] hover:text-slate-900 dark:hover:text-[#E3E3E3]"
                }`}
              >
                {opt}
                {value === opt && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
};
