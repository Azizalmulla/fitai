import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { 
  calculateBMR as calcBMR, 
  calculateTDEE as calcTDEE, 
  calculateMacros,
  generateTrainingPlan 
} from "@/lib/fitness-calculator-v2"

// Exercise suggestions for different workout focuses
const exerciseSuggestions: Record<string, string[]> = {
  "Upper": [
    "Bench Press", 
    "Incline Dumbbell Press", 
    "Barbell Row", 
    "Pull Ups", 
    "Dumbbell Shoulder Press",
    "Lateral Raises",
    "Tricep Pushdowns",
    "Bicep Curls"
  ],
  "Lower": [
    "Squat", 
    "Deadlift", 
    "Leg Press", 
    "Romanian Deadlift", 
    "Leg Extensions",
    "Leg Curls",
    "Calf Raises",
    "Hip Thrusts"
  ],
  "Push": [
    "Bench Press", 
    "Incline Bench Press", 
    "Dumbbell Shoulder Press", 
    "Lateral Raises", 
    "Tricep Extensions",
    "Pushups",
    "Cable Flyes",
    "Overhead Tricep Extension"
  ],
  "Pull": [
    "Barbell Row", 
    "Pull Ups", 
    "Lat Pulldown", 
    "Cable Row", 
    "Face Pulls",
    "Bicep Curls",
    "Hammer Curls",
    "Shrugs"
  ],
  "Legs": [
    "Squat", 
    "Deadlift", 
    "Leg Press", 
    "Lunges", 
    "Leg Extensions",
    "Leg Curls",
    "Calf Raises",
    "Hip Thrusts"
  ],
  "Full Body": [
    "Squat", 
    "Bench Press", 
    "Deadlift", 
    "Pull Ups", 
    "Shoulder Press",
    "Rows",
    "Lunges",
    "Bicep Curls"
  ],
  "Rest": []
};

// Function to create a workout plan from the generateTrainingPlan results
function createWorkoutPlan(input: any): any[] {
  // Get the training plan with weekly sessions
  const trainingPlan = generateTrainingPlan(
    input.commitDays,
    input.sessionDuration,
    input.equipment,
    input.workoutPref,
    input.stress,
    input.sleepH
  );
  
  // Map to the expected format for our workout plan
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Create the workout plan with all days of the week
  return daysOfWeek.map(day => {
    // Find if there's a session for this day
    const session = trainingPlan.weeklySessions.find(
      s => s && s.day && s.day.toLowerCase() === day.toLowerCase()
    );
    
    if (session) {
      // If a session exists for this day, return it with exercises array
      const focus = session.focus || "General";
      
      // Check if this is a rest day
      const isRestDay = focus.toLowerCase().includes('rest') || 
                        focus.toLowerCase().includes('off') || 
                        focus === 'Rest';
      
      if (isRestDay) {
        return {
          day: day,
          focus: "Rest",
          exercises: [],
          completed: false
        };
      }
      
      // Add default exercises based on focus
      let defaultExercises = [];
      const cleanFocus = focus.split('(')[0].trim(); // Remove any text in parentheses
      
      // Determine which exercise group to use
      let exerciseGroup = "Full Body";  // Default fallback
      
      if (cleanFocus.includes("Push")) {
        exerciseGroup = "Push";
      } else if (cleanFocus.includes("Pull")) {
        exerciseGroup = "Pull";
      } else if (cleanFocus.includes("Legs") || cleanFocus.includes("Lower")) {
        exerciseGroup = "Legs";
      } else if (cleanFocus.includes("Upper")) {
        exerciseGroup = "Upper";
      } else if (cleanFocus.includes("Full")) {
        exerciseGroup = "Full Body";
      }
      
      // Get default exercises for this focus
      const defaultsForFocus = exerciseSuggestions[exerciseGroup] || [];
      
      if (defaultsForFocus.length > 0) {
        defaultExercises = defaultsForFocus.slice(0, 3).map((name, i) => ({
          name,
          sets: "3",
          weight: "",
          reps: "8-12",
          rir: "",
          completed: false
        }));
      } else {
        defaultExercises = [
          {
            name: `${cleanFocus} Exercise 1`,
            sets: "3",
            weight: "",
            reps: "8-12",
            rir: "",
            completed: false
          }
        ];
      }
      
      return {
        day: day,
        focus: focus,
        exercises: defaultExercises,
        completed: false
      };
    } else {
      // If no session, return a rest day
      return {
        day: day,
        focus: "Rest",
        exercises: [],
        completed: false
      };
    }
  });
}

// Function to calculate activity factor based on occupation and exercise days
function calculateActivityFactor(occupationActivity: string, exerciseDays: number): number {
  // Base activity factors by occupation
  const baseFactors: Record<string, number> = {
    'sedentary': 1.2,  // Desk job, little movement
    'light': 1.375,    // Standing job or some walking
    'moderate': 1.55,  // Physically active job
    'very': 1.725,     // Very physically demanding job
    'extra': 1.9       // Extremely physically demanding job
  };

  // Additional factor based on exercise days (0.05 per exercise day)
  const exerciseFactor = exerciseDays * 0.05;
  
  // Get base factor with fallback to sedentary if invalid
  const baseFactor = baseFactors[occupationActivity] || baseFactors.sedentary;
  
  return baseFactor + exerciseFactor;
}

