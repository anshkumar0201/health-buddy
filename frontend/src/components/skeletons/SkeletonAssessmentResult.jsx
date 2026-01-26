export default function SkeletonAssessmentResult() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 animate-pulse">
        <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-6" />
        <div className="rounded-2xl p-8 bg-white dark:bg-[#1e293b] space-y-6">
          <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </main>
  );
}
