import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EmergencyBar from "@/components/EmergencyBar";
import HomePage from "@/pages/HomePage"; // or Home.jsx
import SymptomAnalyzer from "@/pages/SymptomAnalyzer"; // or SymptomAnalyzer.jsx
import SymptomChecker from "@/pages/SymptomChecker"; // or SymptomChecker.jsx
import Diseases from "@/pages/Diseases"; // or Diseases.jsx
import Prevention from "@/pages/Prevention"; // or Prevention.jsx
import FindClinics from "@/pages/FindClinics"; // or FindClinics.jsx
import Emergency from "@/pages/Emergency"; // or Emergency.jsx
import MyAssessments from "@/pages/MyAssessment"; // or MyAssessment.jsx
import ScrollToTop from "@/components/ScrollToTop";
import EmergencyDetail from "@/pages/EmergencyDetail"; // or EmergencyDetail.jsx
import DiseaseDetails from "@/pages/DiseaseDetails"; // or DiseaseDetails.jsx
import Assessment from "@/pages/Assessment"; // or Assessment.jsx
import AssessmentResult from "@/pages/AssessmentResult"; // or AssessmentResult.jsx

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/diseases/:name" element={<DiseaseDetails />} />
        <Route path="/prevention" element={<Prevention />} />
        <Route path="/clinics" element={<FindClinics />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/:slug" element={<EmergencyDetail />} />
        <Route path="/assessments" element={<MyAssessments />} />
        <Route path="/assessment/:disease" element={<Assessment />} />
        <Route path="/assessment-result" element={<AssessmentResult />} />
      </Routes>
      <EmergencyBar />
    </BrowserRouter>
  );
}
