// src/components/profile/EmergencyContactTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emergencyContactSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save } from "lucide-react";

// The options from your original monolithic file
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

export default function EmergencyContactTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      relation: "",
      phone: "",
      alternateNumber: "",
    },
  });

  // Hydrate form with Database data
  useEffect(() => {
    // Simulated fetch from Firestore
    // e.g., fetched from doc(db, 'users', user.uid).emergencyContact
    const fetchedDataFromDB = {
      name: "Jane Doe",
      relation: "Spouse",
      phone: "+1 555-0198",
      alternateNumber: "+1 555-0199",
    };

    reset({
      ...getValues(),
      name: fetchedDataFromDB.name || "",
      relation: fetchedDataFromDB.relation || "",
      phone: fetchedDataFromDB.phone || "",
      alternateNumber: fetchedDataFromDB.alternateNumber || "",
    });
  }, [reset, getValues]);

  const onSubmit = (data) => {
    console.log("Saving to Firestore:", data);
    alert("Emergency Contact saved!");
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
        <h2 className="text-xl font-semibold">Emergency Contact</h2>

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
          label="Contact Name"
          placeholder="e.g. Jane Doe"
          {...register("name")}
          error={errors?.name}
          disabled={!isEditing}
        />

        <Select
          label="Relationship"
          options={RELATION_OPTIONS}
          {...register("relation")}
          error={errors?.relation}
          disabled={!isEditing}
        />

        <Input
          label="Primary Phone"
          placeholder="e.g. +1 555-0198"
          {...register("phone")}
          error={errors?.phone}
          disabled={!isEditing}
        />

        <Input
          label="Alternate Phone"
          placeholder="e.g. +1 555-0199"
          {...register("alternateNumber")}
          error={errors?.alternateNumber}
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

// Make sure your Input and Select components are available here!
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