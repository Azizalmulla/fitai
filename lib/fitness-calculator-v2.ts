/**
 * Fitness Calculator V2
 * 
 * Advanced fitness calculations based on scientific research:
 * - Mifflin-St Jeor BMR formula
 * - Activity level multipliers from Ainsworth Compendium
 * - Evidence-based macro recommendations from ISSN position stands
 * - Training split recommendations from Schoenfeld et al. 2016
 */

// Types for the input schema
export interface OnboardingInput {
  goal: "lose" | "maintain" | "gain";
  currentExerciseDays: number; // 0-7
  sessionDuration: "u30" | "30-45" | "45-60" | "60p"; // minutes
  equipment: "home-minimal" | "home-basic" | "gym-full" | "outdoor";
  commitDays: number; // 1-7
  medical: string; // "none" or free text
  weightKg: number;
  heightCm: number;
  ageY: number;
  gender: "male" | "female" | "other";
  workoutPref: "strength" | "cardio" | "mixed" | "hiit" | "mobility";
  workoutTime: "morning" | "afternoon" | "evening" | "late";
  occupationActivity: "sedentary" | "light" | "moderate" | "very" | "extra";
  stress: "low" | "moderate" | "high";
  sleepH: "<6" | "6-7" | "7-8" | "8p";
  mealsPerDay: 3 | 4 | 5 | 6;
  dietaryRestrictions: string; // "none" or free text
  dietType: "none" | "veg" | "keto" | "paleo" | "mediterranean" | "other";
}

// Types for the output schema
export interface FitnessCalculationResult {
  calTarget: number;
  macros: {
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  };
  split: string;
  weeklySessions: {
    day: string;
    focus: string;
    sets: number;
    durationMin: number;
  }[];
  recoveryTips: string[];
  hydrationMl: number;
  flags: string[];
}

// Constants based on research
// 2.1 Occupation activity factors (Ainsworth et al., Compend.PA 2011)
const OCCUPATION_FACTORS = {
  sedentary: 1.2,
  light: 1.35,
  moderate: 1.5,
  very: 1.7,
  extra: 1.9
};

// 2.2 Exercise factor bonus
const calculateExerciseFactor = (currentExerciseDays: number): number => {
  if (currentExerciseDays >= 6) return 0.10;
  if (currentExerciseDays >= 4) return 0.05;
  return 0;
};

// Import v1 science-backed macros & protein constants
import { PROTEIN_REQUIREMENTS, MACRO_RATIOS } from "./fitness-calculator"

// 2.4 Goal Adjustment constants (absolute values per Lyle McDonald)
const GOAL_ADJUSTMENTS_ABSOLUTE = {
  lose: -500,    // −500 kcal deficit
  maintain: 0,   // maintenance
  gain: 300      // +300 kcal surplus
} as const;

// 2.5 Protein recommendations (Morton et al., BJN 2018)
const getProteinRequirement = (goal: string): number => {
  // Scientific evidence-based recommendations (g/kg):
  // - General population: 0.8-1.2 g/kg
  // - Active individuals: 1.2-1.6 g/kg
  // - Strength athletes: 1.6-2.0 g/kg
  if (goal === "lose") return 1.6; // Higher end of active range for fat loss
  if (goal === "gain") return 1.7; // Lower end of strength athlete range for muscle gain
  return 1.2; // Default for maintenance (middle of active range)
};

