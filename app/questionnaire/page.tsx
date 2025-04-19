"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    gender: "",
    age: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    fitnessGoal: "",
    fitnessExperience: "",
    medicalConditions: "no",
    medicalDetails: "",

    // Training Preferences
    daysPerWeek: "",
    workoutDuration: "",
    workoutLocation: "",
    workoutPreference: "",

    // Nutrition & Lifestyle
    diet: "",
    dietDetails: "",
    proteinIntake: "",
    sleepHours: "",
    communicationStyle: "",
  })

  const steps = [
    { name: "Basic Info", description: "Personal details" },
    { name: "Training", description: "Exercise preferences" },
    { name: "Nutrition & Lifestyle", description: "Diet and habits" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      submitForm()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const submitForm = async () => {
    try {
      setIsSubmitting(true)

      // For now, just redirect to dashboard with mock data
      // In a real implementation, you would send this data to your backend
      localStorage.setItem(
        "fitnessData",
        JSON.stringify({
          bmr: 1800,
          tdee: 2500,
          macros: {
            protein: 180,
            carbs: 250,
            fat: 80,
          },
          // Add other calculated data here
        }),
      )

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error processing your information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate age options from 13 to 80
  const ageOptions = Array.from({ length: 68 }, (_, i) => i + 13)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
            FitAI
          </span>
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10",
                    currentStep >= index
                      ? "bg-emerald-500 border-emerald-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400",
                  )}
                >
                  {currentStep > index ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-center mt-2">
                  <div className={cn("font-medium", currentStep >= index ? "text-white" : "text-gray-500")}>
                    {step.name}
                  </div>
                  <div className={cn("text-xs", currentStep >= index ? "text-gray-300" : "text-gray-600")}>
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-10 w-[calc(100%-2.5rem)] h-0.5",
                      currentStep > index ? "bg-emerald-500" : "bg-gray-700",
                    )}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
          <div className="space-y-8">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-1">
                    Basic Information
                  </h2>
                  <p className="text-gray-400">Tell us about yourself so we can personalize your plan.</p>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">What is your gender?</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-gray-300">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-gray-300">
                        Female
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Age, Height, Weight */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">What is your age, height, and weight?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age" className="text-gray-400 text-sm">
                        Age
                      </Label>
                      <Select value={formData.age} onValueChange={(value) => handleInputChange("age", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {ageOptions.map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-gray-400 text-sm">
                        Height
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="height"
                          type="number"
                          placeholder="Height"
                          className="bg-gray-800 border-gray-700"
                          value={formData.height}
                          onChange={(e) => handleInputChange("height", e.target.value)}
                        />
                        <Select
                          value={formData.heightUnit}
                          onValueChange={(value) => handleInputChange("heightUnit", value)}
                        >
                          <SelectTrigger className="w-20 bg-gray-800 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-gray-400 text-sm">
                        Weight
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Weight"
                          className="bg-gray-800 border-gray-700"
                          value={formData.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                        />
                        <Select
                          value={formData.weightUnit}
                          onValueChange={(value) => handleInputChange("weightUnit", value)}
                        >
                          <SelectTrigger className="w-20 bg-gray-800 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitness Goal */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">What is your primary fitness goal?</Label>
                  <RadioGroup
                    value={formData.fitnessGoal}
                    onValueChange={(value) => handleInputChange("fitnessGoal", value)}
                    className="flex flex-col space-y-2"
                  >
                    {["Lose fat", "Build muscle", "Improve endurance", "Overall health", "Athletic performance"].map(
                      (goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <RadioGroupItem value={goal.toLowerCase()} id={goal.toLowerCase().replace(/\s+/g, "-")} />
                          <Label htmlFor={goal.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                            {goal}
                          </Label>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                </div>

                {/* Fitness Experience */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How would you describe your fitness experience?</Label>
                  <RadioGroup
                    value={formData.fitnessExperience}
                    onValueChange={(value) => handleInputChange("fitnessExperience", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="text-gray-300">
                        Beginner (little to no exercise experience)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="text-gray-300">
                        Intermediate (some consistent exercise)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="text-gray-300">
                        Advanced (regular training for 1+ years)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Medical Conditions */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">
                    Do you have any injuries or medical conditions we should know about?
                  </Label>
                  <RadioGroup
                    value={formData.medicalConditions}
                    onValueChange={(value) => handleInputChange("medicalConditions", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-medical" />
                      <Label htmlFor="no-medical" className="text-gray-300">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-medical" />
                      <Label htmlFor="yes-medical" className="text-gray-300">
                        Yes (please specify)
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.medicalConditions === "yes" && (
                    <Textarea
                      placeholder="Please describe any injuries or medical conditions..."
                      className="mt-2 bg-gray-800 border-gray-700"
                      value={formData.medicalDetails}
                      onChange={(e) => handleInputChange("medicalDetails", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Training Preferences */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-1">
                    Training Preferences
                  </h2>
                  <p className="text-gray-400">Tell us how you prefer to train so we can design your ideal program.</p>
                </div>

                {/* Days Per Week */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How many days per week can you exercise?</Label>
                  <RadioGroup
                    value={formData.daysPerWeek}
                    onValueChange={(value) => handleInputChange("daysPerWeek", value)}
                    className="flex flex-col space-y-2"
                  >
                    {["2-3 days", "4-5 days", "6+ days"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Workout Duration */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How much time can you dedicate to each workout?</Label>
                  <RadioGroup
                    value={formData.workoutDuration}
                    onValueChange={(value) => handleInputChange("workoutDuration", value)}
                    className="flex flex-col space-y-2"
                  >
                    {["Under 30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Workout Location */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">Where will you primarily work out?</Label>
                  <RadioGroup
                    value={formData.workoutLocation}
                    onValueChange={(value) => handleInputChange("workoutLocation", value)}
                    className="flex flex-col space-y-2"
                  >
                    {[
                      "Home with minimal equipment",
                      "Home with basic equipment (dumbbells, etc.)",
                      "Gym with full equipment",
                      "Outdoors",
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Workout Preference */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">What type of workouts do you prefer?</Label>
                  <RadioGroup
                    value={formData.workoutPreference}
                    onValueChange={(value) => handleInputChange("workoutPreference", value)}
                    className="flex flex-col space-y-2"
                  >
                    {[
                      "Strength training",
                      "Cardio/endurance",
                      "Mixed workouts",
                      "HIIT/interval training",
                      "Flexibility/mobility",
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Nutrition & Lifestyle */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-1">
                    Nutrition & Lifestyle
                  </h2>
                  <p className="text-gray-400">Help us understand your diet and lifestyle habits.</p>
                </div>

                {/* Diet */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">Do you follow any specific diet?</Label>
                  <RadioGroup
                    value={formData.diet}
                    onValueChange={(value) => handleInputChange("diet", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-specific-diet" id="no-specific-diet" />
                      <Label htmlFor="no-specific-diet" className="text-gray-300">
                        No specific diet
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian-vegan" id="vegetarian-vegan" />
                      <Label htmlFor="vegetarian-vegan" className="text-gray-300">
                        Vegetarian/Vegan
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low-carb-keto" id="low-carb-keto" />
                      <Label htmlFor="low-carb-keto" className="text-gray-300">
                        Low-carb/Keto
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other-diet" />
                      <Label htmlFor="other-diet" className="text-gray-300">
                        Other (please specify)
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.diet === "other" && (
                    <Textarea
                      placeholder="Please describe your diet..."
                      className="mt-2 bg-gray-800 border-gray-700"
                      value={formData.dietDetails}
                      onChange={(e) => handleInputChange("dietDetails", e.target.value)}
                    />
                  )}
                </div>

                {/* Protein Intake */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How would you rate your protein intake?</Label>
                  <RadioGroup
                    value={formData.proteinIntake}
                    onValueChange={(value) => handleInputChange("proteinIntake", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low-protein" />
                      <Label htmlFor="low-protein" className="text-gray-300">
                        Low (rarely focus on protein)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate-protein" />
                      <Label htmlFor="moderate-protein" className="text-gray-300">
                        Moderate (some protein-rich foods)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high-protein" />
                      <Label htmlFor="high-protein" className="text-gray-300">
                        High (prioritize protein in most meals)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Sleep Hours */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How many hours do you typically sleep?</Label>
                  <RadioGroup
                    value={formData.sleepHours}
                    onValueChange={(value) => handleInputChange("sleepHours", value)}
                    className="flex flex-col space-y-2"
                  >
                    {["Less than 6 hours", "6-7 hours", "7-8 hours", "8+ hours"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Communication Style */}
                <div className="space-y-3">
                  <Label className="text-gray-200 text-base">How would you prefer your AI coach to communicate?</Label>
                  <RadioGroup
                    value={formData.communicationStyle}
                    onValueChange={(value) => handleInputChange("communicationStyle", value)}
                    className="flex flex-col space-y-2"
                  >
                    {[
                      "Detailed with scientific explanations",
                      "Balanced information and motivation",
                      "Just tell me what to do",
                      "Motivational and supportive",
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase().replace(/\s+/g, "-")} />
                        <Label htmlFor={option.toLowerCase().replace(/\s+/g, "-")} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
