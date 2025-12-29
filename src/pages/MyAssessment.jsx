import { Activity, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyAssessments() {
  const navigate = useNavigate();

  // Later this will come from API / localStorage
  const assessments = [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          My Assessments
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Track your health assessment history
        </p>

        {/* Content */}
        <div className="mt-12 max-w-5xl mx-auto">
          {assessments.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-gray-400" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Assessments Yet
              </h3>

              <p className="text-gray-600 mb-6">
                Start your first health assessment to track your wellness journey
              </p>

              <button
                onClick={() => navigate("/symptom-analyzer")}
                className="
                  inline-flex items-center gap-2
                  bg-black text-white
                  px-6 py-3 rounded-xl font-medium cursor-pointer
                  shadow transition-all duration-300
                  hover:bg-gray-900 hover:scale-[1.03]
                "
              >
                <Activity className="w-4 h-4" />
                Start Assessment →
              </button>
            </div>
          ) : (
            /* Future: Assessment list */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Map real assessments here later */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
