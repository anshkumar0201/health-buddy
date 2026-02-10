import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useMemo } from "react";

const tabs = [
  { label: "home", path: "/", icon: "home", color: "text-blue-500" },
  {
    label: "analyze",
    path: "/symptom-analyzer",
    icon: "monitor_heart",
    color: "text-emerald-500",
  },
  {
    label: "check",
    path: "/symptom-checker",
    icon: "stethoscope",
    color: "text-purple-500",
  },
  {
    label: "diseases",
    path: "/diseases",
    icon: "menu_book",
    color: "text-orange-500",
  },
  {
    label: "prevent",
    path: "/prevention",
    icon: "shield",
    color: "text-teal-500",
  },
  {
    label: "clinics",
    path: "/clinics",
    icon: "location_on",
    color: "text-pink-500",
  },
  {
    label: "emergency",
    path: "/emergency",
    icon: "emergency",
    color: "text-red-500",
  },
];

export default function MobileTabBar() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const memoTabs = useMemo(() => tabs, []);

  return (
    <div
      className="sm:hidden fixed inset-x-0 z-[1000] flex justify-center"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 4px)" }}
    >
      <div
        className={`
    flex justify-around items-center
    h-16 w-[calc(100%-16px)]
    max-w-[520px]
    mx-auto
    rounded-3xl
    border
    ${
      isDark
        ? `
          bg-[#161a22]
          border-white/10
          shadow-[0_6px_24px_rgba(0,0,0,0.9)]
          ring-1 ring-white/5
        `
        : `
          bg-white
          border-black/10
          shadow-[0_6px_24px_rgba(0,0,0,0.25)]
          ring-1 ring-black/5
        `
    }
  `}
      >
        {memoTabs.map((tab) => {
          const active =
            tab.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex items-center justify-center w-14 h-14"
            >
              <span
                className={`
                  material-symbols-rounded text-2xl
                  transition-all duration-150 ease-out
    will-change-transform
                  ${
                    active
                      ? `${tab.color} scale-150`
                      : isDark
                        ? "text-white/70"
                        : "text-gray-700"
                  }
                `}
              >
                {tab.icon}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
