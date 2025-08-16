// Science-based workout templates with proper exercise names and default sets
export const defaultExercises = {
  // Push Exercises (Chest, Shoulders, Triceps)
  push: [
    { name: "Barbell Bench Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Incline Dumbbell Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Cable Tricep Pushdowns", sets: "3", reps: "10-15", weight: "", completed: false }
  ],
  // Pull Exercises (Back, Biceps, Rear Deltoids)
  pull: [
    { name: "Barbell Rows", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Seated Cable Rows", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Face Pulls", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Barbell Curls", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Lower Body Exercises
  legs: [
    { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Romanian Deadlift", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Leg Press", sets: "3", reps: "10-12", weight: "", completed: false },
    { name: "Leg Extensions", sets: "3", reps: "12-15", weight: "", completed: false },
    { name: "Leg Curls", sets: "3", reps: "12-15", weight: "", completed: false }
  ],
  // Upper Body (Chest, Back, Shoulders, Arms)
  upper: [
    { name: "Barbell Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Bent Over Rows", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "", completed: false }
  ],
  // Lower Body (Quads, Hamstrings, Glutes, Calves)
  lower: [
    { name: "Barbell Squat", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Bulgarian Split Squats", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Hip Thrusts", sets: "3", reps: "8-12", weight: "", completed: false },
    { name: "Leg Extensions", sets: "3", reps: "10-15", weight: "", completed: false }
  ],
  // Full Body Workout
  fullBody: [
    { name: "Barbell Squat", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Bench Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Deadlift", sets: "3", reps: "6-8", weight: "", completed: false },
    { name: "Overhead Press", sets: "3", reps: "8-10", weight: "", completed: false },
    { name: "Pull-ups/Lat Pulldown", sets: "3", reps: "8-12", weight: "", completed: false }
  ],
  // Rest day - empty
  rest: []
};

// Generate a workout plan based on the user's preferences
export const createDefaultWorkoutPlan = (daysPerWeek: number): any[] => {
  let workoutPlan = [];
  
  switch (daysPerWeek) {
    case 3:
      workoutPlan = [
        { day: "Monday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Tuesday", focus: "Rest", exercises: [], completed: false },
        { day: "Wednesday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Thursday", focus: "Rest", exercises: [], completed: false },
        { day: "Friday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Saturday", focus: "Rest", exercises: [], completed: false },
        { day: "Sunday", focus: "Rest", exercises: [], completed: false }
      ];
      break;
    case 4:
      workoutPlan = [
        { day: "Monday", focus: "Upper", exercises: JSON.parse(JSON.stringify(defaultExercises.upper)), completed: false },
        { day: "Tuesday", focus: "Lower", exercises: JSON.parse(JSON.stringify(defaultExercises.lower)), completed: false },
        { day: "Wednesday", focus: "Rest", exercises: [], completed: false },
        { day: "Thursday", focus: "Upper", exercises: JSON.parse(JSON.stringify(defaultExercises.upper)), completed: false },
        { day: "Friday", focus: "Lower", exercises: JSON.parse(JSON.stringify(defaultExercises.lower)), completed: false },
        { day: "Saturday", focus: "Rest", exercises: [], completed: false },
        { day: "Sunday", focus: "Rest", exercises: [], completed: false }
      ];
      break;
    case 5:
      workoutPlan = [
        { day: "Monday", focus: "Push", exercises: JSON.parse(JSON.stringify(defaultExercises.push)), completed: false },
        { day: "Tuesday", focus: "Pull", exercises: JSON.parse(JSON.stringify(defaultExercises.pull)), completed: false },
        { day: "Wednesday", focus: "Legs", exercises: JSON.parse(JSON.stringify(defaultExercises.legs)), completed: false },
        { day: "Thursday", focus: "Push", exercises: JSON.parse(JSON.stringify(defaultExercises.push)), completed: false },
        { day: "Friday", focus: "Pull", exercises: JSON.parse(JSON.stringify(defaultExercises.pull)), completed: false },
        { day: "Saturday", focus: "Rest", exercises: [], completed: false },
        { day: "Sunday", focus: "Rest", exercises: [], completed: false }
      ];
      break;
    case 6:
      workoutPlan = [
        { day: "Monday", focus: "Push", exercises: JSON.parse(JSON.stringify(defaultExercises.push)), completed: false },
        { day: "Tuesday", focus: "Pull", exercises: JSON.parse(JSON.stringify(defaultExercises.pull)), completed: false },
        { day: "Wednesday", focus: "Legs", exercises: JSON.parse(JSON.stringify(defaultExercises.legs)), completed: false },
        { day: "Thursday", focus: "Push", exercises: JSON.parse(JSON.stringify(defaultExercises.push)), completed: false },
        { day: "Friday", focus: "Pull", exercises: JSON.parse(JSON.stringify(defaultExercises.pull)), completed: false },
        { day: "Saturday", focus: "Legs", exercises: JSON.parse(JSON.stringify(defaultExercises.legs)), completed: false },
        { day: "Sunday", focus: "Rest", exercises: [], completed: false }
      ];
      break;
    default:
      workoutPlan = [
        { day: "Monday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Tuesday", focus: "Rest", exercises: [], completed: false },
        { day: "Wednesday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Thursday", focus: "Rest", exercises: [], completed: false },
        { day: "Friday", focus: "Full Body", exercises: JSON.parse(JSON.stringify(defaultExercises.fullBody)), completed: false },
        { day: "Saturday", focus: "Rest", exercises: [], completed: false },
        { day: "Sunday", focus: "Rest", exercises: [], completed: false }
      ];
  }
  
  return workoutPlan;
};
