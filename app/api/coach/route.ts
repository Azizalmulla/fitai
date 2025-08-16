import { NextResponse } from "next/server";
import { searchPubMed, generateResearchSummary } from "@/lib/pubmed";

// Force Node.js runtime for this route to allow native OpenAI package usage
export const runtime = "nodejs";

export async function POST(request: Request) {
  // Hardcoded API key
  const apiKey = "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";
  // Dynamically import OpenAI to avoid bundler issues
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey });
  try {
    const { messages, fitnessData } = await request.json();
    const formatted = messages.map((m: any) => ({ role: m.role, content: m.content }));
    
    // Get the latest user message to search for relevant research
    const userMessage = messages.findLast((m: any) => m.role === "user")?.content || "";
    
    // Add a system message if not already present
    if (!formatted.some((m: {role: string}) => m.role === "system")) {
      // Create personalized system message incorporating user fitness data if available
      let systemContent = `You are FitAI, an expert fitness coach with specialized knowledge in exercise physiology, sports nutrition, and evidence-based training methodologies.`;
      
      // Add user's fitness profile if available
      if (fitnessData) {
        systemContent += `\n\nUSER FITNESS PROFILE:`;
        
        if (fitnessData.gender) systemContent += `\n- Gender: ${fitnessData.gender}`;
        if (fitnessData.age) systemContent += `\n- Age: ${fitnessData.age} years`;
        if (fitnessData.height) systemContent += `\n- Height: ${fitnessData.height} ${fitnessData.heightUnit || 'cm'}`;
        if (fitnessData.weight) systemContent += `\n- Weight: ${fitnessData.weight} ${fitnessData.weightUnit || 'kg'}`;
        if (fitnessData.fitnessGoal) systemContent += `\n- Fitness Goal: ${fitnessData.fitnessGoal}`;
        if (fitnessData.fitnessGoalTarget) systemContent += `\n- Target: ${fitnessData.fitnessGoalTarget}`;
        if (fitnessData.exerciseFrequency) systemContent += `\n- Recent Exercise Frequency: ${fitnessData.exerciseFrequency}`;
        
        // Medical conditions
        if (fitnessData.medicalConditions === "yes") {
          systemContent += `\n- Medical Conditions: ${fitnessData.medicalDetails || 'Yes'}`;
          if (fitnessData.specificMedicalConditions && fitnessData.specificMedicalConditions.length > 0) {
            systemContent += `\n  - Specific conditions: ${fitnessData.specificMedicalConditions.join(', ')}`;
          }
        }
        
        // Training preferences
        systemContent += `\n\nTRAINING PREFERENCES:`;
        if (fitnessData.daysPerWeek) systemContent += `\n- Workout Frequency: ${fitnessData.daysPerWeek}`;
        if (fitnessData.workoutDuration) systemContent += `\n- Workout Duration: ${fitnessData.workoutDuration}`;
        if (fitnessData.workoutLocation) systemContent += `\n- Workout Location: ${fitnessData.workoutLocation}`;
        if (fitnessData.workoutPreference) systemContent += `\n- Workout Type: ${fitnessData.workoutPreference}`;
        if (fitnessData.workoutTime) systemContent += `\n- Preferred Time: ${fitnessData.workoutTime}`;
        
        // Home equipment if applicable
        if (fitnessData.homeEquipment && fitnessData.homeEquipment.length > 0) {
          systemContent += `\n- Available Equipment: ${fitnessData.homeEquipment.join(', ')}`;
        }
        
        // Nutrition & lifestyle
        systemContent += `\n\nNUTRITION & LIFESTYLE:`;
        if (fitnessData.diet) systemContent += `\n- Diet Type: ${fitnessData.diet}`;
        if (fitnessData.dietDetails) systemContent += `\n  - Diet Details: ${fitnessData.dietDetails}`;
        
        // Dietary restrictions
        if (fitnessData.dietaryRestrictions === "yes" && fitnessData.dietaryRestrictionsDetails && fitnessData.dietaryRestrictionsDetails.length > 0) {
          systemContent += `\n- Dietary Restrictions: ${fitnessData.dietaryRestrictionsDetails.join(', ')}`;
        }
        
        if (fitnessData.mealsPerDay) systemContent += `\n- Meals Per Day: ${fitnessData.mealsPerDay}`;
        if (fitnessData.proteinIntake) systemContent += `\n- Protein Intake: ${fitnessData.proteinIntake}`;
        if (fitnessData.sleepHours) systemContent += `\n- Sleep: ${fitnessData.sleepHours}`;
        if (fitnessData.stressLevel) systemContent += `\n- Stress Level: ${fitnessData.stressLevel}`;
        if (fitnessData.occupationActivity) systemContent += `\n- Occupation Activity: ${fitnessData.occupationActivity}`;
        
        // Calculated data from the fitness calculator
        if (fitnessData.bmr) systemContent += `\n\nCALCULATED METRICS:`;
        if (fitnessData.bmr) systemContent += `\n- BMR: ${fitnessData.bmr} calories/day`;
        if (fitnessData.tdee) systemContent += `\n- TDEE: ${fitnessData.tdee} calories/day`;
        if (fitnessData.macros) {
          systemContent += `\n- Recommended Macros:`;
          systemContent += `\n  - Protein: ${fitnessData.macros.protein}g`;
          systemContent += `\n  - Carbs: ${fitnessData.macros.carbs}g`;
          systemContent += `\n  - Fat: ${fitnessData.macros.fat}g`;
        }
      }
      
      systemContent += `\n\nCORE PRINCIPLES:
1. All advice must be based on peer-reviewed scientific research.
2. Acknowledge limitations in current research where appropriate.
3. Prioritize established scientific consensus over emerging or controversial findings.
4. Consider individual differences in responses to exercise and nutrition.
5. Safety is paramount - err on the side of caution with recommendations.

COMMUNICATION STYLE:
- Present information in a clear, accessible manner while maintaining scientific accuracy.
- Explain the mechanisms behind recommendations when relevant.
- Cite specific studies or research reviews when available.
- Use precise terminology for exercises, nutritional concepts, and physiological processes.
- Acknowledge when questions fall outside the scope of current scientific understanding.

AREAS OF EXPERTISE:
- Resistance training principles, programming, and progression models
- Cardiovascular training zones and adaptations
- Nutritional requirements for performance and body composition
- Recovery strategies based on physiological mechanisms
- Evidence-based approaches to mobility and flexibility
- Age-appropriate training modifications

IMPORTANT COACHING GUIDELINES:
- Don't ask the user for information that is already provided in their profile.
- Tailor your advice specifically to their profile, goals, and preferences.
- Reference their specific data (calories, macros, etc.) when giving nutrition advice.
- Consider their equipment access, location preferences, and time constraints when recommending workouts.
- Acknowledge their medical conditions and provide appropriate modifications if needed.

The user relies on you for scientifically sound guidance that aligns with current research consensus.`;

      formatted.unshift({
        role: "system",
        content: systemContent
      });
    }
    
    // Search PubMed for relevant scientific research
    const pubmedResults = await searchPubMed(userMessage, 3);
    
    if (pubmedResults.length > 0) {
      // Add research findings to the messages
      const researchSummary = generateResearchSummary(pubmedResults);
      formatted.push({
        role: "system",
        content: `Incorporate these relevant scientific findings into your response. Be concise but factual. Don't list all these references explicitly unless directly asked, but use the information to provide evidence-based advice:\n\n${researchSummary}`
      });
    }

    const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: formatted });
    const assist = completion.choices[0].message;
    return NextResponse.json({ content: assist?.content ?? "" });
  } catch (error) {
    console.error("[API] GPT error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ content: msg }, { status: 500 });
  }
}
