export default function SkeletonEmergency() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-300 dark:bg-red-900/40" />
        </div>

        {/* Title */}
        <div className="h-8 w-64 mx-auto rounded bg-gray-300 dark:bg-gray-700 mb-3" />
        <div className="h-4 w-96 mx-auto rounded bg-gray-200 dark:bg-gray-800 mb-10" />

        {/* Helpline skeleton */}
        <div className="max-w-4xl mx-auto rounded-xl border p-5 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <div className="h-4 w-40 bg-red-300 dark:bg-red-700 rounded mb-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-red-300 dark:bg-red-700"
              />
            ))}
          </div>
        </div>

        {/* Emergency cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700"
            >
              <div className="h-1 bg-red-400 dark:bg-red-600 w-full mb-4 rounded" />

              <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded mb-6" />

              <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
