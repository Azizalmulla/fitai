

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WorkoutSchedulePage() {
  // Initialize state variables
  const [fitnessData, setFitnessData] = useState<any>({
    workoutPlan: []
  });
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<any>({});
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [editedExerciseName, setEditedExerciseName] = useState('');
  const [isExerciseSelectionOpen, setIsExerciseSelectionOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Workout exercise suggestions based on focus
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

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load fitnessData
      const fitnessDataFromStorage = localStorage.getItem("fitnessData");
      let parsedFitnessData = { workoutPlan: [] };
      
      if (fitnessDataFromStorage) {
        parsedFitnessData = JSON.parse(fitnessDataFromStorage);
      }
      
      setFitnessData(parsedFitnessData);
      
      // Set Sunday as default selected day (index 0)
      setSelectedDayIndex(0);
      
      // Clear any problematic workouts data
      localStorage.removeItem("weeklyWorkouts");
      
      // Create fresh workout data
      const freshWorkouts = {
        1: parsedFitnessData.workoutPlan ? JSON.parse(JSON.stringify(parsedFitnessData.workoutPlan)) : []
      };
      
      // Reorder days to ensure Sunday is first if needed
      if (freshWorkouts[1] && freshWorkouts[1].length > 0) {
        // Check if days need reordering (if Monday is first)
        if (freshWorkouts[1][0].day === "Monday") {
          // Move Sunday (last day) to the front
          const sunday = freshWorkouts[1].pop(); // Remove Sunday from the end
          if (sunday) {
            freshWorkouts[1].unshift(sunday); // Add Sunday to the beginning
          }
        }
        
        // Initialize each day's exercises with default values
        freshWorkouts[1].forEach((day: { exercises?: any[], focus: string, day: string }, index: number) => {
          // Skip if already has exercises
          if (day.exercises && day.exercises.length > 0) {
            // Ensure each exercise has 3 sets
            day.exercises.forEach((ex: { sets: string }) => {
              ex.sets = "3";
            });
            return;
          }
          
          // Check if this is a rest day
          const isRestDay = day.focus.toLowerCase().includes('rest') || 
                           day.focus.toLowerCase().includes('off') || 
                           day.focus === 'Rest';
          
          if (isRestDay) {
            // Set empty exercises for rest days
            day.exercises = [];
          } else {
            // Add default exercises based on focus
            const defaultsForFocus = exerciseSuggestions[day.focus] || [];
            
            if (defaultsForFocus.length > 0) {
              day.exercises = defaultsForFocus.slice(0, 3).map((name, i) => ({
                name,
                sets: "3",
                weight: "",
                reps: "8-12",
                rir: "",
                completed: false
              }));
            } else {
              day.exercises = [
                {
                  name: `${day.focus} Exercise 1`,
                  sets: "3",
                  weight: "",
                  reps: "8-12",
                  rir: "",
                  completed: false
                }
              ];
            }
          }
        });
      }
      
      setWeeklyWorkouts(freshWorkouts);
      localStorage.setItem("weeklyWorkouts", JSON.stringify(freshWorkouts));
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  // Get the current week's workout plan
  const currentWeekPlan = fitnessData?.workoutPlan || [];
  
  // Find the selected day
  const selectedDay = weeklyWorkouts[currentWeek]?.[selectedDayIndex] || {
    day: "Loading...",
    focus: "...",
    exercises: []
  };

  // Check if workout plan is loaded
  const isWorkoutPlanLoaded = isLoaded && fitnessData?.workoutPlan && fitnessData.workoutPlan.length > 0;

  // Helper function for workout split description
  const getSplitDescription = (split: string) => {
    switch (split) {
      case "full-body": return "Full Body Training";
      case "upper/lower": return "Upper/Lower Split";
      case "PPL": return "Push/Pull/Legs Split";
      case "U/L/P/P/L": return "Upper/Lower/Push/Pull/Legs";
      case "PPL+mobility": return "Push/Pull/Legs + Mobility";
      default: return split;
    }
  };

  // Toggle exercise completion for the current week
  const toggleExerciseCompleted = (dayIndex: number, exerciseIndex: number) => {
    const updatedWorkouts = { ...weeklyWorkouts };
    
    if (!updatedWorkouts[currentWeek]) {
      // If this week doesn't exist yet, create it
      updatedWorkouts[currentWeek] = fitnessData.workoutPlan.map((day: any) => ({
        ...day,
        exercises: day.exercises ? day.exercises.map((ex: any) => ({
          ...ex,
          completed: false
        })) : []
      }));
    }
    
    // Ensure the data structure is as expected
    if (
      updatedWorkouts[currentWeek] &&
      updatedWorkouts[currentWeek][dayIndex] &&
      updatedWorkouts[currentWeek][dayIndex].exercises &&
      updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex]
    ) {
      // Toggle the completed status
      const currentStatus = updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex].completed;
      updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex].completed = !currentStatus;
      
      // Check if all exercises in the day are completed
      const allExercisesCompleted = updatedWorkouts[currentWeek][dayIndex].exercises.every(
        (ex: any) => ex.completed
      );
      
      // Update the day's completion status
      updatedWorkouts[currentWeek][dayIndex].completed = allExercisesCompleted;
      
      // Check if all days in the week are completed
      const allDaysCompleted = updatedWorkouts[currentWeek].every(
        (day: any) => day.completed
      );
      
      // Update completed weeks
      if (allDaysCompleted && !completedWeeks.includes(currentWeek)) {
        setCompletedWeeks([...completedWeeks, currentWeek]);
      } else if (!allDaysCompleted && completedWeeks.includes(currentWeek)) {
        setCompletedWeeks(completedWeeks.filter(week => week !== currentWeek));
      }
      
      setWeeklyWorkouts(updatedWorkouts);
      
      // Save to localStorage
      localStorage.setItem("weeklyWorkouts", JSON.stringify(updatedWorkouts));
    }
  };
  
  // Format exercise weight for display
  const formatWeight = (weight: string) => {
    if (!weight || weight === "0" || weight === "NA") return "-";
    return `${weight}kg`;
  };
  
  // Format exercise reps for display
  const formatReps = (reps: string) => {
    if (!reps) return "-";
    if (reps.includes("min")) return reps; // Duration-based exercise
    return reps;
  };
  
  // Change the selected day
  const handleDayChange = (index: number) => {
    setSelectedDayIndex(index);
  };
  
  // Start editing an exercise name
  const startEditExerciseName = (dayIndex: number, exerciseIndex: number, currentName: string) => {
    setEditingExercise({ dayIndex, exerciseIndex });
    setEditedExerciseName(currentName);
  };
  
  // Save the edited exercise name
  const saveExerciseName = () => {
    if (!editingExercise) return;
    
    const { dayIndex, exerciseIndex } = editingExercise;
    
    setWeeklyWorkouts(prev => {
      const updatedWorkouts = { ...prev };
      
      if (
        updatedWorkouts[currentWeek] &&
        updatedWorkouts[currentWeek][dayIndex] &&
        updatedWorkouts[currentWeek][dayIndex].exercises &&
        updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex]
      ) {
        updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex].name = editedExerciseName;
        
        // Save to localStorage
        localStorage.setItem("weeklyWorkouts", JSON.stringify(updatedWorkouts));
      }
      
      return updatedWorkouts;
    });
    
    // Clear editing state
    setEditingExercise(null);
    setEditedExerciseName('');
  };
  
  // Function to add a new exercise to the current day
  const addExercise = () => {
    setIsExerciseSelectionOpen(true);
  };

  // Add a specific exercise to the selected day
  const addSpecificExercise = (exerciseName: string) => {
    setWeeklyWorkouts(prev => {
      const updatedWorkouts = { ...prev };
      
      if (!updatedWorkouts[currentWeek]) {
        updatedWorkouts[currentWeek] = JSON.parse(JSON.stringify(fitnessData.workoutPlan));
      }
      
      if (!updatedWorkouts[currentWeek][selectedDayIndex].exercises) {
        updatedWorkouts[currentWeek][selectedDayIndex].exercises = [];
      }
      
      updatedWorkouts[currentWeek][selectedDayIndex].exercises.push({
        name: exerciseName,
        sets: "3", // Explicitly set to 3 sets
        weight: "",
        reps: "8-12",
        rir: "",
        completed: false
      });
      
      // Save to localStorage
      localStorage.setItem("weeklyWorkouts", JSON.stringify(updatedWorkouts));
      
      return updatedWorkouts;
    });
    
    setIsExerciseSelectionOpen(false);
  };

  // Handle weight and reps change
  const handleExerciseWeightChange = (dayIndex: number, exerciseIndex: number, weight: string) => {
    updateExerciseDetail(dayIndex, exerciseIndex, 'weight', weight);
  };

  const handleExerciseRepsChange = (dayIndex: number, exerciseIndex: number, reps: string) => {
    updateExerciseDetail(dayIndex, exerciseIndex, 'reps', reps);
  };

  const handleExerciseRIRChange = (dayIndex: number, exerciseIndex: number, rir: string) => {
    updateExerciseDetail(dayIndex, exerciseIndex, 'rir', rir);
  };

  const updateExerciseDetail = (dayIndex: number, exerciseIndex: number, field: string, value: any) => {
    setWeeklyWorkouts(prev => {
      const updatedWorkouts = { ...prev };
      
      if (!updatedWorkouts[currentWeek]) {
        return prev;
      }
      
      if (updatedWorkouts[currentWeek][dayIndex]?.exercises?.[exerciseIndex]) {
        updatedWorkouts[currentWeek][dayIndex].exercises[exerciseIndex][field] = value;
        
        // Save to localStorage
        localStorage.setItem("weeklyWorkouts", JSON.stringify(updatedWorkouts));
      }
      
      return updatedWorkouts;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/70 transition-all 
duration-200 rounded-full mb-3 backdrop-blur-sm shadow-sm border border-zinc-700/30 text-zinc-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </Link>
              <h1 className="text-2xl font-bold mb-1">Workout Schedule</h1>
              <p className="text-zinc-400">Track your workouts and progress</p>
            </div>
            
            {/* Create a fixed position back button for mobile accessibility */}
            <Link 
              href="/dashboard" 
              className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 
shadow-lg transition-colors md:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 18L4 12L10 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
        
        {isWorkoutPlanLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Day selector */}
            <div className="md:col-span-1">
              <div className="sticky top-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-1">Week {currentWeek}</h2>
                  <p className="text-zinc-400 text-sm">
                    {fitnessData.split ? getSplitDescription(fitnessData.split) : "Personalized Training Plan"}
                  </p>
                </div>
                
                {/* Day selector buttons */}
                <div className="space-y-1.5">
                  {currentWeekPlan?.map((day: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleDayChange(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        selectedDayIndex === index
                          ? 'bg-zinc-800 shadow-md' 
                          : 'bg-zinc-900/50 hover:bg-zinc-800/70'
                      } ${day.completed ? 'border-l-2 border-l-green-500' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {day.completed && (
                            <div className="w-4 h-4 rounded-full bg-green-500/30 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12L10 17L20 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                          <span className="font-medium">{day.day}</span>
                        </div>
                        <span className="text-sm text-zinc-400">{day.focus}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Week navigation */}
                <div className="mt-8">
                  <div className="flex justify-center items-center gap-3 bg-zinc-800/30 py-3 px-4 rounded-xl border border-zinc-700/20">
                    <button 
                      onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                      className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center disabled:opacity-50 
disabled:cursor-not-allowed transition-colors"
                      disabled={currentWeek <= 1}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <span className="text-zinc-200 font-medium text-lg px-4">Week {currentWeek}</span>
                    <button 
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                      className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Workout details */}
            <div className="md:col-span-3 bg-zinc-800/30 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-zinc-700/20">
              {selectedDay ? (
                <div>
                  {/* Day header */}
                  <div className="bg-zinc-800 px-5 py-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-medium mb-0.5">{selectedDay.day}</h2>
                      <p className="text-zinc-400 text-sm">{selectedDay.focus}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Reset all workout data
                          localStorage.removeItem("weeklyWorkouts");
                          localStorage.removeItem("completedWeeks");
                          window.location.reload();
                        }}
                        className="w-9 h-9 rounded-full border border-red-500/50 hover:bg-red-500/20 flex items-center justify-center 
transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={addExercise}
                        className="w-9 h-9 rounded-full bg-indigo-600/80 hover:bg-indigo-600 flex items-center justify-center transition-colors 
shadow-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Exercise selection modal */}
                  {isExerciseSelectionOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                      <div className="bg-zinc-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-auto">
                        <div className="p-4 border-b border-zinc-700">
                          <h3 className="text-lg font-medium">Select Exercise</h3>
                          <p className="text-white/60 text-sm">Choose a suggested exercise for {selectedDay.focus}</p>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-sm uppercase tracking-wider text-white/60 mb-2">Suggested for {selectedDay.focus}</h4>
                          <div className="space-y-1">
                            {exerciseSuggestions[selectedDay.focus] && exerciseSuggestions[selectedDay.focus].map((exercise, index) => (
                              <button
                                key={index}
                                className="w-full text-left p-3 rounded-lg hover:bg-zinc-700/50 transition-colors"
                                onClick={() => addSpecificExercise(exercise)}
                              >
                                {exercise}
                              </button>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-zinc-700">
                            <h4 className="text-sm uppercase tracking-wider text-white/60 mb-2">Custom Exercise</h4>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter exercise name"
                                className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    addSpecificExercise(e.currentTarget.value.trim());
                                  }
                                }}
                              />
                              <button
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                                onClick={() => {
                                  const input = document.querySelector('input[placeholder="Enter exercise name"]') as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    addSpecificExercise(input.value.trim());
                                  }
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border-t border-zinc-700 flex justify-end gap-2">
                          <button
                            className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                            onClick={() => setIsExerciseSelectionOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Exercise list */}
                  <div className="p-4 space-y-6">
                    {selectedDay && selectedDay.exercises && (
                      <div>
                        {/* Check if it's a rest day */}
                        {selectedDay.focus.toLowerCase().includes('rest') || 
                         selectedDay.focus.toLowerCase().includes('off') || 
                         selectedDay.focus === 'Rest' ? (
                          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-800/60 flex items-center justify-center mb-4">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 
22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Rest Day</h3>
                            <p className="text-zinc-400 mb-6">Take time to recover and let your muscles rebuild.</p>
                            <button
                              onClick={addExercise}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-full 
text-sm"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Add Optional Activity
                            </button>
                          </div>
                        ) : (
                          <div>
                            {selectedDay.exercises.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <p className="text-lg text-zinc-400 mb-6">No exercises added yet.</p>
                                <button
                                  onClick={addExercise}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 transition-colors 
rounded-full text-sm"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Add Exercise
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {selectedDay.exercises.map((exercise: any, exIndex: number) => (
                                  <div key={exIndex} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                                    {/* Exercise header */}
                                    <div className="bg-zinc-800 px-4 py-3 flex justify-between items-center border-b border-zinc-700/30">
                                      {editingExercise && 
                                       editingExercise.dayIndex === selectedDayIndex && 
                                       editingExercise.exerciseIndex === exIndex ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={editedExerciseName}
                                            onChange={(e) => setEditedExerciseName(e.target.value)}
                                            className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full"
                                            autoFocus
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') saveExerciseName();
                                            }}
                                          />
                                          <button 
                                            onClick={saveExerciseName}
                                            className="text-green-500 hover:text-green-400 transition-colors"
                                          >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
strokeLinejoin="round"/>
                                            </svg>
                                          </button>
                                        </div>
                                      ) : (
                                        <button 
                                          className="font-medium text-base cursor-pointer group flex items-center gap-1"
                                          onClick={() => startEditExerciseName(selectedDayIndex, exIndex, exercise.name)}
                                        >
                                          {exercise.name}
                                          <svg 
                                            width="12" 
                                            height="12" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50"
                                          >
                                            <path d="M16.7 4.1l3.1 3.2-13.2 13.2H3.6v-3.2L16.7 4.1z" stroke="currentColor" strokeWidth="1.5" 
strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </button>
                                      )}
                                      
                                      <button
                                        onClick={() => toggleExerciseCompleted(selectedDayIndex, exIndex)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                          exercise.completed ? 'bg-green-500/30 text-green-500' : 'bg-zinc-700 hover:bg-zinc-600 text-white/70'
                                        }`}
                                      >
                                        {exercise.completed ? (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
strokeLinejoin="round"/>
                                          </svg>
                                        ) : (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
strokeLinejoin="round"/>
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                    {/* Exercise data - table header */}
                                    <div className="border-b border-zinc-700/30">
                                      <div className="grid grid-cols-5 px-4 py-2 text-xs uppercase tracking-wider text-white/60">
                                        <div className="col-span-1">Set</div>
                                        <div className="col-span-1">Weight</div>
                                        <div className="col-span-1">Reps</div>
                                        <div className="col-span-1">
                                          <div className="flex items-center gap-1">
                                            RIR <span className="text-[10px] px-1 py-0.5 bg-zinc-700 rounded text-white/40">Optional</span>
                                          </div>
                                        </div>
                                        <div className="col-span-1 text-center">Log</div>
                                      </div>
                                    </div>
                                    {/* Exercise sets - exactly like the image */}
                                    <div>
                                      {Array.from({ length: Math.min(parseInt(exercise.sets) || 3, 12) }).map((_, setIndex) => (
                                        <div 
                                          key={setIndex} 
                                          className={`grid grid-cols-5 px-4 py-3 items-center ${
                                            setIndex < (parseInt(exercise.sets) || 3) - 1 ? 'border-b border-zinc-700/20' : ''
                                          }`}
                                        >
                                          <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                                          <div className="col-span-1">
                                            <input 
                                              type="text"
                                              defaultValue={exercise.weight === "NA" || exercise.weight === "0" ? "" : exercise.weight}
                                              placeholder="kg"
                                              className="w-full bg-zinc-800/80 border border-zinc-700/30 rounded-lg px-2 py-1.5 text-sm 
text-center focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                              onChange={(e) => updateExerciseDetail(selectedDayIndex, exIndex, 'weight', e.target.value)}
                                            />
                                          </div>
                                          <div className="col-span-1">
                                            <input 
                                              type="text"
                                              defaultValue={exercise.reps === "60min" ? "8-12" : exercise.reps}
                                              placeholder="8-12"
                                              className="w-full bg-zinc-800/80 border border-zinc-700/30 rounded-lg px-2 py-1.5 text-sm 
text-center focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                              onChange={(e) => updateExerciseDetail(selectedDayIndex, exIndex, 'reps', e.target.value)}
                                            />
                                          </div>
                                          <div className="col-span-1">
                                            <input 
                                              type="text"
                                              defaultValue={exercise.rir || ""}
                                              placeholder="1-2"
                                              className="w-full bg-zinc-800/80 border border-zinc-700/30 rounded-lg px-2 py-1.5 text-sm 
text-center focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                              onChange={(e) => updateExerciseDetail(selectedDayIndex, exIndex, 'rir', e.target.value)}
                                            />
                                          </div>
                                          <div className="col-span-1 flex justify-center">
                                            <button
                                              className="w-8 h-8 rounded-full border border-zinc-700/30 flex items-center justify-center 
hover:bg-zinc-700 transition-colors"
                                              onClick={() => {/* Log completion for a specific set */}}
                                            >
                                              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Controls for adding/removing sets */}
                                    <div className="px-4 py-3 bg-zinc-800/40 flex justify-between">
                                      <button 
                                        className="w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center 
transition-colors"
                                        onClick={() => updateExerciseDetail(selectedDayIndex, exIndex, 'sets', parseInt(exercise.sets || "3") + 1)}
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
strokeLinejoin="round"/>
                                        </svg>
                                      </button>
                                      
                                      {(parseInt(exercise.sets) || 3) > 1 && (
                                        <button 
                                          className="w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center 
transition-colors"
                                          onClick={() => updateExerciseDetail(selectedDayIndex, exIndex, 'sets', Math.max(1, 
parseInt(exercise.sets || "3") - 1))}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-zinc-800/30 rounded-lg p-6 text-center">
                        <p className="text-white/60">No exercises found for this day. Add your first exercise!</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-800/30 rounded-lg p-6 text-center">
                  <p className="text-white/60">No workout plan found. Try completing the questionnaire again.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800/30 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">No Workout Plan Found</h2>
            <p className="text-white/60 mb-6">Complete the fitness questionnaire to get your personalized workout plan.</p>
            <Link 
              href="/questionnaire" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              Go to Questionnaire
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}


