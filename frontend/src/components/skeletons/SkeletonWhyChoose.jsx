export default function SkeletonWhyChoose() {
  return (
    <section className="py-14 bg-white dark:bg-slate-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-3xl" />
      </div>
    </section>
  );
}
