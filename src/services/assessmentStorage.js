export function getAssessments() {
  return JSON.parse(localStorage.getItem("assessments")) || [];
}

export function saveAssessment(assessment) {
  const existing = getAssessments();
  localStorage.setItem(
    "assessments",
    JSON.stringify([assessment, ...existing])
  );
}
