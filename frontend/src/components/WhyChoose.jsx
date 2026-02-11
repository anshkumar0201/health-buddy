import { CheckCircle } from "lucide-react";
import whychoose from "../assets/whychoose.jpeg";
import { useTranslation } from "react-i18next";
import SkeletonWhyChoose from "./skeletons/SkeletonWhyChoose";
import React from "react";

function WhyChoose() {
  const { t, ready } = useTranslation();

  // Fetch points array from JSON
  const points = t("WhyChoose.points", { returnObjects: true });

  if (!ready) return <SkeletonWhyChoose />;

  return (
    // DARK MODE: Switches to slate-900 to alternate with other sections
    <section className="py-14 transition-colors duration-300 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          {/* Badge - DARK MODE: Transparent Blue */}
          <span
            className="inline-block mb-4 px-4 py-1 text-xs font-semibold rounded-lg shadow-sm transition-colors duration-300
            bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100
            dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900/50"
          >
            {t("WhyChoose.badge")}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold transition-colors duration-300 text-gray-900 dark:text-gray-300">
            {t("WhyChoose.title")}
          </h2>

          <p className="mt-6 max-w-xl transition-colors duration-300 text-gray-600 dark:text-gray-300">
            {t("WhyChoose.description")}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-2">
                {/* Icon - DARK MODE: Lighter green */}
                <CheckCircle
                  className="mt-0.5 shrink-0 transition-colors duration-300 text-green-600 dark:text-green-400"
                  size={18}
                />

                <span className="text-sm transition-colors duration-300 text-gray-700 dark:text-gray-300">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="w-full">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl
  transition-all duration-300
  border border-transparent
  dark:border-gray-800 dark:shadow-black/50
  transform-gpu will-change-transform"
          >
            <img
              src={whychoose}
              loading="lazy"
              decoding="async"
              width="1200"
              height="800"
              alt={t("WhyChoose.imageAlt")}
              className="w-full h-full object-cover"
              style={{ aspectRatio: "3 / 2" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(WhyChoose);

