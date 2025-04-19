"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  Clock,
  Dumbbell,
  Flame,
  Home,
  LineChartIcon,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  User,
  Utensils,
  X,
  Calendar,
  BarChart3,
  Droplets,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import type { FitnessData } from "@/types/fitness"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AICoachContainer } from "@/components/chat/ai-coach-container"

// Add a mock data generator function to ensure we always have data to display
function generateMockFitnessData(): FitnessData {
  return {
    gender: "male",
    age: 30,
    height: 175,
    weight: 75,
    goal: "build_muscle",
    experienceLevel: "intermediate",
    bmr: 1700,
    tdee: 2550,
    targetCalories: 2850,
    macros: {
      protein: 213,
      carbs: 285,
      fat: 95,
    },
    waterNeeds: 3,
    workoutPlan: [
      {
        day: "Monday",
        focus: "Chest & Triceps",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: "70% 1RM" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "Medium" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", weight: "Light" },
          { name: "Tricep Pushdowns", sets: 3, reps: "10-12", weight: "Medium" },
          { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", weight: "Light" },
        ],
        completed: true,
      },
      {
        day: "Tuesday",
        focus: "Back & Biceps",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "Max", weight: "Bodyweight" },
          { name: "Bent Over Rows", sets: 3, reps: "8-10", weight: "Heavy" },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: "Medium" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", weight: "Medium" },
          { name: "Hammer Curls", sets: 3, reps: "12-15", weight: "Light" },
        ],
        completed: false,
      },
      {
        day: "Wednesday",
        focus: "Rest Day",
        exercises: [
          { name: "Light Cardio (Optional)", sets: 1, reps: "20-30 min", weight: "N/A" },
          { name: "Stretching", sets: 1, reps: "10-15 min", weight: "N/A" },
        ],
        completed: false,
      },
      {
        day: "Thursday",
        focus: "Legs & Core",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: "Heavy" },
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", weight: "Medium-Heavy" },
          { name: "Leg Press", sets: 3, reps: "10-12", weight: "Heavy" },
          { name: "Leg Curls", sets: 3, reps: "12-15", weight: "Medium" },
          { name: "Planks", sets: 3, reps: "30-60 sec", weight: "Bodyweight" },
        ],
        completed: false,
      },
      {
        day: "Friday",
        focus: "Shoulders & Arms",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "8-10", weight: "Heavy" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", weight: "Light" },
          { name: "Face Pulls", sets: 3, reps: "12-15", weight: "Light" },
          { name: "Superset: Bicep Curls & Tricep Extensions", sets: 3, reps: "10-12", weight: "Medium" },
        ],
        completed: false,
      },
      {
        day: "Saturday",
        focus: "Full Body & HIIT",
        exercises: [
          { name: "Deadlifts", sets: 3, reps: "6-8", weight: "Heavy" },
          { name: "Push-ups", sets: 3, reps: "Max", sets: 3, reps: "6-8", weight: "Heavy" },
          { name: "Push-ups", sets: 3, reps: "Max", weight: "Bodyweight" },
          { name: "Dumbbell Rows", sets: 3, reps: "10-12", weight: "Medium" },
          { name: "HIIT Circuit", sets: 3, reps: "4 min", weight: "Varied" },
        ],
        completed: false,
      },
      {
        day: "Sunday",
        focus: "Rest Day",
        exercises: [
          { name: "Active Recovery (Walking)", sets: 1, reps: "30-45 min", weight: "N/A" },
          { name: "Mobility Work", sets: 1, reps: "15-20 min", weight: "N/A" },
        ],
        completed: false,
      },
    ],
    mealFrequency: 4,
    mealPlan: [
      {
        meal: "Breakfast",
        calories: 650,
        protein: 40,
        carbs: 70,
        fat: 20,
      },
      {
        meal: "Lunch",
        calories: 750,
        protein: 50,
        carbs: 80,
        fat: 25,
      },
      {
        meal: "Dinner",
        calories: 850,
        protein: 55,
        carbs: 90,
        fat: 30,
      },
      {
        meal: "Snack",
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 10,
      },
    ],
    nutrientTiming: {
      preworkout: "Consume 20-30g of protein and 30-40g of carbs 1-2 hours before workout",
      postworkout: "Consume 30-40g of protein and 40-50g of carbs within 30-60 minutes after workout",
      general: "Spread protein intake evenly throughout the day",
    },
    foodRecommendations: {
      proteins: ["Chicken breast", "Turkey", "Lean beef", "Fish", "Eggs", "Greek yogurt", "Whey protein"],
      carbs: ["Brown rice", "Sweet potatoes", "Quinoa", "Oats", "Whole grain bread", "Fruits"],
      fats: ["Avocado", "Nuts", "Olive oil", "Nut butters", "Fatty fish"],
      vegetables: ["Broccoli", "Spinach", "Kale", "Bell peppers", "Carrots"],
    },
  }
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fitnessData, setFitnessData] = useState<FitnessData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMobile()
  const today = new Date()
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" })

  // Update the useEffect to use the mock data if nothing is in localStorage
  useEffect(() => {
    // Try to get fitness data from localStorage
    const storedData = localStorage.getItem("fitnessData")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setFitnessData(parsedData)
      } catch (error) {
        console.error("Error parsing fitness data:", error)
        // Use mock data if there's an error parsing
        setFitnessData(generateMockFitnessData())
      }
    } else {
      // Use mock data if nothing in localStorage
      setFitnessData(generateMockFitnessData())
    }

    setIsLoading(false)
  }, [])

  // If no data is available, show loading or redirect to questionnaire
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-gray-300">Loading your fitness data...</p>
        </div>
      </div>
    )
  }

  if (!fitnessData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="max-w-md bg-black border-white/10">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-center">No Fitness Data Found</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Please complete the questionnaire to generate your personalized fitness plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/questionnaire">
              <Button className="bg-white text-black hover:bg-white/90">Go to Questionnaire</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Find today's workout
  const todaysWorkout = fitnessData?.workoutPlan?.find((workout) => workout.day === dayOfWeek) || null

  // Calculate macro percentages
  const totalMacroTarget =
    (fitnessData?.macros?.protein || 0) + (fitnessData?.macros?.carbs || 0) + (fitnessData?.macros?.fat || 0)
  const proteinPercentage =
    totalMacroTarget > 0 ? Math.round(((fitnessData?.macros?.protein || 0) / totalMacroTarget) * 100) : 0
  const carbsPercentage =
    totalMacroTarget > 0 ? Math.round(((fitnessData?.macros?.carbs || 0) / totalMacroTarget) * 100) : 0
  const fatPercentage =
    totalMacroTarget > 0 ? Math.round(((fitnessData?.macros?.fat || 0) / totalMacroTarget) * 100) : 0

  // Mock consumed values (in a real app, these would come from user tracking)
  const consumedCalories = Math.round(fitnessData.targetCalories * 0.5) // 50% of target for demo
  const consumedProtein = Math.round(fitnessData.macros.protein * 0.45) // 45% of target for demo
  const consumedCarbs = Math.round(fitnessData.macros.carbs * 0.5) // 50% of target for demo
  const consumedFat = Math.round(fitnessData.macros.fat * 0.55) // 55% of target for demo
  const consumedWater = Math.round(fitnessData.waterNeeds * 0.4) // 40% of target for demo
  const caloriesBurned = 320 // Mock value

  // Calculate progress percentages
  const caloriePercentage = Math.round((consumedCalories / fitnessData.targetCalories) * 100)
  const proteinProgress = Math.round((consumedProtein / fitnessData.macros.protein) * 100)
  const carbsProgress = Math.round((consumedCarbs / fitnessData.macros.carbs) * 100)
  const fatProgress = Math.round((consumedFat / fitnessData.macros.fat) * 100)
  const waterProgress = Math.round((consumedWater / fitnessData.waterNeeds) * 100)

  // Mock progress data
  const progressData = {
    weight: [
      fitnessData.weight + 0.5,
      fitnessData.weight + 0.3,
      fitnessData.weight,
      fitnessData.weight - 0.2,
      fitnessData.weight - 0.5,
      fitnessData.weight - 0.7,
      fitnessData.weight - 1.0,
    ],
    bodyFat: [18, 17.8, 17.5, 17.3, 17.0, 16.8, 16.5], // Mock body fat percentages
    dates: ["Apr 12", "Apr 14", "Apr 16", "Apr 18", "Apr 20", "Apr 22", "Apr 24"],
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transition-transform duration-300 ease-in-out transform",
          isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
        )}
      >
        <div className="p-4 flex items-center space-x-2 border-b border-white/10">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="text-xl font-bold">FitAI</span>
          {isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
            <Avatar>
              <AvatarFallback className="bg-white/10 text-white">
                {fitnessData.gender === "male" ? "M" : "F"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">User</p>
              <Badge variant="outline" className="text-xs font-normal border-white/20">
                {fitnessData.goal.charAt(0).toUpperCase() + fitnessData.goal.slice(1).replace("_", " ")}
              </Badge>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { icon: <Home className="h-5 w-5" />, label: "Dashboard", active: true },
              { icon: <Activity className="h-5 w-5" />, label: "Workouts", active: false },
              { icon: <Utensils className="h-5 w-5" />, label: "Nutrition", active: false },
              { icon: <LineChartIcon className="h-5 w-5" />, label: "Progress", active: false },
              { icon: <MessageSquare className="h-5 w-5" />, label: "AI Coach", active: false },
              { icon: <Settings className="h-5 w-5" />, label: "Settings", active: false },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  item.active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", isMobile ? "ml-0" : "ml-64")}>
        {/* Top Navigation */}
        <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-5 w-5 text-gray-400" />
              </Button>
            )}
            <h1 className={cn("text-xl font-bold", isMobile ? "ml-3" : "")}>Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Welcome to your fitness dashboard
            </h2>
            <p className="text-gray-400">
              Here's your personalized fitness plan for{" "}
              {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <Flame className="h-5 w-5 text-white" />,
                label: "Daily Calories",
                value: fitnessData.targetCalories,
                unit: "kcal",
              },
              {
                icon: <Activity className="h-5 w-5 text-white" />,
                label: "Calories Burned",
                value: caloriesBurned,
                unit: "kcal",
              },
              {
                icon: <Dumbbell className="h-5 w-5 text-white" />,
                label: "Protein Target",
                value: fitnessData.macros.protein,
                unit: "g",
              },
              {
                icon: <Clock className="h-5 w-5 text-white" />,
                label: "Next Workout",
                value: todaysWorkout ? todaysWorkout.focus : "Rest Day",
                unit: "",
              },
            ].map((card, index) => (
              <Card key={index} className="bg-black border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 p-2 rounded-lg">{card.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value} {card.unit}
                  </div>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="nutrition" className="mb-8">
            <TabsList className="bg-black border border-white/10">
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
            </TabsList>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calorie Card */}
                <Card className="bg-black border-white/10 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Daily Nutrition</CardTitle>
                    <CardDescription className="text-gray-400">
                      Your calorie and macro targets based on your goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Calories Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Calories</span>
                          <span className="text-sm font-medium text-white">
                            {consumedCalories} / {fitnessData.targetCalories} kcal
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${caloriePercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Macros Progress */}
                      <div className="space-y-4">
                        {/* Protein */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Protein ({proteinPercentage}%)</span>
                            <span className="text-sm font-medium text-white">
                              {consumedProtein} / {fitnessData.macros.protein} g
                            </span>
                          </div>
                          <Progress value={proteinProgress} className="h-2 bg-white/10" indicatorColor="bg-white" />
                        </div>

                        {/* Carbs */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Carbs ({carbsPercentage}%)</span>
                            <span className="text-sm font-medium text-white">
                              {consumedCarbs} / {fitnessData.macros.carbs} g
                            </span>
                          </div>
                          <Progress value={carbsProgress} className="h-2 bg-white/10" indicatorColor="bg-white" />
                        </div>

                        {/* Fat */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Fat ({fatPercentage}%)</span>
                            <span className="text-sm font-medium text-white">
                              {consumedFat} / {fitnessData.macros.fat} g
                            </span>
                          </div>
                          <Progress value={fatProgress} className="h-2 bg-white/10" indicatorColor="bg-white" />
                        </div>

                        {/* Water */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Water</span>
                            <span className="text-sm font-medium text-white">
                              {consumedWater} / {fitnessData.waterNeeds} L
                            </span>
                          </div>
                          <Progress value={waterProgress} className="h-2 bg-white/10" indicatorColor="bg-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Water Card */}
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-5 w-5 text-white" />
                      <CardTitle>Water Intake</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Stay hydrated to optimize performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Daily Intake</span>
                        <span className="text-sm font-medium text-white">
                          {consumedWater} / {fitnessData.waterNeeds} L
                        </span>
                      </div>
                      <Progress value={waterProgress} className="h-2 bg-white/10" indicatorColor="bg-white" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training">
              {todaysWorkout ? (
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-white" />
                      <CardTitle>Today's Workout: {todaysWorkout.focus}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Focus: {todaysWorkout.focus}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-white/10">
                      {todaysWorkout.exercises.map((exercise, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-white mr-3"></div>
                            <span>{exercise.name}</span>
                          </div>
                          <span className="text-gray-400">
                            {exercise.sets} sets x {exercise.reps}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-white text-black hover:bg-white/90">Start Workout</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle>Rest Day</CardTitle>
                    <CardDescription className="text-gray-400">Enjoy your day off!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      No workout scheduled for today. Take this time to recover and recharge.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      View Recovery Tips
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-white" />
                      <CardTitle>Weight Progress</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Track your weight over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent data={progressData} dataKey="weight" color="rgb(255,255,255)" />
                  </CardContent>
                </Card>
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-white" />
                      <CardTitle>Body Fat Progress</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">
                      Track your body fat percentage over the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent data={progressData} dataKey="bodyFat" color="rgb(255,255,255)" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Coach Tab */}
            <TabsContent value="ai-coach" className="h-[600px]">
              <AICoachContainer />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

interface LineChartComponentProps {
  data: any
  dataKey: string
  color: string
}

const LineChartComponent = ({ data, dataKey, color }: LineChartComponentProps) => {
  if (!data || !data.weight || !data.bodyFat || !data.dates) {
    return <div className="h-[300px] flex items-center justify-center text-gray-400">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data.weight.map((weight: number, index: number) => ({
          weight,
          bodyFat: data.bodyFat[index],
          date: data.dates[index],
        }))}
      >
        <XAxis dataKey="date" stroke="#888888" />
        <YAxis stroke="#888888" />
        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
        <Tooltip contentStyle={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.1)" }} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
