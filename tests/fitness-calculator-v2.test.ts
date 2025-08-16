import { calculateFitnessProgram, validateInputs, OnboardingInput } from '../lib/fitness-calculator-v2';

describe('Fitness Calculator V2', () => {
  // Standard valid test case
  const standardInput: OnboardingInput = {
    goal: "lose",
    currentExerciseDays: 3,
    sessionDuration: "45-60",
    equipment: "home-basic",
    commitDays: 3,
    medical: "none",
    weightKg: 75,
    heightCm: 175,
    ageY: 25,
    gender: "male",
    workoutPref: "strength",
    workoutTime: "morning",
    occupationActivity: "light",
    stress: "moderate",
    sleepH: "6-7",
    mealsPerDay: 3,
    dietaryRestrictions: "none",
    dietType: "none"
  };

  // Test standard valid input
  test('should calculate valid fitness program for standard input', () => {
    const result = calculateFitnessProgram(standardInput);
    expect(result).not.toBeNull();
    expect(result?.calTarget).toBeGreaterThan(0);
    expect(result?.macros.protein_g).toBeGreaterThan(0);
    expect(result?.macros.carbs_g).toBeGreaterThan(0);
    expect(result?.macros.fat_g).toBeGreaterThan(0);
    expect(result?.weeklySessions.length).toBeGreaterThan(0);
  });

  // Edge case: BMI < 16
  test('should flag extremely low BMI', () => {
    const lowBmiInput = {
      ...standardInput,
      weightKg: 40, // Creates BMI < 16 with 175cm height
      heightCm: 175
    };
    
    const { valid, flags } = validateInputs(lowBmiInput);
    expect(valid).toBe(false);
    expect(flags).toContain('extreme-body-metrics');
    
    const result = calculateFitnessProgram(lowBmiInput);
    expect(result).toBeNull();
  });

  // Edge case: BMI > 45
  test('should flag extremely high BMI', () => {
    const highBmiInput = {
      ...standardInput,
      weightKg: 140, // Creates BMI > 45 with 175cm height
      heightCm: 175
    };
    
    const { valid, flags } = validateInputs(highBmiInput);
    expect(valid).toBe(false);
    expect(flags).toContain('extreme-body-metrics');
    
    const result = calculateFitnessProgram(highBmiInput);
    expect(result).toBeNull();
  });

  // Caloric floor case - female
  test('should apply female caloric minimum', () => {
    const lowCalFemaleInput = {
      ...standardInput,
      gender: "female",
      weightKg: 45, // Low weight to force low calorie calculation
      goal: "lose"
    };
    
    const result = calculateFitnessProgram(lowCalFemaleInput);
    expect(result).not.toBeNull();
    expect(result?.calTarget).toBeGreaterThanOrEqual(1200); // Should enforce minimum 1200 kcal
    expect(result?.flags).toContain('caloric-minimum-applied-female');
  });

  // Caloric floor case - male
  test('should apply male caloric minimum', () => {
    const lowCalMaleInput = {
      ...standardInput,
      gender: "male",
      weightKg: 55, // Low weight to force low calorie calculation
      goal: "lose"
    };
    
    const result = calculateFitnessProgram(lowCalMaleInput);
    expect(result).not.toBeNull();
    expect(result?.calTarget).toBeGreaterThanOrEqual(1500); // Should enforce minimum 1500 kcal
    expect(result?.flags).toContain('caloric-minimum-applied-male');
  });

  // Gradual ramp flag test
  test('should flag when commitDays significantly exceeds currentExerciseDays', () => {
    const rampInput = {
      ...standardInput,
      currentExerciseDays: 1,
      commitDays: 5 // >3 days difference
    };
    
    const { valid, flags } = validateInputs(rampInput);
    expect(valid).toBe(true); // Still valid
    expect(flags).toContain('gradual-ramp-needed');
    
    const result = calculateFitnessProgram(rampInput);
    expect(result).not.toBeNull();
    expect(result?.flags).toContain('gradual-ramp-needed');
  });

  // Medical flag test
  test('should flag when medical conditions are present', () => {
    const medicalInput = {
      ...standardInput,
      medical: "knee pain"
    };
    
    const { valid, flags } = validateInputs(medicalInput);
    expect(valid).toBe(true); // Still valid
    expect(flags).toContain('medical-clearance');
    
    const result = calculateFitnessProgram(medicalInput);
    expect(result).not.toBeNull();
    expect(result?.flags).toContain('medical-clearance');
  });

  // Sleep deficit test
  test('should flag and adjust for sleep deficit', () => {
    const sleepInput = {
      ...standardInput,
      sleepH: "<6"
    };
    
    const result = calculateFitnessProgram(sleepInput);
    expect(result).not.toBeNull();
    expect(result?.flags).toContain('sleep-deficit');
    // Should have recovery tips about sleep
    expect(result?.recoveryTips.some(tip => tip.toLowerCase().includes('sleep'))).toBe(true);
  });

  // Keto diet adjustment test
  test('should adjust macros for keto diet', () => {
    const ketoInput = {
      ...standardInput,
      dietType: "keto"
    };
    
    const result = calculateFitnessProgram(ketoInput);
    expect(result).not.toBeNull();
    // Carbs should be low (≤10% of calories)
    const carbsInKcal = result!.macros.carbs_g * 4;
    expect(carbsInKcal / result!.calTarget).toBeLessThanOrEqual(0.1);
    // Fat should be higher to compensate
    expect(result!.macros.fat_g).toBeGreaterThan(standardInput.weightKg); // Should exceed 1g/kg
  });

  // Vegetarian protein adjustment test
  test('should increase protein for vegetarian diet', () => {
    const vegInput = {
      ...standardInput,
      dietType: "veg"
    };
    
    const standardResult = calculateFitnessProgram(standardInput);
    const vegResult = calculateFitnessProgram(vegInput);
    
    expect(vegResult).not.toBeNull();
    expect(standardResult).not.toBeNull();
    // Veg protein should be ~10% higher
    expect(vegResult!.macros.protein_g).toBeGreaterThan(standardResult!.macros.protein_g);
    const proteinIncrease = vegResult!.macros.protein_g / standardResult!.macros.protein_g;
    expect(proteinIncrease).toBeCloseTo(1.1, 1); // Roughly 10% increase, with some tolerance
  });
});
