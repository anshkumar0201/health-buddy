import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useMemo } from "react";

function EmergencyBar() {
  const { t } = useTranslation();

  const helplines = useMemo(
    () => t("EmergencyBar.helplines", { returnObjects: true }) || [],
    [t],
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 print-hide pointer-events-auto will-change-transform">
      {/* Emergency bar */}
      <div className="bg-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 min-h-[44px]">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 transform-gpu" />

            <span>{t("EmergencyBar.title")}:</span>

            {helplines.map((item) => (
              <span key={item.number} className="flex items-center gap-2">
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

export default React.memo(EmergencyBar);

