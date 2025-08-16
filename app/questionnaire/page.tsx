"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormData {
  // Basic Information
  gender: string;
  age: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  fitnessGoal: string;
  fitnessGoalTarget: string;
  experienceLevel: string;
  exerciseFrequency: string;
  medicalConditions: string;
  medicalDetails: string;
  specificMedicalConditions: string[];
  bodyFatLevel: string;

  // Training Preferences
  workoutDays: string;
  workoutDuration: string;
  workoutLocation: string;
  homeEquipment: string[];
  workoutPreference: string;
  workoutTime: string;

  // Nutrition & Lifestyle
  diet: string;
  dietDetails: string;
  dietaryRestrictions: string;
  dietaryRestrictionsDetails: string[];
  mealsPerDay: string;
  sleepHours: string;
  stressLevel: string;
  occupationActivity: string;
}

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    gender: "",
    age: "25",
    height: "175",
    heightUnit: "cm",
    weight: "75",
    weightUnit: "kg",
    fitnessGoal: "",
    fitnessGoalTarget: "",
    experienceLevel: "",
    exerciseFrequency: "",
    medicalConditions: "no",
    medicalDetails: "",
    specificMedicalConditions: [],
    bodyFatLevel: "",

    // Training Preferences
    workoutDays: "",
    workoutDuration: "",
    workoutLocation: "",
    homeEquipment: [],
    workoutPreference: "",
    workoutTime: "",

    // Nutrition & Lifestyle
    diet: "",
    dietDetails: "",
    dietaryRestrictions: "no",
    dietaryRestrictionsDetails: [],
    mealsPerDay: "",
    sleepHours: "",
    stressLevel: "",
    occupationActivity: "",
  })

  // Define all the individual steps in the questionnaire flow
  const steps = [
    { id: "fitnessGoal", title: "What is your goal?", category: "Basic Info" },
    { id: "experienceLevel", title: "What is your experience level with lifting?", category: "Basic Info" },
    { id: "gender", title: "What is your gender?", category: "Basic Info" },
    { id: "age", title: "How old are you?", category: "Basic Info" },
    { id: "height", title: "What is your height?", category: "Basic Info" },
    { id: "weight", title: "What is your weight?", category: "Basic Info" },
    { id: "bodyFatLevel", title: "What is your body fat level?", category: "Basic Info" },
    { id: "exerciseFrequency", title: "How many days per week did you exercise on average in the past month?", category: "Basic Info" },
    { id: "medicalConditions", title: "Do you have any medical conditions?", category: "Basic Info" },
    { id: "workoutDays", title: "How many days per week can you commit to exercising?", category: "Training" },
    { id: "workoutDuration", title: "How much time per workout?", category: "Training" },
    { id: "workoutLocation", title: "Where will you work out?", category: "Training" },
    { id: "workoutPreference", title: "What type of workouts do you prefer?", category: "Training" },
    { id: "workoutTime", title: "When do you prefer to work out?", category: "Training" },
    { id: "diet", title: "Do you follow a specific diet?", category: "Nutrition" },
    { id: "dietaryRestrictions", title: "Do you have dietary restrictions?", category: "Nutrition" },
    { id: "mealsPerDay", title: "How many meals do you eat daily?", category: "Nutrition" },
    { id: "sleepHours", title: "How many hours do you sleep?", category: "Lifestyle" },
    { id: "stressLevel", title: "How would you rate your stress level?", category: "Lifestyle" },
    { id: "occupationActivity", title: "How active is your occupation?", category: "Lifestyle" },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  // Get the current step data
  const currentStepData = steps[currentStep];
  
  // Calculate what percentage of the questionnaire is complete
  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);
  
  // Progress to the next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      submitForm();
    }
  }

  // Go back to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }

  // Submit the questionnaire form and fetch personalized recommendations
  const submitForm = async () => {
    try {
      setIsSubmitting(true)

      // Prepare payload matching API expectations
      const payload = {
        gender: formData.gender,
        age: Number(formData.age),
        height: Number(formData.height),
        heightUnit: formData.heightUnit,
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit,
        fitnessGoal: formData.fitnessGoal,
        fitnessExperience: formData.experienceLevel,
        exerciseFrequency: formData.exerciseFrequency,
        workoutDays: formData.workoutDays,
        bodyFatLevel: formData.bodyFatLevel,
        workoutDuration: formData.workoutDuration,
        workoutLocation: formData.workoutLocation,
        workoutPreference: formData.workoutPreference,
        diet: formData.diet,
        sleepHours: formData.sleepHours,
        communicationStyle: "concise", // Default or collect from user if needed
        occupationActivity: formData.occupationActivity || undefined,
      }

      // Defensive: ensure required fields are present
      const missing = Object.entries(payload).filter(([k, v]) => {
        if (v === undefined || v === null || v === "") return true
        if (typeof v === "number") {
          // Treat non-positive numeric values as missing for critical fields
          if (["age", "height", "weight"].includes(k) && (isNaN(v) || v <= 0)) return true
          if (isNaN(v)) return true
        }
        return false
      })
      if (missing.length > 0) {
        alert(`Please complete all required fields: ${missing.map(([k]) => k).join(", ")}`)
        setIsSubmitting(false)
        return
      }

      // Additional domain validation to match server expectations (zod schema)
      const invalid: string[] = []
      if (!(payload.age >= 13 && payload.age <= 120)) invalid.push("age (must be 13-120)")
      if (!(payload.height > 0)) invalid.push("height (> 0)")
      if (!(payload.weight > 0)) invalid.push("weight (> 0)")
      if (!(payload.gender === "male" || payload.gender === "female")) invalid.push("gender (select 'male' or 'female')")
      const requiredStrings: (keyof typeof payload)[] = [
        "fitnessGoal",
        "fitnessExperience",
        "exerciseFrequency",
        "workoutDays",
        "workoutDuration",
        "workoutLocation",
        "workoutPreference",
        "diet",
        "sleepHours",
        "communicationStyle",
      ]
      requiredStrings.forEach((k) => {
        const val = String(payload[k] ?? "").trim()
        if (!val) invalid.push(String(k))
      })
      if (invalid.length > 0) {
        alert(`Please review these fields: ${invalid.join(", ")}`)
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/calculate-fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Server error: Unexpected response. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      if (!result.success) {
        const details = result?.details ? `\nDetails: ${JSON.stringify(result.details)}` : ""
        throw new Error((result.error || 'Calculation failed') + details)
      }

      // Save the calculated fitness data to localStorage
      localStorage.setItem("fitnessData", JSON.stringify(result.data))

      // Optional: handle versioning if needed
      const version = response.headers.get('X-Zentra-Calc-Ver')
      if (version) {
        localStorage.setItem("fitnessDataVersion", version)
      }

      router.push("/dashboard")
    } catch (error) {
      if (typeof window !== 'undefined' && error instanceof Event) {
        // Handle unhandled promise rejection events
        console.error('Unhandled rejection event:', error);
        alert('An unexpected error occurred. Please try again or refresh the page.');
      } else {
        console.error("Error submitting form:", error);
        alert((error as Error)?.message || "There was an error processing your information. Please try again.");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="px-4 py-6 text-center">
        <Link href="/" className="text-2xl font-light text-white">
          Zentra
        </Link>
      </nav>

      <div className="flex flex-col h-full max-w-lg mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-10 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPreviousStep} 
              className="flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              disabled={currentStep === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
              {currentStep > 0 && <span>Back</span>}
            </button>
            <div className="text-center flex-1">
              <h2 className="text-xl font-medium text-white tracking-tight">{steps[currentStep].category}</h2>
            </div>
            <div className="w-16"></div> {/* Spacer to balance the back button */}
          </div>
          <div className="w-full h-1 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-white mb-6 tracking-tight leading-tight">
            {currentStepData.title}
          </h1>

          {/* Fitness Goal Selection */}
          {currentStepData.id === "fitnessGoal" && (
            <div className="space-y-4">
              {[
                { 
                  value: "lose", 
                  label: "Lose Weight",
                  description: "Burn fat while preserving muscle mass"
                },
                { 
                  value: "maintain", 
                  label: "Maintain",
                  description: "Keep current weight while improving fitness"
                },
                { 
                  value: "gain", 
                  label: "Gain Muscle",
                  description: "Build strength and increase muscle mass"
                },
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => {
                    handleInputChange("fitnessGoal", goal.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-2xl backdrop-blur-sm transition-all duration-200 
                    ${formData.fitnessGoal === goal.value 
                      ? "border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-zinc-900/70 shadow-lg shadow-blue-900/10" 
                      : "border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight mb-1">{goal.label}</h3>
                      <p className="text-zinc-400 text-sm">{goal.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${formData.fitnessGoal === goal.value 
                        ? "bg-blue-500 text-white" 
                        : "bg-zinc-800 text-zinc-400"
                      }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Experience Level */}
          {currentStepData.id === "experienceLevel" && (
            <div className="space-y-4">
              {[
                { 
                  value: "none", 
                  label: "None",
                  description: "Currently not lifting."
                },
                { 
                  value: "beginner", 
                  label: "Beginner",
                  description: "Lifting for the past year or less."
                },
                { 
                  value: "intermediate", 
                  label: "Intermediate",
                  description: "Lifting for more than the past year, but less than 4 years."
                },
                { 
                  value: "advanced", 
                  label: "Advanced",
                  description: "Lifting for the past 4 years or more."
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("experienceLevel", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-2xl backdrop-blur-sm transition-all duration-200 
                    ${formData.experienceLevel === option.value 
                      ? "border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-zinc-900/70 shadow-lg shadow-blue-900/10" 
                      : "border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight mb-1">{option.label}</h3>
                      <p className="text-zinc-400 text-sm">{option.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${formData.experienceLevel === option.value 
                        ? "bg-blue-500 text-white" 
                        : "bg-zinc-800 text-zinc-400"
                      }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Gender Selection */}
          {currentStepData.id === "gender" && (
            <div className="space-y-4">
              {[{ value: "male", label: "Male" }, { value: "female", label: "Female" }].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("gender", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.gender === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{option.label}</h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center transition-all
                      ${formData.gender === option.value 
                        ? "bg-blue-500 text-white" 
                        : "bg-zinc-800 text-zinc-400"
                      }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Age Selection */}
          {currentStepData.id === "age" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold">{formData.age || "25"}</span>
                <span className="text-lg ml-2">years</span>
              </div>
              
              <div className="space-y-6">
                <input
                  type="range"
                  min="13"
                  max="80"
                  step="1"
                  value={formData.age || "25"}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>13</span>
                  <span>30</span>
                  <span>50</span>
                  <span>80</span>
                </div>
              </div>
              
              <Button 
                onClick={goToNextStep}
                className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-lg mt-8"
              >
                Next
              </Button>
            </div>
          )}

          {/* Height Input */}
          {currentStepData.id === "height" && (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="175"
                  className="text-4xl font-bold bg-transparent text-center w-24 border-b-2 border-green-500 focus:outline-none"
                />
                <Select value={formData.heightUnit} onValueChange={(value) => handleInputChange("heightUnit", value)}>
                  <SelectTrigger className="w-20 ml-2 bg-transparent border-none text-lg">
                    <SelectValue placeholder="cm" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border border-zinc-800">
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 mb-6">
                <p className="text-zinc-400 text-sm">Standard height ranges:</p>
                <ul className="text-sm text-zinc-500 mt-2 space-y-1">
                  <li>• Adult male: 160-190 cm (5'3" - 6'3")</li>
                  <li>• Adult female: 150-175 cm (4'11" - 5'9")</li>
                </ul>
              </div>
              
              <Button 
                onClick={goToNextStep}
                className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-lg"
              >
                Next
              </Button>
            </div>
          )}

          {/* Weight Input */}
          {currentStepData.id === "weight" && (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="75"
                  className="text-4xl font-bold bg-transparent text-center w-24 border-b-2 border-green-500 focus:outline-none"
                />
                <Select value={formData.weightUnit} onValueChange={(value) => handleInputChange("weightUnit", value)}>
                  <SelectTrigger className="w-20 ml-2 bg-transparent border-none text-lg">
                    <SelectValue placeholder="kg" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border border-zinc-800">
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={goToNextStep}
                className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-lg"
              >
                Next
              </Button>
            </div>
          )}

          {/* Body Fat Level Visual Selector */}
          {currentStepData.id === "bodyFatLevel" && (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm mb-4">
                Don’t worry about being too precise. A visual assessment is sufficient.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "3-4", label: "3–4%", img: "/images/3-4 (3).png" },
                  { value: "5-7", label: "5–7%", img: "/images/5-7 (3).png" },
                  { value: "8-12", label: "8–12%", img: "/images/8-12.png" },
                  { value: "13-17", label: "13–17%", img: "/images/13-17.png" },
                  { value: "18-23", label: "18–23%", img: "/images/18-23.png" },
                  { value: "24-29", label: "24–29%", img: "/images/24-29.png" },
                  { value: "30-34", label: "30–34%", img: "/images/30-34.png" },
                  { value: "35", label: "35–39%", img: "/images/35.png" },
                  { value: "40+", label: "40%+", img: "/images/40+.png" },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleInputChange("bodyFatLevel", option.value);
                      setTimeout(() => goToNextStep(), 120); // slight delay for visual feedback
                    }}
                    className={`rounded-xl border-2 p-2 flex flex-col items-center transition-all ${
                      formData.bodyFatLevel === option.value
                        ? "border-green-500 bg-zinc-900 ring-2 ring-green-400"
                        : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                    }`}
                  >
                    <img src={option.img} alt={option.label} className="w-20 h-20 object-contain mb-2" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Frequency */}
          {currentStepData.id === "exerciseFrequency" && (
            <div className="space-y-4">
              {[
                { value: "7 days", label: "7 days (daily)" },
                { value: "5-6 days", label: "5-6 days" },
                { value: "3-4 days", label: "3-4 days" },
                { value: "1-2 days", label: "1-2 days" },
                { value: "less than 1 day", label: "Less than 1 day" },
                { value: "0 days", label: "0 days (not at all)" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("exerciseFrequency", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.exerciseFrequency === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Medical Conditions */}
          {currentStepData.id === "medicalConditions" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    handleInputChange("medicalConditions", "no");
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.medicalConditions === "no" 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">No</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
                
                <div
                  className={`w-full p-6 rounded-xl border ${
                    formData.medicalConditions === "yes" 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Yes (please specify)</h3>
                    <div 
                      className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer"
                      onClick={() => handleInputChange("medicalConditions", "yes")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                  
                  {formData.medicalConditions === "yes" && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Please describe any injuries or medical conditions..."
                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg"
                        value={formData.medicalDetails}
                        onChange={(e) => handleInputChange("medicalDetails", e.target.value)}
                      />
                      
                      <Button 
                        onClick={goToNextStep}
                        className="w-full py-3 bg-white text-black hover:bg-white/90 rounded-lg"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Workout Days */}
          {currentStepData.id === "workoutDays" && (
            <div className="space-y-4">
              {[
                { value: "1 day", label: "1 day" },
                { value: "2 days", label: "2 days" },
                { value: "3 days", label: "3 days" },
                { value: "4 days", label: "4 days" },
                { value: "5 days", label: "5 days" },
                { value: "6 days", label: "6 days" },
                { value: "7 days", label: "7 days" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("workoutDays", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.workoutDays === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Workout Duration */}
          {currentStepData.id === "workoutDuration" && (
            <div className="space-y-4">
              {[
                { value: "under 30 minutes", label: "Under 30 minutes" },
                { value: "30-45 minutes", label: "30-45 minutes" },
                { value: "45-60 minutes", label: "45-60 minutes" },
                { value: "60+ minutes", label: "60+ minutes" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("workoutDuration", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.workoutDuration === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Workout Location */}
          {currentStepData.id === "workoutLocation" && (
            <div className="space-y-4">
              {[
                { value: "home with minimal equipment", label: "Home with minimal equipment" },
                { value: "home with basic equipment", label: "Home with basic equipment (dumbbells, etc.)" },
                { value: "gym with full equipment", label: "Gym with full equipment" },
                { value: "outdoors", label: "Outdoors" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("workoutLocation", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.workoutLocation === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Workout Preference */}
          {currentStepData.id === "workoutPreference" && (
            <div className="space-y-4">
              {[
                { value: "strength training", label: "Strength training" },
                { value: "cardio/endurance", label: "Cardio/endurance" },
                { value: "mixed workouts", label: "Mixed workouts" },
                { value: "hiit/interval training", label: "HIIT/interval training" },
                { value: "flexibility/mobility", label: "Flexibility/mobility" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("workoutPreference", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.workoutPreference === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Workout Time */}
          {currentStepData.id === "workoutTime" && (
            <div className="space-y-4">
              {[
                { value: "morning (6-8 am)", label: "Morning (6-8 am)" },
                { value: "afternoon (12-4 pm)", label: "Afternoon (12-4 pm)" },
                { value: "evening (5-8 pm)", label: "Evening (5-8 pm)" },
                { value: "late evening (9-11 pm)", label: "Late evening (9-11 pm)" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("workoutTime", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.workoutTime === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Diet */}
          {currentStepData.id === "diet" && (
            <div className="space-y-4">
              {[
                { 
                  value: "balanced", 
                  label: "Balanced",
                  description: "Standard distribution of carbs and fat."
                },
                { 
                  value: "low-fat", 
                  label: "Low-fat",
                  description: "Fat will be reduced to prioritize carb and protein intake."
                },
                { 
                  value: "low-carb", 
                  label: "Low-carb",
                  description: "Carbs will be reduced to prioritize fat and protein intake."
                },
                { 
                  value: "keto", 
                  label: "Keto",
                  description: "Carbs will be very restricted to allow for higher fat intake."
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("diet", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.diet === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{option.label}</h3>
                      <p className="text-zinc-400 text-sm">{option.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Dietary Restrictions */}
          {currentStepData.id === "dietaryRestrictions" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    handleInputChange("dietaryRestrictions", "no");
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.dietaryRestrictions === "no" 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">No</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
                
                <div
                  className={`w-full p-6 rounded-xl border ${
                    formData.dietaryRestrictions === "yes" 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Yes (please select)</h3>
                    <div 
                      className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer"
                      onClick={() => handleInputChange("dietaryRestrictions", "yes")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                  
                  {formData.dietaryRestrictions === "yes" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {[
                          "Gluten-free",
                          "Lactose-free",
                          "Vegan",
                          "Vegetarian",
                          "Low-carb",
                          "Low-fat",
                          "Other",
                        ].map((restriction) => (
                          <div key={restriction} className="flex items-center space-x-2 py-2">
                            <input
                              type="checkbox"
                              id={restriction.toLowerCase().replace(/\s+/g, "-")}
                              checked={formData.dietaryRestrictionsDetails.includes(restriction)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const updatedRestrictions = [...formData.dietaryRestrictionsDetails, restriction];
                                  setFormData(prev => ({
                                    ...prev,
                                    dietaryRestrictionsDetails: updatedRestrictions,
                                  }));
                                } else {
                                  const updatedRestrictions = formData.dietaryRestrictionsDetails.filter(
                                    (item) => item !== restriction
                                  );
                                  setFormData(prev => ({
                                    ...prev,
                                    dietaryRestrictionsDetails: updatedRestrictions,
                                  }));
                                }
                              }}
                              className="w-4 h-4 bg-zinc-800 border-zinc-700 text-green-500 focus:ring-0"
                            />
                            <label 
                              htmlFor={restriction.toLowerCase().replace(/\s+/g, "-")} 
                              className="text-white"
                            >
                              {restriction}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={goToNextStep}
                        className="w-full py-3 bg-white text-black hover:bg-white/90 rounded-lg"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Meals Per Day */}
          {currentStepData.id === "mealsPerDay" && (
            <div className="space-y-4">
              {[
                { value: "3 meals", label: "3 meals" },
                { value: "4 meals", label: "4 meals" },
                { value: "5 meals", label: "5 meals" },
                { value: "6+ meals", label: "6+ meals" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("mealsPerDay", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.mealsPerDay === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Sleep Hours */}
          {currentStepData.id === "sleepHours" && (
            <div className="space-y-4">
              {[
                { value: "less than 6 hours", label: "Less than 6 hours" },
                { value: "6-7 hours", label: "6-7 hours" },
                { value: "7-8 hours", label: "7-8 hours" },
                { value: "8+ hours", label: "8+ hours" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("sleepHours", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.sleepHours === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{option.label}</h3>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Stress Level */}
          {currentStepData.id === "stressLevel" && (
            <div className="space-y-4">
              {[
                { value: "low", label: "Low", description: "Minimal stress in daily life" },
                { value: "moderate", label: "Moderate", description: "Some stress but manageable" },
                { value: "high", label: "High", description: "Frequent or intense stress" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("stressLevel", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.stressLevel === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{option.label}</h3>
                      <p className="text-zinc-400 text-sm">{option.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Occupation Activity */}
          {currentStepData.id === "occupationActivity" && (
            <div className="space-y-4">
              {[
                { value: "sedentary", label: "Sedentary", description: "Little to no physical activity" },
                { value: "lightly-active", label: "Lightly active", description: "Light exercise/sports 1-3 days/week" },
                { value: "moderately-active", label: "Moderately active", description: "Moderate exercise/sports 3-5 days/week" },
                { value: "very-active", label: "Very active", description: "Hard exercise/sports 6-7 days a week" },
                { value: "extremely-active", label: "Extremely active", description: "Very hard exercise/sports & physical job or 2x training" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("occupationActivity", option.value);
                    goToNextStep();
                  }}
                  className={`w-full text-left p-6 rounded-xl border ${
                    formData.occupationActivity === option.value 
                      ? "border-green-500 bg-zinc-900" 
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                  } transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{option.label}</h3>
                      <p className="text-zinc-400 text-sm">{option.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* For other questions, we'll add placeholders for now */}
          {!["fitnessGoal", "gender", "age", "height", "weight", "exerciseFrequency", 
             "medicalConditions", "workoutDays", "workoutDuration", "workoutLocation",
             "workoutPreference", "workoutTime", "diet", "dietaryRestrictions", "mealsPerDay",
             "sleepHours", "stressLevel", "occupationActivity", "experienceLevel", "bodyFatLevel"].includes(currentStepData.id) && (
            <div className="space-y-6">
              <p className="text-zinc-400">This screen would contain the interface for: {currentStepData.title}</p>
              
              <Button 
                onClick={goToNextStep}
                className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-lg mt-8"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
