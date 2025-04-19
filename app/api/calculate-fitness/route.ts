import { type NextRequest, NextResponse } from "next/server"
import {
  calculateBMR,
  mapActivityLevel,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  adjustCaloriesByBodyComposition,
  calculateWaterNeeds,
} from "@/lib/fitness-calculator"
import {
  calculateMealFrequency,
  calculateNutrientTiming,
  generateMealPlanMacros,
  adjustForDietaryPreferences,
  generateFoodRecommendations,
} from "@/lib/nutrition-calculator"
import { generateWorkoutPlan } from "@/lib/workout-generator"
import type { FitnessData } from "@/types/fitness"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

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
      daysPerWeek,
      workoutDuration,
      workoutLocation,
      workoutPreference,
      diet,
      proteinIntake,
      sleepHours,
      communicationStyle,
    } = data

    // Convert height and weight to metric if needed
    const heightCm = heightUnit === "cm" ? Number.parseFloat(height) : Number.parseFloat(height) * 30.48
    const weightKg = weightUnit === "kg" ? Number.parseFloat(weight) : Number.parseFloat(weight) * 0.453592

    // Calculate BMR (Basal Metabolic Rate)
    const bmr = calculateBMR(gender, weightKg, heightCm, Number.parseInt(age))

    // Map activity level from questionnaire data
    const activityLevel = mapActivityLevel(daysPerWeek, workoutDuration)

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = calculateTDEE(bmr, activityLevel)

    // Calculate target calories based on goal
    let targetCalories = calculateTargetCalories(tdee, fitnessGoal)

    // Adjust calories based on body composition
    targetCalories = adjustCaloriesByBodyComposition(targetCalories, heightCm, weightKg, gender)

    // Calculate macronutrient targets
    let macros = calculateMacros(targetCalories, weightKg, fitnessGoal, fitnessExperience)

    // Adjust macros based on dietary preferences
    macros = adjustForDietaryPreferences(macros, diet)

    // Calculate water needs
    const waterNeeds = calculateWaterNeeds(weightKg, activityLevel)

    // Generate workout plan
    const workoutPlan = generateWorkoutPlan(
      daysPerWeek,
      workoutPreference,
      workoutLocation,
      fitnessGoal,
      fitnessExperience,
    )

    // Calculate meal frequency
    const mealFrequency = calculateMealFrequency(workoutDuration, daysPerWeek)

    // Generate meal plan macros
    const mealPlan = generateMealPlanMacros(targetCalories, macros.protein, macros.carbs, macros.fat, mealFrequency)

    // Calculate nutrient timing recommendations
    const nutrientTiming = calculateNutrientTiming(fitnessGoal, workoutPreference)

    // Generate food recommendations
    const foodRecommendations = generateFoodRecommendations(diet, fitnessGoal)

    // Compile all fitness data
    const fitnessData: FitnessData = {
      gender,
      age: Number.parseInt(age),
      height: heightCm,
      weight: weightKg,
      goal: fitnessGoal,
      experienceLevel: fitnessExperience,
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
  } catch (error) {
    console.error("Error calculating fitness data:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate fitness data" }, { status: 500 })
  }
}
