import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  adjustCaloriesByBodyComposition,
  calculateWaterNeeds,
} from "@/lib/fitness-calculator"
import { generateWorkoutPlan } from "@/lib/workout-generator"
import {
  calculateMealFrequency,
  calculateNutrientTiming,
  generateMealPlanMacros,
  adjustForDietaryPreferences,
  generateFoodRecommendations,
} from "@/lib/nutrition-calculator"
import type { FitnessData } from "@/types/fitness"

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()

    // Validate input
    const schema = z.object({
      gender: z.enum(["male", "female"]),
      age: z.number().int().min(13).max(120),
      height: z.number().positive(),
      heightUnit: z.enum(["cm", "ft"]),
      weight: z.number().positive(),
      weightUnit: z.enum(["kg", "lbs"]),
      fitnessGoal: z.string(),
      fitnessExperience: z.string(),
      exerciseFrequency: z.string(), // How many days per week did you exercise in the past month
      workoutDays: z.string(), // How many days per week can you commit to exercising
      workoutDuration: z.string(),
      workoutLocation: z.string(),
      workoutPreference: z.string(),
      diet: z.string(),
      sleepHours: z.string(),
      communicationStyle: z.string(),
      occupationActivity: z.string().optional(),
      bodyFatLevel: z.string().optional(),
    })
    let data
    try {
      data = schema.parse(raw)
    } catch (validationError) {
      console.error("Validation error:", validationError)
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: "Invalid input data", details: validationError.errors }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 })
    }

    console.log("Received input:", data)

    // --- NORMALIZATION HELPERS ---
    const normalizeGoal = (goal: string): string => {
      const map: Record<string, string> = {
        "gain muscle": "build muscle",
        "gain": "build muscle",
        "build muscle": "build muscle",
        "lose fat": "lose fat",
        "lose weight": "lose fat",
        "lose": "lose fat",
        "maintain": "overall health",
        "maintenance": "overall health",
        "improve endurance": "improve endurance",
        "athletic performance": "athletic performance",
        "overall health": "overall health",
      };
      return map[goal.trim().toLowerCase()] || goal.trim().toLowerCase();
    };

    const normalizeExperience = (exp: string): string => {
      const map: Record<string, string> = {
        "beginner": "beginner",
        "intermediate": "intermediate",
        "advanced": "advanced"
      };
      return map[exp.trim().toLowerCase()] || "beginner";
    };

    const normalizeActivity = (activity: string): string => {
      const map: Record<string, string> = {
        "sedentary": "sedentary",
        "lightly-active": "light",
        "light": "light",
        "moderately-active": "moderate",
        "moderate": "moderate",
        "very-active": "active",
        "active": "active",
        "extremely-active": "veryActive",
        "veryactive": "veryActive",
        "extra": "veryActive"
      };
      return map[activity.trim().toLowerCase()] || "sedentary";
    };

    // Extract form data
    const {
      gender,
      age,
      height,
      heightUnit,
      weight,
      weightUnit,
      fitnessGoal,
      fitnessExperience,
      exerciseFrequency,
      workoutDays,
      workoutDuration,
      workoutLocation,
      workoutPreference,
      diet,
      sleepHours,
      communicationStyle,
      occupationActivity,
      bodyFatLevel,
    } = data

    // Defensive conversion for height/weight
    let heightCm = height
    if (heightUnit === "ft") {
      const feet = Math.floor(height)
      const inches = (height % 1) * 12
      heightCm = Math.round(feet * 30.48 + inches * 2.54)
    }
    let weightKg = weight
    if (weightUnit === "lbs") {
      weightKg = Math.round(weight * 0.453592 * 100) / 100
    }

    // --- NORMALIZE ALL STRINGS ---
    const normalizedGoal = normalizeGoal(fitnessGoal)
    const normalizedExperience = normalizeExperience(fitnessExperience)
    const normalizedActivity = normalizeActivity(occupationActivity || "sedentary")

    // Map weekly exercise days to ACSM activity level for TDEE
    const exerciseDays = parseInt(exerciseFrequency);
    let activityLevel: string;
    if (!isNaN(exerciseDays)) {
      if (exerciseDays <= 1) activityLevel = "sedentary";
      else if (exerciseDays <= 3) activityLevel = "light";
      else if (exerciseDays <= 5) activityLevel = "moderate";
      else if (exerciseDays <= 6) activityLevel = "active";
      else activityLevel = "veryActive";
    } else {
      activityLevel = normalizedActivity; // fallback to occupation-based level
    }

    // Calculate BMR
    const bmr = Math.round(calculateBMR(gender, weightKg, heightCm, age))

    // Calculate TDEE using ACSM multipliers (includes TEF)
    const tdee = calculateTDEE(bmr, activityLevel)

    // Calculate target calories (pass gender for safeguard)
    let targetCalories = Math.round(calculateTargetCalories(tdee, normalizedGoal, gender))
    targetCalories = Math.round(adjustCaloriesByBodyComposition(targetCalories, heightCm, weightKg, gender, age))

    // Defensive: fallback for negative or zero calories
    if (!targetCalories || targetCalories < 800) {
      targetCalories = 1200 // Safe minimum
    }

    // Calculate macros
    let macros = calculateMacros(targetCalories, weightKg, normalizedGoal, normalizedExperience, bodyFatLevel)
    macros = adjustForDietaryPreferences(macros, diet)

    // Defensive: ensure macros are not NaN or negative
    macros.protein = Math.max(20, Math.round(macros.protein) || 0)
    macros.carbs = Math.max(20, Math.round(macros.carbs) || 0)
    macros.fat = Math.max(10, Math.round(macros.fat) || 0)

    // Calculate water needs
    const waterNeeds = calculateWaterNeeds(weightKg, activityLevel)

    // Parse days per week
    let trainingDays = 3
    const workoutDaysNum = parseInt(workoutDays)
    if (!isNaN(workoutDaysNum) && workoutDaysNum >= 1 && workoutDaysNum <= 7) {
      trainingDays = workoutDaysNum
    } else {
      // Fallback for string options
      if (workoutDays.includes("1")) trainingDays = 1
      else if (workoutDays.includes("2")) trainingDays = 2
      else if (workoutDays.includes("3")) trainingDays = 3
      else if (workoutDays.includes("4")) trainingDays = 4
      else if (workoutDays.includes("5")) trainingDays = 5
      else if (workoutDays.includes("6")) trainingDays = 6
      else if (workoutDays.includes("7")) trainingDays = 7
    }

    // Generate workout plan (use generator that returns typed WorkoutPlan[])
    const workoutPlan = generateWorkoutPlan(String(trainingDays), workoutPreference, workoutLocation, normalizedGoal, normalizedExperience)

    // Calculate meal frequency
    const mealFrequency = calculateMealFrequency(workoutDuration, workoutDays)

    // Generate meal plan macros
    const mealPlan = generateMealPlanMacros(targetCalories, macros.protein, macros.carbs, macros.fat, mealFrequency)

    // Calculate nutrient timing recommendations
    const nutrientTiming = calculateNutrientTiming(normalizedGoal, workoutPreference)

    // Generate food recommendations
    const foodRecommendations = generateFoodRecommendations(diet, normalizedGoal)

    // Compile all fitness data
    const fitnessData: FitnessData = {
      gender: gender,
      age: age,
      height: heightCm,
      weight: weightKg,
      goal: normalizedGoal,
      experienceLevel: normalizedExperience,
      bmr,
      tdee,
      targetCalories,
      macros,
      waterNeeds,
      workoutPlan,
      mealFrequency,
      mealPlan,
      nutrientTiming,
      foodRecommendations,
    }

    return NextResponse.json({ success: true, data: fitnessData })
  } catch (error: any) {
    console.error("Error calculating fitness data:", error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to calculate fitness data" }, { status: 500 })
  }
}
