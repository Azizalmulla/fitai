// Fitness calculation constants and formulas based on scientific research
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Heavy exercise 6-7 days/week
  veryActive: 1.9, // Very heavy exercise, physical job or training twice a day
}

export const GOAL_ADJUSTMENTS = {
  "lose fat": -500, // Caloric deficit for fat loss
  "build muscle": 300, // Caloric surplus for muscle gain
  "improve endurance": 0, // Maintenance for endurance
  "overall health": 0, // Maintenance for health
  "athletic performance": 200, // Slight surplus for performance
}

export const MACRO_RATIOS = {
  "lose fat": {
    protein: 0.4, // Higher protein for muscle preservation during fat loss
    carbs: 0.3,
    fat: 0.3,
  },
  "build muscle": {
    protein: 0.3, // Balanced approach for muscle building
    carbs: 0.45,
    fat: 0.25,
  },
  "improve endurance": {
    protein: 0.25,
    carbs: 0.55, // Higher carbs for endurance activities
    fat: 0.2,
  },
  "overall health": {
    protein: 0.3,
    carbs: 0.4,
    fat: 0.3,
  },
  "athletic performance": {
    protein: 0.3,
    carbs: 0.5, // Higher carbs for performance
    fat: 0.2,
  },
}

// Protein requirements based on goals and experience level (g/kg of bodyweight)
export const PROTEIN_REQUIREMENTS = {
  "lose fat": {
    beginner: 1.8,
    intermediate: 2.0,
    advanced: 2.2,
  },
  "build muscle": {
    beginner: 1.6,
    intermediate: 1.8,
    advanced: 2.0,
  },
  "improve endurance": {
    beginner: 1.4,
    intermediate: 1.6,
    advanced: 1.8,
  },
  "overall health": {
    beginner: 1.2,
    intermediate: 1.4,
    advanced: 1.6,
  },
  "athletic performance": {
    beginner: 1.6,
    intermediate: 1.8,
    advanced: 2.0,
  },
}

// Calorie adjustment based on body fat percentage (estimated from BMI)
export const adjustCaloriesByBodyComposition = (
  calories: number,
  heightCm: number,
  weightKg: number,
  gender: string,
): number => {
  // Calculate BMI
  const bmi = weightKg / Math.pow(heightCm / 100, 2)

  // Estimate body fat percentage based on BMI and gender
  // This is a simplified estimation - DEXA scans or other methods would be more accurate
  let estimatedBodyFat: number

  if (gender === "male") {
    estimatedBodyFat = 1.2 * bmi + 0.23 * 30 - 16.2 // 30 is used as average age
  } else {
    estimatedBodyFat = 1.2 * bmi + 0.23 * 30 - 5.4
  }

  // Adjust calories based on estimated body fat
  if (estimatedBodyFat > 25 && gender === "male") {
    return calories * 0.9 // Reduce calories for higher body fat
  } else if (estimatedBodyFat > 32 && gender === "female") {
    return calories * 0.9
  } else if (estimatedBodyFat < 10 && gender === "male") {
    return calories * 1.1 // Increase calories for very low body fat
  } else if (estimatedBodyFat < 18 && gender === "female") {
    return calories * 1.1
  }

  return calories
}

// Calculate water needs based on weight and activity level
export const calculateWaterNeeds = (weightKg: number, activityLevel: string): number => {
  // Base water needs: 30-35ml per kg of body weight
  let baseWater = weightKg * 33

  // Adjust for activity level
  switch (activityLevel) {
    case "light":
      baseWater *= 1.1
      break
    case "moderate":
      baseWater *= 1.2
      break
    case "active":
      baseWater *= 1.3
      break
    case "veryActive":
      baseWater *= 1.4
      break
    default:
      // sedentary - no adjustment
      break
  }

  // Round to nearest 50ml
  return Math.round(baseWater / 50) * 50
}

// Calculate BMR using the Mifflin-St Jeor Equation
export const calculateBMR = (gender: string, weightKg: number, heightCm: number, age: number): number => {
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }
}

// Map questionnaire activity level to multiplier
export const mapActivityLevel = (daysPerWeek: string, workoutDuration: string): string => {
  if (daysPerWeek === "2-3 days") {
    return workoutDuration === "under 30 minutes" ? "light" : "moderate"
  } else if (daysPerWeek === "4-5 days") {
    return workoutDuration === "under 30 minutes" ? "moderate" : "active"
  } else {
    // 6+ days
    return workoutDuration === "under 30 minutes" ? "active" : "veryActive"
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS]
  return Math.round(bmr * multiplier)
}

// Calculate target calories based on TDEE and goal
export const calculateTargetCalories = (tdee: number, goal: string): number => {
  const adjustment = GOAL_ADJUSTMENTS[goal as keyof typeof GOAL_ADJUSTMENTS] || 0
  return Math.round(tdee + adjustment)
}

// Calculate macronutrient targets based on calories and goal
export const calculateMacros = (
  calories: number,
  weightKg: number,
  goal: string,
  experienceLevel: string,
): { protein: number; carbs: number; fat: number } => {
  // Get protein requirement based on goal and experience
  const proteinPerKg =
    PROTEIN_REQUIREMENTS[goal as keyof typeof PROTEIN_REQUIREMENTS]?.[
      experienceLevel as keyof (typeof PROTEIN_REQUIREMENTS)[keyof typeof PROTEIN_REQUIREMENTS]
    ] || 1.6

  // Calculate protein in grams
  const proteinGrams = Math.round(weightKg * proteinPerKg)

  // Get macro ratio for the goal
  const macroRatio = MACRO_RATIOS[goal as keyof typeof MACRO_RATIOS] || MACRO_RATIOS["overall health"]

  // Calculate remaining calories after protein
  const proteinCalories = proteinGrams * 4
  const remainingCalories = calories - proteinCalories

  // Adjust carbs and fat ratio for the remaining calories
  const carbsRatio = macroRatio.carbs / (macroRatio.carbs + macroRatio.fat)
  const fatRatio = macroRatio.fat / (macroRatio.carbs + macroRatio.fat)

  // Calculate carbs and fat in grams
  const carbsGrams = Math.round((remainingCalories * carbsRatio) / 4)
  const fatGrams = Math.round((remainingCalories * fatRatio) / 9)

  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  }
}
