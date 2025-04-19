import type { WorkoutPlan, Exercise } from "@/types/fitness"

// Exercise database organized by muscle group and equipment needs
const exerciseDatabase = {
  chest: {
    minimal: ["Push-ups", "Decline Push-ups", "Incline Push-ups", "Diamond Push-ups"],
    basic: ["Dumbbell Bench Press", "Dumbbell Flyes", "Floor Press", "Push-ups"],
    full: ["Barbell Bench Press", "Incline Bench Press", "Cable Flyes", "Chest Dips"],
  },
  back: {
    minimal: ["Inverted Rows", "Superman Holds", "Doorway Rows", "Bird Dogs"],
    basic: ["Dumbbell Rows", "Renegade Rows", "Resistance Band Pulldowns", "Pullovers"],
    full: ["Pull-ups", "Lat Pulldowns", "Barbell Rows", "Cable Rows"],
  },
  legs: {
    minimal: ["Bodyweight Squats", "Lunges", "Glute Bridges", "Wall Sits"],
    basic: ["Goblet Squats", "Dumbbell Lunges", "Step-ups", "Bulgarian Split Squats"],
    full: ["Barbell Squats", "Leg Press", "Romanian Deadlifts", "Leg Extensions"],
  },
  shoulders: {
    minimal: [
      "Pike Push-ups",
      "Lateral Raises (with water bottles)",
      "Front Raises (with household items)",
      "Arm Circles",
    ],
    basic: ["Dumbbell Shoulder Press", "Lateral Raises", "Front Raises", "Reverse Flyes"],
    full: ["Overhead Press", "Arnold Press", "Face Pulls", "Upright Rows"],
  },
  arms: {
    minimal: ["Tricep Dips (on chair)", "Diamond Push-ups", "Bicep Curls (with household items)", "Plank Up-Downs"],
    basic: ["Dumbbell Curls", "Tricep Kickbacks", "Hammer Curls", "Overhead Tricep Extensions"],
    full: ["Barbell Curls", "Skull Crushers", "Cable Pushdowns", "Preacher Curls"],
  },
  core: {
    minimal: ["Planks", "Mountain Climbers", "Russian Twists", "Bicycle Crunches"],
    basic: ["Planks", "Russian Twists", "Leg Raises", "Side Planks"],
    full: ["Cable Crunches", "Hanging Leg Raises", "Ab Wheel Rollouts", "Weighted Russian Twists"],
  },
  cardio: {
    minimal: ["Jumping Jacks", "High Knees", "Burpees", "Mountain Climbers"],
    basic: ["Jump Rope", "HIIT Circuits", "Stair Climbing", "Jumping Jacks"],
    full: ["Treadmill Intervals", "Rowing Machine", "Stair Master", "Elliptical"],
  },
}

// Rep ranges based on fitness goals
const repRanges = {
  "lose fat": { min: 12, max: 15, sets: 3, rest: "30-45 sec" },
  "build muscle": { min: 8, max: 12, sets: 4, rest: "60-90 sec" },
  "improve endurance": { min: 15, max: 20, sets: 3, rest: "30 sec" },
  "overall health": { min: 10, max: 15, sets: 3, rest: "45-60 sec" },
  "athletic performance": { min: 6, max: 12, sets: 4, rest: "60-90 sec" },
}

// Weight guidance based on rep ranges
const weightGuidance = {
  "6-8": "Heavy (80-85% 1RM)",
  "8-10": "Moderately Heavy (75-80% 1RM)",
  "10-12": "Medium (70-75% 1RM)",
  "12-15": "Moderate (65-70% 1RM)",
  "15-20": "Light (60-65% 1RM)",
}

// Determine equipment level based on workout location
const getEquipmentLevel = (workoutLocation: string): "minimal" | "basic" | "full" => {
  if (workoutLocation.includes("minimal")) {
    return "minimal"
  } else if (workoutLocation.includes("basic")) {
    return "basic"
  } else {
    return "full"
  }
}

