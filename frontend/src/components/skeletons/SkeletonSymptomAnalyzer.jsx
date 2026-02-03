export default function SkeletonSymptomAnalyzer() {
  return (
    <div className="min-h-screen pt-24 px-4 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gray-300 dark:bg-gray-700" />
        <div className="h-8 w-64 mx-auto bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-96 mx-auto bg-gray-200 dark:bg-gray-600 rounded" />

        <div className="mt-8 rounded-2xl p-6 border bg-gray-200 dark:bg-gray-800">
          <div className="h-4 w-40 mb-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-28 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-10 w-full mt-6 bg-gray-400 dark:bg-gray-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
