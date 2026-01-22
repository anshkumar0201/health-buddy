import {Link, useLocation} from "react-router-dom";
import {useTheme} from "../context/ThemeContext";

const tabs = [
    {label: "home", path: "/", icon: "home", color: "text-blue-500"},
    {label: "analyze", path: "/symptom-analyzer", icon: "monitor_heart", color: "text-emerald-500"},
    {label: "check", path: "/symptom-checker", icon: "stethoscope", color: "text-purple-500"},
    {label: "diseases", path: "/diseases", icon: "menu_book", color: "text-orange-500"},
    {label: "prevent", path: "/prevention", icon: "shield", color: "text-teal-500"},
    {label: "clinics", path: "/clinics", icon: "location_on", color: "text-pink-500"},
    {label: "emergency", path: "/emergency", icon: "emergency", color: "text-red-500"},
];

export default function MobileTabBar() {
    const location = useLocation();
    const {theme} = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className="sm:hidden fixed z-[1000] flex justify-center"
            style={{
                left: "env(safe-area-inset-left)",
                right: "env(safe-area-inset-right)",
                bottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
        >
            <div
                className={`
          flex justify-around items-center
          h-16 w-full max-w-[520px] mx-2
          rounded-4xl
          backdrop-blur-lg
          border
          transition-all duration-300
          ${
                    isDark
                        ? "bg-[#1e1f20]/50 border-gray-400/25 shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
                        : "bg-white/35 border-white/60 shadow-[0_8px_25px_rgba(0.7,0.7,0.7,0.7)]"
                }
        `}
            >
                {tabs.map((tab) => {
                    const path = location.pathname;

                    const active =
                        tab.path === "/symptom-checker"
                            ? path.startsWith("/symptom-checker") || path.startsWith("/assessment")
                            : tab.path === "/diseases"
                                ? path.startsWith("/diseases")
                                : tab.path === "/emergency"
                                    ? path.startsWith("/emergency")
                                    : tab.path === "/"
                                        ? path === "/"
                                        : path.startsWith(tab.path);


                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className="relative flex flex-col items-center justify-center w-12 h-14"
                        >
                            {/* Active glass bubble */}
                            {active && (
                                <div
                                    className={`
            absolute top-0.5 left-0.5 right-0.5 bottom-1
            rounded-full
            backdrop-blur-2xl
            ${
                                        isDark
                                            ? "bg-white/15"
                                            : "bg-black/10"
                                    }
            transition-all duration-300
          `}
                                />
                            )}

                            <span
                                className={`
          material-symbols-rounded text-2xl z-10
          transition-all duration-300
          ${tab.color}
          ${
                                    active
                                        ? "scale-125 drop-shadow-[0_0_12px_currentColor]"
                                        : "opacity-70"
                                }
        `}
                            >
        {tab.icon}
      </span>

                            {/* Active dot */}
                            {active && (
                                <div className="w-1.5 h-1.5 mt-0.5 bg-blue-500 rounded-full z-10"/>
                            )}
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}
