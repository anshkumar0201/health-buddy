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