// Training splits based on commit days (Schoenfeld et al., Sports Med 2016)
const TRAINING_SPLITS = {
  1: {
    split: "full-body",
    pattern: ["full-body", "rest", "rest", "rest", "rest", "rest", "rest"]
  },
  2: {
    split: "upper/lower",
    pattern: ["upper", "lower", "rest", "rest", "rest", "rest", "rest"]
  },
  3: {
    split: "full-body",
    pattern: ["full-body", "rest", "full-body", "rest", "full-body", "rest", "rest"]
  },
  4: {
    split: "upper/lower",
    pattern: ["upper", "lower", "rest", "upper", "lower", "rest", "rest"]
  },
  5: {
    split: "U/L/P/P/L",
    pattern: ["upper", "lower", "push", "pull", "legs", "rest", "rest"]
  },
  6: {
    split: "PPL",
    pattern: ["push", "pull", "legs", "rest", "push", "pull", "legs"]
  },
  7: {
    split: "PPL+mobility",
    pattern: ["push", "pull", "legs", "rest", "push", "pull", "legs"]
  }
};

// Session duration caps on volume
const SESSION_VOLUME = {
  "u30": { maxSets: 6, duration: 30 },
  "30-45": { maxSets: 12, duration: 45 },
  "45-60": { maxSets: 18, duration: 60 },
  "60p": { maxSets: 24, duration: 75 }
};

// Equipment-based exercise pools
const EQUIPMENT_POOLS = {
  "home-minimal": "body-weight, bands, backpack loads",
  "home-basic": "dumbbell rows, goblet squats, etc.",
  "gym-full": "barbell + machines",
  "outdoor": "run, sprint, hill, calisthenics"
};

// 2.1 Calculate BMR using Mifflin-St Jeor Equation
export const calculateBMR = (weightKg: number, heightCm: number, ageY: number, gender: string): number => {
  const s = gender === "male" ? 5 : gender === "female" ? -161 : 0;
  return Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * ageY) + s);
};

// 2.2 Calculate Activity Factor
export const calculateActivityFactor = (occupationActivity: string, currentExerciseDays: number): number => {
  // Ensure we're using the correct occupation activity key
  let occFactor = 1.2; // Default to sedentary if not found
  
  if (occupationActivity && OCCUPATION_FACTORS[occupationActivity as keyof typeof OCCUPATION_FACTORS]) {
    occFactor = OCCUPATION_FACTORS[occupationActivity as keyof typeof OCCUPATION_FACTORS];
  }
  
  const exFactor = calculateExerciseFactor(currentExerciseDays);
  
  // Debug logging
  console.log(`Activity Factor Calculation:
    - Occupation: ${occupationActivity} → Factor: ${occFactor}
    - Exercise Days: ${currentExerciseDays} → Bonus: ${exFactor}
    - Total Activity Factor: ${occFactor + exFactor}`);
  
  return occFactor + exFactor;
};

// 2.3 Calculate TDEE
export const calculateTDEE = (bmr: number, activityFactor: number): number => {
  return Math.round(bmr * activityFactor);
};

// 2.4 Calculate target calories based on goal (absolute adjustment)
export const calculateCalorieTarget = (tdee: number, goal: string): number => {
  const adj = GOAL_ADJUSTMENTS_ABSOLUTE[goal as keyof typeof GOAL_ADJUSTMENTS_ABSOLUTE] ?? 0;
  return Math.round(tdee + adj);
};

