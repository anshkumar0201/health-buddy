import symptomsMap from "@/data/symptoms.json";
import conditions from "@/data/conditions.json";

export function analyzeSymptoms(text) {
  const lowerText = text.toLowerCase();

  // 1. Detect symptom tags
  const detectedSymptoms = new Set();

  Object.entries(symptomsMap).forEach(([keyword, tags]) => {
    if (lowerText.includes(keyword)) {
      tags.forEach(tag => detectedSymptoms.add(tag));
    }
  });

  // 2. Match conditions
  const matchedConditions = conditions
    .map(condition => {
      const matchCount = condition.symptoms.filter(s =>
        detectedSymptoms.has(s)
      ).length;

      return { ...condition, matchCount };
    })
    .filter(c => c.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  // 3. Decide urgency (highest wins)
  let urgency = "Low";
  matchedConditions.forEach(c => {
    if (c.urgency === "High") urgency = "High";
    else if (c.urgency === "Moderate" && urgency !== "High")
      urgency = "Moderate";
  });

  return {
    urgency,
    conditions: matchedConditions
  };
}