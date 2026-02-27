import { useTheme } from "../../../context/ThemeContext";
import SkeletonPersonalInfoTab from "./SkeletonPersonalInfoTab";
import SkeletonMedicalConditionsTab from "./SkeletonMedicalConditionsTab";
import SkeletonMedicationsTab from "./SkeletonMedicationsTab";
import SkeletonAllergiesTab from "./SkeletonAllergiesTab";
import SkeletonEmergencyContactTab from "./SkeletonEmergencyContactTab";
import SkeletonLifestyleTab from "./SkeletonLifestyleTab";
import SkeletonSurgeriesTab from "./SkeletonSurgeriesTab";
import SkeletonVitalsTab from "./SkeletonVitalsTab";

export default function SkeletonProfile({ activeTab = "Personal Info" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const renderInnerSkeleton = () => {
    switch (activeTab) {
      case "Personal Info":
        return <SkeletonPersonalInfoTab />;

      case "Medical Conditions":
        return <SkeletonMedicalConditionsTab />;

      case "Medications":
        return <SkeletonMedicationsTab />;

      case "Allergies":
        return <SkeletonAllergiesTab />;

      case "Surgeries":
        return <SkeletonSurgeriesTab />;

      case "Vitals":
        return <SkeletonVitalsTab />;

      case "Lifestyle":
        return <SkeletonLifestyleTab />;

      case "Emergency Contact":
        return <SkeletonEmergencyContactTab />;

      default:
        return <SkeletonPersonalInfoTab />;
    }
  };

  return (
    <div
      className={`min-h-screen pt-16 animate-pulse ${
        isDark ? "bg-[#131314]" : "bg-slate-50"
      }`}
    >
      {" "}
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-112px)] overflow-hidden">
        {/* =======================
        DESKTOP SIDEBAR
    ======================= */}
        <div
          className={`hidden md:flex flex-col w-72 border-r ${
            isDark
              ? "bg-[#131314] border-[#282A2C]"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex-1 p-5 space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />

            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>

          <div className="p-5 border-t border-gray-200 dark:border-[#282A2C]">
            <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* =======================
        MOBILE NAV
    ======================= */}
        <div
          className={`md:hidden p-4 border-b flex items-center gap-3 ${
            isDark
              ? "bg-[#131314] border-[#282A2C]"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex-1 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* =======================
        MAIN CONTENT
    ======================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div
              className={`max-w-4xl mx-auto rounded-2xl border p-5 md:p-8 ${
                isDark
                  ? "bg-[#1E1F20] border-[#282A2C]"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="w-full max-w-3xl mx-auto">
                {renderInnerSkeleton()}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="shrink-0 h-[76px] flex items-center px-4 md:px-8">
            <div className="w-full max-w-6xl mx-auto space-y-2">
              <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