// 2.5-2.7 Calculate macros using ISSN & AMDR via v1 ratios
// Updated to accept bodyFatLevel for consistency with v1 macro logic
export const calculateMacros = (
  calTarget: number,
  weightKg: number,
  goal: string,
  dietType?: string,
  bodyFatLevel?: string
): { protein_g: number; carbs_g: number; fat_g: number } => {
  console.log(`Calculating macros with: calTarget=${calTarget}, weightKg=${weightKg}, goal=${goal}, dietType=${dietType}`);
  
  // First, calculate protein based on evidence-based g/kg recommendations
  const proteinPerKg = getProteinRequirement(goal);
  let protein_g = Math.round(weightKg * proteinPerKg);
  let proteinCalories = protein_g * 4;
  
  // Evidence-based macro distribution after protein is set
  // Default distribution based on scientific recommendations:
  let fatPercent = 0.3; // 30% - within AMDR of 20-35%
  let carbsPercent = 0; // Will be calculated after protein and fat
  
  // Adjust distribution based on goal
  if (goal === "lose") {
    fatPercent = 0.3; // Moderate fat for satiety while in deficit
  } else if (goal === "gain") {
    fatPercent = 0.25; // Slightly lower fat for more carbs to fuel training
  }
  
  // Apply diet type modifications
  if (dietType) {
    console.log(`Applying diet type modification for: ${dietType}`);
    switch (dietType) {
      case "keto":
        // Keto: Very low carb (5-10%), high fat (65-75%), moderate protein (already set)
        fatPercent = 0.7;
        break;
      case "paleo":
        // Paleo: Higher fat, lower carbs
        fatPercent = 0.35;
        break;
      case "mediterranean":
        // Mediterranean: Moderate fat (mostly from olive oil, nuts)
        fatPercent = 0.35;
        break;
      case "veg":
        // Vegetarian: Typical fat levels
        fatPercent = 0.3;
        break;
      case "other":
        // Low-carb but not keto
        fatPercent = 0.4;
        break;
      // "none" uses the default distribution
    }
  }
  
  // Calculate fat grams based on percentage of total calories
  let fat_g = Math.round((calTarget * fatPercent) / 9);
  
  // Calculate fat calories
  let fatCalories = fat_g * 9;
  
  // Remaining calories go to carbs
  let remainingCalories = calTarget - proteinCalories - fatCalories;
  let carbs_g = Math.round(remainingCalories / 4);
  
  // Special handling for keto to ensure very low carbs
  if (dietType === "keto") {
    // For keto, set carbs to fixed low amount (20-50g depending on calorie level)
    carbs_g = Math.min(50, Math.max(20, Math.round(calTarget * 0.05 / 4)));
    
    // Recalculate fat based on remaining calories
    remainingCalories = calTarget - proteinCalories - (carbs_g * 4);
    fat_g = Math.round(remainingCalories / 9);
  }
  
  // Ensure minimum values (health safety)
  carbs_g = Math.max(carbs_g, 20); // Minimum essential carbs for brain function
  fat_g = Math.max(fat_g, Math.round(0.3 * weightKg)); // Minimum essential fats (~0.3g/kg)
  
  // Calculate final macros and percentages for logging
  const final_protein_cals = protein_g * 4;
  const final_carbs_cals = carbs_g * 4;
  const final_fat_cals = fat_g * 9;
  const final_total_cals = final_protein_cals + final_carbs_cals + final_fat_cals;
  
  console.log(`Final macros: protein=${protein_g}g (${Math.round(final_protein_cals/final_total_cals*100)}%), ` +
              `carbs=${carbs_g}g (${Math.round(final_carbs_cals/final_total_cals*100)}%), ` +
              `fat=${fat_g}g (${Math.round(final_fat_cals/final_total_cals*100)}%)`);
  
  return { protein_g, carbs_g, fat_g };
};

// 2.8 Calculate meal timing
export const calculateMealTiming = (
  mealsPerDay: number, 
  workoutTime: string, 
  macros: { protein_g: number; fat_g: number; carbs_g: number }
): string => {
  let mealDistribution = `Divide your macros evenly across ${mealsPerDay} meals per day.`;
  
  if (workoutTime === "morning") {
    mealDistribution += " Ensure at least 20g of protein at breakfast to support morning workouts.";
  }
  
  if (workoutTime === "late") {
    mealDistribution += " Consider adding 30-40g of slow-digesting protein (casein) before bed.";
  }
  
  return mealDistribution;
};

// 2.9 Calculate hydration needs
export const calculateHydration = (weightKg: number, workoutPref: string, sessionDuration: string): number => {
  // Base hydration: 35ml/kg/day
  let hydrationMl = weightKg * 35;
  
  // Add for workout sessions
  if (workoutPref === "hiit" || workoutPref === "strength") {
    // Add 500ml per 30 min session
    const duration = SESSION_VOLUME[sessionDuration as keyof typeof SESSION_VOLUME].duration;
    hydrationMl += 500 * (duration / 30);
  }
  
  return Math.round(hydrationMl / 5) * 5; // Round to nearest 5ml
};

