export default function SkeletonHeroJourney() {
  return (
    <section
      className="
        relative w-full overflow-hidden isolate
        min-h-[100svh] lg:min-h-[85svh]
        flex flex-col justify-center
        animate-pulse
      "
    >
      {/* BACKGROUND VISUAL LAYER */}
      <div className="absolute inset-0 -z-10">
        {/* gradient blobs placeholder */}
        <div
          className="absolute w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px]
                        rounded-full blur-[100px] lg:blur-[140px]
                        bg-blue-300/30 dark:bg-blue-900/20
                        top-[-400px] left-[-200px] lg:top-[-500px] lg:left-[-400px]"
        />

        <div
          className="absolute w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px]
                        rounded-full blur-[120px] lg:blur-[160px]
                        bg-pink-300/30 dark:bg-pink-900/20
                        bottom-[-200px] right-[-100px] lg:bottom-[-400px] lg:right-[-300px]"
        />

        {/* image placeholder */}
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 opacity-80" />
      </div>

      {/* CONTENT */}
      <div
        className="
          relative z-10 w-full max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          text-center
          pt-24 pb-16 lg:pt-20 lg:pb-20
        "
      >
        {/* badge */}
        <div
          className="h-8 w-40 mx-auto mb-8 rounded-full
                        bg-white/40 dark:bg-white/10 border border-white/30"
        />

        {/* heading */}
        <div className="space-y-3 mb-6">
          <div className="h-12 sm:h-14 md:h-16 lg:h-20 w-11/12 mx-auto rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 sm:h-14 md:h-16 lg:h-20 w-8/12 mx-auto rounded bg-emerald-300/60 dark:bg-emerald-900/40" />
        </div>

        {/* description */}
        <div className="space-y-3 max-w-2xl mx-auto mb-8">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 mx-auto rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <div className="h-14 w-64 rounded-2xl bg-white/70 dark:bg-gray-700 shadow-lg" />
        </div>
      </div>

      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-70
                      bg-gradient-to-t
                      from-gray-300/60 via-gray-200/30 to-transparent
                      dark:from-black/60 dark:via-black/30"
      />
    </section>
  );
}
