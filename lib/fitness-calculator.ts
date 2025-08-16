// Fitness calculation constants and formulas based on scientific research
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise (ACSM)
  light: 1.375, // Light exercise 1-3x/week
  moderate: 1.55, // Moderate exercise 3-5x/week
  active: 1.725, // Hard exercise 6-7x/week
  veryActive: 1.9, // Very hard exercise/physical job
}

export const GOAL_ADJUSTMENTS = {
  "lose fat": -500, // 500 kcal deficit for 0.5kg/week loss (standard)
  "build muscle": 250, // 250 kcal surplus for lean mass gain (Helms 2019, ISSN)
  "improve endurance": 100, // Slight surplus for endurance needs
  "overall health": 0, // Maintenance
  "athletic performance": 200, // Moderate surplus for performance
}

export const MACRO_RATIOS = {
  "lose fat": {
    protein: 0.35, // High protein for muscle retention
    carbs: 0.35, // Moderate carbs for energy
    fat: 0.3, // Moderate fat
  },
  "build muscle": {
    protein: 0.25, // Sufficient for hypertrophy
    carbs: 0.5, // High carbs for training
    fat: 0.25, // Moderate fat
  },
  "improve endurance": {
    protein: 0.2,
    carbs: 0.6, // High carbs for endurance
    fat: 0.2,
  },
  "overall health": {
    protein: 0.25,
    carbs: 0.5,
    fat: 0.25,
  },
  "athletic performance": {
    protein: 0.25,
    carbs: 0.55, // High carbs
    fat: 0.2,
  },
}

export const PROTEIN_REQUIREMENTS = {
  "lose fat": {
    beginner: 2.2,
    intermediate: 2.4,
    advanced: 2.6,
  },
  "build muscle": {
    beginner: 1.8,
    intermediate: 2.0,
    advanced: 2.2,
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
    beginner: 1.8,
    intermediate: 2.0,
    advanced: 2.2,
  },
}

