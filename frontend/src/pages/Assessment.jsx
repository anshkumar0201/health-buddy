import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonAssessment from "@/components/skeletons/SkeletonAssessment";

export default function Assessment() {
  const { disease } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ✅ Fetch ONLY the current disease assessment
  const assessment = useMemo(() => {
    return i18n.getResource(
      i18n.language,
      "translation",
      `assessments.data.${disease}`,
    );
  }, [disease, i18n.language]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(assessment?.questions?.length || 0).fill(null),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!assessment || !assessment.questions) {
      navigate("/symptom-checker", { replace: true });
    }
  }, [assessment, navigate]);

  const QUESTIONS = useMemo(() => assessment?.questions || [], [assessment]);
  const totalQuestions = QUESTIONS.length;

  const maxPossibleScore = useMemo(() => {
    return QUESTIONS.reduce((sum, q) => {
      const max = Math.max(...q.options.map((o) => o.score || 0));
      return sum + max;
    }, 0);
  }, [QUESTIONS]);

  const optionContainer = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: 0.05 },
      },
    }),
    [],
  );

  const optionItem = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0 },
    }),
    [],
  );

  const selectedOption = answers[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = option;
      return next;
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);

      const totalScore = answers.reduce((sum, a) => sum + (a?.score || 0), 0);

      const hasCriticalYes = answers.some((a) => a?.critical === true);

      setTimeout(() => {
        navigate("/assessment-result", {
          state: {
            disease,
            // title: assessment.title,
            score: totalScore,
            maxScore: maxPossibleScore,
            thresholds: assessment.risk_thresholds,
            // recommendations: assessment.recommendations,
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

  if (!assessment || !assessment.questions) {
    return <SkeletonAssessment />;
  }

  return (
    // FIX: bg-linear-to-b -> bg-gradient-to-b
    // DARK MODE: Main background slate-950/900
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-32 transition-colors duration-300
      bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-lg font-semibold transition mb-4 hover:font-bold cursor-pointer
            text-gray-600 hover:text-black
            dark:text-gray-300 dark:hover:text-white
            ${isSubmitting ? "pointer-events-none opacity-40" : ""}`}
        >
          <ArrowLeft className="w-6 h-6" />
          {t("assessments.back")}
        </button>

        <h1 className="text-2xl font-bold mb-2 transition-colors duration-300 text-gray-900 dark:text-white">
          {assessment.title}
        </h1>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 transition-colors duration-300 text-gray-600 dark:text-gray-400">
            <span />
            <span>
              {t("assessments.question")} {currentQuestion + 1} of{" "}
              {totalQuestions}
            </span>
          </div>

          <div className="h-2 rounded-full overflow-hidden transition-colors duration-300 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-black dark:bg-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Card Container - DARK MODE: Dark Slate Bg, Dark Border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="rounded-2xl shadow-lg border p-8 transition-colors duration-300
          bg-white border-gray-200
          dark:bg-[#1e293b] dark:border-gray-700"
        >
          <QuestionBlock
            question={QUESTIONS[currentQuestion].question}
            options={QUESTIONS[currentQuestion].options}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            optionContainer={optionContainer}
            optionItem={optionItem}
          />

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              disabled={currentQuestion === 0 || isSubmitting}
              onClick={handlePrevious}
              className="flex-1 py-3 rounded-xl border text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2 
                disabled:opacity-40
                text-gray-600 border-gray-200 hover:bg-gray-200
                dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("assessments.previous")}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              disabled={!selectedOption || isSubmitting}
              onClick={handleNext}
              className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition
                ${
                  selectedOption
                    ? "bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    : "bg-gray-300 text-white dark:bg-slate-700 dark:text-gray-400"
                }`}
            >
              {isSubmitting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("assessments.calculating")}
                </motion.div>
              ) : isLastQuestion ? (
                <>
                  {t("assessments.complete")}
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t("assessments.next")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>

          {/* Cancel Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(-1)}
            className="
              mt-4 w-full py-3 rounded-xl text-sm font-medium
              flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]
              bg-black text-white hover:bg-gray-900
              dark:bg-slate-400 dark:text-black dark:hover:bg-slate-100 dark:hover:text-black dark:border dark:border-gray-600
            "
          >
            {t("assessments.cancelAssessment")}
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  );
}

const QuestionBlock = React.memo(function QuestionBlock({
  question,
  options,
  selectedOption,
  onSelect,
  optionContainer,
  optionItem,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          {question}
        </h2>

        <motion.div
          variants={optionContainer}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {options.map((opt, idx) => (
            <motion.button
              key={idx}
              variants={optionItem}
              onClick={() => onSelect(opt)}
              className={`w-full flex items-center gap-3 px-5 py-4
                rounded-xl border text-left text-sm font-medium transition cursor-pointer
                ${
                  selectedOption?.text === opt.text
                    ? "border-black bg-gray-50 dark:bg-slate-800 dark:border-white dark:text-white"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-slate-700"
                }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center
                ${
                  selectedOption?.text === opt.text
                    ? "border-black dark:border-white"
                    : "border-gray-400 dark:border-gray-500"
                }`}
              >
                {selectedOption?.text === opt.text && (
                  <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                )}
              </span>
              {opt.text}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
