import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "@/components/Navbar";
import EmergencyBar from "@/components/EmergencyBar";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import MobileTabBar from "@/components/MobileTabBar";

/* ---------------- Skeletons ---------------- */
// Import your existing skeletons here
import SkeletonGlobal from "@/components/skeletons/SkeletonGlobal"; // The one created in Step 2
import SkeletonHomePage from "@/components/skeletons/SkeletonHomePage";
import SkeletonSymptomAnalyzer from "@/components/skeletons/SkeletonSymptomAnalyzer";
import SkeletonSymptomChecker from "@/components/skeletons/SkeletonSymptomChecker";
import SkeletonDiseases from "@/components/skeletons/SkeletonDiseases";
import SkeletonDiseaseDetails from "@/components/skeletons/SkeletonDiseaseDetails";
import SkeletonPrevention from "@/components/skeletons/SkeletonPrevention";
import SkeletonFindClinics from "@/components/skeletons/SkeletonFindClinics";
import SkeletonEmergency from "@/components/skeletons/SkeletonEmergency";
import SkeletonEmergencyDetail from "@/components/skeletons/SkeletonEmergencyDetail";
import SkeletonAssessment from "@/components/skeletons/SkeletonAssessment";
import SkeletonAssessmentResult from "@/components/skeletons/SkeletonAssessmentResult";
// If you have a SkeletonFindClinics, import it, otherwise use Global

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

/* ---------------- Helper Wrapper ---------------- */
// This wrapper applies the suspense fallback per-route
const LazyRoute = ({ component: Component, skeleton: Skeleton }) => (
  <Suspense fallback={Skeleton ? <Skeleton /> : <SkeletonGlobal />}>
    <Component />
  </Suspense>
);

// /* ---------------- Loading Fallback ---------------- */

// function PageLoader() {
//   const { t } = useTranslation();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-white">
//       <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-black animate-spin mb-3" />
//       <p className="text-sm text-gray-500">{t("loading")}</p>
//     </div>
//   );
// }

/* ---------------- App ---------------- */

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* App shell */}
      <div className="min-h-screen pb-16 sm:pb-0 overflow-visible">
        <Navbar />

        <ErrorBoundary>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <LazyRoute component={HomePage} skeleton={SkeletonHomePage} />
              }
            />
            {/* Symptom Analyzer */}
            <Route
              path="/symptom-analyzer"
              element={
                <LazyRoute
                  component={SymptomAnalyzer}
                  skeleton={SkeletonSymptomAnalyzer}
                />
              }
            />
            {/* Symptom Checker */}
            <Route
              path="/symptom-checker"
              element={
                <LazyRoute
                  component={SymptomChecker}
                  skeleton={SkeletonSymptomChecker}
                />
              }
            />
            {/* Diseases */}
            <Route
              path="/diseases"
              element={
                <LazyRoute component={Diseases} skeleton={SkeletonDiseases} />
              }
            />
            <Route
              path="/diseases/:name"
              element={
                <LazyRoute
                  component={DiseaseDetails}
                  skeleton={SkeletonDiseaseDetails}
                />
              }
            />

            {/* Prevention */}
            <Route
              path="/prevention"
              element={
                <LazyRoute
                  component={Prevention}
                  skeleton={SkeletonPrevention}
                />
              }
            />

            {/* Clinics (Uses Global if you don't have a specific skeleton) */}
            <Route
              path="/clinics"
              element={
                <LazyRoute
                  component={FindClinics}
                  skeleton={SkeletonFindClinics}
                />
              }
            />

            {/* Emergency */}
            <Route
              path="/emergency"
              element={
                <LazyRoute component={Emergency} skeleton={SkeletonEmergency} />
              }
            />
            <Route
              path="/emergency/:slug"
              element={
                <LazyRoute
                  component={EmergencyDetail}
                  skeleton={SkeletonEmergencyDetail}
                />
              }
            />

            {/* Assessment */}
            <Route
              path="/assessment/:disease"
              element={
                <LazyRoute
                  component={Assessment}
                  skeleton={SkeletonAssessment}
                />
              }
            />
            <Route
              path="/assessment-result"
              element={
                <LazyRoute
                  component={AssessmentResult}
                  skeleton={SkeletonAssessmentResult}
                />
              }
            />
          </Routes>
        </ErrorBoundary>

        {/* Desktop emergency bar */}
        <div className="hidden sm:block">
          <EmergencyBar />
        </div>
        {/* Mobile navigation */}
        <MobileTabBar />
      </div>
    </BrowserRouter>
  );
}
