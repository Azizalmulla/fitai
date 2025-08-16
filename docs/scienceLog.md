# Zentra FitAI Science Log

This document tracks all scientific updates to our fitness calculation module, including citations for research-backed constants and formulas.

## Current Version: 2025-04-21.1

### Core Formulas

| Formula | Citation | Date Added |
|---------|----------|------------|
| Mifflin-St Jeor BMR | Mifflin et al., AJCN 1990 | 2025-04-21 |
| Activity Factor (AF) | Ainsworth et al., Compend.PA 2011 | 2025-04-21 |
| Protein Requirements | Morton et al., BJN 2018 | 2025-04-21 |
| Fat Requirements | ISSN Position Stand 2017 | 2025-04-21 |
| Training Frequency | Schoenfeld et al., Sports Med 2016 | 2025-04-21 |
| Hydration Guidelines | ACSM 2022 | 2025-04-21 |
| Stress/Sleep Impact | Halson 2014 | 2025-04-21 |

### Constants

| Constant | Value | Source | Date Added |
|----------|-------|--------|------------|
| BMR Formula | `(10·kg) + (6.25·cm) − (5·age) + s` | Mifflin et al., AJCN 1990 | 2025-04-21 |
| Occupation Activity Factors | sedentary: 1.2, light: 1.35, moderate: 1.5, very: 1.7, extra: 1.9 | Ainsworth et al., Compend.PA 2011 | 2025-04-21 |
| Exercise Factor | +0.05 if currentExerciseDays ≥4, +0.10 if ≥6 | ACSM Guidelines | 2025-04-21 |
| Weight Loss Deficit | 20% deficit (0.80 × TDEE) | Hall & Kahan 2018 | 2025-04-21 |
| Weight Gain Surplus | 10% surplus (1.10 × TDEE) | Trexler et al. JISSN 2014 | 2025-04-21 |
| Protein Requirements | 1.6-2.2 g/kg of bodyweight | Morton et al., BJN 2018 | 2025-04-21 |
| Fat Minimum | 0.8 g/kg (20-35% kcal) | ISSN Position Stand 2017 | 2025-04-21 |
| Carbs Formula | (calTarget − (prot·4 + fat·9)) / 4 | Burke et al., Sports Med 2011 | 2025-04-21 |
| Hydration Base | 35 ml/kg/day + 500 ml per 30 min HIIT/strength | ACSM 2022 | 2025-04-21 |
| Caloric Minimums | Female: 1200 kcal, Male: 1500 kcal | Various | 2025-04-21 |

### Log of Changes

#### 2025-04-21 - Initial Implementation
- Implemented Mifflin-St Jeor formula for BMR calculation
- Added evidence-based activity multipliers from Ainsworth
- Integrated protein requirements from Morton et al.
- Implemented training frequency recommendations based on Schoenfeld meta-analysis
- Added stress and sleep modifiers based on Halson 2014
- Set evidence-based goals for weight loss/gain from recent meta-analyses

## References

1. Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.

2. Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Med Sci Sports Exerc. 2011;43(8):1575-1581.

3. Morton RW, Murphy KT, McKellar SR, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. Br J Sports Med. 2018;52(6):376-384.

4. International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr. 2017;14:20.

5. Schoenfeld BJ, Ogborn D, Krieger JW. Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis. Sports Med. 2016;46(11):1689-1697.

6. American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription. 11th ed. Philadelphia, PA: Wolters Kluwer; 2022.

7. Halson SL. Sleep in elite athletes and nutritional interventions to enhance sleep. Sports Med. 2014;44 Suppl 1:S13-S23.

8. Hall KD, Kahan S. Maintenance of Lost Weight and Long-Term Management of Obesity. Med Clin North Am. 2018;102(1):183-197.

9. Trexler ET, Smith-Ryan AE, Norton LE. Metabolic adaptation to weight loss: implications for the athlete. J Int Soc Sports Nutr. 2014;11(1):7.

10. Burke LM, Hawley JA, Wong SH, Jeukendrup AE. Carbohydrates for training and competition. J Sports Sci. 2011;29 Suppl 1:S17-27.

11. Areta JL, Burke LM, Ross ML, et al. Timing and distribution of protein ingestion during prolonged recovery from resistance exercise alters myofibrillar protein synthesis. J Physiol. 2013;591(9):2319-2331.
