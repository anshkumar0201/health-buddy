// src/components/profile/PersonalInfoTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save } from "lucide-react";

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Intersex",
  "Prefer not to say",
  "Other",
];

export default function PersonalInfoTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
      reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
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

  // Hydrate form when user data loads
 useEffect(() => {
   if (user) {
     // We grab all the current empty defaults, but overwrite the name and email.
     // Because we use reset() here, this becomes the form's permanent fallback state.
     reset({
       ...getValues(),
       name: user.displayName || "",
       email: user.email || "",
     });
   }
 }, [user, reset, getValues]);

  const onSubmit = (data) => {
    console.log("Saving Personal Info:", data);
    alert("Personal Info saved!");
    setIsEditing(false);
    // 👉 Firestore save doc(db, 'users', user.uid), { personalInfo: data }
  };

  const handleCancel = () => {
    // 👉 Now, when we call reset(), it safely reverts to the baseline we established in the useEffect!
    reset();
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Info</h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 text-sm cursor-pointer rounded-lg bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 font-medium hover:bg-blue-200 transition"
          >
            <Pencil className="w-4 h-4 mr-2" /> {/* 👉 Edit Icon */}
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
      <div className="space-y-3">
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
          className="opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            error={errors?.age}
            disabled={!isEditing}
          />
          <Select
            label="Gender"
            options={GENDER_OPTIONS}
            {...register("gender")}
            error={errors?.gender}
            disabled={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
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

// 👉 NOTE: Paste your Input and Select forwardRef components here at the bottom of the file (or import them from a shared UI folder).
/* =========================
INPUT COMPONENTS
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
        ${error ? "border-red-500" : "border-slate-300 dark:border-slate-600"}
        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-gray-500" : "focus:border-blue-500"}
        ${className}`}
        />

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  },
);

const Select = forwardRef(
  (
    {
      label,
      placeholder,
      options = [],
      error,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        <label className="text-sm opacity-70">{label}</label>

        <select
          ref={ref}
          disabled={disabled}
          {...props}
          className={`w-full mt-1 px-3 py-2 rounded-lg border outline-none bg-transparent transition-colors
        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-gray-500" : "cursor-pointer focus:border-blue-500"}
        ${error ? "border-red-500" : "border-slate-300 dark:border-slate-600"}
        ${className}`}
        >
          <option value="" disabled hidden>
            {placeholder || `Select ${label}`}
          </option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  },
);
