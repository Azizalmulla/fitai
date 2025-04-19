export interface Exercise {
  name: string
  sets: number
  reps: string
  weight: string
}

export interface WorkoutPlan {
  day: string
  focus: string
  exercises: Exercise[]
  completed: boolean
}

export interface FitnessData {
  // Basic user info
  gender: string
  age: number
  height: number // in cm
  weight: number // in kg
  goal: string
  experienceLevel: string

  // Calculated metrics
  bmr: number
  tdee: number
  targetCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  waterNeeds: number

  // Workout plan
  workoutPlan: WorkoutPlan[]

  // Nutrition recommendations
  mealFrequency: number
  mealPlan: Array<{
    meal: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  nutrientTiming: {
    preworkout: string
    postworkout: string
    general: string
  }
  foodRecommendations: {
    proteins: string[]
    carbs: string[]
    fats: string[]
    vegetables: string[]
  }
}
