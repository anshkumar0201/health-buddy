import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function MobileTabBar() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pathname = location.pathname;

  return (
    <div
      className="sm:hidden fixed inset-x-0 z-[1000] flex justify-center will-change-transform"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 6px)" }}
    >
      <div
        className={`
          flex items-center gap-1
          h-16 px-1
          w-[calc(100%-16px)]
          max-w-[520px]
          rounded-full
          border backdrop-blur-md
          transform-gpu will-change-transform
          ${
            isDark
              ? "bg-[#161a22]/90 border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.8)]"
              : "bg-white/90 border-black/10 shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
          }
        `}
      >
        {tabs.map((tab) => {
          const active =
            tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex items-center justify-center w-12 h-12 rounded-full"
            >
              {/* Blossom background */}
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key="active-bg"
                    initial={{ scale: 0.25, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.25, opacity: 0 }}
                    transition={{
                      duration: 0.18,
                      ease: [0.2, 0.9, 0.2, 1],
                    }}
                    className={`
                      absolute inset-x-[1px] inset-y-[2px] rounded-full
                      ${isDark ? "bg-white/18" : "bg-black/10"}
                    `}
                    style={{
                      transformOrigin: "center",
                      willChange: "transform, opacity",
                    }}
                  />
                )}
              </AnimatePresence>
              {/* Icon */}
              <span
                className={`
                  relative z-10 material-symbols-rounded text-xl transform-gpu
                  transition-colors duration-150
                  ${
                    active
                      ? tab.color
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
export default React.memo(MobileTabBar);
