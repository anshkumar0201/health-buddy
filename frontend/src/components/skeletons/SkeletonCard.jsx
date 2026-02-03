export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] p-8 shadow-lg animate-pulse">
      {/* Top bar */}
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6" />

      {/* Icon */}
      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6" />

      {/* Title */}
      <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />

      {/* Description */}
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

      {/* Button */}
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );
}