// Zod schema for validating the input
const onboardingSchema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  currentExerciseDays: z.number().int().min(0).max(7),
  sessionDuration: z.enum(["u30", "30-45", "45-60", "60p"]),
  equipment: z.enum(["home-minimal", "home-basic", "gym-full", "outdoor"]),
  commitDays: z.number().int().min(1).max(7),
  medical: z.string(),
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  ageY: z.number().int().positive(),
  gender: z.enum(["male", "female", "other"]),
  workoutPref: z.enum(["strength", "cardio", "mixed", "hiit", "mobility"]),
  workoutTime: z.enum(["morning", "afternoon", "evening", "late"]),
  occupationActivity: z.enum(["sedentary", "light", "moderate", "very", "extra"]),
  stress: z.enum(["low", "moderate", "high"]),
  sleepH: z.enum(["<6", "6-7", "7-8", "8p"]),
  mealsPerDay: z.union([
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6)
  ]),
  dietaryRestrictions: z.string(),
  dietType: z.enum(["none", "veg", "keto", "paleo", "mediterranean", "other"])
});

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    
    // Validate input against the schema
    const validatedData = onboardingSchema.parse(raw);
    
    // Convert to the expected input format
    const input = {
      ...validatedData
    };
    
    // Calculate fitness metrics
    const bmr = calcBMR(input.weightKg, input.heightCm, input.ageY, input.gender);
    const tdee = calcTDEE(bmr, calculateActivityFactor(input.occupationActivity, input.currentExerciseDays));
    
    // Determine target calories based on goal
    let targetCalories = tdee;
    if (input.goal === 'lose') {
      targetCalories = Math.round(tdee * 0.8);  // 20% deficit for weight loss
    } else if (input.goal === 'gain') {
      targetCalories = Math.round(tdee * 1.1);  // 10% surplus for muscle gain
    }
    
    // Calculate macros based on target calories and goal
    const macros = calculateMacros(targetCalories, input.weightKg, input.goal, input.dietType);
    
    // Generate workout plan based on preferences
    const workoutPlan = createWorkoutPlan(input);
    
    // Calculate meal calories distribution
    const mealDistribution = [];
    const mealsPerDay = parseInt(input.mealsPerDay.toString());
    
    if (mealsPerDay === 3) {
      mealDistribution.push(
        { name: 'Breakfast', percent: 30, calories: Math.round(targetCalories * 0.3) },
        { name: 'Lunch', percent: 40, calories: Math.round(targetCalories * 0.4) },
        { name: 'Dinner', percent: 30, calories: Math.round(targetCalories * 0.3) },
      );
    } else if (mealsPerDay === 4) {
      mealDistribution.push(
        { name: 'Breakfast', percent: 25, calories: Math.round(targetCalories * 0.25) },
        { name: 'Lunch', percent: 30, calories: Math.round(targetCalories * 0.3) },
        { name: 'Snack', percent: 15, calories: Math.round(targetCalories * 0.15) },
        { name: 'Dinner', percent: 30, calories: Math.round(targetCalories * 0.3) },
      );
    } else if (mealsPerDay === 5) {
      mealDistribution.push(
        { name: 'Breakfast', percent: 20, calories: Math.round(targetCalories * 0.2) },
        { name: 'Morning Snack', percent: 10, calories: Math.round(targetCalories * 0.1) },
        { name: 'Lunch', percent: 30, calories: Math.round(targetCalories * 0.3) },
        { name: 'Afternoon Snack', percent: 10, calories: Math.round(targetCalories * 0.1) },
        { name: 'Dinner', percent: 30, calories: Math.round(targetCalories * 0.3) },
      );
    } else if (mealsPerDay === 6) {
      mealDistribution.push(
        { name: 'Breakfast', percent: 20, calories: Math.round(targetCalories * 0.2) },
        { name: 'Morning Snack', percent: 10, calories: Math.round(targetCalories * 0.1) },
        { name: 'Lunch', percent: 25, calories: Math.round(targetCalories * 0.25) },
        { name: 'Afternoon Snack', percent: 10, calories: Math.round(targetCalories * 0.1) },
        { name: 'Dinner', percent: 25, calories: Math.round(targetCalories * 0.25) },
        { name: 'Evening Snack', percent: 10, calories: Math.round(targetCalories * 0.1) },
      );
    }
    
    // Compile response
    const response = NextResponse.json({
      success: true,
      data: {
        bmr,
        tdee,
        targetCalories,
        macros,
        workoutPlan,
        mealDistribution,
        data: validatedData
      }
    });
    
    // Add version hash in response headers for cache validation
    response.headers.set('X-Zentra-Calc-Ver', '2023-04-21.1');
    
    return response;
    
  } catch (error) {
    console.error("Error calculating fitness data:", error);
    
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: "Validation error", 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to calculate fitness data" 
    }, { status: 500 });
  }
}

// Helper function to format the workout plan in a structure compatible with our frontend
function formatWorkoutPlanForFrontend(weeklySessions: any[]) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Map the weekly sessions to a format that matches our current frontend expectations
  return daysOfWeek.map((day) => {
    const session = weeklySessions.find(s => s?.day === day);
    
    if (!session) {
      // Rest day
      return {
        day,
        focus: "Rest Day",
        exercises: [] as any[]
      };
    }
    
    // Active day
    return {
      day,
      focus: session.focus,
      exercises: [] as any[]
    };
  });
}
