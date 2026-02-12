export default function SkeletonHeroStats() {
  return (
    <section
      className="
        relative z-20 
        px-4 pb-20
        mt-10 lg:mt-50
        animate-pulse
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* same responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                flex flex-col items-center justify-center
                p-4 sm:p-8
                rounded-2xl
                bg-white dark:bg-[#1e2329]
                border border-gray-200 dark:border-gray-800
                shadow-xl shadow-gray-200/50 dark:shadow-black/40
              "
            >
              {/* icon box */}
              <div
                className="
                w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4
                rounded-xl
                bg-blue-100 dark:bg-blue-900/30
              "
              />

              {/* number */}
              <div className="h-7 sm:h-10 w-16 sm:w-20 rounded bg-gray-300 dark:bg-gray-700 mb-2" />

              {/* label */}
              <div className="h-3 sm:h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
