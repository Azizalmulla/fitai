"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import type { FitnessData } from "@/types/fitness"
import { Inter } from 'next/font/google'
import { 
  CalendarDays, 
  Dumbbell, 
  Apple, 
  MessageSquare, 
  Settings, 
  LayoutDashboard
} from 'lucide-react';
import { usePathname } from 'next/navigation'

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Generate consistent mock data
export function generateMockFitnessData(): FitnessData {
  return {
    gender: "male",
    age: 30,
    height: 175,
    weight: 75,
    goal: "build_muscle",
    experienceLevel: "intermediate",
    workoutPlan: [
      {
        day: "Sunday",
        focus: "Rest Day",
        exercises: [
          { name: "Walking", sets: 1, reps: "30 min", weight: "NA", rir: "0", completed: false },
          { name: "Mobility Work", sets: 1, reps: "15 min", weight: "NA", rir: "0", completed: false },
        ],
        completed: false,
      },
      {
        day: "Monday",
        focus: "Chest & Triceps",
        exercises: [
          { name: "Bench Press (Barbell)", sets: 4, reps: "8", weight: "235.4", rir: "2", completed: false },
          { name: "Incline Press", sets: 3, reps: "10", weight: "185", rir: "2", completed: false },
          { name: "Chest Flyes", sets: 3, reps: "12", weight: "45", rir: "1", completed: false },
          { name: "Tricep Pushdown", sets: 3, reps: "12", weight: "55", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Tuesday",
        focus: "Back & Biceps",
        exercises: [
          { name: "Pullup (Parallel Grip)", sets: 4, reps: "12", weight: "BW+25", rir: "2", completed: false },
          { name: "Bent Over Row", sets: 3, reps: "8", weight: "185", rir: "2", completed: false },
          { name: "Lat Pulldown", sets: 3, reps: "10", weight: "160", rir: "1", completed: false },
          { name: "Bicep Curl", sets: 3, reps: "10", weight: "95", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Wednesday",
        focus: "Rest Day",
        exercises: [
          { name: "Light Cardio", sets: 1, reps: "20 min", weight: "NA", rir: "0", completed: false },
          { name: "Stretching", sets: 1, reps: "10 min", weight: "NA", rir: "0", completed: false },
        ],
        completed: false,
      },
      {
        day: "Thursday",
        focus: "Legs",
        exercises: [
          { name: "Squat", sets: 4, reps: "8", weight: "245", rir: "2", completed: false },
          { name: "Romanian Deadlift", sets: 3, reps: "10", weight: "205", rir: "1", completed: false },
          { name: "Leg Press", sets: 3, reps: "10", weight: "360", rir: "1", completed: false },
          { name: "Leg Curl", sets: 3, reps: "12", weight: "110", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Friday",
        focus: "Shoulders & Arms",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "8", weight: "135", rir: "2", completed: false },
          { name: "Lateral Raise", sets: 3, reps: "12", weight: "25", rir: "1", completed: false },
          { name: "Face Pull", sets: 3, reps: "12", weight: "45", rir: "1", completed: false },
          { name: "Tricep Extension", sets: 3, reps: "10", weight: "45", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Saturday",
        focus: "Full Body",
        exercises: [
          { name: "Deadlift", sets: 3, reps: "6", weight: "285", rir: "2", completed: false },
          { name: "Push-up", sets: 3, reps: "15", weight: "BW", rir: "1", completed: false },
          { name: "Pull-up", sets: 3, reps: "8", weight: "BW", rir: "1", completed: false },
          { name: "Kettlebell Swing", sets: 3, reps: "15", weight: "35", rir: "1", completed: false },
        ],
        completed: false,
      },
    ],
    bmr: 1850,
    tdee: 2650,
    targetCalories: 2950,
    macros: {
      protein: 160,
      carbs: 338,
      fat: 90
    }
  }
}

export default function DashboardPage() {
  // Get default values from mock data to ensure we always have values
  const defaultData = {
    gender: 'male',
    age: 30,
    weight: 80,
    height: 180,
    activityLevel: 1.5,
    goal: 'general',
    experienceLevel: 'intermediate',
    workoutPlan: [
      {
        day: "Sunday",
        focus: "Rest Day",
        exercises: [
          { name: "Walking", sets: 1, reps: "30 min", weight: "NA", rir: "0", completed: false },
          { name: "Mobility Work", sets: 1, reps: "15 min", weight: "NA", rir: "0", completed: false },
        ],
        completed: false,
      },
      {
        day: "Monday",
        focus: "Chest & Triceps",
        exercises: [
          { name: "Bench Press (Barbell)", sets: 4, reps: "8", weight: "235.4", rir: "2", completed: false },
          { name: "Incline Press", sets: 3, reps: "10", weight: "185", rir: "2", completed: false },
          { name: "Chest Flyes", sets: 3, reps: "12", weight: "45", rir: "1", completed: false },
          { name: "Tricep Pushdown", sets: 3, reps: "12", weight: "55", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Tuesday",
        focus: "Back & Biceps",
        exercises: [
          { name: "Pullup (Parallel Grip)", sets: 4, reps: "12", weight: "BW+25", rir: "2", completed: false },
          { name: "Bent Over Row", sets: 3, reps: "8", weight: "185", rir: "2", completed: false },
          { name: "Lat Pulldown", sets: 3, reps: "10", weight: "160", rir: "1", completed: false },
          { name: "Bicep Curl", sets: 3, reps: "10", weight: "95", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Wednesday",
        focus: "Rest Day",
        exercises: [
          { name: "Light Cardio", sets: 1, reps: "20 min", weight: "NA", rir: "0", completed: false },
          { name: "Stretching", sets: 1, reps: "10 min", weight: "NA", rir: "0", completed: false },
        ],
        completed: false,
      },
      {
        day: "Thursday",
        focus: "Legs",
        exercises: [
          { name: "Squat", sets: 4, reps: "8", weight: "245", rir: "2", completed: false },
          { name: "Romanian Deadlift", sets: 3, reps: "10", weight: "205", rir: "1", completed: false },
          { name: "Leg Press", sets: 3, reps: "10", weight: "360", rir: "1", completed: false },
          { name: "Leg Curl", sets: 3, reps: "12", weight: "110", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Friday",
        focus: "Shoulders & Arms",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "8", weight: "135", rir: "2", completed: false },
          { name: "Lateral Raise", sets: 3, reps: "12", weight: "25", rir: "1", completed: false },
          { name: "Face Pull", sets: 3, reps: "12", weight: "45", rir: "1", completed: false },
          { name: "Tricep Extension", sets: 3, reps: "10", weight: "45", rir: "1", completed: false },
        ],
        completed: false,
      },
      {
        day: "Saturday",
        focus: "Full Body",
        exercises: [
          { name: "Deadlift", sets: 3, reps: "6", weight: "285", rir: "2", completed: false },
          { name: "Push-up", sets: 3, reps: "15", weight: "BW", rir: "1", completed: false },
          { name: "Pull-up", sets: 3, reps: "8", weight: "BW", rir: "1", completed: false },
          { name: "Kettlebell Swing", sets: 3, reps: "15", weight: "35", rir: "1", completed: false },
        ],
        completed: false,
      },
    ],
    bmr: 1800,
    tdee: 2700,
    targetCalories: 2700,
    macros: {
      protein: 160,
      carbs: 338,
      fat: 90
    },
    startingDay: 'monday'
  }
  
  const [fitnessData, setFitnessData] = useState<FitnessData>(defaultData)
  const [activeDay, setActiveDay] = useState<number>(0) // 0 is now Sunday as the first day
  const [activeExercise, setActiveExercise] = useState<number>(-1) // Set to -1 to have all exercises collapsed by default
  const [editingExerciseName, setEditingExerciseName] = useState<{dayIndex: number, exerciseIndex: number} | null>(null)
  const [newExerciseName, setNewExerciseName] = useState<string>("")
  const [showMacroCustomizer, setShowMacroCustomizer] = useState<boolean>(false)
  const [customMacros, setCustomMacros] = useState<{protein: number, carbs: number, fat: number}>({
    protein: 30, // percentages
    carbs: 40,
    fat: 30
  })
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([])
  const [showWorkoutLogs, setShowWorkoutLogs] = useState<boolean>(false)
  const [recoveryTips, setRecoveryTips] = useState<string[]>([]);
  const [healthFlags, setHealthFlags] = useState<string[]>([]);
  const [hydrationTarget, setHydrationTarget] = useState<number>(0);
  const [version, setVersion] = useState<string>("");

  // Refs for SVG circles to update safely on client-side
  const proteinCircleRef = useRef<SVGCircleElement>(null);
  const carbsCircleRef = useRef<SVGCircleElement>(null);
  const fatCircleRef = useRef<SVGCircleElement>(null);

  // Use useState for calorie tracking
  const [caloriesInfo, setCaloriesInfo] = useState("0 consumed, 0 remaining");

  useEffect(() => {
    try {
      // Get cached version if available
      const cachedVersion = localStorage.getItem("fitnessDataVersion") || "";
      setVersion(cachedVersion);
      
      // Load fitness data from localStorage
      const savedData = localStorage.getItem("fitnessData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Determine if this is V2 data or legacy data
        const isV2Data = parsedData.calTarget !== undefined;
        
        // Create compatible fitness data object for dashboard
        const compatibleData: FitnessData = {
          ...parsedData, // Keep original form data if available
          
          // Map V2 fields to expected fields with appropriate fallbacks
          bmr: parsedData.bmr ?? defaultData.bmr,
          tdee: parsedData.tdee ?? defaultData.tdee,
          targetCalories: isV2Data
            ? (parsedData.calTarget ?? defaultData.targetCalories)
            : (parsedData.targetCalories ?? defaultData.targetCalories),
          macros: {
            protein: isV2Data
              ? (parsedData.macros.protein_g ?? defaultData.macros.protein)
              : (parsedData.macros?.protein ?? defaultData.macros.protein),
            carbs: isV2Data
              ? (parsedData.macros.carbs_g ?? defaultData.macros.carbs)
              : (parsedData.macros?.carbs ?? defaultData.macros.carbs),
            fat: isV2Data
              ? (parsedData.macros.fat_g ?? defaultData.macros.fat)
              : (parsedData.macros?.fat ?? defaultData.macros.fat),
          },
          
          // Handle workout plan with appropriate mapping
          workoutPlan: isV2Data && parsedData.weeklySessions ? 
            parsedData.weeklySessions.map((session: any) => ({
              day: session.day,
              focus: session.focus,
              exercises: Array.isArray(session.exercises) ? session.exercises : [
                // Default exercise if none provided
                { 
                  name: `${session.focus} Training`, 
                  sets: session.sets || 3, 
                  reps: session.durationMin ? `${session.durationMin} min` : "10-12",
                  weight: "NA", 
                  rir: "1-2", 
                  completed: false 
                }
              ],
              completed: false,
            })) : 
            parsedData.workoutPlan || generateMockFitnessData().workoutPlan,
        };
        
        // Set fitness data
        setFitnessData(compatibleData);
        
        // Set V2 specific features if available
        if (isV2Data) {
          setRecoveryTips(parsedData.recoveryTips || []);
          setHealthFlags(parsedData.flags || []);
          setHydrationTarget(parsedData.hydrationMl || 0);
        }
        
        // Ensure workoutPlan has Sunday as the first day
        if (compatibleData.workoutPlan && compatibleData.workoutPlan.length > 0) {
          // Check if first day is not Sunday
          if (compatibleData.workoutPlan[0].day !== "Sunday") {
            // Find Sunday (likely at the end)
            const sundayIndex = compatibleData.workoutPlan.findIndex(day => day.day === "Sunday");
            if (sundayIndex > 0) {
              // Create a new array with Sunday as the first day
              const reorderedPlan = [...compatibleData.workoutPlan];
              const sunday = reorderedPlan.splice(sundayIndex, 1)[0];
              reorderedPlan.unshift(sunday);
              
              // Update the workout plan
              compatibleData.workoutPlan = reorderedPlan;
              setFitnessData({...compatibleData});
            }
          }
        }
      } else {
        // Load mock data as a fallback
        const mockData = generateMockFitnessData();
        setFitnessData(mockData);
        
        // Set some default recovery tips and hydration target
        setRecoveryTips([
          "Aim for 7-9 hours of sleep each night",
          "Stay hydrated throughout the day",
          "Consider light activity on rest days for active recovery"
        ]);
        
        setHydrationTarget(Math.round(mockData.weight * 35)); // ~35ml per kg of bodyweight
      }
      
      // Load workout logs from localStorage if available
      const savedLogs = localStorage.getItem("workoutLogs");
      if (savedLogs) {
        setWorkoutLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to mock data on error
      setFitnessData(generateMockFitnessData());
    }
  }, []);

  // Client-side only effect to update calorie data
  useEffect(() => {
    try {
      const foodLog = localStorage.getItem('foodLog') ? 
        JSON.parse(localStorage.getItem('foodLog') || '[]') : [];
      const today = new Date().toISOString().split('T')[0];
      const consumedToday = foodLog
        .filter((item: any) => item.date === today)
        .reduce((sum: number, item: any) => sum + (Number(item.calories) || 0), 0);
      const remaining = fitnessData?.targetCalories ? fitnessData.targetCalories - consumedToday : 0;
      setCaloriesInfo(`${consumedToday} consumed, ${remaining} remaining`);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setCaloriesInfo("0 consumed, 0 remaining");
    }
  }, [fitnessData.targetCalories]);

  // Handlers
  const handleToggleExerciseComplete = (exerciseIndex: number) => {
    const updatedData = { ...fitnessData }
    const exercise = updatedData.workoutPlan[activeDay].exercises[exerciseIndex]
    exercise.completed = !exercise.completed
    
    // Update workout completed status if all exercises complete
    updatedData.workoutPlan[activeDay].completed = 
      updatedData.workoutPlan[activeDay].exercises.every(ex => ex.completed)
    
    setFitnessData(updatedData)
    localStorage.setItem("fitnessData", JSON.stringify(updatedData))
  }
  
  const handleUpdateExerciseField = (exerciseIndex: number, field: string, value: string | number) => {
    const updatedData = { ...fitnessData }
    const exercise = updatedData.workoutPlan[activeDay].exercises[exerciseIndex] as any
    exercise[field] = value
    
    setFitnessData(updatedData)
    localStorage.setItem("fitnessData", JSON.stringify(updatedData))
  }
  
  // Log workout function
  const handleLogWorkout = () => {
    const currentWorkout = fitnessData.workoutPlan[activeDay]
    
    // Create log entry with timestamp
    const logEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      day: currentWorkout.day,
      focus: currentWorkout.focus,
      exercises: currentWorkout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        rir: ex.rir,
        completed: ex.completed
      })),
      notes: ""
    }
    
    // Add to logs
    const updatedLogs = [logEntry, ...workoutLogs]
    setWorkoutLogs(updatedLogs)
    
    // Save to localStorage
    localStorage.setItem("workoutLogs", JSON.stringify(updatedLogs))
    
    // Show confirmation
    alert("Workout logged successfully!")
  }
  
  // Format date for display
  const formatDate = (dateStr: string, format: 'full' | 'short' = 'full') => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      
      if (format === 'short') {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
      } else {
        return new Intl.DateTimeFormat('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }).format(date);
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // New handler for editing exercise name
  const handleStartEditExerciseName = (dayIndex: number, exerciseIndex: number) => {
    const exerciseName = fitnessData.workoutPlan[dayIndex].exercises[exerciseIndex].name
    setNewExerciseName(exerciseName)
    setEditingExerciseName({ dayIndex, exerciseIndex })
  }
  
  const handleSaveExerciseName = () => {
    if (!editingExerciseName || !newExerciseName.trim()) return
    
    const { dayIndex, exerciseIndex } = editingExerciseName
    const updatedData = { ...fitnessData }
    updatedData.workoutPlan[dayIndex].exercises[exerciseIndex].name = newExerciseName.trim()
    
    setFitnessData(updatedData)
    localStorage.setItem("fitnessData", JSON.stringify(updatedData))
    setEditingExerciseName(null)
  }
  
  const handleCancelEditExerciseName = () => {
    setEditingExerciseName(null)
  }
  
  // Add new exercise to current day
  const handleAddExercise = () => {
    const updatedData = { ...fitnessData }
    
    // Create a new exercise with default values
    const newExercise = {
      name: "New Exercise",
      sets: 3,
      reps: "10",
      weight: "0",
      rir: "2",
      completed: false
    }
    
    // Add to current day's exercises
    updatedData.workoutPlan[activeDay].exercises.push(newExercise)
    setFitnessData(updatedData)
    localStorage.setItem("fitnessData", JSON.stringify(updatedData))
    
    // Focus on the new exercise
    setActiveExercise(updatedData.workoutPlan[activeDay].exercises.length - 1)
  }

  // Function to reset fitness data to scientifically accurate values
  const resetFitnessData = () => {
    // Create more scientifically accurate fitness data
    const updatedData = {
      ...fitnessData,
      tdee: 2650,
      targetCalories: 2950,
      macros: {
        protein: 160,
        carbs: 338,
        fat: 90
      }
    };
    
    // Update state and save to localStorage
    setFitnessData(updatedData);
    localStorage.setItem("fitnessData", JSON.stringify(updatedData));
    
    // Show confirmation
    alert("Fitness data has been reset with scientifically accurate values.");
  };

  // Calculate total calories (with fallback to avoid showing NaN)
  const totalCalories = fitnessData?.targetCalories || defaultData.targetCalories;
  
  // Calculate the total macronutrient grams - use defaults from mock data if not available
  const totalProtein = fitnessData?.macros?.protein || defaultData.macros.protein;
  const totalCarbs = fitnessData?.macros?.carbs || defaultData.macros.carbs;
  const totalFat = fitnessData?.macros?.fat || defaultData.macros.fat;
  const totalGrams = totalProtein + totalCarbs + totalFat;
  
  // Calculate percentages for the chart (with fallbacks to avoid division by zero)
  const proteinPercentage = totalGrams > 0 ? (totalProtein / totalGrams) * 100 : 30;
  const carbsPercentage = totalGrams > 0 ? (totalCarbs / totalGrams) * 100 : 40;
  const fatPercentage = totalGrams > 0 ? (totalFat / totalGrams) * 100 : 30;
  
  // Adjusted percentages to ensure they add up to 100%
  const adjustedProteinPercentage = Math.round(proteinPercentage);
  const adjustedCarbsPercentage = Math.round(carbsPercentage);
  const adjustedFatPercentage = 100 - adjustedProteinPercentage - adjustedCarbsPercentage;
  
  // Client-side only effect to update macro circles based on food log data
  useEffect(() => {
    try {
      // Get food log data safely
      const foodLog = localStorage.getItem('foodLog') ? 
        JSON.parse(localStorage.getItem('foodLog') || '[]') : [];
        
      // Calculate today's consumption
      const today = new Date().toISOString().split('T')[0];
      const consumedToday = foodLog
        .filter((item: any) => item.date === today)
        .reduce((sum: number, item: any) => sum + (Number(item.calories) || 0), 0);
      
      // If there is consumption data, modify the fill proportions
      if (consumedToday > 0) {
        const ratio = Math.min(1, consumedToday / (totalCalories || 1));
        
        // Apply the consumption ratio to all macro segments
        if (proteinCircleRef.current) {
          proteinCircleRef.current.setAttribute('stroke-dasharray', 
            `${adjustedProteinPercentage * 2.4 * ratio} 240`);
        }
        if (carbsCircleRef.current) {
          carbsCircleRef.current.setAttribute('stroke-dasharray', 
            `${adjustedCarbsPercentage * 2.4 * ratio} 240`);
        }
        if (fatCircleRef.current) {
          fatCircleRef.current.setAttribute('stroke-dasharray', 
            `${adjustedFatPercentage * 2.4 * ratio} 240`);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [adjustedProteinPercentage, adjustedCarbsPercentage, adjustedFatPercentage, totalCalories]);

  // Define macro colors
  const macroColors = {
    protein: {
      light: "#64B5F6", // Light blue
      dark: "#1976D2",  // Dark blue
    },
    carbs: {
      light: "#81C784", // Light green
      dark: "#388E3C",  // Dark green
    },
    fat: {
      light: "#FFB74D", // Light orange
      dark: "#F57C00",  // Dark orange
    }
  };

  // Apply custom macros if customization is active
  const handleApplyCustomMacros = () => {
    // Ensure percentages add up to 100%
    const totalPercent = customMacros.protein + customMacros.carbs + customMacros.fat;
    if (totalPercent !== 100) return;
    
    // Calculate new macro values based on percentages using TARGET calories (not actual)
    const newProteinCals = (customMacros.protein / 100) * (totalCalories || 1);
    const newCarbsCals = (customMacros.carbs / 100) * (totalCalories || 1);
    const newFatCals = (customMacros.fat / 100) * (totalCalories || 1);
    
    // Convert calories to grams
    const newProtein = Math.round(newProteinCals / 4);
    const newCarbs = Math.round(newCarbsCals / 4);
    const newFat = Math.round(newFatCals / 9);
    
    // Update fitness data
    const updatedData = { ...fitnessData };
    updatedData.macros = {
      protein: newProtein,
      carbs: newCarbs,
      fat: newFat
    };
    
    setFitnessData(updatedData);
    localStorage.setItem("fitnessData", JSON.stringify(updatedData));
    setShowMacroCustomizer(false);
  };
  
  // Handle macro slider changes
  const handleMacroChange = (type: 'protein' | 'carbs' | 'fat', value: number) => {
    // Set the selected macro to the new value
    const newMacros = { ...customMacros, [type]: value };
    
    // Calculate what remains to distribute
    const remaining = 100 - value;
    
    // Determine which macros need to be adjusted (the other two)
    const otherTypes = ['protein', 'carbs', 'fat'].filter(t => t !== type) as ('protein' | 'carbs' | 'fat')[];
    
    // Get the current sum of the other two macros
    const otherSum = otherTypes.reduce((sum, t) => sum + customMacros[t], 0);
    
    if (otherSum === 0) {
      // If both are zero, distribute evenly
      newMacros[otherTypes[0]] = Math.round(remaining / 2);
      newMacros[otherTypes[1]] = remaining - newMacros[otherTypes[0]];
    } else {
      // Otherwise, distribute proportionally
      const ratio0 = customMacros[otherTypes[0]] / otherSum;
      const ratio1 = customMacros[otherTypes[1]] / otherSum;
      
      newMacros[otherTypes[0]] = Math.round(remaining * ratio0);
      newMacros[otherTypes[1]] = remaining - newMacros[otherTypes[0]];
    }
    
    setCustomMacros(newMacros);
  };

  const pathname = usePathname();

  return (
    <div className={`flex h-screen bg-black text-white antialiased ${inter.variable} font-sans`}>
      <aside className="w-16 bg-[#121212] p-3 flex flex-col items-center sticky top-0 shadow-xl border-r border-white/5">
        <div className="flex flex-col space-y-8 w-full items-center">
          <Link 
            href="/"
            className="group flex items-center justify-center"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Image 
                src="/science-logo.png.png" 
                alt="FitAI Logo" 
                width={28} 
                height={28} 
                className="object-contain"
              />
            </div>
          </Link>
          <div className="w-full pt-6 flex flex-col space-y-6 items-center">
            <Link 
              href="/dashboard" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname === '/dashboard' ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} transition-all`}
            >
              <LayoutDashboard size={20} />
            </Link>
            <Link 
              href="/workout" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname?.startsWith('/workout') ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} transition-all`}
            >
              <Dumbbell size={20} />
            </Link>
            <Link 
              href="/nutrition" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname?.startsWith('/nutrition') ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} transition-all`}
            >
              <Apple size={20} />
            </Link>
            <Link 
              href="/dashboard/coach" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname?.startsWith('/dashboard/coach') ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} transition-all`}
            >
              <MessageSquare size={20} />
            </Link>
            <Link 
              href="/settings" 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname?.startsWith('/settings') ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} transition-all`}
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-[#121212]">
        <h1 className="text-3xl font-light mb-8 text-center text-white/90">Zentra Training</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
          {/* Nutrition Card */}
          <Link href="/nutrition" className="block">
            <section className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-7 border border-zinc-700/25 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium tracking-tight text-white/90">Nutrition Overview</h2>
                <div className="bg-zinc-800/70 text-white/80 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
              
              <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Calories Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <div className="text-sm text-white/70">Daily Calories</div>
                        <div className="text-2xl font-medium text-white/95">
                          {fitnessData?.targetCalories || defaultData.targetCalories} <span className="text-xs text-white/50">kcal</span>
                          <div className="text-xs text-white/50 mt-1">
                            {caloriesInfo}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">BMR</span>
                          <span className="font-light">{fitnessData?.bmr || defaultData.bmr} <span className="text-xs text-white/50">kcal</span></span>
                        </div>
                        <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-white/40 to-white/10 rounded-full" style={{ width: `${(fitnessData?.bmr || 0) / (fitnessData?.targetCalories || 1) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">TDEE</span>
                          <span className="font-light">{fitnessData?.tdee || defaultData.tdee} <span className="text-xs text-white/50">kcal</span></span>
                        </div>
                        <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-white/40 to-white/10 rounded-full" style={{ width: `${(fitnessData?.tdee || 0) / (fitnessData?.targetCalories || 1) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Macros Section */}
                  <div className="flex-1">
                    <div className="mb-4 text-center">
                      <h3 className="text-sm text-white/70 font-medium">Macro Distribution</h3>
                    </div>
                    
                    {/* Simplified progress ring */}
                    <div className="relative mx-auto w-48 h-48 mb-4 group">
                      {/* Center calorie display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                        <div className="w-32 h-32 rounded-full backdrop-blur-xl bg-black/30 border border-white/10 flex flex-col items-center justify-center shadow-inner">
                          <div className="text-2xl font-medium text-white/95">{fitnessData?.targetCalories || defaultData.targetCalories}</div>
                          <div className="text-xs font-normal text-white/40 uppercase tracking-wide">calories</div>
                        </div>
                      </div>
                      
                      {/* Progress ring that fills as user logs food */}
                      <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                        <defs>
                          <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B6B" />
                            <stop offset="100%" stopColor="#CC2D2D" />
                          </linearGradient>
                          <linearGradient id="carbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4ECDC4" />
                            <stop offset="100%" stopColor="#1A9B94" />
                          </linearGradient>
                          <linearGradient id="fatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFD166" />
                            <stop offset="100%" stopColor="#DBA628" />
                          </linearGradient>
                          
                          <filter id="dashboardGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        {/* Base circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          fill="none" 
                          stroke="rgba(255, 255, 255, 0.06)" 
                          strokeWidth="12"
                        />
                        
                        {/* Protein segment */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          fill="none" 
                          stroke="url(#proteinGradient)" 
                          strokeWidth="12" 
                          strokeLinecap="round"
                          strokeDasharray={`${adjustedProteinPercentage * 2.4} 240`}
                          strokeDashoffset="0"
                          filter="url(#dashboardGlow)"
                          className="transition-all duration-700"
                          ref={proteinCircleRef}
                        />
                        
                        {/* Carbs segment */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          fill="none" 
                          stroke="url(#carbsGradient)" 
                          strokeWidth="12" 
                          strokeLinecap="round"
                          strokeDasharray={`${adjustedCarbsPercentage * 2.4} 240`}
                          strokeDashoffset={`${-adjustedProteinPercentage * 2.4}`}
                          filter="url(#dashboardGlow)"
                          className="transition-all duration-700"
                          ref={carbsCircleRef}
                        />
                        
                        {/* Fat segment */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          fill="none" 
                          stroke="url(#fatGradient)" 
                          strokeWidth="12" 
                          strokeLinecap="round"
                          strokeDasharray={`${adjustedFatPercentage * 2.4} 240`}
                          strokeDashoffset={`${-(adjustedProteinPercentage + adjustedCarbsPercentage) * 2.4}`}
                          filter="url(#dashboardGlow)"
                          className="transition-all duration-700"
                          ref={fatCircleRef}
                        />
                      </svg>
                    </div>
                    
                    {/* Macro cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-zinc-900/80 rounded-xl px-3 py-2.5 text-center border border-white/10 shadow-sm">
                        <div className="text-[10px] mb-1 font-medium text-[#FF6B6B] tracking-wide">PROTEIN</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-medium text-white/90">{fitnessData?.macros?.protein || defaultData.macros.protein}</span>
                          <span className="text-xs font-normal ml-0.5 text-white/50">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/80 rounded-xl px-3 py-2.5 text-center border border-white/10 shadow-sm">
                        <div className="text-[10px] mb-1 font-medium text-[#4ECDC4] tracking-wide">CARBS</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-medium text-white/90">{fitnessData?.macros?.carbs || defaultData.macros.carbs}</span>
                          <span className="text-xs font-normal ml-0.5 text-white/50">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/80 rounded-xl px-3 py-2.5 text-center border border-white/10 shadow-sm">
                        <div className="text-[10px] mb-1 font-medium text-[#FFD166] tracking-wide">FAT</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-medium text-white/90">{fitnessData?.macros?.fat || defaultData.macros.fat}</span>
                          <span className="text-xs font-normal ml-0.5 text-white/50">g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Link>
           
          {/* Training Schedule Card */}
          <section id="schedule" className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-7 border border-zinc-700/25 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium tracking-tight text-white/90">Training Schedule</h2>
              </div>
              <Link 
                href="/workout"
                className="text-sm flex items-center gap-1 text-white/70 hover:text-white transition-colors"
              >
                <span>View Full Schedule</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </div>
            
            {/* Workout Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/5">
              {/* Days tabs - horizontal scrollable */}
              <div className="px-4 pt-4 pb-3 border-b border-white/5">
                <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
                  {fitnessData.workoutPlan.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDay(index)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeDay === index 
                          ? 'bg-zinc-800 text-white shadow-md border border-white/5' 
                          : 'bg-zinc-900/50 text-white/70 hover:bg-zinc-800/80 hover:text-white/90 border border-white/10'
                      }`}
                    >
                      {day.day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Workout details */}
              <div className="p-5">
                {fitnessData.workoutPlan && fitnessData.workoutPlan.length > 0 && activeDay >= 0 && activeDay < fitnessData.workoutPlan.length ? (
                  <>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="text-lg font-medium text-white/90">{fitnessData.workoutPlan[activeDay].focus}</h3>
                        <p className="text-xs text-white/50 mt-1">
                          {fitnessData.workoutPlan[activeDay].day}
                        </p>
                      </div>
                      {fitnessData.workoutPlan[activeDay].completed && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Completed
                        </div>
                      )}
                    </div>
                    
                    {/* Exercises list */}
                    <div className="space-y-4">
                      {fitnessData.workoutPlan[activeDay].exercises.map((exercise, exIndex) => (
                        <div 
                          key={exIndex} 
                          className={`relative bg-zinc-900/60 backdrop-blur-md rounded-xl border ${
                            exercise.completed ? 'border-emerald-500/30 shadow-sm' : 'border-white/5 shadow-md'
                          } overflow-hidden transition-all hover:border-white/10`}
                        >
                          {/* Exercise header - collapsible */}
                          <div 
                            className="flex justify-between items-center p-4"
                            onClick={() => {
                              if (!editingExerciseName) {
                                setActiveExercise(exIndex === activeExercise ? -1 : exIndex)
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleExerciseComplete(exIndex);
                                }}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                  exercise.completed 
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                    : 'border-white/20 text-white/40 hover:border-white/40'
                                }`}
                              >
                                {exercise.completed && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </button>
                              
                              {/* Show input field when editing this exercise name */}
                              {editingExerciseName && 
                               editingExerciseName.dayIndex === activeDay && 
                               editingExerciseName.exerciseIndex === exIndex ? (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={newExerciseName}
                                    onChange={(e) => setNewExerciseName(e.target.value)}
                                    className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={handleSaveExerciseName}
                                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={handleCancelEditExerciseName}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium text-base ${exercise.completed ? 'text-white/60 line-through' : 'text-white/90'} truncate group flex items-center`}>
                                      {exercise.name}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartEditExerciseName(activeDay, exIndex);
                                        }}
                                        className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M16.7 4C20.9778 10.3256 21 10.6588 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C13.3947 1 15.5961 1.81083 17.3562 3.17561" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                      </button>
                                    </span>
                                  </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                              <div className="flex items-center text-white/60 text-xs">
                                <span>{String(exercise.sets)}×</span>
                                <span className="ml-1">{exercise.reps}</span>
                              </div>
                              <button 
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white/40 transition-all ${
                                  activeExercise === exIndex ? 'bg-white/10 rotate-180' : ''
                                }`}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Exercise sets - when active */}
                          {activeExercise === exIndex && (
                            <div className="p-4 pt-0 border-t border-zinc-800/40">
                              <div className="bg-zinc-800/50 rounded-xl p-4 mb-3 shadow-inner">
                                <div className="grid grid-cols-4 gap-2 mb-2 text-xs text-white/60">
                                  <div>Set</div>
                                  <div className="text-center">Weight</div>
                                  <div className="text-center">Reps</div>
                                  <div className="text-center">RIR</div>
                                </div>
                                
                                {Array.from({ length: Number(exercise.sets) || 1 }).map((_, setIndex) => (
                                  <div key={setIndex} className="grid grid-cols-4 gap-2 mb-2 items-center">
                                    <div className="text-sm text-white/80">{String(setIndex + 1)}</div>
                                    <div className="text-center">
                                      <input 
                                        type="text"
                                        defaultValue={exercise.weight === "NA" ? "" : exercise.weight}
                                        placeholder="kg"
                                        className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2 py-1 text-sm text-center"
                                        onChange={(e) => handleUpdateExerciseField(exIndex, 'weight', e.target.value)}
                                      />
                                    </div>
                                    <div className="text-center">
                                      <input 
                                        type="text"
                                        defaultValue={exercise.reps === "60min" ? "8-12" : exercise.reps}
                                        placeholder="8-12"
                                        className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2 py-1 text-sm text-center"
                                        onChange={(e) => handleUpdateExerciseField(exIndex, 'reps', e.target.value)}
                                      />
                                    </div>
                                    <div className="text-center">
                                      <input 
                                        type="text"
                                        defaultValue={exercise.rir && exercise.rir !== "1-2" ? exercise.rir : ""}
                                        placeholder="Optional"
                                        className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2 py-1 text-sm text-center"
                                        onChange={(e) => handleUpdateExerciseField(exIndex, 'rir', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                ))}
                                
                                <div className="mt-3">
                                  <button 
                                    className="w-full py-1.5 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg text-xs transition-colors border border-white/5"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Increment the sets for this exercise
                                      handleUpdateExerciseField(exIndex, 'sets', String(parseInt(String(exercise.sets)) + 1));
                                    }}
                                  >
                                    + Add Set
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button 
                                  className="flex-1 text-xs px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 22h6m-3-8v8M20 14l2-2-2-2M10 6H7a2 2 0 00-2 2v8a2 2 0 002 2h3m2-12h3a2 2 0 012 2v8a2 2 0 01-2 2h-3m-2-12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Video Guide
                                </button>
                                <button 
                                  className="flex-1 text-xs px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.232 5C20.9778 10.3256 21 10.6588 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C13.3947 1 15.5961 1.81083 17.3562 3.17561" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                  Log Performance
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white/70 mb-2">No workout data available</h3>
                    <p className="text-sm text-white/40 max-w-md">
                      There seems to be an issue with your workout plan. Please try refreshing the page or completing the fitness questionnaire again.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add new exercise button */}
            {fitnessData.workoutPlan && fitnessData.workoutPlan.length > 0 && activeDay >= 0 && activeDay < fitnessData.workoutPlan.length && (
              <div className="mt-5">
                <button 
                  onClick={handleAddExercise}
                  className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center gap-2 text-sm font-medium transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Exercise
                </button>
              </div>
            )}
            
            {/* Workout Log History */}
            {showWorkoutLogs && (
              <div className="mt-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium tracking-tight text-white/90">Workout History</h3>
                  <button 
                    onClick={() => setShowWorkoutLogs(false)}
                    className="text-white/50 hover:text-white/80 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                {workoutLogs.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-white/40 text-center text-sm">No workout logs yet</p>
                    <p className="text-white/30 text-center text-xs mt-1">Complete a workout and click "Log" to save it</p>
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3">
                    {workoutLogs.map((log) => (
                      <div key={log.id} className="bg-zinc-800/40 hover:bg-zinc-800/60 rounded-xl p-4 border border-white/5 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-base font-medium">{log.focus}</div>
                            <div className="text-xs text-white/50 mt-0.5">{formatDate(String(log.date || ''))}</div>
                          </div>
                          <div className="text-xs px-2.5 py-1 bg-zinc-800/80 rounded-full text-white/70 border border-white/5">
                            {log.day}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {log.exercises.filter((ex: any) => ex.completed).map((ex: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-xs bg-zinc-800/20 rounded-lg p-2.5 border border-white/5">
                              <span className="text-white/90">{ex.name}</span>
                              <span className="text-white/60 font-mono">
                                {String(ex.sets)} × {ex.reps} {ex.weight !== "NA" ? `@ ${ex.weight}` : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        
        <div className="mt-8 text-center mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/coach" className="inline-block py-2 px-6 rounded-full border border-white/10 hover:bg-zinc-800/40 text-white/90 transition-all text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-indigo-400" />
                <span>Chat with AI Coach</span>
              </div>
            </Link>
            
            <Link href="/workout" className="inline-block py-2 px-6 rounded-full border border-white/10 hover:bg-zinc-800/40 text-white/90 transition-all text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-400">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Workout Schedule</span>
              </div>
            </Link>
            
            <Link href="/nutrition" className="inline-block py-2 px-6 rounded-full border border-white/10 hover:bg-zinc-800/40 text-white/90 transition-all text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-400">
                  <path d="M8.5 14L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>Nutrition Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 max-w-6xl mx-auto mb-12">
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg lg:col-span-2">
            <h2 className="text-lg font-medium mb-5 flex items-center text-white/90">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-blue-400">
                <path d="M20.9417 10C20.9778 10.3256 21 10.6588 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C13.3947 1 15.5961 1.81083 17.3562 3.17561" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 5L12 14L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Nutrition Overview
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                <div className="text-white/60 text-xs mb-1 font-medium">Daily Calories</div>
                <div className="text-xl font-medium text-white/95">{fitnessData?.targetCalories || defaultData.targetCalories} <span className="text-xs text-white/50">kcal</span></div>
                <div className="text-white/40 text-xs mt-1">
                  {Math.round((((fitnessData?.targetCalories || 0) - (fitnessData?.tdee || 0)) / (fitnessData?.tdee || 1)) * 100)}% {(fitnessData?.targetCalories || 0) > (fitnessData?.tdee || 0) ? 'surplus' : 'deficit'}
                </div>
              </div>
              
              <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                <div className="text-white/60 text-xs mb-1 font-medium">Protein</div>
                <div className="text-xl font-medium text-white/95">{fitnessData?.macros?.protein || defaultData.macros.protein}g</div>
                <div className="text-white/40 text-xs mt-1">
                  {Math.round(((fitnessData?.macros?.protein || defaultData.macros.protein || 0) / totalGrams) * 100)}% of total
                </div>
              </div>
              
              <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                <div className="text-white/60 text-xs mb-1 font-medium">Carbs</div>
                <div className="text-xl font-medium text-white/95">{fitnessData?.macros?.carbs || defaultData.macros.carbs}g</div>
                <div className="text-white/40 text-xs mt-1">
                  {Math.round(((fitnessData?.macros?.carbs || defaultData.macros.carbs || 0) / totalGrams) * 100)}% of total
                </div>
              </div>
              
              <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                <div className="text-white/60 text-xs mb-1 font-medium">Fat</div>
                <div className="text-xl font-medium text-white/95">{fitnessData?.macros?.fat || defaultData.macros.fat}g</div>
                <div className="text-white/40 text-xs mt-1">
                  {Math.round(((fitnessData?.macros?.fat || defaultData.macros.fat || 0) / totalGrams) * 100)}% of total
                </div>
              </div>
              
              {hydrationTarget > 0 && (
                <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                  <div className="text-white/60 text-xs mb-1 font-medium">Hydration</div>
                  <div className="text-xl font-medium text-white/95">{hydrationTarget} ml</div>
                  <div className="text-white/40 text-xs mt-1">
                    {Math.round(hydrationTarget / 1000 * 10) / 10} liters daily
                  </div>
                </div>
              )}
              
              <div className="bg-zinc-800/40 border border-white/5 rounded-xl p-4 shadow-md">
                <div className="text-white/60 text-xs mb-1 font-medium">Base Metabolism</div>
                <div className="text-xl font-medium text-white/95">{fitnessData?.bmr || defaultData.bmr} kcal</div>
                <div className="text-white/40 text-xs mt-1">
                  BMR
                </div>
              </div>
            </div>
            
            {/* Recovery Tips Section - V2 Feature */}
            {recoveryTips.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-medium mb-3 text-white/90">Recovery Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recoveryTips.map((tip, index) => (
                    <div key={index} className="bg-zinc-800/30 border border-white/5 rounded-xl p-3.5 flex items-start shadow-sm">
                      <div className="mr-2 mt-0.5 text-emerald-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-sm text-white/80">{tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Health Flags Section - V2 Feature */}
            {healthFlags.length > 0 && (
              <div className="mt-5">
                <h3 className="text-base font-medium mb-3 text-white/90">Health Considerations</h3>
                <div className="flex flex-wrap gap-2">
                  {healthFlags.map((flag, index) => (
                    <div key={index} className="px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 text-amber-300 rounded-full text-xs shadow-sm">
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Version Tag - V2 Feature */}
            {version && (
              <div className="mt-6 text-right">
                <span className="text-xs text-white/30">Calculator version: {version}</span>
                <button 
                  onClick={resetFitnessData} 
                  className="ml-4 text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Reset nutrition data
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}