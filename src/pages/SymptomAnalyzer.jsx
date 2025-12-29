import { MessageSquare, Info, Sparkles, Search } from "lucide-react"

export default function SymptomAnalyzer() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Symptom Analyzer
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Describe how you're feeling and we'll suggest which conditions to check
        </p>

        {/* How it works */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm leading-relaxed">
            <span className="font-medium block mb-1">How it works</span>
            Describe your symptoms in your own words. Our AI will analyze them and suggest which health conditions you might want to assess using our Symptom Checker.
          </p>
        </div>

        {/* Input Card */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">
              Describe Your Symptoms
            </h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Tell us what you're experiencing – be as detailed as possible
          </p>

          <textarea
            rows={5}
            placeholderേഴ്
            className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            defaultValue="Example: I've been having a headache for the past 2 days, along with a mild fever and body aches. I also feel tired and have a slight sore throat..."
          />

          <button
            className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-400 text-white py-3 rounded-xl font-medium
            hover:bg-purple-500 hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200 shadow-md"
          >
            <Search className="w-4 h-4" />
            Analyze My Symptoms
          </button>
        </div>

      </div>
    </main>
  )
}