// Select exercises based on equipment level and muscle group
const selectExercises = (
  muscleGroup: keyof typeof exerciseDatabase,
  equipmentLevel: "minimal" | "basic" | "full",
  count: number,
): string[] => {
  const exercises = exerciseDatabase[muscleGroup][equipmentLevel]
  const selected: string[] = []

  // Randomly select unique exercises
  while (selected.length < count && selected.length < exercises.length) {
    const randomIndex = Math.floor(Math.random() * exercises.length)
    const exercise = exercises[randomIndex]

    if (!selected.includes(exercise)) {
      selected.push(exercise)
    }
  }

  return selected
}

// Generate a workout for a specific day
const generateWorkout = (
  focus: string,
  goal: string,
  equipmentLevel: "minimal" | "basic" | "full",
  experienceLevel: string,
): Exercise[] => {
  const exercises: Exercise[] = []
  const { min, max, sets } = repRanges[goal as keyof typeof repRanges] || repRanges["overall health"]

  // Determine rep range based on goal
  const reps = `${min}-${max}`

  // Determine weight guidance based on rep range
  const weight = weightGuidance[reps as keyof typeof weightGuidance] || "Medium"

  // Adjust exercise count based on experience level
  const exerciseCount = experienceLevel === "beginner" ? 3 : experienceLevel === "intermediate" ? 4 : 5

  // Generate exercises based on workout focus
  if (focus === "Rest Day") {
    exercises.push(
      { name: "Light Cardio (Optional)", sets: 1, reps: "20-30 min", weight: "N/A" },
      { name: "Stretching", sets: 1, reps: "10-15 min", weight: "N/A" },
    )
  } else if (focus === "Full Body") {
    // Add exercises from different muscle groups
    const chestExercise = selectExercises("chest", equipmentLevel, 1)[0]
    const backExercise = selectExercises("back", equipmentLevel, 1)[0]
    const legsExercise = selectExercises("legs", equipmentLevel, 1)[0]
    const shouldersExercise = selectExercises("shoulders", equipmentLevel, 1)[0]
    const coreExercise = selectExercises("core", equipmentLevel, 1)[0]

    exercises.push(
      { name: chestExercise, sets, reps, weight },
      { name: backExercise, sets, reps, weight },
      { name: legsExercise, sets, reps, weight },
      { name: shouldersExercise, sets, reps, weight },
      { name: coreExercise, sets, reps, weight },
    )
  } else if (focus === "Upper Body") {
    // Add upper body exercises
    const chestExercises = selectExercises("chest", equipmentLevel, 2)
    const backExercises = selectExercises("back", equipmentLevel, 2)
    const shoulderExercise = selectExercises("shoulders", equipmentLevel, 1)[0]
    const armExercises = selectExercises("arms", equipmentLevel, 1)

    exercises.push(
      { name: chestExercises[0], sets, reps, weight },
      { name: backExercises[0], sets, reps, weight },
      { name: shoulderExercise, sets, reps, weight },
      { name: chestExercises[1], sets, reps, weight },
      { name: backExercises[1], sets, reps, weight },
      { name: armExercises[0], sets, reps, weight },
    )
  } else if (focus === "Lower Body") {
    // Add lower body exercises
    const legExercises = selectExercises("legs", equipmentLevel, 4)
    const coreExercises = selectExercises("core", equipmentLevel, 2)

    exercises.push(
      { name: legExercises[0], sets, reps, weight },
      { name: legExercises[1], sets, reps, weight },
      { name: coreExercises[0], sets, reps, weight },
      { name: legExercises[2], sets, reps, weight },
      { name: legExercises[3], sets, reps, weight },
      { name: coreExercises[1], sets, reps, weight },
    )
  } else if (focus.includes("Cardio") || focus.includes("HIIT")) {
    // Add cardio exercises
    const cardioExercises = selectExercises("cardio", equipmentLevel, 4)

    exercises.push(
      { name: cardioExercises[0], sets: 1, reps: "10 min", weight: "N/A" },
      { name: cardioExercises[1], sets: 3, reps: "30 sec on, 30 sec off", weight: "N/A" },
      { name: cardioExercises[2], sets: 3, reps: "45 sec on, 15 sec off", weight: "N/A" },
      { name: cardioExercises[3], sets: 1, reps: "10 min", weight: "N/A" },
    )
  } else if (focus.includes("Chest")) {
    // Chest focused workout
    const chestExercises = selectExercises("chest", equipmentLevel, 3)
    const tricepExercises = selectExercises("arms", equipmentLevel, 2)

    exercises.push(
      { name: chestExercises[0], sets, reps, weight },
      { name: chestExercises[1], sets, reps, weight },
      { name: tricepExercises[0], sets, reps, weight },
      { name: chestExercises[2], sets, reps, weight },
      { name: tricepExercises[1], sets, reps, weight },
    )
  } else if (focus.includes("Back")) {
    // Back focused workout
    const backExercises = selectExercises("back", equipmentLevel, 3)
    const bicepExercises = selectExercises("arms", equipmentLevel, 2)

    exercises.push(
      { name: backExercises[0], sets, reps, weight },
      { name: backExercises[1], sets, reps, weight },
      { name: bicepExercises[0], sets, reps, weight },
      { name: backExercises[2], sets, reps, weight },
      { name: bicepExercises[1], sets, reps, weight },
    )
  } else if (focus.includes("Legs")) {
    // Legs focused workout
    const legExercises = selectExercises("legs", equipmentLevel, 4)
    const coreExercise = selectExercises("core", equipmentLevel, 1)[0]

    exercises.push(
      { name: legExercises[0], sets, reps, weight },
      { name: legExercises[1], sets, reps, weight },
      { name: legExercises[2], sets, reps, weight },
      { name: legExercises[3], sets, reps, weight },
      { name: coreExercise, sets, reps, weight },
    )
  } else if (focus.includes("Shoulders")) {
    // Shoulders focused workout
    const shoulderExercises = selectExercises("shoulders", equipmentLevel, 3)
    const armExercises = selectExercises("arms", equipmentLevel, 2)

    exercises.push(
      { name: shoulderExercises[0], sets, reps, weight },
      { name: shoulderExercises[1], sets, reps, weight },
      { name: armExercises[0], sets, reps, weight },
      { name: shoulderExercises[2], sets, reps, weight },
      { name: armExercises[1], sets, reps, weight },
    )
  } else {
    // Default to a balanced workout
    const chestExercise = selectExercises("chest", equipmentLevel, 1)[0]
    const backExercise = selectExercises("back", equipmentLevel, 1)[0]
    const legsExercise = selectExercises("legs", equipmentLevel, 1)[0]
    const shouldersExercise = selectExercises("shoulders", equipmentLevel, 1)[0]
    const coreExercise = selectExercises("core", equipmentLevel, 1)[0]

    exercises.push(
      { name: chestExercise, sets, reps, weight },
      { name: backExercise, sets, reps, weight },
      { name: legsExercise, sets, reps, weight },
      { name: shouldersExercise, sets, reps, weight },
      { name: coreExercise, sets, reps, weight },
    )
  }

  // Limit exercises based on experience level
  return exercises.slice(0, experienceLevel === "beginner" ? 4 : experienceLevel === "intermediate" ? 5 : 6)
}

