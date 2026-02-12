import SkeletonCard from "./SkeletonCard";

export default function SkeletonFeatures() {
  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-950 animate-pulse">
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="text-center mb-16">
          <div className="h-8 w-64 mx-auto rounded bg-gray-300 dark:bg-gray-700 mb-4" />
          <div className="h-4 w-96 max-w-full mx-auto rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
