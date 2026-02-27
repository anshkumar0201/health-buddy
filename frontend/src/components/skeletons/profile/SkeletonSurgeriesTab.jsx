import { useTheme } from "../../../context/ThemeContext";

export default function SkeletonSurgeriesTab() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const field = "h-10 rounded-xl bg-gray-200 dark:bg-gray-700";
  const label = "h-4 w-32 rounded bg-gray-200 dark:bg-gray-700";

  return (
    <div className="animate-pulse">
      {/* Header */}{" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />{" "}
        <div className="h-9 w-32 rounded-xl bg-gray-200 dark:bg-gray-700" />{" "}
      </div>
      {/* Surgery Cards */}
      <div className="space-y-5">
        {[1, 2].map((item) => (
          <div
            key={item}
            className={`border rounded-2xl p-5 space-y-4 ${
              isDark
                ? "border-[#282A2C] bg-[#131314]/50"
                : "border-slate-200 bg-slate-50/50"
            }`}
          >
            {/* Surgery Name */}
            <div className="space-y-2">
              <div className={label} />
              <div className={field} />
            </div>

            {/* Year + Hospital */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