// 2.10 Apply stress/sleep modifiers
export const applyRecoveryModifiers = (
  stress: string, 
  sleepH: string, 
  originalSets: number
): { sets: number, recoveryTips: string[] } => {
  const recoveryTips = [];
  let modifiedSets = originalSets;
  
  if (stress === "high" || sleepH === "<6") {
    modifiedSets = Math.round(originalSets * 0.9); // Reduce volume by 10%
    recoveryTips.push("Aim for 7-9 hours of sleep to optimize recovery");
    recoveryTips.push("Consider adding 10-15 minutes of daily meditation to reduce stress");
  }
  
  if (sleepH === "<6") {
    recoveryTips.push("Poor sleep will significantly impact your results - prioritize improving sleep quality");
  }
  
  if (stress === "high") {
    recoveryTips.push("High stress may affect recovery; consider lower-intensity sessions on high-stress days");
  }
  
  return { sets: modifiedSets, recoveryTips };
};

// 3. Training plan generator
export const generateTrainingPlan = (
  commitDays: number,
  sessionDuration: string,
  equipment: string,
  workoutPref: string,
  stress: string,
  sleepH: string
): { split: string; weeklySessions: any[]; recoveryTips: string[] } => {
  // Get the appropriate split pattern based on commit days
  const splitConfig = TRAINING_SPLITS[commitDays as keyof typeof TRAINING_SPLITS];
  const pattern = [...splitConfig.pattern];
  
  // Get the volume configuration based on session duration
  const volumeConfig = SESSION_VOLUME[sessionDuration as keyof typeof SESSION_VOLUME];
  
  // Apply recovery modifiers based on stress and sleep
  const { sets: adjustedSets, recoveryTips } = applyRecoveryModifiers(stress, sleepH, volumeConfig.maxSets);
  
  // Map days of the week to the pattern
  // Start with Sunday as the first day of the week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Generate the weekly sessions
  const weeklySessions = pattern.map((focus, i) => {
    const day = daysOfWeek[i];
    
    // If this is a rest day, return a rest day object
    if (focus === "rest") {
      return {
        day,
        focus: "Rest Day",
        sets: 0,
        durationMin: 0,
        equipment: "none"
      };
    }
    
    // Otherwise, determine the number of sets
    let sets = adjustedSets;
    
    // Adjust based on workout preference
    let adjustedFocus = focus;
    if (workoutPref === "strength" && focus !== "mobility") {
      adjustedFocus = `${focus} (strength focus)`;
    } else if (workoutPref === "cardio" && focus !== "mobility") {
      adjustedFocus = `${focus} (cardio emphasis)`;
      sets = Math.round(sets * 0.7); // Reduce resistance training volume
    } else if (workoutPref === "hiit" && focus !== "mobility") {
      adjustedFocus = `${focus} (with HIIT)`;
    }
    
    // Ensure all exercises have 3 sets
    sets = 3;
    
    return {
      day: day,
      focus: adjustedFocus,
      sets: sets,
      durationMin: volumeConfig.duration,
      equipment: EQUIPMENT_POOLS[equipment as keyof typeof EQUIPMENT_POOLS]
    };
  });
  
  return {
    split: splitConfig.split,
    weeklySessions,
    recoveryTips
  };
};

