export default function SkeletonAssessment() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
        <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-8" />

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-8" />

        <div className="rounded-2xl p-8 bg-white dark:bg-[#1e293b] space-y-6">
          <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
