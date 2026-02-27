import { useTheme } from "../../../context/ThemeContext";

export default function SkeletonVitalsTab() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const field = "h-10 rounded-xl bg-gray-200 dark:bg-gray-700";
  const label = "h-4 w-36 rounded bg-gray-200 dark:bg-gray-700";

  return (
    <div className="animate-pulse">
      {/* Header */}{" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-700" />{" "}
        <div className="h-9 w-32 rounded-xl bg-gray-200 dark:bg-gray-700" />{" "}
      </div>
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className={label} />
            <div className={field} />
          </div>

          <div className="space-y-2">
            <div className={label} />
            <div className={field} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className={label} />
            <div className={field} />
          </div>

          <div className="space-y-2">
            <div className={label} />
            <div className={field} />
          </div>
        </div>

        {/* Date Field */}
        <div className="pt-2 space-y-2">
          <div className={label} />
          <div className={field} />
          <div className="h-3 w-64 rounded bg-gray-200 dark:bg-gray-700 mt-1" />
        </div>
      </div>
    </div>
  );
}
