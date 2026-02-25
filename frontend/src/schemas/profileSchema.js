// src/schemas/profileSchema.js
import { z } from "zod";

const optionalNumber = (min, max, errorMsg) =>
    z.union([
        z.coerce.number().min(min, errorMsg).max(max, errorMsg),
        z.literal(""),
        z.nan(),
        z.undefined()
    ]).optional();

export const personalInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string(),
    age: optionalNumber(0, 120, "Age must be between 0-120"),
    gender: z.string().optional().or(z.literal("")),
    bloodGroup: z.string().optional(),
    height: optionalNumber(30, 250, "Invalid height (30-250cm)"),
    weight: optionalNumber(1, 300, "Invalid weight (1-300kg)"),
});

export const medicalConditionsSchema = z.object({
    // We validate it as a string here because the input field outputs a comma-separated string
    conditions: z.string().optional(),
    notes: z.string().optional(),
});

export const medicationsSchema = z.object({
    medications: z.array(
        z.object({
            medName: z.string().min(1, "Medicine name is required"),
            dosage: z.string().min(1, "Dosage is required"),
            frequency: z.string().min(1, "Frequency is required"),
        })
    ).default([]), // Defaults to an empty array
});

export const allergiesSchema = z.object({
    food: z.string().optional(),
    medicines: z.string().optional(),
    others: z.string().optional(),
});

export const surgeriesSchema = z.object({
    surgeries: z.array(
        z.object({
            surgeryName: z.string().min(1, "Surgery name is required"),
            // Re-using the logic to gracefully handle empty number inputs
            year: z.union([
                z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Cannot be in the future"),
                z.literal(""),
                z.nan(),
                z.undefined()
            ]).optional(),
            hospital: z.string().optional(),
        })
    ).default([]),
});

// Add to the bottom of src/schemas/profileSchema.js

export const vitalsSchema = z.object({
    bloodPressure: z.string().optional(), // Stored as a string like "120/80"
    bloodSugar: optionalNumber(0, 1000, "Invalid blood sugar level"),
    heartRate: optionalNumber(0, 300, "Invalid heart rate"),
    oxygenLevel: optionalNumber(0, 100, "Invalid oxygen level (0-100%)"),
    lastUpdated: z.string().optional(), // Stored as a date string "YYYY-MM-DD"
});

export const lifestyleSchema = z.object({
    smoking: z.string().optional().or(z.literal("")),
    alcohol: z.string().optional(),
    exercise: z.string().optional(),
    sleepHours: optionalNumber(0, 24, "Invalid hours (0-24)"),
});

export const emergencyContactSchema = z.object({
    name: z.string().optional().or(z.literal("")),
    relation: z.string().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    alternateNumber: z.string().optional(),
});