export default function SkeletonCTASection() {
  return (
    <section className="relative w-full overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-700" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="h-8 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-5 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-8" />

        <div className="h-12 w-40 mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </section>
  );
}
