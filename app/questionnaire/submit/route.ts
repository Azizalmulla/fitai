import { type NextRequest, NextResponse } from "next/server"
import { calculateFitnessData } from "@/app/actions/fitness-actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Calculate fitness data using the server action
    const fitnessData = await calculateFitnessData(formData)

    if (!fitnessData) {
      return NextResponse.json({ success: false, error: "Failed to calculate fitness data" }, { status: 500 })
    }

    // In a real app, you would store this data in a database associated with the user
    // For now, we'll just return it to be stored in session/local storage on the client

    return NextResponse.json({
      success: true,
      data: fitnessData,
      redirectUrl: "/dashboard",
    })
  } catch (error) {
    console.error("Error processing questionnaire submission:", error)
    return NextResponse.json({ success: false, error: "Failed to process questionnaire" }, { status: 500 })
  }
}
