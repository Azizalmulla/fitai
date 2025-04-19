// Calculate meal frequency based on user preferences and schedule
export const calculateMealFrequency = (workoutDuration: string, daysPerWeek: string): number => {
  // Default to 3 meals per day
  let mealFrequency = 3

  // Adjust based on workout intensity and frequency
  if (daysPerWeek === "6+ days" && workoutDuration !== "under 30 minutes") {
    mealFrequency = 5 // More frequent meals for high training volume
  } else if (daysPerWeek === "4-5 days" && workoutDuration !== "under 30 minutes") {
    mealFrequency = 4 // Moderate meal frequency for moderate training volume
  }

  return mealFrequency
}

// Calculate nutrient timing recommendations
export const calculateNutrientTiming = (
  goal: string,
  workoutPreference: string,
): { preworkout: string; postworkout: string; general: string } => {
  let preworkout = ""
  let postworkout = ""
  let general = ""

  // Base recommendations on goal
  if (goal === "build muscle") {
    preworkout = "Consume 20-40g of protein and 30-50g of carbs 1-2 hours before training"
    postworkout = "Consume 30-40g of protein and 40-60g of carbs within 30-60 minutes after training"
    general = "Distribute protein intake evenly throughout the day (20-40g per meal)"
  } else if (goal === "lose fat") {
    preworkout = "Consume 20g of protein and 15-20g of carbs 1-2 hours before training"
    postworkout = "Consume 30g of protein and 20-30g of carbs within 30-60 minutes after training"
    general = "Focus on protein and fiber-rich foods to increase satiety"
  } else if (goal === "improve endurance") {
    preworkout = "Consume 15-20g of protein and 40-60g of carbs 1-2 hours before training"
    postworkout = "Consume 20g of protein and 60-80g of carbs within 30-60 minutes after training"
    general = "Prioritize carbohydrate intake around training sessions"
  } else {
    preworkout = "Consume 20g of protein and 20-40g of carbs 1-2 hours before training"
    postworkout = "Consume 20-30g of protein and 30-40g of carbs within 30-60 minutes after training"
    general = "Maintain consistent meal timing throughout the day"
  }

  // Adjust based on workout preference
  if (workoutPreference.includes("hiit") || workoutPreference.includes("interval")) {
    preworkout = preworkout.replace(/carbs \d+-\d+g/, "carbs 30-40g")
    postworkout = postworkout.replace(/carbs \d+-\d+g/, "carbs 40-50g")
  } else if (workoutPreference.includes("strength")) {
    preworkout = preworkout.replace(/protein \d+-?\d*g/, "protein 30-40g")
    postworkout = postworkout.replace(/protein \d+-?\d*g/, "protein 40g")
  }

  return { preworkout, postworkout, general }
}

// Generate meal plan macros based on total daily targets
export const generateMealPlanMacros = (
  totalCalories: number,
  proteinGrams: number,
  carbsGrams: number,
  fatGrams: number,
  mealFrequency: number,
): Array<{ meal: string; calories: number; protein: number; carbs: number; fat: number }> => {
  const mealPlan = []

  // Distribute macros across meals
  // Breakfast: 25% of daily intake
  // Lunch: 30% of daily intake
  // Dinner: 30% of daily intake
  // Snacks: 15% of daily intake (divided equally)

  if (mealFrequency === 3) {
    // 3 meals per day
    mealPlan.push(
      {
        meal: "Breakfast",
        calories: Math.round(totalCalories * 0.3),
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbsGrams * 0.3),
        fat: Math.round(fatGrams * 0.3),
      },
      {
        meal: "Lunch",
        calories: Math.round(totalCalories * 0.35),
        protein: Math.round(proteinGrams * 0.35),
        carbs: Math.round(carbsGrams * 0.35),
        fat: Math.round(fatGrams * 0.35),
      },
      {
        meal: "Dinner",
        calories: Math.round(totalCalories * 0.35),
        protein: Math.round(proteinGrams * 0.35),
        carbs: Math.round(carbsGrams * 0.35),
        fat: Math.round(fatGrams * 0.35),
      },
    )
  } else if (mealFrequency === 4) {
    // 4 meals per day
    mealPlan.push(
      {
        meal: "Breakfast",
        calories: Math.round(totalCalories * 0.25),
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbsGrams * 0.25),
        fat: Math.round(fatGrams * 0.25),
      },
      {
        meal: "Lunch",
        calories: Math.round(totalCalories * 0.3),
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbsGrams * 0.3),
        fat: Math.round(fatGrams * 0.3),
      },
      {
        meal: "Snack",
        calories: Math.round(totalCalories * 0.15),
        protein: Math.round(proteinGrams * 0.15),
        carbs: Math.round(carbsGrams * 0.15),
        fat: Math.round(fatGrams * 0.15),
      },
      {
        meal: "Dinner",
        calories: Math.round(totalCalories * 0.3),
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbsGrams * 0.3),
        fat: Math.round(fatGrams * 0.3),
      },
    )
  } else {
    // 5 meals per day
    mealPlan.push(
      {
        meal: "Breakfast",
        calories: Math.round(totalCalories * 0.2),
        protein: Math.round(proteinGrams * 0.2),
        carbs: Math.round(carbsGrams * 0.2),
        fat: Math.round(fatGrams * 0.2),
      },
      {
        meal: "Morning Snack",
        calories: Math.round(totalCalories * 0.15),
        protein: Math.round(proteinGrams * 0.15),
        carbs: Math.round(carbsGrams * 0.15),
        fat: Math.round(fatGrams * 0.15),
      },
      {
        meal: "Lunch",
        calories: Math.round(totalCalories * 0.25),
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbsGrams * 0.25),
        fat: Math.round(fatGrams * 0.25),
      },
      {
        meal: "Afternoon Snack",
        calories: Math.round(totalCalories * 0.15),
        protein: Math.round(proteinGrams * 0.15),
        carbs: Math.round(carbsGrams * 0.15),
        fat: Math.round(fatGrams * 0.15),
      },
      {
        meal: "Dinner",
        calories: Math.round(totalCalories * 0.25),
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbsGrams * 0.25),
        fat: Math.round(fatGrams * 0.25),
      },
    )
  }

  return mealPlan
}

