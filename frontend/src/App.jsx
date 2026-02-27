import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

import Navbar from "@/components/Navbar";
import EmergencyBar from "@/components/EmergencyBar";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import MobileTabBar from "@/components/MobileTabBar";

/* ---------------- Skeletons ---------------- */
// Import your existing skeletons here
import SkeletonGlobal from "@/components/skeletons/SkeletonGlobal"; // The one created in Step 2
import SkeletonHomePage from "@/components/skeletons/SkeletonHomePage";
import SkeletonLogin from "./components/skeletons/SkeletonLogin";
import SkeletonSignup from "./components/skeletons/SkeletonSignup";
import SkeletonProfile from "./components/skeletons/profile/SkeletonProfile";
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
const Signup = lazy(() => import("@/pages/Signup"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));
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

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const activeTab = params.get("tab") || "Personal Info";

  // While auth state restoring
  if (loading) {
    return <SkeletonProfile activeTab={activeTab} />;
  }

  if (!user) return <Navigate to="/login" replace />;

  // Lazy loading + auth unified
  return (
    <Suspense fallback={<SkeletonProfile activeTab={activeTab} />}>
      {children}
    </Suspense>
  );
};

/* ---------------- App ---------------- */
export default function App() {
  const { i18n } = useTranslation();
  const { user } = useAuth(); 

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  useEffect(() => {
    if (user) {
      import("@/pages/Profile");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* GLOBAL THEME BACKGROUND: Prevents white flash before React loads */}
      <div className="min-h-screen pb-16 sm:pb-0 overflow-visible transition-colors duration-300 bg-white dark:bg-[#131314]">
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>

        <ErrorBoundary>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <LazyRoute component={HomePage} skeleton={SkeletonHomePage} />
              }
            />

            <Route
              path="/login"
              element={<LazyRoute component={Login} skeleton={SkeletonLogin} />}
            />

            {/* Signup */}
            <Route
              path="/signup"
              element={
                <LazyRoute component={Signup} skeleton={SkeletonSignup} />
              }
            />

            {/* ✅ PROFILE (PROTECTED) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
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
          <ErrorBoundary>
            <EmergencyBar />
          </ErrorBoundary>
        </div>
        {/* Mobile navigation */}
        <ErrorBoundary>
          <MobileTabBar />
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
