export default function SkeletonFindClinics() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-300 dark:bg-orange-900/40" />
        </div>

        {/* Title */}
        <div className="h-8 w-72 mx-auto rounded bg-gray-300 dark:bg-gray-700 mb-3" />
        <div className="h-4 w-96 mx-auto rounded bg-gray-200 dark:bg-gray-800 mb-8" />

        {/* Location box */}
        <div className="mt-8 rounded-xl border px-5 py-4 text-left max-w-2xl mx-auto bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <div className="h-4 w-48 rounded bg-green-300 dark:bg-green-700 mb-2" />
          <div className="h-3 w-64 rounded bg-green-200 dark:bg-green-800" />
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <div className="h-14 w-64 rounded-xl bg-blue-300 dark:bg-blue-800" />
        </div>

        {/* Quick Search Section */}
        <div className="max-w-6xl mx-auto px-6 mt-4 pt-4 pb-10 my-5">
          {/* Heading */}
          <div className="h-5 w-40 mx-auto rounded bg-gray-300 dark:bg-gray-700 mt-6 mb-6" />

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 border bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700"
              >
                <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-20 mx-auto rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>

          {/* Emergency Section */}
          <div className="mt-14 w-full sm:max-w-3xl sm:mx-auto rounded-2xl border p-6 text-left bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900">
            <div className="h-5 w-48 rounded bg-red-300 dark:bg-red-700 mb-4" />
            <div className="h-3 w-full rounded bg-red-200 dark:bg-red-800 mb-4" />

            {/* badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-red-300 dark:bg-red-700"
                />
              ))}
            </div>

            {/* button */}
            <div className="h-12 w-full rounded-xl bg-red-400 dark:bg-red-700" />
          </div>
        </div>
      </div>
    </main>
  );
}
