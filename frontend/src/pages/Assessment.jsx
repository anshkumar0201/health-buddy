import { useParams, useNavigate, Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export default function Assessment() {
  const { disease } = useParams();
  const navigate = useNavigate();
  // const { t } = useTranslation();

  // ✅ Fetch ONLY the current disease assessment
  const assessment = i18n.getResource(
    i18n.language,
    "translation",
    `assessments.data.${disease}`
  );

  useEffect(() => {
    if (!assessment || !assessment.questions) {
      navigate("/symptom-checker", { replace: true });
    }
  }, [assessment, navigate]);

  if (!assessment || !assessment.questions) return null;

  const QUESTIONS = assessment.questions;
  const totalQuestions = QUESTIONS.length;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = answers[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option) => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);

      const totalScore = answers.reduce((sum, a) => sum + (a?.score || 0), 0);

      const maxPossibleScore = QUESTIONS.reduce((sum, q) => {
        const maxOptionScore = Math.max(...q.options.map((o) => o.score || 0));
        return sum + maxOptionScore;
      }, 0);

      const hasCriticalYes = answers.some((a) => a?.critical === true);

      setTimeout(() => {
        navigate("/assessment-result", {
          state: {
            disease,
            title: assessment.title,
            score: totalScore,
            maxScore: maxPossibleScore,
            thresholds: assessment.risk_thresholds,
            recommendations: assessment.recommendations,
            criticalHit: hasCriticalYes,
          },
        });
      }, 1000);
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-10 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-lg text-gray-600
            hover:text-black font-semibold transition mb-4 hover:font-bold cursor-pointer
            ${isSubmitting ? "pointer-events-none opacity-40" : ""}`}
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Symptom Checker
        </button>

        <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span />
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <h2 className="text-lg font-semibold mb-6">
            {QUESTIONS[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {QUESTIONS[currentQuestion].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt)}
                className={`w-full flex items-center gap-3 px-5 py-4
                  rounded-xl border text-left text-sm font-medium transition
                  cursor-pointer
                  ${
                    selectedOption?.text === opt.text
                      ? "border-black bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${
                      selectedOption?.text === opt.text
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                >
                  {selectedOption?.text === opt.text && (
                    <span className="w-2 h-2 bg-black rounded-full" />
                  )}
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              disabled={currentQuestion === 0 || isSubmitting}
              onClick={handlePrevious}
              className="flex-1 py-3 rounded-xl border
                text-sm font-medium text-gray-600
                hover:bg-gray-200
                disabled:opacity-40 cursor-pointer
                transition
                flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              disabled={!selectedOption || isSubmitting}
              onClick={handleNext}
              className={`flex-1 py-3 rounded-xl text-sm font-medium
                flex items-center justify-center gap-2 cursor-pointer
                transition
                ${
                  selectedOption
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-white"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : isLastQuestion ? (
                <>
                  Complete
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* ✅ Cancel Button */}
          <button
            onClick={() => navigate(-1)}
            className="
              mt-4 w-full py-3 rounded-xl
              bg-black text-white text-sm font-medium
              flex items-center justify-center gap-2
              transition cursor-pointer
              hover:bg-gray-900
              active:scale-[0.98]
            "
          >
            Cancel Assessment
          </button>
        </div>
      </div>
    </main>
  );
}
