export interface Exercise {
  name: string
  sets: number
  reps: string
  weight: string
  rir?: string
  completed?: boolean
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

  // Workout plan
  workoutPlan: WorkoutPlan[]
  
  // Health metrics
  bmr?: number // Basal Metabolic Rate
  tdee?: number // Total Daily Energy Expenditure
  targetCalories?: number
  waterNeeds?: number // in ml
  
  // Nutrition data
  macros?: {
    protein: number
    carbs: number
    fat: number
  }
  mealFrequency?: number
  mealPlan?: any // Detailed meal plan structure
  nutrientTiming?: any // Nutrient timing recommendations
  foodRecommendations?: any // Food recommendations based on diet

  // Progress tracking
  progressData?: {
    dates: string[]
    weight: number[]
    bodyFat: number[]
  }
}
