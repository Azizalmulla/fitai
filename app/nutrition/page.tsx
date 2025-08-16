'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { calculateTargetCalories, calculateMacros } from '@/lib/fitness-calculator' // <-- ADDED

// Fallback mock data to ensure consistent values across dashboard and nutrition pages
const generateMockNutritionData = () => ({
  targetCalories: 2950,
  bmr: 1850,
  tdee: 2650,
  macros: {
    protein: 160,
    carbs: 338,
    fat: 90,
  },
});

export default function NutritionPage() {
  // State for fitness data (initialize with fallback mock data)
  const defaultData = generateMockNutritionData();
  const [fitnessData, setFitnessData] = useState<any>(defaultData)
  
  // State for food log
  const [foodName, setFoodName] = useState<string>('')
  const [foodCalories, setFoodCalories] = useState<number>(0)
  const [foodProtein, setFoodProtein] = useState<number>(0)
  const [foodCarbs, setFoodCarbs] = useState<number>(0)
  const [foodFat, setFoodFat] = useState<number>(0)
  const [foodEntries, setFoodEntries] = useState<any[]>([])
  
  // State for macro customization
  const [showMacroCustomizer, setShowMacroCustomizer] = useState<boolean>(false)
  const [customMacros, setCustomMacros] = useState<{protein: number, carbs: number, fat: number}>({
    protein: 30,
    carbs: 40,
    fat: 30,
  })
  
  // Function to reset nutrition data to scientifically accurate values
  const resetNutritionData = () => {
    // Retrieve user preferences (e.g., dietType, goal, gender, weight, experienceLevel, bodyFatLevel) from fitnessData or localStorage
    let userPrefs = fitnessData?.userPrefs;
    if (!userPrefs) {
      try {
        const stored = localStorage.getItem("userPrefs");
        if (stored) userPrefs = JSON.parse(stored);
      } catch {}
    }

    // Fallbacks if not found
    const dietType = userPrefs?.dietType || "balanced";
    const goal = userPrefs?.goal || fitnessData?.goal || "maintenance";
    const gender = userPrefs?.gender || fitnessData?.gender || "male";
    const weight = userPrefs?.weight || fitnessData?.weight || 75; // kg
    const experienceLevel = userPrefs?.experienceLevel || fitnessData?.experienceLevel || "beginner";
    const bodyFatLevel = userPrefs?.bodyFatLevel || fitnessData?.bodyFatLevel;
    const tdee = fitnessData?.tdee || 2650;

    // Calculate targetCalories using the imported function
    const targetCalories = calculateTargetCalories(tdee, goal, gender);

    // Calculate macros using the imported function
    const macros = calculateMacros(targetCalories, weight, goal, experienceLevel, bodyFatLevel);

    const updatedData = {
      ...fitnessData,
      tdee,
      targetCalories,
      macros
    };

    setFitnessData(updatedData);
    localStorage.setItem("fitnessData", JSON.stringify(updatedData));
    setFoodEntries([]);
    localStorage.setItem("foodEntries", JSON.stringify([]));
    alert("Nutrition data has been reset based on your preferences.");
  };
  
  // Load data from localStorage
  useEffect(() => {
    try {
      // Load fitness data from localStorage
      const savedData = localStorage.getItem("fitnessData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Determine if this is V2 data or legacy data
        const isV2Data = parsedData.calTarget !== undefined;
        
        // Create compatible fitness data object for nutrition page
        const compatibleData = {
          ...defaultData,
          
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
          }
        };
        
        console.log("Loaded nutrition data:", compatibleData);
        setFitnessData(compatibleData);
        
        // Load food entries
        const storedFoodEntries = localStorage.getItem("foodEntries")
        if (storedFoodEntries) {
          setFoodEntries(JSON.parse(storedFoodEntries))
        }
      }
    } catch (e) {
      console.error("Error parsing fitness data", e)
    }
  }, [])
  
  // Macro colors
  const macroColors = {
    protein: { light: '#7EE7FC', dark: '#0093AD' },
    carbs: { light: '#94E37C', dark: '#2C7A1F' },
    fat: { light: '#FFC876', dark: '#B57A2F' }
  }
  
  // Calculate total calories and macro percentages
  const totalCalories = fitnessData.targetCalories || defaultData.targetCalories;
  
  // Add a warning message if no calorie target found
  const noCalorieTargetFound = totalCalories === 0;
  
  const protein = fitnessData.macros?.protein || defaultData.macros.protein;
  const carbs = fitnessData.macros?.carbs || defaultData.macros.carbs;
  const fat = fitnessData.macros?.fat || defaultData.macros.fat;
  
  const proteinCalories = protein * 4
  const carbsCalories = carbs * 4
  const fatCalories = fat * 9
  
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100)
  const carbsPercentage = Math.round((carbsCalories / totalCalories) * 100)
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100)
  
  // Adjusted to ensure they add up to 100%
  const total = proteinPercentage + carbsPercentage + fatPercentage
  const adjustedProteinPercentage = Math.round((proteinPercentage / total) * 100)
  const adjustedCarbsPercentage = Math.round((carbsPercentage / total) * 100)
  const adjustedFatPercentage = 100 - adjustedProteinPercentage - adjustedCarbsPercentage
  
  // Food log functions
  const addFoodEntry = () => {
    if (!foodName) return
    const newEntry = {
      name: foodName,
      calories: foodCalories,
      protein: foodProtein,
      carbs: foodCarbs,
      fat: foodFat
    }
    const updatedEntries = [...foodEntries, newEntry]
    setFoodEntries(updatedEntries)
    setFoodName('')
    setFoodCalories(0)
    setFoodProtein(0)
    setFoodCarbs(0)
    setFoodFat(0)
    
    // Save to localStorage
    localStorage.setItem("foodEntries", JSON.stringify(updatedEntries))
  }

  const removeFoodEntry = (index: number) => {
    const updatedEntries = foodEntries.filter((entry, i) => i !== index)
    setFoodEntries(updatedEntries)
    localStorage.setItem("foodEntries", JSON.stringify(updatedEntries))
  }
  
  // Calculate consumed macros
  const totalConsumed = foodEntries.reduce((acc, entry) => acc + entry.calories, 0)
  const consumedProtein = foodEntries.reduce((acc, entry) => acc + entry.protein, 0)
  const consumedCarbs = foodEntries.reduce((acc, entry) => acc + entry.carbs, 0)
  const consumedFat = foodEntries.reduce((acc, entry) => acc + entry.fat, 0)
  
  // Custom macros functions
  const handleMacroChange = (macro: string, value: number) => {
    const newMacros = { ...customMacros, [macro]: value }
    
    // Ensure total is 100%
    const total = newMacros.protein + newMacros.carbs + newMacros.fat
    
    if (total > 100) {
      // Adjust the other macros proportionally
      if (macro === 'protein') {
        const remainder = 100 - value
        const ratio = newMacros.carbs / (newMacros.carbs + newMacros.fat)
        newMacros.carbs = Math.round(remainder * ratio)
        newMacros.fat = 100 - value - newMacros.carbs
      } else if (macro === 'carbs') {
        const remainder = 100 - value
        const ratio = newMacros.protein / (newMacros.protein + newMacros.fat)
        newMacros.protein = Math.round(remainder * ratio)
        newMacros.fat = 100 - value - newMacros.protein
      } else if (macro === 'fat') {
        const remainder = 100 - value
        const ratio = newMacros.protein / (newMacros.protein + newMacros.carbs)
        newMacros.protein = Math.round(remainder * ratio)
        newMacros.carbs = 100 - value - newMacros.protein
      }
    }
    
    setCustomMacros(newMacros)
  }
  
  const handleApplyCustomMacros = () => {
    // Calculate new macros based on percentages
    const proteinCals = Math.round(totalCalories * (customMacros.protein / 100))
    const carbsCals = Math.round(totalCalories * (customMacros.carbs / 100))
    const fatCals = Math.round(totalCalories * (customMacros.fat / 100))
    
    const newMacros = {
      protein: Math.round(proteinCals / 4),
      carbs: Math.round(carbsCals / 4),
      fat: Math.round(fatCals / 9)
    }
    
    // Update fitness data with new macros
    const updatedData = {
      ...fitnessData,
      macros: newMacros
    }
    
    setFitnessData(updatedData)
    localStorage.setItem("fitnessData", JSON.stringify(updatedData))
    setShowMacroCustomizer(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-light mt-4">Nutrition Dashboard</h1>
          <p className="text-white/60 mt-2">Track your calories and macronutrients</p>
        </div>
        
        {/* Main content grid */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Macro & Calorie Overview */}
          <div className="flex-1 order-2 md:order-1">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Daily Nutrition Targets</h2>
                <button 
                  onClick={() => setShowMacroCustomizer(!showMacroCustomizer)}
                  className="text-xs px-3 py-1 border border-white/10 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  {showMacroCustomizer ? 'Cancel' : 'Customize Macros'}
                </button>
                <button 
                  onClick={resetNutritionData}
                  className="text-xs px-3 py-1 border border-white/10 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Reset Data
                </button>
              </div>
              
              {noCalorieTargetFound && (
                <div className="bg-amber-900/20 border border-amber-700/20 text-amber-200 rounded-lg p-3 text-sm mb-4">
                  <p>No calorie target found. Please complete the fitness questionnaire to get personalized nutrition targets.</p>
                  <Link href="/questionnaire" className="mt-2 inline-block text-white bg-amber-800/40 hover:bg-amber-800/60 px-3 py-1 rounded-md text-xs">
                    Go to Questionnaire
                  </Link>
                </div>
              )}
              
              <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Calories Section */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <div className="text-lg text-white/80 mb-1">Daily Calories</div>
                      <div className="text-3xl font-light">
                        {totalCalories} <span className="text-xs text-white/50">kcal</span>
                      </div>
                      <div className="text-sm text-white/50 mt-1">
                        {totalConsumed} consumed, {totalCalories - totalConsumed} remaining
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">BMR</span>
                          <span className="font-light">{fitnessData.bmr} <span className="text-xs text-white/50">kcal</span></span>
                        </div>
                        <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white/40 rounded-full" style={{ width: `${(fitnessData.bmr || 0) / totalCalories * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-white/40 mt-1">Basal Metabolic Rate - calories burned at complete rest</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">TDEE</span>
                          <span className="font-light">{fitnessData.tdee} <span className="text-xs text-white/50">kcal</span></span>
                        </div>
                        <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white/40 rounded-full" style={{ width: `${(fitnessData.tdee || 0) / totalCalories * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-white/40 mt-1">Total Daily Energy Expenditure - includes activity level</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">Today's Consumption</span>
                          <span className="font-light">{totalConsumed} <span className="text-xs text-white/50">kcal</span></span>
                        </div>
                        <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400/70 rounded-full" style={{ width: `${(totalConsumed) / totalCalories * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Macros Section */}
                  <div className="flex-1">
                    <div className="mb-4 text-center">
                      <h3 className="text-sm text-white/70">Macro Distribution</h3>
                    </div>
                    
                    {/* Progress ring */}
                    <div className="relative mx-auto w-60 h-60 my-4 group">
                      {/* Center calorie display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                        <div className="w-40 h-40 rounded-full backdrop-blur-xl bg-black/20 border border-white/5 flex flex-col items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                          <div className="text-3xl font-light">{totalCalories}</div>
                          <div className="text-xs font-normal text-white/40 uppercase">calories</div>
                          <div className="text-xs text-white/50 mt-1">
                            {totalConsumed} consumed, {totalCalories - totalConsumed} remaining
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress ring */}
                      <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        {/* Fill based on consumption */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="white"
                          strokeWidth="12"
                          strokeDasharray={`${Math.min(totalConsumed / totalCalories, 1) * 251.3} 251.3`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    {/* VisionOS-style interactive legend pills - simplified to match dashboard */}
                    <div className="flex justify-center items-center space-x-6 mb-6 mt-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-br from-[#7EE7FC] to-[#0093AD]"></div>
                        <span className="text-xs text-white/70">Protein</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-br from-[#94E37C] to-[#2C7A1F]"></div>
                        <span className="text-xs text-white/70">Carbs</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-br from-[#FFC876] to-[#B57A2F]"></div>
                        <span className="text-xs text-white/70">Fat</span>
                      </div>
                    </div>
                    
                    {/* Macro cards - simplified to match dashboard */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-900/70 rounded-xl px-3 py-2 text-center">
                        <div className="text-[10px] mb-1 font-medium text-[#7EE7FC]">PROTEIN</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-normal">{protein}</span>
                          <span className="text-xs font-normal ml-0.5">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/70 rounded-xl px-3 py-2 text-center">
                        <div className="text-[10px] mb-1 font-medium text-[#94E37C]">CARBS</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-normal">{carbs}</span>
                          <span className="text-xs font-normal ml-0.5">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/70 rounded-xl px-3 py-2 text-center">
                        <div className="text-[10px] mb-1 font-medium text-[#FFC876]">FAT</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-lg font-normal">{fat}</span>
                          <span className="text-xs font-normal ml-0.5">g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Macro customizer panel */}
              {showMacroCustomizer && (
                <div className="mt-6 bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium tracking-tight">Customize Macros</h3>
                    <button 
                      onClick={() => setShowMacroCustomizer(false)}
                      className="text-white/50 hover:text-white/80 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6 mt-2">
                    {/* Protein slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm" style={{ color: macroColors.protein.light }}>Protein</label>
                        <span className="text-sm text-white/80 font-light">{customMacros.protein}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={customMacros.protein}
                        onChange={(e) => handleMacroChange('protein', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: macroColors.protein.light }}
                      />
                    </div>
                    
                    {/* Carbs slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm" style={{ color: macroColors.carbs.light }}>Carbs</label>
                        <span className="text-sm text-white/80 font-light">{customMacros.carbs}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={customMacros.carbs}
                        onChange={(e) => handleMacroChange('carbs', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: macroColors.carbs.light }}
                      />
                    </div>
                    
                    {/* Fat slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm" style={{ color: macroColors.fat.light }}>Fat</label>
                        <span className="text-sm text-white/80 font-light">{customMacros.fat}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={customMacros.fat}
                        onChange={(e) => handleMacroChange('fat', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: macroColors.fat.light }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleApplyCustomMacros}
                      className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white transition"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Food Log */}
            <div className="md:w-80 order-1 md:order-2">
              <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Food Log</h2>
                  <div className="text-sm text-white/60">
                    {totalConsumed} / {totalCalories} cal
                  </div>
                </div>
                
                {/* Food Entry Form */}
                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 mb-6">
                  <div className="text-sm font-medium">Add Food</div>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Food name" 
                      className="w-full rounded-lg px-3 py-2 bg-zinc-800/80 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="Calories" 
                        className="rounded-lg px-3 py-2 bg-zinc-800/80 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        value={foodCalories || ''}
                        onChange={(e) => setFoodCalories(parseInt(e.target.value) || 0)}
                      />
                      <input 
                        type="number" 
                        placeholder="Protein (g)" 
                        className="rounded-lg px-3 py-2 bg-zinc-800/80 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        value={foodProtein || ''}
                        onChange={(e) => setFoodProtein(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="Carbs (g)" 
                        className="rounded-lg px-3 py-2 bg-zinc-800/80 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        value={foodCarbs || ''}
                        onChange={(e) => setFoodCarbs(parseInt(e.target.value) || 0)}
                      />
                      <input 
                        type="number" 
                        placeholder="Fat (g)" 
                        className="rounded-lg px-3 py-2 bg-zinc-800/80 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        value={foodFat || ''}
                        onChange={(e) => setFoodFat(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <button
                      className="w-full rounded-lg px-3 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium text-sm"
                      onClick={addFoodEntry}
                    >
                      Add Food
                    </button>
                  </div>
                </div>
                
                {/* Food Log List */}
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium mb-2">Today's Food</div>
                  
                  {foodEntries.length === 0 ? (
                    <div className="text-center text-white/40 py-6 bg-zinc-900/20 rounded-xl">
                      No foods logged today
                    </div>
                  ) : (
                    <>
                      {/* Log entries */}
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {foodEntries.map((entry, index) => (
                          <div 
                            key={index} 
                            className="bg-zinc-900/30 rounded-xl p-3 text-sm"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{entry.name}</div>
                              <button
                                className="text-white/40 hover:text-white/70"
                                onClick={() => removeFoodEntry(index)}
                              >
                                ✕
                              </button>
                            </div>
                            
                            <div className="text-white/60 text-xs mt-1">{entry.calories} calories</div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                              <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-1.5">
                                <div style={{ color: macroColors.protein.light }}>{entry.protein}g</div>
                                <div className="text-white/40">Protein</div>
                              </div>
                              <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-1.5">
                                <div style={{ color: macroColors.carbs.light }}>{entry.carbs}g</div>
                                <div className="text-white/40">Carbs</div>
                              </div>
                              <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-1.5">
                                <div style={{ color: macroColors.fat.light }}>{entry.fat}g</div>
                                <div className="text-white/40">Fat</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Nutrition Summary */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-medium">Total</div>
                          <div className="text-sm">{totalConsumed} cal</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-2">
                            <div style={{ color: macroColors.protein.light }}>{consumedProtein}g</div>
                            <div className="text-white/40">Protein</div>
                            <div className="text-white/30 text-[10px]">{protein - consumedProtein}g left</div>
                          </div>
                          <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-2">
                            <div style={{ color: macroColors.carbs.light }}>{consumedCarbs}g</div>
                            <div className="text-white/40">Carbs</div>
                            <div className="text-white/30 text-[10px]">{carbs - consumedCarbs}g left</div>
                          </div>
                          <div className="flex flex-col items-center bg-zinc-900/50 rounded-lg py-2">
                            <div style={{ color: macroColors.fat.light }}>{consumedFat}g</div>
                            <div className="text-white/40">Fat</div>
                            <div className="text-white/30 text-[10px]">{fat - consumedFat}g left</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-xs text-white/60 mb-1">Calories Consumed</div>
                          <div className="h-[8px] w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400 rounded-full" 
                              style={{ width: `${Math.min((totalConsumed / totalCalories) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-white/40 mt-1 text-right">
                            {totalCalories - totalConsumed} calories remaining
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
