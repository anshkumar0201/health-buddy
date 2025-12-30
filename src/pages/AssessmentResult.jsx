import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  Heart,
  Info,
  ArrowLeft,
  ArrowRight,
  Download,
} from "lucide-react";
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssessmentReportPDF from "@/components/AssessmentReportPDF";

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safety guard
  if (!location.state) {
    navigate("/symptom-checker");
    return null;
  }

  const { disease, score } = location.state;

  /* ---------------- Risk Logic ---------------- */
  let riskLevel = "LOW RISK";
  let theme = "green";

  if (score >= 30) {
    riskLevel = "HIGH RISK";
    theme = "red";
  } else if (score >= 15) {
    riskLevel = "MODERATE RISK";
    theme = "yellow";
  }

  const themes = {
    green: {
      bg: "bg-green-100",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
      icon: "text-green-600",
    },
    yellow: {
      bg: "bg-yellow-100",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700",
      icon: "text-yellow-600",
    },
    red: {
      bg: "bg-red-100",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
      icon: "text-red-600",
    },
  };

  const t = themes[theme];

  /* ---------------- FIXED DOWNLOAD FUNCTION ---------------- */
  // const downloadPDF = async () => {
  //   if (!reportRef.current || isDownloading) return;

  //   setIsDownloading(true);

  //   try {
  //     const canvas = await html2canvas(reportRef.current, {
  //       scale: 2,
  //       useCORS: true,
  //       backgroundColor: "#ffffff",
  //       scrollY: -window.scrollY,
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF({
  //       unit: "pt",
  //       format: "a4",
  //       orientation: "portrait",
  //     });

  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);

  //     // 🔥 SAFARI-SAFE DOWNLOAD
  //     const blob = pdf.output("blob");
  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${disease.replace(/\s+/g, "_")}_Assessment_Report.pdf`;
  //     document.body.appendChild(a);
  //     a.click();

  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error("PDF generation failed:", err);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="
      bg-white
      rounded-2xl
      border border-gray-300
      shadow-[0_20px_45px_-15px_rgba(0,0,0,0.25)]
      overflow-hidden
    "
        >
          {/* Header */}
          <div
            className={`${t.bg} border ${t.border} p-6 flex items-start justify-between`}
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {disease} Assessment
              </h1>
              <p className="text-sm text-gray-700 mt-1">
                Completed on {new Date().toLocaleDateString()}
              </p>
            </div>

            <Check className={`w-10 h-10 ${t.icon} font-extrabold`} />
          </div>

          {/* Risk Card */}
          <div
            className={`mx-8 mt-8 rounded-2xl border ${t.border} ${t.bg} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  Risk Assessment
                </h2>
                <p className={`${t.text} mt-2 text-sm font-semibold`}>
                  Score: {score} points
                </p>
              </div>

              <span
                className={`px-4 py-1.5 rounded-lg text-sm ${t.bg}
    p-6
    ring-2 ring-offset-2 ${t.border}
    shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] font-semibold ${t.badge}`}
              >
                {riskLevel}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mx-10 mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900">
                Recommendations
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-600 mt-1" />
                <span className="text-sm text-gray-800">
                  Follow the prevention tips for this condition
                </span>
              </li>

              {riskLevel !== "LOW RISK" && (
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1" />
                  <span className="text-sm text-gray-800">
                    Consider scheduling an appointment with a doctor
                  </span>
                </li>
              )}

              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-600 mt-1" />
                <span className="text-sm text-gray-800">
                  Maintain a healthy lifestyle with proper diet and exercise
                </span>
              </li>
            </ul>
          </div>

          {/* Prevention Tips */}
          <div className="mx-10 mt-10">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Prevention Tips
            </h3>

            <ul className="space-y-2 text-sm text-gray-800">
              <li>• Maintain healthy blood pressure</li>
              <li>• Control cholesterol levels</li>
              <li>• Quit smoking</li>
              <li>• Exercise regularly</li>
              <li>• Eat a heart-healthy diet</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mx-8 mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700 mb-1">Next Steps</p>
              <p className="text-sm text-blue-700">
                {riskLevel === "HIGH RISK"
                  ? "We strongly recommend consulting a healthcare professional immediately."
                  : "Continue monitoring your health and maintain healthy habits."}
              </p>
            </div>
          </div>

          <p className="mx-10 mt-10 text-xs text-gray-500 text-center">
            Note: This assessment is for informational purposes only and does
            not constitute medical advice, diagnosis, or treatment. Always
            consult a qualified healthcare professional for medical concerns.
          </p>

          {/* Actions */}
          <div className="mx-8 mt-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pdf-hide">
            <button
              onClick={() => navigate("/symptom-checker")}
              className="
              flex items-center justify-center gap-2
              py-2 rounded-xl border cursor-pointer
              font-medium text-gray-700
              hover:bg-gray-200 transition
            "
            >
              <ArrowLeft className="w-4 h-4" />
              New Assessment
            </button>
            <PDFDownloadLink
              className="contents"
              document={
                <AssessmentReportPDF
                  disease={disease}
                  score={score}
                  riskLevel={riskLevel}
                />
              }
              fileName={`${disease.replace(/\s+/g, "_")}_Assessment_Report.pdf`}
            >
              {({ loading }) => (
                <button
                  className="
        flex items-center justify-center gap-2
        py-3 rounded-xl border
        font-medium transition cursor-pointer
        bg-white hover:bg-gray-200
      "
                >
                  {loading ? "Generating PDF..." : "Download Report as PDF"}
                  <Download className="w-4 h-4" />
                </button>
              )}
            </PDFDownloadLink>

            <button
              onClick={() => navigate("/clinics")}
              className="
              flex items-center justify-center gap-2
              py-3 rounded-xl cursor-pointer
              bg-black text-white font-medium
              hover:bg-white transition hover:text-black border border-black
            "
            >
              Find Nearby Clinics
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
