export default function SkeletonCard() {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        shadow-lg
        bg-white
        dark:bg-[#1e293b] dark:shadow-gray-900/50
        animate-pulse
      "
    >
      {/* gradient bar */}
      <div className="h-2 bg-gray-300 dark:bg-gray-700" />

      <div className="p-8 flex flex-col h-full">
        {/* icon */}
        <div className="w-14 h-14 rounded-2xl mb-6 bg-gray-300 dark:bg-gray-700" />

        {/* title */}
        <div className="h-6 w-40 rounded bg-gray-300 dark:bg-gray-700 mb-4" />

        {/* description */}
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* button */}
        <div className="mt-6 h-10 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
