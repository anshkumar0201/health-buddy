import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import assessments from "@/data/assessments.json";

export default function Assessment() {
  const { disease } = useParams();
  const navigate = useNavigate();
  const decodedDisease = decodeURIComponent(disease);

  const assessment = assessments[decodedDisease];

  if (!assessment) {
    navigate("/symptom-checker");
    return null;
  }

  const QUESTIONS = assessment.questions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = answers[currentQuestion];
  const totalQuestions = QUESTIONS.length;
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

      setTimeout(() => {
        navigate("/assessment-result", {
          state: {
            disease: decodedDisease,
            score: totalScore,
          },
        });
      }, 1500);
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4">
        {/* 🔙 Back to Symptom Checker */}
        <Link
          to="/symptom-checker"
          className={`
            flex items-center gap-2 text-lg text-gray-500
            hover:text-gray-900 font-semibold hover:font-bold
            transition-colors duration-200 mb-6
            ${isSubmitting ? "pointer-events-none opacity-40" : ""}
          `}
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Symptom Checker
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">{decodedDisease}</h1>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
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

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <h2 className="text-lg font-semibold mb-6">
            {QUESTIONS[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {QUESTIONS[currentQuestion].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt)}
                className={`
                  w-full flex items-center gap-3 px-5 py-4 rounded-xl border
                  text-left text-sm font-medium transition cursor-pointer
                  ${
                    selectedOption?.text === opt.text
                      ? "border-black bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <span
                  className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    ${
                      selectedOption?.text === opt.text
                        ? "border-black"
                        : "border-gray-400"
                    }
                  `}
                >
                  {selectedOption?.text === opt.text && (
                    <span className="w-2 h-2 bg-black rounded-full" />
                  )}
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-4">
            <button
              disabled={currentQuestion === 0 || isSubmitting}
              onClick={handlePrevious}
              className="
                flex-1 py-3 rounded-xl border
                text-sm font-medium text-gray-600
                hover:bg-gray-200 flex items-center
                justify-center gap-2 disabled:opacity-40
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              disabled={!selectedOption || isSubmitting}
              onClick={handleNext}
              className={`
                flex-1 py-3 rounded-xl text-sm font-medium
                flex items-center justify-center gap-2 transition
                ${
                  selectedOption
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-white"
                }
              `}
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

          {/* Cancel Assessment */}
          <div
            onClick={() => {
              if (!isSubmitting) {
                navigate("/symptom-checker");
              }
            }}
            className={`
              mt-6 text-center rounded-lg py-2
              text-sm text-gray-500 font-semibold
              hover:bg-gray-300 transition cursor-pointer
              ${isSubmitting ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            Cancel Assessment
          </div>
        </div>
      </div>
    </main>
  );
}
