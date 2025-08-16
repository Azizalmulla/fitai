'use client';

import * as React from 'react';
import { useState } from 'react';
import { z } from 'zod';

// Optional client-side Zod schema (mirrors backend schema)
const FitnessSchema = z.object({
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

// Sample data for testing
const samplePayload = {
  goal: "lose" as const,
  currentExerciseDays: 3,
  sessionDuration: "45-60" as const,
  equipment: "home-basic" as const,
  commitDays: 3,
  medical: "none",
  weightKg: 75,
  heightCm: 175,
  ageY: 25,
  gender: "male" as const,
  workoutPref: "strength" as const,
  workoutTime: "morning" as const,
  occupationActivity: "light" as const,
  stress: "moderate" as const,
  sleepH: "6-7" as const,
  mealsPerDay: 3 as const,
  dietaryRestrictions: "none",
  dietType: "none" as const
};

// Response type definition
type FitnessResponse = {
  success: boolean;
  data: {
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
    bmr: number;
    tdee: number;
    workoutPlan: any[]; // Typed for frontend compatibility
  };
};

export default function FitnessCalculatorDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FitnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchFitnessPlan() {
    setLoading(true);
    setError(null);
    
    try {
      // Optional: Client-side validation
      FitnessSchema.parse(samplePayload);
      
      const res = await fetch("/api/calculate-fitness/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload)
      });
      
      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }
      
      const data = await res.json() as FitnessResponse;
      setResult(data);
      
      // Check if the version header is present
      const version = res.headers.get('X-Zentra-Calc-Ver');
      console.log("Calculation engine version:", version);
      
    } catch (err) {
      console.error("Error fetching fitness plan:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fitness Calculator V2 Demo</h1>
      
      <button
        onClick={fetchFitnessPlan}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Fitness Plan'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {result && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Nutrition Plan</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-white/70">Daily Calories:</span>
                  <span className="font-medium float-right">{result.data.calTarget} kcal</span>
                </div>
                <div>
                  <span className="text-white/70">BMR:</span>
                  <span className="font-medium float-right">{result.data.bmr} kcal</span>
                </div>
                <div>
                  <span className="text-white/70">TDEE:</span>
                  <span className="font-medium float-right">{result.data.tdee} kcal</span>
                </div>
                <div className="pt-2">
                  <span className="text-white/70">Protein:</span>
                  <span className="font-medium float-right">{result.data.macros.protein_g}g</span>
                </div>
                <div>
                  <span className="text-white/70">Carbs:</span>
                  <span className="font-medium float-right">{result.data.macros.carbs_g}g</span>
                </div>
                <div>
                  <span className="text-white/70">Fat:</span>
                  <span className="font-medium float-right">{result.data.macros.fat_g}g</span>
                </div>
                <div className="pt-2">
                  <span className="text-white/70">Daily Hydration:</span>
                  <span className="font-medium float-right">{result.data.hydrationMl} ml</span>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Training Plan</h2>
              <div>
                <span className="text-white/70">Split Type:</span>
                <span className="font-medium float-right">{result.data.split}</span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Weekly Sessions</h3>
                <div className="space-y-2">
                  {result.data.weeklySessions.map((session, idx) => (
                    <div key={idx} className="bg-zinc-800/40 rounded-xl p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{session.day}</span>
                        <span className="text-white/70">{session.durationMin} min</span>
                      </div>
                      <div className="text-white/80 text-sm">{session.focus}</div>
                      <div className="text-white/60 text-xs mt-1">{session.sets} sets</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recovery & Health</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Recovery Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.data.recoveryTips.map((tip, idx) => (
                    <li key={idx} className="text-white/80">{tip}</li>
                  ))}
                </ul>
              </div>
              
              {result.data.flags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Health Flags</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.data.flags.map((flag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-amber-600/30 text-amber-200 rounded-full text-xs">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
            <pre className="bg-zinc-800/50 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
