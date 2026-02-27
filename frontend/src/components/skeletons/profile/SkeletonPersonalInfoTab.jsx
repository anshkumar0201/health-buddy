import { useTheme } from "../../../context/ThemeContext";

export default function SkeletonPersonalInfoTab() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const field = "h-10 rounded-xl bg-gray-200 dark:bg-gray-700";
  const label = "h-4 w-28 rounded bg-gray-200 dark:bg-gray-700";

  return (
    <div className="animate-pulse">
      {/* Header */}{" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />{" "}
        <div className="h-9 w-32 rounded-xl bg-gray-200 dark:bg-gray-700" />{" "}
      </div>
      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>

        {/* Age + Gender */}
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

        {/* Height + Weight */}
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

        {/* Blood Group */}
        <div className="space-y-2">
          <div className={label} />
          <div className={field} />
        </div>
      </div>
    </div>
  );
}
