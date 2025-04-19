"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FitnessCalculatorDiagram() {
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle>Scientific Calculation Process</CardTitle>
        <CardDescription>How we determine your personalized fitness plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* BMR Calculation */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">1. Basal Metabolic Rate (BMR)</h3>
            <p className="text-sm text-gray-400 mb-3">
              We calculate your BMR using the Mifflin-St Jeor Equation, which is scientifically validated to be more
              accurate than older formulas.
            </p>
            <div className="bg-gray-800 p-3 rounded-md text-sm text-emerald-400 font-mono">
              <p>For males: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
              <p>For females: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
            </div>
          </div>

          {/* TDEE Calculation */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">2. Total Daily Energy Expenditure (TDEE)</h3>
            <p className="text-sm text-gray-400 mb-3">
              Your TDEE is calculated by multiplying your BMR by an activity factor based on your exercise frequency and
              intensity.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div className="p-2 bg-gray-800 rounded-md">
                <p className="font-medium mb-1">Sedentary: × 1.2</p>
                <p>Little or no exercise</p>
              </div>
              <div className="p-2 bg-gray-800 rounded-md">
                <p className="font-medium mb-1">Light: × 1.375</p>
                <p>Light exercise 1-3 days/week</p>
              </div>
              <div className="p-2 bg-gray-800 rounded-md">
                <p className="font-medium mb-1">Moderate: × 1.55</p>
                <p>Moderate exercise 3-5 days/week</p>
              </div>
              <div className="p-2 bg-gray-800 rounded-md">
                <p className="font-medium mb-1">Active: × 1.725</p>
                <p>Heavy exercise 6-7 days/week</p>
              </div>
            </div>
          </div>

          {/* Caloric Adjustment */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">3. Goal-Based Caloric Adjustment</h3>
            <p className="text-sm text-gray-400 mb-3">
              We adjust your caloric intake based on your primary fitness goal:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Fat Loss:</span>
                <span className="text-emerald-400">TDEE - 500 calories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Muscle Gain:</span>
                <span className="text-emerald-400">TDEE + 300 calories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Maintenance:</span>
                <span className="text-emerald-400">TDEE + 0 calories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Athletic Performance:</span>
                <span className="text-emerald-400">TDEE + 200 calories</span>
              </div>
            </div>
          </div>

          {/* Macronutrient Distribution */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">4. Macronutrient Distribution</h3>
            <p className="text-sm text-gray-400 mb-3">
              Your macros are calculated based on your goal and body composition:
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white mb-1">Protein</p>
                <p className="text-xs text-gray-400">
                  1.6-2.2g per kg of bodyweight, adjusted for training experience and goals
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Carbohydrates & Fats</p>
                <p className="text-xs text-gray-400">
                  Distributed based on your goal, with higher carbs for performance and endurance, and balanced
                  distribution for general health
                </p>
              </div>
            </div>
          </div>

          {/* Workout Generation */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">5. Workout Plan Generation</h3>
            <p className="text-sm text-gray-400">
              Your workout plan is created based on your experience level, available equipment, time constraints, and
              fitness goals, following scientific principles of progressive overload and periodization.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
