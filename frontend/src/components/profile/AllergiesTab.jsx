// src/components/profile/AllergiesTab.jsx
import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allergiesSchema } from "../../schemas/profileSchema";
import { Pencil, X, Save } from "lucide-react";

export default function AllergiesTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(allergiesSchema),
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

  const onSubmit = (data) => {
    // 👉 Helper function to convert comma string back to a clean array
    const cleanArrayString = (str) => {
      if (!str) return [];
      return str
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""); // Drops empty items if a user types ",,"
    };

    const firestorePayload = {
      food: cleanArrayString(data.food),
      medicines: cleanArrayString(data.medicines),
      others: cleanArrayString(data.others),
    };

    console.log("Saving to Firestore:", firestorePayload);
    alert("Allergies saved!");
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