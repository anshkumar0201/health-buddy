// src/components/profile/MedicationsTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicationsSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save, Plus, Trash2 } from "lucide-react";

export default function MedicationsTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    control, // 👉 REQUIRED for useFieldArray
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicationsSchema),
    defaultValues: {
      medications: [],
    },
  });

  // 👉 The magic hook for dynamic arrays of objects!
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications", // This must match the key in your schema/defaultValues
  });

  // Hydrate form with Database data
  useEffect(() => {
    // Simulated fetch from Firestore
    const fetchedDataFromDB = [
      { medName: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      {
        medName: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily with meals",
      },
    ];

    reset({
      ...getValues(),
      medications: fetchedDataFromDB.length > 0 ? fetchedDataFromDB : [],
    });
  }, [reset, getValues]);

  const onSubmit = (data) => {
    console.log("Saving to Firestore:", data);
    // firestorePayload = { medications: data.medications }
    alert("Medications saved!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(); // Reverts to the baseline, throwing away unsaved new rows
    setIsEditing(false);
  };

  const handleAddMedication = () => {
    // Appends a fresh, empty object to the list
    append({ medName: "", dosage: "", frequency: "" });
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medications</h2>

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

      {/* Dynamic List of Medications */}
      <div className="space-y-4">
        {fields.length === 0 && !isEditing && (
          <p className="text-sm opacity-60">No medications listed.</p>
        )}

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 relative"
          >
            <Input
              label="Medicine Name"
              placeholder="e.g. Lisinopril"
              // 👉 Notice the dynamic template literal!
              {...register(`medications.${index}.medName`)}
              error={errors?.medications?.[index]?.medName}
              disabled={!isEditing}
            />

            <div className="grid grid-cols-2 gap-3">
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

            {/* Remove Row Button (Only visible in edit mode) */}
            {isEditing && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute -top-3 -right-3 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                title="Remove Medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {/* Add Row Button (Only visible in edit mode) */}
        {isEditing && (
          <button
            type="button"
            onClick={handleAddMedication}
            className="flex items-center text-sm text-blue-500 font-medium mt-2 hover:underline"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Medication
          </button>
        )}
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

// Make sure your Input component is available in this file or imported!
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