import { useTheme } from "@/context/ThemeContext";

export default function SkeletonSignup() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`         min-h-screen pt-24 pb-32 px-4 flex justify-center animate-pulse
        ${isDark ? "bg-[#0f172a]" : "bg-slate-50"}
      `}
    >
      <div
        className={`           w-full max-w-md rounded-2xl p-8 border shadow-xl
          ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}
        `}
      >
        {/* Title */}{" "}
        <div className="h-7 w-1/2 mx-auto rounded bg-gray-200 dark:bg-gray-700 mb-3" />
        {/* Subtitle */}
        <div className="h-4 w-2/3 mx-auto rounded bg-gray-200 dark:bg-gray-700 mb-8" />
        {/* Name */}
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mb-4" />
        {/* Email */}
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mb-4" />
        {/* Password */}
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mb-4" />
        {/* Signup Button */}
        <div className="h-10 w-full rounded-lg bg-gray-300 dark:bg-gray-600 mb-6" />
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <div className="mx-3 h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </div>
        {/* Google Button */}
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mb-6" />
        {/* Footer text */}
        <div className="h-4 w-1/2 mx-auto rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
