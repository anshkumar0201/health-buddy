import { CheckCircle } from "lucide-react";
import whychoose from "../assets/whychoose.jpeg";
import { useTranslation } from "react-i18next";

export default function WhyChoose() {
  const { t } = useTranslation();

  // Fetch points array from JSON
  const points = t("WhyChoose.points", { returnObjects: true });

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-primary shadow-2xl border-blue-200 hover:bg-blue-200 transition">
            {t("WhyChoose.badge")}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold">
            {t("WhyChoose.title")}
          </h2>

          <p className="mt-6 text-muted max-w-xl">
            {t("WhyChoose.description")}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="w-full">
          <div className="rounded-3xl overflow-hidden shadow-soft">
            <img
              src={whychoose}
              alt={t("WhyChoose.imageAlt")}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
