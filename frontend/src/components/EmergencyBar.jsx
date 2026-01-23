import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmergencyBar() {
  const { t } = useTranslation();

  const helplines = t("EmergencyBar.helplines", { returnObjects: true });

  return (
      <div className="fixed bottom-0 left-0 right-0 z-50 print-hide pointer-events-auto">

      {/* Emergency bar */}
      <div className="bg-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>{t("EmergencyBar.title")}:</span>

            {helplines.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="hidden sm:inline mx-2">•</span>
                <strong>{item.number}</strong>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
