export default function SkeletonSymptomChecker() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-8 w-64 mx-auto bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-5 w-96 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

        {/* Notice */}
        <div className="max-w-3xl mx-auto h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />

        {/* Search */}
        <div className="max-w-3xl mx-auto h-12 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />

        {/* Categories */}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-28 h-10 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
