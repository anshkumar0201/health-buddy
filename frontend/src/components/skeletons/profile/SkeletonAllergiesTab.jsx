import { useTheme } from "../../../context/ThemeContext";

export default function SkeletonAllergiesTab() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const field = "h-10 rounded-xl bg-gray-200 dark:bg-gray-700";
  const label = "h-4 w-40 rounded bg-gray-200 dark:bg-gray-700";

  return (
    <div className="animate-pulse">
      {/* Header */}{" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />{" "}
        <div className="h-9 w-32 rounded-xl bg-gray-200 dark:bg-gray-700" />{" "}
      </div>
      {/* Fields */}
      <div className="space-y-4">
        {/* Food */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>

        {/* Medicines */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>

        {/* Others */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>
      </div>
    </div>
  );
}