// Generate a weekly workout plan based on user preferences
export const generateWorkoutPlan = (
  daysPerWeek: string,
  workoutPreference: string,
  workoutLocation: string,
  goal: string,
  experienceLevel: string,
): WorkoutPlan[] => {
  const equipmentLevel = getEquipmentLevel(workoutLocation)
  const workoutPlan: WorkoutPlan[] = []
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Determine number of workout days
  let workoutDays = 3
  if (daysPerWeek === "4-5 days") {
    workoutDays = 4
  } else if (daysPerWeek === "6+ days") {
    workoutDays = 6
  }

  // Generate workout splits based on preference and days per week
  let workoutSplits: string[] = []

  if (workoutPreference.includes("strength")) {
    if (workoutDays <= 3) {
      workoutSplits = ["Full Body", "Rest Day", "Full Body", "Rest Day", "Full Body", "Rest Day", "Rest Day"]
    } else if (workoutDays <= 4) {
      workoutSplits = ["Upper Body", "Lower Body", "Rest Day", "Upper Body", "Lower Body", "Rest Day", "Rest Day"]
    } else {
      workoutSplits = [
        "Chest & Triceps",
        "Back & Biceps",
        "Rest Day",
        "Legs & Core",
        "Shoulders & Arms",
        "Full Body",
        "Rest Day",
      ]
    }
  } else if (workoutPreference.includes("cardio") || workoutPreference.includes("endurance")) {
    if (workoutDays <= 3) {
      workoutSplits = ["Cardio & Core", "Rest Day", "Full Body", "Rest Day", "Cardio & Core", "Rest Day", "Rest Day"]
    } else if (workoutDays <= 4) {
      workoutSplits = ["Cardio", "Upper Body", "Rest Day", "Cardio", "Lower Body", "Rest Day", "Rest Day"]
    } else {
      workoutSplits = ["Cardio", "Upper Body", "Cardio", "Lower Body", "Cardio", "Full Body", "Rest Day"]
    }
  } else if (workoutPreference.includes("hiit")) {
    if (workoutDays <= 3) {
      workoutSplits = ["HIIT & Core", "Rest Day", "HIIT & Core", "Rest Day", "HIIT & Core", "Rest Day", "Rest Day"]
    } else if (workoutDays <= 4) {
      workoutSplits = ["HIIT", "Upper Body", "Rest Day", "HIIT", "Lower Body", "Rest Day", "Rest Day"]
    } else {
      workoutSplits = ["HIIT", "Upper Body", "HIIT", "Lower Body", "HIIT", "Full Body", "Rest Day"]
    }
  } else if (workoutPreference.includes("flexibility") || workoutPreference.includes("mobility")) {
    if (workoutDays <= 3) {
      workoutSplits = [
        "Mobility & Core",
        "Rest Day",
        "Full Body & Stretch",
        "Rest Day",
        "Mobility & Core",
        "Rest Day",
        "Rest Day",
      ]
    } else if (workoutDays <= 4) {
      workoutSplits = [
        "Mobility",
        "Upper Body & Stretch",
        "Rest Day",
        "Mobility",
        "Lower Body & Stretch",
        "Rest Day",
        "Rest Day",
      ]
    } else {
      workoutSplits = [
        "Mobility",
        "Upper Body & Stretch",
        "Mobility",
        "Lower Body & Stretch",
        "Mobility",
        "Full Body & Stretch",
        "Rest Day",
      ]
    }
  } else {
    // Mixed workouts (default)
    if (workoutDays <= 3) {
      workoutSplits = ["Full Body", "Rest Day", "Full Body", "Rest Day", "Full Body", "Rest Day", "Rest Day"]
    } else if (workoutDays <= 4) {
      workoutSplits = ["Upper Body", "Lower Body", "Rest Day", "Full Body", "Cardio & Core", "Rest Day", "Rest Day"]
    } else {
      workoutSplits = [
        "Chest & Triceps",
        "Back & Biceps",
        "Rest Day",
        "Legs & Core",
        "Shoulders & Arms",
        "Cardio & Core",
        "Rest Day",
      ]
    }
  }

  // Create workout plan for each day
  for (let i = 0; i < 7; i++) {
    const focus = workoutSplits[i]
    const exercises = generateWorkout(focus, goal, equipmentLevel, experienceLevel)

    workoutPlan.push({
      day: daysOfWeek[i],
      focus,
      exercises,
      completed: false,
    })
  }

  return workoutPlan
}