// Calorie adjustment based on body fat percentage (estimated from BMI)
export const adjustCaloriesByBodyComposition = (
  calories: number,
  heightCm: number,
  weightKg: number,
  gender: string,
  age: number,
): number => {
  // Calculate BMI
  const bmi = weightKg / Math.pow(heightCm / 100, 2)

  // Estimate body fat percentage using age-adjusted formula
  const estimatedBodyFat =
    gender.toLowerCase() === "male"
      ? 1.2 * bmi + 0.23 * age - 16.2
      : 1.2 * bmi + 0.23 * age - 5.4

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
  // Base water needs: approx. 35ml per kg of body weight
  let baseWater = weightKg * 35

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

// --- SCIENTIFICALLY ACCURATE BMR (Mifflin-St Jeor) ---
export const calculateBMR = (gender: string, weightKg: number, heightCm: number, age: number): number => {
  // Mifflin-St Jeor (1990, validated 2020)
  // Gender must be 'male' or 'female', case-insensitive
  const g = gender.toLowerCase();
  if (g === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (g === "female") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Default to male if unspecified
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
}

// --- SCIENTIFICALLY ACCURATE TDEE (includes TEF) ---
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || ACTIVITY_MULTIPLIERS.sedentary;
  // Standard TDEE multipliers already include TEF; do NOT multiply by 1.1 again
  const tdee = bmr * multiplier;
  return Math.round(tdee);
}

// --- SCIENTIFICALLY ACCURATE TARGET CALORIES ---
export const calculateTargetCalories = (tdee: number, goal: string, gender?: string): number => {
  const enhancedAdjustments = {
    "lose fat": -500, // Standard caloric deficit for fat loss
    "build muscle": 250, // Increased from 300 to 250 for better muscle gain results
    "improve endurance": 100, // Slight surplus for endurance needs
    "overall health": 0, // Maintenance for general health
    "athletic performance": 200, // Moderate surplus for performance
  }
  
  const adjustment = enhancedAdjustments[goal as keyof typeof enhancedAdjustments] || 0
  let targetCalories;
  if (goal === "lose fat" && tdee < 1800) {
    targetCalories = Math.round(tdee * 0.8); // Use 20% deficit for low TDEE
  } else {
    targetCalories = Math.round(tdee + adjustment);
  }
  // Minimum calorie safeguard
  if (gender && goal === "lose fat") {
    if (gender.toLowerCase() === "female" && targetCalories < 1200) {
      targetCalories = 1200;
    } else if (gender.toLowerCase() === "male" && targetCalories < 1500) {
      targetCalories = 1500;
    }
  }
  return targetCalories;
}

// --- SCIENTIFICALLY ACCURATE MACRO CALCULATION ---
export const calculateMacros = (
  calories: number,
  weightKg: number,
  goal: string,
  experienceLevel: string,
  bodyFatLevel?: string
): { protein: number; carbs: number; fat: number } => {
  // Enhanced protein requirements based on latest research
  const enhancedProteinRequirements = {
    "lose fat": {
      beginner: 2.2,
      intermediate: 2.4,
      advanced: 2.6,
    },
    // For muscle gain, always use 2.2g/kg (evidence-based upper end)
    "build muscle": {
      beginner: 2.2,
      intermediate: 2.2,
      advanced: 2.2,
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
      beginner: 1.8,
      intermediate: 2.0,
      advanced: 2.2,
    },
  };

  // --- LBM-based protein calculation ---
  let bfPercent: number | null = null;
  if (bodyFatLevel) {
    // Accept formats like '18-23', '35', '40+', '13–17', etc.
    const match = bodyFatLevel.match(/\d+/g);
    if (match) {
      // Use the lower bound for a range, or the single value
      bfPercent = parseFloat(match[0]);
    }
  }
  let lbm = weightKg;
  if (bfPercent !== null && bfPercent > 0 && bfPercent < 70) {
    lbm = weightKg * (1 - bfPercent / 100);
  }

  // Enforce a minimum of 2.2g/kg protein for all goals (evidence-based)
  let proteinPerKg = 2.2;

  // Calculate protein in grams with precise rounding
  // Use LBM for protein if body fat is provided and valid
  const proteinGrams = Math.round(lbm * proteinPerKg);

  // Calculate protein calories precisely
  const proteinCalories = proteinGrams * 4;

  // Get macro ratio for the goal
  const macroRatio = MACRO_RATIOS[goal as keyof typeof MACRO_RATIOS] || MACRO_RATIOS["overall health"];

  // Ensure calculated macros exactly match the target calories
  const remainingCalories = calories - proteinCalories
  
  // Calculate specific carb and fat ratios from the remaining calories
  const carbsRatio = macroRatio.carbs / (macroRatio.carbs + macroRatio.fat)
  const fatRatio = macroRatio.fat / (macroRatio.carbs + macroRatio.fat)

  // Calculate carbs and fat in grams with exact calculations to match target calories
  const carbsGrams = Math.round((remainingCalories * carbsRatio) / 4)
  const fatGrams = Math.round((remainingCalories * fatRatio) / 9)

  // Verify the total calories match the target
  const calculatedCalories = (proteinGrams * 4) + (carbsGrams * 4) + (fatGrams * 9)
  
  // Fine-tune carbs or fat if there's any calorie discrepancy
  let adjustedCarbsGrams = carbsGrams;
  let adjustedFatGrams = fatGrams;
  
  const calorieDifference = calories - calculatedCalories;
  if (Math.abs(calorieDifference) > 10) {
    // If off by more than 10 calories, make an adjustment
    if (calorieDifference > 0) {
      // Add calories to the primary macro based on goal
      if (goal === "build muscle" || goal === "athletic performance" || goal === "improve endurance") {
        adjustedCarbsGrams += Math.round(calorieDifference / 4);
      } else {
        adjustedFatGrams += Math.round(calorieDifference / 9);
      }
    } else {
      // Remove calories from the primary macro based on goal
      if (goal === "build muscle" || goal === "athletic performance" || goal === "improve endurance") {
        adjustedCarbsGrams -= Math.round(Math.abs(calorieDifference) / 4);
      } else {
        adjustedFatGrams -= Math.round(Math.abs(calorieDifference) / 9);
      }
    }
  }

  return {
    protein: proteinGrams,
    carbs: adjustedCarbsGrams,
    fat: adjustedFatGrams,
  }
}

// Map questionnaire activity level to multiplier
export const mapActivityLevel = (exerciseFrequency: string, workoutDuration: string): string => {
  // Convert workout duration to minutes (approximate)
  let durationMinutes = 0;
  if (workoutDuration === "30 minutes") {
    durationMinutes = 30;
  } else if (workoutDuration === "45 minutes") {
    durationMinutes = 45;
  } else if (workoutDuration === "60 minutes") {
    durationMinutes = 60;
  } else if (workoutDuration === "90 minutes") {
    durationMinutes = 90;
  } else if (workoutDuration === "120+ minutes") {
    durationMinutes = 120;
  }

  // Map the exercise frequency to days per week
  let daysPerWeek = 0;
  if (exerciseFrequency === "0 days") {
    daysPerWeek = 0;
  } else if (exerciseFrequency === "1-2 days") {
    daysPerWeek = 1.5; // Average of 1 and 2
  } else if (exerciseFrequency === "3-4 days") {
    daysPerWeek = 3.5; // Average of 3 and 4
  } else if (exerciseFrequency === "5+ days") {
    daysPerWeek = 5.5; // Average of 5 and 6
  }

  // Calculate weekly exercise minutes
  const weeklyExerciseMinutes = daysPerWeek * durationMinutes;

  // Map to activity levels based on total weekly exercise volume
  if (weeklyExerciseMinutes < 60) {
    return "sedentary";
  } else if (weeklyExerciseMinutes < 150) {
    return "light";
  } else if (weeklyExerciseMinutes < 300) {
    return "moderate";
  } else if (weeklyExerciseMinutes < 450) {
    return "active";
  } else {
    return "veryActive";
  }
}

// Scientific workout split definitions based on training frequency research
export const WORKOUT_SPLITS = {
  "1x": {
    name: "Full Body",
    schedule: ["Full Body", "Rest", "Rest", "Rest", "Rest", "Rest", "Full Body"],
    description: "A comprehensive full-body routine targeting all major muscle groups in a single session."
  },
  "2x": {
    name: "Full Body 2x",
    schedule: ["Full Body", "Rest", "Full Body", "Rest", "Rest", "Rest", "Full Body"],
    description: "Two full-body sessions per week to ensure all muscle groups are trained at least twice, aligned with scientific consensus."
  },
  "3x": {
    name: "Full Body 3x",
    schedule: ["Full Body", "Rest", "Full Body", "Rest", "Full Body", "Rest", "Full Body"],
    description: "Three full-body sessions per week for optimal frequency."
  },
  "4x": {
    name: "Upper/Lower Split",
    schedule: ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Full Body"],
    description: "Upper and lower body split performed twice per week for balanced development and 2x frequency."
  },
  "5x": {
    name: "Full Body/UL Split",
    schedule: ["Full Body", "Upper", "Lower", "Full Body", "Upper", "Lower", "Full Body"],
    description: "Hybrid split to allow every muscle group to be hit at least 2x per week."
  },
  "6x": {
    name: "Push/Pull/Legs x2",
    schedule: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Full Body"],
    description: "Classic Push/Pull/Legs split repeated twice weekly for 2x frequency."
  },
  "7x": {
    name: "Full Body/Push/Pull/Legs",
    schedule: ["Full Body", "Push", "Pull", "Legs", "Upper", "Lower", "Full Body"],
    description: "High-frequency split ensuring all muscle groups are trained at least 2x/week."
  },
}

// Define workout focus for each type of training day
export const WORKOUT_FOCUS = {
  "Full Body": "Compound movements targeting all major muscle groups",
  "Upper": "Chest, back, shoulders, and arms",
  "Lower": "Quads, hamstrings, glutes, and calves",
  "Push": "Chest, shoulders, and triceps",
  "Pull": "Back and biceps",
  "Legs": "Quads, hamstrings, glutes, and calves",
  "Rest": "Active recovery and mobility work"
}

// Define muscle groups
export const MUSCLE_GROUPS = {
  "Chest": ["Pectoralis Major", "Pectoralis Minor"],
  "Back": ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Erector Spinae"],
  "Shoulders": ["Deltoids (Front)", "Deltoids (Side)", "Deltoids (Rear)"],
  "Legs": ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
  "Arms": ["Biceps", "Triceps", "Forearms"],
  "Core": ["Rectus Abdominis", "Obliques", "Transverse Abdominis"],
}

// Define exercise alternatives for swapping
export const EXERCISE_ALTERNATIVES = {
  // Compound Movements
  "Barbell Squat": [
    { name: "Goblet Squat", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Leg Press", equipment: "machine", difficulty: "beginner" },
    { name: "Dumbbell Squat", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Hack Squat", equipment: "machine", difficulty: "intermediate" },
    { name: "Front Squat", equipment: "barbell", difficulty: "intermediate" },
    { name: "Bulgarian Split Squat", equipment: "dumbbell", difficulty: "intermediate" },
  ],
  "Bench Press": [
    { name: "Push-Ups", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Dumbbell Bench Press", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Machine Chest Press", equipment: "machine", difficulty: "beginner" },
    { name: "Floor Press", equipment: "barbell", difficulty: "intermediate" },
    { name: "Incline Bench Press", equipment: "barbell", difficulty: "intermediate" },
    { name: "Decline Bench Press", equipment: "barbell", difficulty: "intermediate" },
  ],
  "Deadlift": [
    { name: "Romanian Deadlift", equipment: "barbell", difficulty: "beginner" },
    { name: "Dumbbell Romanian Deadlift", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Sumo Deadlift", equipment: "barbell", difficulty: "intermediate" },
    { name: "Trap Bar Deadlift", equipment: "trap bar", difficulty: "beginner" },
    { name: "Good Morning", equipment: "barbell", difficulty: "intermediate" },
    { name: "Back Extension", equipment: "machine", difficulty: "beginner" },
  ],
  "Overhead Press": [
    { name: "Seated Dumbbell Press", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Machine Shoulder Press", equipment: "machine", difficulty: "beginner" },
    { name: "Pike Push-Up", equipment: "bodyweight", difficulty: "intermediate" },
    { name: "Arnold Press", equipment: "dumbbell", difficulty: "intermediate" },
    { name: "Z Press", equipment: "barbell", difficulty: "advanced" },
    { name: "Landmine Press", equipment: "barbell", difficulty: "intermediate" },
  ],
  "Bent Over Row": [
    { name: "Dumbbell Row", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Inverted Row", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Cable Row", equipment: "cable", difficulty: "beginner" },
    { name: "T-Bar Row", equipment: "machine", difficulty: "intermediate" },
    { name: "Meadows Row", equipment: "barbell", difficulty: "intermediate" },
    { name: "Chest Supported Row", equipment: "dumbbell", difficulty: "beginner" },
  ],
  "Pull-Up or Lat Pulldown": [
    { name: "Lat Pulldown", equipment: "cable", difficulty: "beginner" },
    { name: "Assisted Pull-Up", equipment: "machine", difficulty: "beginner" },
    { name: "Negative Pull-Up", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Band-Assisted Pull-Up", equipment: "band", difficulty: "beginner" },
    { name: "Straight Arm Pulldown", equipment: "cable", difficulty: "intermediate" },
    { name: "Chin-Up", equipment: "bodyweight", difficulty: "intermediate" },
  ],
  
  // Isolation Movements
  "Tricep Extension": [
    { name: "Tricep Pushdown", equipment: "cable", difficulty: "beginner" },
    { name: "Dumbbell Tricep Extension", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Diamond Push-Up", equipment: "bodyweight", difficulty: "intermediate" },
    { name: "Skull Crusher", equipment: "barbell", difficulty: "intermediate" },
    { name: "Overhead Tricep Extension", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Close Grip Bench Press", equipment: "barbell", difficulty: "intermediate" },
  ],
  "Bicep Curl": [
    { name: "Dumbbell Curl", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Hammer Curl", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Cable Curl", equipment: "cable", difficulty: "beginner" },
    { name: "Preacher Curl", equipment: "barbell", difficulty: "intermediate" },
    { name: "Concentration Curl", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Chin-Up", equipment: "bodyweight", difficulty: "intermediate" },
  ],
  "Leg Press": [
    { name: "Goblet Squat", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Lunges", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Dumbbell Squat", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Step-Up", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Bulgarian Split Squat", equipment: "dumbbell", difficulty: "intermediate" },
    { name: "Hack Squat", equipment: "machine", difficulty: "intermediate" },
  ],
  "Leg Curl": [
    { name: "Glute Ham Raise", equipment: "machine", difficulty: "intermediate" },
    { name: "Nordic Curl", equipment: "bodyweight", difficulty: "advanced" },
    { name: "Stability Ball Leg Curl", equipment: "ball", difficulty: "beginner" },
    { name: "Band Leg Curl", equipment: "band", difficulty: "beginner" },
    { name: "Good Morning", equipment: "barbell", difficulty: "intermediate" },
    { name: "Romanian Deadlift", equipment: "barbell", difficulty: "intermediate" },
  ],
  "Calf Raise": [
    { name: "Standing Calf Raise", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Seated Calf Raise", equipment: "machine", difficulty: "beginner" },
    { name: "Single Leg Calf Raise", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Donkey Calf Raise", equipment: "machine", difficulty: "intermediate" },
    { name: "Jump Rope", equipment: "rope", difficulty: "beginner" },
    { name: "Stair Calf Raise", equipment: "bodyweight", difficulty: "beginner" },
  ],
  "Lateral Raise": [
    { name: "Cable Lateral Raise", equipment: "cable", difficulty: "beginner" },
    { name: "Band Lateral Raise", equipment: "band", difficulty: "beginner" },
    { name: "Machine Lateral Raise", equipment: "machine", difficulty: "beginner" },
    { name: "Upright Row", equipment: "barbell", difficulty: "intermediate" },
    { name: "Front Raise", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Reverse Fly", equipment: "dumbbell", difficulty: "beginner" },
  ],
  "Incline Dumbbell Press": [
    { name: "Incline Bench Press", equipment: "barbell", difficulty: "intermediate" },
    { name: "Incline Push-Up", equipment: "bodyweight", difficulty: "beginner" },
    { name: "Incline Machine Press", equipment: "machine", difficulty: "beginner" },
    { name: "Low-to-High Cable Fly", equipment: "cable", difficulty: "intermediate" },
    { name: "Incline Dumbbell Fly", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Landmine Press", equipment: "barbell", difficulty: "intermediate" },
  ],
  "Face Pull": [
    { name: "Band Pull-Apart", equipment: "band", difficulty: "beginner" },
    { name: "Reverse Fly", equipment: "dumbbell", difficulty: "beginner" },
    { name: "Rear Delt Row", equipment: "dumbbell", difficulty: "beginner" },
    { name: "YTW Raises", equipment: "dumbbell", difficulty: "intermediate" },
    { name: "High Row", equipment: "cable", difficulty: "beginner" },
    { name: "Prone Rear Delt Raise", equipment: "dumbbell", difficulty: "beginner" },
  ],
}

// Define exercise targets for muscle groups
export const EXERCISE_TARGETS = {
  "Barbell Squat": ["Quads", "Glutes", "Hamstrings", "Core"],
  "Bench Press": ["Chest", "Shoulders", "Triceps"],
  "Bent Over Row": ["Back", "Biceps", "Forearms", "Core"],
  "Overhead Press": ["Shoulders", "Triceps", "Upper Chest", "Core"],
  "Deadlift": ["Hamstrings", "Glutes", "Back", "Forearms", "Core"],
  "Romanian Deadlift": ["Hamstrings", "Glutes", "Lower Back"],
  "Pull-Up or Lat Pulldown": ["Back", "Biceps", "Forearms", "Core"],
  "Tricep Extension": ["Triceps"],
  "Bicep Curl": ["Biceps", "Forearms"],
  "Leg Press": ["Quads", "Glutes", "Hamstrings"],
  "Leg Curl": ["Hamstrings"],
  "Calf Raise": ["Calves"],
  "Lateral Raise": ["Shoulders"],
  "Incline Dumbbell Press": ["Upper Chest", "Shoulders", "Triceps"],
  "Face Pull": ["Rear Deltoids", "Upper Back", "Rotator Cuff"],
  "Tricep Pushdown": ["Triceps"],
  "Barbell Row": ["Back", "Biceps", "Forearms", "Core"],
}

// Default exercise templates for each workout type
const defaultExercises = {
  // Push Exercises (Chest, Shoulders, Triceps)
  push: [
    { name: "Barbell Bench Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Incline Dumbbell Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Cable Tricep Pushdowns", sets: "3", reps: "10-15", weight: "", completed: false },
    { name: "Overhead Tricep Extension", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Pull Exercises (Back, Biceps, Rear Deltoids)
  pull: [
    { name: "Barbell Rows", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Seated Cable Rows", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Face Pulls", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Barbell Curls", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Hammer Curls", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Lower Body Exercises
  legs: [
    { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Romanian Deadlift", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Leg Press", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Walking Lunges", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Leg Extensions", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Leg Curls", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Standing Calf Raises", sets: "3", reps: "15-20", weight: "", completed: false }
  ],
  // Upper Body (Chest, Back, Shoulders, Arms)
  upper: [
    { name: "Barbell Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Bent Over Rows", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Tricep Pushdowns", sets: "3", reps: "10-15", weight: "", completed: false },
    { name: "Bicep Curls", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Lower Body (Quads, Hamstrings, Glutes, Calves)
  lower: [
    { name: "Barbell Squat", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Bulgarian Split Squats", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Hip Thrusts", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Leg Extensions", sets: "3", reps: "10-15", weight: "", completed: false },
    { name: "Leg Curls", sets: "3", reps: "10-15", weight: "", completed: false },
    { name: "Standing Calf Raises", sets: "3", reps: "15-20", weight: "", completed: false }
  ],
  // Full Body Workout
  fullBody: [
    { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Dips", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Bicep Curls", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Rest day - empty
  rest: []
};

// --- SIMPLIFIED, SCIENCE-BASED WORKOUT SPLIT LOGIC ---
// Overwrite generateWorkoutPlan to ensure clear, research-backed splits for each frequency
export const generateWorkoutPlan = (
  daysPerWeek: number,
  workoutPreference?: string,
  workoutLocation?: string,
  goal?: string,
  experienceLevel?: string
): Array<{
  day: string;
  focus: string;
  exercises: Array<{ name: string; sets: string; reps: string; weight: string; completed?: boolean }>;
  completed: boolean;
}> => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let split: string[] = [];

  switch (daysPerWeek) {
    case 6:
      // PPL Rest PPL
      split = ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Legs"];
      break;
    case 5:
      // PPL Rest Upper Lower
      split = ["Push", "Pull", "Legs", "Rest", "Upper", "Lower", "Rest"];
      break;
    case 4:
      // Upper Lower Rest Upper Lower
      split = ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Rest"];
      break;
    case 3:
      // Full Body Rest Full Body Rest Full Body Rest Rest
      split = ["Full Body", "Rest", "Full Body", "Rest", "Full Body", "Rest", "Rest"];
      break;
    case 2:
      // Full Body Rest Full Body Rest Rest Rest Rest
      split = ["Full Body", "Rest", "Full Body", "Rest", "Rest", "Rest", "Rest"];
      break;
    case 1:
    default:
      // One full body session
      split = ["Full Body", "Rest", "Rest", "Rest", "Rest", "Rest", "Rest"];
      break;
  }

  return daysOfWeek.map((day, idx) => {
    let focus = split[idx] || "Rest";
    let exercises: any[] = [];
    // Enhanced: Optimal selection for each split type
    switch (focus.toLowerCase()) {
      case "push":
        exercises = [
          { name: "Barbell Bench Press", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Cable Tricep Pushdowns", sets: "3", reps: "10-15", weight: "", completed: false },
          { name: "Overhead Tricep Extension", sets: "3", reps: "10-12", weight: "", completed: false }
        ];
        break;
      case "pull":
        exercises = [
          { name: "Barbell Rows", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Seated Cable Rows", sets: "3", reps: "10-12", weight: "", completed: false },
          { name: "Face Pulls", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Barbell Curls", sets: "3", reps: "10-12", weight: "", completed: false },
          { name: "Hammer Curls", sets: "3", reps: "10-12", weight: "", completed: false }
        ];
        break;
      case "legs":
        exercises = [
          { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Romanian Deadlift", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Leg Press", sets: "3", reps: "10-12", weight: "", completed: false },
          { name: "Walking Lunges", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Leg Extensions", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Leg Curls", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Standing Calf Raises", sets: "3", reps: "15-20", weight: "", completed: false }
        ];
        break;
      case "upper":
        exercises = [
          { name: "Barbell Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Bent Over Rows", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "", completed: false },
          { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "", completed: false },
          { name: "Tricep Pushdowns", sets: "3", reps: "10-15", weight: "", completed: false },
          { name: "Bicep Curls", sets: "3", reps: "10-12", weight: "", completed: false }
        ];
        break;
      case "lower":
        exercises = [
          { name: "Barbell Squat", sets: "3", reps: "6-8", weight: "", completed: false },
          { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
          { name: "Bulgarian Split Squats", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Hip Thrusts", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Leg Extensions", sets: "3", reps: "10-15", weight: "", completed: false },
          { name: "Leg Curls", sets: "3", reps: "10-15", weight: "", completed: false },
          { name: "Standing Calf Raises", sets: "3", reps: "15-20", weight: "", completed: false }
        ];
        break;
      case "full body":
        exercises = [
          { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
          { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
          { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Dips", sets: "3", reps: "8-12", weight: "", completed: false },
          { name: "Bicep Curls", sets: "3", reps: "10-12", weight: "", completed: false }
        ];
        break;
      default:
        exercises = [];
    }
    return {
      day,
      focus,
      exercises,
      completed: false
    };
  });
}

// Create a workout plan based on user data
export const createWorkoutPlan = (userData: any): any[] => {
  const { currentExerciseDays, exerciseHistory, goal } = userData;
  
  let workoutPlan;
  
  if (currentExerciseDays <= 3) {
    workoutPlan = generateWorkoutPlan(3);
  } else if (currentExerciseDays === 4) {
    workoutPlan = generateWorkoutPlan(4);
  } else if (currentExerciseDays === 5) {
    workoutPlan = generateWorkoutPlan(5);
  } else {
    workoutPlan = generateWorkoutPlan(6);
  }
  
  // Add default exercises to the workout plan
  return workoutPlan;
};
