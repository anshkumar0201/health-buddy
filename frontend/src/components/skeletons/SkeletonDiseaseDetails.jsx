export default function SkeletonDiseaseDetails() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
        <div className="h-10 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-6" />
        <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"
          />
        ))}
      </div>
    </main>
  );
}
