export default function SkeletonPrevention() {
  return (
    <div className="min-h-screen pt-24 pb-32 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl mx-auto animate-pulse" />

        <div className="h-8 w-64 mx-auto bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-96 mx-auto bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