// 6. Validation and edge case handling
export const validateInputs = (input: OnboardingInput): { valid: boolean; flags: string[] } => {
  const flags: string[] = [];
  
  // BMI checks
  const bmi = input.weightKg / Math.pow(input.heightCm / 100, 2);
  if (input.weightKg < 30 || bmi < 16 || bmi > 45) {
    flags.push("extreme-body-metrics");
    // This would throw InputError in a real implementation
  }
  
  // Caloric minimum checks
  if (input.gender === "female" && input.goal === "lose" && input.weightKg < 45) {
    flags.push("caloric-minimum-warning-female");
  }
  
  if (input.gender === "male" && input.goal === "lose" && input.weightKg < 55) {
    flags.push("caloric-minimum-warning-male");
  }
  
  // Gradual ramp notice
  if (input.commitDays > input.currentExerciseDays + 3) {
    flags.push("gradual-ramp-needed");
  }
  
  // Medical clearance
  if (input.medical !== "none") {
    flags.push("medical-clearance");
  }
  
  // Sleep deficit
  if (input.sleepH === "<6") {
    flags.push("sleep-deficit");
  }
  
  return { valid: flags.indexOf("extreme-body-metrics") === -1, flags };
};

// Main calculation function
export const calculateFitnessProgram = (input: OnboardingInput): FitnessCalculationResult | null => {
  // Validate inputs
  const { valid, flags } = validateInputs(input);
  if (!valid) {
    return null; // Would throw error in real implementation
  }
  
  // Debug logging for input values
  console.log(`Fitness Calculation Input:
    - Gender: ${input.gender}
    - Weight: ${input.weightKg} kg
    - Height: ${input.heightCm} cm
    - Age: ${input.ageY} years
    - Goal: ${input.goal}
    - Occupation Activity: ${input.occupationActivity}
    - Current Exercise Days: ${input.currentExerciseDays}`);
  
  // 2.1 Calculate BMR
  const bmr = calculateBMR(input.weightKg, input.heightCm, input.ageY, input.gender);
  console.log(`BMR: ${bmr} kcal`);
  
  // 2.2 Calculate Activity Factor
  const activityFactor = calculateActivityFactor(input.occupationActivity, input.currentExerciseDays);
  console.log(`Activity Factor: ${activityFactor}`);
  
  // 2.3 Calculate TDEE
  const tdee = calculateTDEE(bmr, activityFactor);
  console.log(`TDEE: ${tdee} kcal`);
  
  // 2.4 Calculate target calories based on goal (absolute adjustment)
  let calTarget = calculateCalorieTarget(tdee, input.goal);
  
  // Apply minimum calorie caps
  if (input.gender === "female" && calTarget < 1200) {
    calTarget = 1200;
    flags.push("caloric-minimum-applied-female");
  } else if (input.gender === "male" && calTarget < 1500) {
    calTarget = 1500;
    flags.push("caloric-minimum-applied-male");
  }
  
  // 2.5-2.7 Calculate macros
  const macros = calculateMacros(calTarget, input.weightKg, input.goal, input.dietType);
  
  // 3. Generate training plan
  const trainingPlan = generateTrainingPlan(
    input.commitDays,
    input.sessionDuration,
    input.equipment,
    input.workoutPref,
    input.stress,
    input.sleepH
  );
  
  // 2.8 Calculate meal timing (just returning the string advice here)
  const mealTiming = calculateMealTiming(input.mealsPerDay, input.workoutTime, macros);
  
  // 2.9 Calculate hydration
  const hydrationMl = calculateHydration(input.weightKg, input.workoutPref, input.sessionDuration);
  
  // 2.10 Get recovery tips
  const recoveryTips = [...trainingPlan.recoveryTips];
  recoveryTips.push(mealTiming);
  
  // Round all numeric outputs
  const roundedCalories = Math.round(calTarget / 5) * 5;
  const roundedMacros = {
    protein_g: Math.round(macros.protein_g),
    fat_g: Math.round(macros.fat_g),
    carbs_g: Math.round(macros.carbs_g)
  };
  
  // Return final calculation result
  return {
    calTarget: roundedCalories,
    macros: roundedMacros,
    split: trainingPlan.split,
    weeklySessions: trainingPlan.weeklySessions,
    recoveryTips,
    hydrationMl,
    flags
  };
};
