import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "@/components/Navbar";
import EmergencyBar from "@/components/EmergencyBar";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";

/* ---------------- Lazy-loaded Pages ---------------- */

const HomePage = lazy(() => import("@/pages/HomePage"));
const SymptomAnalyzer = lazy(() => import("@/pages/SymptomAnalyzer"));
const SymptomChecker = lazy(() => import("@/pages/SymptomChecker"));
const Diseases = lazy(() => import("@/pages/Diseases"));
const DiseaseDetails = lazy(() => import("@/pages/DiseaseDetails"));
const Prevention = lazy(() => import("@/pages/Prevention"));
const FindClinics = lazy(() => import("@/pages/FindClinics"));
const Emergency = lazy(() => import("@/pages/Emergency"));
const EmergencyDetail = lazy(() => import("@/pages/EmergencyDetail"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const AssessmentResult = lazy(() => import("@/pages/AssessmentResult"));

/* ---------------- Loading Fallback ---------------- */

function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-black animate-spin mb-3" />
      <p className="text-sm text-gray-500">{t("loading")}</p>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      {/* Lazy-loaded routes */}
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
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
            <Route path="/assessment/:disease" element={<Assessment />} />
            <Route path="/assessment-result" element={<AssessmentResult />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>

      <EmergencyBar />
    </BrowserRouter>
  );
}
