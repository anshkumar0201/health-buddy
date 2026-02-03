export default function SkeletonEmergencyDetail() {
  return (
    <main
      className="min-h-screen pt-24 pb-24 animate-pulse
      bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-6" />

        {/* Card */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden
          bg-white dark:bg-[#1e293b]"
        >
          {/* Top strip */}
          <div className="h-2 bg-orange-300" />

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Urgency badge */}
            <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />

            {/* Title */}
            <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />

            {/* Emergency callout */}
            <div className="h-20 w-full rounded-lg bg-red-200/60 dark:bg-red-900/30" />

            {/* About */}
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Recognize list */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full rounded-xl
                  bg-orange-200/60 dark:bg-orange-900/30"
                />
              ))}
            </div>

            {/* Steps */}
            <div className="rounded-xl p-6 bg-blue-200/60 dark:bg-blue-900/30 space-y-3">
              <div className="h-6 w-48 rounded bg-blue-300 dark:bg-blue-800" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-full rounded bg-blue-300 dark:bg-blue-800"
                />
              ))}
            </div>

            {/* DO / DON'T */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 space-y-3
                  bg-gray-200 dark:bg-gray-700"
                >
                  <div className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-600" />
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-4 w-full rounded bg-gray-300 dark:bg-gray-600"
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Helplines */}
            <div className="space-y-4">
              <div className="h-5 w-48 rounded bg-red-300 dark:bg-red-800" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl
                    bg-red-300 dark:bg-red-800"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