// Adjust nutrition based on dietary preferences
export const adjustForDietaryPreferences = (
  macros: { protein: number; carbs: number; fat: number },
  diet: string,
): { protein: number; carbs: number; fat: number } => {
  const adjustedMacros = { ...macros }

  if (diet.includes("vegetarian") || diet.includes("vegan")) {
    // Slightly lower protein, higher carbs for plant-based diets
    const proteinReduction = Math.round(adjustedMacros.protein * 0.1)
    adjustedMacros.protein -= proteinReduction
    adjustedMacros.carbs += Math.round((proteinReduction * 4) / 4) // Convert protein calories to carb grams
  } else if (diet.includes("low-carb") || diet.includes("keto")) {
    // Lower carbs, higher fat for low-carb diets
    const carbReduction = Math.round(adjustedMacros.carbs * 0.6)
    adjustedMacros.carbs -= carbReduction
    adjustedMacros.fat += Math.round((carbReduction * 4) / 9) // Convert carb calories to fat grams
  }

  return adjustedMacros
}

// Generate food recommendations based on macros and dietary preferences
export const generateFoodRecommendations = (
  diet: string,
  goal: string,
): {
  proteins: string[]
  carbs: string[]
  fats: string[]
  vegetables: string[]
} => {
  let proteins: string[] = []
  let carbs: string[] = []
  let fats: string[] = []
  let vegetables: string[] = []

  // Base recommendations
  if (diet.includes("vegetarian") || diet.includes("vegan")) {
    proteins = [
      "Tofu",
      "Tempeh",
      "Seitan",
      "Lentils",
      "Chickpeas",
      "Black beans",
      "Quinoa",
      "Plant-based protein powder",
    ]

    if (!diet.includes("vegan")) {
      proteins.push("Greek yogurt", "Cottage cheese", "Eggs", "Whey protein")
    }
  } else {
    proteins = [
      "Chicken breast",
      "Turkey breast",
      "Lean beef",
      "Fish (salmon, tuna, tilapia)",
      "Eggs",
      "Greek yogurt",
      "Cottage cheese",
      "Whey protein",
      "Tofu",
      "Lentils",
    ]
  }

  if (diet.includes("low-carb") || diet.includes("keto")) {
    carbs = ["Leafy greens", "Broccoli", "Cauliflower", "Zucchini", "Bell peppers", "Berries (in moderation)"]

    fats = [
      "Avocado",
      "Olive oil",
      "Coconut oil",
      "Nuts (almonds, walnuts, macadamias)",
      "Seeds (chia, flax, pumpkin)",
      "Nut butters",
      "Cheese",
      "Fatty fish",
      "Eggs",
    ]
  } else {
    carbs = [
      "Brown rice",
      "Quinoa",
      "Sweet potatoes",
      "Oats",
      "Whole grain bread",
      "Whole grain pasta",
      "Fruits (apples, bananas, berries)",
      "Beans and legumes",
    ]

    fats = ["Avocado", "Olive oil", "Nuts (almonds, walnuts)", "Seeds (chia, flax)", "Nut butters", "Fatty fish"]
  }

  vegetables = [
    "Broccoli",
    "Spinach",
    "Kale",
    "Bell peppers",
    "Cauliflower",
    "Zucchini",
    "Asparagus",
    "Brussels sprouts",
    "Carrots",
    "Tomatoes",
  ]

  // Adjust based on goal
  if (goal === "lose fat") {
    // Emphasize high-volume, low-calorie foods
    vegetables = [...vegetables, "Cucumber", "Celery", "Lettuce", "Mushrooms"]
    proteins = proteins.filter((p) => !p.includes("fatty"))
  } else if (goal === "build muscle") {
    // Emphasize calorie-dense options
    carbs.push("Dried fruits", "Honey", "White rice")
    fats.push("Full-fat dairy", "Dark chocolate")
  }

  return { proteins, carbs, fats, vegetables }
}
